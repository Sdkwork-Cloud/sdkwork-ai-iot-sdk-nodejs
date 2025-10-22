<template>
  <span
    class="sdkwork-tag"
    :class="[
      {
        'sdkwork-tag--plain': plain,
        'sdkwork-tag--round': round,
        'sdkwork-tag--mark': mark,
        'sdkwork-tag--closeable': closeable,
        'sdkwork-tag--disabled': disabled,
        'sdkwork-tag--clickable': isClickable
      },
      `sdkwork-tag--${type}`,
      `sdkwork-tag--${size}`,
      themeClass
    ]"
    :style="computedStyle"
    @click="handleClick"
  >
    <!-- 标签内容 -->
    <span class="sdkwork-tag__content">
      <slot>{{ text }}</slot>
    </span>
    
    <!-- 关闭按钮 -->
    <span 
      v-if="closeable" 
      class="sdkwork-tag__close"
      @click.stop="handleClose"
    >
      <SdkworkIcon 
        icon="material-symbols:close-rounded" 
        :width="closeIconSize" 
        :height="closeIconSize" 
      />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SdkworkIcon from '../sdkwork-icon/sdkwork-icon.vue'

// Props 定义 - 兼容 vant 的 Tag 组件
interface Props {
  /** 标签类型 */
  type?: 'default' | 'primary' | 'success' | 'danger' | 'warning'
  /** 标签尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 标签颜色 */
  color?: string
  /** 是否为空心样式 */
  plain?: boolean
  /** 是否为圆角样式 */
  round?: boolean
  /** 是否为标记样式 */
  mark?: boolean
  /** 标签文字内容 */
  text?: string
  /** 是否可关闭 */
  closeable?: boolean
  /** 关闭图标尺寸 */
  closeIconSize?: string | number
  /** 是否禁用标签 */
  disabled?: boolean
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: MouseEvent) => void
  /** 关闭事件 */
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'small',
  plain: false,
  round: false,
  mark: false,
  closeable: false,
  closeIconSize: 12,
  disabled: false,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: MouseEvent]
  /** 关闭事件 */
  close: []
}>()

// 插槽定义
defineSlots<{
  /** 默认插槽 */
  default?: () => any
}>()

// Dark mode support
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-tag--dark' : 'sdkwork-tag--light'
})

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, string | number> = { ...props.customStyle }
  
  // 设置自定义颜色
  if (props.color) {
    if (props.plain) {
      style.color = props.color
      style.borderColor = props.color
    } else {
      style.backgroundColor = props.color
      style.borderColor = props.color
      style.color = '#fff'
    }
  }
  
  return style
})

// 是否可点击
const isClickable = computed(() => {
  return !props.disabled && props.onClick
})

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  
  emit('click', event)
  props.onClick?.(event)
}

// 处理关闭事件
const handleClose = () => {
  if (props.disabled) return
  
  emit('close')
  props.onClose?.()
}

// 暴露方法
defineExpose({
  /** 获取标签文本 */
  getText: () => props.text || '',
  /** 获取标签类型 */
  getType: () => props.type,
  /** 获取标签尺寸 */
  getSize: () => props.size
})
</script>

<style lang="scss" scoped>
.sdkwork-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid transparent;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  
  // 尺寸样式
  &--small {
    height: 16px;
    padding: 0 4px;
    font-size: 10px;
  }
  
  &--medium {
    height: 20px;
    padding: 0 6px;
    font-size: 12px;
  }
  
  &--large {
    height: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
  
  // 类型样式
  &--default {
    background-color: #f2f3f5;
    color: #323233;
    border-color: #f2f3f5;
  }
  
  &--primary {
    background-color: #1989fa;
    color: #fff;
    border-color: #1989fa;
  }
  
  &--success {
    background-color: #07c160;
    color: #fff;
    border-color: #07c160;
  }
  
  &--danger {
    background-color: #ee0a24;
    color: #fff;
    border-color: #ee0a24;
  }
  
  &--warning {
    background-color: #ff976a;
    color: #fff;
    border-color: #ff976a;
  }
  
  // 空心样式
  &--plain {
    &.sdkwork-tag--default {
      color: #323233;
      background-color: transparent;
      border-color: #f2f3f5;
    }
    
    &.sdkwork-tag--primary {
      color: #1989fa;
      background-color: transparent;
      border-color: #1989fa;
    }
    
    &.sdkwork-tag--success {
      color: #07c160;
      background-color: transparent;
      border-color: #07c160;
    }
    
    &.sdkwork-tag--danger {
      color: #ee0a24;
      background-color: transparent;
      border-color: #ee0a24;
    }
    
    &.sdkwork-tag--warning {
      color: #ff976a;
      background-color: transparent;
      border-color: #ff976a;
    }
  }
  
  // 圆角样式
  &--round {
    border-radius: 999px;
  }
  
  // 标记样式
  &--mark {
    border-radius: 0 999px 999px 0;
    
    &.sdkwork-tag--round {
      border-radius: 999px;
    }
  }
  
  // 可关闭样式
  &--closeable {
    padding-right: 4px;
    
    .sdkwork-tag__content {
      margin-right: 2px;
    }
  }
  
  // 禁用样式
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // 可点击样式
  &--clickable {
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  // 内容区域
  &__content {
    display: inline-flex;
    align-items: center;
  }
  
  // 关闭按钮
  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  
  // 主题样式
  &--light {
    // 浅色主题不需要额外样式，使用默认样式
  }
  
  &--dark {
    &.sdkwork-tag--default {
      background-color: #2a2a2a;
      color: #e0e0e0;
      border-color: #2a2a2a;
      
      &.sdkwork-tag--plain {
        color: #e0e0e0;
        background-color: transparent;
        border-color: #2a2a2a;
      }
    }
    
    &.sdkwork-tag--primary {
      background-color: #1976d2;
      border-color: #1976d2;
      
      &.sdkwork-tag--plain {
        color: #1976d2;
        background-color: transparent;
        border-color: #1976d2;
      }
    }
    
    &.sdkwork-tag--success {
      background-color: #388e3c;
      border-color: #388e3c;
      
      &.sdkwork-tag--plain {
        color: #388e3c;
        background-color: transparent;
        border-color: #388e3c;
      }
    }
    
    &.sdkwork-tag--danger {
      background-color: #d32f2f;
      border-color: #d32f2f;
      
      &.sdkwork-tag--plain {
        color: #d32f2f;
        background-color: transparent;
        border-color: #d32f2f;
      }
    }
    
    &.sdkwork-tag--warning {
      background-color: #f57c00;
      border-color: #f57c00;
      
      &.sdkwork-tag--plain {
        color: #f57c00;
        background-color: transparent;
        border-color: #f57c00;
      }
    }
  }
}
</style>