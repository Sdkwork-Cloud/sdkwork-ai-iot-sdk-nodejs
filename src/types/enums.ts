// 连接状态枚举
export enum ConnectionStateEnum {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

// 设备状态枚举
export enum DeviceState {
  IDLE = 'idle',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  PROCESSING = 'processing',
  ERROR = 'error',
}
 