<template>
  <div class="sdkwork-subtitles" :class="containerClasses">
    <!-- 字幕显示区域 -->
    <div class="subtitles-container" :class="displayModeClasses">
      <!-- 全屏模式 -->
      <sdkwork-popup 
        v-if="config.displayMode === 'fullscreen'"
        v-model:visible="isFullscreenVisible"
        :overlay="false"
        position="center"
        class="fullscreen-subtitles"
      >
        <fullscreen-display
          :current-entry="currentEntry"
          :config="config"
          :current-time="currentTime"
          :show-empty-state="showEmptyState"
          @click="handleFullscreenClick"
        />
      </sdkwork-popup>

      <!-- 卡片模式 -->
      <card-display
        v-else-if="config.displayMode === 'card'"
        :current-entry="currentEntry"
        :config="config"
        :current-time="currentTime"
        :show-empty-state="showEmptyState"
      />

      <!-- 行模式 -->
      <line-display
        v-else-if="config.displayMode === 'line'"
        :current-entry="currentEntry"
        :config="config"
        :current-time="currentTime"
        :show-empty-state="showEmptyState"
      />
    </div>

    <!-- 控制面板 -->
    <div v-if="showControls" class="subtitles-controls">
      <div class="control-group">
        <sdkwork-icon 
          icon="mdi:cog" 
          class="control-icon"
          @click="showSettings = true"
        />
        <sdkwork-icon 
          icon="mdi:format-list-bulleted" 
          class="control-icon"
          @click="showSubtitleList = true"
        />
        <sdkwork-icon 
          :icon="config.displayMode === 'fullscreen' ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
          class="control-icon"
          @click="toggleFullscreen"
        />
      </div>
    </div>

    <!-- 设置对话框 -->
    <settings-dialog 
      v-model:modelValue="showSettings"
      :config="config"
      @update-config="handleConfigUpdate"
    />

    <!-- 字幕列表对话框 -->
    <subtitle-list-dialog 
      v-model:modelValue="showSubtitleList"
      :subtitles="currentSubtitles"
      :current-time="currentTime"
      @seek-to="handleSeekTo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useSubtitleStore } from '@/stores/modules/subtitles'
import {
  SubtitleFormat,
  SubtitleEntry,
  Subtitles
} from '@/core/subtitles'

// 导入子组件
import FullscreenDisplay from './components/fullscreen-display.vue'
import CardDisplay from './components/card-display.vue'
import LineDisplay from './components/line-display.vue'
import SettingsDialog from './components/settings-dialog.vue'
import SubtitleListDialog from './components/subtitle-list-dialog.vue'
import { SubtitleDisplayMode, SubtitleEventType } from '@/stores/modules/subtitles/types'

// Props定义
interface Props {
  // 字幕内容输入方式
  content?: string
  url?: string
  subtitles?: Subtitles
  
  // 字幕格式
  format?: SubtitleFormat
  
  // 显示配置
  displayMode?: SubtitleDisplayMode
  lineCount?: number
  fontSize?: number
  fontColor?: string
  backgroundColor?: string
  showBackground?: boolean
  position?: 'top' | 'bottom' | 'center'
  autoScroll?: boolean
  scrollSpeed?: number
  
  // 播放控制
  currentTime?: number
  isPlaying?: boolean
  
  // 控制面板
  showControls?: boolean
  
  // 媒体时长
  duration?: number
  
  // 空状态显示
  showEmptyState?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  displayMode: SubtitleDisplayMode.CARD,
  lineCount: 3,
  fontSize: 16,
  fontColor: '#ffffff',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  showBackground: true,
  position: 'bottom',
  autoScroll: true,
  scrollSpeed: 1,
  showControls: true,
  isPlaying: false,
  showEmptyState: true
})

// Emits定义
const emit = defineEmits<{
  // 字幕相关事件
  'load-start': [currentTime: number]
  'load-complete': [currentTime: number]
  'load-error': [error: string, currentTime: number]
  'entry-change': [entry: SubtitleEntry | null, currentTime: number]
  'mode-change': [currentTime: number]
  'playback-state-change': [currentTime: number]
  'content-update': [currentTime: number]
  
  // 控制事件
  'fullscreen-change': [isFullscreen: boolean]
  'seek-to': [time: number]
}>()

// 使用字幕store
const subtitleStore = useSubtitleStore()

// 响应式数据
const isFullscreenVisible = ref(false)
const showSettings = ref(false)
const showSubtitleList = ref(false)

// 计算属性
const config = computed(() => ({
  displayMode: props.displayMode,
  lineCount: props.lineCount,
  fontSize: props.fontSize,
  fontColor: props.fontColor,
  backgroundColor: props.backgroundColor,
  showBackground: props.showBackground,
  position: props.position,
  autoScroll: props.autoScroll,
  scrollSpeed: props.scrollSpeed
}))

const containerClasses = computed(() => ({
  [`position-${props.position}`]: true,
  'has-controls': props.showControls
}))

const displayModeClasses = computed(() => ({
  [`mode-${config.value.displayMode}`]: true
}))

const currentEntry = computed(() => subtitleStore.currentEntry)
const currentSubtitles = computed(() => subtitleStore.currentSubtitles)
const currentTime = computed(() => subtitleStore.currentTime)


// 事件监听器
const setupEventListeners = () => {
  subtitleStore.on(SubtitleEventType.LOAD_START, (data) => {
    emit('load-start', data.currentTime || 0)
  })
  
  subtitleStore.on(SubtitleEventType.LOAD_COMPLETE, (data) => {
    emit('load-complete', data.currentTime || 0)
  })
  
  subtitleStore.on(SubtitleEventType.LOAD_ERROR, (data) => {
    emit('load-error', data.error || '未知错误', data.currentTime || 0)
  })
  
  subtitleStore.on(SubtitleEventType.ENTRY_CHANGE, (data) => {
    emit('entry-change', data.currentEntry || null, data.currentTime || 0)
  })
  
  subtitleStore.on(SubtitleEventType.MODE_CHANGE, (data) => {
    emit('mode-change', data.currentTime || 0)
  })
  
  subtitleStore.on(SubtitleEventType.PLAYBACK_STATE_CHANGE, (data) => {
    emit('playback-state-change', data.currentTime || 0)
  })
  
  subtitleStore.on(SubtitleEventType.CONTENT_UPDATE, (data) => {
    emit('content-update', data.currentTime || 0)
  })
}

// 字幕操作方法
const loadFromString = async (content?: string) => {
  if (!content) return
  
  try {
    await subtitleStore.loadFromString(content, {
      format: props.format,
      duration: props.duration
    })
  } catch (error) {
    console.error('字幕加载失败:', error)
  }
}

const loadFromUrl = async (url?: string) => {
  if (!url) return
  
  try {
    await subtitleStore.loadFromUrl(url, {
      format: props.format,
      duration: props.duration
    })
  } catch (error) {
    console.error('字幕加载失败:', error)
  }
}

const loadFromObject = (subtitles?: Subtitles) => {
  if (!subtitles) return
  subtitleStore.loadFromObject(subtitles)
}

const updatePlaybackTime = (time?: number) => {
  if (time !== undefined) {
    subtitleStore.updatePlaybackTime(time)
  }
}

const handlePlaybackStateChange = (isPlaying: boolean) => {
  if (isPlaying) {
    subtitleStore.startPlayback()
  } else {
    subtitleStore.pausePlayback()
  }
}

// 动态字幕操作
const addDynamicSubtitle = (text: string, startTime: number, endTime: number, isFinal = false) => {
  subtitleStore.addDynamicSubtitle({
    text,
    startTime,
    endTime,
    isFinal
  })
}

const addDynamicSubtitles = (entries: Array<{text: string, startTime: number, endTime: number}>) => {
  subtitleStore.addDynamicSubtitles(entries.map(entry => ({
    ...entry,
    isFinal: false
  })))
}

const clearDynamicSubtitles = () => {
  subtitleStore.clearDynamicSubtitles()
}

// 显示模式操作
const switchDisplayMode = (mode: SubtitleDisplayMode, options?: any) => {
  subtitleStore.switchDisplayMode(mode, options)
}

const toggleFullscreen = () => {
  const newMode = config.value.displayMode === 'fullscreen' ? SubtitleDisplayMode.CARD : SubtitleDisplayMode.FULLSCREEN
  switchDisplayMode(newMode)
  isFullscreenVisible.value = newMode === 'fullscreen'
  emit('fullscreen-change', newMode === 'fullscreen')
}

// 配置更新
const handleConfigUpdate = (newConfig: any) => {
  subtitleStore.updateConfig(newConfig)
}

// 跳转操作
const handleSeekTo = (time: number) => {
  subtitleStore.seekTo(time)
  emit('seek-to', time)
}

const handleFullscreenClick = () => {
  if (config.value.displayMode === 'fullscreen') {
    toggleFullscreen()
  }
}
// 监听属性变化
watch(() => props.content, loadFromString)
watch(() => props.url, loadFromUrl)
watch(() => props.subtitles, loadFromObject)
watch(() => props.currentTime, updatePlaybackTime)
watch(() => props.isPlaying, handlePlaybackStateChange)

// 组件方法暴露
defineExpose({
  // 字幕加载方法
  loadFromString,
  loadFromUrl,
  loadFromObject,
  clearSubtitles: subtitleStore.clearSubtitles,
  
  // 动态字幕方法
  addDynamicSubtitle,
  addDynamicSubtitles,
  clearDynamicSubtitles,
  
  // 播放控制方法
  startPlayback: subtitleStore.startPlayback,
  stopPlayback: subtitleStore.stopPlayback,
  pausePlayback: subtitleStore.pausePlayback,
  resumePlayback: subtitleStore.resumePlayback,
  seekTo: subtitleStore.seekTo,
  updatePlaybackTime: subtitleStore.updatePlaybackTime,
  
  // 显示模式方法
  switchDisplayMode,
  toggleFullscreen,
  
  // 配置方法
  updateConfig: subtitleStore.updateConfig,
  resetConfig: subtitleStore.resetConfig,
  
  // 工具方法
  getStats: subtitleStore.getStats,
  exportSubtitles: subtitleStore.exportSubtitles,
  
  // 事件方法
  on: subtitleStore.on,
  off: subtitleStore.off
})

// 生命周期
onMounted(() => {
  setupEventListeners()
  
  // 初始加载字幕
  if (props.content) {
    loadFromString(props.content)
  } else if (props.url) {
    loadFromUrl(props.url)
  } else if (props.subtitles) {
    loadFromObject(props.subtitles)
  }
})

onUnmounted(() => {
  subtitleStore.stopPlayback()
})
</script>

<style scoped>
.sdkwork-subtitles {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.subtitles-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 位置样式 */
.position-top {
  align-items: flex-start;
  justify-content: center;
}

.position-bottom {
  align-items: flex-end;
  justify-content: center;
}

.position-center {
  align-items: center;
  justify-content: center;
}

/* 控制面板样式 */
.subtitles-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.control-group {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  padding: 8px;
  backdrop-filter: blur(10px);
}

.control-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #ffffff;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.control-icon:hover {
  opacity: 1;
}

/* 全屏模式样式 */
.fullscreen-subtitles {
  width: 100vw;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .subtitles-controls {
    top: 5px;
    right: 5px;
  }
  
  .control-group {
    padding: 6px;
  }
  
  .control-icon {
    width: 20px;
    height: 20px;
  }
}
</style>