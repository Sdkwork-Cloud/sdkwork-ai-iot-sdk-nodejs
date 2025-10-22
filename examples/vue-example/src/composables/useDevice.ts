import { ref, computed } from 'vue'
import { useDeviceStore } from '@/stores/modules/device'

export function useDevice() {
  const deviceStore = useDeviceStore()
  
  const searchKeyword = ref('')
  const loading = ref(false)
  
  // 过滤设备列表
  const filteredDevices = computed(() => {
    if (!searchKeyword.value) {
      return deviceStore.deviceList
    }
    
    const keyword = searchKeyword.value.toLowerCase()
    return deviceStore.deviceList.filter(device => 
      device.name.toLowerCase().includes(keyword) ||
      device.id.toLowerCase().includes(keyword)
    )
  })
  
  // 刷新设备列表
  const refreshDevices = async () => {
    loading.value = true
    try {
      await deviceStore.fetchDevices()
    } finally {
      loading.value = false
    }
  }
  
  // 添加设备
  const addDevice = async (deviceData: any) => {
    return await deviceStore.addDevice(deviceData)
  }
  

  
  return {
    searchKeyword,
    loading,
    filteredDevices,
    refreshDevices,
    addDevice
  }
}