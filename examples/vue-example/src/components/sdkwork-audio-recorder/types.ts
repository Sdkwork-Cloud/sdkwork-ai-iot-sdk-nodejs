// ==================== 类型定义 ====================

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
 * 音频数据接口
 */
export interface AudioRecord {
  /** 音频数据 Blob */
  data?: Blob|ArrayBuffer 
  /** 录制时长 (秒) */
  duration: number
  /** 文件大小 (字节) */
  size: number
  /** 时间戳 */
  createdAt: number
  /** 录制 ID */
  id: string
}

/**
 * 录制记录接口
 */
export interface AudioRecord {
  id: string
  duration: number
  size: number
  createdAt: number
  data?: Blob|ArrayBuffer
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
  stopRecord: () => Promise<AudioRecord | null>
  /** 清除录制记录 */
  clearRecords: () => void
  /** 获取录制统计 */
  getStats: () => RecordStats
  /** 获取录制记录 */
  getRecords: () => AudioRecord[]
  /** 下载录制文件 */
  downloadRecord: (id: string, filename?: string) => void
  /** 手动发送数据 */
  sendData: (data?: AudioRecord) => Promise<any>
  /** 销毁录制器 */
  destroy: () => void
}