<template>
  <div class="music-fullscreen-page">
   <SdkworkMusicPlayer
        ref="musicPlayerRef"
        :src="currentTrack.src"
        :title="currentTrack.title"
        :artist="currentTrack.artist"
        :cover="currentTrack.cover"
        :album="currentTrack.album"
        :theme-color="themeColor"
        :show-waveform="showWaveform"
        :autoplay="autoplay"
        :loop="loop"
        :volume="volume"
        :mode="PlayerDisplayMode.FULLSCREEN"
        :playlist="playlist"
        width="100%"
        height="100dvh"
        class="fullscreen-player"
        @play="handlePlay"
        @pause="handlePause"
        @ended="handleEnded"
        @timeupdate="handleTimeUpdate"
        @volumechange="handleVolumeChange"
        @error="handleError"
        @mode-change="handleModeChange"
      />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import SdkworkMusicPlayer from '@/components/sdkwork-music-player/sdkwork-music-player.vue'
import { PlayerDisplayMode } from '@/stores/modules/player/types'

const route:any = useRoute()
const router = useRouter()

// 播放器引用
const musicPlayerRef = ref<InstanceType<typeof SdkworkMusicPlayer>>()

// 响应式数据
const themeColor = ref('#3b82f6')
const showWaveform = ref(true)
const autoplay = ref(true) // 全屏页面默认自动播放
const loop = ref(false)
const volume = ref(0.7)
const showTrackInfo = ref(false)

// 模拟音乐数据
const playlist:any = [
  {
    id: '1',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=1',
    quality: '高品质',
    bitrate: 320
  },
  {
    id: '2',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=2',
    quality: '标准音质',
    bitrate: 192
  },
  {
    id: '3',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: 'SoundHelix Song 3',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=3',
    quality: '无损音质',
    bitrate: 1411
  },
  {
    id: '4',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    title: 'SoundHelix Song 4',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=4',
    quality: '高品质',
    bitrate: 320
  },
  {
    id: '5',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    title: 'SoundHelix Song 5',
    artist: 'SoundHelix',
    album: 'SoundHelix Collection',
    cover: 'https://picsum.photos/400/400?random=5',
    quality: '标准音质',
    bitrate: 192
  }
]

// 计算属性
const currentTrackId = computed(() => route.params.id as string)
const currentTrack = computed(() => {
  return playlist.find((track:any) => track.id === currentTrackId.value) || playlist[0]
})

// 方法
const goBack = () => {
  router.back()
}

const toggleTrackInfo = () => {
  showTrackInfo.value = !showTrackInfo.value
}

const toggleWaveform = () => {
  showWaveform.value = !showWaveform.value
}

const toggleLoop = () => {
  loop.value = !loop.value
}

// 播放器事件处理
const handlePlay = () => {
  console.log('开始播放:', currentTrack.value.title)
}

const handlePause = () => {
  console.log('暂停播放')
}

const handleEnded = () => {
  console.log('播放结束')
}

const handleTimeUpdate = (current: number, total: number) => {
  // 可以在这里实现进度同步等逻辑
}

const handleVolumeChange = (newVolume: number) => {
  volume.value = newVolume
}

const handleError = (error: Error) => {
  console.error('播放错误:', error)
}

const handleModeChange = (mode: PlayerDisplayMode) => {
  // 如果用户切换到非全屏模式，自动返回
  if (mode !== PlayerDisplayMode.FULLSCREEN) {
    goBack()
  }
}

onMounted(() => {
  // 页面加载后自动开始播放
  setTimeout(() => {
    if (musicPlayerRef.value && autoplay.value) {
      // 播放器会自动处理播放逻辑
      console.log('全屏音乐播放器已准备就绪')
    }
  }, 1000)
})
</script>

<style scoped>
.music-fullscreen-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  min-height: -webkit-fill-available; /* 移动端浏览器兼容 */
  height: 100dvh; /* 动态视口高度 */
  background: #000;
  z-index: 9999;
  overflow: hidden;
  /* 安全区域适配 */
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

.fullscreen-player-container {
  position: relative;
  width: 100%;
  height: 100%;
  /* 确保内容在安全区域内 */
  width: calc(100% - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px));
  height: calc(100% - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  margin: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
}

.fullscreen-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: max(20px, env(safe-area-inset-top, 20px));
  left: max(20px, env(safe-area-inset-left, 20px));
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* 歌曲信息面板 */
.track-info-panel {
  position: absolute;
  top: max(20px, env(safe-area-inset-top, 20px));
  right: -320px;
  width: 300px;
  height: auto;
  max-height: calc(100dvh - 40px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  padding: 20px;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
}

.track-info-panel.show-info {
  right: max(20px, env(safe-area-inset-right, 20px));
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.close-panel {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-panel:hover {
  background: rgba(255, 255, 255, 0.1);
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.value {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.quality-badge {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 控制按钮 */
.control-buttons {
  position: absolute;
  bottom: max(20px, env(safe-area-inset-bottom, 20px));
  right: max(20px, env(safe-area-inset-right, 20px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
}

.control-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.control-btn.active {
  background: v-bind(themeColor);
  border-color: v-bind(themeColor);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .back-button {
    top: max(15px, env(safe-area-inset-top, 15px));
    left: max(15px, env(safe-area-inset-left, 15px));
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .track-info-panel {
    width: 280px;
    right: -280px;
  }
  
  .track-info-panel.show-info {
    right: max(15px, env(safe-area-inset-right, 15px));
  }
  
  .control-buttons {
    bottom: max(15px, env(safe-area-inset-bottom, 15px));
    right: max(15px, env(safe-area-inset-right, 15px));
  }
  
  .control-btn {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .music-fullscreen-page {
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  
  .back-button {
    top: max(10px, env(safe-area-inset-top, 10px));
    left: max(10px, env(safe-area-inset-left, 10px));
    padding: 8px 14px;
    font-size: 13px;
    min-height: 36px;
  }
  
  .track-info-panel {
    width: calc(100vw - 40px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px));
    right: -100vw;
    top: max(10px, env(safe-area-inset-top, 10px));
    height: auto;
    max-height: calc(100dvh - 20px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  }
  
  .track-info-panel.show-info {
    right: max(10px, env(safe-area-inset-right, 10px));
    left: max(10px, env(safe-area-inset-left, 10px));
  }
  
  .control-buttons {
    bottom: max(10px, env(safe-area-inset-bottom, 10px));
    right: max(10px, env(safe-area-inset-right, 10px));
    flex-direction: row;
    gap: 8px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
  }
  
  .panel-content {
    gap: 12px;
  }
  
  .info-item {
    padding: 6px 0;
  }
  
  .label, .value {
    font-size: 13px;
  }
}

/* 超小屏幕设备优化 */
@media (max-width: 360px) {
  .back-button {
    padding: 6px 12px;
    font-size: 12px;
    min-height: 32px;
  }
  
  .back-icon {
    width: 16px;
    height: 16px;
  }
  
  .control-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
  }
  
  .track-info-panel {
    width: calc(100vw - 30px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px));
    padding: 15px;
  }
  
  .panel-header h3 {
    font-size: 16px;
  }
}

/* 横屏优化 */
@media (orientation: landscape) and (max-height: 500px) {
  .track-info-panel {
    max-height: calc(100dvh - 20px);
  }
  
  .control-buttons {
    flex-direction: row;
  }
}

/* 动画效果 */
.track-info-panel {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 滚动条样式 */
.track-info-panel::-webkit-scrollbar {
  width: 4px;
}

.track-info-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.track-info-panel::-webkit-scrollbar-thumb {
  background: v-bind(themeColor);
  border-radius: 2px;
}
</style>