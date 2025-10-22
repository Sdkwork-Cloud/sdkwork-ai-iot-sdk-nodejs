// 设备相关类型定义

export interface Device {
  id: string
  name: string
  type: DeviceType
  status: DeviceStatus
  description?: string
  location?: string
  firmwareVersion?: string
  hardwareVersion?: string
  createdAt: string
  updatedAt: string
  lastSeenAt?: string
  batteryLevel?: number
  signalStrength?: number
  metadata?: Record<string, any>
}

export interface CreateDeviceRequest {
  name: string
  type: DeviceType
  description?: string
  location?: string
  metadata?: Record<string, any>
}

export interface UpdateDeviceRequest {
  name?: string
  description?: string
  location?: string
  metadata?: Record<string, any>
}

export interface DeviceControlRequest {
  deviceId: string
  command: string
  parameters?: Record<string, any>
  timestamp: Date
}

export interface DeviceControlResponse {
  success: boolean
  message: string
  data?: any
}

export interface SensorData {
  deviceId: string
  sensorType: string
  value: number
  unit: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface DeviceEvent {
  type: string
  deviceId: string
  data: Record<string, any>
  timestamp: string
}

export type DeviceType = 
  | 'sensor' 
  | 'controller' 
  | 'actuator' 
  | 'gateway' 
  | 'camera' 
  | 'display' 
  | 'speaker'

export type DeviceStatus = 'online' | 'offline' | 'sleeping' | 'error'

export interface DeviceStats {
  total: number
  online: number
  offline: number
  sleeping: number
  error: number
}