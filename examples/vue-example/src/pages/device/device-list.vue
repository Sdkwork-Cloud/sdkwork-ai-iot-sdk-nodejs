<template>
  <div class="device-list-page">
    <div class="search-section">
      <sdkwork-search-bar
        v-model="searchKeyword"
        placeholder="搜索设备名称或ID"
        @search="handleSearch"
      />
    </div>
    
    <div class="device-list-container">
      <template v-if="loading">
        <van-skeleton rows="3" animated>加载中...</van-skeleton>
      </template>
      
      <template v-else-if="filteredDevices.length === 0">
        <van-empty description="暂无设备" image="search" />
      </template>
      
      <template v-else>
        <sdkwork-cell-group>
          <sdkwork-cell
            v-for="device in filteredDevices"
            :key="device.id"
            :title="device.name"
            :value="device.status"
            :label="device.type"
            is-link
            @click="handleDeviceDetail(device.id)"
          >
            <template #icon>
              <van-icon
                :name="device.status === 'online' ? 'success' : 'cross'"
                :color="device.status === 'online' ? '#07c160' : '#ee0a24'"
              />
            </template>
          </sdkwork-cell>
        </sdkwork-cell-group>
      </template>
    </div>
    
    <van-floating-bubble
      axis="xy"
      magnetic="x"
      :offset="offset"
      @update:offset="handleOffsetChange"
      @click="handleAddDevice"
    >
      <van-icon name="plus" size="20" />
    </van-floating-bubble>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceStore } from '@/stores/modules/device'

definePage({
    meta: {
        title: '设备列表'
    }
})

const router = useRouter()
const deviceStore = useDeviceStore()

const searchKeyword = ref('')
const loading = ref(false)
const offset = ref({ x: 0, y: 200 })

const filteredDevices = computed(() => {
  if (!searchKeyword.value) {
    return deviceStore.deviceList
  }
  
  return deviceStore.deviceList.filter(device => 
    device.name.includes(searchKeyword.value) || 
    device.id.includes(searchKeyword.value)
  )
})

const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
}

const handleDeviceDetail = (deviceId: string) => {
  router.push(`/device/detail/${deviceId}`)
}

const handleAddDevice = () => {
  router.push('/device/add')
}

const handleOffsetChange = (newOffset: any) => {
  offset.value = newOffset
}

onMounted(async () => {
  loading.value = true
  try {
    await deviceStore.fetchDevices()
  } catch (error) {
    console.error('加载设备列表失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.device-list-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
  
  .search-section {
    padding: 10px;
  }
  
  .device-list-container {
    padding: 10px;
  }
}
</style>

<route>
{
  meta: {
    layout: 'default',
    title: '设备列表'
  }
}
</route>