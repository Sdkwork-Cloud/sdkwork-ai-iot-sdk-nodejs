<template>
  <div class="chat-input-voice">
    <!-- 录音主界面 -->
    <transition name="fade">
      <div v-if="recorderStore.isRecording" class="recording-overlay">
        <div class="recording-glass">
          <!-- 录音状态图标和波形显示 -->
          <div class="audio-visualizer">
            <Icon icon="mdi:microphone" width="64" height="64" class="recording-icon"
              :class="{ pulsing: recorderStore.isRecording }" />
            <!-- 音频波形可视化 -->
            <div v-if="recorderStore.isRecording" class="wave-container">
              <div v-for="i in 8" :key="i" class="wave-bar" :style="{ animationDelay: `${(i - 1) * 0.1}s` }"></div>
            </div>
          </div>

          <!-- 录音时间显示 -->
          <div class="recording-time">
            <span class="time-digits">{{ formattedTime }}</span>
            <span class="time-unit">秒</span>
          </div>

          <!-- 录音控制按钮 -->
          <div class="recording-controls">
            <button class="control-button finish-button" @click="handleStopRecording" @touchend="handleStopRecording">
              <Icon icon="mdi:send-circle" width="24" height="24" />
            </button>

            <button class="control-button cancel-button" @click="handleCancelRecording"
              @touchend="handleCancelRecording">
              <Icon icon="mdi:close-circle" width="24" height="24" />
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 错误提示 -->
    <div v-if="recorderStore.errorMessage" class="error-message">
      {{ recorderStore.errorMessage }}
    </div>

    <!-- 常规录音按钮 -->
    <div class="voice-input">
      <button class="voice-record-button" :class="{
        'disabled': props.disabled,
        'mobile-device': isMobileDevice,
        'recording': recorderStore.isRecording
      }" @mousedown="handleStartRecording" @mouseup="handleStopRecording" @touchstart="handleStartRecording"
        @touchend="handleStopRecording" :disabled="props.disabled">
        <div class="button-content">
          <span class="record-icon">
            <Icon icon="mdi:microphone" width="24" height="24" />
          </span>
          <span class="record-text">
            {{ getButtonText() }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useRecorderStore } from '@/stores/modules/recorder'

interface Props {
  disabled?: boolean
  maxDuration?: number // 最大录制时长（秒）
  minDuration?: number // 最小录制时长（秒）
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  maxDuration: 60, // 默认最大录制60秒
  minDuration: 1   // 默认最小录制1秒
})

interface Emits {
  'start-recording': []
  'stop-recording': [data: Blob | ArrayBuffer, duration: number]
  'recording-error': [error: string]
  'recording-cancelled': []
  'recording-timeout': []
}

const emit = defineEmits<Emits>()

const recorderStore = useRecorderStore()
const isMobileDevice = ref(false)
const isSlidingToCancel = ref(false)
const touchStartTime = ref(0)
const isTouchStarted = ref(false)
const audioAnalyser = ref<AnalyserNode | null>(null)
const animationFrameId = ref<number | null>(null)

// 监听录制状态变化
watch(() => recorderStore.currentState, (newState, oldState) => {
  if (newState === 'error' && recorderStore.errorMessage) {
    emit('recording-error', recorderStore.errorMessage)
  }

  // 录制停止时重置触摸状态
  if (newState === 'stopped' || newState === 'idle') {
    isTouchStarted.value = false
    isSlidingToCancel.value = false
    touchStartTime.value = 0
  }

  // 录制开始时重置滑动取消状态
  if (newState === 'recording' && oldState === 'idle') {
    isSlidingToCancel.value = false
  }
})

// 监听录制时长，处理超时
watch(() => recorderStore.currentDuration, (duration) => {
  if (props.maxDuration > 0 && duration >= props.maxDuration && recorderStore.isRecording) {
    handleRecordingTimeout()
  }
})

// 监听配置变化
watch(() => props.maxDuration, (newMaxDuration) => {
  recorderStore.updateConfig({
    maxDuration: newMaxDuration
  })
})

// 在组件挂载时检测设备类型
onMounted(() => {
  isMobileDevice.value = (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    ((navigator as any).msMaxTouchPoints && (navigator as any).msMaxTouchPoints > 0)
  )

  // 初始化触摸事件处理
  if (isMobileDevice.value) {
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
  }

  // 更新录制器配置
  recorderStore.updateConfig({
    maxDuration: props.maxDuration
  })
})

onUnmounted(() => {
  if (isMobileDevice.value) {
    document.removeEventListener('touchmove', handleTouchMove)
  }
  recorderStore.cleanup()
})

const handleTouchMove = (e: TouchEvent) => {
  if (!recorderStore.isRecording || !isTouchStarted.value) {
    return
  }

  const touch = e.touches[0]
  const cancelButton = document.querySelector('.control-button.cancel-button')
  const finishButton = document.querySelector('.control-button.finish-button')

  // 检查是否滑动到取消区域
  const buttonRect = cancelButton?.getBoundingClientRect()
  const isOverCancel = buttonRect &&
    touch.clientX >= buttonRect.left &&
    touch.clientX <= buttonRect.right &&
    touch.clientY >= buttonRect.top &&
    touch.clientY <= buttonRect.bottom

  // 检查是否滑动到完成区域
  const finishRect = finishButton?.getBoundingClientRect()
  const isOverFinish = finishRect &&
    touch.clientX >= finishRect.left &&
    touch.clientX <= finishRect.right &&
    touch.clientY >= finishRect.top &&
    touch.clientY <= finishRect.bottom

  // 更新按钮高亮状态
  if (isOverCancel) {
    cancelButton?.classList.add('highlight')
    finishButton?.classList.remove('highlight')
    if (!isSlidingToCancel.value && navigator.vibrate) {
      navigator.vibrate(30)
    }
    isSlidingToCancel.value = true
  } else if (isOverFinish) {
    finishButton?.classList.add('highlight')
    cancelButton?.classList.remove('highlight')
    isSlidingToCancel.value = false
  } else {
    // 不在任何按钮区域
    cancelButton?.classList.remove('highlight')
    finishButton?.classList.remove('highlight')
    isSlidingToCancel.value = false
  }

  e.preventDefault()
}

// 计算属性
const formattedTime = computed(() => {
  const totalSeconds = recorderStore.currentDuration
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes > 0 ? `${minutes}:` : ''}${seconds.toString().padStart(2, '0')}`
})

const isRecordingTooShort = computed(() => {
  return recorderStore.currentDuration < props.minDuration
})

const isRecordingTooLong = computed(() => {
  return props.maxDuration > 0 && recorderStore.currentDuration >= props.maxDuration
})

// 辅助方法
const getButtonText = () => {
  if (props.disabled) return '语音输入'
  return recorderStore.isRecording ? '松开发送' : '按住说话'
}

// 录音逻辑方法
const handleStartRecording = async (event: Event) => {
  event.preventDefault()

  if (event.type === 'touchstart' && 'ontouchstart' in window) {
    event.stopPropagation()
    touchStartTime.value = Date.now()
    isTouchStarted.value = true
  }

  if (props.disabled) return

  // 防止重复点击
  if (recorderStore.isRecording || recorderStore.currentState === 'initializing') {
    console.warn('Recording already in progress or initializing')
    return
  }

  recorderStore.clearError()
  isSlidingToCancel.value = false

  try {
    await recorderStore.startRecording({})
    emit('start-recording')

    // 添加触觉反馈（移动端）
    if (isMobileDevice.value && navigator.vibrate) {
      navigator.vibrate(50)
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '录音启动失败'
    console.error('Recording start failed:', error)
    emit('recording-error', errorMsg)
    isTouchStarted.value = false
  }
}

const handleStopRecording = async (event: Event) => {
  event.preventDefault()

  if (event.type === 'touchend' && 'ontouchstart' in window) {
    event.stopPropagation()

    // 检查是否为滑动取消
    if (isSlidingToCancel.value) {
      handleCancelRecording(event)
      return
    }

    // 检查触摸时长是否过短（防误触）
    const touchDuration = Date.now() - touchStartTime.value
    if (touchDuration < 200) {
      console.log('Touch duration too short, ignoring:', touchDuration)
      isTouchStarted.value = false
      return
    }
  }

  if (!recorderStore.isRecording) {
    console.log('Not recording, ignoring stop request')
    return
  }

  // 检查录制时长
  if (isRecordingTooShort.value) {
    console.log('Recording too short, cancelling:', recorderStore.currentDuration)
    handleCancelRecording(event)
    return
  }

  try { 
    const audioRecord = await recorderStore.stopRecording()
    if (audioRecord && audioRecord.data) { 
      console.log('Recording stopped successfully, duration:',audioRecord, audioRecord.duration)
      emit('stop-recording', audioRecord.data, audioRecord.duration)

      // 添加成功触觉反馈
      if (isMobileDevice.value && navigator.vibrate) {
        navigator.vibrate([50, 30, 50])
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '录音停止失败'
    console.error('Recording stop failed:', error)
    emit('recording-error', errorMsg)
  } finally {
    isTouchStarted.value = false
  }
}

const handleCancelRecording = (event: Event) => {
  event.preventDefault()

  if (event.type === 'touchcancel' && 'ontouchstart' in window) {
    event.stopPropagation()
  }

  if (!recorderStore.isRecording) {
    console.log('Not recording, ignoring cancel request')
    return
  }

  console.log('Cancelling recording, duration:', recorderStore.currentDuration)
  recorderStore.cancelRecording()
  emit('recording-cancelled')

  // 添加取消触觉反馈
  if (isMobileDevice.value && navigator.vibrate) {
    navigator.vibrate(100)
  }
}

const handleRecordingTimeout = () => {
  if (!recorderStore.isRecording) return

  // 自动停止录制并发送
  handleStopRecording(new Event('timeout'))
  emit('recording-timeout')
}

// 提供组件方法供父组件调用
const startRecording = async () => {
  return handleStartRecording(new Event('programmatic'))
}

const stopRecording = async () => {
  return handleStopRecording(new Event('programmatic'))
}

const cancelRecording = () => {
  handleCancelRecording(new Event('programmatic'))
}

// 暴露组件方法
defineExpose({
  startRecording,
  stopRecording,
  cancelRecording,
  isRecording: () => recorderStore.isRecording,
  getRecordingDuration: () => recorderStore.currentDuration
})

const setupVisualizer = () => {
  const canvas = document.querySelector('.visualizer-canvas') as HTMLCanvasElement
  if (canvas) {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
}

const drawVisualizer = () => {
  if (!audioAnalyser.value || !recorderStore.isRecording) return

  const canvas = document.querySelector('.visualizer-canvas') as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const bufferLength = audioAnalyser.value.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  audioAnalyser.value.getByteFrequencyData(dataArray)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const barWidth = (canvas.width / bufferLength) * 2.5
  let x = 0

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * canvas.height

    ctx.fillStyle = `rgb(${Math.floor(barHeight * 2)}, 100, 255)`
    ctx.fillRect(
      x,
      canvas.height - barHeight,
      barWidth,
      barHeight
    )

    x += barWidth + 1
  }

  animationFrameId.value = requestAnimationFrame(drawVisualizer)
}
</script>

<style scoped>
.chat-input-voice {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

/* 录音遮罩层 */
.recording-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

/* 磨砂玻璃效果面板 */
.recording-glass {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 40px;
  width: 80%;
  max-width: 400px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 音频可视化 */
.audio-visualizer {
  width: 100%;
  height: 120px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.recording-icon {
  color: #4facfe;
  transition: all 0.3s ease;
}

.recording-icon.pulsing {
  animation: pulse 1.5s infinite;
  color: #ff4444;
}

/* 音频波形容器 */
.wave-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 16px;
  height: 40px;
}

/* 波形条 */
.wave-bar {
  width: 4px;
  height: 8px;
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 2px;
  animation: wave 1.2s infinite ease-in-out;
  transform-origin: bottom;
}

.wave-bar:nth-child(odd) {
  animation-duration: 1.1s;
}

.wave-bar:nth-child(even) {
  animation-duration: 1.3s;
}

.wave-bar:nth-child(1) {
  animation-delay: 0s;
}

.wave-bar:nth-child(2) {
  animation-delay: 0.1s;
}

.wave-bar:nth-child(3) {
  animation-delay: 0.2s;
}

.wave-bar:nth-child(4) {
  animation-delay: 0.3s;
}

.wave-bar:nth-child(5) {
  animation-delay: 0.4s;
}

.wave-bar:nth-child(6) {
  animation-delay: 0.5s;
}

.wave-bar:nth-child(7) {
  animation-delay: 0.6s;
}

.wave-bar:nth-child(8) {
  animation-delay: 0.7s;
}

@keyframes wave {

  0%,
  100% {
    transform: scaleY(0.6);
    opacity: 0.6;
  }

  50% {
    transform: scaleY(1.2);
    opacity: 1;
  }
}

/* 频谱条样式 */
@keyframes barAnimation {
  0% {
    opacity: 0.5;
    transform: scaleY(0.1);
  }

  50% {
    opacity: 1;
    transform: scaleY(1);
  }

  100% {
    opacity: 0.5;
    transform: scaleY(0.1);
  }
}

/* 取消按钮高亮 */
.control-button.cancel-button.highlight {
  transform: scale(1.15);
  box-shadow: 0 0 25px rgba(255, 117, 140, 0.8);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(135deg, #ff5252 0%, #ff7eb3 100%);
}

/* 录音时间显示 */
.recording-time {
  display: flex;
  align-items: baseline;
  margin-bottom: 30px;
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
}

.recording-time::before {
  content: '';
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-color: #ff4444;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.time-digits {
  font-size: 48px;
  font-weight: 300;
  margin-right: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.time-unit {
  font-size: 18px;
  opacity: 0.8;
}

/* 录音控制按钮 */
.recording-controls {
  display: flex;
  gap: 30px;
}

.control-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.finish-button {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

.cancel-button {
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
  box-shadow: 0 4px 15px rgba(255, 117, 140, 0.4);
}

.control-button:hover {
  transform: scale(1.05);
}

.control-button:active {
  transform: scale(0.95);
}

/* 完成按钮高亮 */
.control-button.finish-button.highlight {
  transform: scale(1.15);
  box-shadow: 0 0 25px rgba(79, 172, 254, 0.8);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* 常规录音按钮 */
.voice-input {
  position: relative;
  z-index: 1;
}

.voice-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.voice-record-button {
  padding: 12px 32px;
  border: 2px solid #007bff;
  border-radius: 28px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  position: relative;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
  font-size: 16px;
  letter-spacing: 0.5px;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.record-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
}

.record-text {
  flex: 1;
  text-align: center;
}

.voice-record-button.recording {
  min-width: 180px;
}

.voice-record-button:hover:not(.disabled) {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

.voice-record-button.recording {
  background-color: #ff4444;
  border-color: #ff4444;
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
  transform: scale(1.05);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.voice-record-button.recording .record-icon {
  animation: pulse 0.8s infinite ease-in-out;
  transform-origin: center;
}

.voice-record-button.disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.voice-record-button.disabled:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  transform: none;
}

.record-icon {
  font-size: 16px;
  color: #ff4444;
  transition: all 0.3s ease;
}

.record-icon.pulsing {
  animation: pulse 1s infinite;
}

.record-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.recording-duration {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 400;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  padding: 6px 14px;
  background-color: #fff;
  border-radius: 16px;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  animation: fadeInTop 0.3s ease-in-out;
  margin-bottom: 10px;
  position: relative;
}

.recording-indicator:after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

@keyframes fadeInTop {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recording-wave {
  display: flex;
  align-items: center;
  height: 16px;
  gap: 2px;
}

.recording-wave span {
  width: 2px;
  height: 100%;
  background-color: #ff4444;
  border-radius: 1px;
  animation: wave 1.2s infinite ease-in-out;
  transform-origin: bottom;
  transition: height 0.3s ease;
}

.recording-wave span:nth-child(odd) {
  animation-duration: 1.1s;
}

.recording-wave span:nth-child(even) {
  animation-duration: 1.3s;
}

.recording-wave span:nth-child(1) {
  animation-delay: -0.4s;
}

.recording-wave span:nth-child(2) {
  animation-delay: -0.3s;
  height: 60%;
}

.recording-wave span:nth-child(3) {
  animation-delay: -0.2s;
  height: 80%;
}

.recording-wave span:nth-child(4) {
  animation-delay: -0.1s;
  height: 40%;
}

.recording-wave span:nth-child(5) {
  animation-delay: 0s;
  height: 70%;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  padding: 8px 12px;
  background-color: #f8d7da;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  margin-top: 8px;
  text-align: center;
  max-width: 80%;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
}

@keyframes wave {

  0%,
  100% {
    transform: scaleY(0.6);
    opacity: 0.6;
  }

  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7);
  }

  50% {
    transform: scale(1.1);
    opacity: 0.8;
    box-shadow: 0 0 0 10px rgba(255, 68, 68, 0);
  }

  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 68, 68, 0);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .voice-record-button {
    min-width: 180px;
    height: 48px;
    padding: 10px 28px;
    font-size: 15px;
    border-radius: 24px;
  }

  .record-text {
    font-size: 15px;
  }

  .voice-record-button.recording {
    min-width: 200px;
  }

  .button-content {
    gap: 10px;
  }
}

/* 移动设备特定样式 */
.voice-record-button.mobile-device {
  -webkit-touch-callout: none;
  /* 防止长按出现菜单 */
  -webkit-user-select: none;
  /* 防止选择文本 */
  -webkit-tap-highlight-color: transparent;
  /* 移除点击高亮 */
  touch-action: manipulation;
  /* 优化触摸操作 */
  transition: transform 0.1s ease;
}

.voice-record-button.mobile-device:active {
  transform: scale(0.98);
}

/* 确保录音按钮在移动设备上有足够的点击区域 */
.voice-record-button.mobile-device {
  min-height: 44px;
  /* iOS建议的最小触摸目标大小 */
  min-width: 44px;
}

/* 移动设备录音状态优化 */
.voice-record-button.mobile-device.recording {
  transform: scale(1.03);
}

.voice-record-button.mobile-device.recording:active {
  transform: scale(0.98);
}

/* 调试信息样式 */
.debug-info {
  color: #0c5460;
  font-size: 10px;
  padding: 2px 6px;
  background-color: #d1ecf1;
  border-radius: 4px;
  border: 1px solid #bee5eb;
  margin-top: 4px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>