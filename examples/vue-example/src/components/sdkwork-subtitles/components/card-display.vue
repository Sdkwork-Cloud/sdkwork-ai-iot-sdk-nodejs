<template>
  <div class="card-display" :style="containerStyle">
    <div 
      v-if="currentEntry" 
      class="subtitle-card"
      :class="{ 'animate-in': isNewEntry, 'animate-out': isLeaving }"
      :style="cardStyle"
    >
      <div class="card-content">
        <div class="subtitle-text" :style="textStyle">
          {{ currentEntry.text }}
        </div>
        
        <!-- 时间信息 -->
        <div v-if="showTimeInfo" class="time-info">
          <span class="time-text">{{ formatTime(currentEntry.startTime || 0) }}</span>
          <div class="time-separator"></div>
          <span class="time-text">{{ formatTime(currentEntry.endTime || 0) }}</span>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div v-if="showProgress" class="card-progress">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        />
      </div>
    </div>
    
    <div v-else-if="showEmptyState" class="no-subtitle-card">
      <sdkwork-icon icon="mdi:subtitles-outline" class="no-subtitle-icon" />
      <span class="no-subtitle-text">暂无字幕</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SubtitleEntry } from '@/core/subtitles'

// Props定义
interface Props {
  currentEntry?: SubtitleEntry | null
  config?: any
  currentTime?: number
  showEmptyState?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showEmptyState: true
})


// 配置选项
const showTimeInfo = true
const showProgress = true

// 动画状态
const isNewEntry = ref(false)
const isLeaving = ref(false)
const lastEntryId = ref<string>('')

// 计算属性
const containerStyle = computed(() => ({
  '--font-size': `${props.config.fontSize}px`,
  '--font-color': props.config.fontColor,
  '--background-color': props.config.backgroundColor,
  '--card-padding': '16px 20px'
}))

const cardStyle = computed(() => ({
  background: props.config.showBackground ? `var(--background-color)` : 'rgba(0, 0, 0, 0.8)',
  border: props.config.showBackground ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: props.config.showBackground ? 'none' : 'blur(10px)'
}))

const textStyle = computed(() => ({
  fontSize: `var(--font-size)`,
  color: `var(--font-color)`,
  lineHeight: '1.5'
}))

const progressPercentage = computed(() => {
  if (!props.currentEntry || !props.currentEntry.startTime || !props.currentEntry.endTime || !props.currentTime) {
    return 0
  }
  
  const entryDuration = props.currentEntry.endTime - props.currentEntry.startTime
  const elapsed = props.currentTime - props.currentEntry.startTime
  return Math.min(100, Math.max(0, (elapsed / entryDuration) * 100))
})

// 时间格式化函数
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 监听字幕条目变化，触发动画
watch(() => props.currentEntry, (newEntry, oldEntry) => {
  if (newEntry !== oldEntry) {
    const newId = `${newEntry?.startTime}-${newEntry?.endTime}`
    
    if (newId !== lastEntryId.value) {
      // 新字幕进入动画
      isNewEntry.value = true
      isLeaving.value = false
      
      setTimeout(() => {
        isNewEntry.value = false
      }, 300)
      
      // 旧字幕离开动画
      if (oldEntry) {
        isLeaving.value = true
        setTimeout(() => {
          isLeaving.value = false
        }, 300)
      }
      
      lastEntryId.value = newId || ''
    }
  }
}, { immediate: true })
</script>

<style scoped>
.card-display {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.subtitle-card {
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.card-content {
  padding: var(--card-padding);
}

.subtitle-text {
  font-size: var(--font-size);
  color: var(--font-color);
  text-align: center;
  line-height: 1.5;
  word-wrap: break-word;
  margin-bottom: 12px;
}

.time-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.time-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Courier New', monospace;
}

.time-separator {
  width: 20px;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.card-progress {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: var(--font-color);
  transition: width 0.1s linear;
  border-radius: 0 0 2px 2px;
}

.no-subtitle-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  opacity: 0.6;
}

.no-subtitle-icon {
  width: 32px;
  height: 32px;
  color: var(--font-color);
  margin-bottom: 8px;
}

.no-subtitle-text {
  font-size: 14px;
  color: var(--font-color);
}

/* 进入动画 */
.subtitle-card.animate-in {
  animation: cardSlideIn 0.3s ease-out;
}

/* 离开动画 */
.subtitle-card.animate-out {
  animation: cardSlideOut 0.3s ease-in;
}

/* 悬停效果 */
.subtitle-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

/* 动画定义 */
@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cardSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-display {
    max-width: 100%;
    padding: 10px;
  }
  
  .subtitle-card {
    border-radius: 8px;
  }
  
  .card-content {
    padding: 12px 16px !important;
  }
  
  .subtitle-text {
    font-size: calc(var(--font-size) * 0.9);
  }
  
  .time-text {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .subtitle-text {
    font-size: calc(var(--font-size) * 0.8);
  }
  
  .no-subtitle-card {
    padding: 30px 15px;
  }
}
</style>