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
      <ChatBackground
        :selected-background="selectedBackground"
        :background-options="backgroundOptions"
        @update:selected-background="selectBackground"
        @background-change="handleBackgroundChange"
      />

      <!-- 字幕按钮 - 屏幕右上方 -->
      <div class="subtitles-toggle-top-right">
        <div class="subtitles-toggle-btn" @click="toggleSubtitles" :class="{ active: showSubtitles }">
          <Icon :icon="showSubtitles ? 'mingcute:subtitle-fill' : 'mingcute:subtitle-line'" width="20" height="20" />
        </div>
      </div>

      <!-- 中间头像组件 -->
      <ChatAvatar
        :caller-name="callerName"
        :caller-avatar="callerAvatar"
        :is-speaking="isSpeaking"
      />

      <!-- 通话控制按钮 - 使用独立组件 -->
      <ChatCallControls 
        @microphone-toggle="handleMicrophoneToggle"
        @speaker-toggle="handleSpeakerToggle"
        @camera-toggle="handleCameraToggle"
        @call-end="handleCallEnd"
      />
      
      <!-- 声波和网络质量指示器 - 相邻放置 -->
      <!-- <div class="wave-quality-container">
        <ChatWave :is-speaking="isSpeaking" /> 
      </div> -->
      
      <!-- 字幕组件 -->
      <ChatSubtitles
        :show-subtitles="showSubtitles"
        :conversation-texts="conversationTexts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'
import ChatSubtitles from '../chat-subtitles/chat-subtitles.vue'
import ChatBackground from '../chat-background/chat-background.vue'
import ChatAvatar from '../chat-avatar/chat-avatar.vue'
import ChatCallControls from '../chat-call-controls/chat-call-controls.vue' 
import { useChatStore } from '@/stores/modules/chat'
import { MessageHandlerType } from '@/services/message/types'

interface Props {
  conversationId: string
}

const emit = defineEmits<{
  'mode-change': [mode: 'text' | 'voice']
}>()

const props = defineProps<Props>()

// Chat store
const chatStore = useChatStore()

// 通话状态
const callStatus = ref<'connecting' | 'connected' | 'ended'>('connecting')
const isMicrophoneOn = ref(true)
const isSpeakerOn = ref(true)
const isCameraOn = ref(false)
const callStartTime = ref<Date | null>(null)
const callDuration = ref('00:00')

// 使用 chatStore 的状态
const isSpeaking = computed(() => chatStore.currentHandlerType === MessageHandlerType.IOT && chatStore.isHandlerConnected)
const handlerConnected = computed(() => chatStore.isHandlerConnected)

// 字幕功能
const showSubtitles = ref(false)
const conversationTexts = ref([
  { speaker: 'AI助手', text: '您好！我是AI助手，很高兴为您服务。', time: '10:00' },
  { speaker: '用户', text: '你好，我想咨询一些关于产品的问题。', time: '10:02' },
  { speaker: 'AI助手', text: '当然可以，请告诉我您想了解什么？', time: '10:03' },
  { speaker: '用户', text: '这个产品的功能有哪些特点？', time: '10:05' },
  { speaker: 'AI助手', text: '我们的产品具有智能对话、语音识别、多语言支持等先进功能。', time: '10:06' }
])
const currentSubtitle = ref('')
const subtitleIndex = ref(0)

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



// 方法
const toggleSubtitles = () => {
  showSubtitles.value = !showSubtitles.value
  showToast(showSubtitles.value ? '字幕已开启' : '字幕已关闭')
}

// 通话控制事件处理
const handleMicrophoneToggle = async (isOn: boolean) => {
  isMicrophoneOn.value = isOn
  if (isOn) {
    try {
      // 确保使用IoT处理器类型
      if (chatStore.currentHandlerType !== MessageHandlerType.IOT) {
        await chatStore.switchHandlerType(MessageHandlerType.IOT)
      }
      
      chatStore.startVoiceListening()
      showToast('麦克风已开启')
    } catch (error) {
      console.error('开启麦克风失败:', error)
      showToast('开启麦克风失败')
    }
  } else {
    try {
      chatStore.stopVoiceListening()
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
  try {
    chatStore.stopVoiceListening()
    showToast('通话已结束')
  } catch (error) {
    console.error('结束通话失败:', error)
    showToast('结束通话失败')
  }
  
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

// 通话计时器
let durationInterval: ReturnType<typeof setInterval>

const updateCallDuration = () => {
  if (callStartTime.value && callStatus.value === 'connected') {
    const now = new Date()
    const diff = Math.floor((now.getTime() - callStartTime.value.getTime()) / 1000)
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0')
    const seconds = (diff % 60).toString().padStart(2, '0')
    callDuration.value = `${minutes}:${seconds}`
  }
}

// 监听连接状态变化
watch(handlerConnected, (connected) => {
  if (connected && callStatus.value === 'connecting') {
    callStatus.value = 'connected'
    callStartTime.value = new Date()
    showToast('语音通话已连接')
  } else if (!connected && callStatus.value === 'connected') {
    callStatus.value = 'connecting'
    showToast('语音连接断开，正在重连...')
  }
})

onMounted(async () => {
  // 初始化语音模式
  try {
    // 切换到IoT处理器类型（语音模式）
    await chatStore.switchHandlerType(MessageHandlerType.IOT)
    
    // 如果已经连接，直接进入通话状态
    if (chatStore.isHandlerConnected) {
      callStatus.value = 'connected'
      callStartTime.value = new Date()
      showToast('语音通话已连接')
    } else {
      showToast('语音连接已初始化，等待连接...')
    }
  } catch (error) {
    console.error('语音连接初始化失败:', error)
    showToast('语音连接初始化失败，请检查网络连接')
  }
  
  // 启动通话计时器
  durationInterval = setInterval(updateCallDuration, 1000)
  
  onUnmounted(() => {
    clearInterval(durationInterval)
    // 停止语音监听
    chatStore.stopVoiceListening()
  })
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
    padding: 40px 20px 120px; /* 增加底部内边距为控制按钮留空间 */
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
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




  }
}
</style>