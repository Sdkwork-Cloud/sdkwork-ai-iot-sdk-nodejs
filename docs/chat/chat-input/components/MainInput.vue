<template>
  <div class="main-input">
    <textarea
      ref="textareaRef"
      v-model="inputValue"
      :placeholder="placeholder"
      :rows="minRows"
      :max-rows="maxRows"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      class="input-textarea"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  minRows?: number
  maxRows?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', value: string): void
  (e: 'send'): void
  (e: 'focus'): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '输入消息...',
  minRows: 1,
  maxRows: 4
})

const emit = defineEmits<Emits>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const inputValue = ref(props.modelValue || '')

// 监听外部传入的值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue || ''
    adjustTextareaHeight()
  }
})

// 监听输入值变化
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
  emit('input', newValue)
  adjustTextareaHeight()
})

const handleInput = () => {
  adjustTextareaHeight()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    emit('send')
  }
}

const adjustTextareaHeight = () => {
  nextTick(() => {
    const textarea = textareaRef.value
    if (!textarea) return

    // 重置高度
    textarea.style.height = 'auto'
    
    // 计算内容高度
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
    const paddingTop = parseInt(getComputedStyle(textarea).paddingTop)
    const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom)
    const padding = paddingTop + paddingBottom
    
    const contentHeight = textarea.scrollHeight - padding
    const lines = Math.ceil(contentHeight / lineHeight)
    
    // 限制行数
    const clampedLines = Math.max(props.minRows, Math.min(props.maxRows, lines))
    textarea.rows = clampedLines
  })
}

const focus = () => {
  textareaRef.value?.focus()
}

const clear = () => {
  inputValue.value = ''
  adjustTextareaHeight()
}

// 暴露方法给父组件
defineExpose({
  focus,
  clear
})

onMounted(() => {
  adjustTextareaHeight()
})
</script>

<style scoped lang="scss">
.main-input {
  flex: 1;
  min-width: 0;
  
  .input-textarea {
    width: 100%;
    min-height: 36px;
    max-height: 120px;
    border: none;
    background: transparent;
    resize: none;
    font-size: 14px;
    line-height: 1.4;
    padding: 8px 0;
    outline: none;
    font-family: inherit;
    
    &::placeholder {
      color: #999;
    }
    
    &:focus {
      outline: none;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .main-input {
    .input-textarea {
      font-size: 16px; // 移动端字体放大
      min-height: 40px;
      padding: 10px 0;
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .main-input {
    .input-textarea {
      color: #fff;
      
      &::placeholder {
        color: #888;
      }
    }
  }
}
</style>