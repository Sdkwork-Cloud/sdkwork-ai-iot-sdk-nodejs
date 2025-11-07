<template>
  <div class="message-content-audio" :class="{ 'audio-own': isOwn, 'audio-other': !isOwn }">

    <!-- 播放按钮 -->
    <button class="play-button" @click="handlePlayPause" :disabled="!audioUrl"
      :class="{ 'playing': isPlaying, 'own-button': isOwn, 'other-button': !isOwn }">
      <Icon v-if="!isPlaying" icon="mdi:play" width="16" height="16" class="play-icon" />
      <Icon v-else icon="mdi:pause" width="16" height="16" class="pause-icon" />
    </button>

    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar" @click="handleProgressClick">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="time-display">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <span class="separator">/</span>
        <span class="total-time">{{ formatTime(totalDuration) }}</span>
      </div>
    </div>

    <!-- 波形可视化 -->
    <div class="waveform-container">
      <div v-for="(bar, index) in waveformBars" :key="index" class="waveform-bar"
        :class="{ 'active': isBarActive(index) }" :style="{ height: bar + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatMessageVO } from '@/services'
import { chatMessageProcessor } from '@/core/chat'
import { MsgAudioContent, MsgPayload } from 'sdkwork-sdk-api-typescript'
import { SdkworkAudioPlayer } from '@/core/audio/player/sdkwork_audio_player'

interface Props {
  message: ChatMessageVO
  showDescription?: boolean
  isOwn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: false,
  isOwn: false
})

// 响应式数据
const isPlaying = ref(false)
const currentTime = ref(0)
const totalDuration = ref(0)
const audioPlayer = ref<SdkworkAudioPlayer | null>(null)
const audioUrl = ref<string>('')

// 模拟波形数据 - 更真实的语音波形
const waveformBars = ref([25, 45, 65, 85, 95, 85, 65, 45, 25, 35, 55, 75, 90, 75, 55, 35])

// 进度计时器
let progressInterval: number | null = null

// 计算属性
const progressPercentage = computed(() => {
  if (totalDuration.value === 0) return 0
  return Math.min(100, Math.max(0, (currentTime.value / totalDuration.value) * 100))
})

// 格式化时间显示
const formatTime = (durationMs: number) => {
  if (durationMs <= 0) return '0:00'
  const seconds = Math.round(durationMs / 1000)
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 格式化时长显示（简版）
const formatDuration = (seconds: number) => {
  if (seconds <= 0) return '0s'
  if (seconds < 60) return `${Math.round(seconds)}s`
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 检查波形条是否处于活动状态（根据播放进度）
const isBarActive = (index: number) => {
  if (!isPlaying.value || totalDuration.value === 0) return false
  const barProgress = (index / waveformBars.value.length) * 100
  return barProgress <= progressPercentage.value
}
function onCopy() {
  window.$copy(audioUrl.value)
}
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
          stopProgressTimer()
          resetProgress()
        },
        onError: (error) => {
          console.error('播放错误:', error)
          isPlaying.value = false
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
  // 计算属性会自动更新，不需要手动赋值
  // progressPercentage 会根据 currentTime 和 totalDuration 自动计算
}

// 重置进度
const resetProgress = () => {
  currentTime.value = 0
  // progressPercentage 会自动根据 currentTime 更新
}

// 处理播放/暂停
const handlePlayPause = async () => {
  try {
    // 初始化音频播放器
    initAudioPlayer()

    if (!audioUrl.value) {
      console.warn('音频URL为空')
      return
    }

    // 如果正在播放，则暂停
    if (isPlaying.value) {
      await audioPlayer.value?.pause()
      return
    }
    const payload = window.$chat.getPayload(props.message)
    if (payload?.audio?.resource?.localFile) {
      const file = payload?.audio?.resource?.localFile
      // 播放音频
      await audioPlayer.value?.play(file as any)
    } else {
      if (payload?.audio?.resource?.url) {
        await audioPlayer.value?.play(payload?.audio?.resource?.url as string)
      } else {
        console.error('音频URL为空')
      }

    }


  } catch (error) {
    console.error('播放音频失败:', error)
    isPlaying.value = false
    resetProgress()
  }
}

// 处理停止播放
const handleStop = async () => {
  try {
    if (audioPlayer.value) {
      await audioPlayer.value.stop()
      isPlaying.value = false
      resetProgress()
    }
  } catch (error) {
    console.error('停止播放失败:', error)
  }
}

// 处理进度条点击
const handleProgressClick = (event: MouseEvent) => {
  if (!audioPlayer.value || totalDuration.value === 0) return

  const progressBar = event.currentTarget as HTMLDivElement
  const rect = progressBar.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * totalDuration.value

  audioPlayer.value.seek(newTime)
  currentTime.value = newTime
}

// 初始化音频
onMounted(() => {
  // 从消息中获取音频URL和时长
  const payload: MsgPayload = chatMessageProcessor.getPayload(props.message) as any
  const audio: MsgAudioContent = payload?.audio as any
  const url = audio?.resource?.url || ''
  audioUrl.value = url
  totalDuration.value = audio?.resource?.duration || 0
  // 如果有音频URL，初始化播放器
  if (url) {
    initAudioPlayer()
  }
})

// 清理资源
onUnmounted(() => {
  stopProgressTimer()
  if (audioPlayer.value) {
    audioPlayer.value.stop()
    audioPlayer.value = null
  }
})

// 监听播放状态变化
watch(isPlaying, (newValue) => {
  if (!newValue) {
    stopProgressTimer()
  }
})
</script>

<style scoped>
.message-content-audio {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  max-width: 280px;
  padding: 8px 0;
  height: 40px;
  box-sizing: border-box;
}

.audio-own {
  justify-content: flex-end;
}

.audio-other {
  justify-content: flex-start;
}

/* 播放按钮样式 */
.play-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
}

.play-icon,
.pause-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 1px;
  /* 微调播放图标位置，使其视觉居中 */
}

/* 自己消息的播放按钮 */
.own-button {
  background-color: #007bff;
  color: white;
}

.own-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.own-button.playing {
  background-color: #28a745;
}

/* 对方消息的播放按钮 */
.other-button {
  background-color: #f0f0f0;
  color: #666;
}

.other-button:hover {
  background-color: #e0e0e0;
  transform: scale(1.05);
}

.other-button.playing {
  background-color: #28a745;
  color: white;
}

/* 进度条容器 */
.progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.progress-bar {
  height: 3px;
  background-color: #e0e0e0;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  border-radius: 2px;
  transition: width 0.1s ease;
}

.audio-own .progress-fill {
  background-color: #007bff;
}

.audio-other .progress-fill {
  background-color: #666;
}

/* 时间显示 */
.time-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #666;
  line-height: 1;
  height: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.current-time,
.total-time {
  font-variant-numeric: tabular-nums;
  /* 等宽数字，确保时间对齐 */
  letter-spacing: -0.2px;
}

.separator {
  margin: 0 2px;
  color: #999;
}

.audio-own .time-display {
  color: #007bff;
}

.audio-other .time-display {
  color: #666;
}

/* 波形可视化 */
.waveform-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1px;
  height: 24px;
  flex-shrink: 0;
  padding: 0 4px;
}

.waveform-bar {
  width: 2px;
  background-color: #ccc;
  border-radius: 1px;
  transition: all 0.3s ease;
  min-height: 4px;
}

.waveform-bar.active {
  background-color: #007bff;
}

.audio-own .waveform-bar.active {
  background-color: #007bff;
}

.audio-other .waveform-bar.active {
  background-color: #666;
}

.play-icon,
.pause-icon {
  transition: all 0.2s ease;
}

.play-button:hover .play-icon,
.play-button:hover .pause-icon {
  transform: scale(1.1);
}

.other-player .waveform-bar.active {
  background-color: #0056b3;
}

.audio-description {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .audio-player {
    padding: 10px;
    gap: 10px;
  }

  .play-button {
    width: 36px;
    height: 36px;
  }

  .audio-waveform {
    height: 25px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .audio-player {
    background-color: #2d2d2d;
  }

  .progress-bar {
    background-color: #404040;
  }

  .time-display {
    color: #aaa;
  }

  .audio-description {
    color: #aaa;
  }
}
</style>