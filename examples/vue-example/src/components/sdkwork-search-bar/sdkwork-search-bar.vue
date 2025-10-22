<template>
  <div 
    class="sdkwork-search-bar"
    :class="[
      {
        'sdkwork-search-bar--disabled': disabled,
        'sdkwork-search-bar--readonly': readonly,
        'sdkwork-search-bar--show-action': showAction,
        'sdkwork-search-bar--round': shape === 'round'
      },
      themeClass
    ]"
    :style="{
      background: background
    }"
  >
    <!-- 搜索框左侧插槽 -->
    <div v-if="$slots.left" class="sdkwork-search-bar__left">
      <slot name="left" />
    </div>
    
    <!-- 搜索框主体 -->
    <div class="sdkwork-search-bar__content">
      <!-- 搜索图标 -->
      <div class="sdkwork-search-bar__icon">
        <slot name="left-icon">
          <SdkworkIcon icon="material-symbols:search-rounded" width="16" height="16" />
        </slot>
      </div>
      
      <!-- 输入框 -->
      <div class="sdkwork-search-bar__field">
        <input
          ref="inputRef"
          v-model="currentValue"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :autofocus="autofocus"
          :class="[`sdkwork-search-bar__input--${align}`]"
          class="sdkwork-search-bar__input"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @keypress="handleKeypress"
          @keyup.enter="handleSearch"
          @keyup.esc="handleCancel"
        />
        
        <!-- 清除按钮 -->
        <div 
          v-if="clearable && currentValue && !disabled"
          class="sdkwork-search-bar__clear"
          @mousedown.prevent="handleClear"
          @touchstart.prevent="handleClear"
        >
          <slot name="clear-icon">
            <SdkworkIcon icon="material-symbols:close-rounded" width="16" height="16" />
          </slot>
        </div>
      </div>
    </div>
    
    <!-- 取消按钮 -->
    <div 
      v-if="shouldShowAction"
      class="sdkwork-search-bar__action"
      @click="handleCancel"
    >
      <slot name="action">
        {{ actionText }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import SdkworkIcon from '../sdkwork-icon/sdkwork-icon.vue'

// Props 定义
interface Props {
  /** 输入值 */
  modelValue?: string
  /** 输入框类型 */
  type?: 'text' | 'number' | 'tel' | 'password'
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 最大输入长度 */
  maxlength?: number
  /** 是否自动聚焦 */
  autofocus?: boolean
  /** 是否显示清除按钮 */
  clearable?: boolean
  /** 是否显示取消按钮 */
  showAction?: boolean
  /** 取消按钮文字 */
  actionText?: string
  /** 搜索框形状 */
  shape?: 'square' | 'round'
  /** 背景颜色 */
  background?: string
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 输入框对齐方式 */
  align?: 'left' | 'center'
  /** 是否在输入框为空时隐藏取消按钮 */
  hideActionWhenEmpty?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '搜索',
  disabled: false,
  readonly: false,
  maxlength: undefined,
  autofocus: false,
  clearable: true,
  showAction: false,
  actionText: '取消',
  shape: 'square',
  background: '',
  themeMode: 'auto',
  align: 'left',
  hideActionWhenEmpty: false
})

// Emit 事件定义
const emit = defineEmits<{
  /** 输入框值变化事件 */
  'update:modelValue': [value: string]
  /** 搜索事件 */
  'search': [value: string]
  /** 取消事件 */
  'cancel': []
  /** 输入事件 */
  'input': [value: string]
  /** 聚焦事件 */
  'focus': [event: Event]
  /** 失焦事件 */
  'blur': [event: Event]
  /** 清除事件 */
  'clear': []
  /** 键盘按下事件 */
  'keypress': [event: KeyboardEvent]
}>()

// 插槽定义
defineSlots<{
  /** 左侧插槽 */
  left?: () => any
  /** 左侧图标插槽 */
  'left-icon'?: () => any
  /** 清除图标插槽 */
  'clear-icon'?: () => any
  /** 取消按钮插槽 */
  action?: () => any
}>()

// 响应式数据
const currentValue = ref(props.modelValue)
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// Dark mode support
const isDarkMode = ref(false)

// 检测系统暗黑模式
const detectSystemDarkMode = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// 更新主题
const updateTheme = () => {
  if (props.themeMode === 'dark') {
    isDarkMode.value = true
  } else if (props.themeMode === 'light') {
    isDarkMode.value = false
  } else if (props.themeMode === 'auto') {
    isDarkMode.value = detectSystemDarkMode()
  }
}

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-search-bar--dark' : 'sdkwork-search-bar--light'
})

// 是否显示取消按钮
const shouldShowAction = computed(() => {
  if (props.showAction) {
    // 如果设置了hideActionWhenEmpty且值为空，则隐藏取消按钮
    if (props.hideActionWhenEmpty && !currentValue.value) {
      return false
    }
    return true
  }
  
  // 默认行为：获得焦点时显示取消按钮
  return isFocused.value
})

// 监听主题模式变化
watch(() => props.themeMode, (newMode, oldMode) => {
  updateTheme()
  
  // 当从auto模式切换到明确模式时，移除系统主题监听
  if (oldMode === 'auto' && newMode !== 'auto' && mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
    mediaQuery = null
  }
  
  // 当切换到auto模式时，添加系统主题监听
  if (newMode === 'auto' && oldMode !== 'auto' && typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    handleSystemThemeChange()
  }
})

// 监听系统主题变化
let mediaQuery: MediaQueryList | null = null

// 系统主题变化处理函数
const handleSystemThemeChange = () => {
  if (props.themeMode === 'auto') {
    isDarkMode.value = mediaQuery?.matches || false
  }
}

onMounted(() => {
  // 初始化主题
  updateTheme()
  
  // 监听系统主题变化（仅在自动模式下）
  if (props.themeMode === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // 立即检测当前系统主题
    handleSystemThemeChange()
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }
})

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== currentValue.value) {
    currentValue.value = newValue
  }
})

// 监听内部值变化
watch(currentValue, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
    emit('input', newValue)
  }
})

// 方法定义
const handleFocus = (event: Event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: Event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentValue.value = target.value
}

const handleKeypress = (event: KeyboardEvent) => {
  emit('keypress', event)
}

const handleSearch = () => {
  emit('search', currentValue.value)
}

const handleCancel = () => {
  currentValue.value = ''
  isFocused.value = false
  emit('cancel')
  emit('update:modelValue', '')
}

const handleClear = () => {
  console.log('handleClear called, currentValue before:', currentValue.value)
  console.log('clearable prop:', props.clearable)
  console.log('disabled prop:', props.disabled)
  
  currentValue.value = ''
  console.log('currentValue after clear:', currentValue.value)
  
  emit('clear')
  emit('update:modelValue', '')
  
  // 重新聚焦输入框
  nextTick(() => {
    console.log('nextTick - inputRef exists:', !!inputRef.value)
    inputRef.value?.focus()
  })
}

// 暴露方法
defineExpose({
  /** 聚焦输入框 */
  focus: () => {
    inputRef.value?.focus()
  },
  /** 失焦输入框 */
  blur: () => {
    inputRef.value?.blur()
  },
  /** 获取输入框元素 */
  getInput: () => inputRef.value,
  /** 获取当前值 */
  getValue: () => currentValue.value,
  /** 设置值 */
  setValue: (value: string) => {
    currentValue.value = value
  },
  /** 清空值 */
  clear: handleClear,
  /** 取消搜索 */
  cancel: handleCancel
})

// 初始化主题
updateTheme()
</script>

<style lang="scss" scoped>
.sdkwork-search-bar {
  display: flex;
  align-items: center;
  padding: var(--sdkwork-padding-sm, 8px) var(--sdkwork-padding-md, 16px);
  background: var(--sdkwork-search-bar-background, #f7f8fa);
  transition: background-color 0.3s ease, color 0.3s ease;
  
  &--round {
    border-radius: 999px;
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &--readonly {
    cursor: default;
  }
  
  // 浅色主题
  &--light {
    --sdkwork-search-bar-background: #f7f8fa;
    --sdkwork-search-bar-content-background: #fff;
    --sdkwork-search-bar-text-color: #323233;
    --sdkwork-search-bar-placeholder-color: #969799;
    --sdkwork-search-bar-icon-color: #969799;
    --sdkwork-search-bar-action-color: #1989fa;
  }
  
  // 深色主题
  &--dark {
    --sdkwork-search-bar-background: #2a2a2a;
    --sdkwork-search-bar-content-background: #3a3a3a;
    --sdkwork-search-bar-text-color: #fff;
    --sdkwork-search-bar-placeholder-color: #999;
    --sdkwork-search-bar-icon-color: #999;
    --sdkwork-search-bar-action-color: #4a90e2;
  }
  
  // 自动主题检测 - 确保在没有明确主题类时也能正确应用样式
  &:not(.sdkwork-search-bar--light):not(.sdkwork-search-bar--dark) {
    // 默认使用浅色主题作为fallback
    --sdkwork-search-bar-background: #f7f8fa;
    --sdkwork-search-bar-content-background: #fff;
    --sdkwork-search-bar-text-color: #323233;
    --sdkwork-search-bar-placeholder-color: #969799;
    --sdkwork-search-bar-icon-color: #969799;
    --sdkwork-search-bar-action-color: #1989fa;
    
    @media (prefers-color-scheme: dark) {
      --sdkwork-search-bar-background: #2a2a2a;
      --sdkwork-search-bar-content-background: #3a3a3a;
      --sdkwork-search-bar-text-color: #fff;
      --sdkwork-search-bar-placeholder-color: #999;
      --sdkwork-search-bar-icon-color: #999;
      --sdkwork-search-bar-action-color: #4a90e2;
    }
    
    @media (prefers-color-scheme: light) {
      --sdkwork-search-bar-background: #f7f8fa;
      --sdkwork-search-bar-content-background: #fff;
      --sdkwork-search-bar-text-color: #323233;
      --sdkwork-search-bar-placeholder-color: #969799;
      --sdkwork-search-bar-icon-color: #969799;
      --sdkwork-search-bar-action-color: #1989fa;
    }
  }
  
  &__left {
    margin-right: var(--sdkwork-padding-sm, 8px);
  }
  
  &__content {
    display: flex;
    align-items: center;
    flex: 1;
    background: var(--sdkwork-search-bar-content-background, #fff);
    border-radius: var(--sdkwork-border-radius-sm, 4px);
    padding: var(--sdkwork-padding-xs, 4px) var(--sdkwork-padding-sm, 8px);
    transition: all 0.2s ease;
    
    .sdkwork-search-bar--round & {
      border-radius: 999px;
    }
    
    // 当input获得焦点时，为整个内容区域添加焦点样式
    &:has(.sdkwork-search-bar__input:focus) {
      box-shadow: 0 0 0 2px var(--sdkwork-search-bar-action-color, #1989fa);
    }
    
    // 无障碍访问支持
    &:has(.sdkwork-search-bar__input:focus-visible) {
      outline: 2px solid var(--sdkwork-search-bar-action-color, #1989fa);
      outline-offset: 2px;
    }
  }
  
  &__icon {
    display: flex;
    align-items: center;
    margin-right: var(--sdkwork-padding-xs, 4px);
    color: var(--sdkwork-search-bar-icon-color, #969799);
    font-size: 16px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  &__field {
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;
    
    .sdkwork-search-bar__input {
      flex: 1;
      min-width: 0; // 防止flex布局溢出
    }
    
    .sdkwork-search-bar__clear {
      flex-shrink: 0; // 防止清除按钮被压缩
    }
  }
  
  // 输入框对齐方式
  &__input {
    &--center {
      text-align: center;
    }
    
    &--left {
      text-align: left;
    }
  }
  
  &__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--sdkwork-font-size-md, 14px);
    color: var(--sdkwork-search-bar-text-color, #323233);
    line-height: 1.5;
    
    &::placeholder {
      color: var(--sdkwork-search-bar-placeholder-color, #969799);
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    &:read-only {
      cursor: default;
    }
  }
  
  &__clear {
    display: flex;
    align-items: center;
    margin-left: var(--sdkwork-padding-xs, 4px);
    color: var(--sdkwork-search-bar-icon-color, #969799);
    cursor: pointer;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.7;
    }
    
    &:active {
      opacity: 0.5;
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  &__action {
    margin-left: var(--sdkwork-padding-sm, 8px);
    color: var(--sdkwork-search-bar-action-color, #1989fa);
    font-size: var(--sdkwork-font-size-md, 14px);
    cursor: pointer;
    user-select: none;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:active {
      opacity: 0.6;
    }
  }
}

// 响应式适配
@media (max-width: 320px) {
  .sdkwork-search-bar {
    padding: var(--sdkwork-padding-xs, 4px) var(--sdkwork-padding-sm, 8px);
    
    &__content {
      padding: var(--sdkwork-padding-xs, 4px) var(--sdkwork-padding-xs, 4px);
    }
    
    &__action {
      font-size: var(--sdkwork-font-size-sm, 13px);
    }
  }
}

// 移动端优化
@media (max-width: 768px) {
  .sdkwork-search-bar {
    &__input {
      font-size: 16px; // 防止iOS缩放
    }
  }
}

// 高对比度模式支持
@media (prefers-contrast: high) {
  .sdkwork-search-bar {
    &--light {
      --sdkwork-search-bar-background: #f0f0f0;
      --sdkwork-search-bar-text-color: #000;
      --sdkwork-search-bar-placeholder-color: #666;
      --sdkwork-search-bar-icon-color: #666;
      --sdkwork-search-bar-action-color: #0056b3;
    }
    
    &--dark {
      --sdkwork-search-bar-background: #1a1a1a;
      --sdkwork-search-bar-text-color: #fff;
      --sdkwork-search-bar-placeholder-color: #ccc;
      --sdkwork-search-bar-icon-color: #ccc;
      --sdkwork-search-bar-action-color: #66b3ff;
    }
  }
}

// 减少动画支持
@media (prefers-reduced-motion: reduce) {
  .sdkwork-search-bar {
    transition: none;
    
    &__clear,
    &__action {
      transition: none;
    }
  }
}
</style>