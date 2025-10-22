<template>
  <div class="track-info-component">
    <!-- 歌曲标题和艺术家 -->
    <div class="track-basic-info">
      <h2 class="track-title" :title="title">{{ title }}</h2>
      <p class="track-artist" :title="artist">{{ artist }}</p>
    </div>

    <!-- 专辑信息（如果有） -->
    <div v-if="album" class="album-info">
      <span class="album-label">专辑：</span>
      <span class="album-name">{{ album }}</span>
    </div>

    <!-- 音质信息 -->
    <div class="quality-info">
      <span class="quality-badge" :class="qualityClass">{{ qualityText }}</span>
      <span v-if="bitrate" class="bitrate-info">{{ bitrate }} kbps</span>
    </div>

    <!-- 自定义插槽 -->
    <slot name="song-info-custom"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'

interface Props {
  title?: string
  artist?: string
  album?: string
  quality?: 'standard' | 'high' | 'lossless'
  bitrate?: number
  themeColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  artist: '',
  album: '',
  quality: 'standard',
  bitrate: 0,
  themeColor: '#3b82f6'
})

const playerStore = usePlayerStore()

// 计算属性 - 优先使用props传入的值，其次使用store中的当前曲目
const currentTrack = computed(() => playerStore.currentTrack)
const title = computed(() => props.title || currentTrack.value?.title || '未知歌曲')
const artist = computed(() => props.artist || currentTrack.value?.artist || '未知艺术家')
const album = computed(() => props.album || currentTrack.value?.album || '')
const cover = computed(() => currentTrack.value?.cover || '')

const qualityText = computed(() => {
  switch (props.quality) {
    case 'standard': return '标准音质'
    case 'high': return '高品质'
    case 'lossless': return '无损音质'
    default: return '标准音质'
  }
})

const qualityClass = computed(() => {
  switch (props.quality) {
    case 'standard': return 'quality-standard'
    case 'high': return 'quality-high'
    case 'lossless': return 'quality-lossless'
    default: return 'quality-standard'
  }
})
</script>

<style scoped>
.track-info-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  color: white;
  /* 安全区域适配 */
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  box-sizing: border-box;
}

.track-basic-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.track-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 安全区域适配 */
  max-width: calc(100vw - max(40px, env(safe-area-inset-left, 40px)) - max(40px, env(safe-area-inset-right, 40px)));
}

.track-artist {
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
  line-height: 1.4;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 安全区域适配 */
  max-width: calc(100vw - max(40px, env(safe-area-inset-left, 40px)) - max(40px, env(safe-area-inset-right, 40px)));
}

.album-info {
  font-size: 14px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 4px;
}

.album-label {
  opacity: 0.6;
}

.album-name {
  font-weight: 500;
}

.quality-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.quality-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 11px;
}

.quality-standard {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.quality-high {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.quality-lossless {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.bitrate-info {
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .track-info-component {
    padding-left: max(20px, env(safe-area-inset-left, 20px));
    padding-right: max(20px, env(safe-area-inset-right, 20px));
  }
  
  .track-title {
    font-size: 20px;
    max-width: 300px;
    max-width: calc(100vw - max(20px, env(safe-area-inset-left, 20px)) - max(20px, env(safe-area-inset-right, 20px)));
  }
  
  .track-artist {
    font-size: 14px;
    max-width: 250px;
    max-width: calc(100vw - max(20px, env(safe-area-inset-left, 20px)) - max(20px, env(safe-area-inset-right, 20px)));
  }
  
  .album-info {
    font-size: 13px;
  }
  
  .quality-info {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .track-info-component {
    gap: 12px;
    padding-left: max(16px, env(safe-area-inset-left, 16px));
    padding-right: max(16px, env(safe-area-inset-right, 16px));
  }
  
  .track-title {
    font-size: 18px;
    max-width: 250px;
    max-width: calc(100vw - max(16px, env(safe-area-inset-left, 16px)) - max(16px, env(safe-area-inset-right, 16px)));
  }
  
  .track-artist {
    font-size: 13px;
    max-width: 200px;
    max-width: calc(100vw - max(16px, env(safe-area-inset-left, 16px)) - max(16px, env(safe-area-inset-right, 16px)));
  }
  
  .album-info {
    font-size: 12px;
  }
  
  .quality-badge {
    padding: 3px 6px;
    font-size: 10px;
  }
}
</style>