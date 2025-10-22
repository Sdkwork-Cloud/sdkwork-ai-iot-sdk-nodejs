<template>
  <div class="chat-input-container">
    <!-- 主输入区域 -->
    <div class="input-area">
      <!-- 语音/键盘切换按钮 -->
      <VoiceToggleButton 
        :is-voice-mode="isVoiceMode" 
        @toggle="toggleVoiceMode"
      />
      
      <!-- 文本输入区域 -->
      <div v-if="!isVoiceMode" class="text-input-wrapper">
        <MainInput
          v-model="inputText"
          placeholder="输入消息..."
          :min-rows="1"
          :max-rows="4"
          @input="adjustTextareaHeight"
          @enter="handleSend"
          ref="mainInputRef"
        />
        
        <!-- 表情按钮 -->
        <EmojiButton @click="toggleEmojiPicker" />
        
        <!-- 功能扩展按钮 -->
        <button 
          class="function-button"
          @click="toggleFunctionPanel"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
      </div>
      
      <!-- 语音输入区域 -->
      <VoiceInputArea 
        v-else
        @start-recording="startRecording"
        @stop-recording="stopRecording"
      />
      
      <!-- 发送按钮 -->
      <SendButton 
        :disabled="!canSend"
        @click="handleSend"
      />
    </div>
    
    <!-- 表情选择器 -->
    <EmojiPicker
      :visible="showEmojiPicker"
      @select-emoji="handleEmojiSelect"
      @close="closeEmojiPicker"
    />
    
    <!-- 功能面板 -->
    <FunctionPanel
      :visible="showFunctionPanel"
      @select-function="handleFunctionSelect"
      @close="closeFunctionPanel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import VoiceToggleButton from './components/VoiceToggleButton.vue'
import EmojiButton from './components/EmojiButton.vue'
import SendButton from './components/SendButton.vue'
import VoiceInputArea from './components/VoiceInputArea.vue'
import MainInput from './components/MainInput.vue'
import EmojiPicker from './components/EmojiPicker.vue'
import FunctionPanel from './components/FunctionPanel.vue'

interface Emits {
  (e: 'send', message: string): void
  (e: 'image-upload'): void
  (e: 'video-upload'): void
  (e: 'file-upload'): void
  (e: 'voice-input-start'): void
  (e: 'voice-input-stop', audioBlob?: Blob): void
}

interface Props {
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入消息...',
  disabled: false
})

const emit = defineEmits<Emits>()

const inputText = ref('')
const isVoiceMode = ref(false)
const showEmojiPicker = ref(false)
const showFunctionPanel = ref(false)
const isFocused = ref(false)
const mainInputRef = ref<any>(null)

const canSend = computed(() => {
  return inputText.value.trim().length > 0 && !props.disabled
})

// 自动调整文本域高度
const adjustTextareaHeight = () => {
  nextTick(() => {
    if (mainInputRef.value) {
      mainInputRef.value.style.height = 'auto'
      mainInputRef.value.style.height = Math.min(mainInputRef.value.scrollHeight, 120) + 'px'
    }
  })
}

// 切换语音模式
const toggleVoiceMode = () => {
  isVoiceMode.value = !isVoiceMode.value
  if (isVoiceMode.value) {
    showEmojiPicker.value = false
    showFunctionPanel.value = false
  }
}

// 发送消息
const handleSend = () => {
  if (!canSend.value) return
  
  const message = inputText.value.trim()
  emit('send', message)
  inputText.value = ''
  adjustTextareaHeight()
}

// 回车键处理
const handleEnter = (event: KeyboardEvent) => {
  if (event.shiftKey) {
    // Shift+Enter 换行
    inputText.value += '\n'
    adjustTextareaHeight()
  } else {
    // Enter 发送
    handleSend()
  }
}

// 开始录音
const startRecording = () => {
  emit('voice-input-start')
}

// 停止录音
const stopRecording = (audioBlob?: Blob) => {
  emit('voice-input-stop', audioBlob)
}

// 切换表情选择器
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
  if (showEmojiPicker.value) {
    closeFunctionPanel()
  }
}

const closeEmojiPicker = () => {
  showEmojiPicker.value = false
}

const toggleFunctionPanel = () => {
  showFunctionPanel.value = !showFunctionPanel.value
  if (showFunctionPanel.value) {
    closeEmojiPicker()
  }
}

const closeFunctionPanel = () => {
  showFunctionPanel.value = false
}

const handleFunctionSelect = (functionId: string) => {
  console.log('选择功能:', functionId)
  emit('select-function', functionId)
  closeFunctionPanel()
}

// 选择表情
const handleEmojiSelect = (emoji: string) => {
  inputText.value += emoji
  adjustTextareaHeight()
  showEmojiPicker.value = false
}

// 处理图片上传
const handleImageUpload = () => {
  emit('image-upload')
  showFunctionPanel.value = false
}

// 处理视频上传
const handleVideoUpload = () => {
  emit('video-upload')
  showFunctionPanel.value = false
}

// 处理文件上传
const handleFileUpload = () => {
  emit('file-upload')
  showFunctionPanel.value = false
}

// 焦点处理
const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

// 监听输入文本变化
watch(inputText, adjustTextareaHeight)
</script>

<style scoped lang="scss">
.chat-input-container {
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  position: relative;
  
  .input-area {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    padding: 16px;
    background: #ffffff;
    
    .text-input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8f8f8;
      border-radius: 24px;
      padding: 8px 16px;
      min-height: 44px;
      
      .function-button {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        transition: all 0.2s ease;
        
        &:hover {
          background: #e0e0e0;
          color: #333;
        }
        
        &:active {
          transform: scale(0.95);
        }
        
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .chat-input-container {
    .input-area {
      padding: 12px;
      gap: 8px;
      
      .text-input-wrapper {
        padding: 6px 12px;
        min-height: 40px;
        border-radius: 20px;
        
        .text-input {
          font-size: 14px;
        }
      }
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .chat-input-container {
    background: #1a1a1a;
    border-top-color: #333;
    
    .input-area {
      .text-input-wrapper {
        background: #2d2d2d;
        
        .text-input {
          color: #ffffff;
          
          &::placeholder {
            color: #666;
          }
        }
      }
    }
  }
}
</style>