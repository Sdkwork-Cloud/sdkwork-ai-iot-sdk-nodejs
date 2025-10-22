<template>
  <div class="chat-input">
    <!-- 输入区域 -->
    <div class="input-area flex flex-row items-center">
      <!-- 左侧语音按钮 -->
      <div class="input-left ">
        <button v-if="enableVoice" class="tool-button" @click="toggleVoiceInput">
          <Icon v-if="isVoiceInput" icon="mdi:microphone" width="18" height="18" class="voice-active-icon" />
          <Icon v-else icon="mdi:microphone-outline" width="18" height="18" class="voice-icon" />
        </button>
      </div>

      <!-- 主输入区域 -->
      <div class="input-main">
        <!-- 文本输入模式 -->
        <ChatInputTextArea
          v-if="!isVoiceInput"
          v-model="inputText"
          :placeholder="placeholder"
          :max-length="maxLength"
          :enable-emoji="enableEmoji"
          @text-change="handleTextChange"
          @keydown="handleKeyDown"
          @focus="$emit('input-focus')"
          @blur="$emit('input-blur')"
          @toggle-emoji-panel="toggleEmojiPanel"
        />

        <!-- 语音输入模式 -->
        <ChatInputVoice
          v-else
          @start-recording="startVoiceRecording"
          @stop-recording="stopVoiceRecording"
        />
      </div>

      <!-- 右侧工具栏 -->
      <div class="input-right">
        <!-- 工具按钮 -->
        <button class="tool-button" :class="{ active: showToolPanel }" @click="toggleToolPanel">
          <Icon icon="mdi:plus" width="18" height="18" class="tool-icon" />
        </button>

        <!-- 发送按钮 - 仅在非语音输入模式下显示 -->
        <ChatInputSendButton
          v-if="!isVoiceInput"
          :can-send="canSend"
          @send="handleSend"
        />
      </div>
    </div>

    <!-- 底部面板区域 -->
    <div class="bottom-panels">
      <!-- 工具面板 -->
      <div v-if="showToolPanel" class="tool-panel">
        <ChatInputToolPanel
          @select-tool="handleToolSelect"
          @upload-file="handleFileUpload"
          @take-photo="handleTakePhoto"
          @record-video="handleRecordVideo"
        />
      </div>

      <!-- 表情面板 -->
      <ChatInputEmojiPanel
        v-if="showEmojiPanel && enableEmoji"
        @select-emoji="insertEmoji"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatMessageVO } from '@/services'
import { MessageType } from 'sdkwork-sdk-api-typescript'
import { useChatStore } from '@/stores/modules/chat'
import { useAuthStore } from '@/stores/modules/auth'

import ChatInputToolPanel from './chat-input-tool-panel/chat-input-tool-panel.vue'
import ChatInputTextArea from './components/chat-input-text-area.vue'
import ChatInputVoice from './components/chat-input-voice.vue'
import ChatInputSendButton from './components/chat-input-send-button.vue'
import ChatInputEmojiPanel from './components/chat-input-emoji-panel.vue'

interface Props {
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  enableVoice?: boolean
  enableEmoji?: boolean
  enableFileUpload?: boolean
  enableCamera?: boolean
  currentUserId?: string
  allowedFileTypes?: string[]
  allowMultipleFiles?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入消息...',
  maxLength: 1000,
  disabled: false,
  enableVoice: true,
  enableEmoji: true,
  enableFileUpload: true,
  enableCamera: true,
  allowedFileTypes: () => ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
  allowMultipleFiles: false
})

interface Emits {
  'send-message': [message: Omit<ChatMessageVO, 'id' | 'status' | 'timestamp'>]
  'send-voice': [audioBlob: Blob, duration: number]
  'send-file': [file: File]
  'send-image': [imageFile: File]
  'send-video': [videoFile: File]
  'input-focus': []
  'input-blur': []
  'text-change': [text: string]
}

const emit = defineEmits<Emits>()

// 使用stores
const chatStore = useChatStore()
const authStore = useAuthStore()

// 响应式数据
const inputText = ref('')
const showToolPanel = ref(false)
const showEmojiPanel = ref(false)
const isVoiceInput = ref(false)
const isRecording = ref(false)
const recordingStartTime = ref(0)

// 计算属性
const canSend = computed(() => {
  return inputText.value.trim().length > 0 || isRecording.value
})

// 方法
const handleTextChange = (text: string) => {
  inputText.value = text
  emit('text-change', text)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

const toggleToolPanel = () => {
  showToolPanel.value = !showToolPanel.value
  showEmojiPanel.value = false
}

const toggleVoiceInput = () => {
  isVoiceInput.value = !isVoiceInput.value
  showToolPanel.value = false
  showEmojiPanel.value = false
}

const toggleEmojiPanel = () => {
  showEmojiPanel.value = !showEmojiPanel.value
  showToolPanel.value = false
}

const insertEmoji = (emoji: string) => {
  inputText.value += emoji
  emit('text-change', inputText.value)
}

const handleSend = async () => {
  if (!canSend.value) return

  const trimmedText = inputText.value.trim()
  if (trimmedText) {
    try {
      // 使用chat store发送消息
      await chatStore.sendMessage(trimmedText)
      
      emit('send-message', {
        senderId: authStore.currentUser?.id || '',
        receiverId: '', // 应该从上下文获取
        content: trimmedText,
        type: MessageType.TEXT
      } as any)
      inputText.value = ''
      emit('text-change', '')
    } catch (error) {
      console.error('发送消息失败:', error)
      // 可以添加错误处理逻辑，如显示错误提示
    }
  }
}

const startVoiceRecording = () => {
  isRecording.value = true
  recordingStartTime.value = Date.now()
  // 这里应该开始实际的录音逻辑
}

const stopVoiceRecording = (audioBlob: Blob, duration: number) => {
  if (!isRecording.value) return
  
  isRecording.value = false
  
  // 创建语音消息
  emit('send-message', {
    senderId: authStore.currentUser?.id || '',
    receiverId: '', // 应该从上下文获取
    content: '', // 语音消息内容为空
    type: MessageType.AUDIO,
    attachment: {
      type: 'audio/wav',
      url: URL.createObjectURL(audioBlob),
      duration: duration,
      size: audioBlob.size
    }
  } as any)
}

const handleToolSelect = (tool: string) => {
  console.log('选择工具:', tool)
  // 处理工具选择
}

const handleFileUpload = (file: File) => {
  emit('send-file', file)
}

const handleTakePhoto = () => {
  // 处理拍照
  console.log('拍照')
}

const handleRecordVideo = () => {
  // 处理录制视频
  console.log('录制视频')
}
</script>

<style scoped>
.chat-input {
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
  flex-shrink: 0; 
}

.input-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tool-button:hover {
  background-color: #e9ecef;
  transform: scale(1.05);
}

.tool-icon, .voice-icon, .voice-active-icon, .emoji-icon {
  font-size: 18px;
}

.voice-active-icon {
  color: #ff4444;
}

.emoji-icon {
  transition: transform 0.2s ease;
}

.tool-button.active .emoji-icon {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.bottom-panels {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.tool-panel {
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 0;
  height: auto; /* 自动高度，确保所有内容可见 */
  overflow: visible; /* 允许内容正常显示 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  animation: slideUp 0.3s ease;
}

.tool-button.active {
  background-color: #007bff;
  color: white;
}

.tool-button.active .tool-icon,
.tool-button.active .emoji-icon {
  filter: brightness(0) invert(1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .input-area {
    padding: 8px;
  }
  
  .tool-button {
    width: 36px;
    height: 36px;
  }
  
  .tool-panel {
    height: auto; /* 移动端也使用自动高度 */
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .chat-input {
    background-color: #2d2d2d;
    border-top-color: #404040;
  }
  
  .tool-button {
    background-color: #3a3a3a;
  }
  
  .tool-button:hover {
    background-color: #4a4a4a;
  }
  
  .tool-panel {
    background-color: #2d2d2d;
    border-top-color: #404040;
  }
}
</style>