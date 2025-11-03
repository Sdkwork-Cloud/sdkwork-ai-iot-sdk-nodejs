
/**
 * 浏览器自动播放策略状态
 */
export enum AutoplayStatus {
  /** 未检测 */
  UNKNOWN = 'unknown',
  /** 允许自动播放 */
  ALLOWED = 'allowed',
  /** 仅允许静音自动播放 */
  ALLOWED_MUTED = 'allowed_muted',
  /** 不允许自动播放 */
  DISALLOWED = 'disallowed'
}

/**
 * 自动播放权限请求结果
 */
export interface AutoplayPermissionResult {
  /** 自动播放状态 */
  status: AutoplayStatus;
  /** 是否需要用户交互 */
  requiresUserInteraction: boolean;
  /** 是否需要静音播放 */
  requiresMuted: boolean;
  /** 错误信息（如果有） */
  error?: Error;
}

/**
 * Audio playback events interface
 */
export interface AudioPlayerEvents {
  /** Fired when playback starts */
  onPlay?: () => void;
  /** Fired when playback pauses */
  onPause?: () => void;
  /** Fired when playback stops */
  onStop?: () => void;
  /** Fired when playback ends naturally */
  onEnd?: () => void;
  /** Fired when an error occurs */
  onError?: (error: Error) => void;
  /** Fired when playback time updates */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** Fired when playback progress updates (alias for onTimeUpdate) */
  onProgress?: (currentTime: number, duration: number) => void;
  /** Fired when buffering state changes */
  onBuffering?: (isBuffering: boolean) => void;
  /** Fired when volume changes */
  onVolumeChange?: (volume: number) => void;
  /** 当需要用户交互才能播放时触发 */
  onAutoplayBlocked?: (result: AutoplayPermissionResult) => void;
  /** 当自动播放状态变更时触发 */
  onAutoplayStatusChange?: (result: AutoplayPermissionResult) => void;
}

/**
 * Audio player configuration options
 */
export interface AudioPlayerOptions {
  /** Initial volume level (0.0 to 1.0) */
  volume?: number;
  /** Whether to auto-play when ready */
  autoplay?: boolean;
  /** Whether to loop playback */
  loop?: boolean;
  /** Audio sample rate for streaming (default: 16000) */
  sampleRate?: number;
  /** Number of audio channels (default: 1) */
  channels?: number;
  /** Custom event handlers */
  events?: AudioPlayerEvents;
}

/**
 * Audio playback state enumeration
 */
export enum AudioPlayerState {
  /** Player is created but not initialized */
  IDLE = 'idle',
  /** Player is loading audio data */
  LOADING = 'loading',
  /** Audio is ready to play */
  READY = 'ready',
  /** Audio is currently playing */
  PLAYING = 'playing',
  /** Audio is paused */
  PAUSED = 'paused',
  /** Audio playback has ended */
  ENDED = 'ended',
  /** An error occurred */
  ERROR = 'error',
  /** Waiting for user interaction to resume playback */
  WAITING_FOR_INTERACTION = 'waiting_for_interaction'
}
export interface IAudioPlayer {
  /**
   * 播放音频文件
   * @param url - 音频文件URL
   */
  play(url: string | File | Blob): Promise<void>;

  /**
   * 播放Blob对象
   * @param blob - 音频Blob数据
   */
  playBlob(blob: Blob): Promise<void>;

  /**
   * 暂停当前播放
   */
  pause(): void;

  /**
   * 恢复暂停的播放
   */
  resume(): Promise<void>;

  /**
   * 停止播放并重置到开始位置
   */
  stop(): void;

  /**
   * 设置音量
   * @param volume - 音量级别（0.0到1.0）
   */
  setVolume(volume: number): void;

  /**
   * 获取当前音量
   * @returns 当前音量级别
   */
  getVolume(): number;

  /**
   * 获取当前播放状态
   * @returns 当前播放器状态
   */
  getState(): AudioPlayerState;

  /**
   * 获取当前播放时间
   * @returns 当前时间（秒）
   */
  getCurrentTime(): number;

  /**
   * 获取总时长
   * @returns 时长（秒）
   */
  getDuration(): number;

  /**
   * 跳转到特定时间位置
   * @param time - 时间位置（秒）
   */
  seek(time: number): void;

  /**
   * 设置播放速率
   * @param rate - 播放速率（0.5到4.0）
   */
  setPlaybackRate(rate: number): void;

  /**
   * 添加事件监听器
   * @param event - 事件名称
   * @param callback - 事件回调
   */
  on<K extends keyof AudioPlayerEvents>(event: K, callback: AudioPlayerEvents[K]): void;

  /**
   * 移除事件监听器
   * @param event - 事件名称
   */
  off<K extends keyof AudioPlayerEvents>(event: K): void;

  /**
   * 清理资源并停止播放
   */
  destroy(): void;
}

/**
 * 流式音频播放器接口
 * 扩展基本音频播放器接口，添加流式播放功能
 */
export interface IStreamAudioPlayer {
  /**
   * 开始实时音频流播放
   * @param sampleRate - 音频采样率（默认：16000）
   * @param channels - 音频通道数（默认：1）
   */
  startStream(sampleRate?: number, channels?: number): Promise<void>;

  /**
   * 向流中添加音频数据
   * @param data - 音频数据（多种格式）
   */
  appendStreamData(data: Float32Array | Int16Array | ArrayBuffer): void;

  /**
   * 停止实时音频流播放
   */
  stopStream(): Promise<void>;

  /**
   * 暂停当前播放
   */
  pause(shouldClearInput?: boolean): void;
  /**
   * 清空输入
   * @param duration 
   */
  clearInput(duration?: number): void;

  /**
   * 恢复暂停的播放
   */
  resume(): Promise<void>;

  /**
   * 停止播放并重置到开始位置
   */
  stop(): void;

  /**
   * 设置音量
   * @param volume - 音量级别（0.0到1.0）
   */
  setVolume(volume: number): void;

  /**
   * 获取当前音量
   * @returns 当前音量级别
   */
  getVolume(): number;

  /**
   * 获取当前播放状态
   * @returns 当前播放器状态
   */
  getState(): AudioPlayerState;

  /**
   * 检查播放器是否处于可播放状态
   * @returns 是否可播放
   */
  isPlayable(): boolean;

  /**
   * 检查播放器是否处于可重启状态
   * @returns 是否可重启
   */
  isRestartable(): boolean;

  /**
   * 清理资源并停止播放
   */
  destroy(): void;
}