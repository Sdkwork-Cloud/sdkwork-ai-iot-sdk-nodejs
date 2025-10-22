<template>
  <div class="cover-component" :class="mode">
    <div class="cover-art" :style="{ backgroundImage: `url(${cover || defaultCover})` }">
      <div v-if="!cover" class="cover-placeholder">
        <Icon icon="mdi:music" class="music-icon" />
      </div>
    </div> 
    <slot name="cover-custom" :cover="cover" :title="title" :artist="artist"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePlayerStore } from '@/stores/modules/player'

interface Props {
  cover?: string
  title?: string
  artist?: string
  themeColor?: string
  mode?: 'card' | 'bottom-bar' | 'fullscreen'
}

const props = withDefaults(defineProps<Props>(), {
  themeColor: '#3b82f6',
  mode: 'card'
})

const playerStore = usePlayerStore()

// 计算属性 - 优先使用props传入的值，其次使用store中的当前曲目
const currentTrack = computed(() => playerStore.currentTrack)
const cover = computed(() => props.cover || currentTrack.value?.cover || '')
const title = computed(() => props.title || currentTrack.value?.title || 'Unknown Title')
const artist = computed(() => props.artist || currentTrack.value?.artist || 'Unknown Artist')

const defaultCover = computed(() => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${props.themeColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${lightenColor(props.themeColor, 0.3)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#grad)" rx="20"/>
      <circle cx="100" cy="100" r="60" fill="white" opacity="0.2"/>
      <path d="M80,70 L80,130 L130,100 Z" fill="white"/>
    </svg>
  `)}`
})

const lightenColor = (color: string, amount: number): string => {
  return color
}
</script>

<style scoped>
.cover-component {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cover-component.fullscreen {
  flex-direction: column;
  gap: 24px;
}

.cover-art {
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  border-radius: 12px;
}

.cover-component.card .cover-art {
  width: 60px;
  height: 60px;
}

.cover-component.bottom-bar .cover-art {
  width: 48px;
  height: 48px;
}

.cover-component.fullscreen .cover-art {
  width: 300px;
  height: 300px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  /* 安全区域适配 - 确保封面不会超出屏幕 */
  max-width: calc(100vw - max(40px, env(safe-area-inset-left, 40px)) - max(40px, env(safe-area-inset-right, 40px)));
  max-height: calc(100dvh - max(200px, env(safe-area-inset-top, 200px)) - max(200px, env(safe-area-inset-bottom, 200px)));
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, v-bind('props.themeColor'), color-mix(in srgb, v-bind('props.themeColor') 70%, white));
}

.music-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  color: white;
}

.cover-info {
  text-align: center;
}

.track-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.track-artist {
  font-size: 16px;
  opacity: 0.8;
}

.track-info {
  flex: 1;
  min-width: 0;
}

/* 响应式设计 - 安全区域适配 */
@media (max-width: 768px) {
  .cover-component.fullscreen .cover-art {
    width: 250px;
    height: 250px;
    max-width: calc(100vw - max(20px, env(safe-area-inset-left, 20px)) - max(20px, env(safe-area-inset-right, 20px)));
    max-height: calc(100dvh - max(150px, env(safe-area-inset-top, 150px)) - max(150px, env(safe-area-inset-bottom, 150px)));
  }
}

@media (max-width: 480px) {
  .cover-component.fullscreen .cover-art {
    width: 200px;
    height: 200px;
    max-width: calc(100vw - max(16px, env(safe-area-inset-left, 16px)) - max(16px, env(safe-area-inset-right, 16px)));
    max-height: calc(100dvh - max(120px, env(safe-area-inset-top, 120px)) - max(120px, env(safe-area-inset-bottom, 120px)));
  }
}

@media (max-width: 360px) {
  .cover-component.fullscreen .cover-art {
    width: 180px;
    height: 180px;
    max-width: calc(100vw - max(12px, env(safe-area-inset-left, 12px)) - max(12px, env(safe-area-inset-right, 12px)));
    max-height: calc(100dvh - max(100px, env(safe-area-inset-top, 100px)) - max(100px, env(safe-area-inset-bottom, 100px)));
  }
}
 


</style>