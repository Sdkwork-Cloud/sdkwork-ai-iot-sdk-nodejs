<template>
  <div
    class="sdkwork-image"
    :class="[
      {
        'sdkwork-image--round': round,
        'sdkwork-image--block': block,
        'sdkwork-image--error': showError,
        'sdkwork-image--loading': showLoading,
        'sdkwork-image--small': size === 'small',
        'sdkwork-image--medium': size === 'medium',
        'sdkwork-image--large': size === 'large'
      },
      themeClass
    ]"
    :style="computedStyle"
  >
    <!-- 图片内容 -->
    <img
      v-if="!showError && !showLoading && src"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
      @click="handleClick"
    />
    
    <!-- 加载状态 -->
    <div v-if="showLoading" class="sdkwork-image__loading">
      <slot name="loading">
        <SdkworkIcon 
          v-if="loadingIcon" 
          :icon="loadingIcon" 
          :width="loadingIconSize" 
          :height="loadingIconSize" 
          class="sdkwork-image__loading-icon"
        />
        <span v-else class="sdkwork-image__loading-text">{{ loadingText }}</span>
      </slot>
    </div>
    
    <!-- 错误状态 -->
    <div v-if="showError" class="sdkwork-image__error">
      <slot name="error">
        <SdkworkIcon 
          v-if="errorIcon" 
          :icon="errorIcon" 
          :width="errorIconSize" 
          :height="errorIconSize" 
          class="sdkwork-image__error-icon"
        />
        <span v-else class="sdkwork-image__error-text">{{ errorText }}</span>
      </slot>
    </div>
    
    <!-- 默认插槽 -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SdkworkIcon from '../sdkwork-icon/sdkwork-icon.vue'

// Props 定义 - 兼容 vant 的 Image 组件
interface Props {
  /** 图片链接 */
  src?: string
  /** 替代文本 */
  alt?: string
  /** 图片填充模式 */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /** 图片位置，仅当 fit 为 contain 或 cover 时有效 */
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left' | string
  /** 是否显示为圆形 */
  round?: boolean
  /** 是否将图片显示为块级元素 */
  block?: boolean
  /** 宽度，默认单位为 px */
  width?: string | number
  /** 高度，默认单位为 px */
  height?: string | number
  /** 预设尺寸 */
  size?: 'small' | 'medium' | 'large' | number
  /** 圆角大小，默认单位为 px */
  radius?: string | number
  /** 是否开启懒加载 */
  lazy?: boolean
  /** 懒加载偏移量 */
  lazyOffset?: string | number
  /** 是否显示图片加载失败提示 */
  showError?: boolean
  /** 是否显示图片加载中提示 */
  showLoading?: boolean
  /** 自定义加载图标 */
  loadingIcon?: string
  /** 自定义加载图标大小 */
  loadingIconSize?: string | number
  /** 自定义加载文字 */
  loadingText?: string
  /** 自定义失败图标 */
  errorIcon?: string
  /** 自定义失败图标大小 */
  errorIconSize?: string | number
  /** 自定义失败文字 */
  errorText?: string
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
  /** 加载完成事件 */
  onLoad?: (event: Event) => void
  /** 加载失败事件 */
  onError?: (event: Event) => void
  /** 是否显示图片加载失败时的占位图 */
  errorPlaceholder?: boolean
  /** 是否显示图片加载中的占位图 */
  loadingPlaceholder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fit: 'fill',
  position: 'center',
  round: false,
  block: false,
  lazy: false,
  lazyOffset: 0,
  showError: true,
  showLoading: true,
  loadingIcon: 'material-symbols:image-outline-rounded',
  loadingIconSize: 32,
  loadingText: '加载中...',
  errorIcon: 'material-symbols:broken-image-rounded',
  errorIconSize: 32,
  errorText: '加载失败',
  themeMode: 'auto',
  errorPlaceholder: true,
  loadingPlaceholder: true
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
  /** 加载完成事件 */
  load: [event: Event]
  /** 加载失败事件 */
  error: [event: Event]
}>()

// 插槽定义
defineSlots<{
  /** 加载状态插槽 */
  loading?: () => any
  /** 错误状态插槽 */
  error?: () => any
  /** 默认插槽 */
  default?: () => any
}>()

// 响应式状态
const imageLoaded = ref(false)
const imageErrored = ref(false)

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
  return isDarkMode.value ? 'sdkwork-image--dark' : 'sdkwork-image--light'
})

// 计算预设尺寸
const computedSize = computed(() => {
  if (props.size === 'small') return 32
  if (props.size === 'medium') return 48
  if (props.size === 'large') return 64
  if (typeof props.size === 'number') return props.size
  return undefined
})

// 计算样式
const computedStyle = computed(() => {
  const width = props.width || computedSize.value
  const height = props.height || computedSize.value
  
  return {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: props.round ? '50%' : 
      typeof props.radius === 'number' ? `${props.radius}px` : props.radius,
    ...props.customStyle
  }
})

// 图片样式
const imageStyle = computed(() => ({
  objectFit: props.fit,
  objectPosition: props.position
}))

// 图片类名
const imageClass = computed(() => ({
  'sdkwork-image__img': true,
  'sdkwork-image__img--round': props.round
}))

// 显示错误状态
const showError = computed(() => {
  return props.showError && imageErrored.value
})

// 显示加载状态
const showLoading = computed(() => {
  return props.showLoading && !imageLoaded.value && !imageErrored.value && props.src
})

// 监听 src 变化
watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc !== oldSrc) {
    imageLoaded.value = false
    imageErrored.value = false
  }
})

// 处理图片加载
const handleLoad = (event: Event) => {
  imageLoaded.value = true
  emit('load', event)
  props.onLoad?.(event)
}

// 处理图片加载错误
const handleError = (event: Event) => {
  imageErrored.value = true
  emit('error', event)
  props.onError?.(event)
}

// 处理点击事件
const handleClick = (event: Event) => {
  emit('click', event)
  props.onClick?.(event)
}

// 暴露方法
defineExpose({
  /** 获取图片是否已加载 */
  isLoaded: () => imageLoaded.value,
  /** 获取图片是否加载失败 */
  isErrored: () => imageErrored.value,
  /** 重新加载图片 */
  reload: () => {
    imageLoaded.value = false
    imageErrored.value = false
  }
})
</script>

<style scoped lang="scss">
.sdkwork-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: var(--sdkwork-image-background, #f7f8fa);
  vertical-align: middle;
  box-sizing: border-box;
  
  // 块级元素
  &--block {
    display: block;
    width: 100%;
  }
  
  // 圆形
  &--round {
    border-radius: 50%;
    
    .sdkwork-image__img {
      border-radius: 50%;
    }
  }
  
  // 预设尺寸
  &--small {
    width: 32px;
    height: 32px;
  }
  
  &--medium {
    width: 48px;
    height: 48px;
  }
  
  &--large {
    width: 64px;
    height: 64px;
  }
  
  // 错误状态
  &--error {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sdkwork-image-error-background, var(--sdkwork-image-background, #f7f8fa));
  }
  
  // 加载状态
  &--loading {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sdkwork-image-loading-background, var(--sdkwork-image-background, #f7f8fa));
  }
}

.sdkwork-image__img {
  display: block;
  width: 100%;
  height: 100%;
  
  // 圆形图片
  &--round {
    border-radius: 50%;
  }
}

.sdkwork-image__loading,
.sdkwork-image__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--sdkwork-image-text-color, #969799);
  font-size: 14px;
  line-height: 1.4;
}

.sdkwork-image__loading-icon,
.sdkwork-image__error-icon {
  margin-bottom: 8px;
  color: var(--sdkwork-image-icon-color, #c8c9cc);
}

.sdkwork-image__loading-text,
.sdkwork-image__error-text {
  font-size: 12px;
  line-height: 1.4;
}

// 浅色主题
.sdkwork-image--light {
  --sdkwork-image-background: #f7f8fa;
  --sdkwork-image-text-color: #969799;
  --sdkwork-image-icon-color: #c8c9cc;
  --sdkwork-image-error-background: #f7f8fa;
  --sdkwork-image-loading-background: #f7f8fa;
}

// 深色主题
.sdkwork-image--dark {
  --sdkwork-image-background: #2a2a2a;
  --sdkwork-image-text-color: #888;
  --sdkwork-image-icon-color: #555;
  --sdkwork-image-error-background: #2a2a2a;
  --sdkwork-image-loading-background: #2a2a2a;
}
</style>