export enum VideoPlayerState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended',
  ERROR = 'error'
}

export interface VideoPlayerEvents {
  // Standard HTML5 video events
  onLoadStart?: () => void
  onDurationChange?: (duration: number) => void
  onLoadedMetadata?: () => void
  onLoadedData?: () => void
  onProgress?: (buffered: number) => void
  onCanPlay?: () => void
  onCanPlayThrough?: () => void
  onPlay?: () => void
  onPause?: () => void
  onSeeked?: (time: number) => void
  onSeeking?: () => void
  onTimeUpdate?: (time: number) => void
  onEnded?: () => void
  onRateChange?: (rate: number) => void
  onVolumeChange?: (volume: number) => void
  onWaiting?: () => void
  onStalled?: () => void
  onSuspend?: () => void
  onAbort?: () => void
  onError?: (error: Error) => void
  onEmptied?: () => void
  
  // Custom video player events
  onReady?: () => void
  onFullscreenChange?: (isFullscreen: boolean) => void
  onQualityChange?: (quality: string) => void
  onTrackChange?: (track: string) => void
  onBuffer?: () => void
  onStop?: () => void
}

export interface VideoPlayerOptions {
  volume?: number
  loop?: boolean
  muted?: boolean
  autoplay?: boolean
  controls?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  playbackRates?: number[]
  defaultPlaybackRate?: number
  fluid?: boolean
  responsive?: boolean
  aspectRatio?: string
  poster?: string
  techOrder?: string[]
  events?: VideoPlayerEvents
  
  // Mobile-friendly options
  playsinline?: boolean
  disablePictureInPicture?: boolean
  preferFullWindow?: boolean
  touchControls?: boolean
  mode?: any
}

export interface VideoQuality {
  name: string
  url: string
  width?: number
  height?: number
  bitrate?: number
}

export interface VideoTrack {
  src: string
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata'
  srclang?: string
  label: string
  default?: boolean
}