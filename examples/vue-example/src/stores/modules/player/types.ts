/**
 * 播放器状态类型定义
 */

// 播放状态枚举
export enum PlayerState {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error'
}

// 播放模式枚举
export enum PlayMode {
  SEQUENTIAL = 'sequential',
  RANDOM = 'random',
  LOOP = 'loop',
  SHUFFLE = 'shuffle',
  SINGLE = 'single'
}

// 播放器模式枚举
export enum PlayerDisplayMode {
  CARD = 'card',
  BOTTOM_BAR = 'bottom-bar',
  FULLSCREEN = 'fullscreen'
}

// Track接口 - 用于播放控制逻辑
// MusicVO用于展示逻辑，Track用于控制逻辑
export interface Track {
  // 基础标识信息
  id: string | number
  uuid: string
  
  // 播放控制必需信息
  title: string
  artist: string
  duration: number
  
  // 音频资源信息
  src: string // 音频文件URL，对应MusicVO的contentUrl
  cover?: string // 封面图片URL，对应MusicVO的thumbnailUrl
  
  // 播放状态相关
  isPlaying?: boolean
  isLoaded?: boolean
  isError?: boolean
  errorMessage?: string
  
  // 播放进度
  currentTime?: number
  buffered?: number
  
  // 元数据信息（可选）
  genre?: string
  fileSize?: string | number
  format?: string
  bitrate?: number
  album?: string
  quality?: string
  
  // 时间戳
  createdAt?: string
  updatedAt?: string
  
  // 原始MusicVO数据（用于展示逻辑）
  musicVO?: MusicVO
}

// Track转换工具函数
export function musicVOToTrack(musicVO: MusicVO): Track {
  // 获取音频URL：优先使用contentUrl，其次从resourceList中获取
  const audioUrl = musicVO.contentUrl || 
                   musicVO.resource?.url ||
                   musicVO.resourceList?.musics?.[0]?.url ||  
                   musicVO.resourceList?.audios?.[0]?.url || 
                   
                   ''
  
  // 获取封面URL：优先使用thumbnailUrl，其次从coverImages中获取
  const coverUrl = musicVO.thumbnailUrl || 
                   musicVO.coverImages?.images?.[0]?.url || 
                   ''
  
  return {
    id: musicVO.id || '',
    uuid: musicVO.uuid || '',
    title: musicVO.title || '',
    artist: musicVO.artist || '',
    duration: musicVO.duration || 0,
    src: audioUrl,
    cover: coverUrl,
    genre: musicVO.genre,
    fileSize: musicVO.fileSize,
    format: musicVO.format,
    bitrate: musicVO.bitrate,
    createdAt: musicVO.createdAt,
    updatedAt: musicVO.updatedAt,
    musicVO: musicVO
  }
}

export function trackToMusicVO(track: Track): MusicVO {
  return track.musicVO || {
    id: track.id,
    uuid: track.uuid,
    title: track.title,
    artist: track.artist,
    duration: track.duration,
    contentUrl: track.src,
    thumbnailUrl: track.cover,
    genre: track.genre,
    fileSize: track.fileSize,
    format: track.format,
    bitrate: track.bitrate,
    createdAt: track.createdAt,
    updatedAt: track.updatedAt
  } as MusicVO
}

// 播放状态接口
export interface PlaybackState {
  // 播放状态
  state: PlayerState
  isPlaying: boolean
  isPaused: boolean
  isStopped: boolean
  isLoading: boolean
  
  // 播放进度
  currentTime: number
  duration: number
  buffered: number
  progress: number // 0-100 百分比
  
  // 音频设置
  volume: number
  playbackRate: number
  isMuted: boolean
  
  // 播放信息
  currentTrack: Track | null
  currentTrackIndex: number
  playMode: PlayMode
  displayMode: PlayerDisplayMode
  originalDisplayMode?: PlayerDisplayMode
}

// 播放列表接口
export interface Playlist {
  tracks: Track[]
  currentIndex: number
  hasPrevious: boolean
  hasNext: boolean
  isShuffled: boolean
}

// 播放器配置接口
export interface PlayerConfig {
  autoplay: boolean
  loop: boolean
  showWaveform: boolean
  showLyrics: boolean
  themeColor: string
  defaultVolume: number
  defaultPlaybackRate: number
}

// 播放器事件接口
export interface PlayerEvents {
  onPlay?: () => void
  onPause?: () => void
  onStop?: () => void
  onEnd?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onProgress?: (currentTime: number, duration: number) => void
  onVolumeChange?: (volume: number) => void
  onError?: (error: Error) => void
  onTrackChange?: (track: Track, index: number) => void
  onPlayModeChange?: (mode: PlayMode) => void
  onDisplayModeChange?: (mode: PlayerDisplayMode) => void
}

// Store状态接口
export interface PlayerStoreState {
  // 播放状态
  playbackState: PlaybackState
  
  // 播放列表
  playlist: Playlist
  
  // 配置
  config: PlayerConfig
  
  // 错误信息
  error: string | null
  
  // 是否全屏
  isFullscreen: boolean
  
  // 是否显示播放列表弹窗
  showPlaylistPopup: boolean
}

// Store Actions接口
export interface PlayerStoreActions {
  // 初始化音频播放器
  initializeAudioPlayer(): Promise<void>
  
  // 播放控制
  play(): Promise<void>
  pause(): Promise<void>
  stop(): Promise<void>
  togglePlay(): Promise<void>
  
  // 播放列表控制
  setPlaylist(tracks: Track[], startIndex?: number): void
  addTrack(track: Track): void
  removeTrack(index: number): void
  clearPlaylist(): void
  
  // 曲目导航
  next(): void
  previous(): void
  playTrack(index: number): void
  
  // 播放模式控制
  setPlayMode(mode: PlayMode): void
  togglePlayMode(): void
  
  // 显示模式控制
  setDisplayMode(mode: PlayerDisplayMode): void
  toggleFullscreen(): void
  
  // 音频设置
  setVolume(volume: number): void
  setPlaybackRate(rate: number): void
  toggleMute(): void
  
  // 进度控制
  seek(time: number): void
  seekToPercentage(percentage: number): void
  
  // 错误处理
  setError(error: string | null): void
  clearError(): void
  
  // UI控制
  setShowPlaylistPopup(show: boolean): void
  
  // 内部方法
  handleTrackEnd(): void
  updateNavigationState(): void
}

// Store Getters接口 - 使用ComputedRef类型
import type { ComputedRef } from 'vue'
import type { MusicVO } from '@services/src/service/music/types'

export interface PlayerStoreGetters {
  // 播放状态
  isPlaying: ComputedRef<boolean>
  isPaused: ComputedRef<boolean>
  isStopped: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  
  // 播放信息
  currentTrack: ComputedRef<Track | null>
  currentTrackIndex: ComputedRef<number>
  hasPrevious: ComputedRef<boolean>
  hasNext: ComputedRef<boolean>
  progress: ComputedRef<number>
  
  // 音频设置
  volume: ComputedRef<number>
  playbackRate: ComputedRef<number>
  isMuted: ComputedRef<boolean>
  
  // 配置
  playMode: ComputedRef<PlayMode>
  displayMode: ComputedRef<PlayerDisplayMode>
  isFullscreen: ComputedRef<boolean>
  
  // 错误信息
  error: ComputedRef<string | null>
  
  // UI状态
  showPlaylistPopup: ComputedRef<boolean>
  
  // 新增的计算属性别名
  currentSong: ComputedRef<Track | null>
  currentIndex: ComputedRef<number>
  currentTime: ComputedRef<number>
  duration: ComputedRef<number>
  buffered: ComputedRef<number>
  
  // 播放列表相关
  playlistTracks: ComputedRef<Track[]>
}