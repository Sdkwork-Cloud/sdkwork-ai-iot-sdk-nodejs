<template>
  <div class="sdkwork-player-slides" :class="[`mode-${mode}`, { 'has-video': showVideo }, { 'has-subtitles': showSubtitles }]">
    <!-- 幻灯片容器 -->
    <div class="slides-container">
      <sdkwork-swiper
        ref="swiperRef"
        :autoplay="autoplayInterval"
        :initial-swipe="currentSlideIndex"
        :loop="false"
        :show-indicators="showIndicators"
        :touchable="touchable"
        :class="swiperClass"
        @change="handleSlideChange"
      >
        <sdkwork-swiper-item
          v-for="(slide, index) in slides?.items || []"
          :key="slide.sequence || index"
          :class="['slide-item', { 'active': index === currentSlideIndex }]"
        >
          <!-- 幻灯片内容 -->
          <div class="slide-content">
            <!-- 图片幻灯片 -->
            <img
              v-if="slide.image"
              :src="slide.image.url"
              :alt="slide.title"
              class="slide-image"
              @load="handleImageLoad"
              @error="handleImageError"
            />
            
            <!-- HTML内容幻灯片 -->
            <div
              v-else-if="slide.html"
              v-html="slide.html"
              class="slide-html"
            />
            
            <!-- 文本内容幻灯片 -->
            <div v-else class="slide-text">
              <h3 class="slide-title">{{ slide.title }}</h3>
              <div class="slide-body">{{ slide.content }}</div>
            </div>
            
            <!-- 幻灯片序号 -->
            <div class="slide-number">
              {{ index + 1 }} / {{ totalSlides }}
            </div>
          </div>
        </sdkwork-swiper-item>
      </sdkwork-swiper>
    </div>

    <!-- 多媒体播放器区域 -->
    <div class="media-container" v-if="hasMedia">
      <!-- 音频播放器 -->
      <sdkwork-audio-player
        v-if="slides?.audio && showAudio"
        ref="audioPlayerRef"
        :src="slides.audio.url"
        :autoplay="autoplay"
        :loop="false"
        :show-controls="showAudioControls"
        :show-progress="showProgress"
        :class="['audio-player', { 'hidden': !showAudio }]"
        @timeupdate="handleAudioTimeUpdate"
        @play="handleAudioPlay"
        @pause="handleAudioPause"
        @ended="handleAudioEnded"
      />

      <!-- 视频播放器 -->
      <sdkwork-video-player
        v-if="slides?.video && showVideo"
        ref="videoPlayerRef"
        :src="slides.video.url as string"
        :autoplay="autoplay"
        :loop="false"
        :controls="showVideoControls"
        :class="['video-player', { 'hidden': !showVideo }]"
        @timeupdate="handleVideoTimeUpdate"
        @play="handleVideoPlay"
        @pause="handleVideoPause"
        @ended="handleVideoEnded"
      />

      <!-- 字幕组件 -->
      <sdkwork-subtitles
        v-if="showSubtitles"
        ref="subtitlesRef"
        :current-time="currentMediaTime"
        :subtitles="subtitlesData"
        :is-playing="isPlaying"
        :show-controls="false"
        :class="['subtitles', { 'hidden': !showSubtitles }]"
        @entry-change="handleSubtitleEntryChange"
        @load-complete="handleSubtitleLoadComplete"
        @load-error="handleSubtitleLoadError"
      />
    </div>

    <!-- 控制栏 -->
    <div class="control-bar" v-if="showControls">
      <div class="control-left">
        <!-- 播放/暂停按钮 -->
        <button
          class="control-btn play-pause-btn"
          :class="{ playing: isPlaying }"
          @click="togglePlay"
          :title="isPlaying ? '暂停' : '播放'"
        >
          <sdkwork-icon 
            :icon="isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'" 
            size="24"
          />
        </button>

        <!-- 上一页 -->
        <button
          class="control-btn prev-btn"
          :disabled="!hasPreviousSlide"
          @click="goToPreviousSlide"
          title="上一页"
        >
          <sdkwork-icon icon="material-symbols:skip-previous-rounded" size="24" />
        </button>

        <!-- 下一页 -->
        <button
          class="control-btn next-btn"
          :disabled="!hasNextSlide"
          @click="goToNextSlide"
          title="下一页"
        >
          <sdkwork-icon icon="material-symbols:skip-next-rounded" size="24" />
        </button>

        <!-- 时间显示 -->
        <div class="time-display">
          {{ formatTime(currentMediaTime) }} / {{ formatTime(totalDuration) }}
        </div>
      </div>

      <div class="control-right">
        <!-- 音频开关 -->
        <button
          v-if="slides?.audio"
          class="control-btn audio-toggle"
          :class="{ active: showAudio }"
          @click="showAudio = !showAudio"
          :title="showAudio ? '关闭音频' : '开启音频'"
        >
          <sdkwork-icon 
            :icon="showAudio ? 'material-symbols:volume-up-rounded' : 'material-symbols:volume-off-rounded'" 
            size="20"
          />
        </button>

        <!-- 视频开关 -->
        <button
          v-if="slides?.video"
          class="control-btn video-toggle"
          :class="{ active: showVideo }"
          @click="showVideo = !showVideo"
          :title="showVideo ? '关闭视频' : '开启视频'"
        >
          <sdkwork-icon 
            :icon="showVideo ? 'material-symbols:videocam-rounded' : 'material-symbols:videocam-off-rounded'" 
            size="20"
          />
        </button>

        <!-- 字幕开关 -->
        <button
          class="control-btn subtitles-toggle"
          :class="{ active: showSubtitles }"
          @click="showSubtitles = !showSubtitles"
          :title="showSubtitles ? '关闭字幕' : '开启字幕'"
        >
          <sdkwork-icon 
            :icon="showSubtitles ? 'material-symbols:subtitles-rounded' : 'material-symbols:subtitles-off-rounded'" 
            size="20"
          />
        </button>

        <!-- 全屏按钮 -->
        <button
          class="control-btn fullscreen-btn"
          @click="toggleFullscreen"
          title="全屏"
        >
          <sdkwork-icon icon="material-symbols:fullscreen-rounded" size="20" />
        </button>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-container" v-if="showProgress">
      <div class="progress-bar" @click="handleProgressClick">
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

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <sdkwork-icon icon="material-symbols:progress-activity-rounded" size="32" />
        <span>加载中...</span>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-overlay">
      <div class="error-content">
        <sdkwork-icon icon="material-symbols:error-outline-rounded" size="48" />
        <p>{{ error }}</p>
        <button class="retry-btn" @click="handleRetry">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useSlidesStore } from '@/stores/modules/slides'
import { Slides, SlideItem, SlidesHandlerMode } from '@/core/slides/types'
import type { SwipeInstance } from 'vant'
import { SubtitleFormat, Subtitles } from '@/core/subtitles'

// 组件导入
import SdkworkSwiper from '@/components/sdkwork-swiper/sdkwork-swiper.vue'
import SdkworkSwiperItem from '@/components/sdkwork-swiper-item/sdkwork-swiper-item.vue'
import SdkworkAudioPlayer from '@/components/sdkwork-audio-player/sdkwork-audio-player.vue'
import SdkworkVideoPlayer from '@/components/sdkwork-video-player/sdkwork-video-player.vue'
import SdkworkSubtitles from '@/components/sdkwork-subtitles/sdkwork-subtitles.vue'
import SdkworkIcon from '@/components/sdkwork-icon/sdkwork-icon.vue'
import { SlidesPlaybackState } from '@/stores/modules/slides/types'

// Props定义
interface Props {
  // 幻灯片数据
  slides?: Slides | null
  
  // 播放控制
  autoplay?: boolean
  loop?: boolean
  
  // 显示控制
  showControls?: boolean
  showProgress?: boolean
  showIndicators?: boolean
  showAudioControls?: boolean
  showVideoControls?: boolean
  
  // 功能开关
  enableAudio?: boolean
  enableVideo?: boolean
  enableSubtitles?: boolean
  
  // 交互控制
  touchable?: boolean
  
  // 模式配置
  mode?: 'normal' | 'presentation' | 'preview'
  slidesMode?: SlidesHandlerMode
  
  // 自定义类名
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  slides: null,
  autoplay: false,
  loop: false,
  showControls: true,
  showProgress: true,
  showIndicators: true,
  showAudioControls: true,
  showVideoControls: true,
  enableAudio: true,
  enableVideo: true,
  enableSubtitles: true,
  touchable: true,
  mode: 'normal',
  slidesMode: SlidesHandlerMode.PLAYER,
  customClass: ''
})

// Emits定义
const emit = defineEmits<{
  'slide-change': [slide: SlideItem, index: number]
  'play': []
  'pause': []
  'ended': []
  'timeupdate': [time: number]
  'error': [error: string]
  'loaded': []
}>()

// Store引用
const slidesStore = useSlidesStore()

// 组件引用
const swiperRef = ref<InstanceType<typeof SdkworkSwiper> | null>(null)
const audioPlayerRef = ref<InstanceType<typeof SdkworkAudioPlayer> | null>(null)
const videoPlayerRef = ref<InstanceType<typeof SdkworkVideoPlayer> | null>(null)
const subtitlesRef = ref<InstanceType<typeof SdkworkSubtitles> | null>(null)

// 响应式状态
const currentSlideIndex = ref(0)
const currentMediaTime = ref(0)
const totalDuration = ref(0)
const isPlaying = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)
const showAudio = ref(props.enableAudio)
const showVideo = ref(props.enableVideo)
const showSubtitles = ref(props.enableSubtitles)
const isFullscreen = ref(false)

// 计算属性
const totalSlides = computed(() => props.slides?.items?.length || 0)
const currentSlide = computed(() => props.slides?.items?.[currentSlideIndex.value] || null)
const hasPreviousSlide = computed(() => currentSlideIndex.value > 0)
const hasNextSlide = computed(() => currentSlideIndex.value < totalSlides.value - 1)
const progressPercentage = computed(() => {
  return totalDuration.value > 0 ? (currentMediaTime.value / totalDuration.value) * 100 : 0
})
const hasMedia = computed(() => {
  return !!(props.slides?.audio || props.slides?.video)
})
const swiperClass = computed(() => {
  return ['slides-swiper', props.customClass]
})

// 自动播放间隔计算
const autoplayInterval = computed(() => {
  // 如果 autoplay 为 false，返回 0 禁用自动播放
  if (!props.autoplay) return 0
  
  // 如果有音频/视频，使用媒体播放器控制切换，swiper 不自动切换
  if (hasMedia.value) return 0
  
  // 默认每页5秒自动切换
  return 5000
})

// 字幕数据（根据幻灯片数据生成）
const subtitlesData = computed<Subtitles | undefined>(() => {
  if (!props.slides?.items) return undefined
  
  return {
    entries: props.slides.items.map((slide, index) => ({
      sequence: index + 1,
      startTime: slide.startTime || index * 5000, // 默认每页5秒
      endTime: slide.endTime || (index + 1) * 5000,
      text: slide.content || slide.title
    })),
    format: SubtitleFormat.LRC,
    language: 'zh-CN',
    duration: props.slides.totalDuration ? props.slides.totalDuration / 1000 : undefined
  }
})

// 监听幻灯片数据变化
watch(() => props.slides, (newSlides) => {
  if (newSlides) {
    handleSlidesLoaded(newSlides)
  }
}, { immediate: true })

// 监听播放状态同步（避免循环依赖）
watch(() => slidesStore.isPlaying, (playing) => {
  if (playing !== isPlaying.value) {
    isPlaying.value = playing
    if (playing) {
      playMedia()
    } else {
      pauseMedia()
    }
  }
})

// 监听当前幻灯片索引同步（避免循环依赖）
watch(() => slidesStore.currentSlideIndex, (index) => {
  if (index !== undefined && index !== currentSlideIndex.value && index >= 0 && index < totalSlides.value) {
    goToSlide(index)
  }
})

// 监听当前时间同步（避免循环依赖）
watch(() => slidesStore.currentTime, (time) => {
  if (time !== undefined && Math.abs(time - currentMediaTime.value) > 100) { // 避免频繁更新
    currentMediaTime.value = time
    syncMediaTime(time)
  }
})

// 方法定义
const handleSlidesLoaded = (slides: Slides) => {
  isLoading.value = false
  error.value = null
  
  // 计算总时长
  totalDuration.value = slides.totalDuration || 
    slides.items.reduce((total, slide) => total + (slide.duration || 5000), 0)
  
  // 初始化到第一页
  if (slides.items.length > 0) {
    goToSlide(0)
  }
  
  emit('loaded')
}

const handleSlideChange = (index: number) => {
  // 避免重复触发
  if (currentSlideIndex.value === index) return
  
  currentSlideIndex.value = index
  const slide = props.slides?.items?.[index]
  
  if (slide) {
    // 同步到store（避免循环依赖）
    if (slidesStore.currentSlideIndex !== index) {
      slidesStore.currentSlideIndex = index
      slidesStore.currentSlide = slide
    }
    
    // 同步媒体时间到对应幻灯片的开始时间
    const slideStartTime = slide.startTime || 0
    if (currentMediaTime.value < slideStartTime || currentMediaTime.value > (slide.endTime || slideStartTime + 5000)) {
      syncMediaTime(slideStartTime)
    }
    
    emit('slide-change', slide, index)
  }
}

const goToSlide = (index: number) => {
  if (index >= 0 && index < totalSlides.value) {
    currentSlideIndex.value = index
    
    // 使用swiper的API切换页面
    if (swiperRef.value) {
      // 直接调用sdkwork-swiper组件暴露的swipeTo方法
      swiperRef.value.swipeTo(index)
    }
    
    handleSlideChange(index)
  }
}

const goToPreviousSlide = () => {
  if (hasPreviousSlide.value) {
    goToSlide(currentSlideIndex.value - 1)
  }
}

const goToNextSlide = () => {
  if (hasNextSlide.value) {
    goToSlide(currentSlideIndex.value + 1)
  }
}

const togglePlay = () => {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

const play = () => {
  if (!isPlaying.value) {
    isPlaying.value = true 
    slidesStore.playbackState= SlidesPlaybackState.PLAYING
    playMedia()
    emit('play')
  }
}

const pause = () => {
  if (isPlaying.value) {
    isPlaying.value = false 
    slidesStore.playbackState= SlidesPlaybackState.PAUSED
    pauseMedia()
    emit('pause')
  }
}

const stop = () => {
  isPlaying.value = false 
  slidesStore.playbackState= SlidesPlaybackState.STOPPED
  currentMediaTime.value = 0
  goToSlide(0)
  pauseMedia()
  slidesStore.stop()
}

const playMedia = () => {
  if (audioPlayerRef.value && showAudio.value) {
    audioPlayerRef.value.play()
  }
  if (videoPlayerRef.value && showVideo.value) {
    videoPlayerRef.value.play()
  }
}

const pauseMedia = () => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.pause()
  }
  if (videoPlayerRef.value) {
    videoPlayerRef.value.pause()
  }
}

const syncMediaTime = (time: number) => {
  currentMediaTime.value = time
  
  if (audioPlayerRef.value) {
    audioPlayerRef.value.seek(time / 1000) // 转换为秒
  }
  if (videoPlayerRef.value) {
    videoPlayerRef.value.currentTime = time / 1000 // 转换为秒
  }
  
  // 同步到store
  slidesStore.currentTime = time
  emit('timeupdate', time)
}

// 音频事件处理
const handleAudioTimeUpdate = (time: number) => {
  const newTime = time * 1000 // 转换为毫秒
  if (Math.abs(newTime - currentMediaTime.value) > 100) { // 避免频繁更新
    currentMediaTime.value = newTime
    slidesStore.currentTime = newTime
    emit('timeupdate', newTime)
    
    // 根据时间自动切换幻灯片
    autoSwitchSlideByTime(newTime)
  }
}

const handleAudioPlay = () => {
  if (!isPlaying.value) {
    isPlaying.value = true 
    slidesStore.playbackState = SlidesPlaybackState.PLAYING
  }
}

const handleAudioPause = () => {
  if (isPlaying.value) {
    isPlaying.value = false 
    slidesStore.playbackState = SlidesPlaybackState.PAUSED
  }
}

const handleAudioEnded = () => {
  if (hasNextSlide.value) {
    goToNextSlide()
  } else {
    isPlaying.value = false 
    slidesStore.playbackState = SlidesPlaybackState.COMPLETED
    emit('ended')
  }
}

// 视频事件处理
const handleVideoTimeUpdate = (time: number) => {
  const newTime = time * 1000 // 转换为毫秒
  if (Math.abs(newTime - currentMediaTime.value) > 100) { // 避免频繁更新
    currentMediaTime.value = newTime
    slidesStore.currentTime = newTime
    emit('timeupdate', newTime)
    
    // 根据时间自动切换幻灯片
    autoSwitchSlideByTime(newTime)
  }
}

const handleVideoPlay = () => {
  if (!isPlaying.value) {
    isPlaying.value = true 
    slidesStore.playbackState = SlidesPlaybackState.PLAYING
  }
}

const handleVideoPause = () => {
  if (isPlaying.value) {
    isPlaying.value = false 
    slidesStore.playbackState = SlidesPlaybackState.PAUSED
  }
}

const handleVideoEnded = () => {
  if (hasNextSlide.value) {
    goToNextSlide()
  } else {
    isPlaying.value = false 
    slidesStore.playbackState = SlidesPlaybackState.COMPLETED
    emit('ended')
  }
}

// 字幕事件处理
const handleSubtitleEntryChange = (entry: any, time: number) => {
  // 处理字幕条目变更事件
  console.log('Subtitle entry changed:', entry, 'at time:', time)
  
  // 可以在这里处理字幕切换逻辑，比如高亮当前幻灯片的关键词等
  if (entry && entry.text) {
    // 根据字幕内容进行相关处理
  }
}

const handleSubtitleLoadComplete = (time: number) => {
  // 字幕加载完成
  console.log('Subtitles loaded successfully at time:', time)
}

const handleSubtitleLoadError = (error: string, time: number) => {
  // 字幕加载错误
  console.error('Subtitles load error:', error, 'at time:', time)
}

// 根据时间自动切换幻灯片
const autoSwitchSlideByTime = (time: number) => {
  if (!props.slides?.items || !isPlaying.value) return
  
  const items = props.slides.items
  let targetSlideIndex = -1
  
  // 找到当前时间对应的幻灯片
  for (let i = 0; i < items.length; i++) {
    const slide = items[i]
    const slideStartTime = slide.startTime || i * 5000
    const slideEndTime = slide.endTime || slideStartTime + (slide.duration || 5000)
    
    if (time >= slideStartTime && time < slideEndTime) {
      targetSlideIndex = i
      break
    }
  }
  
  // 如果找到目标幻灯片且与当前不同，则切换
  if (targetSlideIndex >= 0 && targetSlideIndex !== currentSlideIndex.value) {
    // 避免在切换过程中触发时间更新循环
    const originalTime = currentMediaTime.value
    goToSlide(targetSlideIndex)
    // 恢复原始时间，避免循环依赖
    currentMediaTime.value = originalTime
  }
}

// 进度条点击处理
const handleProgressClick = (event: MouseEvent) => {
  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const clickPosition = event.clientX - rect.left
  const percentage = clickPosition / rect.width
  const newTime = percentage * totalDuration.value
  
  syncMediaTime(newTime)
}

// 图片加载处理
const handleImageLoad = () => {
  console.log('Slide image loaded')
}

const handleImageError = () => {
  console.error('Slide image load error')
}

// 全屏处理
const toggleFullscreen = () => {
  const element = document.querySelector('.sdkwork-player-slides') as HTMLElement
  
  if (!document.fullscreenElement) {
    element.requestFullscreen?.()
    isFullscreen.value = true
  } else {
    document.exitFullscreen?.()
    isFullscreen.value = false
  }
}

// 错误处理
const handleRetry = () => {
  error.value = null
  if (props.slides) {
    handleSlidesLoaded(props.slides)
  }
}

// 时间格式化
const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 生命周期
onMounted(() => {
  // 初始化store状态
  if (props.slides) {
    slidesStore.slides = props.slides
    slidesStore.totalDuration = totalDuration.value
  }
})

onUnmounted(() => {
  // 清理资源
  pauseMedia()
})

// 暴露给模板的方法
defineExpose({
  // 播放控制方法
  play,
  pause,
  stop,
  goToSlide,
  goToPreviousSlide,
  goToNextSlide,
  toggleFullscreen,
  
  // 状态属性
  currentSlideIndex,
  isPlaying,
  currentMediaTime,
  totalDuration,
  currentSlide
})
</script>

<style scoped lang="scss">
.sdkwork-player-slides {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  
  &.has-video,
  &.has-subtitles {
    .slides-container {
      height: 70%;
    }
    
    .media-container {
      height: 30%;
    }
  }
  
  // 模式样式
  &.mode-presentation {
    .control-bar {
      opacity: 0;
      transition: opacity 0.3s;
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
  &.mode-preview {
    .control-bar {
      display: none;
    }
    
    .progress-container {
      display: none;
    }
  }
}

.slides-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  
  .slides-swiper {
    width: 100%;
    height: 100%;
  }
  
  .slide-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    
    &.active {
      // 激活状态样式
    }
    
    .slide-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      text-align: center;
      
      .slide-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      
      .slide-html {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      
      .slide-text {
        padding: 2rem;
        
        .slide-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .slide-body {
          font-size: 1.2rem;
          line-height: 1.6;
          color: #666;
        }
      }
      
      .slide-number {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-size: 0.8rem;
        color: #999;
        background: rgba(255, 255, 255, 0.8);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
      }
    }
  }
}

.media-container {
  position: relative;
  background: #1a1a1a;
  
  .audio-player,
  .video-player,
  .subtitles {
    width: 100%;
    height: 100%;
    
    &.hidden {
      display: none;
    }
  }
  
  .video-player {
    :deep(.sdkwork-video-player) {
      height: 100%;
    }
  }
  
  .subtitles {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.2rem;
    padding: 1rem;
    text-align: center;
  }
}

.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  
  .control-left,
  .control-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .control-btn {
    background: none;
    border: none;
    color: #fff;
    padding: 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.active {
      color: #1989fa;
    }
    
    &.playing {
      color: #1989fa;
    }
  }
  
  .time-display {
    font-size: 0.9rem;
    margin-left: 1rem;
    opacity: 0.8;
  }
}

.progress-container {
  padding: 0 1rem 1rem;
  
  .progress-bar {
    position: relative;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    cursor: pointer;
    
    .progress-fill {
      height: 100%;
      background: #1989fa;
      border-radius: 2px;
      transition: width 0.1s;
    }
    
    .progress-thumb {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 12px;
      height: 12px;
      background: #1989fa;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    &:hover {
      .progress-thumb {
        opacity: 1;
      }
    }
  }
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #fff;
    
    :deep(svg) {
      animation: spin 1s linear infinite;
    }
  }
  
  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #fff;
    text-align: center;
    
    .retry-btn {
      background: #1989fa;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      
      &:hover {
        background: #1677ff;
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-player-slides {
    &.has-video,
    &.has-subtitles {
      .slides-container {
        height: 60%;
      }
      
      .media-container {
        height: 40%;
      }
    }
    
    .control-bar {
      padding: 0.5rem;
      
      .control-btn {
        padding: 0.25rem;
      }
      
      .time-display {
        font-size: 0.8rem;
        margin-left: 0.5rem;
      }
    }
    
    .slide-item {
      .slide-content {
        .slide-text {
          padding: 1rem;
          
          .slide-title {
            font-size: 1.5rem;
          }
          
          .slide-body {
            font-size: 1rem;
          }
        }
      }
    }
  }
}
</style>