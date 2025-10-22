/**
 * Audio Player Module
 * 
 * This module provides a comprehensive audio playback solution supporting:
 * - File playback from URLs and local files
 * - Blob object playback
 * - Real-time streaming audio data playback
 * - Complete event system for playback control
 * - Multiple audio format support
 * 
 * Key Features:
 * - Unified interface for different audio sources
 * - Real-time streaming with buffer management
 * - Event-driven architecture for state monitoring
 * - Error handling and recovery mechanisms
 * - Resource lifecycle management
 * 
 * Usage Examples:
 * ```typescript
 * // File playback
 * const player = new AudioPlayer();
 * await player.playFile('audio/sample.wav');
 * 
 * // Blob playback
 * const blob = await fetchAudioBlob();
 * await player.playBlob(blob);
 * 
 * // Streaming playback
 * await player.startStream();
 * player.appendStreamData(audioData);
 * await player.stopStream();
 * ```
 */

import { AudioPlayerEvents, AudioPlayerOptions, AudioPlayerState, IAudioPlayer } from "../types";


/**
 * Main audio player class providing unified playback interface
 */
export class AudioPlayer implements IAudioPlayer{
  private audioContext: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private bufferSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private streamBuffer: AudioBuffer | null = null;
  private streamPosition: number = 0;
  private isStreaming: boolean = false;
  private streamQueue: Float32Array[] = [];
  private playbackStartTime: number = 0;
  private lastUpdateTime: number = 0;

  private state: AudioPlayerState = AudioPlayerState.IDLE;
  private volume: number = 1.0;
  private currentTime: number = 0;
  private duration: number = 0;
  private isLooping: boolean = false;

  private events: AudioPlayerEvents = {};
  private updateInterval: number | null = null;

  /**
   * Creates a new AudioPlayer instance
   * 
   * @param options - Audio player configuration
   */
  constructor(options: AudioPlayerOptions = {}) {
    this.volume = options.volume ?? 1.0;
    this.isLooping = options.loop ?? false;
    this.events = options.events ?? {};

    // Initialize audio context for streaming
    this.initializeAudioContext();
  }

  /**
   * Initializes Web Audio API context for streaming playback
   */
  private initializeAudioContext(): void {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = this.volume;
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Plays audio from a file URL
   * 
   * @param url - Audio file URL
   * @returns Promise that resolves when playback starts
   */
  async playFile(url: string): Promise<void> {
    this.setState(AudioPlayerState.LOADING);
    
    try {
      // Create audio element for file playback
      this.audioElement = new Audio();
      this.setupAudioElementEvents(this.audioElement);

      // Load and play the audio file
      this.audioElement.src = url;
      this.audioElement.volume = this.volume;
      
      // Wait for metadata to load to get duration
      await new Promise<void>((resolve, reject) => {
        this.audioElement!.addEventListener('loadedmetadata', () => {
          this.duration = this.audioElement!.duration;
          resolve();
        });
        this.audioElement!.addEventListener('error', () => {
          reject(new Error('Failed to load audio metadata'));
        });
      });
      
      await this.audioElement.play();
      this.setState(AudioPlayerState.PLAYING);
      
    } catch (error) {
      this.setState(AudioPlayerState.ERROR);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Plays audio from a Blob object
   * 
   * @param blob - Audio blob data
   * @returns Promise that resolves when playback starts
   */
  async playBlob(blob: Blob): Promise<void> {
    this.setState(AudioPlayerState.LOADING);
    
    try {
      // Create object URL from blob
      const objectUrl = URL.createObjectURL(blob);
      
      // Create audio element for blob playback
      this.audioElement = new Audio();
      this.setupAudioElementEvents(this.audioElement);

      // Load and play the blob
      this.audioElement.src = objectUrl;
      this.audioElement.volume = this.volume;
      
      // Wait for metadata to load to get duration
      await new Promise<void>((resolve, reject) => {
        this.audioElement!.addEventListener('loadedmetadata', () => {
          this.duration = this.audioElement!.duration;
          resolve();
        });
        this.audioElement!.addEventListener('error', () => {
          reject(new Error('Failed to load audio metadata'));
        });
      });
      
      await this.audioElement.play();
      this.setState(AudioPlayerState.PLAYING);
      
      // Clean up object URL after playback
      this.audioElement.addEventListener('ended', () => {
        URL.revokeObjectURL(objectUrl);
      });
      
    } catch (error) {
      this.setState(AudioPlayerState.ERROR);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Starts real-time audio streaming playback
   * 
   * @param sampleRate - Audio sample rate (default: 16000)
   * @param channels - Number of audio channels (default: 1)
   * @returns Promise that resolves when streaming starts
   */
  async startStream(sampleRate: number = 16000, channels: number = 1): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Web Audio API not supported');
    }

    if (this.isStreaming) {
      throw new Error('Streaming already in progress');
    }

    this.setState(AudioPlayerState.LOADING);

    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create audio buffer for streaming
      this.streamBuffer = this.audioContext.createBuffer(
        channels,
        0, // Initial length 0, will grow dynamically
        sampleRate
      );

      this.isStreaming = true;
      this.streamPosition = 0;
      this.streamQueue = [];
      this.playbackStartTime = this.audioContext.currentTime;

      this.setState(AudioPlayerState.PLAYING);
      this.startTimeUpdates();

    } catch (error) {
      this.setState(AudioPlayerState.ERROR);
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Appends audio data to the streaming buffer
   * 
   * @param data - Audio data in various formats
   */
  appendStreamData(data: Float32Array | Int16Array | ArrayBuffer): void {
    if (!this.isStreaming || !this.streamBuffer) {
      throw new Error('Streaming not started');
    }

    try {
      let floatData: Float32Array;

      // Convert different data formats to Float32Array
      if (data instanceof Float32Array) {
        floatData = data;
      } else if (data instanceof Int16Array) {
        // Convert 16-bit PCM to 32-bit float
        floatData = new Float32Array(data.length);
        for (let i = 0; i < data.length; i++) {
          floatData[i] = data[i] / 32768.0; // Normalize to [-1, 1]
        }
      } else if (data instanceof ArrayBuffer) {
        // Assume 16-bit PCM data
        const int16Data = new Int16Array(data);
        floatData = new Float32Array(int16Data.length);
        for (let i = 0; i < int16Data.length; i++) {
          floatData[i] = int16Data[i] / 32768.0;
        }
      } else {
        throw new Error('Unsupported audio data format');
      }

      // Queue the data for processing
      this.streamQueue.push(floatData);

      // Process queue if not too large
      this.processStreamQueue();

    } catch (error) {
      this.events.onError?.(error as Error);
    }
  }

  /**
   * Processes the streaming data queue
   */
  private processStreamQueue(): void {
    if (!this.audioContext || !this.streamBuffer || this.streamQueue.length === 0) {
      return;
    }

    try {
      // Get all queued data
      const queuedData = this.streamQueue.flat();
      this.streamQueue = [];

      // Create new buffer with extended length
      const newLength = this.streamBuffer.length + queuedData.length;
      const newBuffer = this.audioContext.createBuffer(
        this.streamBuffer.numberOfChannels,
        newLength,
        this.streamBuffer.sampleRate
      );

      // Copy existing data to new buffer
      for (let channel = 0; channel < this.streamBuffer.numberOfChannels; channel++) {
        const oldChannelData = this.streamBuffer.getChannelData(channel);
        const newChannelData = newBuffer.getChannelData(channel);
        newChannelData.set(oldChannelData, 0);
        
        // Append new data (mono data to all channels)
        // Convert Float32Array[] to single Float32Array
        const combinedData = new Float32Array(queuedData.reduce((total, arr) => total + arr.length, 0));
        let offset = 0;
        for (const arr of queuedData) {
          combinedData.set(arr, offset);
          offset += arr.length;
        }
        newChannelData.set(combinedData, this.streamBuffer.length);
      }

      this.streamBuffer = newBuffer;

      // Start playback if not already playing
      if (!this.bufferSource) {
        this.startBufferPlayback();
      }

    } catch (error) {
      this.events.onError?.(error as Error);
    }
  }

  /**
   * Starts playback from the audio buffer
   */
  private startBufferPlayback(): void {
    if (!this.audioContext || !this.streamBuffer || !this.gainNode) {
      return;
    }

    try {
      this.bufferSource = this.audioContext.createBufferSource();
      this.bufferSource.buffer = this.streamBuffer;
      this.bufferSource.connect(this.gainNode);
      this.bufferSource.loop = this.isLooping;

      this.bufferSource.onended = () => {
        this.bufferSource = null;
        if (this.isStreaming) {
          // Continue with any remaining data
          this.processStreamQueue();
        } else {
          this.setState(AudioPlayerState.ENDED);
        }
      };

      this.bufferSource.start(0, this.streamPosition);
      this.playbackStartTime = this.audioContext.currentTime - this.streamPosition;

    } catch (error) {
      this.events.onError?.(error as Error);
    }
  }

  /**
   * Stops real-time audio streaming
   */
  async stopStream(): Promise<void> {
    if (!this.isStreaming) {
      return;
    }

    this.isStreaming = false;

    // Process any remaining data
    this.processStreamQueue();

    // Stop buffer playback
    if (this.bufferSource) {
      this.bufferSource.stop();
      this.bufferSource = null;
    }

    this.setState(AudioPlayerState.IDLE);
    this.stopTimeUpdates();
  }

  /**
   * Pauses current playback
   */
  pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.setState(AudioPlayerState.PAUSED);
    } else if (this.bufferSource) {
      this.streamPosition = this.audioContext!.currentTime - this.playbackStartTime;
      this.bufferSource.stop();
      this.bufferSource = null;
      this.setState(AudioPlayerState.PAUSED);
    }
  }

  /**
   * Resumes paused playback
   */
  async resume(): Promise<void> {
    if (this.audioElement) {
      if (this.state === AudioPlayerState.PAUSED || this.state === AudioPlayerState.IDLE) {
        try {
          await this.audioElement.play();
          this.setState(AudioPlayerState.PLAYING);
        } catch (error) {
          this.setState(AudioPlayerState.ERROR);
          this.events.onError?.(error as Error);
          throw error;
        }
      }
    } else if (this.streamBuffer) {
      if (this.state === AudioPlayerState.PAUSED || this.state === AudioPlayerState.IDLE) {
        this.startBufferPlayback();
        this.setState(AudioPlayerState.PLAYING);
      }
    }
  }

  /**
   * Stops playback and resets to beginning
   */
  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.setState(AudioPlayerState.IDLE);
    } else if (this.bufferSource) {
      this.bufferSource.stop();
      this.bufferSource = null;
      this.setState(AudioPlayerState.IDLE);
    }

    this.streamPosition = 0;
    this.stopTimeUpdates();
  }

  /**
   * Sets the volume level
   * 
   * @param volume - Volume level (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    } else if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
    
    this.events.onVolumeChange?.(this.volume);
  }

  /**
   * Gets the current volume level
   * 
   * @returns Current volume level
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Gets the current playback state
   * 
   * @returns Current player state
   */
  getState(): AudioPlayerState {
    return this.state;
  }

  /**
   * Gets the current playback time
   * 
   * @returns Current time in seconds
   */
  getCurrentTime(): number {
    if (this.audioElement) {
      return this.audioElement.currentTime;
    } else if (this.bufferSource && this.audioContext) {
      return this.audioContext.currentTime - this.playbackStartTime;
    }
    return this.currentTime;
  }

  /**
   * Gets the total duration
   * 
   * @returns Duration in seconds
   */
  getDuration(): number {
    if (this.audioElement) {
      return this.audioElement.duration || 0;
    } else if (this.streamBuffer) {
      return this.streamBuffer.duration;
    }
    return this.duration;
  }

  /**
   * Seeks to a specific time position
   * 
   * @param time - Time position in seconds
   */
  seek(time: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    } else if (this.streamBuffer) {
      this.streamPosition = time;
      if (this.bufferSource) {
        this.bufferSource.stop();
        this.bufferSource = null;
      }
      this.startBufferPlayback();
    }
  }

  /**
   * Sets the playback rate
   * 
   * @param rate - Playback rate (0.5 to 4.0)
   */
  setPlaybackRate(rate: number): void {
    const newRate = Math.max(0.5, Math.min(4.0, rate));
    
    if (this.audioElement) {
      this.audioElement.playbackRate = newRate;
    }
    
    // 对于流式播放，播放速率调整需要重新创建buffer source
    if (this.bufferSource && this.audioContext) {
      this.streamPosition = this.audioContext.currentTime - this.playbackStartTime;
      this.bufferSource.stop();
      this.bufferSource = null;
      this.startBufferPlayback();
    }
  }

  /**
   * Sets up event listeners for audio element
   */
  private setupAudioElementEvents(audioElement: HTMLAudioElement): void {
    audioElement.addEventListener('play', () => {
      this.setState(AudioPlayerState.PLAYING);
      this.startTimeUpdates();
    });

    audioElement.addEventListener('pause', () => {
      this.setState(AudioPlayerState.PAUSED);
      this.stopTimeUpdates();
    });

    audioElement.addEventListener('ended', () => {
      this.setState(AudioPlayerState.ENDED);
      this.stopTimeUpdates();
    });

    audioElement.addEventListener('error', () => {
      this.setState(AudioPlayerState.ERROR);
      this.events.onError?.(new Error('Audio element error'));
      this.stopTimeUpdates();
    });

    audioElement.addEventListener('loadedmetadata', () => {
      this.duration = audioElement.duration;
    });
  }

  /**
   * Starts time update interval for progress tracking
   */
  private startTimeUpdates(): void {
    this.stopTimeUpdates();
    
    this.updateInterval = window.setInterval(() => {
      const currentTime = this.getCurrentTime();
      const duration = this.getDuration();
      
      if (currentTime !== this.lastUpdateTime) {
        this.events.onTimeUpdate?.(currentTime, duration);
        this.events.onProgress?.(currentTime, duration);
        this.lastUpdateTime = currentTime;
      }
    }, 100);
  }

  /**
   * Stops time update interval
   */
  private stopTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Updates player state and triggers events
   */
  private setState(newState: AudioPlayerState): void {
    const oldState = this.state;
    this.state = newState;

    // Trigger state-specific events
    switch (newState) {
      case AudioPlayerState.PLAYING:
        this.events.onPlay?.();
        break;
      case AudioPlayerState.PAUSED:
        this.events.onPause?.();
        break;
      case AudioPlayerState.IDLE:
        this.events.onStop?.();
        break;
      case AudioPlayerState.ENDED:
        this.events.onEnd?.();
        break;
    }
  }

  /**
   * Cleans up resources and stops playback
   */
  destroy(): void {
    this.stop();
    this.stopTimeUpdates();

    if (this.audioElement) {
      this.audioElement.src = '';
      this.audioElement = null;
    }

    if (this.bufferSource) {
      this.bufferSource.stop();
      this.bufferSource = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.streamBuffer = null;
    this.streamQueue = [];
    this.setState(AudioPlayerState.IDLE);
  }

  /**
   * Adds an event listener
   * 
   * @param event - Event name
   * @param callback - Event callback
   */
  on<K extends keyof AudioPlayerEvents>(event: K, callback: AudioPlayerEvents[K]): void {
    this.events[event] = callback;
  }

  /**
   * Removes an event listener
   * 
   * @param event - Event name
   */
  off<K extends keyof AudioPlayerEvents>(event: K): void {
    delete this.events[event];
  }
}

/**
 * Factory function for creating AudioPlayer instances
 * 
 * @param options - Audio player configuration
 * @returns New AudioPlayer instance
 */
export function createAudioPlayer(options: AudioPlayerOptions = {}): AudioPlayer {
  return new AudioPlayer(options);
}

/**
 * Checks if audio playback is supported in the current environment
 * 
 * @returns True if audio playback is supported
 */
export function isAudioPlaybackSupported(): boolean {
  return !!(window.AudioContext || (window as any).webkitAudioContext || window.Audio);
}

/**
 * Gets the list of supported audio formats
 * 
 * @returns Array of supported audio format MIME types
 */
export function getSupportedAudioFormats(): string[] {
  const audio = new Audio();
  const formats = [
    'audio/wav',
    'audio/mp3',
    'audio/mpeg',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/m4a'
  ];

  return formats.filter(format => {
    try {
      return audio.canPlayType(format) !== '';
    } catch {
      return false;
    }
  });
}