<template>
  <div class="chat-input-text-area">
    <textarea
      ref="textInputRef"
      v-model="inputText"
      :placeholder="placeholder"
      :maxlength="maxLength"
      class="text-input"
      @input="handleInput"
      @keydown="handleKeyDown"
      @keyup="handleKeyUp"
      @keypress="handleKeyPress"
      @focus="handleFocus"
      @blur="handleBlur"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @scroll="handleScroll"
      @paste="handlePaste"
      @cut="handleCut"
      @copy="handleCopy"
    />
    <div class="input-actions">
      <button v-if="enableEmoji" class="emoji-button" @click="$emit('toggle-emoji-panel')">
        <Icon icon="mdi:emoticon-happy-outline" width="18" height="18" class="emoji-icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  placeholder?: string
  maxLength?: number
  enableEmoji?: boolean
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入消息...',
  maxLength: 1000,
  enableEmoji: true,
  modelValue: ''
})

interface Emits {
  'update:modelValue': [value: string]
  'text-change': [text: string]
  'keydown': [event: KeyboardEvent]
  'keyup': [event: KeyboardEvent]
  'keypress': [event: KeyboardEvent]
  'focus': []
  'blur': []
  'toggle-emoji-panel': []
  
  // 新增事件
  'input-event': [event: InputEvent]
  'composition-start': [event: CompositionEvent]
  'composition-update': [event: CompositionEvent]
  'composition-end': [event: CompositionEvent]
  'scroll': [event: Event]
  'paste': [event: ClipboardEvent]
  'cut': [event: ClipboardEvent]
  'copy': [event: ClipboardEvent]
  'selection-change': []
}

const emit = defineEmits<Emits>()

const inputText = ref(props.modelValue)
const textInputRef = ref<HTMLTextAreaElement>()

// 监听父组件传递的modelValue变化
watch(() => props.modelValue, (newValue) => {
  inputText.value = newValue
  adjustTextareaHeight()
})

const handleInput = (event: InputEvent) => {
  emit('update:modelValue', inputText.value)
  emit('text-change', inputText.value)
  emit('input-event', event)
  adjustTextareaHeight()
}

const handleKeyDown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleKeyUp = (event: KeyboardEvent) => {
  emit('keyup', event)
}

const handleKeyPress = (event: KeyboardEvent) => {
  emit('keypress', event)
}

const handleFocus = () => {
  emit('focus')
  // 监听选择变化
  document.addEventListener('selectionchange', handleSelectionChange)
}

const handleBlur = () => {
  emit('blur')
  // 移除选择变化监听
  document.removeEventListener('selectionchange', handleSelectionChange)
}

const handleCompositionStart = (event: CompositionEvent) => {
  emit('composition-start', event)
}

const handleCompositionUpdate = (event: CompositionEvent) => {
  emit('composition-update', event)
}

const handleCompositionEnd = (event: CompositionEvent) => {
  emit('composition-end', event)
}

const handleScroll = (event: Event) => {
  emit('scroll', event)
}

const handlePaste = (event: ClipboardEvent) => {
  emit('paste', event)
}

const handleCut = (event: ClipboardEvent) => {
  emit('cut', event)
}

const handleCopy = (event: ClipboardEvent) => {
  emit('copy', event)
}

const handleSelectionChange = () => {
  const textarea = textInputRef.value
  if (textarea && document.activeElement === textarea) {
    emit('selection-change')
  }
}

const adjustTextareaHeight = () => {
  nextTick(() => {
    const textarea = textInputRef.value
    if (textarea) {
      // 重置高度为单行高度
      textarea.style.height = '24px'
      
      // 只有当内容超过单行时才调整高度
      if (textarea.scrollHeight > 24) {
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
      }
    }
  })
}

// 暴露方法给父组件
defineExpose({
  focus: () => textInputRef.value?.focus(),
  clear: () => {
    inputText.value = ''
    emit('update:modelValue', '')
    adjustTextareaHeight()
  }
})
</script>

<style scoped>
.chat-input-text-area {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 24px;
  min-height: 48px;
  padding: 12px 16px;
}

.text-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  resize: none;
  font-size: 16px;
  line-height: 1.5;
  max-height: 120px;
  min-height: 24px;
  height: 24px;
  font-family: inherit;
  margin: 0;
  padding: 0;
  overflow: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  align-self: center;
  display: flex;
  align-items: center;
}

.text-input::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.text-input::placeholder {
  color: #999;
}

.input-actions {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.emoji-button {
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-button:hover {
  background-color: #e9ecef;
}

@media (max-width: 768px) {
  .chat-input-text-area {
    padding: 0px 10px;
  }
}

@media (prefers-color-scheme: dark) {
  .chat-input-text-area {
    background-color: #3a3a3a;
  }
  
  .text-input {
    color: #fff;
  }
  
  .text-input::placeholder {
    color: #888;
  }
  
  .emoji-button:hover {
    background-color: #4a4a4a;
  }
}
</style>