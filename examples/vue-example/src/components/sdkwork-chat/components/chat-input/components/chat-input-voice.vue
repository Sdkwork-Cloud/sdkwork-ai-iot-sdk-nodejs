<template>
  <div class="chat-input-voice">
    <!-- 录音主界面 -->
    <transition name="fade">
      <div v-if="isRecording" class="recording-overlay">
        <div class="recording-glass">
          <!-- 录音状态图标 -->
          <div class="audio-visualizer">
            <Icon 
              icon="mdi:microphone" 
              width="64" 
              height="64" 
              class="recording-icon"
              :class="{ pulsing: isRecording }"
            />
          </div>
          
          <!-- 录音时间显示 -->
          <div class="recording-time">
            <span class="time-digits">{{ formattedTime }}</span>
            <span class="time-unit">秒</span>
          </div>
          
          <!-- 录音控制按钮 -->
          <div class="recording-controls">
            <button 
              class="control-button finish-button"
              @click="stopRecording"
              @touchend="stopRecording"
            >
              <Icon icon="mdi:send-circle" width="24" height="24" />
            </button>
            
            <button 
              class="control-button cancel-button"
              @click="handleCancelRecording"
              @touchend="handleCancelRecording"
            >
              <Icon icon="mdi:close-circle" width="24" height="24" />
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 常规录音按钮 -->
    <div class="voice-input">
      <button 
        class="voice-record-button"
        :class="{ 
          'disabled': props.disabled,
          'mobile-device': isMobileDevice
        }"
        @mousedown="handleStartRecording"
        @mouseup="handleStopRecording"
        @touchstart="handleStartRecording"
        @touchend="handleStopRecording"
        :disabled="props.disabled"
      >
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
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

interface Emits {
  'start-recording': []
  'stop-recording': [audioBlob: Blob, duration: number]
  'recording-error': [error: string]
}

const emit = defineEmits<Emits>()

const isRecording = ref(false)
const recordingStartTime = ref(0)
const recordingDuration = ref(0)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const stream = ref<MediaStream | null>(null)
const timer = ref<number | null>(null)
const errorMessage = ref('')
const isCancelled = ref(false)
const isMobileDevice = ref(false)
const debugInfo = ref('')
const audioAnalyser = ref<AnalyserNode | null>(null)
const audioContextRef = ref<AudioContext | null>(null)
const animationFrameId = ref<number | null>(null)

// 在组件挂载时检测设备类型
onMounted(() => {
  // 改进的移动设备检测逻辑，增加更多设备类型和触摸支持检查
  isMobileDevice.value = (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
    ((navigator as any).msMaxTouchPoints && (navigator as any).msMaxTouchPoints > 0)
  )
  logDebugInfo(`设备检测: ${isMobileDevice.value ? '移动设备' : '桌面设备'}`)
  
  // 初始化触摸事件处理
  if (isMobileDevice.value) {
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
  }
})

onUnmounted(() => {
  if (isMobileDevice.value) {
    document.removeEventListener('touchmove', handleTouchMove)
  }
})

let isSlidingToCancel = false

const handleTouchMove = (e: TouchEvent) => {
  if (isRecording.value) {
    const touch = e.touches[0]
    const cancelButton = document.querySelector('.control-button.cancel-button')
    const buttonRect = cancelButton?.getBoundingClientRect()
    
    if (buttonRect) {
      const isOverCancel = touch.clientX >= buttonRect.left && 
                         touch.clientX <= buttonRect.right &&
                         touch.clientY >= buttonRect.top && 
                         touch.clientY <= buttonRect.bottom
      
      if (isOverCancel) {
        // 视觉反馈更明显
        cancelButton?.classList.add('highlight')
        // 添加振动反馈（如果设备支持）
        if (navigator.vibrate) {
          navigator.vibrate(50)
        }
        isSlidingToCancel = true
        // 滑动到取消按钮时立即取消录音
        handleCancelRecording(e)
      } else {
        cancelButton?.classList.remove('highlight')
        isSlidingToCancel = false
      }
    }
    
    e.preventDefault()
  }
}

// 调试日志
const logDebugInfo = (message: string) => {
  debugInfo.value = `${new Date().toISOString().substr(11, 8)}: ${message}`
  console.log(debugInfo.value)
}

// 计算属性
const showRecordingIndicator = computed(() => {
  return isRecording.value && recordingDuration.value > 1000
})

// 辅助方法
const getButtonText = () => {
  if (props.disabled) return '语音输入'
  return isRecording.value ? '松开发送' : '按住说话'
}


const formattedTime = computed(() => {
  const totalSeconds = Math.floor(recordingDuration.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes > 0 ? `${minutes}:` : ''}${seconds.toString().padStart(2, '0')}`
})

const getRecordingText = () => {
  if (isCancelled.value) return '录音已取消'
  return `正在录音 ${formatDuration(recordingDuration.value)}`
}

const formatDuration = (duration: number) => {
  const seconds = Math.floor(duration / 1000)
  return `${seconds}s`
}

const clearError = () => {
  errorMessage.value = ''
}

// 获取支持的音频MIME类型
const getMimeType = () => {
  const types = [
    'audio/webm',
    'audio/mp4',
    'audio/ogg',
    'audio/wav'
  ]
  
  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      logDebugInfo(`支持的音频格式: ${type}`)
      return type
    }
  }
  
  logDebugInfo('未找到明确支持的音频格式，使用默认格式')
  return 'audio/webm' // 默认格式
}

// 录音逻辑方法
const handleStartRecording = async (event: Event) => {
  event.preventDefault()
  
  // 防止触摸事件和鼠标事件同时触发
  if (event.type === 'touchstart' && 'ontouchstart' in window) {
    event.stopPropagation()
  }
  
  logDebugInfo(`开始录音 - 事件类型: ${event.type}`)
  
  if (props.disabled) {
    logDebugInfo('录音被阻止: 禁用状态')
    return
  }
  
  clearError()
  isCancelled.value = false
  
  try {
    await startRecording()
  } catch (error) {
    console.error('录音启动失败:', error)
    const errorMsg = error instanceof Error ? error.message : '录音启动失败'
    errorMessage.value = errorMsg
    emit('recording-error', errorMsg)
  }
}

const handleStopRecording = (event: Event) => {
  event.preventDefault()
  
  // 防止触摸事件和鼠标事件同时触发
  // 处理移动端触摸事件
  if (event.type === 'touchend') {
    // 确保是触摸设备
    if ('ontouchstart' in window) {
      event.stopPropagation()
      
      // 如果是滑动到取消按钮，则不执行停止逻辑
      if (isSlidingToCancel) {
        logDebugInfo('滑动到取消按钮，忽略停止事件')
        return
      }
    }
  }
  
  logDebugInfo(`停止录音 - 事件类型: ${event.type}`)
  
  if (!isRecording.value) return
  
  if (recordingDuration.value < 500) {
    // 录音时间太短，取消录音
    logDebugInfo('录音时间太短，自动取消')
    handleCancelRecording(event)
    return
  }
  
  stopRecording()
}

const handleCancelRecording = (event: Event) => {
  event.preventDefault()
  
  // 防止触摸事件和鼠标事件同时触发
  if (event.type === 'touchcancel' && 'ontouchstart' in window) {
    event.stopPropagation()
  }
  
  logDebugInfo(`取消录音 - 事件类型: ${event.type}`)
  
  if (!isRecording.value) return
  
  isCancelled.value = true
  stopRecording()
  errorMessage.value = '录音已取消'
  
  // 清除已录制的音频片段
  audioChunks.value = []
  
  // 确保关闭录音弹出层
  isRecording.value = false
}

// 录音功能实现


// 录音功能实现
// 前置声明stopRecording函数
const startRecording = async () => {
  try {
    
    logDebugInfo('请求麦克风访问权限') 
    
    logDebugInfo('请求麦克风访问权限')
    // 请求媒体流
    stream.value = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100 // 提高采样率以获得更好的音质
      }
    })

    // 初始化音频分析
    if (stream.value) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream.value)
      source.connect(analyser)
      analyser.fftSize = 256
      
      // 保存分析器引用供可视化使用
      audioAnalyser.value = analyser
      audioContextRef.value = audioContext
      
      // 开始可视化
      drawVisualizer()
    }
    
    logDebugInfo('麦克风访问成功，创建MediaRecorder')
    // 使用支持的音频格式
    const mimeType = getMimeType()
    const options = { mimeType }
    
    mediaRecorder.value = new MediaRecorder(stream.value, options)
    audioChunks.value = []
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data)
        logDebugInfo(`收到音频数据: ${event.data.size} 字节`)
      }
    }
    
    mediaRecorder.value.onstop = () => {
      logDebugInfo(`录音停止: ${isCancelled.value ? '已取消' : '正常结束'}`)
      
      if (isCancelled.value) {
        // 录音被取消，不发送数据
        return
      }
      
      const audioBlob = new Blob(audioChunks.value, { type: mimeType })
      const duration = Math.floor((Date.now() - recordingStartTime.value) / 1000)
      logDebugInfo(`生成音频Blob: ${audioBlob.size} 字节, 时长: ${duration}秒`)
      emit('stop-recording', audioBlob, duration)
      
      // 清理媒体流
      if (stream.value) {
        stream.value.getTracks().forEach(track => {
          track.stop()
          logDebugInfo(`音频轨道已停止: ${track.kind}`)
        })
        stream.value = null
      }
    }
    
    mediaRecorder.value.onerror = (event) => {
      logDebugInfo(`MediaRecorder错误: ${event.error}`)
    }
    
    // 设置较短的时间间隔，确保数据能够及时收集
    mediaRecorder.value.start(200)
    logDebugInfo('MediaRecorder已启动')
    
    isRecording.value = true
    recordingStartTime.value = Date.now()
    recordingDuration.value = 0
    startTimer()
    emit('start-recording')
  } catch (error) {
    console.error('录音启动失败:', error)
    
    // 简化错误处理，提供友好的用户提示
    if (error instanceof DOMException) {
      logDebugInfo(`DOMException错误: ${error.name} - ${error.message}`)
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        throw new Error('请允许访问麦克风以开始录音')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        throw new Error('未检测到麦克风设备')
      } else {
        throw new Error('无法开始录音，请重试')
      }
    } else {
      throw new Error('无法开始录音，请重试')
    }
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
    stopTimer()
    
    // 清理媒体流和分析器
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }
    
    if (audioContextRef.value) {
      audioContextRef.value.close()
      audioContextRef.value = null
      audioAnalyser.value = null
    }
    
    // 停止可视化动画
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }
  }
}

const startTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  timer.value = window.setInterval(() => {
    if (isRecording.value) {
      recordingDuration.value = Date.now() - recordingStartTime.value
    }
  }, 100)
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 组件卸载时清理资源
onMounted(() => {
  // 初始化音频可视化
  setupVisualizer()
})

onUnmounted(() => {
  if (isRecording.value) {
    stopRecording()
  }
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  if (stream.value) {
    try {
      stream.value.getTracks().forEach(track => {
        try {
          track.stop()
        } catch (e) {
          logDebugInfo(`Error stopping track: ${e}`)
        }
      })
      stream.value = null
    } catch (e) {
      logDebugInfo(`Error cleaning up stream: ${e}`)
    }
  }
  if (audioContextRef.value) {
    audioContextRef.value.close()
    audioContextRef.value = null
  }
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  mediaRecorder.value = null
  audioChunks.value = []
})

const setupVisualizer = () => {
  const canvas = document.querySelector('.visualizer-canvas') as HTMLCanvasElement
  if (canvas) {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
}

const drawVisualizer = () => {
  if (!audioAnalyser.value || !isRecording.value) return
  
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
}

.recording-icon {
  color: #4facfe;
  transition: all 0.3s ease;
}

.recording-icon.pulsing {
  animation: pulse 1.5s infinite;
  color: #ff4444;
}

/* 频谱条样式 */
@keyframes barAnimation {
  0% { opacity: 0.5; transform: scaleY(0.1); }
  50% { opacity: 1; transform: scaleY(1); }
  100% { opacity: 0.5; transform: scaleY(0.1); }
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
  transform: scale(0.98);
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
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  margin-top: 8px;
  text-align: center;
  max-width: 80%;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-3px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(3px, 0, 0);
  }
}

@keyframes wave {
  0%, 100% {
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
  -webkit-touch-callout: none; /* 防止长按出现菜单 */
  -webkit-user-select: none; /* 防止选择文本 */
  -webkit-tap-highlight-color: transparent; /* 移除点击高亮 */
  touch-action: manipulation; /* 优化触摸操作 */
  transition: transform 0.1s ease;
}

.voice-record-button.mobile-device:active {
  transform: scale(0.98);
}

/* 确保录音按钮在移动设备上有足够的点击区域 */
.voice-record-button.mobile-device {
  min-height: 44px; /* iOS建议的最小触摸目标大小 */
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