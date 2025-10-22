<template>
  <div 
    class="control-bar"
    :class="{ 'auto-hide': autoHide }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click.stop
  >
    <!-- Progress bar -->
    <div class="progress-container" v-if="showProgress">
      <input
        type="range"
        class="progress-bar"
        min="0"
        :max="duration"
        :value="currentTime"
        @input="handleSeek"
      />
    </div>

    <!-- Main controls -->
    <div class="main-controls">
      <!-- Play/pause -->
      <button class="control-button" @click="togglePlay">
        <van-icon :name="isPlaying ? 'pause' : 'play'" />
      </button>

      <!-- Volume -->
      <div class="volume-control" v-if="showVolume">
        <button class="control-button" @click="toggleMute">
          <van-icon :name="isMuted ? 'volume-mute' : 'volume'" />
        </button>
        <input
          type="range"
          class="volume-bar"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          @input="handleVolumeChange"
        />
      </div>

      <!-- Time display -->
      <div class="time-display" v-if="showTime">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>

      <!-- Fullscreen -->
      <button 
        class="control-button fullscreen-button" 
        v-if="showFullscreen"
        @click="toggleFullscreen"
      >
        <van-icon :name="isFullscreen ? 'shrink' : 'fullscreen'" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  player: any
  showProgress?: boolean
  showTime?: boolean
  showVolume?: boolean
  showFullscreen?: boolean
  autoHide?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  showTime: true,
  showVolume: true,
  showFullscreen: true,
  autoHide: false
})

const isVisible = ref(true)
const isPlaying = computed(() => !props.player?.paused())
const isMuted = computed(() => props.player?.muted())
const isFullscreen = computed(() => props.player?.isFullscreen())
const currentTime = computed(() => props.player?.currentTime() || 0)
const duration = computed(() => props.player?.duration() || 0)
const volume = computed(() => props.player?.volume() || 1)

let hideTimeout: number

const togglePlay = () => {
  if (props.player.paused()) {
    props.player.play()
  } else {
    props.player.pause()
  }
}

const toggleMute = () => {
  props.player.muted(!props.player.muted())
}

const toggleFullscreen = () => {
  if (props.player.isFullscreen()) {
    props.player.exitFullscreen()
  } else {
    props.player.requestFullscreen()
  }
}

const handleSeek = (e: Event) => {
  const target = e.target as HTMLInputElement
  props.player.currentTime(parseFloat(target.value))
}

const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  props.player.volume(parseFloat(target.value))
}

const handleMouseEnter = () => {
  isVisible.value = true
  clearTimeout(hideTimeout)
}

const handleMouseLeave = () => {
  if (props.autoHide) {
    hideTimeout = setTimeout(() => {
      isVisible.value = false
    }, 2000)
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  if (props.autoHide) {
    hideTimeout = setTimeout(() => {
      isVisible.value = false
    }, 2000)
  }
})

onUnmounted(() => {
  clearTimeout(hideTimeout)
})
</script>

<style scoped>
.control-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.control-bar.auto-hide:not(:hover) {
  opacity: 0;
}

.progress-container {
  width: 100%;
  padding: 8px 0;
}

.progress-bar {
  width: 100%;
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

.main-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.volume-bar {
  width: 60px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
}

.volume-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.time-display {
  font-size: 12px;
  margin-left: auto;
  margin-right: 8px;
}
</style>