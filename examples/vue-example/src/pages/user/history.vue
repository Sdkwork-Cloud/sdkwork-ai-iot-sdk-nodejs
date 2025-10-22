<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto"
  >
    <template #header>
      <van-nav-bar
        title="浏览记录"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
      />
    </template>

    <div class="history-container">
      <!-- 筛选和操作工具栏 -->
      <div class="history-toolbar">
        <van-dropdown-menu>
          <van-dropdown-item v-model="filterType" :options="typeOptions" />
          <van-dropdown-item v-model="filterTime" :options="timeOptions" />
        </van-dropdown-menu>
        
        <div class="toolbar-actions">
          <van-button size="small" @click="handleClearAll" v-if="historyList.length > 0">
            清空记录
          </van-button>
        </div>
      </div>

      <van-empty
        image="search"
        description="暂无浏览记录"
        v-if="filteredHistory.length === 0"
      >
        <van-button round type="primary" @click="goToHome">
          去浏览内容
        </van-button>
      </van-empty>

      <div v-else class="history-list">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="item in filteredHistory"
            :key="item.id"
            class="history-item"
            @click="handleView(item)"
          >
            <div class="item-content">
              <div class="item-thumb">
                <img :src="item.thumb" :alt="item.title" />
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-desc">{{ item.description }}</div>
                <div class="item-meta">
                  <span class="item-type">{{ getTypeText(item.type) }}</span>
                  <span class="item-time">{{ formatTime(item.time) }}</span>
                </div>
              </div>
            </div>
            <van-button
              size="small"
              type="danger"
              plain
              @click.stop="handleRemove(item.id)"
            >
              删除
            </van-button>
          </div>
        </van-list>
      </div>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()

// 筛选条件
const filterType = ref('all')
const filterTime = ref('all')

// 筛选选项
const typeOptions = [
  { text: '全部类型', value: 'all' },
  { text: '作品', value: 'work' },
  { text: '智能体', value: 'agent' },
  { text: '声音', value: 'voice' },
  { text: '角色', value: 'character' }
]

const timeOptions = [
  { text: '全部时间', value: 'all' },
  { text: '今天', value: 'today' },
  { text: '最近7天', value: 'week' },
  { text: '最近30天', value: 'month' }
]

// 浏览记录数据
const historyList = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)

// 模拟浏览记录数据
const mockHistory = [
  {
    id: 1,
    title: 'AI绘画作品 - 山水风景',
    description: '使用AI技术创作的山水风景画',
    thumb: '/images/placeholder.jpg',
    type: 'work',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2小时前
  },
  {
    id: 2,
    title: '智能语音助手',
    description: '多功能智能语音助手应用',
    thumb: '/images/placeholder.jpg',
    type: 'agent',
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1天前
  },
  {
    id: 3,
    title: '自然语音包',
    description: '高质量自然语音合成包',
    thumb: '/images/placeholder.jpg',
    type: 'voice',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3天前
  }
]

// 过滤后的浏览记录
const filteredHistory = computed(() => {
  let result = historyList.value
  
  // 按类型筛选
  if (filterType.value !== 'all') {
    result = result.filter(item => item.type === filterType.value)
  }
  
  // 按时间筛选
  if (filterTime.value !== 'all') {
    const now = new Date()
    const filterDate = new Date()
    
    switch (filterTime.value) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        filterDate.setDate(now.getDate() - 7)
        break
      case 'month':
        filterDate.setDate(now.getDate() - 30)
        break
    }
    
    result = result.filter(item => item.time >= filterDate)
  }
  
  return result
})

// 获取类型文本
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    work: '作品',
    agent: '智能体',
    voice: '声音',
    character: '角色'
  }
  return typeMap[type] || '未知'
}

// 格式化时间
const formatTime = (time: Date) => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  
  if (diff < 60 * 60 * 1000) { // 1小时内
    const minutes = Math.floor(diff / (60 * 1000))
    return `${minutes}分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) { // 1天内
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}小时前`
  } else {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }
}

// 列表加载
const onLoad = () => {
  loading.value = true
  setTimeout(() => {
    if (historyList.value.length >= mockHistory.length) {
      finished.value = true
    } else {
      historyList.value = [...mockHistory]
    }
    loading.value = false
  }, 500)
}

// 查看记录项
const handleView = (item: any) => {
  showToast(`查看：${item.title}`)
  // 这里可以根据实际业务跳转到对应详情页
}

// 删除单条记录
const handleRemove = (id: number) => {
  historyList.value = historyList.value.filter(item => item.id !== id)
  showToast('记录已删除')
}

// 清空所有记录
const handleClearAll = async () => {
  try {
    await showConfirmDialog({
      title: '确认清空',
      message: '确定要清空所有浏览记录吗？'
    })
    
    historyList.value = []
    showToast('浏览记录已清空')
  } catch {
    // 用户取消操作
  }
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}

// 页面加载时初始化数据
onMounted(() => {
  // 可以在这里加载真实的浏览记录数据
})
</script>

<style scoped lang="scss">
.history-container {
  padding: 16px;
  min-height: 400px;
}

.history-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .toolbar-actions {
    margin-left: 16px;
  }
}

.history-list {
  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    
    .item-content {
      display: flex;
      align-items: center;
      flex: 1;
      margin-right: 12px;
      
      .item-thumb {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        margin-right: 12px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .item-info {
        flex: 1;
        
        .item-title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
          color: #323233;
        }
        
        .item-desc {
          font-size: 14px;
          color: #969799;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        
        .item-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #969799;
        }
      }
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>