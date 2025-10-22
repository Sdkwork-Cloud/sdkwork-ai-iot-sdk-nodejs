<template>
  <div class="sdkwork-video-player" :class="[`mode-${mode}`, { 'enable-loading': props.enableLoading }]">
    <!-- Video container will be initialized by SdkworkVideoPlayer -->
    <div ref="videoContainer" class="video-js-container">
      <!-- Video element will be created by SdkworkVideoPlayer -->
    </div>

    <!-- Display mode components -->
    <component 
      v-if="videoPlayer"
      :is="currentModeComponent" 
      :player="videoPlayer.getPlayerInstance()"
      :poster="props.poster"
    />
  </div>
</template>

<script lang="ts">
// Define display modes outside of setup script
export const DisplayMode = {
  CARD: 'card',
  FULLSCREEN: 'fullscreen',
  MINI: 'mini',
  THEATER: 'theater'
} as const
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { SdkworkVideoPlayer, VideoPlayerOptions, VideoPlayerEvents } from '@/core/video/player'

// Components
import CardMode from './components/modes/CardMode.vue'
import FullscreenMode from './components/modes/FullscreenMode.vue'
import MiniMode from './components/modes/MiniMode.vue'
import TheaterMode from './components/modes/TheaterMode.vue'

type DisplayModeType = 'card' | 'fullscreen' | 'mini' | 'theater'

// Props - HTML5 video element compatible attributes
interface Props {
  // Standard HTML5 video attributes
  src: string
  poster?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  playsinline?: boolean
  width?: string | number
  height?: string | number
  preload?: 'auto' | 'metadata' | 'none'
  crossorigin?: 'anonymous' | 'use-credentials'
  currentTime?: number
  volume?: number
  playbackRate?: number
  defaultMuted?: boolean
  disablePictureInPicture?: boolean
  mediaGroup?: string
  
  // Custom video player options
  mode?: DisplayModeType
  type?: string
  playbackRates?: number[]
  defaultPlaybackRate?: number
  aspectRatio?: string
  
  // Mobile-friendly options
  preferFullWindow?: boolean
  touchControls?: boolean
  techOrder?: string[]
  
  // Loading control
  enableLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  // Standard HTML5 video defaults
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  playsinline: true,
  width: '100%',
  height: 'auto',
  preload: 'auto',
  crossorigin: undefined,
  currentTime: 0,
  volume: 1.0,
  playbackRate: 1.0,
  defaultMuted: false,
  disablePictureInPicture: false,
  mediaGroup: undefined,
  
  // Custom defaults
  type: 'video/mp4',
  mode: DisplayMode.CARD,
  playbackRates: () => [0.5, 1, 1.25, 1.5, 2],
  defaultPlaybackRate: 1.0,
  
  // Mobile-friendly defaults
  preferFullWindow: false,
  touchControls: true,
  techOrder: () => ['html5'],
  
  // Loading control default
  enableLoading: false
})

// Emits - HTML5 video element compatible events
interface Emits {
  // Standard HTML5 video events
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
  (e: 'encrypted'): void
  (e: 'enterpictureinpicture'): void
  (e: 'leavepictureinpicture'): void
  (e: 'resize'): void
  
  // Custom video player events
  (e: 'ready', player: SdkworkVideoPlayer): void
  (e: 'fullscreenchange', isFullscreen: boolean): void
  (e: 'qualitychange', quality: string): void
  (e: 'trackchange', track: string): void
}

const emit = defineEmits<Emits>()

// Refs
const videoContainer = ref<HTMLElement>()
const videoPlayer = ref<SdkworkVideoPlayer>()
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1.0)
const playbackRate = ref(1.0)
const isBuffering = ref(false)
const isFullscreen = ref(false)

// Current mode component
const currentModeComponent = computed(() => {
  switch (props.mode) {
    case DisplayMode.FULLSCREEN: return FullscreenMode
    case DisplayMode.MINI: return MiniMode
    case DisplayMode.THEATER: return TheaterMode
    default: return CardMode
  }
})

// Player options
const playerOptions = computed<VideoPlayerOptions>(() => ({
  autoplay: props.autoplay,
  controls: props.controls,
  loop: props.loop,
  muted: props.muted,
  responsive: true,
  fluid: true,
  preload: props.preload,
  playbackRates: props.playbackRates,
  defaultPlaybackRate: props.defaultPlaybackRate,
  aspectRatio: props.aspectRatio,
  poster: props.poster,
  
  // Mode-specific configuration
  mode: props.mode,
  
  // Mobile-friendly options
  playsinline: props.playsinline,
  disablePictureInPicture: props.disablePictureInPicture,
  preferFullWindow: props.preferFullWindow,
  touchControls: props.touchControls,
  techOrder: props.techOrder,
  
  events: {
    // Standard HTML5 video events
    loadstart: () => emit('loadstart'),
    durationchange: (durationValue: number) => {
      duration.value = durationValue
      emit('durationchange', durationValue)
    },
    loadedmetadata: () => {
      const durationValue = videoPlayer.value?.getDuration() || 0
      duration.value = durationValue
      emit('loadedmetadata')
    },
    loadeddata: () => emit('loadeddata'),
    progress: (buffered: number) => emit('progress', buffered),
    canplay: () => {
      isBuffering.value = false
      emit('canplay')
    },
    canplaythrough: () => emit('canplaythrough'),
    play: () => emit('play'),
    pause: () => emit('pause'),
    seeked: (time: number) => emit('seeked', time),
    seeking: () => emit('seeking'),
    timeupdate: (time: number) => {
      currentTime.value = time
      emit('timeupdate', time)
    },
    ended: () => emit('ended'),
    ratechange: (rate: number) => {
      playbackRate.value = rate
      emit('ratechange', rate)
    },
    volumechange: (vol: number) => {
      volume.value = vol
      emit('volumechange', vol)
    },
    waiting: () => {
      isBuffering.value = true
      emit('waiting')
    },
    stalled: () => emit('stalled'),
    suspend: () => emit('suspend'),
    abort: () => emit('abort'),
    error: (error: Error) => emit('error', error),
    emptied: () => emit('emptied'),
    encrypted: () => emit('encrypted'),
    enterpictureinpicture: () => emit('enterpictureinpicture'),
    leavepictureinpicture: () => emit('leavepictureinpicture'),
    resize: () => emit('resize'),
    
    // Custom video player events
    ready: () => emit('ready', videoPlayer.value!),
    fullscreenchange: (fullscreen: boolean) => {
      isFullscreen.value = fullscreen
      emit('fullscreenchange', fullscreen)
    },
    qualitychange: (quality: string) => emit('qualitychange', quality),
    trackchange: (track: string) => emit('trackchange', track)
  } as VideoPlayerEvents
}))

// Initialize video player
onMounted(async () => {
  if (!videoContainer.value) return

  await nextTick()
  
  videoPlayer.value = new SdkworkVideoPlayer(playerOptions.value)
  videoPlayer.value.init(videoContainer.value)
  
  // Load video source
  if (props.src) {
    await videoPlayer.value.playFile(props.src, { type: props.type, poster: props.poster })
  }
})

// Watch for HTML5 video attribute changes
watch(() => props.src, async (newSrc) => {
  if (newSrc && videoPlayer.value) {
    await videoPlayer.value.playFile(newSrc, { type: props.type, poster: props.poster })
  }
})

// Watch for volume changes
watch(() => props.volume, (newVolume) => {
  if (videoPlayer.value && newVolume !== undefined) {
    videoPlayer.value.setVolume(newVolume)
  }
})

// Watch for currentTime changes (seek)
watch(() => props.currentTime, (newTime) => {
  if (videoPlayer.value && newTime !== undefined) {
    videoPlayer.value.seek(newTime)
  }
})

// Watch for playbackRate changes
watch(() => props.playbackRate, (newRate) => {
  if (videoPlayer.value && newRate !== undefined) {
    videoPlayer.value.setPlaybackRate(newRate)
  }
})

// Watch for muted changes
watch(() => props.muted, (newMuted) => {
  if (videoPlayer.value && newMuted !== undefined) {
    if (newMuted) {
      videoPlayer.value.setVolume(0)
    } else {
      videoPlayer.value.setVolume(props.volume || 1.0)
    }
  }
})

// Watch for defaultMuted changes
watch(() => props.defaultMuted, (newDefaultMuted) => {
  if (videoPlayer.value && newDefaultMuted !== undefined) {
    videoPlayer.value.setVolume(newDefaultMuted ? 0 : props.volume || 1.0)
  }
})

// Watch for disablePictureInPicture changes
watch(() => props.disablePictureInPicture, (newDisablePIP) => {
  if (videoPlayer.value && newDisablePIP !== undefined) {
    // Handle Picture-in-Picture configuration
    // This is handled by video.js configuration, no direct API call needed
  }
})

// Clean up
onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.destroy()
  }
})

// Expose methods - HTML5 video element compatible API
defineExpose({
  // Standard HTML5 video methods
  play: async () => {
    if (videoPlayer.value) {
      try {
        await videoPlayer.value.resume()
      } catch (error) {
        // If resume fails due to state issues, try direct play
        const player = videoPlayer.value.getPlayerInstance()
        if (player) {
          await player.play()
        }
      }
    }
  },
  pause: () => videoPlayer.value?.pause(),
  load: () => videoPlayer.value?.stop(),
  
  // Standard HTML5 video properties (getters)
  get currentTime() { return videoPlayer.value?.getCurrentTime() || 0 },
  get duration() { return videoPlayer.value?.getDuration() || 0 },
  get volume() { return videoPlayer.value?.getVolume() || 1.0 },
  get muted() { return videoPlayer.value?.isMuted() || false },
  get paused() { return videoPlayer.value?.isPaused() || true },
  get ended() { return videoPlayer.value?.isEnded() || false },
  get playbackRate() { return videoPlayer.value?.getPlaybackRate() || 1.0 },
  get readyState() { 
    if (!videoPlayer.value) return 0 // HAVE_NOTHING
    const player = videoPlayer.value.getPlayerInstance()
    return player?.readyState() || 0
  },
  get seeking() { return videoPlayer.value?.isSeeking() || false },
  get defaultMuted() { return props.defaultMuted || false },
  get disablePictureInPicture() { return props.disablePictureInPicture || false },
  get mediaGroup() { return props.mediaGroup || '' },
  
  // Standard HTML5 video properties (setters)
  set currentTime(time: number) { videoPlayer.value?.seek(time) },
  set volume(vol: number) { videoPlayer.value?.setVolume(vol) },
  set muted(mute: boolean) { 
    if (mute) {
      videoPlayer.value?.setVolume(0)
    } else {
      videoPlayer.value?.setVolume(props.volume || 1.0)
    }
  },
  set playbackRate(rate: number) { videoPlayer.value?.setPlaybackRate(rate) },
  set defaultMuted(mute: boolean) { 
    // Update the prop value through parent component
  },
  set disablePictureInPicture(disable: boolean) { 
    // Update the prop value through parent component
  },
  
  // Extended video player methods
  togglePlay: () => {
    if (videoPlayer.value?.isPaused()) {
      videoPlayer.value?.resume()
    } else {
      videoPlayer.value?.pause()
    }
  },
  toggleMute: () => videoPlayer.value?.toggleMute(),
  toggleFullscreen: () => videoPlayer.value?.toggleFullscreen(),
  enterFullscreen: () => videoPlayer.value?.enterFullscreen(),
  exitFullscreen: () => videoPlayer.value?.exitFullscreen(),
  setQuality: (quality: string) => videoPlayer.value?.setQuality(quality),
  
  // Picture-in-Picture methods (HTML5 standard)
  requestPictureInPicture: () => {
    if (videoPlayer.value?.getPlayerInstance()) {
      return videoPlayer.value.getPlayerInstance().requestPictureInPicture?.()
    }
  },
  exitPictureInPicture: () => {
    if (videoPlayer.value?.getPlayerInstance()) {
      return document.exitPictureInPicture?.()
    }
  },
  
  // Getter methods for advanced usage
  getPlayer: () => videoPlayer.value,
  getPlayerInstance: () => videoPlayer.value?.getPlayerInstance(),
  isFullscreen: () => videoPlayer.value?.getPlayerInstance()?.isFullscreen() || false,
  
  // Reactive state properties
  currentTimeRef: currentTime,
  durationRef: duration,
  volumeRef: volume,
  playbackRateRef: playbackRate,
  isBufferingRef: isBuffering,
  isFullscreenRef: isFullscreen
})
</script>

<style scoped>
.sdkwork-video-player {
  position: relative;
  width: v-bind('props.width');
  height: v-bind('props.height');
}

.video-js-container {
  width: 100%;
  height: 100%;
}

/* Responsive video */
.video-js {
  width: 100%;
  height: 100%;
}

/* Mode specific styles */
.mode-card {
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
}

.mode-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh; /* 使用动态视口高度 */
  min-height: -webkit-fill-available; /* Safari 支持 */
  z-index: 50;
  background: #000;
  
  /* 安全区域适配 */
  @supports(padding: max(0px)) {
    height: calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    min-height: calc(-webkit-fill-available - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

.mode-fullscreen .video-js-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mode-fullscreen .video-js {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

/* Perfect screen adaptation for different aspect ratios */
.mode-fullscreen .video-js.vjs-16-9 {
  /* 16:9 aspect ratio */
  aspect-ratio: 16/9;
}

.mode-fullscreen .video-js.vjs-9-16 {
  /* 9:16 aspect ratio (vertical videos) */
  aspect-ratio: 9/16;
}

.mode-fullscreen .video-js.vjs-1-1 {
  /* 1:1 aspect ratio (square videos) */
  aspect-ratio: 1/1;
}

/* Center video in container */
.mode-fullscreen .video-js-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

/* Smart video sizing based on screen orientation */
@media (orientation: landscape) {
  .mode-fullscreen .video-js {
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
}

@media (orientation: portrait) {
  .mode-fullscreen .video-js {
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}

.mode-mini {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 240px;
  height: 135px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mode-theater {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Loading/buffering indicator - controlled by enableLoading prop */
.video-js .vjs-loading-spinner {
  z-index: 10;
  display: none; /* Default hidden */
}

.video-js.enable-loading .vjs-loading-spinner {
  display: block; /* Show when enableLoading is true */
}

/* BigPlayButton positioning and styling */
:deep(.video-js .vjs-big-play-button) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.8);
  width: 80px;
  height: 80px;
  margin: 0;
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icon positioning within the button */
:deep(.video-js .vjs-big-play-button .vjs-icon-placeholder) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

:deep(.video-js .vjs-big-play-button .vjs-icon-placeholder:before) {
  content: "▶";
  font-size: 32px;
  line-height: 1;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Show BigPlayButton when video is paused */
:deep(.video-js.vjs-paused .vjs-big-play-button) {
  display: block;
  opacity: 1;
  visibility: visible;
}

/* Hide BigPlayButton when video is playing */
:deep(.video-js.vjs-playing .vjs-big-play-button) {
  display: none;
}

/* Hover effect for better UX */
:deep(.video-js .vjs-big-play-button:hover) {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.05);
}
</style>