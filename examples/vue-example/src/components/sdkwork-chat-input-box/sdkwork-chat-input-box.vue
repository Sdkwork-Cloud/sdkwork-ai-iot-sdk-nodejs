<template>
  <div 
    class="chat-input-box"
    :class="{ 'keyboard-open': isKeyboardOpen, 'focused': isFocused }"
    :style="{ '--keyboard-height': keyboardHeight + 'px' }"
  >
    <!-- 输入框和工具栏整体容器 -->
    <div class="input-container">
      <!-- 输入框区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <textarea
            ref="inputRef"
            v-model="localPrompt"
            class="chat-input"
            :placeholder="placeholder"
            :maxlength="maxLength"
            :rows="minRows"
            :disabled="disabled"
            @input="handleInput"
            @keydown.enter.exact.prevent="handleSend"
            @keydown="handleKeydown"
            @focus="handleFocus"
            @blur="handleBlur" 
          ></textarea>
        </div>
      </div>

      <!-- 底部工具栏 -->
      <div class="bottom-bar">
        <!-- 左侧加号按钮 -->
        <button 
          class="add-btn" 
          @click="handleAddClick"
          :disabled="disabled"
          :title="addButtonTooltip"
        >
          <span class="add-icon">+</span>
        </button>
        
        <!-- 右侧操作区域 -->
        <div class="action-area">
          <!-- 风格选择按钮 -->
          <button 
            class="style-btn" 
            @click="handleStyleClick"
            :disabled="disabled"
            :title="styleButtonTooltip"
          >
            <span class="style-icon">{{ selectedStyleIcon }}</span>
          </button>
          
          <!-- 发送按钮 -->
          <button
            class="send-btn"
            :class="{ 
              'disabled': !canSend || disabled, 
              'loading': loading 
            }"
            @click="handleSend"
            :disabled="!canSend || disabled"
            :title="sendButtonTooltip"
          >
            <span v-if="!loading" class="send-icon">↑</span>
            <span v-else class="loading-icon">⏳</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 风格选择弹窗 -->
    <div 
      v-if="showStylePicker" 
      class="style-picker-modal" 
      @click="handleModalClick"
    >
      <div class="picker-content" @click.stop>
        <div class="picker-header">
          <h3>{{ stylePickerTitle }}</h3>
          <button 
            class="close-btn" 
            @click="closeStylePicker"
            :title="closeButtonTooltip"
          >×</button>
        </div>
        <div class="style-grid">
          <div
            v-for="style in styleOptions"
            :key="style.value"
            class="style-item"
            :class="{ 'selected': modelValue.style === style.value }"
            @click="selectStyle(style.value)"
          >
            <span class="style-emoji">{{ style.icon }}</span>
            <span class="style-name">{{ style.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, type PropType, onMounted, onUnmounted } from 'vue'

// Props 定义
interface StyleOption {
  label: string
  value: string
  icon: string
}

interface InputValue {
  prompt: string
  style: string
}

const props = defineProps({
  // 双向绑定的值
  modelValue: {
    type: Object as PropType<InputValue>,
    required: true,
    default: () => ({
      prompt: '',
      style: 'pop'
    })
  },
  
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false
  },
  
  // 风格选项配置
  styleOptions: {
    type: Array as PropType<StyleOption[]>,
    default: () => [
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
  },
  
  // 输入框配置
  placeholder: {
    type: String,
    default: '描述你想要生成的音乐...'
  },
  
  maxLength: {
    type: Number,
    default: 200
  },
  
  minRows: {
    type: Number,
    default: 1
  },
  
  // 文本配置
  stylePickerTitle: {
    type: String,
    default: '选择音乐风格'
  },
  
  addButtonTooltip: {
    type: String,
    default: '添加附件'
  },
  
  styleButtonTooltip: {
    type: String,
    default: '选择音乐风格'
  },
  
  sendButtonTooltip: {
    type: String,
    default: '发送消息'
  },
  
  closeButtonTooltip: {
    type: String,
    default: '关闭'
  }
})

// Emit 事件定义
const emit = defineEmits<{
  // 更新双向绑定值
  'update:modelValue': [value: InputValue]
  
  // 发送事件
  'send': [value: InputValue]
  
  // 风格选择事件
  'style-change': [style: string]
  
  // 加号按钮点击事件
  'add-click': []
  
  // 输入框事件
  'input': [value: string]
  'focus': []
  'blur': []
  'keydown': [event: KeyboardEvent]
  
  // 弹窗事件
  'style-picker-open': []
  'style-picker-close': []
}>()

// 响应式数据
const inputRef = ref<HTMLTextAreaElement>()
const showStylePicker = ref(false)
const localPrompt = ref(props.modelValue.prompt)
const isKeyboardOpen = ref(false)
const isFocused = ref(false)
const keyboardHeight = ref(0)
const isComposing = ref(false)
const originalViewportHeight = ref(0)
const safeAreaBottom = ref(0)
const windowHeight = ref(0)
const resizeObserver = ref<ResizeObserver>()

// 计算属性
const canSend = computed(() => {
  return localPrompt.value.trim().length > 0 && !props.loading
})

const selectedStyleIcon = computed(() => {
  const style = props.styleOptions.find(s => s.value === props.modelValue.style)
  return style?.icon || '🎵'
})

// 监听器
watch(() => props.modelValue.prompt, (newVal) => {
  if (newVal !== localPrompt.value) {
    localPrompt.value = newVal
  }
})

watch(localPrompt, (newVal) => {
  if (newVal !== props.modelValue.prompt) {
    emit('update:modelValue', {
      ...props.modelValue,
      prompt: newVal
    })
    emit('input', newVal)
  }
  adjustInputHeight()
})

// 监听键盘状态变化
watch(isKeyboardOpen, (isOpen) => {
  if (isOpen) {
    // 键盘打开时，确保输入框可见
    nextTick(() => {
      scrollInputIntoView()
    })
  }
})

// 方法定义
const handleSend = () => {
  if (!canSend.value || props.disabled) return
  
  const value = {
    prompt: localPrompt.value.trim(),
    style: props.modelValue.style
  }
  
  emit('send', value)
}

const handleAddClick = () => {
  if (props.disabled) return
  emit('add-click')
}

const handleStyleClick = () => {
  if (props.disabled) return
  showStylePicker.value = true
  emit('style-picker-open')
}

const selectStyle = (style: string) => {
  if (style !== props.modelValue.style) {
    emit('update:modelValue', {
      ...props.modelValue,
      style
    })
    emit('style-change', style)
  }
  closeStylePicker()
}

const closeStylePicker = () => {
  showStylePicker.value = false
  emit('style-picker-close')
}

const handleModalClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeStylePicker()
  }
}

const handleInput = (event: Event) => {
  // 触发输入事件，让父组件可以监听
  emit('input', localPrompt.value)
  adjustInputHeight()
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
  
  // 处理 Ctrl+Enter 发送
  if (event.ctrlKey && event.key === 'Enter') {
    handleSend()
  }
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
  
  // 移动端键盘检测
  if (isMobileDevice()) {
    detectKeyboardOpen()
  }
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
  
  // 移动端键盘关闭检测
  if (isMobileDevice()) {
    setTimeout(() => {
      detectKeyboardClose()
    }, 100)
  }
}

// 自动调整输入框高度
const adjustInputHeight = () => {
  nextTick(() => {
    if (inputRef.value) {
      // 保存当前滚动位置
      const scrollTop = inputRef.value.scrollTop
      
      // 重置高度并计算新高度
      inputRef.value.style.height = 'auto'
      const newHeight = Math.min(inputRef.value.scrollHeight, 120)
      inputRef.value.style.height = newHeight + 'px'
      
      // 恢复滚动位置
      inputRef.value.scrollTop = scrollTop
    }
  })
}

// 公开方法 - 用于父组件调用
const focusInput = () => {
  inputRef.value?.focus()
}

const clearInput = () => {
  localPrompt.value = ''
}

const setStyle = (style: string) => {
  selectStyle(style)
}

// 移动端键盘检测和安全区域处理
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const detectKeyboardOpen = () => {
  if (!isMobileDevice()) return
  
  const currentViewportHeight = window.visualViewport?.height || window.innerHeight
  const currentWindowHeight = window.innerHeight
  
  // 更精确的键盘检测逻辑
  const heightDifference = currentWindowHeight - currentViewportHeight
  const isSignificantDifference = heightDifference > 100 // 键盘高度通常大于100px
  
  // 如果视口高度明显小于窗口高度，说明键盘已打开
  if (isSignificantDifference && currentViewportHeight < currentWindowHeight * 0.7) {
    isKeyboardOpen.value = true
    keyboardHeight.value = heightDifference
    
    // 保存原始高度用于比较
    if (originalViewportHeight.value === 0) {
      originalViewportHeight.value = currentWindowHeight
    }
  }
}

const detectKeyboardClose = () => {
  if (!isMobileDevice()) return
  
  const currentViewportHeight = window.visualViewport?.height || window.innerHeight
  const currentWindowHeight = window.innerHeight
  
  // 更精确的键盘关闭检测
  const heightDifference = currentWindowHeight - currentViewportHeight
  const isMinimalDifference = heightDifference < 50 // 键盘关闭时差异很小
  
  // 如果视口高度接近原始高度，说明键盘已关闭
  if (isMinimalDifference && Math.abs(currentViewportHeight - originalViewportHeight.value) < 20) {
    isKeyboardOpen.value = false
    keyboardHeight.value = 0
  }
}

// 滚动输入框到可视区域
const scrollInputIntoView = () => {
  if (!inputRef.value || !isMobileDevice()) return
  
  nextTick(() => {
    inputRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    })
  })
}

// 计算安全区域底部距离
const calculateSafeAreaBottom = () => {
  if (typeof window !== 'undefined') {
    // 检测是否支持 env() 函数
    const style = getComputedStyle(document.documentElement)
    const safeAreaBottomValue = style.getPropertyValue('--safe-area-inset-bottom')
    
    if (safeAreaBottomValue) {
      safeAreaBottom.value = parseInt(safeAreaBottomValue) || 0
    } else {
      // 默认安全区域值
      safeAreaBottom.value = isMobileDevice() ? 34 : 0
    }
  }
}

// 监听窗口大小变化
const handleResize = () => {
  windowHeight.value = window.innerHeight
  calculateSafeAreaBottom()
  
  if (isFocused.value && isMobileDevice()) {
    detectKeyboardOpen()
  }
}

// 监听视觉视口变化（移动端键盘检测）
const handleVisualViewportChange = () => {
  if (isMobileDevice() && window.visualViewport) {
    detectKeyboardOpen()
  }
}

// 生命周期钩子
onMounted(() => {
  calculateSafeAreaBottom()
  windowHeight.value = window.innerHeight
  
  // 添加事件监听器
  window.addEventListener('resize', handleResize)
  
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleVisualViewportChange)
  }
  
  // 设置 ResizeObserver 监听输入框容器
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver.value = new ResizeObserver(() => {
      if (isFocused.value && isMobileDevice()) {
        detectKeyboardOpen()
      }
    })
    
    if (inputRef.value) {
      resizeObserver.value.observe(inputRef.value)
    }
  }
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
  
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', handleVisualViewportChange)
  }
  
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
})

// 暴露方法给父组件
defineExpose({
  focusInput,
  clearInput,
  setStyle,
  isKeyboardOpen,
  keyboardHeight,
  safeAreaBottom
})
</script>

<style scoped>
.chat-input-box {
  width: 100%;
  background: #000000;
  border-top: 1px solid #1a1a1a;
  
  /* 移动端优化 */
  position: relative;
  z-index: 100;
  
  /* 安全区域支持 */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* 输入框和工具栏整体容器 */
.input-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 输入框区域 */
.input-area {
  padding: 16px 16px 8px;
}

/* 输入框包装器 */
.input-wrapper {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.2s ease;
  min-height: 52px;
  display: flex;
  align-items: flex-start; /* 修复：改为flex-start确保文本对齐 */
  
  /* 移动端优化 */
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: text;
  user-select: text;
}

.input-wrapper:focus-within {
  border-color: #0099ff;
}

/* 键盘打开时的样式 */
.chat-input-box.keyboard-open .input-wrapper {
  border-color: #0099ff;
  box-shadow: 0 0 0 2px rgba(0, 153, 255, 0.1);
}

.chat-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 16px;
  resize: none;
  max-height: 120px;
  min-height: 24px;
  line-height: 1.4;
  font-family: inherit;
  
  /* 修复：确保文本垂直居中 */
  padding: 0;
  margin: 0;
  
  /* 移动端优化 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  
  /* 防止iOS缩放 */
  font-size: 16px;
  transform: translateZ(0);
}

.chat-input::placeholder {
  color: #666;
}

.chat-input:disabled {
  color: #888;
  cursor: not-allowed;
}

/* 移动端输入优化 */
@media (max-width: 768px) {
  .chat-input {
    /* 防止iOS缩放 */
    font-size: 16px;
    
    /* 优化触摸体验 */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
}

/* 底部工具栏 */
.bottom-bar {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  /* 安全区域支持 */
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
}

/* 按钮基础样式 */
.add-btn, .style-btn, .send-btn {
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
  outline: none;
}

.add-btn {
  background: #333;
}

.add-btn:not(:disabled):active {
  background: #444;
  transform: scale(0.95);
}

.add-btn:disabled {
  background: #1a1a1a;
  cursor: not-allowed;
  opacity: 0.5;
}

.add-icon {
  font-size: 20px;
  color: #ffffff;
  font-weight: 300;
}

/* 右侧操作区域 */
.action-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.style-btn {
  background: transparent;
  padding: 4px;
  border-radius: 6px;
}

.style-btn:not(:disabled):active {
  background: #333;
}

.style-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.style-icon {
  font-size: 18px;
}

/* 发送按钮 */
.send-btn {
  background: #0099ff;
}

.send-btn:not(.disabled):not(:disabled):active {
  background: #0088ee;
  transform: scale(0.95);
}

.send-btn.disabled {
  background: #333;
  cursor: not-allowed;
  opacity: 0.5;
}

.send-btn.loading {
  background: #0066cc;
}

.send-icon {
  font-size: 18px;
  color: #ffffff;
  font-weight: 300;
}

.loading-icon {
  font-size: 16px;
  color: #ffffff;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
  transition: background 0.2s ease;
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
  .input-area {
    padding: 12px;
  }
  
  .style-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    padding: 12px;
  }
  
  .style-item {
    padding: 12px 8px;
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  .send-btn,
  .add-btn,
  .style-btn,
  .style-item {
    transition: none;
  }
  
  .style-picker-modal,
  .picker-content {
    animation: none;
  }
}
</style>