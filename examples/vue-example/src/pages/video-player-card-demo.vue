<template>
  <div class="demo-container">
    <h1>视频播放器 - Card Mode 演示</h1>
    
    <div class="demo-section">
      <h2>Card Mode 示例</h2>
      <sdkwork-video-player
        ref="cardPlayer"
        src="https://vjs.zencdn.net/v/oceans.mp4"
        poster="https://vjs.zencdn.net/v/oceans.png"
        mode="card"
        @ready="onPlayerReady"
      />
      <button class="popup-fullscreen-btn" @click="openPopupFullscreen">
        弹出全屏
      </button>
    </div>

    <!-- Popup Fullscreen Overlay -->
    <div v-if="showPopupFullscreen" class="popup-fullscreen-overlay" @click="closePopupFullscreen">
      <div class="popup-fullscreen-content" @click.stop>
        <div class="popup-video-container">
          <div ref="popupVideoContainer" class="popup-video-js-container"></div>
          
          <!-- Popup controls -->
          <div class="popup-controls">
            <button class="popup-close-button" @click="closePopupFullscreen">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            
            <div class="popup-control-bar">
              <button class="control-button" @click="togglePlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path v-if="isPlaying" d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                  <path v-else d="M8 5v14l11-7z"/>
                </svg>
              </button>
              
              <div class="time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </div>
              
              <input
                type="range"
                class="progress-bar"
                min="0"
                :max="duration"
                :value="currentTime"
                @input="handleSeek"
              />
              
              <button class="control-button" @click="toggleMute">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path v-if="isMuted" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  <path v-else-if="volume > 0.5" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  <path v-else d="M7 9v6h4l5 5V4L11 9H7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import SdkworkVideoPlayer from '@/components/sdkwork-video-player/sdkwork-video-player.vue'

interface VideoPlayerInstance {
  getPlayerInstance: () => any
  isPaused: () => boolean
  resume: () => void
  pause: () => void
  toggleMute: () => void
  seek: (time: number) => void
  getCurrentTime: () => number
  getDuration: () => number
  getVolume: () => number
  isMuted: () => boolean
  destroy: () => void
}

const cardPlayer = ref<InstanceType<typeof SdkworkVideoPlayer>>()
const showPopupFullscreen = ref(false)
const currentPlayer = ref<VideoPlayerInstance | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1.0)
const isPlaying = ref(false)
const isMuted = ref(false)
const popupVideoContainer = ref<HTMLElement>()

const onPlayerReady = (player: any) => {
  console.log('Player ready:', player)
}

const openPopupFullscreen = () => {
  if (cardPlayer.value) {
    currentPlayer.value = cardPlayer.value.getPlayer() as VideoPlayerInstance
    showPopupFullscreen.value = true
    updatePlayerState()
    setupPlayerListeners()
    
    // Move video element to popup after DOM update
    nextTick(() => {
      if (currentPlayer.value && popupVideoContainer.value) {
        const playerInstance = currentPlayer.value.getPlayerInstance()
        if (playerInstance && playerInstance.el) {
          const videoElement = playerInstance.el()
          if (videoElement) {
            popupVideoContainer.value.appendChild(videoElement)
          }
        }
      }
    })
  }
}

const closePopupFullscreen = () => {
  showPopupFullscreen.value = false
  currentPlayer.value = null
  
  // Reset player state
  currentTime.value = 0
  duration.value = 0
  volume.value = 1.0
  isPlaying.value = false
  isMuted.value = false
}

const togglePlay = () => {
  if (currentPlayer.value) {
    if (currentPlayer.value.isPaused()) {
      currentPlayer.value.resume()
    } else {
      currentPlayer.value.pause()
    }
  }
}

const toggleMute = () => {
  if (currentPlayer.value) {
    currentPlayer.value.toggleMute()
  }
}

const handleSeek = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (currentPlayer.value) {
    currentPlayer.value.seek(parseFloat(target.value))
  }
}

const updatePlayerState = () => {
  if (currentPlayer.value) {
    currentTime.value = currentPlayer.value.getCurrentTime() || 0
    duration.value = currentPlayer.value.getDuration() || 0
    volume.value = currentPlayer.value.getVolume() || 1
    isPlaying.value = !currentPlayer.value.isPaused()
    isMuted.value = currentPlayer.value.isMuted()
  }
}

const setupPlayerListeners = () => {
  if (currentPlayer.value) {
    // Listen to player events for real-time updates
    const playerInstance = currentPlayer.value.getPlayerInstance()
    if (playerInstance) {
      const player = currentPlayer.value
      
      playerInstance.on('timeupdate', () => {
        currentTime.value = player.getCurrentTime()
      })
      
      playerInstance.on('durationchange', () => {
        duration.value = player.getDuration()
      })
      
      playerInstance.on('volumechange', () => {
        volume.value = player.getVolume()
        isMuted.value = player.isMuted()
      })
      
      playerInstance.on('play', () => {
        isPlaying.value = true
      })
      
      playerInstance.on('pause', () => {
        isPlaying.value = false
      })
    }
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Handle ESC key to close popup
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showPopupFullscreen.value) {
    closePopupFullscreen()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (currentPlayer.value) {
    currentPlayer.value.destroy()
  }
})
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  position: relative;
}

.popup-fullscreen-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-fullscreen-content {
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  position: relative;
}

.popup-video-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.popup-video-js-container {
  width: 100%;
  height: 100%;
}

.popup-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.popup-close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
}

.popup-control-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: center;
  gap: 16px;
  pointer-events: auto;
}

.control-button {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.time-display {
  color: white;
  font-size: 14px;
  margin: 0 16px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}
</style>