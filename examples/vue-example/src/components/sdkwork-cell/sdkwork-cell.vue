<template>
  <div
    class="sdkwork-cell"
    :class="[
      {
        'sdkwork-cell--clickable': isClickable,
        'sdkwork-cell--required': required,
        'sdkwork-cell--center': center,
        'sdkwork-cell--borderless': !border,
        'sdkwork-cell--large': size === 'large',
        'sdkwork-cell--disabled': disabled
      },
      themeClass
    ]"
    :style="computedStyle"
    @click="handleClick"
  >
    <!-- 左侧图标 -->
    <div v-if="$slots.icon || icon" class="sdkwork-cell__left-icon">
      <slot name="icon">
        <SdkworkIcon v-if="icon" :icon="icon" :width="iconSize" :height="iconSize" />
      </slot>
    </div>
    
    <!-- 内容区域 -->
    <div class="sdkwork-cell__content">
      <!-- 标题区域 -->
      <div v-if="$slots.title || title || label" class="sdkwork-cell__title">
        <slot name="title">
          <span v-if="title" class="sdkwork-cell__title-text">{{ title }}</span>
          <span v-if="label" class="sdkwork-cell__label">{{ label }}</span>
        </slot>
      </div>
      
      <!-- 值区域 -->
      <div v-if="$slots.value || value" class="sdkwork-cell__value">
        <slot name="value">
          <span v-if="value" class="sdkwork-cell__value-text">{{ value }}</span>
        </slot>
      </div>
      
      <!-- 默认插槽 -->
      <slot />
    </div>
    
    <!-- 右侧图标 -->
    <div v-if="isLink || $slots['right-icon'] || rightIcon" class="sdkwork-cell__right-icon">
      <slot name="right-icon">
        <SdkworkIcon 
          v-if="isLink || rightIcon" 
          :icon="rightIcon || 'material-symbols:chevron-right-rounded'" 
          :width="iconSize" 
          :height="iconSize" 
          class="sdkwork-cell__right-arrow"
        />
      </slot>
    </div>
    
    <!-- 额外内容 -->
    <div v-if="$slots.extra" class="sdkwork-cell__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SdkworkIcon from '../sdkwork-icon/sdkwork-icon.vue'

// Props 定义 - 兼容 vant 的 Cell 组件
interface Props {
  /** 标题 */
  title?: string
  /** 标题下方的描述信息 */
  label?: string
  /** 右侧内容 */
  value?: string
  /** 左侧图标名称 */
  icon?: string
  /** 右侧图标名称 */
  rightIcon?: string
  /** 图标尺寸 */
  iconSize?: string | number
  /** 是否显示边框 */
  border?: boolean
  /** 是否显示右侧箭头 */
  isLink?: boolean
  /** 是否禁用单元格 */
  disabled?: boolean
  /** 是否将内容居中 */
  center?: boolean
  /** 是否必填 */
  required?: boolean
  /** 点击后跳转的链接地址 */
  url?: string
  /** 点击后跳转方式 */
  replace?: boolean
  /** 点击后跳转的目标路由 */
  to?: string | object
  /** 单元格大小 */
  size?: 'large'
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 16,
  border: true,
  isLink: false,
  disabled: false,
  center: false,
  required: false,
  size: undefined,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
}>()

// 插槽定义
defineSlots<{
  /** 左侧图标插槽 */
  icon?: () => any
  /** 标题插槽 */
  title?: () => any
  /** 值插槽 */
  value?: () => any
  /** 右侧图标插槽 */
  'right-icon'?: () => any
  /** 额外内容插槽 */
  extra?: () => any
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
  return isDarkMode.value ? 'sdkwork-cell--dark' : 'sdkwork-cell--light'
})

// 计算样式
const computedStyle = computed(() => ({
  ...props.customStyle,
  cursor: isClickable.value ? 'pointer' : 'default'
}))

// 是否可点击
const isClickable = computed(() => {
  return !props.disabled && (props.isLink || props.url || props.to || props.onClick)
})

// 处理点击事件
const handleClick = (event: Event) => {
  if (props.disabled) return
  
  emit('click', event)
  props.onClick?.(event)
  
  // 处理链接跳转
  if (props.url) {
    if (props.replace) {
      window.location.replace(props.url)
    } else {
      window.location.href = props.url
    }
  }
  
  // 处理路由跳转（需要配合路由库使用）
  if (props.to && typeof window !== 'undefined' && (window as any).$router) {
    if (props.replace) {
      (window as any).$router.replace(props.to)
    } else {
      (window as any).$router.push(props.to)
    }
  }
}

// 暴露方法
defineExpose({
  /** 获取单元格标题 */
  getTitle: () => props.title,
  /** 获取单元格值 */
  getValue: () => props.value,
  /** 是否禁用 */
  isDisabled: () => props.disabled,
  /** 是否可点击 */
  isClickable: () => isClickable.value
})
</script>

<style scoped lang="scss">
.sdkwork-cell {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--sdkwork-cell-background, #fff);
  font-size: 14px;
  line-height: 24px;
  
  // 点击效果
  &--clickable {
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    
    &:active {
      background-color: var(--sdkwork-cell-active-background, #f2f3f5);
    }
  }
  
  // 大尺寸
  &--large {
    padding: 12px 16px;
    
    .sdkwork-cell__title {
      font-size: 16px;
    }
  }
  
  // 居中
  &--center {
    align-items: center;
    
    .sdkwork-cell__content {
      justify-content: center;
    }
  }
  
  // 禁用状态
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    
    &.sdkwork-cell--clickable:active {
      background-color: transparent;
    }
  }
  
  // 必填状态
  &--required {
    .sdkwork-cell__title::before {
      content: '*';
      color: var(--sdkwork-cell-required-color, #ee0a24);
      margin-right: 4px;
    }
  }
  
  // 无边框
  &--borderless::after {
    display: none;
  }
  
  // 边框（使用伪元素实现）
  &:not(.sdkwork-cell--borderless)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 0;
    height: 1px;
    background: var(--sdkwork-cell-border-color, #ebedf0);
    transform: scaleY(0.5);
  }
}

.sdkwork-cell__left-icon {
  margin-right: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  
  .sdkwork-icon {
    color: var(--sdkwork-cell-icon-color, #646566);
  }
}

.sdkwork-cell__content {
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 24px;
  
  .sdkwork-cell__title {
    flex: 1;
    display: flex;
    align-items: center;
    
    .sdkwork-cell__title-text {
      color: var(--sdkwork-cell-title-color, #323233);
      font-weight: 500;
      line-height: 1.4;
    }
    
    .sdkwork-cell__label {
      display: block;
      margin-top: 4px;
      color: var(--sdkwork-cell-label-color, #969799);
      font-size: 12px;
      line-height: 18px;
    }
  }
  
  .sdkwork-cell__value {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    
    .sdkwork-cell__value-text {
      color: var(--sdkwork-cell-value-color, #969799);
      line-height: 1.4;
    }
  }
}

.sdkwork-cell__right-icon {
  margin-left: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  
  .sdkwork-icon {
    color: var(--sdkwork-cell-right-icon-color, #969799);
  }
  
  .sdkwork-cell__right-arrow {
    transition: transform 0.2s ease-in-out;
  }
}

.sdkwork-cell__extra {
  margin-left: 8px;
  flex-shrink: 0;
}

// 浅色主题
.sdkwork-cell--light {
  --sdkwork-cell-background: #fff;
  --sdkwork-cell-active-background: #f2f3f5;
  --sdkwork-cell-border-color: #ebedf0;
  --sdkwork-cell-title-color: #323233;
  --sdkwork-cell-label-color: #969799;
  --sdkwork-cell-value-color: #969799;
  --sdkwork-cell-icon-color: #646566;
  --sdkwork-cell-right-icon-color: #969799;
  --sdkwork-cell-required-color: #ee0a24;
}

// 深色主题
.sdkwork-cell--dark {
  --sdkwork-cell-background: #1a1a1a;
  --sdkwork-cell-active-background: #2a2a2a;
  --sdkwork-cell-border-color: #3a3a3a;
  --sdkwork-cell-title-color: #e0e0e0;
  --sdkwork-cell-label-color: #888;
  --sdkwork-cell-value-color: #888;
  --sdkwork-cell-icon-color: #888;
  --sdkwork-cell-right-icon-color: #888;
  --sdkwork-cell-required-color: #ff4757;
}
</style>