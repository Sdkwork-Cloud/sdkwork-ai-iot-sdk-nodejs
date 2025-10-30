<template>
  <div class="message-content-audio">
    <div class="audio-player" :class="{ 'playing': isPlaying, 'short': duration < 10 }">
      <!-- 播放控制区域 -->
      <div class="audio-controls">
        <button class="play-button" @click="togglePlay" :disabled="!audioElement">
          <div class="play-icon-wrapper">
            <Icon v-if="!isPlaying" icon="mdi:play" width="24" height="24" class="play-icon" />
            <Icon v-else icon="mdi:pause" width="24" height="24" class="pause-icon" />
          </div>
        </button>
        
        <!-- 播放时长指示器 -->
        <div class="duration-indicator" v-if="duration > 0">
          <span class="duration-text">{{ formatDuration(duration) }}</span>
        </div>
      </div>
      
      <!-- 进度条区域 -->
      <div class="audio-progress-area">
        <div class="progress-bar" @click="handleProgressClick">
          <div class="progress-background"></div>
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }">
            <div class="progress-handle" v-show="isPlaying"></div>
          </div>
        </div>
        
        <!-- 时间显示 -->
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="separator">/</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
      </div>
      
      <!-- 波形可视化 -->
      <div class="audio-waveform-visualization">
        <div 
          v-for="(bar, index) in waveformBars" 
          :key="index"
          class="waveform-bar"
          :class="{ 'active': isBarActive(index) }"
          :style="{ height: bar + '%' }"
        ></div>
      </div>
    </div>
    
    <!-- 音频描述 -->
    <div v-if="false" class="audio-description">
      <Icon icon="mdi:message-text" width="16" height="16" class="description-icon" />
      <span class="description-text">音频消息</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatMessageVO } from '@/services'

interface Props {
  message: ChatMessageVO
}

const props = defineProps<Props>()

// 响应式数据
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audioElement = ref<HTMLAudioElement | null>(null)

// 模拟波形数据 - 更真实的语音波形
const waveformBars = ref([25, 45, 65, 85, 95, 85, 65, 45, 25, 35, 55, 75, 90, 75, 55, 35])

// 计算属性
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
})

// 格式化时间显示
const formatTime = (seconds: number) => {
  if (seconds <= 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 格式化时长显示（简版）
const formatDuration = (seconds: number) => {
  if (seconds <= 0) return '0s'
  if (seconds < 60) return `${Math.round(seconds)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 检查波形条是否处于活动状态（根据播放进度）
const isBarActive = (index: number) => {
  if (!isPlaying.value || duration.value === 0) return false
  const barProgress = (index / waveformBars.value.length) * 100
  return barProgress <= progressPercentage.value
}

// 初始化音频
onMounted(() => {
  // 从消息中获取音频URL和时长
  const audioUrl = String(props.message.content || '')
  const audioDuration = 0 // ChatMessageVO可能没有duration属性，使用默认值
  
  if (audioUrl) {
    audioElement.value = new Audio(audioUrl)
    audioElement.value.addEventListener('loadedmetadata', () => {
      // 使用音频文件的元数据获取时长
      duration.value = audioElement.value?.duration || 0
    })
    audioElement.value.addEventListener('timeupdate', () => {
      currentTime.value = audioElement.value?.currentTime || 0
    })
    audioElement.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
    })
  }
})

// 清理资源
onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
})

// 切换播放状态
const togglePlay = () => {
  if (!audioElement.value) return
  
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// 处理进度条点击
const handleProgressClick = (event: MouseEvent) => {
  if (!audioElement.value || duration.value === 0) return
  
  const progressBar = event.currentTarget as HTMLDivElement
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value
  
  audioElement.value.currentTime = newTime
  currentTime.value = newTime
}
</script>

<style scoped>
.message-content-audio {
  max-width: 250px;
}

.audio-player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 20px;
}

.play-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.play-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.audio-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  height: 4px;
  background-color: #dee2e6;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  border-radius: 2px;
  transition: width 0.1s ease;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #666;
}

.audio-waveform {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 30px;
}

.waveform-bar {
  width: 2px;
  background-color: #007bff;
  border-radius: 1px;
  transition: height 0.3s ease;
}

.audio-description {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .audio-player {
    padding: 10px;
    gap: 10px;
  }
  
  .play-button {
    width: 36px;
    height: 36px;
  }
  
  .audio-waveform {
    height: 25px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .audio-player {
    background-color: #2d2d2d;
  }
  
  .progress-bar {
    background-color: #404040;
  }
  
  .time-display {
    color: #aaa;
  }
  
  .audio-description {
    color: #aaa;
  }
}
</style>