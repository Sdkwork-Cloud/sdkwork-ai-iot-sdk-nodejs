<template>
  <div 
    class="fullscreen-display" 
    :style="containerStyle"
    @click="$emit('click')"
  >
    <div class="subtitle-content" :style="contentStyle">
      <div 
        v-if="currentEntry" 
        class="subtitle-text"
        :class="{ 'animate-in': isNewEntry, 'animate-out': isLeaving }"
        :style="textStyle"
      >
        {{ currentEntry.text }}
      </div>
      
      <div v-else class="no-subtitle">
        <sdkwork-icon icon="mdi:subtitles-outline" class="no-subtitle-icon" />
        <span class="no-subtitle-text">暂无字幕</span>
      </div>
    </div>
    
    <!-- 进度指示器 -->
    <div v-if="currentEntry" class="progress-indicator">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SubtitleEntry } from '@/core/subtitles'

interface Props {
  currentEntry?: SubtitleEntry | null
  config: any
  currentTime: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

// 动画状态
const isNewEntry = ref(false)
const isLeaving = ref(false)
const lastEntryId = ref<string>('')

// 计算属性
const containerStyle = computed(() => ({
  '--font-size': `${props.config.fontSize * 2}px`,
  '--font-color': props.config.fontColor,
  '--background-color': props.config.backgroundColor
}))

const contentStyle = computed(() => ({
  fontSize: `var(--font-size)`,
  color: `var(--font-color)`,
  backgroundColor: props.config.showBackground ? `var(--background-color)` : 'transparent',
  padding: props.config.showBackground ? '20px 30px' : '0',
  borderRadius: props.config.showBackground ? '12px' : '0'
}))

const textStyle = computed(() => ({
  fontSize: `var(--font-size)`,
  color: `var(--font-color)`,
  textShadow: props.config.showBackground ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.8)'
}))

const progressPercentage = computed(() => {
  if (!props.currentEntry || !props.currentEntry.startTime || !props.currentEntry.endTime) {
    return 0
  }
  
  const entryDuration = props.currentEntry.endTime - props.currentEntry.startTime
  const elapsed = props.currentTime - props.currentEntry.startTime
  return Math.min(100, Math.max(0, (elapsed / entryDuration) * 100))
})

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
.fullscreen-display {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
}

.subtitle-content {
  max-width: 80%;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.subtitle-text {
  font-size: var(--font-size);
  color: var(--font-color);
  line-height: 1.4;
  word-wrap: break-word;
  transition: all 0.3s ease;
}

/* 进入动画 */
.subtitle-text.animate-in {
  animation: fadeInUp 0.3s ease-out;
}

/* 离开动画 */
.subtitle-text.animate-out {
  animation: fadeOutDown 0.3s ease-in;
}

.no-subtitle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0.6;
}

.no-subtitle-icon {
  width: 48px;
  height: 48px;
  color: var(--font-color);
}

.no-subtitle-text {
  font-size: 18px;
  color: var(--font-color);
}

.progress-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--font-color);
  transition: width 0.1s linear;
  border-radius: 2px;
}

/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .subtitle-content {
    max-width: 90%;
    padding: 15px 20px !important;
  }
  
  .subtitle-text {
    font-size: calc(var(--font-size) * 0.8);
  }
  
  .progress-indicator {
    bottom: 20px;
    width: 150px;
  }
}
</style>