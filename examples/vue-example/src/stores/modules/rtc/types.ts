 
/**
 * RTC连接状态枚举
 */
export enum RTCConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTING = 'disconnecting',
  FAILED = 'failed'
}

/**
 * RTC通话类型枚举
 */
export enum RTCCallType {
  VOICE = 'voice',
  VIDEO = 'video',
  SCREEN_SHARE = 'screen_share'
}

/**
 * RTC通话方向枚举
 */
export enum RTCDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing'
}

/**
 * RTC通话状态枚举
 */
export enum RTCCallStatus {
  IDLE = 'idle',
  RINGING = 'ringing',
  ACTIVE = 'active',
  ENDED = 'ended',
  MISSED = 'missed',
  REJECTED = 'rejected'
}

/**
 * RTC媒体设备类型
 */
export enum RTCDeviceType {
  CAMERA = 'camera',
  MICROPHONE = 'microphone',
  SPEAKER = 'speaker'
}

/**
 * RTC设备信息
 */
export interface RTCDeviceInfo {
  id: string
  label: string
  type: RTCDeviceType
  isDefault: boolean
}

/**
 * RTC通话信息
 */
export interface RTCCallInfo {
  id: string
  callId: string
  targetUserId: string
  targetUserName?: string
  targetUserAvatar?: string
  callType: RTCCallType
  direction: RTCDirection
  status: RTCCallStatus
  startTime?: number
  endTime?: number
  duration?: number
  localStream?: MediaStream
  remoteStream?: MediaStream
  isMuted: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
}

/**
 * RTC统计数据
 */
export interface RTCStats {
  audioLevel: number
  videoResolution?: { width: number; height: number }
  videoFps?: number
  audioCodec?: string
  videoCodec?: string
  packetsLost: number
  packetsSent: number
  packetsReceived: number
  bytesSent: number
  bytesReceived: number
  roundTripTime?: number
  jitter?: number
  latency?: number
}

/**
 * RTC配置选项
 */
export interface RTCStoreConfig {
  iceServers: RTCIceServer[]
  audioConstraints?: MediaTrackConstraints
  videoConstraints?: MediaTrackConstraints
  screenConstraints?: MediaTrackConstraints
  dataChannel?: boolean
  autoAnswer?: boolean
  maxCallDuration?: number
}

/**
 * RTC Store状态
 */
export interface RTCStoreState {
  // 基础状态
  loading: boolean
  error: string | null
  initialized: boolean

  // RTC客户端
  rtcClient: any | null
  connectionState: RTCConnectionState
  iceConnectionState: RTCIceConnectionState
  signalingState: RTCSignalingState

  // 当前通话
  currentCall: RTCCallInfo | null
  activeCalls: RTCCallInfo[]
  callHistory: RTCCallInfo[]

  // 媒体设备
  availableDevices: RTCDeviceInfo[]
  selectedDevices: {
    camera?: string
    microphone?: string
    speaker?: string
  }

  // 媒体状态
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
  isMuted: boolean
  isSpeakerEnabled: boolean

  // 统计数据
  stats: RTCStats | null
  callDuration: number

  // 配置
  config: RTCStoreConfig
}

/**
 * RTC事件类型
 */
export enum RTCEventType {
  CALL_INCOMING = 'call_incoming',
  CALL_STARTED = 'call_started',
  CALL_ENDED = 'call_ended',
  CALL_REJECTED = 'call_rejected',
  CALL_MISSED = 'call_missed',
  CONNECTION_STATE_CHANGED = 'connection_state_changed',
  DEVICE_CHANGED = 'device_changed',
  STATS_UPDATED = 'stats_updated',
  ERROR_OCCURRED = 'error_occurred'
}

/**
 * RTC事件数据
 */
export interface RTCEventData {
  type: RTCEventType
  call?: RTCCallInfo
  state?: RTCConnectionState
  error?: string
  stats?: RTCStats
}

/**
 * RTC通话请求
 */
export interface RTCCallRequest {
  targetUserId: string
  callType: RTCCallType
  offer?: RTCSessionDescriptionInit
  iceCandidates?: RTCIceCandidateInit[]
}

/**
 * RTC通话响应
 */
export interface RTCCallResponse {
  callId: string
  accepted: boolean
  answer?: RTCSessionDescriptionInit
  iceCandidates?: RTCIceCandidateInit[]
  error?: string
}