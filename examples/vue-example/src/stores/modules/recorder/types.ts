// ==================== 录制器 Store 类型定义 ====================

// ==================== 基础类型定义 ====================

/**
 * 录制器配置选项
 */
export interface RecorderConfig {
  /** 音频采样率 (默认: 16000) */
  sampleRate?: number
  /** 音频比特率 (默认: 128) */
  bitRate?: number
  /** 音频格式 (默认: 'pcm') */
  format?: 'pcm' | 'mp3' | 'wav'
  /** 是否启用波形显示 (默认: true) */
  enableWave?: boolean
  /** 是否实时录制 (默认: false) */
  realtime?: boolean
  /** 录制到文件 (默认: true) */
  recordToFile?: boolean
  /** 最大录制时长 (秒, 0表示无限制) */
  maxDuration?: number
  /** 自动发送间隔 (毫秒, 0表示不自动发送) */
  autoSendInterval?: number
}

/**
 * API 配置接口
 */
export interface ApiConfig {
  /** API 发送函数 */
  send?: (data: AudioRecord) => Promise<any>
  /** 发送前处理函数 */
  beforeSend?: (data: AudioRecord) => AudioRecord
  /** 发送后处理函数 */
  afterSend?: (response: any) => void
  /** 发送错误处理函数 */
  onSendError?: (error: Error) => void
}

/**
 * 音频录制记录接口
 */
export interface AudioRecord {
  /** 录制 ID */
  id: string
  /** 录制时长 (秒) */
  duration: number
  /** 文件大小 (字节) */
  size: number
  /** 时间戳 */
  createdAt: number
  /** 音频数据 Blob */
  data?: Blob|ArrayBuffer
  /** 记录名称 */
  name?: string
}

/**
 * 录制状态枚举
 */
export enum RecordState {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  RECORDING = 'recording',
  PAUSED = 'paused',
  PROCESSING = 'processing',
  STOPPED = 'stopped',
  ERROR = 'error'
}

/**
 * 录制统计信息
 */
export interface RecordStats {
  state: RecordState
  duration: number
  dataSize: number
  waveEnabled: boolean
  realtime: boolean
}

/**
 * 事件类型定义
 */
export interface RecorderEvents {
  /** 录制开始 */
  'record-start': []
  /** 录制暂停 */
  'record-pause': []
  /** 录制恢复 */
  'record-resume': []
  /** 录制停止 */
  'record-stop': [AudioRecord]
  /** 实时数据 */
  'realtime-data': [ArrayBuffer]
  /** 录制错误 */
  'record-error': [Error]
  /** 状态变化 */
  'state-change': [RecordState]
  /** 录制时长更新 */
  'duration-update': [number]
  /** 录制文件添加 */
  'record-add': [AudioRecord]
}

/**
 * 插槽类型定义
 */
export interface RecorderSlots {
  /** 顶部插槽 - 用于自定义标题或说明 */
  header?: () => any
  /** 波形显示区域插槽 */
  wave?: (props: { amplitude: number; data: number[] }) => any
  /** 计时器显示插槽 */
  timer?: (props: { duration: number; formatted: string }) => any
  /** 状态指示器插槽 */
  status?: (props: { state: RecordState; stats: RecordStats }) => any
  /** 录制列表插槽 */
  recordList?: (props: { records: AudioRecord[]; currentRecord?: AudioRecord }) => any
  /** 底部控制区域插槽 */
  controls?: (props: { 
    state: RecordState; 
    actions: {
      start: () => void;
      pause: () => void;
      resume: () => void;
      stop: () => void;
      clear: () => void;
    }
  }) => any
  /** 字幕显示区域插槽 */
  subtitle?: () => any
  /** 默认插槽 - 用于自定义内容 */
  default?: () => any
}

/**
 * 暴露的方法接口
 */
export interface RecorderExposed {
  /** 开始录制 */
  startRecord: () => Promise<void>
  /** 暂停录制 */
  pauseRecord: () => void
  /** 恢复录制 */
  resumeRecord: () => void
  /** 停止录制 */
  stopRecord: () => Promise<AudioData | null>
  /** 清除录制记录 */
  clearRecords: () => void
  /** 获取录制统计 */
  getStats: () => RecordStats
  /** 获取录制记录 */
  getRecords: () => AudioRecord[]
  /** 下载录制文件 */
  downloadRecord: (id: string, filename?: string) => void
  /** 手动发送数据 */
  sendData: (data?: AudioData) => Promise<any>
  /** 销毁录制器 */
  destroy: () => void
}

// ==================== Store 类型定义 ====================

/**
 * 录制器 Store 状态接口
 */
export interface RecorderStoreState {
  // 录制器配置
  config: RecorderConfig
  
  // 录制状态
  currentState: RecordState
  currentDuration: number
  currentRecord: AudioRecord | null
  
  // 录制记录
  records: AudioRecord[]
  
  // 错误信息
  errorMessage: string
  
  // UI 状态
  settingDialogVisible: boolean
  recordListDialogVisible: boolean
  saveDialogVisible: boolean
  cancelConfirmVisible: boolean
  
  // 音频播放器状态
  currentPlayingRecordId: string | null
  isPlaying: boolean
  currentTime: number
  totalDuration: number
}

/**
 * 录制器 Store 操作接口
 */
export interface RecorderStoreActions {
  // 配置操作
  updateConfig: (config: Partial<RecorderConfig>) => void
  resetConfig: () => void
  
  // 录制操作
  startRecording: () => Promise<void>
  pauseRecording: () => void
  resumeRecording: () => void
  stopRecording: () => Promise<AudioData | null>
  cancelRecording: () => void
  
  // 录制记录操作
  addRecord: (record: AudioRecord) => void
  removeRecord: (recordId: string) => void
  clearRecords: () => void
  updateRecord: (recordId: string, updates: Partial<AudioRecord>) => void
  
  // 播放操作
  playRecord: (record: AudioRecord) => void
  pausePlayback: () => void
  stopPlayback: () => void
  
  // UI 操作
  toggleSettingDialog: (show?: boolean) => void
  toggleRecordListDialog: (show?: boolean) => void
  toggleSaveDialog: (show?: boolean) => void
  toggleCancelConfirm: (show?: boolean) => void
  
  // 错误处理
  setError: (message: string) => void
  clearError: () => void
}

/**
 * 录制器 Store Getters 接口
 */
export interface RecorderStoreGetters {
  // 状态检查
  isIdle: boolean
  isRecording: boolean
  isPaused: boolean
  isProcessing: boolean
  isError: boolean
  
  // 录制记录相关
  latestRecord: AudioRecord | null
  recordCount: number
  hasRecords: boolean
  
  // 配置相关
  isRealtimeEnabled: boolean
  isWaveEnabled: boolean
  isRecordToFile: boolean
  
  // 播放相关
  isPlaying: boolean
  currentPlayingRecord: AudioRecord | null
  progressPercentage: number
}

/**
 * 录制器 Store 完整接口
 */
export interface RecorderStore extends RecorderStoreState, RecorderStoreActions, RecorderStoreGetters {}

/**
 * 录制器 Store 创建选项
 */
export interface RecorderStoreOptions {
  // 初始配置
  initialConfig?: RecorderConfig
  initialApiConfig?: ApiConfig
  
  // 持久化选项
  persist?: boolean
  persistKey?: string
  
  // 事件回调
  onStateChange?: (state: RecordState) => void
  onRecordAdd?: (record: AudioRecord) => void
  onRecordRemove?: (record: AudioRecord) => void
  onError?: (error: Error) => void
}

/**
 * 录制器 Store 模块导出
 */
export interface RecorderStoreModule {
  namespaced: true
  state: () => RecorderStoreState
  getters: Record<string, (state: RecorderStoreState) => any>
  actions: Record<string, (context: any, payload?: any) => void>
  mutations: Record<string, (state: RecorderStoreState, payload?: any) => void>
}