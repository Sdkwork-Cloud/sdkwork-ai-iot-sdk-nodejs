<template>
  <div 
    class="audio-record-item" 
    :class="{ 
      active: activeRecordId === record.id, 
      playing: currentPlayingRecordId === record.id && isPlaying 
    }"
    @click="handleItemClick"
  >
    <!-- 录音图标 -->
    <div class="record-icon">
      <sdkwork-icon icon="material-symbols:mic-rounded" width="20" height="20" />
    </div>
    
    <!-- 录音信息 -->
    <div class="record-info">
      <div class="record-name">{{ record.name || '未命名录音' }}</div>
      
      <!-- 播放进度条 -->
      <div v-if="currentPlayingRecordId === record.id && isPlaying" class="progress-container">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="duration">{{ formatTime(totalDuration) }}</span>
        </div>
      </div>
      
      <!-- 默认显示时长 -->
      <div v-else class="record-duration">{{ formatRecordDuration(record.duration) }}</div>
      
      <div v-if="showTime" class="record-time">{{ formatRecordTime(record.createdAt) }}</div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="record-actions">
      <!-- 播放/暂停按钮 -->
      <button 
        class="action-btn play-pause-btn" 
        @click.stop="handlePlayPause" 
        :title="currentPlayingRecordId === record.id && isPlaying ? '暂停' : '播放'"
      >
        <sdkwork-icon 
          :icon="currentPlayingRecordId === record.id && isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'" 
          width="16" 
          height="16" 
        />
        <!-- 播放特效 -->
        <div v-if="currentPlayingRecordId === record.id && isPlaying" class="play-animation">
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>
      </button>
      
      <!-- 停止按钮 -->
      <button 
        v-if="currentPlayingRecordId === record.id && isPlaying"
        class="action-btn stop-btn" 
        @click.stop="handleStop" 
        title="停止"
      >
        <sdkwork-icon icon="material-symbols:stop-rounded" width="16" height="16" />
      </button>
      
      <!-- 下载按钮 -->
      <button 
        v-if="showDownload" 
        class="action-btn" 
        @click.stop="handleDownload" 
        title="下载"
      >
        <sdkwork-icon icon="material-symbols:download-rounded" width="16" height="16" />
      </button>
      
      <!-- 删除按钮 -->
      <button 
        v-if="showDelete" 
        class="action-btn" 
        @click.stop="handleDelete" 
        title="删除"
      >
        <sdkwork-icon icon="material-symbols:delete-outline-rounded" width="16" height="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import type { AudioRecord } from '../../../stores/modules/recorder/types'
import { SdkworkAudioPlayer } from '../../../core/audio/player/sdkwork_audio_player'

interface Props {
  /** 录音记录 */
  record: AudioRecord
  /** 当前激活的记录ID */
  activeRecordId?: string
  /** 是否显示时间 */
  showTime?: boolean
  /** 是否显示下载按钮 */
  showDownload?: boolean
  /** 是否显示删除按钮 */
  showDelete?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

interface Emits {
  /** 记录点击事件 */
  (e: 'record-click', record: AudioRecord): void
  /** 记录播放事件 */
  (e: 'record-play', record: AudioRecord): void
  /** 记录暂停事件 */
  (e: 'record-pause', record: AudioRecord): void
  /** 记录停止事件 */
  (e: 'record-stop', record: AudioRecord): void
  /** 记录下载事件 */
  (e: 'record-download', record: AudioRecord): void
  /** 记录删除事件 */
  (e: 'record-delete', record: AudioRecord): void
}

const props = withDefaults(defineProps<Props>(), {
  showTime: false,
  showDownload: true,
  showDelete: true,
  themeMode: 'auto'
})

const emit = defineEmits<Emits>()

// 全局播放状态管理
const audioPlayer = ref<SdkworkAudioPlayer | null>(null)
const isPlaying = ref(false)
const currentPlayingRecordId = ref<string | null>(null)
const currentTime = ref(0)
const totalDuration = ref(0)
const progressPercentage = ref(0)

// 全局事件总线用于组件间通信
const audioPlayerBus = {
  listeners: new Set<Function>(),
  
  emit(event: string, data?: any) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data)
      } catch (error) {
        console.error('AudioPlayerBus listener error:', error)
      }
    })
  },
  
  on(listener: Function) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

// 主题检测
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'audio-record-item--dark' : 'audio-record-item--light'
})

// 初始化音频播放器
const initAudioPlayer = () => {
  if (!audioPlayer.value) {
    audioPlayer.value = new SdkworkAudioPlayer({
      events: {
        onPlay: () => {
          isPlaying.value = true
          startProgressTimer()
        },
        onPause: () => {
          isPlaying.value = false
          stopProgressTimer()
        },
        onEnd: () => {
          isPlaying.value = false
          currentPlayingRecordId.value = null
          stopProgressTimer()
          resetProgress()
        },
        onError: (error) => {
          console.error('播放错误:', error)
          isPlaying.value = false
          currentPlayingRecordId.value = null
          stopProgressTimer()
          resetProgress()
        },
        onTimeUpdate: (currentTimeValue: number, duration: number) => {
          currentTime.value = currentTimeValue
          totalDuration.value = duration
          updateProgress()
        }
      }
    })
  }
}

// 进度计时器
let progressInterval: number | null = null

// 开始进度计时
const startProgressTimer = () => {
  stopProgressTimer()
  progressInterval = window.setInterval(() => {
    if (audioPlayer.value && isPlaying.value) {
      const currentTimeValue = audioPlayer.value.getCurrentTime()
      const duration = audioPlayer.value.getDuration()
      currentTime.value = currentTimeValue
      totalDuration.value = duration
      updateProgress()
    }
  }, 100)
}

// 停止进度计时
const stopProgressTimer = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

// 更新进度
const updateProgress = () => {
  if (totalDuration.value > 0) {
    progressPercentage.value = (currentTime.value / totalDuration.value) * 100
  }
}

// 重置进度
const resetProgress = () => {
  currentTime.value = 0
  progressPercentage.value = 0
}

// 组件卸载时清理资源
onUnmounted(() => {
  stopProgressTimer()
  if (audioPlayer.value) {
    audioPlayer.value.stop()
    audioPlayer.value = null
  }
  unsubscribe()
})

// 格式化时间（秒转分:秒）
const formatTime = (seconds: number) => {
  if (!seconds || seconds <= 0) return '0:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化录音时长（duration单位为毫秒）
const formatRecordDuration = (duration: number) => {
  if (!duration || duration <= 0) return '0秒'
  
  // 将毫秒转换为秒
  const totalSeconds = Math.floor(duration / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  
  if (minutes > 0) {
    return `${minutes}分${remainingSeconds.toString().padStart(2, '0')}秒`
  } else {
    return `${totalSeconds}秒`
  }
}

// 格式化录音时间
const formatRecordTime = (timestamp?: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 今天
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  }
  
  // 一周内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}天前`
  }
  
  // 更早
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 处理项目点击
const handleItemClick = () => {
  emit('record-click', props.record)
}

// 处理播放/暂停
const handlePlayPause = async () => {
  try {
    // 初始化音频播放器
    initAudioPlayer()
    
    // 如果正在播放同一录音，则暂停
    if (currentPlayingRecordId.value === props.record.id && isPlaying.value) {
      await audioPlayer.value?.pause()
      emit('record-pause', props.record)
      return
    }
    
    // 通知其他组件停止播放
    audioPlayerBus.emit('stop-other-players', props.record.id)
    
    // 播放录音
    if (props.record.data) {
      let blob: Blob
      
      if (props.record.data instanceof ArrayBuffer) {
        // 将 ArrayBuffer 转换为 Blob
        blob = new Blob([props.record.data], { type: 'audio/pcm' })
      } else {
        // 已经是 Blob 类型
        blob = props.record.data
      }
      
      await audioPlayer.value?.playBlob(blob)
      
      currentPlayingRecordId.value = props.record.id
      isPlaying.value = true
      
      // 触发播放事件
      emit('record-play', props.record)
    }
  } catch (error) {
    console.error('播放录音失败:', error)
    isPlaying.value = false
    currentPlayingRecordId.value = null
    resetProgress()
  }
}

// 处理停止播放
const handleStop = async () => {
  try {
    if (audioPlayer.value) {
      await audioPlayer.value.stop()
      isPlaying.value = false
      currentPlayingRecordId.value = null
      resetProgress()
      emit('record-stop', props.record)
    }
  } catch (error) {
    console.error('停止播放失败:', error)
  }
}

// 停止其他播放器的处理函数
const stopOtherPlayers = (currentRecordId: string) => {
  if (isPlaying.value && currentPlayingRecordId.value !== currentRecordId) {
    handleStop()
  }
}

// 监听全局播放事件
const unsubscribe = audioPlayerBus.on((event: string, data: any) => {
  if (event === 'stop-other-players') {
    stopOtherPlayers(data)
  }
})

// 处理下载
const handleDownload = () => {
  emit('record-download', props.record)
}

// 处理删除
const handleDelete = () => {
  emit('record-delete', props.record)
}

// 监听播放状态变化
watch(isPlaying, (newValue) => {
  if (!newValue && currentPlayingRecordId.value === props.record.id) {
    stopProgressTimer()
  }
})

// 暴露方法
defineExpose({
  /** 停止播放 */
  stopPlayback: () => {
    if (audioPlayer.value) {
      audioPlayer.value.stop()
      isPlaying.value = false
      currentPlayingRecordId.value = null
      resetProgress()
    }
  },
  
  /** 暂停播放 */
  pausePlayback: () => {
    if (audioPlayer.value && isPlaying.value) {
      audioPlayer.value.pause()
      isPlaying.value = false
    }
  },
  
  /** 获取播放状态 */
  getPlaybackState: () => ({
    isPlaying: isPlaying.value,
    currentRecordId: currentPlayingRecordId.value,
    currentTime: currentTime.value,
    totalDuration: totalDuration.value,
    progressPercentage: progressPercentage.value
  })
})
</script>

<style scoped>
.audio-record-item {
  display: flex;
  align-items: center;
  padding: 12px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.audio-record-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.audio-record-item.active {
  background: rgba(64, 158, 255, 0.2);
  border: 1px solid rgba(64, 158, 255, 0.5);
}

.audio-record-item.playing {
  background: rgba(103, 194, 58, 0.2);
  border: 1px solid rgba(103, 194, 58, 0.5);
  box-shadow: 0 0 10px rgba(103, 194, 58, 0.3);
}

.record-icon {
  color: #409EFF;
  flex-shrink: 0;
}

.record-info {
  flex: 1;
  min-width: 0;
}

.record-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-duration {
  font-size: 12px;
  color: #999999;
}

.record-time {
  font-size: 11px;
  color: #666666;
  margin-top: 2px;
}

/* 进度条样式 */
.progress-container {
  width: 100%;
  margin-top: 4px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #67c23a, #409EFF);
  border-radius: 2px;
  transition: width 0.1s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999999;
}

.current-time {
  font-weight: 500;
  color: #67c23a;
}

.duration {
  color: #666666;
}

.record-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  color: #cccccc;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.play-pause-btn {
  position: relative;
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

.play-pause-btn:hover {
  background: rgba(103, 194, 58, 0.3);
}

.stop-btn {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}

.stop-btn:hover {
  background: rgba(245, 108, 108, 0.3);
}

/* 播放动画特效 */
.play-animation {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 100%;
  pointer-events: none;
}

.wave-bar {
  width: 2px;
  height: 8px;
  background: #67c23a;
  border-radius: 1px;
  animation: wave 1.5s ease-in-out infinite;
}

.wave-bar:nth-child(1) {
  animation-delay: 0s;
}

.wave-bar:nth-child(2) {
  animation-delay: 0.2s;
}

.wave-bar:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1.5);
  }
}

/* 主题样式 */
.audio-record-item--light {
  background: rgba(0, 0, 0, 0.05);
  color: #333333;
}

.audio-record-item--light:hover {
  background: rgba(0, 0, 0, 0.1);
}

.audio-record-item--light .record-name {
  color: #333333;
}

.audio-record-item--light .record-duration {
  color: #666666;
}

.audio-record-item--light .record-time {
  color: #999999;
}

.audio-record-item--light .progress-bar {
  background: rgba(0, 0, 0, 0.1);
}

.audio-record-item--light .time-display {
  color: #666666;
}

.audio-record-item--light .current-time {
  color: #67c23a;
}

.audio-record-item--light .action-btn {
  background: rgba(0, 0, 0, 0.1);
  color: #666666;
}

.audio-record-item--light .action-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333333;
}

.audio-record-item--light .play-pause-btn {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

.audio-record-item--light .stop-btn {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}
</style>