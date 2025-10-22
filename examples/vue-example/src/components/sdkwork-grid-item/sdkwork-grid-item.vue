<template>
  <div
    class="sdkwork-grid-item"
    :class="[
      {
        'sdkwork-grid-item--clickable': isClickable,
        'sdkwork-grid-item--bordered': bordered,
        'sdkwork-grid-item--center': center,
        'sdkwork-grid-item--square': square,
        'sdkwork-grid-item--reverse': reverse,
        'sdkwork-grid-item--disabled': disabled,
        'sdkwork-grid-item--loading': loading
      },
      themeClass
    ]"
    :style="computedStyle"
    @click="handleClick"
  >
    <!-- 图标区域 -->
    <div v-if="$slots.icon || icon" class="sdkwork-grid-item__icon">
      <slot name="icon">
        <SdkworkIcon v-if="icon" :icon="icon" :width="iconSize" :height="iconSize" />
      </slot>
    </div>

    <!-- 内容区域 -->
    <div class="sdkwork-grid-item__content">
      <!-- 文本区域 -->
      <div v-if="$slots.text || text || label" class="sdkwork-grid-item__text">
        <slot name="text">
          <div v-if="text" class="sdkwork-grid-item__text-primary">{{ text }}</div>
          <div v-if="label" class="sdkwork-grid-item__text-label">{{ label }}</div>
        </slot>
      </div>

      <!-- 默认插槽 -->
      <slot />
    </div>

    <!-- 角标 -->
    <div v-if="badge || dot" class="sdkwork-grid-item__badge">
      <slot name="badge">
        <span v-if="badge" class="sdkwork-grid-item__badge-text">{{ badge }}</span>
        <span v-else-if="dot" class="sdkwork-grid-item__badge-dot"></span>
      </slot>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="sdkwork-grid-item__loading-overlay">
      <van-loading size="20px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import SdkworkIcon from '../sdkwork-icon/sdkwork-icon.vue'

// Props 定义 - 兼容 Vant GridItem 组件并扩展功能
interface Props {
  /** 网格项文本 */
  text?: string
  /** 网格项标签 */
  label?: string
  /** 图标名称 */
  icon?: string
  /** 图标尺寸 */
  iconSize?: string | number
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 是否居中显示 */
  center?: boolean
  /** 是否将格子固定为正方形 */
  square?: boolean
  /** 是否将格子内容顺序反转 */
  reverse?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 角标内容 */
  badge?: string | number
  /** 是否显示圆点角标 */
  dot?: boolean
  /** 点击后跳转的链接地址 */
  url?: string
  /** 点击后跳转方式 */
  replace?: boolean
  /** 点击后跳转的目标路由 */
  to?: string | object
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 28,
  bordered: true,
  clickable: false,
  center: true,
  square: false,
  reverse: false,
  disabled: false,
  loading: false,
  dot: false,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
}>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 网格项内容 */
  default?: () => any
  /** 图标插槽 */
  icon?: () => any
  /** 文本插槽 */
  text?: () => any
  /** 角标插槽 */
  badge?: () => any
}>()

// 从父级 Grid 组件获取配置
const gridConfig = inject('sdkwork-grid-config', {
  column: 4,
  gutter: 0,
  bordered: false,
  clickable: false,
  center: true,
  square: false,
  reverse: false
})

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
  return isDarkMode.value ? 'sdkwork-grid-item--dark' : 'sdkwork-grid-item--light'
})

// 是否可点击
const isClickable = computed(() => {
  return !props.disabled && (props.clickable || gridConfig.clickable || props.url || props.to || props.onClick)
})

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, string | number> = {
    ...props.customStyle,
    cursor: isClickable.value ? 'pointer' : 'default'
  }

  // 正方形模式
  if (props.square || gridConfig.square) {
    // 在CSS Grid中，正方形模式需要特殊处理
    style.aspectRatio = '1 / 1'
  }

  return style
})

// 处理点击事件
const handleClick = (event: Event) => {
  if (props.disabled || props.loading) return
  
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
  /** 获取网格项配置 */
  getConfig: () => ({
    text: props.text,
    label: props.label,
    icon: props.icon,
    bordered: props.bordered,
    clickable: props.clickable,
    center: props.center,
    square: props.square,
    reverse: props.reverse,
    disabled: props.disabled,
    loading: props.loading,
    badge: props.badge,
    dot: props.dot
  }),
  /** 是否可点击 */
  isClickable: () => isClickable.value,
  /** 是否禁用 */
  isDisabled: () => props.disabled,
  /** 是否正在加载 */
  isLoading: () => props.loading
})
</script>

<style scoped lang="scss">
.sdkwork-grid-item {
  position: relative;
  box-sizing: border-box;
  background: var(--sdkwork-grid-item-background, #fff);
  transition: all 0.3s ease-in-out;
  
  // 确保在CSS Grid中正常显示
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--sdkwork-grid-item-padding, 12px);
  min-height: var(--sdkwork-grid-item-min-height, 100px);
  height: 100%;
  
  // 确保badge在正确位置
  overflow: visible;

  // 边框模式
  &--bordered {
    border: 1px solid var(--sdkwork-grid-item-border-color, #ebedf0);
    border-radius: var(--sdkwork-grid-item-border-radius, 8px);
  }

  // 点击效果
  &--clickable {
    cursor: pointer;
    
    &:hover {
      background: var(--sdkwork-grid-item-hover-background, #f7f8fa);
      transform: translateY(-1px);
    }
    
    &:active {
      background: var(--sdkwork-grid-item-active-background, #f2f3f5);
      transform: scale(0.98);
    }
  }

  // 居中模式
  &--center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  // 反转模式
  &--reverse {
    flex-direction: column-reverse;
  }

  // 禁用状态
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    
    &.sdkwork-grid-item--clickable:hover {
      background: var(--sdkwork-grid-item-background, #fff);
      transform: none;
    }
  }

  // 加载状态
  &--loading {
    pointer-events: none;
  }

  // 图标区域
  &__icon {
    margin-bottom: var(--sdkwork-grid-item-icon-margin, 8px);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .sdkwork-icon {
      color: var(--sdkwork-grid-item-icon-color, #323233);
    }
  }

  // 内容区域
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: var(--sdkwork-grid-item-content-min-height, 40px);
    width: 100%;
  }

  // 文本区域
  &__text {
    .sdkwork-grid-item__text-primary {
      font-size: var(--sdkwork-grid-item-text-size, 14px);
      font-weight: var(--sdkwork-grid-item-text-weight, 500);
      color: var(--sdkwork-grid-item-text-color, #323233);
      line-height: 1.4;
      margin-bottom: var(--sdkwork-grid-item-text-margin, 4px);
    }

    .sdkwork-grid-item__text-label {
      font-size: var(--sdkwork-grid-item-label-size, 12px);
      color: var(--sdkwork-grid-item-label-color, #969799);
      line-height: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  }

  // 角标
  &__badge {
    position: absolute;
    top: var(--sdkwork-grid-item-badge-top, 8px);
    right: var(--sdkwork-grid-item-badge-right, 8px);
    z-index: 10;
    
    .sdkwork-grid-item__badge-text {
      background: var(--sdkwork-grid-item-badge-background, #ee0a24);
      color: var(--sdkwork-grid-item-badge-color, #fff);
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 10px;
      line-height: 1;
      min-width: 16px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .sdkwork-grid-item__badge-dot {
      width: 8px;
      height: 8px;
      background: var(--sdkwork-grid-item-badge-background, #ee0a24);
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  // 加载遮罩
  &__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--sdkwork-grid-item-loading-background, rgba(255, 255, 255, 0.8));
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
  }
}

// 浅色主题
.sdkwork-grid-item--light {
  --sdkwork-grid-item-background: #fff;
  --sdkwork-grid-item-border-color: #ebedf0;
  --sdkwork-grid-item-border-radius: 8px;
  --sdkwork-grid-item-hover-background: #f7f8fa;
  --sdkwork-grid-item-active-background: #f2f3f5;
  --sdkwork-grid-item-icon-margin: 8px;
  --sdkwork-grid-item-icon-color: #323233;
  --sdkwork-grid-item-content-min-height: 40px;
  --sdkwork-grid-item-text-size: 14px;
  --sdkwork-grid-item-text-weight: 500;
  --sdkwork-grid-item-text-color: #323233;
  --sdkwork-grid-item-text-margin: 4px;
  --sdkwork-grid-item-label-size: 12px;
  --sdkwork-grid-item-label-color: #969799;
  --sdkwork-grid-item-badge-top: 4px;
  --sdkwork-grid-item-badge-right: 4px;
  --sdkwork-grid-item-badge-background: #ee0a24;
  --sdkwork-grid-item-badge-color: #fff;
  --sdkwork-grid-item-loading-background: rgba(255, 255, 255, 0.8);
}

// 深色主题
.sdkwork-grid-item--dark {
  --sdkwork-grid-item-background: #2a2a2a;
  --sdkwork-grid-item-border-color: #3a3a3a;
  --sdkwork-grid-item-border-radius: 8px;
  --sdkwork-grid-item-hover-background: #3a3a3a;
  --sdkwork-grid-item-active-background: #4a4a4a;
  --sdkwork-grid-item-icon-margin: 8px;
  --sdkwork-grid-item-icon-color: #e0e0e0;
  --sdkwork-grid-item-content-min-height: 40px;
  --sdkwork-grid-item-text-size: 14px;
  --sdkwork-grid-item-text-weight: 500;
  --sdkwork-grid-item-text-color: #e0e0e0;
  --sdkwork-grid-item-text-margin: 4px;
  --sdkwork-grid-item-label-size: 12px;
  --sdkwork-grid-item-label-color: #888;
  --sdkwork-grid-item-badge-top: 4px;
  --sdkwork-grid-item-badge-right: 4px;
  --sdkwork-grid-item-badge-background: #ff4757;
  --sdkwork-grid-item-badge-color: #fff;
  --sdkwork-grid-item-loading-background: rgba(42, 42, 42, 0.8);
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-grid-item {
    --sdkwork-grid-item-padding: 10px;
    --sdkwork-grid-item-text-size: 13px;
    --sdkwork-grid-item-label-size: 11px;
    --sdkwork-grid-item-icon-size: 24px;
  }
}
</style>