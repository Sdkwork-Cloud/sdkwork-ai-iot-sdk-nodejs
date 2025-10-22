<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 设备列表 -->
    <sdkwork-device-list
      :api="getDevicesApi"
      :params="searchParams"
      :search-keyword="searchKeyword"
      :searchable="false"
      selectable
      theme-mode="auto"
      @select="handleDeviceSelect"
      @click="handleDeviceClick"
      @search="handleSearch"
      @refresh="handleRefresh"
    >
      <!-- 自定义头部插槽 - 设备统计 -->
      <template #header>
        <div class="stats-section">
          <sdkwork-row gutter="12">
            <sdkwork-col span="8">
              <div class="stat-card online">
                <div class="stat-number">{{ onlineCount }}</div>
                <div class="stat-label">在线</div>
              </div>
            </sdkwork-col>
            <sdkwork-col span="8">
              <div class="stat-card offline">
                <div class="stat-number">{{ offlineCount }}</div>
                <div class="stat-label">离线</div>
              </div>
            </sdkwork-col>
            <sdkwork-col span="8">
              <div class="stat-card total">
                <div class="stat-number">{{ totalCount }}</div>
                <div class="stat-label">总数</div>
              </div>
            </sdkwork-col>
          </sdkwork-row>
        </div>
      </template>
    </sdkwork-device-list>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import SdkworkDeviceList from '@/components/sdkwork-device-list/sdkwork-device-list.vue'
import type { Device } from '@/components/sdkwork-device-item/sdkwork-device-item.vue'

definePage({
    meta: {
        title: '硬件设备'
    }
})

const searchKeyword = ref('')
const selectedDevices = ref<Device[]>([])
const router = useRouter()

// 搜索参数
const searchParams = computed(() => ({
  keyword: searchKeyword.value,
  category: 'all'
}))

// 模拟设备API
const getDevicesApi:any = async (params: any) => {
  console.log('获取设备列表参数:', params)
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟数据
  const mockDevices: Device[] = [
    {
      id: '1',
      name: '智能空调',
      type: 'air-conditioner',
      status: 'online',
      avatar: 'https://via.placeholder.com/40',
      lastUpdate: '2分钟前',
      location: '客厅',
      temperature: 25,
      humidity: 45
    },
    {
      id: '2',
      name: '智能门锁',
      type: 'door-lock',
      status: 'online',
      avatar: 'https://via.placeholder.com/40',
      lastUpdate: '5分钟前',
      location: '大门'
    },
    {
      id: '3',
      name: '智能灯泡',
      type: 'light',
      status: 'offline',
      avatar: 'https://via.placeholder.com/40',
      lastUpdate: '1小时前',
      location: '卧室'
    },
    {
      id: '4',
      name: '温度传感器',
      type: 'sensor',
      status: 'online',
      avatar: 'https://via.placeholder.com/40',
      lastUpdate: '刚刚',
      location: '书房',
      temperature: 23,
      humidity: 50
    },
    {
      id: '5',
      name: '智能摄像头',
      type: 'camera',
      status: 'error',
      avatar: 'https://via.placeholder.com/40',
      lastUpdate: '30分钟前',
      location: '走廊'
    }
  ]
  
  // 模拟搜索过滤
  let filteredDevices = mockDevices
  if (params.keyword) {
    filteredDevices = mockDevices.filter(device => 
      device.name.toLowerCase().includes(params.keyword.toLowerCase()) ||
      device.location?.toLowerCase().includes(params.keyword.toLowerCase())
    )
  }
  
  return {
    content: filteredDevices,
    totalElements: filteredDevices.length,
    totalPages: 1,
    number: 0,
    last: true,
    size: params.size || 10,
    first: true,
    numberOfElements: filteredDevices.length,
    empty: filteredDevices.length === 0
  }
}

// 页面加载处理
const handlePageLoad = () => {
  console.log('设备管理页面已加载')
}

// 计算统计信息（从设备列表组件获取）
const onlineCount = computed(() => {
  // 这里可以从设备列表组件获取实时数据
  return 3 // 模拟在线设备数量
})

const offlineCount = computed(() => {
  // 这里可以从设备列表组件获取实时数据
  return 1 // 模拟离线设备数量
})

const totalCount = computed(() => {
  // 这里可以从设备列表组件获取实时数据
  return 5 // 模拟设备总数
})

// 事件处理
const handleDeviceSelect = (device: Device) => {
  selectedDevices.value = [device]
  console.log('选中设备:', device)
}

const handleDeviceClick = (device: Device) => {
  router.push(`/devices/${device.id}`)
}

const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  console.log('搜索关键词:', keyword)
}

const handleRefresh = () => {
  showToast('刷新成功')
}
</script>

<style scoped lang="scss">
.stats-section {
  padding: 12px;
  
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    &.online {
      border-left: 4px solid var(--van-success-color);
    }
    
    &.offline {
      border-left: 4px solid var(--van-warning-color);
    }
    
    &.total {
      border-left: 4px solid var(--van-primary-color);
    }
    
    .stat-number {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '硬件设备'
  }
}
</route>