<template>
  <div class="video-list-demo">
    <div class="demo-header">
      <h1>视频列表组件演示</h1>
      <p>API模式演示 - 使用模拟数据</p>
    </div>

    <div class="demo-controls">
      <div class="control-panel">
        <van-button type="primary" @click="refreshApiList">刷新列表</van-button>
        <van-button @click="clearApiSelection">清空选择</van-button>
        <van-button type="warning" @click="showApiStats">显示统计</van-button>
      </div>
    </div>

    <!-- API模式视频列表 -->
    <div class="video-list-section">
      <SdkworkVideoList
        ref="apiVideoListRef"
        :api="customApiMethod"
        :params="apiParams"
        :selectable="true"
        :deletable="true"
        :searchable="true"
        :page-size="10"
        :default-keyword="searchKeyword"
        @select="handleApiSelect"
        @delete="handleApiDelete"
        @click="handleVideoClick"
        @search="handleApiSearch"
        @load="handleApiLoad"
        @batch-action="handleApiBatchAction"
      />
    </div>

    <!-- 操作结果展示 -->
    <div class="result-panel">
      <h3>操作日志</h3>
      <div class="log-container">
        <div v-for="(log, index) in operationLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type" :class="log.type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'
import SdkworkVideoList from '@/components/sdkwork-video-list/sdkwork-video-list.vue'
import type { VideoVO } from '@/services/src/service/video/types'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 响应式数据
const searchKeyword = ref('')
const operationLogs = ref<Array<{time: string, type: string, message: string}>>([])

// 组件引用
const apiVideoListRef = ref<InstanceType<typeof SdkworkVideoList>>()

// API模式参数
const apiParams = ref({
  category: 'demo',
  status: 'published'
})

// 自定义API方法 - 模拟API调用
const customApiMethod = async (pageable: Pageable): Promise<Page<VideoVO>> => {
  addLog('API', '调用自定义API方法')
  
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 生成模拟数据
  const page = pageable.page || 0
  const size = pageable.size || 10
  const startIndex = page * size
  const totalElements = 25 // 总共25条模拟数据
  
  // 生成当前页的数据
  const content: VideoVO[] = []
  for (let i = 0; i < size && startIndex + i < totalElements; i++) {
    const index = startIndex + i + 1
    content.push({
      id: `video-${index}`,
      title: `演示视频 ${index}`,
      description: `这是第 ${index} 个演示视频的描述信息，用于展示API模式的效果`,
      duration: Math.floor(Math.random() * 600) + 60, // 60-660秒随机时长    
    })
  }
  
  // 模拟返回数据
  const mockData: Page<VideoVO>|any = {
    content,
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    number: page,
    size,
    first: page === 0,
    last: page >= Math.ceil(totalElements / size) - 1,
    empty: content.length === 0
  }
  
  return mockData
}

// 添加操作日志
const addLog = (type: string, message: string) => {
  operationLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    type,
    message
  })
  
  // 限制日志数量
  if (operationLogs.value.length > 20) {
    operationLogs.value.pop()
  }
}

// API模式事件处理
const handleApiSelect = (video: VideoVO) => {
  addLog('API', `选择了视频: ${video.title}`)
  showToast(`选择了视频: ${video.title}`)
}

const handleApiDelete = (video: VideoVO) => {
  addLog('API', `删除视频请求: ${video.title}`)
  showToast(`删除请求已发送，请父组件处理`)
}

const handleApiSearch = (keyword: string) => {
  addLog('API', `搜索关键词: ${keyword}`)
  searchKeyword.value = keyword
}

const handleApiLoad = (pageData: Page<VideoVO>) => {
  addLog('API', `加载数据完成，共 ${pageData.totalElements} 条记录`)
}

const handleApiBatchAction = (videos: VideoVO[]) => {
  addLog('API', `批量操作 ${videos.length} 个视频`)
  showDialog({
    title: '批量操作',
    message: `将对 ${videos.length} 个视频执行批量操作，请父组件处理`
  })
}

// 通用事件处理
const handleVideoClick = (video: VideoVO) => {
  addLog('CLICK', `点击视频: ${video.title}`)
  showToast(`点击了视频: ${video.title}`)
}

// 控制方法
const refreshApiList = () => {
  apiVideoListRef.value?.refresh()
  addLog('CONTROL', '刷新列表')
}

const clearApiSelection = () => {
  apiVideoListRef.value?.clearSelected()
  addLog('CONTROL', '清空选择')
}

const showApiStats = () => {
  const data = apiVideoListRef.value?.getData() || []
  const selected = apiVideoListRef.value?.getSelectedItems() || []
  addLog('STATS', `数据 ${data.length} 条，选中 ${selected.length} 条`)
  showToast(`数据 ${data.length} 条，选中 ${selected.length} 条`)
}

// 生命周期
onMounted(() => {
  addLog('SYSTEM', '视频列表演示页面已加载')
})
</script>

<style scoped lang="scss">
.video-list-demo {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100dvh;
  background: #f5f5f5;
}

.demo-header {
  background: white;
  padding: 20px 16px;
  margin-bottom: 0;
  border-bottom: 1px solid #e8e8e8;
  
  h1 {
    color: #333;
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

.demo-controls {
  background: white;
  padding: 16px;
  margin-bottom: 0;
  border-bottom: 1px solid #e8e8e8;
}

.control-panel {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.video-list-section {
  margin: 0;
  width: 100%;
  
  :deep(.sdkwork-api-list) {
    width: 100%;
    margin: 0;
    padding: 0;
    
    .list-content {
      padding: 0;
    }
    
    .data-section {
      padding: 0;
    }
  }
}

.result-panel {
  background: white;
  padding: 16px;
  margin-top: 16px;
  border-top: 1px solid #e8e8e8;
  
  h3 {
    margin-bottom: 12px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px;
  background: #fafafa;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 12px;
  
  &:last-child {
    border-bottom: none;
  }
}

.log-time {
  color: #999;
  min-width: 60px;
}

.log-type {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  
  &.API {
    background: #f0f9ff;
    color: #07c160;
  }
  
  &.CLICK {
    background: #fff7e6;
    color: #ff976a;
  }
  
  &.CONTROL {
    background: #f6ffed;
    color: #52c41a;
  }
  
  &.STATS {
    background: #f9f0ff;
    color: #722ed1;
  }
  
  &.SYSTEM {
    background: #f5f5f5;
    color: #666;
  }
}

.log-message {
  color: #333;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-list-demo {
    padding: 0;
  }
  
  .demo-header {
    padding: 16px 12px;
  }
  
  .demo-controls {
    padding: 12px;
  }
  
  .control-panel {
    flex-direction: row;
    gap: 8px;
    justify-content: center;
  }
  
  .result-panel {
    padding: 12px;
    margin-top: 12px;
  }
  
  .log-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .log-time {
    min-width: auto;
  }
}

/* 确保列表项铺满宽度 */
:deep(.sdkwork-cell) {
  margin: 0;
  border-radius: 0;
}

:deep(.van-list) {
  margin: 0;
}

:deep(.sdkwork-pull-refresh) {
  margin: 0;
}
</style>