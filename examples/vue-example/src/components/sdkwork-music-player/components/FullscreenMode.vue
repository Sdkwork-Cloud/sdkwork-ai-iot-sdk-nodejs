<template>
  <div class="fullscreen-mode"  :style="{ '--theme-color': themeColor }">
    <!-- 背景模糊层 -->
    <div  class="background-overlay" :style="{ backgroundImage: `url(${cover})` }"></div>
    
    <!-- 顶部控制栏 -->
    <div  class="top-controls">
      <button class="back-btn" @click="$emit('close-fullscreen')" v-if="enableCloseFullscreen">
        <Icon icon="mdi:chevron-down" />
      </button>
      <div v-else></div>
      <div class="track-info-top">
        <div class="track-title">{{ title }}</div>
        <div class="track-artist">{{ artist }}</div>
      </div>
      <MoreActionsComponent mode="fullscreen" :is-liked="false" 
          @close-player="$emit('close-player')" @like="$emit('like')" @share="$emit('share')" />
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 封面区域 -->
      <CoverComponent
        :cover="cover"
        :title="title"
        :artist="artist"
        :theme-color="themeColor"
        mode="fullscreen"
      >
        <template #cover-custom>
          <!-- 自定义封面插槽 -->
          <slot name="fullscreen-cover"></slot>
        </template>
      </CoverComponent>

      <!-- 歌曲信息区域（替换原来的进度条区域） -->
      <TrackInfoComponent
        :theme-color="themeColor"
      >
        <template #track-info-custom>
          <!-- 自定义歌曲信息插槽 -->
          <slot name="fullscreen-track-info"></slot>
        </template>
      </TrackInfoComponent>

      <!-- 底部控制区域 - 整合进度条和控制按钮 -->
      <div class="bottom-control-area">
        <!-- 全屏模式进度条 -->
        <ProgressComponent
          :theme-color="themeColor"
          mode="fullscreen"
          :show-waveform="showWaveform"
          :wave-type="waveType"
        >
          <template #progress-custom>
            <!-- 自定义进度条插槽 -->
            <slot name="fullscreen-progress"></slot>
          </template>
        </ProgressComponent>

        <!-- 控制按钮区域 -->
        <FullscreenControlComponent
          :current-lyric="currentLyric"
          :show-lyrics="showLyrics"
          @show-popup="$emit('show-popup')"
        />

        <!-- 歌词区域 -->
        <div v-if="showLyrics" class="lyrics-section">
          <div class="lyrics-container">
            <div class="current-lyric">{{ currentLyric || '正在播放' }}</div>
            <div class="next-lyric">这是下一句歌词</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部附加信息 -->
    <div class="bottom-info">
      <div class="audio-quality">{{ qualityText }}</div>
      <div class="playback-info">{{ playbackRate }}x 播放</div>
    </div>

    <!-- 自定义插槽 -->
    <slot name="fullscreen-custom"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import CoverComponent from './CoverComponent.vue'
import TrackInfoComponent from './TrackInfoComponent.vue'
import ProgressComponent from './ProgressComponent.vue'
import FullscreenControlComponent from './FullscreenControlComponent.vue'
import MoreActionsComponent from './MoreActionsComponent.vue'
import { PlayerState } from '@/stores/modules/player/types'
import { Icon } from '@iconify/vue'
interface Props {
  cover?: string
  title?: string
  artist?: string
  themeColor?: string
  showWaveform?: boolean
  waveType?: string
  showLyrics?: boolean
  currentLyric?: string
  enableCloseFullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cover: '',
  title: '',
  artist: '',
  themeColor: '#3b82f6',
  showWaveform: true,
  waveType: 'bar',
  showLyrics: false,
  currentLyric: '',
  enableCloseFullscreen: false
})

const emit = defineEmits<{
  'close-fullscreen': []
  'close-player': []
  'like': []
  'share': []
  'show-popup': []
}>()

const playerStore = usePlayerStore()

// 计算属性 - 优先使用props传入的值，其次使用store中的当前曲目
const currentTrack = computed(() => playerStore.currentTrack)
const cover = computed(() => props.cover || currentTrack.value?.cover || '')
const title = computed(() => props.title || currentTrack.value?.title || 'Unknown Title')
const artist = computed(() => props.artist || currentTrack.value?.artist || 'Unknown Artist')
const album = computed(() => currentTrack.value?.album || '')
const currentTime = computed(() => playerStore.currentTime)
const duration = computed(() => playerStore.duration)
const buffered = computed(() => playerStore.buffered)
const isPlaying = computed(() => playerStore.playbackState.state === PlayerState.PLAYING)
const playbackRate = computed(() => playerStore.playbackRate)
const hasPrevious = computed(() => playerStore.hasPrevious)
const hasNext = computed(() => playerStore.hasNext)
const playMode = computed(() => playerStore.playMode)

const qualityText = computed(() => {
  return '标准音质' // 简化处理，实际可以根据音频质量动态显示
})
</script>

<style scoped>
.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%; /* 使用100%而不是100vh，避免浏览器UI问题 */
  background: #000;
  color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  /* 统一安全区域设置 - 只保留底部安全区域 */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  /* 针对移动端浏览器的特殊处理 */
  height: -webkit-fill-available; /* 针对WebKit浏览器 */
  min-height: -webkit-fill-available; /* 确保最小高度 */
} 

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.4);
  opacity: 0.6;
  z-index: -1;
}

.top-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  z-index: 2;
}

.back-btn, .more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover, .more-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.track-info-top {
  text-align: center;
  flex: 1;
  max-width: 60%;
}

.track-info-top .track-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-info-top .track-artist {
  font-size: 14px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 改为flex-start，避免内容被挤压 */
  align-items: center;
  z-index: 2;
  /* 动态调整间距，避免内容被挤压 */
  min-height: 0;
  overflow: hidden;
  /* 确保控制按钮区域有足够空间 */
  position: relative;
}

/* 底部控制区域 - 整合进度条和控制按钮 */
.bottom-control-area {
  margin-top: auto; /* 将整个区域推到容器底部 */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0; /* 防止区域被压缩 */ 
}

.lyrics-section {
  margin-top: 20px;
  text-align: center;
}

.lyrics-container {
  max-width: 400px;
}

.current-lyric {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--theme-color);
}

.next-lyric {
  font-size: 16px;
  opacity: 0.7;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  font-size: 12px;
  opacity: 0.7;
  z-index: 2;
  /* 确保底部信息不会超出屏幕 */
  min-height: 40px; /* 最小高度确保内容可见 */
  flex-shrink: 0; /* 防止在空间不足时被压缩 */
}

/* 动画效果 */
.fullscreen-mode {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fullscreen-mode {
    height: 100%; /* 使用百分比而不是固定高度 */
    height: -webkit-fill-available; /* WebKit浏览器支持 */
  }
  
  .top-controls {
    padding: 16px;
  }
  
  .back-btn, .more-btn {
    width: 40px;
    height: 40px;
  }
  
  .main-content {
    padding: 0 20px;
    gap: 8px;
    justify-content: flex-start;
    min-height: 0; /* 允许内容压缩 */
    flex: 1; /* 占据剩余空间 */
  }
  
  .bottom-control-area {
    gap: 20px;
    padding-top: 20px; /* 减少顶部间距 */
    margin-top: auto; /* 确保在底部 */
  }
  
  .bottom-info {
    padding: 12px 20px;
    font-size: 11px;
    flex-shrink: 0; /* 防止被压缩 */
  }
  
  .track-info-top {
    max-width: 50%;
  }
  
  .track-info-top .track-title {
    font-size: 16px;
  }
  
  .track-info-top .track-artist {
    font-size: 13px;
  }
  
  .current-lyric {
    font-size: 18px;
  }
  
  .next-lyric {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .fullscreen-mode {
    height: 100%;
    height: -webkit-fill-available;
  }
  
  .top-controls {
    padding: 12px;
  }
  
  .back-btn, .more-btn {
    width: 36px;
    height: 36px;
  }
  
  .main-content {
    padding: 0 16px; 
    gap: 6px;
    justify-content: flex-start;
    min-height: 0;
    flex: 1;
  }
  
  .bottom-control-area { 
    padding-top: 15px; 
    margin-top: auto;
  }
  
  .bottom-info {
    padding: 10px 16px; 
    font-size: 10px;
    flex-shrink: 0;
  }
  
  .track-info-top {
    max-width: 45%;
  }
  
  .track-info-top .track-title {
    font-size: 15px;
  }
  
  .track-info-top .track-artist {
    font-size: 12px;
  }
  
  .current-lyric {
    font-size: 16px;
  }
  
  .next-lyric {
    font-size: 13px;
  }
  
  .lyrics-section {
    margin-top: 6px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
  .fullscreen-mode {
    height: 100%;
    height: -webkit-fill-available;
  }
  
  .back-btn, .more-btn {
    width: 32px;
    height: 32px;
  }
  
  .main-content { 
    justify-content: flex-start;
    padding: 0 12px; 
    min-height: 0;
    flex: 1;
  }
  
  .bottom-control-area {
    gap: 12px;
    padding-top: 12px; 
    margin-top: auto;
  }
  
  .bottom-info {
    padding: 8px 12px; 
    font-size: 9px;
    flex-shrink: 0;
  }
  
  .track-info-top {
    max-width: 40%;
  }
  
  .track-info-top .track-title {
    font-size: 14px;
  }
  
  .track-info-top .track-artist {
    font-size: 11px;
  }
  
  .current-lyric {
    font-size: 14px;
  }
  
  .next-lyric {
    font-size: 12px;
  }
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .fullscreen-mode {
    background: #0a0a0a;
  }
  
  .background-overlay {
    filter: blur(30px) brightness(0.3);
  }
}

/* 横屏优化 */
@media (orientation: landscape) and (max-height: 500px) {
  .fullscreen-mode {
    height: 100%;
    height: -webkit-fill-available;
  }
  
  .main-content {
    flex-direction: row; 
    justify-content: space-around;
    padding: 0 20px; 
    min-height: 0;
    flex: 1;
  }
  
  .bottom-control-area {
    margin-top: 0;
    padding-top: 0;
    margin-top: auto;
  }
  
  .lyrics-section {
    display: none;
  }
  
  .bottom-info {
    flex-shrink: 0;
  }
}

/* 针对移动端浏览器的特殊处理 */
@supports (height: 100dvh) {
  .fullscreen-mode {
    height: 100dvh; /* 使用动态视口高度 */
  }
}

/* 针对Google Chrome移动端的特殊处理 */
@media (max-width: 768px) and (orientation: portrait) {
  .fullscreen-mode {
    /* 为Chrome移动端添加额外的底部间距 */
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}
</style>