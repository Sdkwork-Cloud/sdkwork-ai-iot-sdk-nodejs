<template>
  <div class="sdkwork-audio-player" :class="[`mode-${mode}`, { 'enable-controls': props.showControls }, { 'enable-progress': props.showProgress }]">
    <!-- Audio container -->
    <div ref="audioContainer" class="audio-container">
      <!-- Native audio element for non-stream playback -->
      <audio
        v-if="!isStreamMode"
        ref="audioElement"
        :src="props.src"
        :autoplay="props.autoplay"
        :controls="false"
        :loop="props.loop"
        :muted="props.muted"
        :preload="props.preload"
        :crossorigin="props.crossorigin"
        @loadstart="handleLoadStart"
        @durationchange="handleDurationChange"
        @loadedmetadata="handleLoadedMetadata"
        @loadeddata="handleLoadedData"
        @progress="handleProgress"
        @canplay="handleCanPlay"
        @canplaythrough="handleCanPlayThrough"
        @play="handlePlay"
        @pause="handlePause"
        @seeked="handleSeeked"
        @seeking="handleSeeking"
        @timeupdate="handleTimeUpdate"
        @ended="handleEnded"
        @ratechange="handleRateChange"
        @volumechange="handleVolumeChange"
        @waiting="handleWaiting"
        @stalled="handleStalled"
        @suspend="handleSuspend"
        @abort="handleAbort"
        @error="handleError"
        @emptied="handleEmptied"
      />
    </div>

    <!-- Custom audio controls -->
    <div v-if="props.showControls" class="audio-controls">
      <!-- Play/Pause button -->
      <button 
        class="control-btn play-pause-btn"
        :class="{ playing: isPlaying }"
        @click="togglePlay"
        :title="isPlaying ? '暂停' : '播放'"
      >
        <sdkwork-icon 
          :icon="isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'" 
          width="20" 
          height="20" 
        />
      </button>

      <!-- Progress bar -->
      <div v-if="props.showProgress" class="progress-container">
        <span class="time-current">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="handleProgressClick">
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            />
            <div 
              class="progress-thumb" 
              :style="{ left: progressPercentage + '%' }"
            />
          </div>
        </div>
        <span class="time-duration">{{ formatTime(duration) }}</span>
      </div>

      <!-- Volume control -->
      <div class="volume-control">
        <button 
          class="control-btn volume-btn"
          @click="toggleMute"
          :title="isMuted ? '取消静音' : '静音'"
        >
          <sdkwork-icon 
            :icon="getVolumeIcon()" 
            width="18" 
            height="18" 
          />
        </button>
        <div class="volume-slider" @click="handleVolumeClick">
          <div class="volume-track">
            <div 
              class="volume-fill" 
              :style="{ width: volumePercentage + '%' }"
            />
          </div>
        </div>
      </div>

      <!-- Additional controls slot -->
      <slot name="controls" />
    </div>

    <!-- Audio information display -->
    <div v-if="props.showInfo" class="audio-info">
      <slot name="info">
        <div class="audio-title">{{ props.title || '未知音频' }}</div>
        <div class="audio-artist">{{ props.artist || '未知艺术家' }}</div>
      </slot>
    </div>

    <!-- Loading indicator -->
    <div v-if="isBuffering" class="loading-indicator">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- Error display -->
    <div v-if="error" class="error-display">
      <sdkwork-icon icon="material-symbols:error-rounded" width="24" height="24" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts">
// Define display modes
const DisplayMode = {
  CARD: 'card',
  COMPACT: 'compact',
  MINIMAL: 'minimal'
} as const
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { SdkworkAudioPlayer as StandardAudioPlayer } from '@/core/audio/player/sdkwork_audio_player'
import { SdkworkStreamAudioPlayer } from '@/core/audio/player/sdkwork_stream_player'
import { IAudioPlayer, IStreamAudioPlayer, AudioPlayerState, AutoplayPermissionResult } from '@/core/audio/player/types'

type DisplayModeType = 'card' | 'compact' | 'minimal'

// Props - HTML5 audio element compatible attributes
interface Props {
  // Standard HTML5 audio attributes
  src?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  crossorigin?: 'anonymous' | 'use-credentials'
  currentTime?: number
  volume?: number
  playbackRate?: number
  
  // Custom audio player options
  mode?: DisplayModeType
  type?: string
  
  // Display control
  showControls?: boolean
  showProgress?: boolean
  showInfo?: boolean
  
  // Audio metadata
  title?: string
  artist?: string
  album?: string
  
  // Stream mode
  streamMode?: boolean
  streamSampleRate?: number
  streamChannels?: number
  
  // Theme
  themeMode?: 'dark' | 'light' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  // Standard HTML5 audio defaults
  autoplay: false,
  controls: false,
  loop: false,
  muted: false,
  preload: 'auto',
  crossorigin: undefined,
  currentTime: 0,
  volume: 1.0,
  playbackRate: 1.0,
  
  // Custom defaults
  type: 'audio/mpeg',
  mode: DisplayMode.CARD,
  
  // Display control defaults
  showControls: true,
  showProgress: true,
  showInfo: true,
  
  // Stream mode defaults
  streamMode: false,
  streamSampleRate: 16000,
  streamChannels: 1,
  
  // Theme default
  themeMode: 'auto'
})

// Emits - HTML5 audio element compatible events
interface Emits {
  // Standard HTML5 audio events
  (e: 'loadstart'): void
  (e: 'durationchange', duration: number): void
  (e: 'loadedmetadata'): void
  (e: 'loadeddata'): void
  (e: 'progress', buffered: number): void
  (e: 'canplay'): void
  (e: 'canplaythrough'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'seeked', time: number): void
  (e: 'seeking'): void
  (e: 'timeupdate', time: number): void
  (e: 'ended'): void
  (e: 'ratechange', rate: number): void
  (e: 'volumechange', volume: number): void
  (e: 'waiting'): void
  (e: 'stalled'): void
  (e: 'suspend'): void
  (e: 'abort'): void
  (e: 'error', error: Error): void
  (e: 'emptied'): void
  
  // Custom audio player events
  (e: 'ready', player: IAudioPlayer | IStreamAudioPlayer): void
  (e: 'autoplay-blocked', result: AutoplayPermissionResult): void
  (e: 'autoplay-status-change', result: AutoplayPermissionResult): void
  (e: 'state-change', state: AudioPlayerState): void
}

const emit = defineEmits<Emits>()

// Refs
const audioContainer = ref<HTMLElement>()
const audioElement = ref<HTMLAudioElement>()
const audioPlayer = ref<IAudioPlayer>()
const streamPlayer = ref<IStreamAudioPlayer>()

// Reactive state
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1.0)
const playbackRate = ref(1.0)
const isPlaying = ref(false)
const isBuffering = ref(false)
const isMuted = ref(false)
const error = ref<Error | null>(null)

// Computed properties
const isStreamMode = computed(() => props.streamMode)
const progressPercentage = computed(() => {
  if (duration.value <= 0) return 0
  return (currentTime.value / duration.value) * 100
})
const volumePercentage = computed(() => volume.value * 100)
const errorMessage = computed(() => error.value?.message || '播放错误')

// Initialize audio player
onMounted(async () => {
  await nextTick()
  
  if (isStreamMode.value) {
    // Initialize stream audio player
    streamPlayer.value = new SdkworkStreamAudioPlayer()
    emit('ready', streamPlayer.value)
    
    // Setup stream player events
    setupStreamPlayerEvents()
    
    // Start stream if autoplay is enabled
    if (props.autoplay) {
      await startStreamPlayback()
    }
  } else {
    // Initialize standard audio player
    audioPlayer.value = new StandardAudioPlayer({
      autoplay: props.autoplay,
      loop: props.loop,
      volume: props.volume,
      events: {
        onPlay: () => {
          isPlaying.value = true
          emit('play')
        },
        onPause: () => {
          isPlaying.value = false
          emit('pause')
        },
        onStop: () => {
          isPlaying.value = false
          currentTime.value = 0
        },
        onEnd: () => {
          isPlaying.value = false
          emit('ended')
        },
        onError: (err) => {
          error.value = err
          emit('error', err)
        },
        onTimeUpdate: (time, dur) => {
          currentTime.value = time
          duration.value = dur
          emit('timeupdate', time)
        },
        onVolumeChange: (vol) => {
          volume.value = vol
          isMuted.value = vol === 0
          emit('volumechange', vol)
        },
        onAutoplayBlocked: (result) => {
          emit('autoplay-blocked', result)
        },
        onAutoplayStatusChange: (result) => {
          emit('autoplay-status-change', result)
        }
      }
    })
    
    emit('ready', audioPlayer.value)
    
    // Load audio source if provided
    if (props.src) {
      await loadAudioSource()
    }
  }
})

// Setup stream player events
const setupStreamPlayerEvents = () => {
  if (!streamPlayer.value) return
  
  // Setup event listeners for stream player
  // Note: Stream player uses mitt event emitter
  // Implementation depends on the actual SdkworkStreamAudioPlayer implementation
}

// Load audio source
const loadAudioSource = async () => {
  if (!audioPlayer.value || !props.src) return
  
  try {
    await audioPlayer.value.playFile(props.src)
    emit('loadstart')
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
    emit('error', error.value)
  }
}

// Start stream playback
const startStreamPlayback = async () => {
  if (!streamPlayer.value) return
  
  try {
    await streamPlayer.value.startStream(props.streamSampleRate, props.streamChannels)
    isPlaying.value = true
    emit('play')
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
    emit('error', error.value)
  }
}

// HTML5 audio event handlers
const handleLoadStart = () => emit('loadstart')
const handleDurationChange = () => {
  duration.value = audioElement.value?.duration || 0
  emit('durationchange', duration.value)
}
const handleLoadedMetadata = () => {
  duration.value = audioElement.value?.duration || 0
  emit('loadedmetadata')
}
const handleLoadedData = () => emit('loadeddata')
const handleProgress = (event: Event) => {
  const audio = event.target as HTMLAudioElement
  const buffered = audio.buffered.length > 0 ? audio.buffered.end(0) : 0
  emit('progress', buffered)
}
const handleCanPlay = () => {
  isBuffering.value = false
  emit('canplay')
}
const handleCanPlayThrough = () => emit('canplaythrough')
const handlePlay = () => {
  isPlaying.value = true
  emit('play')
}
const handlePause = () => {
  isPlaying.value = false
  emit('pause')
}
const handleSeeked = (event: Event) => {
  const audio = event.target as HTMLAudioElement
  emit('seeked', audio.currentTime)
}
const handleSeeking = () => emit('seeking')
const handleTimeUpdate = (event: Event) => {
  const audio = event.target as HTMLAudioElement
  currentTime.value = audio.currentTime
  emit('timeupdate', audio.currentTime)
}
const handleEnded = () => {
  isPlaying.value = false
  emit('ended')
}
const handleRateChange = (event: Event) => {
  const audio = event.target as HTMLAudioElement
  playbackRate.value = audio.playbackRate
  emit('ratechange', audio.playbackRate)
}
const handleVolumeChange = (event: Event) => {
  const audio = event.target as HTMLAudioElement
  volume.value = audio.volume
  isMuted.value = audio.muted
  emit('volumechange', audio.volume)
}
const handleWaiting = () => {
  isBuffering.value = true
  emit('waiting')
}
const handleStalled = () => emit('stalled')
const handleSuspend = () => emit('suspend')
const handleAbort = () => emit('abort')
const handleError = (event: Event) => {
  const audio = event.target as HTMLAudioElement
  error.value = new Error(`Audio error: ${audio.error?.message || 'Unknown error'}`)
  emit('error', error.value)
}
const handleEmptied = () => emit('emptied')

// Control methods
const togglePlay = async () => {
  if (isPlaying.value) {
    await pause()
  } else {
    await play()
  }
}

const play = async () => {
  if (isStreamMode.value) {
    await streamPlayer.value?.resume()
  } else {
    await audioPlayer.value?.resume()
  }
}

const pause = () => {
  if (isStreamMode.value) {
    streamPlayer.value?.pause()
  } else {
    audioPlayer.value?.pause()
  }
}

const toggleMute = () => {
  if (isStreamMode.value) {
    const currentVolume = streamPlayer.value?.getVolume() || 0
    streamPlayer.value?.setVolume(currentVolume === 0 ? volume.value : 0)
  } else {
    const currentVolume = audioPlayer.value?.getVolume() || 0
    audioPlayer.value?.setVolume(currentVolume === 0 ? volume.value : 0)
  }
}

const handleProgressClick = (event: MouseEvent) => {
  if (!props.showProgress || duration.value <= 0) return
  
  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const clickPosition = (event.clientX - rect.left) / rect.width
  const newTime = duration.value * clickPosition
  
  seek(newTime)
}

const seek = (time: number) => {
  if (isStreamMode.value) {
    // Stream mode may not support seeking
    console.warn('Stream mode does not support seeking')
  } else {
    audioPlayer.value?.seek(time)
  }
}

const handleVolumeClick = (event: MouseEvent) => {
  const volumeSlider = event.currentTarget as HTMLElement
  const rect = volumeSlider.getBoundingClientRect()
  const clickPosition = (event.clientX - rect.left) / rect.width
  const newVolume = Math.max(0, Math.min(1, clickPosition))
  
  setVolume(newVolume)
}

const setVolume = (vol: number) => {
  volume.value = vol
  if (isStreamMode.value) {
    streamPlayer.value?.setVolume(vol)
  } else {
    audioPlayer.value?.setVolume(vol)
  }
}

// Utility methods
const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '00:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getVolumeIcon = (): string => {
  if (isMuted.value || volume.value === 0) {
    return 'material-symbols:volume-off-rounded'
  } else if (volume.value < 0.5) {
    return 'material-symbols:volume-down-rounded'
  } else {
    return 'material-symbols:volume-up-rounded'
  }
}

// Watch for prop changes
watch(() => props.src, async (newSrc) => {
  if (newSrc && !isStreamMode.value && audioPlayer.value) {
    await loadAudioSource()
  }
})

watch(() => props.volume, (newVolume) => {
  setVolume(newVolume)
})

watch(() => props.currentTime, (newTime) => {
  seek(newTime)
})

// Clean up
onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.destroy()
  }
  if (streamPlayer.value) {
    streamPlayer.value.destroy()
  }
})

// Expose methods - HTML5 audio element compatible API
defineExpose({
  // Standard HTML5 audio methods
  play,
  pause,
  load: () => {
    if (isStreamMode.value) {
      streamPlayer.value?.stop()
    } else {
      audioPlayer.value?.stop()
    }
  },
  
  // Standard HTML5 audio properties (getters)
  get currentTime() { return currentTime.value },
  get duration() { return duration.value },
  get volume() { return volume.value },
  get muted() { return isMuted.value },
  get paused() { return !isPlaying.value },
  get ended() { return currentTime.value >= duration.value && duration.value > 0 },
  get playbackRate() { return playbackRate.value },
  get readyState() { 
    if (isStreamMode.value) {
      return streamPlayer.value?.getState() === AudioPlayerState.READY ? 4 : 0
    } else {
      return audioPlayer.value?.getState() === AudioPlayerState.READY ? 4 : 0
    }
  },
  
  // Standard HTML5 audio properties (setters)
  set currentTime(time: number) { seek(time) },
  set volume(vol: number) { setVolume(vol) },
  set muted(mute: boolean) { 
    if (mute) {
      setVolume(0)
    } else {
      setVolume(props.volume || 1.0)
    }
  },
  set playbackRate(rate: number) { 
    playbackRate.value = rate
    if (!isStreamMode.value) {
      audioPlayer.value?.setPlaybackRate(rate)
    }
  },
  
  // Extended audio player methods
  togglePlay,
  toggleMute,
  seek,
  
  // Stream player specific methods
  appendStreamData: (data: Float32Array | Int16Array | ArrayBuffer) => {
    if (isStreamMode.value && streamPlayer.value) {
      streamPlayer.value.appendStreamData(data)
    }
  },
  
  // Getter methods for advanced usage
  getPlayer: () => isStreamMode.value ? streamPlayer.value : audioPlayer.value,
  getState: () => {
    if (isStreamMode.value) {
      return streamPlayer.value?.getState()
    } else {
      return audioPlayer.value?.getState()
    }
  },
  
  // Reactive state properties
  currentTimeRef: currentTime,
  durationRef: duration,
  volumeRef: volume,
  isPlayingRef: isPlaying,
  isBufferingRef: isBuffering,
  isMutedRef: isMuted,
  errorRef: error
})
</script>

<style scoped lang="scss">
.sdkwork-audio-player {
  position: relative;
  width: 100%;
  min-height: 60px;
  background: var(--sdkwork-audio-bg, #f5f5f5);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audio-container {
  display: none; // Hide native audio element
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-btn {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--sdkwork-audio-control-color, #333);
  
  &:hover {
    background: var(--sdkwork-audio-control-hover-bg, rgba(0, 0, 0, 0.1));
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.play-pause-btn {
  &.playing {
    color: var(--sdkwork-audio-primary, #007bff);
  }
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.time-current,
.time-duration {
  font-size: 12px;
  color: var(--sdkwork-audio-text-secondary, #666);
  min-width: 40px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--sdkwork-audio-progress-bg, #ddd);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 100%;
}

.progress-fill {
  height: 100%;
  background: var(--sdkwork-audio-primary, #007bff);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: var(--sdkwork-audio-primary, #007bff);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar:hover .progress-thumb {
  opacity: 1;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  background: var(--sdkwork-audio-progress-bg, #ddd);
  border-radius: 2px;
  cursor: pointer;
}

.volume-track {
  position: relative;
  width: 100%;
  height: 100%;
}

.volume-fill {
  height: 100%;
  background: var(--sdkwork-audio-primary, #007bff);
  border-radius: 2px;
}

.audio-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.audio-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--sdkwork-audio-text-primary, #333);
}

.audio-artist {
  font-size: 12px;
  color: var(--sdkwork-audio-text-secondary, #666);
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--sdkwork-audio-text-secondary, #666);
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid var(--sdkwork-audio-primary, #007bff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #d32f2f;
}

/* Mode specific styles */
.mode-compact {
  min-height: 48px;
  padding: 8px;
  
  .audio-controls {
    gap: 12px;
  }
  
  .control-btn {
    width: 32px;
    height: 32px;
  }
  
  .progress-container {
    min-width: 150px;
  }
}

.mode-minimal {
  min-height: 40px;
  padding: 6px;
  
  .audio-controls {
    gap: 8px;
  }
  
  .control-btn {
    width: 28px;
    height: 28px;
  }
  
  .progress-container {
    min-width: 120px;
  }
  
  .audio-info {
    display: none;
  }
}

/* Theme variants */
.sdkwork-audio-player[data-theme="dark"] {
  --sdkwork-audio-bg: #2d2d2d;
  --sdkwork-audio-control-color: #fff;
  --sdkwork-audio-control-hover-bg: rgba(255, 255, 255, 0.1);
  --sdkwork-audio-primary: #4dabf7;
  --sdkwork-audio-text-primary: #fff;
  --sdkwork-audio-text-secondary: #ccc;
  --sdkwork-audio-progress-bg: #555;
}

/* Responsive design */
@media (max-width: 768px) {
  .sdkwork-audio-player {
    padding: 10px;
    gap: 10px;
  }
  
  .audio-controls {
    gap: 12px;
  }
  
  .progress-container {
    min-width: 150px;
  }
  
  .volume-slider {
    width: 60px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>