<template>
  <sdkwork-page-container 
    safe-area
    scrollable
    theme-mode="auto"
    title="字幕组件演示"
  >
    <div class="subtitles-demo">
      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="control-group">
          <h3 class="section-title">播放控制</h3>
          <div class="control-row">
            <van-button 
              :type="isPlaying ? 'danger' : 'primary'"
              @click="togglePlay"
            >
              {{ isPlaying ? '暂停' : '播放' }}
            </van-button>
            <van-button type="default" @click="reset">重置</van-button>
            <van-button type="default" @click="addDynamicSubtitle">添加动态字幕</van-button>
          </div>
          
          <div class="time-control">
            <span class="time-label">当前时间: {{ formatTime(currentTime) }}</span>
            <input 
              type="range" 
              v-model="currentTime" 
              min="0" 
              max="60000" 
              step="1000"
              class="time-slider"
            />
          </div>
        </div>

        <div class="control-group">
          <h3 class="section-title">字幕配置</h3>
          <div class="config-row">
            <label class="config-label">
              <input type="checkbox" v-model="showControls" />
              显示控制面板
            </label>
            <label class="config-label">
              <input type="checkbox" v-model="autoScroll" />
              自动滚动
            </label>
          </div>
          
          <div class="config-row">
            <label class="config-label">
              显示模式:
              <select v-model="displayMode">
                <option value="card">卡片模式</option>
                <option value="line">行模式</option>
                <option value="fullscreen">全屏模式</option>
              </select>
            </label>
            
            <label class="config-label">
              字体大小:
              <input type="number" v-model="fontSize" min="12" max="48" />
            </label>
          </div>
        </div>
      </div>

      <!-- 字幕组件演示区域 -->
      <div class="demo-area">
        <div class="video-container">
          <div class="video-placeholder">
            <div class="video-content">
              <div class="video-title">视频播放器演示</div>
              <div class="video-time">{{ formatTime(currentTime) }}</div>
              <div class="video-status">
                {{ isPlaying ? '播放中' : '已暂停' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 字幕组件 -->
        <sdkwork-subtitles
          :content="subtitleContent"
          :format="subtitleFormat"
          :display-mode="displayMode"
          :line-count="lineCount"
          :font-size="fontSize"
          :font-color="fontColor"
          :background-color="backgroundColor"
          :show-background="showBackground"
          :position="position"
          :auto-scroll="autoScroll"
          :scroll-speed="scrollSpeed"
          :current-time="currentTime"
          :is-playing="isPlaying"
          :show-controls="showControls"
          :duration="duration"
          @load-start="handleLoadStart"
          @load-complete="handleLoadComplete"
          @load-error="handleLoadError"
          @entry-change="handleEntryChange"
          @seek-to="handleSeekTo"
        />
      </div>

      <!-- 日志区域 -->
      <div class="log-panel">
        <h3 class="section-title">事件日志</h3>
        <div class="log-content">
          <div 
            v-for="(log, index) in eventLogs" 
            :key="index"
            class="log-entry"
            :class="log.type"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { SubtitleFormat, Subtitles } from '@/core/subtitles'
import { SubtitleDisplayMode } from '@/stores/modules/subtitles/types'

// 播放状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(60000) // 1分钟

// 字幕配置
const showControls = ref(true)
const autoScroll = ref(true)
const displayMode = ref<SubtitleDisplayMode>(SubtitleDisplayMode.CARD)
const lineCount = ref(3)
const fontSize = ref(16)
const fontColor = ref('#ffffff')
const backgroundColor = ref('rgba(0, 0, 0, 0.7)')
const showBackground = ref(true)
const position = ref<any>('bottom')
const scrollSpeed = ref(1)

// 字幕内容
const subtitleContent = ref(`[00:00.00]欢迎使用字幕组件演示
[00:05.00]这是一个测试字幕文件
[00:10.00]支持多种显示模式和配置选项
[00:15.00]您可以实时调整各种参数
[00:20.00]观察字幕组件的不同表现
[00:25.00]卡片模式适合显示单行字幕
[00:30.00]行模式适合显示多行内容
[00:35.00]全屏模式提供沉浸式体验
[00:40.00]动态字幕功能可以实时添加内容
[00:45.00]字幕搜索和过滤功能
[00:50.00]时间轴跳转和播放控制
[00:55.00]感谢使用SDKWork字幕组件`)

const subtitleFormat = ref<SubtitleFormat>(SubtitleFormat.LRC)

// 事件日志
interface EventLog {
  time: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const eventLogs = ref<EventLog[]>([])

// 播放控制
let playInterval: number | null = null

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  
  if (isPlaying.value) {
    playInterval = setInterval(() => {
      if (currentTime.value < duration.value) {
        currentTime.value += 1000
      } else {
        isPlaying.value = false
        if (playInterval) {
          clearInterval(playInterval)
          playInterval = null
        }
      }
    }, 1000)
    
    addLog('info', '开始播放')
  } else {
    if (playInterval) {
      clearInterval(playInterval)
      playInterval = null
    }
    addLog('info', '暂停播放')
  }
}

const reset = () => {
  currentTime.value = 0
  isPlaying.value = false
  if (playInterval) {
    clearInterval(playInterval)
    playInterval = null
  }
  addLog('info', '重置播放器')
}

const addDynamicSubtitle = () => {
  const dynamicTime = currentTime.value + 5000
  const dynamicText = `[动态字幕] 当前时间: ${formatTime(dynamicTime)}`
  
  // 这里应该调用store的addDynamicSubtitle方法
  // 简化处理，直接添加到日志
  addLog('success', `添加动态字幕: ${dynamicText}`)
}

// 事件处理
const handleLoadStart = (time: number) => {
  addLog('info', `字幕加载开始: ${formatTime(time)}`)
}

const handleLoadComplete = (time: number) => {
  addLog('success', `字幕加载完成: ${formatTime(time)}`)
}

const handleLoadError = (error: string, time: number) => {
  addLog('error', `字幕加载错误: ${error} (${formatTime(time)})`)
}

const handleEntryChange = (entry: any, time: number) => {
  if (entry) {
    addLog('info', `字幕条目变更: "${entry.text}" (${formatTime(time)})`)
  }
}

const handleSeekTo = (time: number) => {
  currentTime.value = time
  addLog('warning', `跳转到: ${formatTime(time)}`)
}

// 工具函数
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const addLog = (type: EventLog['type'], message: string) => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  
  eventLogs.value.unshift({
    time,
    message,
    type
  })
  
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

onMounted(() => {
  addLog('info', '字幕演示页面已加载')
})

onUnmounted(() => {
  if (playInterval) {
    clearInterval(playInterval)
  }
})
</script>

<style scoped>
.subtitles-demo {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.control-panel {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.control-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.time-control {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.time-label {
  font-size: 14px;
  color: #666;
  min-width: 120px;
}

.time-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #ddd;
  outline: none;
}

.config-row {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.config-label input[type="number"] {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.config-label select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.demo-area {
  position: relative;
  margin-bottom: 20px;
}

.video-container {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.video-placeholder {
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.video-content {
  text-align: center;
}

.video-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.video-time {
  font-size: 18px;
  margin-bottom: 4px;
}

.video-status {
  font-size: 14px;
  opacity: 0.8;
}

.log-panel {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.log-entry.info {
  background: #e3f2fd;
  color: #1976d2;
}

.log-entry.success {
  background: #e8f5e8;
  color: #388e3c;
}

.log-entry.warning {
  background: #fff3e0;
  color: #f57c00;
}

.log-entry.error {
  background: #ffebee;
  color: #d32f2f;
}

.log-time {
  font-weight: 600;
  min-width: 60px;
}

.log-message {
  flex: 1;
}

@media (max-width: 768px) {
  .subtitles-demo {
    padding: 12px;
  }
  
  .control-row,
  .config-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .time-control {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>