<template>
  <div v-if="audioUrl" class="feed-audio">
    <div class="audio-player">
      <div class="audio-info">
        <div class="audio-icon">
          <Icon icon="ri:music-2-line" width="24" height="24" />
        </div>
        <div class="audio-details">
          <div class="audio-title">{{ title || '语音消息' }}</div>
          <div class="audio-meta">
            <span class="duration" v-if="duration">{{ formatDuration(duration) }}</span>
            <span class="size" v-if="fileSize">{{ formatFileSize(fileSize) }}</span>
          </div>
        </div>
      </div>
      <div class="audio-controls">
        <button class="play-button" @click="togglePlay">
          <Icon :icon="isPlaying ? 'ri:pause-fill' : 'ri:play-fill'" width="20" height="20" />
        </button>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="time-display">
            <span>{{ formatTime(currentTime) }} / {{ formatTime(duration || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioRef"
      :src="audioUrl"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
      preload="metadata"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  audioUrl: string
  title?: string
  duration?: number // 以秒为单位
  fileSize?: number // 以字节为单位
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  duration: 0,
  fileSize: 0
})

const emit = defineEmits<{
  play: []
  pause: []
}>()

const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(0)

const progressPercentage = computed(() => {
  if (!audioDuration.value) return 0
  return (currentTime.value / audioDuration.value) * 100
})

const togglePlay = () => {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    emit('pause')
  } else {
    audioRef.value.play()
    isPlaying.value = true
    emit('play')
  }
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (audioRef.value) {
    audioDuration.value = audioRef.value.duration || props.duration || 0
  }
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return ''
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatTime = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.feed-audio {
  margin-bottom: 12px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
}

.audio-player {
  background: var(--bg-page, #f7f8fa);
  border-radius: var(--radius, 8px);
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.audio-player:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.audio-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.audio-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-primary, #1989fa);
  color: white;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.audio-details {
  flex: 1;
  min-width: 0;
}

.audio-title {
  font-weight: 500;
  color: var(--text-primary, #323233);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audio-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary, #969799);
}

.audio-controls {
  display: flex;
  align-items: center;
}

.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-primary, #1989fa);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 12px;
  transition: all 0.2s ease;
}

.play-button:hover {
  background: var(--color-primary-dark, #1378d0);
  transform: scale(1.05);
}

.progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  height: 4px;
  background: var(--border-color, #ebedf0);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress {
  height: 100%;
  background: var(--color-primary, #1989fa);
  transition: width 0.1s linear;
}

.time-display {
  font-size: 12px;
  color: var(--text-secondary, #969799);
}
</style>