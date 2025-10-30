<template>
  <div class="chat-music-generator"> 
    <!-- 消息列表区域 - 包含输入框 -->
    <SdkworkChatMessageList
      ref="messageListRef"
      :messages="chatMessages"
      :style-options="styleOptions"
      :input-box-height="inputBoxHeight"
      @regenerate="handleRegenerate"
      @download="handleDownload"
    > 
    </SdkworkChatMessageList>
    <div 
          class="input-box-wrapper" 
          ref="inputBoxWrapperRef"
        >
          <SdkworkChatInputBox
            ref="inputBoxRef"
            v-model="inputValue"
            :loading="isGenerating"
            :style-options="styleOptions"
            @send="handleSend"
            @style-change="handleStyleChange"
            @add-click="handleAddClick"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
          />
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useElementSize } from '@vueuse/core'
import SdkworkChatInputBox from '@/components/sdkwork-chat-input-box/sdkwork-chat-input-box.vue'
import SdkworkChatMessageList from '@/components/sdkwork-chat-message-list/sdkwork-chat-message-list.vue'

// 响应式数据
const inputValue = ref({
  prompt: '',
  style: 'pop'
})
const userPrompt = ref('')
const isGenerating = ref(false)
const generatedMusic = ref('')
const generationProgress = ref(0)
const generationStatus = ref('')
const chatMessages = ref<any[]>([])
const isKeyboardOpen = ref(false)
const keyboardHeight = ref(0)
const safeAreaBottom = ref(0)

// 组件引用
const messageListRef = ref<InstanceType<typeof SdkworkChatMessageList>>()
const inputBoxRef = ref<InstanceType<typeof SdkworkChatInputBox>>()

// 输入框高度测量
const inputBoxWrapperRef = ref<HTMLDivElement>()
const { height: measuredInputBoxHeight } = useElementSize(inputBoxWrapperRef)

// 导航栏高度（根据实际情况调整）
const navbarHeight = ref(46)

// 计算输入框高度（传递给消息列表组件）
const inputBoxHeight = computed(() => {
  return inputBoxWrapperRef.value?.offsetHeight || 0
})
// 配置选项
const styleOptions = [
  { label: '流行', value: 'pop', icon: '🎤' },
  { label: '摇滚', value: 'rock', icon: '🎸' },
  { label: '电子', value: 'electronic', icon: '🎧' },
  { label: '古典', value: 'classical', icon: '🎻' },
  { label: '爵士', value: 'jazz', icon: '🎷' },
  { label: '民谣', value: 'folk', icon: '🎶' },
  { label: '嘻哈', value: 'hiphop', icon: '🎤' },
  { label: '氛围', value: 'ambient', icon: '🌌' },
  { label: '电影配乐', value: 'cinematic', icon: '🎬' },
  { label: '游戏音乐', value: 'game', icon: '🎮' }
]

// 计算属性
const canGenerate = computed(() => inputValue.value.prompt.trim().length > 0)

const selectedStyleLabel = computed(() => {
  const style = styleOptions.find(s => s.value === inputValue.value.style)
  return style?.label || '流行'
})

const musicTitle = computed(() => {
  if (!userPrompt.value) return '未命名音乐'
  return userPrompt.value.length > 15 ? userPrompt.value.substring(0, 15) + '...' : userPrompt.value
})

// 方法定义
const handleStyleChange = (style: string) => {
  inputValue.value.style = style
}

const handleAddClick = () => {
  // 可以在这里实现附件添加功能
  console.log('Add button clicked')
}

const handleSend = (value: { prompt: string; style: string }) => {
  if (!canGenerate.value || isGenerating.value) return
  
  // 添加用户消息到聊天记录
  addUserMessage(value.prompt, value.style)
  userPrompt.value = value.prompt
  inputValue.value.prompt = ''
  generatedMusic.value = ''
  
  generateMusic()
}

// 添加用户消息
const addUserMessage = (prompt: string, style: string) => {
  const userMessage = {
    id: Date.now(),
    type: 'user',
    text: prompt,
    avatar: '👤',
    style: style,
    timestamp: Date.now()
  }
  
  chatMessages.value.push(userMessage)
  
  // 滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
}

// 添加AI消息
const addAIMessage = (musicUrl: string, title: string, style: string) => {
  const aiMessage = {
    id: Date.now() + 1,
    type: 'ai',
    text: '为你生成了一首音乐',
    avatar: '🎵',
    music: {
      title: title,
      url: musicUrl,
      style: style
    },
    timestamp: Date.now()
  }
  
  chatMessages.value.push(aiMessage)
  
  // 滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
}

// 添加生成进度消息
const addGeneratingMessage = (status: string, progress: number) => {
  // 移除之前的生成消息
  chatMessages.value = chatMessages.value.filter(msg => msg.type !== 'generating')
  
  const generatingMessage = {
    id: 'generating',
    type: 'generating',
    text: '',
    avatar: '🤖',
    status: status,
    progress: progress,
    timestamp: Date.now()
  }
  
  chatMessages.value.push(generatingMessage)
  
  // 滚动到底部
  nextTick(() => {
    messageListRef.value?.scrollToBottom()
  })
}

// 输入框焦点事件处理
const handleInputFocus = () => {
  // 更新键盘状态
  isKeyboardOpen.value = true
  // 更新消息列表的键盘状态
  if (inputBoxRef.value && messageListRef.value) {
    // messageListRef.value.updateKeyboardState(
    //   true,
    //   inputBoxRef.value.keyboardHeight,
    //   inputBoxRef.value.safeAreaBottom
    // )
  }
}

// 输入框失去焦点事件处理
const handleInputBlur = () => {
  // 更新键盘状态
  isKeyboardOpen.value = false
  // 更新消息列表的键盘状态
  if (inputBoxRef.value && messageListRef.value) {
    // messageListRef.value.updateKeyboardState(
    //   false,
    //   inputBoxRef.value.keyboardHeight,
    //   inputBoxRef.value.safeAreaBottom
    // )
  }
}

const generateMusic = async () => {
  if (!canGenerate.value) return
  
  isGenerating.value = true
  generationProgress.value = 0
  
  // 模拟生成过程
  const statusMessages = [
    '正在分析音乐描述...',
    '创作旋律和和弦进行...',
    '编排乐器声部...',
    '混音和母带处理...',
    '导出最终音频...'
  ]
  
  let currentStatus = 0
  
  const interval = setInterval(() => {
    // 更新状态消息
    if (generationProgress.value >= currentStatus * 25) {
      addGeneratingMessage(statusMessages[currentStatus], generationProgress.value)
      currentStatus++
    }
    
    generationProgress.value += 2 + Math.random() * 3
    
    if (generationProgress.value >= 100) {
      generationProgress.value = 100
      addGeneratingMessage('音乐生成完成！', generationProgress.value)
      clearInterval(interval)
      
      // 模拟生成完成
      setTimeout(() => {
        // 生成示例音频URL
        const audioUrls = {
          pop: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          rock: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          electronic: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          classical: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          jazz: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          folk: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          hiphop: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          ambient: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          cinematic: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          game: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
        }
        
        generatedMusic.value = audioUrls[inputValue.value.style as keyof typeof audioUrls] || audioUrls.pop
        
        // 添加AI消息
        addAIMessage(generatedMusic.value, musicTitle.value, inputValue.value.style)
        
        // 移除生成消息
        chatMessages.value = chatMessages.value.filter(msg => msg.type !== 'generating')
        
        isGenerating.value = false
      }, 800)
    }
  }, 400)
}

const handleDownload = (message: any) => {
  if (message.music?.url) {
    const link = document.createElement('a')
    link.href = message.music.url
    link.download = `generated-music-${Date.now()}.mp3`
    link.click()
  }
}

const handleRegenerate = (message: any) => {
  // 使用消息中的信息重新生成
  if (message.type === 'user') {
    inputValue.value.prompt = message.text
    inputValue.value.style = message.style || 'pop'
    
    // 触发发送
    nextTick(() => {
      handleSend(inputValue.value)
    })
  }
}

// 初始化聊天消息
const initializeChatMessages = () => {
  chatMessages.value = [
    {
      id: 'system',
      type: 'system',
      text: '你好！我是AI音乐助手，请输入音乐描述，我将为你生成专属音乐。',
      avatar: '🤖',
      timestamp: Date.now()
    }
  ]
}

// 生命周期钩子
onMounted(() => {
  initializeChatMessages()
})

// 监听键盘状态变化，实时更新消息列表
const updateKeyboardState = () => {
  if (inputBoxRef.value && messageListRef.value) {
    // 更新键盘状态
    isKeyboardOpen.value = inputBoxRef.value.isKeyboardOpen
    keyboardHeight.value = inputBoxRef.value.keyboardHeight
    safeAreaBottom.value = inputBoxRef.value.safeAreaBottom
    
    // 更新消息列表的键盘状态
    // messageListRef.value.updateKeyboardState(
    //   isKeyboardOpen.value,
    //   keyboardHeight.value,
    //   safeAreaBottom.value
    // )
  }
}

// 使用更高效的键盘状态监听方式
const setupKeyboardListener = () => {
  // 监听窗口大小变化（用于键盘检测）
  window.addEventListener('resize', updateKeyboardState)
  
  // 监听视觉视口变化（移动端键盘检测）
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateKeyboardState)
  }
}

// 清理监听器
const cleanupKeyboardListener = () => {
  window.removeEventListener('resize', updateKeyboardState)
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', updateKeyboardState)
  }
}

onMounted(() => {
  initializeChatMessages()
  setupKeyboardListener()
})

onUnmounted(() => {
  cleanupKeyboardListener()
})
</script>

<style scoped>
.chat-music-generator {
  height: calc(100dvh - 46px); /* 100vh减去导航栏高度46px */
  background: #000000;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 消息列表容器 - 使用flex自动填充剩余空间，支持内部滚动 */
.message-list-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键：允许flex子元素收缩 */
}

/* 输入框包装器 - 固定在底部 */
.input-box-wrapper {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: #000000;
  flex-shrink: 0; /* 防止输入框被压缩 */
  border-top: 1px solid #1a1a1a;
}

/* 头部样式 */
.header {
  background: #000000;
  border-bottom: 1px solid #1a1a1a;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-icon {
  font-size: 24px;
  background: linear-gradient(135deg, #0099ff 0%, #0066ff 100%);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-info {
  flex: 1;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.app-status {
  font-size: 12px;
  color: #0099ff;
  margin-top: 2px;
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.system-message {
  align-self: center;
  max-width: 90%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.system-message .message-avatar {
  background: #0099ff;
}

.user-message .message-avatar {
  background: #666;
}

.ai-message .message-avatar {
  background: #00d4ff;
}

.message-content {
  flex: 1;
}

.message-text {
  background: #1a1a1a;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  color: #ffffff;
}

.system-message .message-text {
  background: #1a1a1a;
  border: 1px solid #333;
}

.user-message .message-text {
  background: #0099ff;
  color: #ffffff;
}

.ai-message .message-text {
  background: #1a1a1a;
  border: 1px solid #333;
}

.message-meta {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.music-style-tag {
  background: rgba(0, 153, 255, 0.2);
  color: #0099ff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 音乐卡片 */
.music-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 16px;
  max-width: 300px;
}

.music-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.music-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.music-style {
  background: rgba(0, 153, 255, 0.2);
  color: #0099ff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.audio-player {
  margin-bottom: 12px;
}

.audio-element {
  width: 100%;
  border-radius: 8px;
  background: #000000;
}

.music-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  background: #333;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:active {
  background: #444;
  transform: scale(0.98);
}

/* 生成指示器 */
.generating-indicator {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 16px;
  max-width: 250px;
}

.generating-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 12px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #0099ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0099ff 0%, #00d4ff 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-percent {
  text-align: center;
  font-size: 12px;
  color: #888;
}

/* 底部输入区域 */
.input-area {
  background: #000000;
  border-top: 1px solid #1a1a1a;
  padding: 12px 16px;
  position: sticky;
  bottom: 0;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 100%;
}

.add-btn {
  background: #333;
  border: none;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.add-btn:active {
  background: #444;
  transform: scale(0.95);
}

.add-icon {
  font-size: 20px;
  color: #ffffff;
  font-weight: 300;
}

.input-wrapper {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-height: 40px;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 16px;
  resize: none;
  max-height: 120px;
  min-height: 24px;
  line-height: 1.4;
}

.chat-input::placeholder {
  color: #666;
}

.input-actions {
  margin-left: 8px;
}

.style-btn {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.style-btn:active {
  background: #333;
}

.style-icon {
  font-size: 18px;
}

.send-btn {
  background: #0099ff;
  border: none;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-btn:not(.disabled):active {
  background: #0088ee;
  transform: scale(0.95);
}

.send-btn.disabled {
  background: #333;
  cursor: not-allowed;
  opacity: 0.5;
}

.send-icon {
  font-size: 18px;
  color: #ffffff;
  font-weight: 300;
}

.loading-icon {
  font-size: 16px;
  color: #ffffff;
}

/* 风格选择弹窗 */
.style-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.picker-content {
  background: #000000;
  border-top: 1px solid #1a1a1a;
  border-radius: 20px 20px 0 0;
  width: 100%;
  max-height: 70vh;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #1a1a1a;
}

.picker-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.close-btn {
  background: #333;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
}

.close-btn:active {
  background: #444;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.style-item {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.style-item:active {
  background: #252525;
  transform: scale(0.98);
}

.style-item.selected {
  background: rgba(0, 153, 255, 0.2);
  border-color: #0099ff;
}

.style-emoji {
  font-size: 24px;
}

.style-name {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

/* 响应式优化 */
@media (max-width: 480px) {
  .header {
    padding: 12px;
  }
  
  .chat-messages {
    padding: 12px;
  }
  
  .input-area {
    padding: 12px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .music-card {
    max-width: 100%;
  }
}
</style>
