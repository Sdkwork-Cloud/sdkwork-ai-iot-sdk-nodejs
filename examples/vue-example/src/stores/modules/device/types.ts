export interface Device {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'error'
  lastSeen: Date
  location: string
  firmwareVersion: string
}

export interface DeviceStoreState {
  // Device management
  deviceList: Device[]
  selectedDeviceId: string | null
  
  // Client identification
  deviceId: string
  clientId: string
  
  // Loading states
  isLoading: boolean
  
  // Connection states
  connection: {
    isConnected: boolean
    isConnecting: boolean
    isDisconnecting: boolean
    isReconnecting: boolean
  }
}