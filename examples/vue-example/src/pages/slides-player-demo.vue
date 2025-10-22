<template>
  <sdkwork-page-container class="slides-player-demo">
    <div class="demo-header">
      <h1>智能幻灯片播放器演示</h1>
      <p>展示 sdkwork-player-slides 组件的完整功能</p>
    </div>

    <div class="demo-content">
      <!-- 配置面板 -->
      <div class="config-panel">
        <h3>配置选项</h3>
        
        <div class="config-group">
          <label>
            <input type="checkbox" v-model="config.autoplay" />
            自动播放
          </label>
          
          <label>
            <input type="checkbox" v-model="config.showControls" />
            显示控制栏
          </label>
          
          <label>
            <input type="checkbox" v-model="config.showProgress" />
            显示进度条
          </label>
          
          <label>
            <input type="checkbox" v-model="config.showIndicators" />
            显示指示器
          </label>
        </div>

        <div class="config-group">
          <label>
            <input type="checkbox" v-model="config.enableAudio" />
            启用音频
          </label>
          
          <label>
            <input type="checkbox" v-model="config.enableVideo" />
            启用视频
          </label>
          
          <label>
            <input type="checkbox" v-model="config.enableSubtitles" />
            启用字幕
          </label>
        </div>

        <div class="config-group">
          <label>
            播放模式：
            <select v-model="config.mode">
              <option value="normal">普通模式</option>
              <option value="presentation">演示模式</option>
              <option value="preview">预览模式</option>
            </select>
          </label>
          
          <label>
            幻灯片模式：
            <select v-model="config.slidesMode">
              <option value="player">播放器模式</option>
              <option value="realtime">实时模式</option>
            </select>
          </label>
        </div>

        <div class="config-group">
          <button @click="loadSampleSlides('basic')" class="sample-btn">基础示例</button>
          <button @click="loadSampleSlides('audio')" class="sample-btn">音频示例</button>
          <button @click="loadSampleSlides('video')" class="sample-btn">视频示例</button>
          <button @click="loadSampleSlides('full')" class="sample-btn">完整示例</button>
        </div>
      </div>

      <!-- 播放器区域 -->
      <div class="player-container">
        <sdkwork-player-slides
          ref="slidesPlayer"
          :slides="currentSlides"
          :autoplay="config.autoplay"
          :show-controls="config.showControls"
          :show-progress="config.showProgress"
          :show-indicators="config.showIndicators"
          :enable-audio="config.enableAudio"
          :enable-video="config.enableVideo"
          :enable-subtitles="config.enableSubtitles"
          :mode="config.mode"
          :slides-mode="config.slidesMode"
          custom-class="demo-slides-player"
        />
      </div>

      <!-- 状态信息 -->
      <div class="status-panel">
        <h3>状态信息</h3>
        
        <div class="status-grid">
          <div class="status-item">
            <span class="label">播放状态：</span>
            <span class="value" :class="{ playing: isPlaying }">{{ playStatusText }}</span>
          </div>
          
          <div class="status-item">
            <span class="label">当前页面：</span>
            <span class="value">{{ currentSlideIndex + 1 }} / {{ totalSlides }}</span>
          </div>
          
          <div class="status-item">
            <span class="label">播放时间：</span>
            <span class="value">{{ formatTime(currentTime) }} / {{ formatTime(totalDuration) }}</span>
          </div>
          
          <div class="status-item">
            <span class="label">进度：</span>
            <span class="value">{{ progressPercentage.toFixed(1) }}%</span>
          </div>
        </div>

        <div class="current-slide-info">
          <h4>当前幻灯片信息</h4>
          <div v-if="currentSlide" class="slide-details">
            <p><strong>标题：</strong>{{ currentSlide.title }}</p>
            <p><strong>内容：</strong>{{ currentSlide.content }}</p>
            <p><strong>开始时间：</strong>{{ formatTime(currentSlide.startTime || 0) }}</p>
            <p><strong>结束时间：</strong>{{ formatTime(currentSlide.endTime || 0) }}</p>
          </div>
          <div v-else class="no-slide">
            暂无幻灯片信息
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-panel">
        <button @click="play" :disabled="isPlaying" class="control-btn">播放</button>
        <button @click="pause" :disabled="!isPlaying" class="control-btn">暂停</button>
        <button @click="stop" class="control-btn">停止</button>
        <button @click="goToPrevious" :disabled="!hasPrevious" class="control-btn">上一页</button>
        <button @click="goToNext" :disabled="!hasNext" class="control-btn">下一页</button>
        <button @click="toggleFullscreen" class="control-btn">全屏</button>
        <button @click="goToSlide(0)" class="control-btn">回到首页</button>
      </div>
    </div>

    <!-- 事件日志 -->
    <div class="events-panel">
      <h3>事件日志</h3>
      <div class="events-list">
        <div 
          v-for="(event, index) in events" 
          :key="index" 
          class="event-item"
          :class="event.type"
        >
          <span class="event-time">{{ formatEventTime(event.timestamp) }}</span>
          <span class="event-type">{{ event.type }}</span>
          <span class="event-data">{{ event.data }}</span>
        </div>
      </div>
      <button @click="clearEvents" class="clear-btn">清空日志</button>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { type Slides, type SlideItem, SlidesHandlerMode } from '@/core/slides/types'
import SdkworkPlayerSlides from '@/components/sdkwork-player-slides/sdkwork-player-slides.vue'

// 组件引用
const slidesPlayer = ref<InstanceType<typeof SdkworkPlayerSlides>>()

// 配置状态
const config = ref({
  autoplay: false,
  showControls: true,
  showProgress: true,
  showIndicators: true,
  enableAudio: true,
  enableVideo: true,
  enableSubtitles: true,
  mode: 'normal' as 'normal' | 'presentation' | 'preview',
  slidesMode: SlidesHandlerMode.PLAYER
})

// 播放器状态
const currentSlides = ref<Slides | null>(null)
const isPlaying = ref(false)
const currentSlideIndex = ref(0)
const currentTime = ref(0)
const totalDuration = ref(0)
const currentSlide = ref<SlideItem | null>(null)

// 事件日志
const events = ref<Array<{
  type: string
  timestamp: number
  data: any
}>>([])

// 计算属性
const totalSlides = computed(() => currentSlides.value?.items?.length || 0)
const progressPercentage = computed(() => {
  return totalDuration.value > 0 ? (currentTime.value / totalDuration.value) * 100 : 0
})
const hasPrevious = computed(() => currentSlideIndex.value > 0)
const hasNext = computed(() => currentSlideIndex.value < totalSlides.value - 1)
const playStatusText = computed(() => isPlaying.value ? '播放中' : '已暂停')

// 监听组件内部状态变化
watch(() => slidesPlayer.value?.currentSlideIndex, (newIndex) => {
  if (newIndex !== undefined && newIndex !== currentSlideIndex.value) {
    currentSlideIndex.value = newIndex
    // 更新当前幻灯片信息
    if (currentSlides.value?.items && newIndex >= 0 && newIndex < currentSlides.value.items.length) {
      currentSlide.value = currentSlides.value.items[newIndex]
    }
  }
})

watch(() => slidesPlayer.value?.isPlaying, (newIsPlaying) => {
  if (newIsPlaying !== undefined) {
    isPlaying.value = newIsPlaying
  }
})

watch(() => slidesPlayer.value?.currentMediaTime, (newTime) => {
  if (newTime !== undefined) {
    currentTime.value = newTime
  }
})

watch(() => slidesPlayer.value?.totalDuration, (newDuration) => {
  if (newDuration !== undefined) {
    totalDuration.value = newDuration
  }
})

// 示例幻灯片数据
const sampleSlides = {
  basic: {
    title: '基础演示文稿',
    items: [
      {
        sequence: 1,
        title: '欢迎使用智能幻灯片播放器',
        content: '这是一个功能强大的幻灯片播放组件，支持多媒体同步播放。',
        startTime: 0,
        endTime: 5000,
        duration: 5000
      },
      {
        sequence: 2,
        title: '丰富的功能特性',
        content: '支持音频、视频、字幕同步，响应式设计，多种播放模式。',
        startTime: 5000,
        endTime: 10000,
        duration: 5000
      },
      {
        sequence: 3,
        title: '易于集成和使用',
        content: '提供完整的API文档和示例代码，快速上手。',
        startTime: 10000,
        endTime: 15000,
        duration: 5000
      }
    ],
    totalDuration: 15000
  },
  
  audio: {
    title: '音频演示文稿',
    audio: {
      url: 'https://example.com/audio/presentation.mp3'
    },
    items: [
      {
        sequence: 1,
        title: '音频同步演示',
        content: '幻灯片与音频播放时间精准同步。',
        startTime: 0,
        endTime: 8000,
        duration: 8000
      },
      {
        sequence: 2,
        title: '智能切换',
        content: '根据音频播放进度自动切换幻灯片。',
        startTime: 8000,
        endTime: 16000,
        duration: 8000
      }
    ],
    totalDuration: 16000
  },
  
  video: {
    title: '视频演示文稿',
    video: {
      url: 'https://example.com/video/presentation.mp4'
    },
    items: [
      {
        sequence: 1,
        title: '视频同步演示',
        content: '幻灯片与视频播放时间精准同步。',
        startTime: 0,
        endTime: 10000,
        duration: 10000
      },
      {
        sequence: 2,
        title: '多媒体集成',
        content: '支持视频播放与幻灯片切换的完美结合。',
        startTime: 10000,
        endTime: 20000,
        duration: 10000
      }
    ],
    totalDuration: 20000
  },
  
  full: {
    title: '完整功能演示',
    audio: {
      url: 'https://example.com/audio/full-presentation.mp3'
    },
    video: {
      url: 'https://example.com/video/full-presentation.mp4'
    },
    items: [
      {
        sequence: 1,
        title: '完整功能展示',
        content: '展示所有功能的完整演示文稿。',
        startTime: 0,
        endTime: 6000,
        duration: 6000,
        image: {
          url: 'https://example.com/images/slide1.jpg'
        }
      },
      {
        sequence: 2,
        title: '高级特性',
        content: '包括字幕同步、多种播放模式等高级功能。',
        startTime: 6000,
        endTime: 12000,
        duration: 6000,
        html: '<div style="padding: 2rem; text-align: center;"><h2>自定义HTML内容</h2><p>支持丰富的HTML内容展示</p></div>'
      },
      {
        sequence: 3,
        title: '响应式设计',
        content: '完美适配各种屏幕尺寸和设备。',
        startTime: 12000,
        endTime: 18000,
        duration: 6000
      }
    ],
    totalDuration: 18000
  }
}

// 方法定义
const loadSampleSlides = (type: keyof typeof sampleSlides) => {
  currentSlides.value = sampleSlides[type] as Slides
  addEvent('slides_loaded', `加载 ${type} 示例幻灯片`)
}

const play = () => {
  if (slidesPlayer.value) {
    slidesPlayer.value.play()
    isPlaying.value = true
    addEvent('play', '开始播放')
  }
}

const pause = () => {
  if (slidesPlayer.value) {
    slidesPlayer.value.pause()
    isPlaying.value = false
    addEvent('pause', '暂停播放')
  }
}

const stop = () => {
  if (slidesPlayer.value) {
    slidesPlayer.value.stop()
    isPlaying.value = false
    addEvent('stop', '停止播放')
  }
}

const goToPrevious = () => {
  if (slidesPlayer.value) {
    slidesPlayer.value.goToPreviousSlide()
    addEvent('slide_change', '切换到上一页')
  }
}

const goToNext = () => {
  if (slidesPlayer.value) {
    slidesPlayer.value.goToNextSlide()
    addEvent('slide_change', '切换到下一页')
  }
}

const goToSlide = (index: number) => {
  if (slidesPlayer.value) {
    slidesPlayer.value.goToSlide(index)
    addEvent('slide_change', `切换到第${index + 1}页`)
  }
}

const toggleFullscreen = () => {
  if (slidesPlayer.value) {
    slidesPlayer.value.toggleFullscreen()
    addEvent('fullscreen', '切换全屏模式')
  }
}

// 工具方法
const addEvent = (type: string, data: any) => {
  events.value.unshift({
    type,
    timestamp: Date.now(),
    data
  })
  
  // 保持最多50条事件记录
  if (events.value.length > 50) {
    events.value = events.value.slice(0, 50)
  }
}

const clearEvents = () => {
  events.value = []
}

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const formatEventTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// 生命周期
onMounted(() => {
  // 默认加载基础示例
  loadSampleSlides('basic')
  addEvent('mounted', '演示页面加载完成')
})
</script>

<style scoped lang="scss">
.slides-player-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #f5f5f5;
  min-height: 100dvh;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.demo-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.config-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  .config-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.75rem;
      cursor: pointer;
      
      input[type="checkbox"] {
        margin-right: 0.5rem;
      }
      
      select {
        margin-left: 0.5rem;
        padding: 0.25rem 0.5rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
      }
    }
  }
  
  .sample-btn {
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background: #e0e0e0;
    }
  }
}

.player-container {
  grid-column: 2;
  min-height: 500px;
  
  .demo-slides-player {
    height: 100%;
    min-height: 500px;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.status-panel {
  grid-column: 1 / -1;
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
  
  h3 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .status-item {
    display: flex;
    justify-content: space-between;
    
    .label {
      font-weight: 600;
      color: #666;
    }
    
    .value {
      color: #333;
      
      &.playing {
        color: #1989fa;
        font-weight: 600;
      }
    }
  }
  
  .current-slide-info {
    border-top: 1px solid #eee;
    padding-top: 1rem;
    
    h4 {
      margin-bottom: 0.75rem;
      color: #333;
    }
    
    .slide-details {
      p {
        margin-bottom: 0.5rem;
        
        strong {
          color: #666;
        }
      }
    }
    
    .no-slide {
      color: #999;
      font-style: italic;
    }
  }
}

.control-panel {
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .control-btn {
    padding: 0.5rem 1rem;
    background: #1989fa;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover:not(:disabled) {
      background: #1677ff;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}

.events-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  .events-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 1rem;
    border: 1px solid #eee;
    border-radius: 0.25rem;
  }
  
  .event-item {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #f0f0f0;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.slide_change {
      background: #f0f9ff;
    }
    
    &.play {
      background: #f0fff0;
    }
    
    &.pause {
      background: #fffaf0;
    }
    
    &.error {
      background: #fff0f0;
      color: #d63031;
    }
    
    .event-time {
      color: #666;
      margin-right: 1rem;
    }
    
    .event-type {
      font-weight: 600;
      margin-right: 1rem;
      text-transform: uppercase;
      font-size: 0.8rem;
    }
    
    .event-data {
      color: #333;
    }
  }
  
  .clear-btn {
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    cursor: pointer;
    
    &:hover {
      background: #e0e0e0;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .slides-player-demo {
    padding: 1rem;
  }
  
  .demo-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .player-container {
    grid-column: 1;
    
    .demo-slides-player {
      height: 300px;
    }
  }
  
  .control-panel {
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .control-btn {
      flex: 1;
      min-width: 80px;
    }
  }
}
</style>