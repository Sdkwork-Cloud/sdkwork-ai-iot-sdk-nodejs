<template>
  <div class="fullscreen-control-component">
    <!-- 字幕显示区域 -->
    <div v-if="showLyrics" class="lyrics-display">
      <div class="current-lyric">{{ currentLyric || '正在播放' }}</div>
    </div>

    <!-- 五个控制按钮 -->
    <div class="five-button-controls" style="z-index: 9999 !important;">
      <!-- 1. 播放方式设置 -->
      <button class="control-btn play-mode-btn" @click="togglePlayMode">
        <Icon :icon="playModeIcon" />
      </button>

      <!-- 2. 上一首 -->
      <button class="control-btn" @click="prev" :disabled="!hasPrevious">
        <Icon icon="mdi:skip-previous" />
      </button>

      <!-- 3. 播放按钮 -->
      <button class="play-btn" @click="togglePlay">
        <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" />
      </button>

      <!-- 4. 下一首 -->
      <button class="control-btn" @click="next" :disabled="!hasNext">
        <Icon icon="mdi:skip-next" />
      </button>

      <!-- 5. 弹出框按钮 -->
      <button class="control-btn popup-btn" @click="$emit('show-popup')">
        <Icon icon="mdi:playlist-music" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePlayerStore } from '@/stores/modules/player'
import { PlayMode } from '@/stores/modules/player/types'

interface Props {
  currentLyric?: string
  showLyrics?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentLyric: '',
  showLyrics: true
})

const emit = defineEmits<{
  'show-popup': []
}>()

const playerStore = usePlayerStore()

// 计算属性
const isPlaying = computed(() => playerStore.playbackState.state === 'playing')
const hasPrevious = computed(() => playerStore.hasPrevious)
const hasNext = computed(() => playerStore.hasNext)
const playMode = computed(() => playerStore.playMode)

const playModeIcon = computed(() => {
  switch (playerStore.playMode) {
    case PlayMode.SEQUENTIAL: return 'mdi:repeat'
    case PlayMode.RANDOM:
    case PlayMode.SHUFFLE: return 'mdi:shuffle'
    case PlayMode.LOOP: return 'mdi:repeat-once'
    default: return 'mdi:repeat'
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
</script>

<style scoped>
.fullscreen-control-component {
  display: flex;
  flex-direction: column;
  width: 100%; 
  box-sizing: border-box;
  /* 确保组件不会超出父容器 */
  max-height: 100%;
  overflow: hidden;
  justify-content: end;
  /* 安全区域适配 */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  
}

.lyrics-display {
  text-align: center;
  padding: 16px 0;
}

.current-lyric {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  line-height: 1.4;
}

.five-button-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 确保按钮在小屏幕上也能正常显示 */
  min-width: 0; /* 允许flex项目收缩 */
  flex-wrap: nowrap;
  width: 100%; 
  min-height: 70px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  min-width: 50px; /* 最小宽度确保在小屏幕上可见 */
  min-height: 50px; /* 最小高度确保在小屏幕上可见 */
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 28px;
  /* 确保按钮不会超出容器 */
  flex-shrink: 1; /* 允许适当收缩 */
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn:disabled:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: none;
}

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  min-width: 60px; /* 最小宽度确保在小屏幕上可见 */
  min-height: 60px; /* 最小高度确保在小屏幕上可见 */
  border: none;
  background: var(--theme-color, #007bff);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  font-size: 32px;
  /* 确保按钮不会超出容器 */
  flex-shrink: 1; /* 允许适当收缩 */
  z-index: 99999;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fullscreen-control-component { 
    max-width: 100%;
    padding: 0 0px; 
  }
  
  .current-lyric {
    font-size: 16px;
    padding: 12px 0; /* 增加歌词区域的内边距 */
  }
  
  .control-btn {
    width: 60px;
    height: 60px;
    min-width: 45px;
    min-height: 45px;
    font-size: 24px;
  }
  
  .play-btn {
    width: 75px;
    height: 75px;
    min-width: 55px;
    min-height: 55px;
    font-size: 28px;
  }
  
  .five-button-controls { 
    /* 在小屏幕上确保按钮不会溢出 */
    justify-content: space-around; /* 改为space-around确保均匀分布 */
  }
}

@media (max-width: 480px) {
  .fullscreen-control-component { 
    padding: 0 0px;  
  }
  
  .current-lyric {
    font-size: 14px;
    padding: 10px 0;
  }
  
  .control-btn {
    width: 55px;
    height: 55px;
    min-width: 40px;
    min-height: 40px;
    font-size: 22px;
  }
  
  .play-btn {
    width: 65px;
    height: 65px;
    min-width: 50px;
    min-height: 50px;
    font-size: 26px;
  }
  
  .five-button-controls { 
    justify-content: space-around; /* 确保在小屏幕上均匀分布 */
  }
  
  /* 在超小屏幕上进一步调整按钮大小 */
  @media (max-width: 380px) {
    .control-btn {
      width: 50px;
      height: 50px;
      min-width: 35px;
      min-height: 35px;
      font-size: 20px;
    }
    
    .play-btn {
      width: 60px;
      height: 60px;
      min-width: 45px;
      min-height: 45px;
      font-size: 24px;
    }
    
    .five-button-controls { 
    }
  }
}

@media (max-width: 360px) {
  .fullscreen-control-component {
    gap: 12px;  
  }
  
  .current-lyric {
    font-size: 13px;
    padding: 8px 0;
  }
  
  .control-btn {
    width: 48px;
    height: 48px;
    min-width: 32px;
    min-height: 32px;
    font-size: 18px;
  }
  
  .play-btn {
    width: 56px;
    height: 56px;
    min-width: 40px;
    min-height: 40px;
    font-size: 22px;
  }
  
  .five-button-controls { 
    justify-content: space-around;
  }
  
  /* 在极小的屏幕上使用更紧凑的布局 */
  @media (max-width: 320px) {
    .control-btn {
      width: 44px;
      height: 44px;
      min-width: 30px;
      min-height: 30px;
      font-size: 16px;
    }
    
    .play-btn {
      width: 52px;
      height: 52px;
      min-width: 38px;
      min-height: 38px;
      font-size: 20px;
    }
    
    .five-button-controls {
      gap: 2px;
    }
  }
}
</style>