<template>
  <!-- 使用Vant的Popup组件作为基础 -->
  <van-popup :show="modelValue" @update:show="handlePopupUpdate" :position="position" :round="round"
    :closeable="closeable" :close-on-click-overlay="closeOnClickOverlay" :safe-area-inset-top="safeAreaInsetTop"
    :safe-area-inset-bottom="safeAreaInsetBottom" :style="popupStyles" :class="[popupClasses, themeClass]"
    :overlay-style="overlayStyle" :overlay-class="overlayClass" :lock-scroll="lockScroll" :lazy-render="lazyRender"
    :transition="transition" :teleport="teleport" :z-index="zIndex" @open="handleOpen" @close="handleClose"
    @opened="handleOpened" @closed="handleClosed" @click-overlay="handleClickOverlay">
    <!-- 弹窗内容容器 -->
    <div class="popup-container">
      <!-- 自定义头部 -->
      <div v-if="showHeader" class="popup-header">
        <slot name="header">
          <div class="header-content">
            <!-- 标题 -->
            <div class="header-title">
              <slot name="title">
                <span v-if="title">{{ title }}</span>
              </slot>
            </div>
          </div>
        </slot>
      </div>

      <!-- 主要内容区域 -->
      <div class="popup-content" :style="contentStyles">
        <slot />
      </div>

      <!-- 底部操作区域 -->
      <div v-if="showFooter" class="popup-footer">
        <slot name="footer" />
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 使用插槽
const $slots = defineSlots<{
  default?: (props: {}) => any
  title?: (props: {}) => any
  header?: (props: {}) => any
  footer?: (props: {}) => any
}>()

// Props定义
interface Props {
  // 基础属性
  modelValue?: boolean
  title?: string

  // 显示控制
  closeable?: boolean
  closeOnClickOverlay?: boolean

  // 位置和尺寸
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  width?: string | number
  height?: string | number
  maxHeight?: string | number
  minHeight?: string | number

  // 圆角
  round?: boolean

  // 安全区域适配
  safeAreaInsetBottom?: boolean
  safeAreaInsetTop?: boolean

  // 自定义类名
  customClass?: string | any

  // Vant Popup完整属性支持
  overlayStyle?: Record<string, any>
  overlayClass?: string
  lockScroll?: boolean
  lazyRender?: boolean
  transition?: string
  duration?: number | { enter: number; leave: number }
  teleport?: string | Element
  zIndex?: number

  // 主题配置
  themeMode?: 'dark' | 'light' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  closeable: true,
  closeOnClickOverlay: true,
  position: 'center',
  width: '',
  height: '',
  maxHeight: '',
  minHeight: '',
  round: true,
  safeAreaInsetBottom: true,
  safeAreaInsetTop: false,
  customClass: '',
  overlayStyle: () => ({}),
  overlayClass: '',
  lockScroll: true,
  lazyRender: false,
  transition: '',
  duration: 300,
  teleport: 'body',
  zIndex: 2000,
  themeMode: 'auto'
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'open': []
  'close': []
  'opened': []
  'closed': []
  'click-overlay': []
}>()

// 主题检测逻辑
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
  return isDarkMode.value ? 'sdkwork-popup--dark' : 'sdkwork-popup--light'
})

// 计算属性
const popupStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  if (props.maxHeight) {
    styles.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }

  if (props.minHeight) {
    styles.minHeight = typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight
  }

  return styles
})

const popupClasses = computed(() => {
  const classes: string[] = []

  if (props.customClass) {
    classes.push(props.customClass)
  }

  return classes.join(' ')
})

const contentStyles = computed(() => ({
  maxHeight: props.maxHeight ? (typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight) : undefined,
  minHeight: props.minHeight ? (typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight) : undefined
}))

const showHeader = computed(() => {
  return !!props.title || $slots.title
})

const showFooter = computed(() => {
  return !!$slots.footer
})



// 方法
const handlePopupUpdate = (value: boolean) => {
  emit('update:modelValue', value)
}

const handleOpen = () => {
  emit('open')
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOpened = () => {
  emit('opened')
}

const handleClosed = () => {
  emit('closed')
}

const handleClickOverlay = () => {
  emit('click-overlay')
}

// Expose方法
defineExpose({
  open: () => emit('update:modelValue', true),
  close: handleClose
})
</script>

<style scoped lang="scss">
:deep(.van-popup) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.popup-header {
  background: var(--sdkwork-popup-header-background, #fff);
  border-bottom: 1px solid var(--sdkwork-popup-header-border-color, #f0f0f0);
  color: var(--sdkwork-popup-header-color, #333);

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    padding-top: max(16px, env(safe-area-inset-top, 16px));
    min-height: 56px;
    box-sizing: border-box;
  }

  .header-left,
  .header-right {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--sdkwork-popup-header-color, #333);
  }

  .header-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: var(--sdkwork-popup-header-title-color, #333);
  }
}

.close-icon {
  font-size: 20px;
  color: var(--sdkwork-popup-close-icon-color, #999);
  cursor: pointer;

  &:hover {
    color: var(--sdkwork-popup-close-icon-hover-color, #666);
  }
}

.popup-content {
  background: var(--sdkwork-popup-content-background, #fff);
  color: var(--sdkwork-popup-content-color, #333);
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  &::-webkit-scrollbar-track {
    background: var(--sdkwork-popup-scrollbar-track-background, #f5f5f5);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--sdkwork-popup-scrollbar-thumb-background, #c1c1c1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--sdkwork-popup-scrollbar-thumb-hover-background, #a8a8a8);
  }
}

.popup-footer {
  background: var(--sdkwork-popup-footer-background, #fff);
  border-top: 1px solid var(--sdkwork-popup-footer-border-color, #f0f0f0);
  color: var(--sdkwork-popup-footer-color, #333);
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom, 16px));
  flex-shrink: 0;
}

/* 浅色主题 */
.sdkwork-popup--light {
  --sdkwork-popup-primary-color: #409EFF;
  --sdkwork-popup-primary-hover-color: #66b1ff;
  --sdkwork-popup-secondary-color: #f0f0f0;
  --sdkwork-popup-secondary-hover-color: #e0e0e0;
  
  --sdkwork-popup-header-background: #fff;
  --sdkwork-popup-header-border-color: #f0f0f0;
  --sdkwork-popup-header-color: #333;
  --sdkwork-popup-header-title-color: #333;

  --sdkwork-popup-content-background: #fff;
  --sdkwork-popup-content-color: #333;
  --sdkwork-popup-border-color: #ddd;

  --sdkwork-popup-footer-background: #fafafa;
  --sdkwork-popup-footer-border-color: #f0f0f0;
  --sdkwork-popup-footer-color: #333;

  --sdkwork-popup-close-icon-color: #999;
  --sdkwork-popup-close-icon-hover-color: #666;

  --sdkwork-popup-scrollbar-track-background: #f5f5f5;
  --sdkwork-popup-scrollbar-thumb-background: #c1c1c1;
  --sdkwork-popup-scrollbar-thumb-hover-background: #a8a8a8;
}

/* 深色主题 */
.sdkwork-popup--dark {
  --sdkwork-popup-primary-color: #409EFF;
  --sdkwork-popup-primary-hover-color: #66b1ff;
  --sdkwork-popup-secondary-color: #333333;
  --sdkwork-popup-secondary-hover-color: #444444;
  
  --sdkwork-popup-header-background: #2d2d2d;
  --sdkwork-popup-header-border-color: #404040;
  --sdkwork-popup-header-color: #ffffff;
  --sdkwork-popup-header-title-color: #ffffff;

  --sdkwork-popup-content-background: #1a1a1a;
  --sdkwork-popup-content-color: #ffffff;
  --sdkwork-popup-border-color: #444444;

  --sdkwork-popup-footer-background: #1a1a1a;
  --sdkwork-popup-footer-border-color: #333333;
  --sdkwork-popup-footer-color: #ffffff;

  --sdkwork-popup-close-icon-color: #999;
  --sdkwork-popup-close-icon-hover-color: #ccc;

  --sdkwork-popup-scrollbar-track-background: #2d2d2d;
  --sdkwork-popup-scrollbar-thumb-background: #555;
  --sdkwork-popup-scrollbar-thumb-hover-background: #666;
}
</style>