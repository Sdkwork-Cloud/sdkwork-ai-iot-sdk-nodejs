<template>
  <div class="chat-voice-mode" :style="backgroundStyle">
    <!-- 语音通话界面 -->
    <div class="voice-call-container">
      <!-- 顶部时间显示 -->
      <div class="top-time-display">
        <div class="call-duration">{{ callDuration }}</div>
        <div class="call-status" :class="callStatus">{{ callStatusText }}</div>
      </div>

      <!-- 背景更换组件 - 左上角 -->
      <VoiceChatBackground :selected-background="selectedBackground" :background-options="backgroundOptions"
        @update:selected-background="selectBackground" @background-change="handleBackgroundChange" />

      <!-- 字幕按钮 - 屏幕右上方 -->
      <div class="subtitles-toggle-top-right">
        <div class="subtitles-toggle-btn" @click="toggleSubtitles" :class="{ active: showSubtitles }">
          <Icon :icon="showSubtitles ? 'mingcute:subtitle-fill' : 'mingcute:subtitle-line'" width="20" height="20" />
        </div>
      </div>

      <!-- 中间头像组件 -->
      <VoiceChatAvatar :caller-name="callerName" :caller-avatar="callerAvatar" :is-speaking="isSpeaking"
        :speak-state-text="speakStateText" />

      <!-- 波形显示容器 -->
      <div ref="waveContainerRef" class="wave-container" v-show="showWaveView"></div>

      <!-- 字幕组件 -->
      <SdkworkSubtitles v-if="showSubtitles" ref="subtitlesRef" :display-mode="SubtitleDisplayMode.LINE" :line-count="5"
        :show-controls="false" position="center" :font-size="14" :font-color="'#ffffff'"
        :background-color="'rgba(0, 0, 0, 0.6)'" :show-background="true" :auto-scroll="true"
        @entry-change="handleSubtitleEntryChange" />
      <!-- 通话控制按钮 - 使用独立组件 -->
      <VoiceChatCallControls @microphone-toggle="handleMicrophoneToggle" @speaker-toggle="handleSpeakerToggle"
        @camera-toggle="handleCameraToggle" @call-end="handleCallEnd" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'
import SdkworkSubtitles from '@/components/sdkwork-subtitles/sdkwork-subtitles.vue'
import VoiceChatBackground from './components/voice-chat-background/voice-chat-background.vue'
import VoiceChatAvatar from './components/voice-chat-avatar/voice-chat-avatar.vue'
import VoiceChatCallControls from './components/voice-chat-call-controls/voice-chat-call-controls.vue'
import { SubtitleDisplayMode } from '@/stores/modules/subtitles/types'
import { useChatStore } from '@/stores/modules/chat'

interface Props {
  conversationId: string
  enableWave?: boolean
}

const emit = defineEmits<{
  'mode-change': [mode: 'text' | 'voice']
}>()

const props = withDefaults(defineProps<Props>(), {
  enableWave: true
})

// 通话状态
const callStatus = ref<'connecting' | 'connected' | 'ended'>('connecting')
const isMicrophoneOn = ref(true)
const isSpeakerOn = ref(true)
const isCameraOn = ref(false)
const isSpeaking = computed(() => speakState.value === 'SPEAKING')
const callStartTime = ref<Date | null>(null)
const callDuration = ref('00:00')

// waveView相关状态
const waveContainerRef = ref<HTMLElement | null>(null)
const showWaveView = computed(() => props.enableWave ?? true)

// 定时器引用
let durationInterval: number | undefined = undefined
let waveInterval: number | undefined = undefined

// 字幕功能
const showSubtitles = ref(false)
const subtitlesRef = ref()
const conversationTexts = ref([
  { speaker: 'AI助手', text: '您好！我是AI助手，很高兴为您服务。', time: '10:00' },
  { speaker: '用户', text: '你好，我想咨询一些关于产品的问题。', time: '10:02' },
  { speaker: 'AI助手', text: '当然可以，请告诉我您想了解什么？', time: '10:03' },
  { speaker: '用户', text: '这个产品的功能有哪些特点？', time: '10:05' },
  { speaker: 'AI助手', text: '我们的产品具有智能对话、语音识别、多语言支持等先进功能。', time: '10:06' }
])
const currentSubtitle = ref('')
const subtitleIndex = ref(0)
const subtitleStartTime = ref(0)

// 对方信息
const callerName = ref('AI助手')
const callerAvatar = ref('')

// 背景选择功能
const selectedBackground = ref('default')
const backgroundOptions = ref([
  { id: 'default', name: '默认', gradient: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)' },
  { id: 'ocean', name: '海洋', gradient: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)' },
  { id: 'sunset', name: '日落', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' },
  { id: 'forest', name: '森林', gradient: 'linear-gradient(135deg, #00D2FF 0%, #3A7BD5 100%)' },
  { id: 'purple', name: '紫色', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'green', name: '绿色', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)' }
])
// 从chatStore获取speakState相关状态
const speakState = computed(() => chatStore.speakState)
// 计算属性
const backgroundStyle = computed(() => {
  const bg = backgroundOptions.value.find(b => b.id === selectedBackground.value)
  return { background: bg?.gradient || 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)' }
})

const callStatusText = computed(() => {
  switch (callStatus.value) {
    case 'connecting': return '连接中...'
    case 'connected': return '通话中'
    case 'ended': return '通话结束'
    default: return '未知状态'
  }
})

const speakStateText = computed(() => {
  switch (speakState.value) {
    case 'SPEAKING': return '说话中'
    case 'LISTENING': return '聆听中'
    case 'IDLE': return '空闲'
    default: return '未知状态'
  }
})



// 使用Chat Store处理语音消息和状态管理
const chatStore = useChatStore()


const setSpeakState = (state: 'IDLE' | 'LISTENING' | 'SPEAKING') => {
  chatStore.setSpeakState(state)
}

// 使用recorderStore进行录音管理
import { useRecorderStore } from '@/stores/modules/recorder'
const recorderStore = useRecorderStore()

// 方法
const toggleSubtitles = () => {
  showSubtitles.value = !showSubtitles.value
  showToast(showSubtitles.value ? '字幕已开启' : '字幕已关闭')

  if (showSubtitles.value) {
    // 初始化字幕
    initSubtitles()
  }
}

// 初始化字幕
const initSubtitles = () => {
  subtitleStartTime.value = Date.now()

  // 清除之前的动态字幕
  if (subtitlesRef.value) {
    subtitlesRef.value.clearDynamicSubtitles()
  }

  // 开始播放
  if (subtitlesRef.value) {
    subtitlesRef.value.startPlayback()
  }
}

// 添加动态字幕
const addDynamicSubtitle = (text: string, speaker: string) => {
  if (!showSubtitles.value || !subtitlesRef.value) return

  const currentTime = Date.now() - subtitleStartTime.value
  const startTime = currentTime
  const endTime = startTime + 5000 // 5秒显示时间

  // 格式化字幕文本
  const formattedText = `${speaker}：${text}`

  // 添加动态字幕
  subtitlesRef.value.addDynamicSubtitle(formattedText, startTime, endTime, true)
}

// 处理字幕条目变化
const handleSubtitleEntryChange = (entry: any, currentTime: number) => {
  if (entry) {
    console.log('字幕切换:', entry.text, currentTime)
  }
}

// 通话控制事件处理
const handleMicrophoneToggle = async (isOn: boolean) => {
  isMicrophoneOn.value = isOn
  if (isOn) {
    try {
      // 设置语音状态为聆听
      setSpeakState('LISTENING')

      // 开始实时流式录制
      await recorderStore.startRecording({ realtime: true, waveContainer: waveContainerRef.value as any })

      // 开始语音监听
      chatStore.startVoiceListening()
      showToast('麦克风已开启')
    } catch (error) {
      console.error('开启麦克风失败:', error)
      showToast('开启麦克风失败')
    }
  } else {
    try {
      // 停止录制但不销毁录制器，保持实时对话状态
      await recorderStore.pauseRecording()
      // 停止语音监听
      chatStore.stopVoiceListening()
      // 设置语音状态为闲置
      setSpeakState('IDLE')
      showToast('麦克风已静音')
    } catch (error) {
      console.error('关闭麦克风失败:', error)
      showToast('关闭麦克风失败')
    }
  }
}

const handleSpeakerToggle = (isOn: boolean) => {
  isSpeakerOn.value = isOn
  showToast(isOn ? '扬声器已开启' : '扬声器已静音')
}

const handleCameraToggle = (isOn: boolean) => {
  isCameraOn.value = isOn
  showToast(isOn ? '摄像头已开启' : '摄像头已关闭')
}

const handleCallEnd = () => {
  callStatus.value = 'ended'
  // 设置语音状态为闲置
  setSpeakState('IDLE')
  showToast('通话已结束')

  // 延迟切换到文字模式
  setTimeout(() => {
    // 触发模式切换事件
    emit('mode-change', 'text')
  }, 1000)
}

// 背景选择方法
const selectBackground = (bgId: string) => {
  selectedBackground.value = bgId
  showToast('背景已更换')
}

const handleBackgroundChange = (bgId: string) => {
  // 背景更换后的处理逻辑
  console.log('背景已更换为:', bgId)
}

// 设置按钮已移除，不再需要此方法

const getQualityClass = (quality: string) => {
  return `quality-${quality}`
} 

const updateCallDuration = () => {
  if (callStartTime.value && callStatus.value === 'connected') {
    const now = new Date()
    const diff = Math.floor((now.getTime() - callStartTime.value.getTime()) / 1000)
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0')
    const seconds = (diff % 60).toString().padStart(2, '0')
    callDuration.value = `${minutes}:${seconds}`
  }
}

// 设置wave容器
const setWaveContainer = () => {
  if (waveContainerRef.value) {
    recorderStore.setWaveContainer(waveContainerRef.value)
    console.log('Wave容器已设置，容器元素:', waveContainerRef.value)
  } else {
    console.warn('Wave容器引用为空，无法设置')
  }
}

// 设置音频流监听器
const setupAudioStreamListener = () => {
  // 监听音频流事件
  const handleAudioStream = (event: any) => {
    if (event.detail && event.detail.type === 'AUDIO_STREAM_RECEIVED') {
      // 这里可以添加音频播放逻辑
      setSpeakState('SPEAKING')
    }
  }

  // 监听消息接收事件
  const handleMessageReceived = (event: any) => {
    if (event.detail && event.detail.type === 'MESSAGE_RECEIVED') {
      // 更新对话文本
      if (event.detail.message.role === 'assistant') {
        conversationTexts.value.push({
          speaker: 'AI助手',
          text: event.detail.message.content,
          time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
        })
      }
    }
  }

  // 在组件挂载时添加事件监听器
  window.addEventListener('sdk:audioStream', handleAudioStream)
  window.addEventListener('sdk:message', handleMessageReceived)

  // 返回清理函数
  return () => {
    window.removeEventListener('sdk:audioStream', handleAudioStream)
    window.removeEventListener('sdk:message', handleMessageReceived)
  }
}



onMounted(async () => {
  // 设置音频流监听器
  setupAudioStreamListener()

  // 初始化Chat Store
  try {
    if (!chatStore.isInitialized) {
      await chatStore.initialize()
      showToast('聊天系统初始化成功')
    }
    
    // 进入语音房间 - 传递wave等参数
    await chatStore.enterVoiceRoom({
      enableWave: props.enableWave ?? true,
      waveContainer: waveContainerRef.value as HTMLElement,
      sampleRate: 16000,
      format: 'pcm',
      realtime: true,
      hello:{
        send: true 
      }
    })
    showToast('语音房间已建立')
  } catch (error) {
    console.error('聊天系统初始化失败:', error)
    showToast('聊天系统初始化失败，使用模拟模式')
  }

  // 模拟通话连接过程
  setTimeout(() => {
    callStatus.value = 'connected'
    callStartTime.value = new Date()
    showToast('通话已连接')
  }, 2000)

  // 启动通话计时器
  durationInterval = setInterval(updateCallDuration, 1000)

  // 模拟语音状态变化和字幕更新
  waveInterval = setInterval(() => {
    const random = Math.random()
    if (random > 0.7) {
      setSpeakState('SPEAKING')
      // 模拟AI助手说话，添加字幕
      if (showSubtitles.value) {
        const aiTexts = [
          '您好！我是AI助手，很高兴为您服务。',
          '当然可以，请告诉我您想了解什么？',
          '我们的产品具有智能对话、语音识别、多语言支持等先进功能。',
          '您还有其他问题需要咨询吗？',
          '感谢您的使用，祝您生活愉快！'
        ]
        const randomText = aiTexts[Math.floor(Math.random() * aiTexts.length)]
        addDynamicSubtitle(randomText, 'AI助手')
      }
    } else if (random > 0.4) {
      setSpeakState('LISTENING')
      // 模拟用户说话，添加字幕
      if (showSubtitles.value) {
        const userTexts = [
          '你好，我想咨询一些关于产品的问题。',
          '这个产品的功能有哪些特点？',
          '价格是多少？',
          '如何使用这个产品？',
          '谢谢你的解答！'
        ]
        const randomText = userTexts[Math.floor(Math.random() * userTexts.length)]
        addDynamicSubtitle(randomText, '用户')
      }
    } else {
      setSpeakState('IDLE')
    }
  }, 5000)


})
onUnmounted(async () => {
  if (durationInterval) {
    clearInterval(durationInterval)
    durationInterval = undefined
  }
  if (waveInterval) {
    clearInterval(waveInterval)
    waveInterval = undefined
  }
  
  // 退出语音房间 - 处理recorder相关销毁
  try {
    await chatStore.exitVoiceRoom()
    console.log('语音房间已退出')
  } catch (error) {
    console.error('退出语音房间失败:', error)
  }
  
  // 销毁录音器
  recorderStore.destroyRecorder()
})
</script>

<style scoped lang="scss">
.chat-voice-mode {
  height: 100%;
  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  .voice-call-container {
    text-align: center;
    width: 100%;
    max-width: 400px;
    padding: 40px 20px 120px;
    /* 增加底部内边距为控制按钮留空间 */
    position: relative;
    min-height: 100vh;
    /* 默认使用 vh */
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    /* 防止内容溢出导致跳动 */
  }

  /* 支持 dvh 的浏览器使用 dvh */
  @supports (min-height: 100dvh) {
    .voice-call-container {
      min-height: 100dvh;
    }
  }

  /* 顶部时间显示 */
  .top-time-display {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 10;

    .call-duration {
      font-size: 24px;
      font-weight: 600;
      font-family: 'Courier New', monospace;
      margin-bottom: 8px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .call-status {
      font-size: 14px;
      opacity: 0.9;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 4px 12px;
      border-radius: 12px;
      display: inline-block;

      &.connected {
        background: rgba(76, 217, 100, 0.3);
      }
    }
  }

  .caller-info {
    margin-bottom: 40px;

    .caller-avatar {
      position: relative;
      margin-bottom: 20px;

      img {
        width: 120px;
        height: 120px;
        border-radius: 60px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      }
    }

    .caller-name {
      font-size: 24px;
      font-weight: 600;
    }
  }

  /* 声波和网络质量容器 - 相邻放置 */
  .wave-quality-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 30px;
    margin: 30px 0;
  }



  /* 右上角字幕按钮 */
  .subtitles-toggle-top-right {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;

    .subtitles-toggle-btn {
      width: 44px;
      height: 44px;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      &.active {
        background: rgba(76, 217, 100, 0.3);
        border-color: rgba(76, 217, 100, 0.6);
        box-shadow: 0 4px 16px rgba(76, 217, 100, 0.3);
      }
    }
  }

  /* 波形显示容器 */
  .wave-container {
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    z-index: 5;
    overflow: hidden;
  }
}
</style>