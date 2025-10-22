<template>
  <div class="control-component" :class="mode">
    <div class="control-buttons">
      <!-- 播放列表/随机播放按钮 -->
      <div v-if="mode === 'fullscreen'" class="secondary-controls">
        <button class="control-btn" @click="togglePlaylist">
          <Icon icon="mdi:playlist-music" />
        </button>
        <button class="control-btn" @click="togglePlayMode">
          <Icon :icon="playModeIcon" />
        </button>
      </div>

      <!-- 主要控制按钮 -->
      <div class="main-controls">
        <button class="control-btn" @click="prev" :disabled="!hasPrevious">
          <Icon icon="mdi:skip-previous" />
        </button>
        
        <button class="play-btn" @click="togglePlay">
          <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" />
        </button>
        
        <button class="control-btn" @click="next" :disabled="!hasNext">
          <Icon icon="mdi:skip-next" />
        </button>
      </div>

      <!-- 设置按钮 -->
      <div class="secondary-controls">
        <button class="control-btn" @click="$emit('settings')">
          <Icon icon="mdi:cog" />
        </button>
      </div>
    </div>

    <slot name="control-custom" 
          :is-playing="isPlaying" 
          :playback-rate="playbackRate"
          :has-previous="hasPrevious"
          :has-next="hasNext"
          :play-mode="playMode"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePlayerStore } from '@/stores/modules/player'
import { PlayerState } from '@/stores/modules/player/types'

interface Props {
  mode?: 'card' | 'bottom-bar' | 'fullscreen'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'card'
})

const emit = defineEmits<{
  'settings': []
  'show-playlist': []
}>()

const playerStore = usePlayerStore()

// 计算属性
const isPlaying = computed(() => playerStore.playbackState.state === PlayerState.PLAYING)
const playbackRate = computed(() => playerStore.playbackRate)
const hasPrevious = computed(() => playerStore.hasPrevious)
const hasNext = computed(() => playerStore.hasNext)
const playMode = computed(() => playerStore.playMode)

const playModeIcon = computed(() => {
  switch (playerStore.playMode) {
    case 'sequential':
      return 'mdi:repeat'
    case 'loop':
      return 'mdi:repeat-once'
    case 'shuffle':
      return 'mdi:shuffle'
    default:
      return 'mdi:repeat'
  }
})

// 方法
const togglePlay = async () => {
  await playerStore.togglePlay()
}

const prev = () => {
  playerStore.previous()
}

const next = () => {
  playerStore.next()
}

const togglePlayMode = () => {
  playerStore.togglePlayMode()
}

const togglePlaylist = () => {
  emit('show-playlist')
}


</script>

<style scoped>
.control-component {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-component.fullscreen {
  flex-direction: column;
  gap: 24px;
}

.control-buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 16px;
}

.control-component.fullscreen .control-buttons {
  justify-content: center;
  gap: 32px;
}

.main-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.secondary-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-component.fullscreen .control-btn {
  width: 48px;
  height: 48px;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.control-btn:disabled:hover {
  background: rgba(255, 255, 255, 0.1);
}

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: none;
  background: v-bind('props.mode === "fullscreen" ? "var(--theme-color)" : "rgba(var(--theme-color-rgb), 0.1)"');
  border-radius: 50%;
  color: v-bind('props.mode === "fullscreen" ? "white" : "var(--theme-color)"');
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.control-component.fullscreen .play-btn {
  width: 80px;
  height: 80px;
}

.play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}



.playback-rate-control {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
}

.rate-label {
  font-size: 14px;
  opacity: 0.8;
}

.playback-rate-control select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 4px 8px;
  color: var(--text-color);
  outline: none;
}

.playback-rate-control select:focus {
  border-color: var(--theme-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-component.fullscreen .control-buttons {
    gap: 16px;
  }
  
  .control-component.fullscreen .play-btn {
    width: 64px;
    height: 64px;
  }
  
  .control-component.fullscreen .control-btn {
    width: 40px;
    height: 40px;
  }
}
</style>