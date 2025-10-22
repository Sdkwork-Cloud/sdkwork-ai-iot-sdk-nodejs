import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { VideoPlayerEvents, VideoPlayerOptions, VideoPlayerState, VideoQuality, VideoTrack } from './types'

export class SdkworkVideoPlayer {
  private player: any = null
  private videoElement: HTMLVideoElement | null = null
  private containerElement: HTMLElement | null = null
  private volume: number = 1.0
  private isLooping: boolean = false
  private muted: boolean = false
  private events: VideoPlayerEvents = {}
  private state: VideoPlayerState = VideoPlayerState.IDLE
  private lastUpdateTime: number = 0
  private updateInterval: number | null = null
  private qualities: VideoQuality[] = []
  private tracks: VideoTrack[] = []
  private currentQuality: string = 'auto'
  private eventHandlers: Map<string, (() => void)[]> = new Map()

  constructor(options: VideoPlayerOptions = {}) {
    this.volume = options.volume ?? 1.0
    this.isLooping = options.loop ?? false
    this.muted = options.muted ?? false
    this.events = options.events ?? {}
  }

  /**
   * Initialize video player with a container element
   */
  init(container: HTMLElement, videoElement?: HTMLVideoElement, options?: VideoPlayerOptions): void {
    this.containerElement = container
    this.videoElement = videoElement || document.createElement('video')
    this.videoElement.className = 'video-js vjs-default-skin'
    this.containerElement.appendChild(this.videoElement)

    // Set mobile-specific attributes directly on the video element
    this.videoElement.setAttribute('playsinline', 'true')
    this.videoElement.setAttribute('webkit-playsinline', 'true')
    this.videoElement.setAttribute('x5-playsinline', 'true')
    this.videoElement.setAttribute('x-webkit-airplay', 'allow')

    const playerOptions:any = {
      autoplay: options?.autoplay ?? false,
      controls: options?.controls ?? false,
      loop: options?.loop ?? this.isLooping,
      muted: options?.muted ?? this.muted,
      responsive: options?.responsive ?? true,
      fluid: options?.fluid ?? true,
      preload: options?.preload ?? 'auto',
      playbackRates: options?.playbackRates ?? [0.5, 1, 1.25, 1.5, 2],
      defaultPlaybackRate: options?.defaultPlaybackRate ?? 1.0,
      aspectRatio: options?.aspectRatio,
      poster: options?.poster,
      techOrder: options?.techOrder ?? ['html5'],
      
      // Mode-specific configuration
      mode: options?.mode ?? 'card',
      
      // Mobile-friendly configurations
      playsinline: options?.playsinline ?? true,
      disablePictureInPicture: options?.disablePictureInPicture ?? false,
      preferFullWindow: options?.preferFullWindow ?? false,
      
      // BigPlayButton configuration for center play button
      bigPlayButton: true,
      
      // Control bar configuration optimized for mobile
      controlBar: {
        playToggle: true,
        volumePanel: {
          inline: false,
          vertical: false
        },
        currentTimeDisplay: true,
        timeDivider: true,
        durationDisplay: true,
        progressControl: {
          seekBar: true
        },
        liveDisplay: true,
        remainingTimeDisplay: true,
        customControlSpacer: true,
        playbackRateMenuButton: true,
        fullscreenToggle: true,
        
        // Mobile-specific settings
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'liveDisplay',
          'remainingTimeDisplay',
          'customControlSpacer',
          'playbackRateMenuButton',
          'fullscreenToggle'
        ]
      },
      
      // HTML5 video attributes for mobile
      html5: {
        vhs: {
          overrideNative: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
        nativeTextTracks: false
      },
      
      // Touch device optimizations
      touchControls: true,
      userActions: {
        hotkeys: true,
        doubleClick: true
      }
    } as any

    this.player = videojs(this.videoElement, playerOptions)

    this.setupPlayerEvents()
    this.events.onReady?.()
  }

  /**
   * Setup video.js player event listeners
   */
  private setupPlayerEvents(): void {
    if (!this.player) return

    // Store event handlers for cleanup
    const handlers = [
      ['loadstart', () => this.events.onLoadStart?.()],
      ['durationchange', () => {
        const duration = this.getDuration()
        this.events.onDurationChange?.(duration)
      }],
      ['loadedmetadata', () => this.events.onLoadedMetadata?.()],
      ['loadeddata', () => this.events.onLoadedData?.()],
      ['progress', () => {
        const buffered = this.getBuffered()
        this.events.onProgress?.(buffered)
      }],
      ['canplay', () => this.events.onCanPlay?.()],
      ['canplaythrough', () => this.events.onCanPlayThrough?.()],
      ['play', () => {
        this.setState(VideoPlayerState.PLAYING)
        this.startTimeUpdates()
        this.events.onPlay?.()
      }],
      ['pause', () => {
        this.setState(VideoPlayerState.PAUSED)
        this.stopTimeUpdates()
        this.events.onPause?.()
      }],
      ['seeked', () => {
        const currentTime = this.getCurrentTime()
        this.events.onSeeked?.(currentTime)
      }],
      ['seeking', () => this.events.onSeeking?.()],
      ['timeupdate', () => {
        const currentTime = this.getCurrentTime()
        this.events.onTimeUpdate?.(currentTime)
      }],
      ['ended', () => {
        this.setState(VideoPlayerState.ENDED)
        this.stopTimeUpdates()
        this.events.onEnded?.()
      }],
      ['ratechange', () => {
        const rate = this.player?.playbackRate() || 1.0
        this.events.onRateChange?.(rate)
      }],
      ['volumechange', () => {
        if (this.player) {
          this.volume = this.player.volume()
          this.muted = this.player.muted()
          this.events.onVolumeChange?.(this.volume)
        }
      }],
      ['waiting', () => this.events.onWaiting?.()],
      ['stalled', () => this.events.onStalled?.()],
      ['suspend', () => this.events.onSuspend?.()],
      ['abort', () => this.events.onAbort?.()],
      ['error', () => {
        const error = this.player?.error()
        this.setState(VideoPlayerState.ERROR)
        this.events.onError?.(new Error(`Video playback error: ${error?.message || 'Unknown error'}`))
        this.stopTimeUpdates()
      }],
      ['emptied', () => this.events.onEmptied?.()],
      ['fullscreenchange', () => {
        const isFullscreen = this.player?.isFullscreen() || false
        this.events.onFullscreenChange?.(isFullscreen)
      }]
    ]

    handlers.forEach(([event, handler]) => {
      this.player!.on(event as string, handler as () => void)
      if (!this.eventHandlers.has(event as string)) {
        this.eventHandlers.set(event as string, [])
      }
      this.eventHandlers.get(event as string)!.push(handler as () => void)
    })
  }

  /**
   * Load and play a video file with advanced options
   */
  async playFile(url: string, options?: {
    poster?: string
    type?: string
    qualities?: VideoQuality[]
    tracks?: VideoTrack[]
  }): Promise<void> {
    if (!this.player) throw new Error('Player not initialized')

    this.setState(VideoPlayerState.LOADING)
    
    try {
      // Set video source
      this.player.src({
        src: url,
        type: options?.type || this.detectVideoType(url)
      })

      // Set poster if provided
      if (options?.poster) this.player.poster(options.poster)

      // Store qualities and tracks
      this.qualities = options?.qualities || []
      this.tracks = options?.tracks || []

      // Add text tracks if available
      this.addTextTracks(this.tracks)

      await new Promise<void>((resolve, reject) => {
        const handleLoaded = () => {
          this.player!.off('loadedmetadata', handleLoaded)
          this.player!.off('error', handleError)
          resolve()
        }

        const handleError = () => {
          this.player!.off('loadedmetadata', handleLoaded)
          this.player!.off('error', handleError)
          reject(new Error('Failed to load video metadata'))
        }

        this.player!.on('loadedmetadata', handleLoaded)
        this.player!.on('error', handleError)

        // Timeout after 30 seconds
        setTimeout(() => {
          this.player!.off('loadedmetadata', handleLoaded)
          this.player!.off('error', handleError)
          reject(new Error('Video loading timeout'))
        }, 30000)
      })

      await this.player.play()
      this.setState(VideoPlayerState.PLAYING)
    } catch (error) {
      this.setState(VideoPlayerState.ERROR)
      this.events.onError?.(error as Error)
      throw error
    }
  }

  /**
   * Pause current playback
   */
  pause(): void {
    if (this.player) {
      this.player.pause()
      this.setState(VideoPlayerState.PAUSED)
    }
  }

  /**
   * Resume paused playback
   */
  async resume(): Promise<void> {
    if (!this.player) throw new Error('Player not initialized')
    
    // If already playing, no need to resume
    if (this.state === VideoPlayerState.PLAYING) {
      return
    }
    
    if (this.state === VideoPlayerState.PAUSED || this.state === VideoPlayerState.IDLE || this.state === VideoPlayerState.LOADING) {
      try {
        await this.player.play()
        this.setState(VideoPlayerState.PLAYING)
      } catch (error) {
        this.setState(VideoPlayerState.ERROR)
        this.events.onError?.(error as Error)
        throw error
      }
    } else {
      throw new Error(`Cannot resume from state: ${this.state}`)
    }
  }

  /**
   * Stop playback and reset to start
   */
  stop(): void {
    if (this.player) {
      this.player.pause()
      this.player.currentTime(0)
      this.setState(VideoPlayerState.IDLE)
    }
    this.stopTimeUpdates()
  }

  /**
   * Set volume level (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.player) this.player.volume(this.volume)
    this.events.onVolumeChange?.(this.volume)
  }

  /**
   * Get current volume level
   */
  getVolume(): number {
    return this.volume
  }

  /**
   * Get current playback state
   */
  getState(): VideoPlayerState {
    return this.state
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    return this.player?.currentTime() || 0
  }

  /**
   * Get video duration
   */
  getDuration(): number {
    return this.player?.duration() || 0
  }

  /**
   * Seek to specific time
   */
  seek(time: number): void {
    if (this.player) this.player.currentTime(time)
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: number): void {
    if (this.player) this.player.playbackRate(Math.max(0.5, Math.min(4, rate)))
  }

  /**
   * Enter fullscreen mode
   */
  enterFullscreen(): void {
    if (this.player) this.player.requestFullscreen()
  }

  /**
   * Exit fullscreen mode
   */
  exitFullscreen(): void {
    if (this.player) this.player.exitFullscreen()
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen(): void {
    if (this.player) {
      this.player.isFullscreen() ? this.player.exitFullscreen() : this.player.requestFullscreen()
    }
  }

  /**
   * Add event listener
   */
  on<K extends keyof VideoPlayerEvents>(event: K, callback: VideoPlayerEvents[K]): void {
    this.events[event] = callback
  }

  /**
   * Remove event listener
   */
  off<K extends keyof VideoPlayerEvents>(event: K): void {
    delete this.events[event]
  }

  /**
   * Set video quality
   */
  setQuality(qualityName: string): void {
    if (!this.player) return

    const quality = this.qualities.find(q => q.name === qualityName)
    if (quality) {
      this.player.src({ src: quality.url, type: this.detectVideoType(quality.url) })
      this.currentQuality = qualityName
      this.events.onBuffer?.()
    }
  }

  /**
   * Get available qualities
   */
  getQualities(): VideoQuality[] {
    return [...this.qualities]
  }

  /**
   * Get current quality
   */
  getCurrentQuality(): string {
    return this.currentQuality
  }

  /**
   * Add text tracks to video
   */
  private addTextTracks(tracks: VideoTrack[]): void {
    if (!this.player) return

    tracks.forEach(track => {
      try {
        const textTrack = this.player!.addTextTrack({
          kind: track.kind,
          language: track.srclang,
          label: track.label
        })
        
        if (track.src) {
          // For external subtitle files, we need to add them as source elements
          const trackElement = document.createElement('track')
          trackElement.kind = track.kind
          trackElement.src = track.src
          trackElement.srclang = track.srclang || ''
          trackElement.label = track.label
          trackElement.default = track.default || false
          
          this.videoElement?.appendChild(trackElement)
        }
      } catch (error) {
        console.warn('Failed to add text track:', track.label, error)
      }
    })
  }

  /**
   * Get buffered time ranges
   */
  getBuffered(): any | null {
    return this.player?.buffered() || null
  }

  /**
   * Get seekable time ranges
   */
  getSeekable(): any | null {
    return this.player?.seekable() || null
  }

  /**
   * Get video width
   */
  getVideoWidth(): number {
    return this.player?.videoWidth() || 0
  }

  /**
   * Get video height
   */
  getVideoHeight(): number {
    return this.player?.videoHeight() || 0
  }

  /**
   * Check if video is paused
   */
  isPaused(): boolean {
    return this.player?.paused() || true
  }

  /**
   * Check if video is seeking
   */
  isSeeking(): boolean {
    return this.player?.seeking() || false
  }

  /**
   * Check if video is ended
   */
  isEnded(): boolean {
    return this.player?.ended() || false
  }

  /**
   * Check if video is muted
   */
  isMuted(): boolean {
    return this.player?.muted() || false
  }

  /**
   * Toggle mute
   */
  toggleMute(): void {
    if (this.player) {
      this.player.muted(!this.player.muted())
    }
  }

  /**
   * Get playback rate
   */
  getPlaybackRate(): number {
    return this.player?.playbackRate() || 1.0
  }

  /**
   * Detect video type from URL
   */
  private detectVideoType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'mp4': return 'video/mp4'
      case 'webm': return 'video/webm'
      case 'ogg': return 'video/ogg'
      case 'mov': return 'video/quicktime'
      case 'avi': return 'video/x-msvideo'
      case 'wmv': return 'video/x-ms-wmv'
      case 'flv': return 'video/x-flv'
      case 'm3u8': return 'application/x-mpegURL'
      case 'mpd': return 'application/dash+xml'
      default: return 'video/mp4'
    }
  }

  /**
   * Get player instance for advanced operations
   */
  getPlayerInstance(): any {
    return this.player
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop()
    this.stopTimeUpdates()

    // Clean up event handlers
    if (this.player) {
      this.eventHandlers.forEach((handlers, event) => {
        handlers.forEach(handler => {
          this.player!.off(event, handler)
        })
      })
      this.eventHandlers.clear()
      
      this.player.dispose()
      this.player = null
    }

    if (this.videoElement && this.containerElement) {
      // Remove all track elements
      const trackElements = this.videoElement.querySelectorAll('track')
      trackElements.forEach(track => track.remove())
      
      this.containerElement.removeChild(this.videoElement)
      this.videoElement = null
    }

    this.qualities = []
    this.tracks = []
    this.currentQuality = 'auto'
    this.setState(VideoPlayerState.IDLE)
  }

  /**
   * Start time updates for progress tracking
   */
  private startTimeUpdates(): void {
    this.stopTimeUpdates()
    
    // Use video.js timeupdate event for better performance
    if (this.player) {
      this.player.on('timeupdate', () => {
        const currentTime = this.getCurrentTime()
        const duration = this.getDuration()
        
        if (currentTime !== this.lastUpdateTime) {
          this.events.onTimeUpdate?.(currentTime)
          this.events.onProgress?.(currentTime)
          this.lastUpdateTime = currentTime
        }
      })
    } else {
      // Fallback to interval for non-video.js players
      this.updateInterval = window.setInterval(() => {
        const currentTime = this.getCurrentTime()
        const duration = this.getDuration()
        
        if (currentTime !== this.lastUpdateTime) {
          this.events.onTimeUpdate?.(currentTime)
          this.events.onProgress?.(currentTime)
          this.lastUpdateTime = currentTime
        }
      }, 250) // Reduced frequency for better performance
    }
  }

  /**
   * Stop time updates
   */
  private stopTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    
    // Remove video.js timeupdate event listener
    if (this.player) {
      this.player.off('timeupdate')
    }
  }

  /**
   * Update player state and trigger events
   */
  private setState(newState: VideoPlayerState): void {
    const oldState = this.state
    this.state = newState

    switch (newState) {
      case VideoPlayerState.PLAYING:
        this.events.onPlay?.()
        break
      case VideoPlayerState.PAUSED:
        this.events.onPause?.()
        break
      case VideoPlayerState.IDLE:
        this.events.onStop?.()
        break
      case VideoPlayerState.ENDED:
        this.events.onEnded?.()
        break
      case VideoPlayerState.LOADING:
        // No specific loading event in VideoPlayerEvents
        break
    }
  }
}