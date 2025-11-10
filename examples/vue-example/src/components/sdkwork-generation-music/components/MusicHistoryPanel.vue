<template>
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    round
    :style="{ height: '70%' }"
  >
    <div class="history-panel">
      <!-- 面板头部 -->
      <div class="panel-header">
        <h3>生成历史</h3>
        <van-button 
          type="primary" 
          size="small" 
          @click="closePanel"
          class="close-btn"
        >
          关闭
        </van-button>
      </div>
      
      <!-- 历史列表 -->
      <div class="history-content">
        <div v-if="historyList.length === 0" class="empty-state">
          <van-icon name="music-o" class="empty-icon" />
          <p class="empty-text">暂无生成历史</p>
          <p class="empty-desc">开始生成您的第一首音乐吧！</p>
        </div>
        
        <div v-else class="history-list">
          <div 
            v-for="item in historyList" 
            :key="item.id"
            class="history-item"
            @click="selectHistory(item)"
          >
            <div class="item-header">
              <h4 class="item-title">{{ item.title }}</h4>
              <span class="item-time">{{ formatTime(item.time) }}</span>
            </div>
            
            <div class="item-info">
              <van-tag 
                v-if="item.style" 
                type="primary"  
                class="info-tag"
              >
                {{ item.style }}
              </van-tag>
              <van-tag 
                v-if="item.emotion" 
                type="success"  
                class="info-tag"
              >
                {{ item.emotion }}
              </van-tag>
              <van-tag 
                v-if="item.duration" 
                type="warning"  
                class="info-tag"
              >
                {{ item.duration }}s
              </van-tag>
            </div>
            
            <div class="item-actions">
              <van-button 
                type="primary" 
                size="mini" 
                @click.stop="playMusic(item)"
                class="action-btn"
              >
                <van-icon name="play" />
                播放
              </van-button>
              <van-button 
                type="default" 
                size="mini" 
                @click.stop="downloadMusic(item)"
                class="action-btn"
              >
                <van-icon name="down" />
                下载
              </van-button>
              <van-button 
                type="danger" 
                size="mini" 
                @click.stop="deleteHistory(item)"
                class="action-btn"
              >
                <van-icon name="delete" />
                删除
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface HistoryItem {
  id: string
  title: string
  style: string
  emotion: string
  duration: number
  time: Date
  audioUrl?: string
}

interface Props {
  show: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'select', item: HistoryItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// popup显示状态
const showPopup = ref(false)

// 监听外部show prop变化
watch(() => props.show, (newValue) => {
  showPopup.value = newValue
})

// 监听popup显示状态变化
watch(showPopup, (newValue) => {
  emit('update:show', newValue)
})

// 关闭面板
const closePanel = () => {
  showPopup.value = false
}

// 模拟历史数据
const historyList = ref<HistoryItem[]>([
  {
    id: '1',
    title: '轻快的夏日旋律',
    style: '流行',
    emotion: '快乐',
    duration: 180,
    time: new Date('2024-01-15 14:30:00')
  },
  {
    id: '2',
    title: '宁静的夜晚钢琴曲',
    style: '古典',
    emotion: '平静',
    duration: 240,
    time: new Date('2024-01-14 20:15:00')
  },
  {
    id: '3',
    title: '动感电子舞曲',
    style: '电子',
    emotion: '激动',
    duration: 210,
    time: new Date('2024-01-13 16:45:00')
  }
])

// 格式化时间
const formatTime = (time: Date) => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 1天内
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) { // 1周内
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return time.toLocaleDateString()
  }
}

// 选择历史记录
const selectHistory = (item: HistoryItem) => {
  emit('select', item)
  closePanel()
}

// 播放音乐
const playMusic = (item: HistoryItem) => {
  console.log('播放音乐:', item.title)
  // 这里应该调用播放音乐的API
}

// 下载音乐
const downloadMusic = (item: HistoryItem) => {
  console.log('下载音乐:', item.title)
  // 这里应该调用下载音乐的API
}

// 删除历史记录
const deleteHistory = (item: HistoryItem) => {
  const index = historyList.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    historyList.value.splice(index, 1)
  }
}
</script>

<style scoped>
.history-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
}

.panel-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: white;
}

.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--border-color);
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  opacity: 0.7;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: var(--accent-blue);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.item-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  margin-right: 12px;
}

.item-time {
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
}

.item-info {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.info-tag {
  font-size: 10px;
  padding: 2px 6px;
}

.item-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  font-size: 10px;
  padding: 4px 8px;
}

.action-btn .van-icon {
  margin-right: 4px;
  font-size: 12px;
}

:deep(.van-button--primary) {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
}

:deep(.van-button--default) {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.van-button--danger) {
  background: #ff4444;
  border-color: #ff4444;
}
</style>