<template>
  <div v-if="videoUrl" class="feed-video">
    <div class="video-container">
      <video
        :src="videoUrl"
        :poster="thumbnail"
        controls
        class="video-player"
        preload="metadata"
      ></video>
      <div class="video-overlay" v-if="!isPlaying" @click="togglePlay">
        <div class="play-button">
          <Icon icon="ri:play-fill" width="36" height="36" />
        </div>
      </div>
      <div class="video-info" v-if="title || duration">
        <div class="video-title" v-if="title">{{ title }}</div>
        <div class="video-duration" v-if="duration">{{ formatDuration(duration) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  videoUrl: string
  thumbnail?: string
  title?: string
  duration?: number // 以秒为单位
}

const props = withDefaults(defineProps<Props>(), {
  thumbnail: '',
  title: '',
  duration: 0
})

const isPlaying = ref(false)

const emit = defineEmits<{
  play: []
  pause: []
}>()

const togglePlay = () => {
  const video = document.querySelector('.video-player') as HTMLVideoElement
  if (!video) return
  
  if (video.paused) {
    video.play()
    isPlaying.value = true
    emit('play')
  } else {
    video.pause()
    isPlaying.value = false
    emit('pause')
  }
}

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return ''
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.feed-video {
  margin-bottom: 12px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
}

.video-container {
  position: relative;
  width: 100%;
  border-radius: var(--radius, 8px);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-player {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  background: var(--bg-gray, #f5f5f5);
  border-radius: var(--radius, 8px);
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background 0.2s ease;
}

.video-overlay:hover {
  background: rgba(0, 0, 0, 0.2);
}

.play-button {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: var(--color-primary, #1989fa);
  transition: transform 0.2s ease;
}

.play-button:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.video-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-duration {
  font-size: 12px;
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.5);
  display: inline-block;
  padding: 2px 6px;
  border-radius: var(--radius-small, 4px);
}
</style>