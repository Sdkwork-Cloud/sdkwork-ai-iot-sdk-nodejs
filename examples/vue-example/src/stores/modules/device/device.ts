import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid' 
import type { Device, DeviceStoreState } from './types'

export const useDeviceStore = defineStore('device', {
  state: (): DeviceStoreState => ({
    // Device management
    deviceList: [],
    selectedDeviceId: null,
    
    // Client identification
    deviceId: localStorage.getItem('deviceId') || uuidv4(),
    clientId: localStorage.getItem('clientId') || uuidv4(),
    
    // Loading states
    isLoading: false,
    
    // Connection states
    connection: {
      isConnected: false,
      isConnecting: false,
      isDisconnecting: false,
      isReconnecting: false
    }
  }),

  actions: {
    initDeviceIds() {
      if (!localStorage.getItem('deviceId')) {
        localStorage.setItem('deviceId', this.deviceId)
      }
      if (!localStorage.getItem('clientId')) {
        localStorage.setItem('clientId', this.clientId)
      }
    },
    async fetchDevices() {
      this.isLoading = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 模拟设备数据
        this.deviceList = [
          {
            id: '1',
            name: '智能空调',
            type: 'air_conditioner',
            status: 'online',
            lastSeen: new Date(),
            location: '客厅',
            firmwareVersion: 'v1.2.3'
          },
          {
            id: '2',
            name: '智能灯泡',
            type: 'light',
            status: 'offline',
            lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
            location: '卧室',
            firmwareVersion: 'v1.0.1'
          },
          {
            id: '3',
            name: '智能门锁',
            type: 'door_lock',
            status: 'online',
            lastSeen: new Date(),
            location: '大门',
            firmwareVersion: 'v2.1.0'
          }
        ]
      } catch (error) {
        console.error('Failed to fetch devices:', error)
      } finally {
        this.isLoading = false
      }
    },

    updateDeviceStatus(deviceId: string, status: Device['status']) {
      const device = this.deviceList.find((d: Device) => d.id === deviceId)
      if (device) {
        device.status = status
        device.lastSeen = new Date()
      }
    },

    selectDevice(deviceId: string) {
      this.selectedDeviceId = deviceId
    },

    addDevice(device: Omit<Device, 'id'>) {
      const newDevice: Device = {
        ...device,
        id: Date.now().toString()
      }
      this.deviceList.push(newDevice)
    },

    removeDevice(deviceId: string) {
      this.deviceList = this.deviceList.filter((device: Device) => device.id !== deviceId)
      if (this.selectedDeviceId === deviceId) {
        this.selectedDeviceId = null
      }
    }
  }
})