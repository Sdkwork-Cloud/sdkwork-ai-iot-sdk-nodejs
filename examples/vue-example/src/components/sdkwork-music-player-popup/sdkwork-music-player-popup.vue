<template>
  <sdkwork-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: height, maxHeight: '100dvh' }"
    round
    closeable
    :close-on-click-overlay="false"
    :safe-area-inset-top="true"
    :safe-area-inset-bottom="true"
  >
    <div class="music-player-popup">
      <!-- 头部标题栏 -->
      <div class="popup-header">
        <div class="header-content">
          <h3 class="popup-title">{{ title }}</h3>
          <!-- 右上角关闭图标 -->
          <van-icon name="cross" class="close-icon" @click="handleClose" />
        </div>
      </div>

      <!-- 音乐播放器内容 -->
      <div class="popup-content">
        <SdkworkMusicPlayer
          :src="src"
          :title="title"
          :artist="artist"
          :cover="cover"
          :theme-color="themeColor"
          :show-waveform="showWaveform"
          :autoplay="autoplay"
          :loop="loop"
          :volume="volume"
          :mode="mode"
          :playlist="playlist"
          :enable-close-fullscreen="enableCloseFullscreen"
          width="100%"
          height="100%"
          @play="handlePlay"
          @pause="handlePause"
          @ended="handleEnded"
          @timeupdate="handleTimeUpdate"
          @volumechange="handleVolumeChange"
          @error="handleError"
          @mode-change="handleModeChange"
        />
      </div> 
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Track } from '@/stores/modules/player/types'
import SdkworkMusicPlayer from '@/components/sdkwork-music-player/sdkwork-music-player.vue'
 

// Props 定义
interface Props {
  modelValue?: boolean
  title?: string
  height?: string
  confirmText?: string
  src?: string
  artist?: string
  cover?: string
  themeColor?: string
  showWaveform?: boolean
  autoplay?: boolean
  loop?: boolean
  volume?: number
  mode?: any
  playlist?: Track[]
  enableCloseFullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '音乐播放器',
  height: '80dvh',
  confirmText: '确认',
  src: '',
  artist: '未知艺术家',
  cover: '',
  themeColor: '#3b82f6',
  showWaveform: true,
  autoplay: false,
  loop: false,
  volume: 0.7,
  mode: 'fullscreen',
  playlist: () => [],
  enableCloseFullscreen: false
})

// Emits 定义
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'close'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'timeupdate', current: number, total: number): void
  (e: 'volumechange', volume: number): void
  (e: 'error', error: Error): void
  (e: 'mode-change', mode: string): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const visible = ref(props.modelValue)

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听 visible 变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 处理确认
const handleConfirm = () => {
  emit('confirm')
  visible.value = false
}

// 处理关闭
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 播放器事件处理
const handlePlay = () => {
  emit('play')
}

const handlePause = () => {
  emit('pause')
}

const handleEnded = () => {
  emit('ended')
}

const handleTimeUpdate = (current: number, total: number) => {
  emit('timeupdate', current, total)
}

const handleVolumeChange = (volume: number) => {
  emit('volumechange', volume)
}

const handleError = (error: Error) => {
  emit('error', error)
}

const handleModeChange = (mode: string) => {
  // 如果切换到bottom-bar模式，自动关闭popup
  if (mode === 'bottom-bar') {
    visible.value = false
  }
  emit('mode-change', mode)
}
</script>

<style scoped>
.music-player-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  /* 移动端安全区域适配 - 使用动态视口单位 */
  padding-top: max(0px, env(safe-area-inset-top, 0px));
  padding-bottom: max(0px, env(safe-area-inset-bottom, 0px));
  padding-left: max(0px, env(safe-area-inset-left, 0px));
  padding-right: max(0px, env(safe-area-inset-right, 0px));
  /* 确保内容不超出视口 */
  max-height: 100dvh;
  overflow: hidden;
}

/* bottom-bar模式特殊样式 */
.music-player-popup.bottom-bar-mode {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 -1px 15px rgba(0, 0, 0, 0.06);
  padding: 0;
}

.popup-content.bottom-bar-content {
  height: 100%;
  padding: 0;
}

.popup-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  /* 适配安全区域 - 确保在安全区域内 */
  padding-top: max(16px, calc(16px + env(safe-area-inset-top, 0px)));
  padding-left: max(16px, calc(16px + env(safe-area-inset-left, 0px)));
  padding-right: max(16px, calc(16px + env(safe-area-inset-right, 0px)));
  /* 防止内容溢出 */
  min-height: 50px;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.close-icon {
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-icon:hover {
  color: #666;
}

.popup-content {
  flex: 1;
  overflow: hidden;
  /* 适配安全区域 - 确保内容在安全区域内 */
  padding-left: max(0px, env(safe-area-inset-left, 0px));
  padding-right: max(0px, env(safe-area-inset-right, 0px));
  /* 防止内容溢出 */
  min-height: 0;
  box-sizing: border-box;
}

.popup-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  bottom: 0;
  z-index: 10;
  /* 适配安全区域 - 确保在安全区域内 */
  padding-bottom: max(16px, calc(16px + env(safe-area-inset-bottom, 0px)));
  padding-left: max(16px, calc(16px + env(safe-area-inset-left, 0px)));
  padding-right: max(16px, calc(16px + env(safe-area-inset-right, 0px)));
  /* 防止内容溢出 */
  min-height: 60px;
  box-sizing: border-box;
}

.confirm-btn {
  font-size: 16px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .popup-header {
    padding: 12px;
    padding-top: max(12px, env(safe-area-inset-top, 12px));
  }
  
  .popup-title {
    font-size: 16px;
  }
  
  .popup-footer {
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .music-player-popup {
    height: 100dvh;
  }
  
  .popup-content {
    height: calc(100dvh - 120px);
    max-height: calc(100dvh - 120px);
  }
}

/* 小屏幕设备适配 */
@media (max-height: 600px) {
  .music-player-popup {
    height: 90dvh;
  }
  
  .popup-header {
    padding: 12px;
    padding-top: max(12px, calc(12px + env(safe-area-inset-top, 0px)));
    min-height: 44px;
  }
  
  .popup-footer {
    padding: 12px;
    padding-bottom: max(12px, calc(12px + env(safe-area-inset-bottom, 0px)));
    min-height: 54px;
  }
  
  .popup-title {
    font-size: 16px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .music-player-popup {
    background: #1a1a1a;
  }
  
  .popup-header {
    background: #1a1a1a;
    border-bottom: 1px solid #333;
  }
  
  .popup-title {
    color: #fff;
  }
  
  .close-icon {
    color: #ccc;
  }
  
  .close-icon:hover {
    color: #fff;
  }
  
  .popup-footer {
    background: #1a1a1a;
    border-top: 1px solid #333;
  }
}
</style>