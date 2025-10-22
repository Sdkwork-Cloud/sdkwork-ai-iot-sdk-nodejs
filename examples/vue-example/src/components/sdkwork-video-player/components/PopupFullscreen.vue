<template>
  <teleport to="body" v-if="isPopupFullscreen">
    <div class="popup-fullscreen-overlay" @click="closePopup">
      <div class="popup-fullscreen-content" @click.stop>
        <div class="popup-video-container">
          <div ref="popupVideoContainer" class="popup-video-js-container"></div>
          
          <!-- Popup controls -->
          <div class="popup-controls">
            <button class="popup-close-button" @click="closePopup">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            
            <!-- Enhanced controls for popup -->
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
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  player: any
  isPopupFullscreen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const popupVideoContainer = ref<HTMLElement>()
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1.0)
const isPlaying = ref(false)
const isMuted = ref(false)

const togglePlay = () => {
  if (props.player?.paused()) {
    props.player?.play()
  } else {
    props.player?.pause()
  }
}

const toggleMute = () => {
  if (props.player) {
    props.player.muted(!props.player.muted())
  }
}

const handleSeek = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (props.player) {
    props.player.currentTime(parseFloat(target.value))
  }
}

const closePopup = () => {
  emit('close')
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Watch for player state changes
watch(() => props.player, (newPlayer) => {
  if (newPlayer) {
    updatePlayerState()
    setupPlayerListeners()
  }
})

const updatePlayerState = () => {
  if (props.player) {
    currentTime.value = props.player.currentTime() || 0
    duration.value = props.player.duration() || 0
    volume.value = props.player.volume() || 1
    isPlaying.value = !props.player.paused()
    isMuted.value = props.player.muted()
  }
}

const setupPlayerListeners = () => {
  if (props.player) {
    props.player.on('timeupdate', () => {
      currentTime.value = props.player.currentTime()
    })
    
    props.player.on('durationchange', () => {
      duration.value = props.player.duration()
    })
    
    props.player.on('volumechange', () => {
      volume.value = props.player.volume()
      isMuted.value = props.player.muted()
    })
    
    props.player.on('play', () => {
      isPlaying.value = true
    })
    
    props.player.on('pause', () => {
      isPlaying.value = false
    })
  }
}

onMounted(async () => {
  if (props.isPopupFullscreen && props.player && popupVideoContainer.value) {
    await nextTick()
    // Move video element to popup
    const videoElement = props.player.el()
    if (videoElement && popupVideoContainer.value) {
      popupVideoContainer.value.appendChild(videoElement)
      props.player.width('100%')
      props.player.height('100%')
    }
  }
})

onUnmounted(() => {
  // Clean up listeners
  if (props.player) {
    props.player.off('timeupdate')
    props.player.off('durationchange')
    props.player.off('volumechange')
    props.player.off('play')
    props.player.off('pause')
  }
})
</script>

<style scoped>
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
  background: rgba(0, 0, 0, 0.7);
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
  z-index: 10;
}

.popup-control-bar {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  pointer-events: auto;
}

.control-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.1);
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
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.time-display {
  color: white;
  font-size: 14px;
  min-width: 100px;
}
</style>