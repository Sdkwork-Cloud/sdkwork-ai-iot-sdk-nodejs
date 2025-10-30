<template>
  <div ref="rootRef" class="sdkwork-page-container" :class="[
    {
      'sdkwork-page-container--fullscreen': fullscreen,
      'sdkwork-page-container--scrollable': scrollable,
      'sdkwork-page-container--safe-area': safeArea,
      'sdkwork-page-container--transparent': transparent
    },
    themeClass
  ]" :style="computedStyle">
    <!-- 顶部导航栏插槽 -->
    <div v-if="$slots.navbar" class="sdkwork-page-container__navbar">
      <slot name="navbar" />
    </div>

    <!-- 页面标题 -->
    <div v-if="$slots.header || title" class="sdkwork-page-container__header">
      <slot name="header">
        <h1 v-if="title" class="sdkwork-page-container__title">{{ title }}</h1>
        <p v-if="description" class="sdkwork-page-container__description">{{ description }}</p>
      </slot>
    </div>

    <!-- 主要内容区域 -->
    <div ref="contentRef" class="sdkwork-page-container__content"
      :class="{ 'sdkwork-page-container__content--scrollable': scrollable }">
      <slot />
    </div>

    <!-- 底部操作栏插槽 -->
    <div v-if="$slots.footer" class="sdkwork-page-container__footer">
      <slot name="footer" />
    </div>

    <!-- 底部安全区域 -->
    <div v-if="safeArea" class="sdkwork-page-container__safe-area" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// Props 定义
interface Props {
  /** 页面标题 */
  title?: string
  /** 页面描述 */
  description?: string
  /** 是否全屏显示 */
  fullscreen?: boolean
  /** 内容区域是否可滚动 */
  scrollable?: boolean
  /** 是否启用安全区域适配（移动端） */
  safeArea?: boolean
  /** 背景是否透明 */
  transparent?: boolean
  /** 自定义背景颜色 */
  backgroundColor?: string
  /** 自定义内容区域背景颜色 */
  contentBackgroundColor?: string
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 页面加载完成回调 */
  onLoad?: () => void
  /** 页面显示回调 */
  onShow?: () => void
  /** 页面隐藏回调 */
  onHide?: () => void
  /** 页面滚动回调 */
  onScroll?: (scrollTop: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  fullscreen: false,
  scrollable: true,
  safeArea: true,
  transparent: false,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 页面加载完成事件 */
  load: []
  /** 页面显示事件 */
  show: []
  /** 页面隐藏事件 */
  hide: []
  /** 页面滚动事件 */
  scroll: [scrollTop: number]
}>()

// 插槽定义
defineSlots<{
  /** 顶部导航栏插槽 */
  navbar?: () => any
  /** 页面头部插槽 */
  header?: () => any
  /** 默认插槽 */
  default?: () => any
  /** 底部操作栏插槽 */
  footer?: () => any
}>()

// 响应式数据
const rootRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const scrollTop = ref(0)

// Dark mode support
const isDarkMode = ref(false)

// 检测系统暗黑模式
const detectSystemDarkMode = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// 检测微信浏览器
const isWeChatBrowser = () => {
  if (typeof window === 'undefined' || !window.navigator) {
    return false
  }
  const ua = window.navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') > -1
}

// 微信浏览器安全区域兼容性处理
const getSafeAreaInsetBottom = () => {
  if (typeof window === 'undefined') {
    return '0px'
  }
  
  // 检查是否支持安全区域变量
  const supportsEnv = window.CSS && window.CSS.supports && 
    (window.CSS.supports('height: env(safe-area-inset-bottom)') ||
     window.CSS.supports('height: constant(safe-area-inset-bottom)'))
  
  if (!supportsEnv && isWeChatBrowser()) {
    // 微信浏览器降级方案
    return '34px'
  }
  
  return 'env(safe-area-inset-bottom, 0px)'
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
  return isDarkMode.value ? 'sdkwork-page-container--dark' : 'sdkwork-page-container--light'
})

// 计算样式
const computedStyle = computed(() => ({
  ...props.customStyle,
  backgroundColor: props.backgroundColor || undefined,
  '--sdkwork-page-container-content-bg': props.contentBackgroundColor || undefined
}))

// 页面可见性处理
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    isVisible.value = true
    emit('show')
    props.onShow?.()
  } else {
    isVisible.value = false
    emit('hide')
    props.onHide?.()
  }
}

// 滚动处理
const handleScroll = () => {
  if (contentRef.value && props.scrollable) {
    scrollTop.value = contentRef.value.scrollTop
    emit('scroll', scrollTop.value)
    props.onScroll?.(scrollTop.value)
  }
}

// 滚动到指定位置
const scrollTo = (top: number, behavior: ScrollBehavior = 'smooth') => {
  if (contentRef.value) {
    contentRef.value.scrollTo({
      top,
      behavior
    })
  }
}

// 滚动到顶部
const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  scrollTo(0, behavior)
}

// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  if (contentRef.value) {
    scrollTo(contentRef.value.scrollHeight, behavior)
  }
}

// 获取滚动位置
const getScrollTop = () => {
  return scrollTop.value
}

// 获取内容区域高度
const getContentHeight = () => {
  return contentRef.value?.clientHeight || 0
}

// 获取内容区域滚动高度
const getScrollHeight = () => {
  return contentRef.value?.scrollHeight || 0
}

// 暴露方法
defineExpose({
  /** 滚动到指定位置 */
  scrollTo,
  /** 滚动到顶部 */
  scrollToTop,
  /** 滚动到底部 */
  scrollToBottom,
  /** 获取当前滚动位置 */
  getScrollTop,
  /** 获取内容区域高度 */
  getContentHeight,
  /** 获取内容区域滚动高度 */
  getScrollHeight,
  /** 获取页面可见性状态 */
  isVisible: () => isVisible.value,
  /** 获取当前主题模式 */
  getThemeMode: () => props.themeMode,
  /** 获取暗黑模式状态 */
  isDarkMode: () => isDarkMode.value
})

// 监听主题模式变化
watch(() => props.themeMode, updateTheme)

// 监听系统主题变化
let mediaQuery: MediaQueryList | null = null

// 系统主题变化处理函数
const handleSystemThemeChange = () => {
  if (props.themeMode === 'auto') {
    isDarkMode.value = mediaQuery?.matches || false
  }
}

onMounted(() => {
  updateTheme()

  // 页面加载完成
  nextTick(() => {
    emit('load')
    props.onLoad?.()
  })

  // 监听页面可见性变化
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  // 监听内容区域滚动
  if (contentRef.value && props.scrollable) {
    contentRef.value.addEventListener('scroll', handleScroll)
  }

  // 监听系统主题变化
  if (props.themeMode === 'auto' && typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }
})

onUnmounted(() => {
  // 清理事件监听
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  if (contentRef.value) {
    contentRef.value.removeEventListener('scroll', handleScroll)
  }

  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})
</script>

<style scoped lang="scss">
.sdkwork-page-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; /* 允许容器缩小 */
  overflow: visible;
  background: var(--sdkwork-page-container-background, #f7f8fa);

  // 全屏模式
  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    min-height: 100%;
    z-index: 9999;
  }

  // 透明背景
  &--transparent {
    background: transparent;
  }

  // 浅色主题
  &--light {
    --sdkwork-page-container-background: #f7f8fa;
    --sdkwork-page-container-content-background: #ffffff;
    --sdkwork-page-container-title-color: #323233;
    --sdkwork-page-container-description-color: #969799;
    --sdkwork-page-container-border-color: #ebedf0;
    --sdkwork-page-container-safe-area-background: #f7f8fa;
  }

  // 深色主题
  &--dark {
    --sdkwork-page-container-background: #1a1a1a;
    --sdkwork-page-container-content-background: #2a2a2a;
    --sdkwork-page-container-title-color: #ffffff;
    --sdkwork-page-container-description-color: #888888;
    --sdkwork-page-container-border-color: #3a3a3a;
    --sdkwork-page-container-safe-area-background: #1a1a1a;
  }
}

/* 支持 dvh 的浏览器使用 dvh */
@supports (height: 100dvh) {
  .sdkwork-page-container {
    height: 100%;
  }

  .sdkwork-page-container--fullscreen {
    height: 100%;
    min-height: 100%;
  }
}

.sdkwork-page-container__navbar {
  flex-shrink: 0;
  z-index: 10;
}

.sdkwork-page-container__header {
  flex-shrink: 0;
  padding: 24px 16px 16px;

  .sdkwork-page-container__title {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    color: var(--sdkwork-page-container-title-color);
  }

  .sdkwork-page-container__description {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--sdkwork-page-container-description-color);
  }
}

.sdkwork-page-container__content {
  flex: 1;
  background: var(--sdkwork-page-container-content-background, var(--sdkwork-page-container-content-bg));

  // 可滚动内容
  &--scrollable {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    // 隐藏滚动条但保持滚动功能
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */

    &::-webkit-scrollbar {
      display: none;
      /* Chrome, Safari and Opera */
    }
  }
}

.sdkwork-page-container__footer {
  flex-shrink: 0;
  padding: 16px;
  background: var(--sdkwork-page-container-content-background);
  border-top: 1px solid var(--sdkwork-page-container-border-color);
}

.sdkwork-page-container__safe-area {
  flex-shrink: 0;
  /* 现代浏览器支持 */
  height: env(safe-area-inset-bottom, 0px);
  /* 微信浏览器兼容性处理 */
  height: constant(safe-area-inset-bottom);
  /* 组合使用确保最大兼容性 */
  height: calc(env(safe-area-inset-bottom, 0px) + constant(safe-area-inset-bottom));
  background: var(--sdkwork-page-container-safe-area-background);
  
  /* 微信浏览器特殊处理 */
  @supports not (height: env(safe-area-inset-bottom)) {
    @supports not (height: constant(safe-area-inset-bottom)) {
      /* 微信浏览器降级方案 */
      height: 34px;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .sdkwork-page-container {
    min-height: 100%;

    &--safe-area {
      /* 现代浏览器支持 */
      padding-bottom: env(safe-area-inset-bottom, 0px);
      /* 微信浏览器兼容性处理 */
      padding-bottom: constant(safe-area-inset-bottom);
      /* 组合使用确保最大兼容性 */
      padding-bottom: calc(env(safe-area-inset-bottom, 0px) + constant(safe-area-inset-bottom));
      
      /* 微信浏览器特殊处理 */
      @supports not (padding-bottom: env(safe-area-inset-bottom)) {
        @supports not (padding-bottom: constant(safe-area-inset-bottom)) {
          /* 微信浏览器降级方案 */
          padding-bottom: 34px;
        }
      }
    }
  }

  /* 支持 dvh 的浏览器使用 dvh */
  @supports (min-height: 100dvh) {
    .sdkwork-page-container {
      min-height: 100%;
    }
  }

  .sdkwork-page-container__header {
    padding: 16px 16px 12px;

    .sdkwork-page-container__title {
      font-size: 16px;
      line-height: 22px;
    }

    .sdkwork-page-container__description {
      font-size: 13px;
      line-height: 18px;
    }
  }

  .sdkwork-page-container__footer {
    padding: 12px 16px;
  }
}

// 平板适配
@media (min-width: 769px) and (max-width: 1024px) {
  .sdkwork-page-container {
    max-width: 768px;
    margin: 0 auto;
  }
}

// 桌面端适配
@media (min-width: 1025px) {
  .sdkwork-page-container {
    max-width: 1024px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    min-height: calc(100% - 32px);
    margin-top: 16px;
    margin-bottom: 16px;

    &--fullscreen {
      max-width: none;
      margin: 0;
      border-radius: 0;
      box-shadow: none;
      min-height: 100%;
    }
  }

  /* 支持 dvh 的浏览器使用 dvh */
  @supports (min-height: 100dvh) {
    .sdkwork-page-container {
      min-height: calc(100% - 32px);
    }

    .sdkwork-page-container--fullscreen {
      min-height: 100%;
    }
  }


  .sdkwork-page-container__header {
    padding: 32px 24px 24px;

    .sdkwork-page-container__title {
      font-size: 20px;
      line-height: 28px;
    }
  }

  .sdkwork-page-container__footer {
    padding: 24px;
  }
}
</style>