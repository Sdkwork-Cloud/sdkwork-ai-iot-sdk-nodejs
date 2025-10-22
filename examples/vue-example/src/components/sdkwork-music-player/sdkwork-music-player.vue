<template>
  <div class="music-player-container">
    <!-- 卡片模式 -->
    <CardMode
      v-if="displayMode === PlayerDisplayMode.CARD && !isFullscreen"
      :cover="currentTrack?.cover || track?.cover || ''"
      :title="currentTrack?.title || track?.title || 'Unknown Title'"
      :artist="currentTrack?.artist || track?.artist || 'Unknown Artist'"
      :theme-color="themeColor"
      :width="width"
      :height="height"
      :show-progress="showProgress"
      :show-waveform="showWaveform"
      :wave-type="waveType"
      :is-liked="isLiked"
      @toggle-play="togglePlay"
      @previous="handlePrevious"
      @next="handleNext"
      @volume-change="handleVolumeChange"
      @rate-change="handlePlaybackRateChange"
      @seek="handleSeek"
      @seeking="handleSeeking"
      @like="handleLike"
      @more-actions="handleMoreActions"
    >
      <!-- 卡片模式自定义插槽 -->
      <template #card-cover>
        <slot name="card-cover"></slot>
      </template>
      <template #card-progress>
        <slot name="card-progress"></slot>
      </template>
      <template #card-controls>
        <slot name="card-controls"></slot>
      </template>
      <template #card-custom>
        <slot name="card-custom"></slot>
      </template>
    </CardMode>

    <!-- 底部栏模式 -->
    <BottomBarMode
      v-if="displayMode === PlayerDisplayMode.BOTTOM_BAR && !isFullscreen"
      :cover="currentTrack?.cover || track?.cover || ''"
      :title="currentTrack?.title || track?.title || 'Unknown Title'"
      :artist="currentTrack?.artist || track?.artist || 'Unknown Artist'"
      :theme-color="themeColor"
      :show-progress="showProgress"
      :show-waveform="showWaveform"
      :wave-type="waveType"
      @expand="toggleFullscreen"
      @toggle-play="togglePlay"
      @previous="handlePrevious"
      @next="handleNext"
      @volume-change="handleVolumeChange"
      @seek="handleSeek"
      @seeking="handleSeeking"
      @more-actions="handleMoreActions"
    >
      <!-- 底部栏模式自定义插槽 -->
      <template #bottom-bar-cover>
        <slot name="bottom-bar-cover"></slot>
      </template>
      <template #bottom-bar-progress>
        <slot name="bottom-bar-progress"></slot>
      </template>
      <template #bottom-bar-custom>
        <slot name="bottom-bar-custom"></slot>
      </template>
    </BottomBarMode>

    <!-- 全屏模式 -->
    <FullscreenMode
      v-if="displayMode === PlayerDisplayMode.FULLSCREEN || isFullscreen"
      :cover="currentTrack?.cover || track?.cover || ''"
      :title="currentTrack?.title || track?.title || 'Unknown Title'"
      :artist="currentTrack?.artist || track?.artist || 'Unknown Artist'"
      :theme-color="themeColor"
      :current-time="currentTime"
      :duration="duration"
      :buffered="buffered"
      :is-playing="isPlaying"
      :volume="volume"
      :playback-rate="playbackRate"
      :has-previous="hasPrevious"
      :has-next="hasNext"
      :show-waveform="showWaveform"
      :wave-type="waveType"
      :show-lyrics="showLyrics"
      :current-lyric="currentLyric"
      :play-mode="playMode"
      :enable-fullscreen="isFullscreen"
      :enable-close-fullscreen="enableCloseFullscreen"
      @close-fullscreen="toggleFullscreen"
      @more-actions="handleMoreActions"
      @toggle-play="togglePlay"
      @previous="handlePrevious"
      @next="handleNext"
      @volume-change="handleVolumeChange"
      @rate-change="handlePlaybackRateChange"
      @seek="handleSeek"
      @seeking="handleSeeking"
      @seeking-start="handleSeekingStart"
      @seeking-end="handleSeekingEnd"
      @play-mode-change="handlePlayModeChange"
      @show-popup="handleShowPopup"
    >
      <!-- 全屏模式自定义插槽 -->
      <template #fullscreen-cover>
        <slot name="fullscreen-cover"></slot>
      </template>
      <template #fullscreen-progress>
        <slot name="fullscreen-progress"></slot>
      </template>
      <template #fullscreen-controls>
        <slot name="fullscreen-controls"></slot>
      </template>
      <template #fullscreen-custom>
        <slot name="fullscreen-custom"></slot>
      </template>
    </FullscreenMode>

    <!-- 全局自定义插槽 -->
    <slot name="global-custom"></slot>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-overlay">
      <div class="error-message">
        <Icon icon="mdi:alert-circle" class="error-icon" />
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Playlist Popup -->
    <PlaylistPopup
      v-if="showPlaylistPopup"
      :playlist="playlistTracks"
      :current-track-index="currentTrackIndex"
      @close="handleClosePlaylistPopup"
      @play-track="handlePlayTrack"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import { MusicPlayerProps, MusicPlayerEmits } from './types'
import { PlayerDisplayMode, Track } from '@/stores/modules/player/types'
import CardMode from './components/CardMode.vue'
import BottomBarMode from './components/BottomBarMode.vue'
import FullscreenMode from './components/FullscreenMode.vue'
import PlaylistPopup from './components/PlaylistPopup.vue'
import { Icon } from '@iconify/vue'
// 组件属性
const props = withDefaults(defineProps<MusicPlayerProps>(), {
  track: undefined,
  autoplay: false,
  controls: true,
  loop: false,
  volume: 0.7,
  playbackRate: 1.0,
  width: '100%',
  height: 'auto',
  themeColor: '#3b82f6',
  showWaveform: true,
  showProgress: true,
  waveType: 'bar' as 'bar' | 'line' | 'circle',
  class: '',
  mode: PlayerDisplayMode.BOTTOM_BAR,
  showLyrics: false,
  enableCloseFullscreen: false,
  playlist: () => []
})

// 组件事件
const emit = defineEmits<MusicPlayerEmits>()

// 使用Player Store
const playerStore = usePlayerStore()

// 响应式数据
const isLiked = ref(false)
const showLyrics = ref(props.showLyrics)
const currentLyric = ref('')

// 计算属性 - 从store获取状态
const isPlaying = computed(() => playerStore.isPlaying)
const isPaused = computed(() => playerStore.isPaused)
const isStopped = computed(() => playerStore.isStopped)
const isLoading = computed(() => playerStore.isLoading)
const currentTime = computed(() => playerStore.currentTime)
const duration = computed(() => playerStore.duration)
const buffered = computed(() => playerStore.buffered)
const progress = computed(() => playerStore.progress)
const volume = computed(() => playerStore.volume)
const playbackRate = computed(() => playerStore.playbackRate)
const isMuted = computed(() => playerStore.isMuted)
const currentTrack = computed(() => playerStore.currentTrack)
const currentTrackIndex = computed(() => playerStore.currentTrackIndex)
const hasPrevious = computed(() => playerStore.hasPrevious)
const hasNext = computed(() => playerStore.hasNext)
const playMode = computed(() => playerStore.playMode)
const displayMode = computed(() => playerStore.displayMode)
const isFullscreen = computed(() => playerStore.isFullscreen)
const error = computed(() => playerStore.error)
const showPlaylistPopup = computed(() => playerStore.showPlaylistPopup)
const playlistTracks = computed(() => playerStore.playlistTracks)

// 初始化播放列表
const initializePlaylist = () => {
  const tracks: Track[] = []

  // 如果提供了播放列表，使用播放列表
  if (props.playlist && props.playlist.length > 0) {
    tracks.push(...props.playlist.map(track => {
      // 创建完整的Track对象
      const trackObj: Track = {
        id: track.id || track.src || Date.now().toString(),
        uuid: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        title: track.title || 'Unknown Title',
        artist: track.artist || 'Unknown Artist',
        duration: track.duration || 0,
        src: track.src,
        cover: track.cover
      }
      return trackObj
    }))
  } else if (props.track?.src) {
    // 单个音频源
    const track: Track = {
      id: props.track.id || props.track.src || Date.now().toString(),
      uuid: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: props.track.title || 'Unknown Title',
      artist: props.track.artist || 'Unknown Artist',
      duration: props.track.duration || 0,
      src: props.track.src,
      cover: props.track.cover
    }
    tracks.push(track)
  }

  if (tracks.length > 0) {
    playerStore.setPlaylist(tracks, 0)
    
    // 设置配置
    playerStore.config.autoplay = props.autoplay
    playerStore.config.loop = props.loop
    playerStore.config.showWaveform = props.showWaveform
    playerStore.config.showLyrics = props.showLyrics
    playerStore.config.themeColor = props.themeColor
    
    // 设置显示模式
    playerStore.setDisplayMode(props.mode as any)
    
    // 初始化音频播放器
    playerStore.initializeAudioPlayer()
    
    // 如果启用自动播放，开始播放
    if (props.autoplay) {
      playerStore.play()
    }
  }
}

// 播放控制方法
const togglePlay = async () => {
  try {
    await playerStore.togglePlay()
    emit('play')
  } catch (err) {
    emit('error', err instanceof Error ? err : new Error('Playback error'))
  }
}

const handlePrevious = () => {
  playerStore.previous()
  emit('previous')
}

const handleNext = () => {
  playerStore.next()
  emit('next')
}

// 音量控制
const handleVolumeChange = (newVolume: number) => {
  playerStore.setVolume(newVolume)
  emit('volumechange', newVolume)
}

const toggleMute = () => {
  playerStore.toggleMute()
  emit('volumechange', playerStore.volume)
}

// 播放速率控制
const handlePlaybackRateChange = (rate: number) => {
  playerStore.setPlaybackRate(rate)
  emit('ratechange', rate)
}

// 进度控制
const handleSeek = (time: number) => {
  playerStore.seek(time)
  emit('seek', time)
}

const handleSeeking = (time: number) => {
  emit('seeking', time)
}

// 全屏控制
const toggleFullscreen = () => {
  playerStore.toggleFullscreen()
  emit('mode-change', playerStore.displayMode)
}

// 其他交互方法
const handleLike = () => {
  isLiked.value = !isLiked.value
  emit('play')
}

const handleMoreActions = () => {
  emit('more-actions')
}

const handlePlaylist = () => {
  emit('playlist')
}

const handleShuffle = () => {
  emit('shuffle')
}

const handleSettings = () => {
  emit('settings')
}

// 播放模式切换
const handlePlayModeChange = (newMode: string) => {
  playerStore.setPlayMode(newMode as any)
  emit('play-mode-change', newMode)
}

// 显示弹出框
const handleShowPopup = () => {
  playerStore.setShowPlaylistPopup(true)
  emit('show-popup')
}

// 关闭播放列表弹窗
const handleClosePlaylistPopup = () => {
  playerStore.setShowPlaylistPopup(false)
}

// 处理播放曲目
const handlePlayTrack = (track: Track, index: number) => {
  if (index >= 0) {
    playerStore.playTrack(index)
  } else {
    // 从热门或推荐列表中选择曲目
    // 这里可以添加逻辑将曲目添加到播放列表并播放
    console.log('Playing track from hot/recommended list:', track)
  }
  playerStore.setShowPlaylistPopup(false)
}

// 进度条拖动开始
const handleSeekingStart = () => {
  emit('seeking-start')
}

// 进度条拖动结束
const handleSeekingEnd = () => {
  emit('seeking-end')
}

// 模式切换
const switchMode = (newMode: PlayerDisplayMode | 'fullscreen') => {
  playerStore.setDisplayMode(newMode as any)
  emit('mode-change', newMode as PlayerDisplayMode)
}

// 生命周期
onMounted(() => {
  initializePlaylist()
})

onUnmounted(() => {
  // Store会自动管理清理，这里不需要额外操作
})

// 监听属性变化
watch(() => props.track?.src, (newSrc) => {
  if (newSrc) {
    initializePlaylist()
  }
})

watch(() => props.playlist, (newPlaylist) => {
  if (newPlaylist && newPlaylist.length > 0) {
    initializePlaylist()
  }
}, { deep: true })

watch(() => props.volume, (newVolume) => {
  if (Math.abs(newVolume - playerStore.volume) > 0.01) {
    playerStore.setVolume(newVolume)
  }
})

watch(() => props.playbackRate, (newRate) => {
  if (Math.abs(newRate - playerStore.playbackRate) > 0.01) {
    playerStore.setPlaybackRate(newRate)
  }
})

watch(() => props.mode, (newMode) => {
  playerStore.setDisplayMode(newMode as any)
})

// 监听store状态变化，触发相应事件
watch(() => playerStore.isPlaying, (isPlaying) => {
  if (isPlaying) {
    emit('play')
  } else {
    emit('pause')
  }
})

watch(() => playerStore.currentTrack, (track) => {
  if (track) {
    emit('play')
  }
})

watch(() => playerStore.error, (error) => {
  if (error) {
    emit('error', new Error(error))
  }
})

// 暴露方法给模板
defineExpose({
  switchMode,
  toggleFullscreen,
  togglePlay,
  handlePrevious,
  handleNext,
  handleVolumeChange,
  handlePlaybackRateChange,
  handleSeek
})
</script>

<style scoped>
.music-player-container {
  position: relative;  
  height: 100%;
}

.loading-overlay,
.error-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  z-index: 10000;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff6b6b;
  font-size: 14px;
}

.error-icon {
  width: 16px;
  height: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .music-player-container {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .music-player-container {
    font-size: 12px;
  }
}

/* 动画过渡 */
.music-player-container * {
  transition: all 0.3s ease;
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .music-player-container * {
    transition: none;
  }
}
</style>