/**
 * Music Player Component Types
 * 
 * This file defines the TypeScript interfaces and types for the music player component.
 * Uses the player store for state management.
 */

import type { PlayerDisplayMode, PlayerState, PlayMode, Track } from '@/stores/modules/player/types'
 

export interface MusicPlayerProps {
  /**
   * Track object for audio playback
   */
  track?: Track
  
  /**
   * Whether to auto-play the audio
   * @default false
   */
  autoplay?: boolean
  
  /**
   * Whether to show controls
   * @default true
   */
  controls?: boolean
  
  /**
   * Whether to loop playback
   * @default false
   */
  loop?: boolean
  
  /**
   * Initial volume (0.0 to 1.0)
   * @default 0.7
   */
  volume?: number
  
  /**
   * Playback rate (0.5 to 4.0)
   * @default 1.0
   */
  playbackRate?: number
  
  /**
   * Component width
   * @default '100%'
   */
  width?: string
  
  /**
   * Component height
   * @default '120px'
   */
  height?: string
  
  /**
   * Theme color for the player
   * @default '#3b82f6'
   */
  themeColor?: string
  
  /**
   * Whether to show waveform visualization
   * @default true
   */
  showWaveform?: boolean
  
  /**
   * Whether to show progress bar
   * @default true
   */
  showProgress?: boolean
  
  /**
   * Waveform display type ('bar', 'line', 'circle')
   * @default 'bar'
   */
  waveType?: 'bar' | 'line' | 'circle'
  
  /**
   * Whether to show lyrics
   * @default false
   */
  showLyrics?: boolean
  
  /**
   * Custom CSS class for the player container
   */
  class?: string
  
  /**
   * Player interface mode
   * @default PlayerMode.CARD
   */
  mode?: PlayerDisplayMode
  
  /**
   * Playlist array for multi-track playback
   */
  playlist?: Track[]
  
  /**
   * Whether to enable close button in fullscreen mode
   * @default false
   */
  enableCloseFullscreen?: boolean
}

export interface MusicPlayerEmits {
  /**
   * Emitted when audio starts playing
   */
  (e: 'play'): void
  
  /**
   * Emitted when audio is paused
   */
  (e: 'pause'): void
  
  /**
   * Emitted when audio stops
   */
  (e: 'stop'): void
  
  /**
   * Emitted when audio ends
   */
  (e: 'ended'): void
  
  /**
   * Emitted when audio time updates
   */
  (e: 'timeupdate', currentTime: number, duration: number): void
  
  /**
   * Emitted when audio progress updates (for progress bar)
   */
  (e: 'progress', currentTime: number, duration: number): void
  
  /**
   * Emitted when volume changes
   */
  (e: 'volumechange', volume: number): void
  
  /**
   * Emitted when playback rate changes
   */
  (e: 'ratechange', rate: number): void
  
  /**
   * Emitted when audio loading progress updates
   */
  (e: 'progress', loaded: number, total: number): void
  
  /**
   * Emitted when audio metadata is loaded
   */
  (e: 'loadedmetadata', duration: number): void
  
  /**
   * Emitted when an error occurs
   */
  (e: 'error', error: Error): void
  
  /**
   * Emitted when player mode changes
   */
  (e: 'mode-change', mode: PlayerDisplayMode): void
  
  /**
   * Emitted when previous track is requested
   */
  (e: 'previous'): void
  
  /**
   * Emitted when next track is requested
   */
  (e: 'next'): void
  
  /**
   * Emitted when loop state changes
   */
  (e: 'loop', loop: boolean): void
  
  /**
   * Emitted when seeking starts
   */
  (e: 'seeking-start'): void
  
  /**
   * Emitted when seeking ends
   */
  (e: 'seeking-end'): void
  
  /**
   * Emitted when play mode changes
   */
  (e: 'play-mode-change', mode: string): void
  
  /**
   * Emitted when popup is shown
   */
  (e: 'show-popup'): void
  
  /**
   * Emitted when more actions are requested
   */
  (e: 'more-actions'): void
  
  /**
   * Emitted when playlist is requested
   */
  (e: 'playlist'): void
  
  /**
   * Emitted when shuffle is requested
   */
  (e: 'shuffle'): void
  
  /**
   * Emitted when settings are requested
   */
  (e: 'settings'): void
  
  /**
   * Emitted when seeking to specific time
   */
  (e: 'seek', time: number): void
  
  /**
   * Emitted when seeking in progress
   */
  (e: 'seeking', time: number): void
  
  /**
   * Emitted when close player is requested
   */
  (e: 'close-player'): void
  
  /**
   * Emitted when like is requested
   */
  (e: 'like'): void
  
  /**
   * Emitted when share is requested
   */
  (e: 'share'): void
}

export interface AudioMetadata {
  title: string
  artist: string
  album: string
  cover: string
  duration: number
  bitrate: number
  format: string
}

/**
 * Player controls interface
 */
export interface PlayerControls {
  /** Toggle play/pause */
  togglePlay: () => Promise<void>
  /** Previous track */
  prev: () => void
  /** Next track */
  next: () => void
  /** Seek to specific time */
  seek: (time: number) => void
  /** Toggle play mode */
  togglePlayMode: () => void
}

/**
 * Player slots interface
 */
export interface PlayerSlots {
  /** Cover slot */
  cover?: (props: { cover: string, title: string, artist: string }) => any
  /** Controls slot */
  controls?: (props: { 
    playbackState: PlayerState, 
    playerControls: PlayerControls,
    playMode: PlayMode
  }) => any
  /** Progress bar slot */
  progress?: (props: { 
    currentTime: number, 
    duration: number, 
    progressPercentage: number,
    seek: (time: number) => void 
  }) => any
  /** Additional controls slot */
  additionalControls?: (props: { 
    playbackState: PlayerState, 
    playerControls: PlayerControls,
    playMode: PlayMode
  }) => any
}