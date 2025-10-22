<template>
  <div class="line-display" :style="containerStyle">
    <div class="lines-container" :style="{ '--line-count': config.lineCount }">
      <div 
        v-for="(line, index) in displayLines" 
        :key="index"
        class="subtitle-line"
        :class="{ 
          'active': isActiveLine(index),
          'previous': isPreviousLine(index),
          'next': isNextLine(index)
        }"
        :style="lineStyle"
      >
        <div class="line-content">
          <span class="line-text">{{ line.text }}</span>
          
          <!-- 行进度指示器 -->
          <div v-if="showLineProgress && isActiveLine(index)" class="line-progress">
            <div 
              class="line-progress-fill" 
              :style="{ width: lineProgressPercentage + '%' }"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="displayLines.length === 0" class="no-subtitle-lines">
      <sdkwork-icon icon="mdi:subtitles-outline" class="no-subtitle-icon" />
      <span class="no-subtitle-text">暂无字幕</span>
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

// 配置选项
const showLineProgress = true
const enableSmoothScrolling = true

// 响应式数据
const displayLines = ref<Array<{text: string, startTime?: number, endTime?: number}>>([])
const lineHistory = ref<Array<SubtitleEntry>>([])

// 计算属性
const containerStyle = computed(() => ({
  '--font-size': `${props.config.fontSize}px`,
  '--font-color': props.config.fontColor,
  '--background-color': props.config.backgroundColor,
  '--line-height': `${props.config.fontSize * 1.8}px`,
  '--line-spacing': '8px'
}))

const lineStyle = computed(() => ({
  fontSize: `var(--font-size)`,
  color: `var(--font-color)`,
  height: `var(--line-height)`,
  lineHeight: `var(--line-height)`
}))

const lineProgressPercentage = computed(() => {
  if (!props.currentEntry || !props.currentEntry.startTime || !props.currentEntry.endTime) {
    return 0
  }
  
  const entryDuration = props.currentEntry.endTime - props.currentEntry.startTime
  const elapsed = props.currentTime - props.currentEntry.startTime
  return Math.min(100, Math.max(0, (elapsed / entryDuration) * 100))
})

// 判断行状态
const isActiveLine = (index: number): boolean => {
  return index === 0 && !!props.currentEntry
}

const isPreviousLine = (index: number): boolean => {
  return index > 0 && index < displayLines.value.length - 1
}

const isNextLine = (index: number): boolean => {
  return index === displayLines.value.length - 1 && displayLines.value.length > 1
}

// 更新显示行
const updateDisplayLines = () => {
  if (!props.currentEntry) {
    // 如果没有当前字幕，清空显示
    if (enableSmoothScrolling) {
      // 平滑滚动清空
      setTimeout(() => {
        displayLines.value = []
        lineHistory.value = []
      }, 300)
    } else {
      displayLines.value = []
      lineHistory.value = []
    }
    return
  }

  // 添加到历史记录
  if (!lineHistory.value.some(entry => 
    entry.startTime === props.currentEntry?.startTime && 
    entry.endTime === props.currentEntry?.endTime
  )) {
    lineHistory.value.unshift(props.currentEntry)
    
    // 限制历史记录长度
    if (lineHistory.value.length > props.config.lineCount * 2) {
      lineHistory.value = lineHistory.value.slice(0, props.config.lineCount * 2)
    }
  }

  // 构建显示行
  const lines = []
  
  // 当前行
  lines.push({
    text: props.currentEntry.text || '',
    startTime: props.currentEntry.startTime,
    endTime: props.currentEntry.endTime
  })

  // 添加历史行
  const historyLines = lineHistory.value.slice(1, props.config.lineCount)
  historyLines.forEach(entry => {
    lines.push({
      text: entry.text || '',
      startTime: entry.startTime,
      endTime: entry.endTime
    })
  })

  // 限制行数
  displayLines.value = lines.slice(0, props.config.lineCount)
}

// 监听字幕条目变化
watch(() => props.currentEntry, (newEntry) => {
  updateDisplayLines()
}, { immediate: true })

// 监听配置变化
watch(() => props.config.lineCount, () => {
  updateDisplayLines()
})
</script>

<style scoped>
.line-display {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.lines-container {
  display: flex;
  flex-direction: column;
  gap: var(--line-spacing);
  min-height: calc(var(--line-height) * var(--line-count) + var(--line-spacing) * (var(--line-count) - 1));
  transition: all 0.3s ease;
}

.subtitle-line {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  opacity: 0.6;
  transform: translateY(10px);
}

.subtitle-line.active {
  opacity: 1;
  transform: translateY(0);
  font-weight: 600;
}

.subtitle-line.previous {
  opacity: 0.8;
  transform: translateY(0);
}

.subtitle-line.next {
  opacity: 0.4;
  transform: translateY(5px);
}

.line-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.line-text {
  font-size: var(--font-size);
  color: var(--font-color);
  line-height: var(--line-height);
  word-wrap: break-word;
  transition: all 0.3s ease;
}

.line-progress {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  overflow: hidden;
}

.line-progress-fill {
  height: 100%;
  background: var(--font-color);
  transition: width 0.1s linear;
  border-radius: 1px;
}

.no-subtitle-lines {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(var(--line-height) * var(--line-count) + var(--line-spacing) * (var(--line-count) - 1));
  opacity: 0.6;
}

.no-subtitle-icon {
  width: 24px;
  height: 24px;
  color: var(--font-color);
  margin-bottom: 8px;
}

.no-subtitle-text {
  font-size: 14px;
  color: var(--font-color);
}

/* 滚动动画 */
.lines-container {
  animation: linesSlide 0.3s ease-out;
}

@keyframes linesSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .line-display {
    max-width: 100%;
    padding: 10px;
  }
  
  .lines-container {
    gap: calc(var(--line-spacing) * 0.8);
  }
  
  .subtitle-line {
    font-size: calc(var(--font-size) * 0.9);
  }
  
  .line-text {
    font-size: calc(var(--font-size) * 0.9);
  }
}

@media (max-width: 480px) {
  .line-display {
    padding: 5px;
  }
  
  .lines-container {
    gap: calc(var(--line-spacing) * 0.6);
  }
  
  .subtitle-line {
    font-size: calc(var(--font-size) * 0.8);
  }
  
  .line-text {
    font-size: calc(var(--font-size) * 0.8);
  }
  
  .no-subtitle-lines {
    height: calc(var(--line-height) * var(--line-count) * 0.8);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .subtitle-line {
    opacity: 1;
  }
  
  .subtitle-line.active {
    opacity: 1;
    text-shadow: 0 0 2px currentColor;
  }
  
  .subtitle-line.previous {
    opacity: 0.9;
  }
  
  .subtitle-line.next {
    opacity: 0.7;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .subtitle-line,
  .lines-container {
    transition: none;
    animation: none;
  }
  
  .line-progress-fill {
    transition: none;
  }
}
</style>