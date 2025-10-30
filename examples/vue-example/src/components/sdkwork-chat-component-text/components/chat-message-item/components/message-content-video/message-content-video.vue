<template>
  <div class="message-content-video">
    <div class="video-container" @click="togglePlay">
      <video
        ref="videoElement"
        :src="videoUrl"
        :poster="videoPoster"
        class="message-video"
        @loadedmetadata="handleVideoLoad"
        @timeupdate="handleTimeUpdate"
        @ended="handleVideoEnd"
      />
      
      <!-- 视频控制层 -->
      <div v-if="!isPlaying" class="video-overlay">
        <button class="play-button">
          <Icon icon="mdi:play" width="24" height="24" class="play-icon" />
        </button>
        <div v-if="videoDuration > 0" class="video-duration">
          {{ formatTime(videoDuration) }}
        </div>
      </div>
      
      <!-- 播放控制条 -->
      <div v-if="isPlaying" class="video-controls">
        <div class="progress-bar" @click.stop="handleProgressClick">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="control-buttons">
          <button class="control-button" @click.stop="togglePlay">
            <Icon icon="mdi:pause" width="24" height="24" class="pause-icon" />
          </button>
          <div class="time-display">
            {{ formatTime(currentTime) }} / {{ formatTime(videoDuration) }}
          </div>
          <button class="control-button" @click.stop="toggleMute">
            <Icon v-if="isMuted" icon="mdi:volume-off" width="24" height="24" class="mute-icon" />
            <Icon v-else icon="mdi:volume-high" width="24" height="24" class="volume-icon" />
          </button>
        </div>
      </div>
      
      <!-- 加载指示器 -->
      <div v-if="loading" class="video-loading">
        <div class="loading-spinner"></div>
      </div>
    </div>
    
    <div v-if="false" class="video-description">
      <!-- ChatMessageVO没有description属性 -->
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
const videoElement = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const currentTime = ref(0)
const videoDuration = ref(0)
const loading = ref(true)

// 计算属性
const videoUrl = computed(() => {
  return String(props.message.content || '')
})

const videoPoster = computed(() => {
  return ''
})

const progressPercentage = computed(() => {
  if (videoDuration.value === 0) return 0
  return (currentTime.value / videoDuration.value) * 100
})

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 视频加载完成
const handleVideoLoad = () => {
  loading.value = false
  videoDuration.value = videoElement.value?.duration || 0
}

// 时间更新
const handleTimeUpdate = () => {
  currentTime.value = videoElement.value?.currentTime || 0
}

// 视频播放结束
const handleVideoEnd = () => {
  isPlaying.value = false
  currentTime.value = 0
}

// 切换播放状态
const togglePlay = () => {
  if (!videoElement.value) return
  
  if (isPlaying.value) {
    videoElement.value.pause()
  } else {
    videoElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// 切换静音
const toggleMute = () => {
  if (!videoElement.value) return
  videoElement.value.muted = !videoElement.value.muted
  isMuted.value = videoElement.value.muted
}

// 处理进度条点击
const handleProgressClick = (event: MouseEvent) => {
  if (!videoElement.value || videoDuration.value === 0) return
  
  const progressBar = event.currentTarget as HTMLDivElement
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * videoDuration.value
  
  videoElement.value.currentTime = newTime
  currentTime.value = newTime
}

// 清理资源
onUnmounted(() => {
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value = null
  }
})
</script>

<style scoped>
.message-content-video {
  max-width: 300px;
}

.video-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: #000;
  cursor: pointer;
}

.message-video {
  width: 100%;
  height: auto;
  display: block;
  max-height: 200px;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
}

.play-button {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.play-button:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

.play-icon {
  font-size: 24px;
  margin-left: 4px;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-container:hover .video-controls {
  opacity: 1;
}

.progress-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  border-radius: 2px;
  transition: width 0.1s ease;
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.control-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.time-display {
  color: white;
  font-size: 12px;
}

.video-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-description {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-content-video {
    max-width: 250px;
  }
  
  .message-video {
    max-height: 180px;
  }
  
  .play-button {
    width: 50px;
    height: 50px;
  }
  
  .video-controls {
    padding: 8px;
  }
}

/* 触摸设备优化 */
@media (hover: none) {
  .video-controls {
    opacity: 1;
  }
}
</style>