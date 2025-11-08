<template>
  <div>
    <!-- 导航栏占位符，用于为fixed定位的navbar预留空间 -->
    <div v-if="fixed" class="sdkwork-navbar__placeholder-space" :style="{
      height: `${totalHeight}px`
    }">
    </div>

    <!-- 导航栏主体 -->
    <div class="sdkwork-navbar" :class="[{
      'sdkwork-navbar--fixed': fixed,
      'sdkwork-navbar--border': border
    }, themeClass]" :style="{
      height: `${height}px`,
      zIndex: zIndex,
      background: background
    }">
      <!-- 状态栏占位 -->
      <div v-if="hasRealSafeArea" class="sdkwork-navbar__placeholder">
      </div>

      <!-- 导航栏内容 -->
      <div class="sdkwork-navbar__content" :style="{ height: `${height}px` }">
        <!-- 左侧区域 -->
        <div class="sdkwork-navbar__left">
          <!-- 返回按钮 -->
          <div v-if="showLeftArrow || leftText" class="sdkwork-navbar__left-btn" @click="handleLeftClick">
            <!-- 返回图标 -->
            <span v-if="showLeftArrow" class="sdkwork-navbar__arrow">
              <slot name="left-arrow">
                <SdkworkIcon icon="material-symbols:arrow-back-ios-new-rounded" width="16" height="16" />
              </slot>
            </span>

            <!-- 左侧文字 -->
            <span v-if="leftText" class="sdkwork-navbar__text">{{ leftText }}</span>
          </div>

          <!-- 左侧插槽 -->
          <slot name="left"> </slot>
        </div>

        <!-- 标题区域 -->
        <div class="sdkwork-navbar__title">
          <!-- 标题插槽 -->
          <slot name="title">
            <span class="sdkwork-navbar__title-text">{{ title }}</span>
          </slot>
        </div>

        <!-- 右侧区域 -->
        <div class="sdkwork-navbar__right">
          <!-- 右侧插槽 -->
          <slot name="right">
          </slot>

          <!-- 右侧文字按钮 -->
          <span v-if="rightText" class="sdkwork-navbar__text sdkwork-navbar__right-btn" @click="handleRightClick">
            {{ rightText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SdkworkIcon from '../sdkwork-icon/sdkwork-icon.vue'
import { useTheme } from '../../hooks/theme/useTheme'

// Props 定义
interface Props {
  /** 标题 */
  title?: string
  /** 左侧文字 */
  leftText?: string
  /** 右侧文字 */
  rightText?: string
  /** 是否显示左侧箭头 */
  leftArrow?: boolean
  /** 是否自动检测路由历史显示返回按钮 */
  autoBack?: boolean
  /** 是否固定定位 */
  fixed?: boolean
  /** 是否显示底部边框 */
  border?: boolean
  /** 导航栏高度 */
  height?: number
  /** z-index 层级 */
  zIndex?: number
  /** 背景颜色 */
  background?: string
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否启用安全区域适配 */
  safeAreaInsetTop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  leftText: '',
  rightText: '',
  leftArrow: false,
  autoBack: true, // 默认启用自动返回检测
  fixed: false,
  border: true,
  height: 46, // Vant 标准高度
  zIndex: 1,
  background: '',
  themeMode: 'auto',
  safeAreaInsetTop: false
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击左侧按钮事件 */
  'click-left': []
  /** 点击右侧按钮事件 */
  'click-right': []
}>()

// 路由实例
const router = useRouter()

// 使用主题hook
const { isDarkMode, currentTheme } = useTheme()

// 检查是否应该显示返回按钮
const shouldShowBackButton = computed(() => {
  // 如果手动设置了leftArrow，优先使用手动设置
  if (props.leftArrow) return true
  
  // 如果禁用了自动返回检测，则不显示
  if (!props.autoBack) return false

  try {
    const currentRoute = router.currentRoute.value
    
    // 1. 检查meta中是否明确设置隐藏返回按钮（最高优先级）
    if (currentRoute.meta?.hideBackButton === true) return false
    
    // 2. 检查meta中是否明确设置显示返回按钮
    if (currentRoute.meta?.showBackButton === true) return true
    
    // 3. 自动检测逻辑
    // 兼容性处理：检查window.history是否存在
    const historyLength = window.history && window.history.length ? window.history.length : 1
    const isHomePage = currentRoute.path === '/' || currentRoute.path === '/home' || currentRoute.path === '/index'
    
    // 如果有历史记录且不是首页，则显示返回按钮
    return historyLength > 1 && !isHomePage
  } catch (error) {
    console.warn('返回按钮显示检测失败:', error)
    return false
  }
})

// 实际显示的左侧箭头状态
const showLeftArrow = computed(() => {
  return shouldShowBackButton.value
})

// 插槽定义
defineSlots<{
  /** 左侧插槽 */
  left?: () => any
  /** 标题插槽 */
  title?: () => any
  /** 右侧插槽 */
  right?: () => any
  /** 左侧箭头插槽 */
  'left-arrow'?: () => any
}>()

// 主题类名 - 基于props.themeMode和实际主题状态
const themeClass = computed(() => {
  // 如果props指定了主题模式，优先使用props
  if (props.themeMode === 'dark') {
    return 'sdkwork-navbar--dark'
  } else if (props.themeMode === 'light') {
    return 'sdkwork-navbar--light'
  }
  
  // 自动模式下使用当前实际主题
  return currentTheme.value === 'dark' ? 'sdkwork-navbar--dark' : 'sdkwork-navbar--light'
})

// 检测是否真正存在安全区域（简化版）
const hasRealSafeArea = computed(() => {
  if (!props.safeAreaInsetTop) return false

  // 检查是否在移动设备上运行
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /iphone|ipad|ipod|android/.test(userAgent)

  // 如果不是移动设备，不需要安全区域
  if (!isMobile) return false

  // 检查CSS环境变量支持
  if (window.CSS && window.CSS.supports) {
    try {
      return window.CSS.supports('top: env(safe-area-inset-top)') || 
             window.CSS.supports('top: constant(safe-area-inset-top)')
    } catch (error) {
      console.warn('CSS环境变量检测失败:', error)
      return false
    }
  }

  return false
})

// 计算总高度（导航栏高度 + 安全区域高度）
const totalHeight = computed(() => {
  return props.height
})

// 左侧按钮点击事件
const handleLeftClick = () => {
  // 如果启用了自动返回且有路由历史，则执行路由返回
  if (props.autoBack && shouldShowBackButton.value) {
    try {
      // 使用路由返回
      router.back()
    } catch (error) {
      console.warn('路由返回失败，尝试使用浏览器返回:', error)
      // 备用方案：使用浏览器历史返回
      window.history.back()
    }
  } else {
    // 否则触发自定义事件
    emit('click-left')
  }
}

// 右侧按钮点击事件
const handleRightClick = () => {
  emit('click-right')
}

// Expose methods
defineExpose({
  /** 设置导航栏标题 */
  setTitle: (title: string) => {
    // 可以通过ref调用此方法动态设置标题
    console.log('Set title:', title)
  },
  /** 获取当前主题模式 */
  getThemeMode: () => {
    return props.themeMode
  },
  /** 获取是否暗黑模式 */
  isDarkMode: () => {
    // 基于props.themeMode和实际主题状态判断
    if (props.themeMode === 'dark') return true
    if (props.themeMode === 'light') return false
    return isDarkMode.value
  }
})
</script>

<style lang="scss" scoped>
.sdkwork-navbar__placeholder-space {
  width: 100%;
  background: transparent;
}

.sdkwork-navbar {
  position: relative;
  width: 100%;
  background: var(--sdkwork-navbar-background, #fff);
  color: var(--sdkwork-navbar-text-color, #323233);
  transition: background-color 0.3s ease, color 0.3s ease;

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  &--border {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--sdkwork-navbar-border-color, #ebedf0);
      transform: scaleY(0.5);
      transform-origin: center bottom;
      transition: background-color 0.3s ease;
      
      /* 兼容性处理：针对不支持transform的浏览器 */
      @media not (transform: scaleY(0.5)) {
        height: 0.5px;
        transform: none;
      }
      
      /* 微信浏览器特殊处理 */
      @supports not (transform: scaleY(0.5)) {
        height: 0.5px;
        transform: none;
      }
    }
  }

  // 浅色主题
  &--light {
    --sdkwork-navbar-background: #fff;
    --sdkwork-navbar-text-color: #323233;
    --sdkwork-navbar-arrow-color: #969799;
    --sdkwork-navbar-border-color: #ebedf0;
  }

  // 深色主题
  &--dark {
    --sdkwork-navbar-background: #1a1a1a;
    --sdkwork-navbar-text-color: #fff;
    --sdkwork-navbar-arrow-color: #ccc;
    --sdkwork-navbar-border-color: #333;
  }

  // 自动主题检测
  &:not(.sdkwork-navbar--light):not(.sdkwork-navbar--dark) {
    @media (prefers-color-scheme: dark) {
      --sdkwork-navbar-background: #1a1a1a;
      --sdkwork-navbar-text-color: #fff;
      --sdkwork-navbar-arrow-color: #ccc;
      --sdkwork-navbar-border-color: #333;
    }

    @media (prefers-color-scheme: light) {
      --sdkwork-navbar-background: #fff;
      --sdkwork-navbar-text-color: #323233;
      --sdkwork-navbar-arrow-color: #969799;
      --sdkwork-navbar-border-color: #ebedf0;
    }
  }

  &__placeholder {
    width: 100%;
    background: inherit;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--sdkwork-padding-md, 16px);
    color: inherit;
  }

  &__left,
  &__right {
    display: flex;
    align-items: center;
    flex: 1;

    &-btn {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      transition: opacity 0.2s ease;

      &:active {
        opacity: 0.7;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }

  &__left {
    justify-content: flex-start;
  }

  &__right {
    justify-content: flex-end;
  }

  &__title {
    flex: 2;
    text-align: center;
    font-size: var(--sdkwork-navbar-title-font-size, 16px);
    font-weight: var(--sdkwork-font-weight-bold, 500);
    max-width: 50%;
    &-text {
      display: block;
      max-width: 60%;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__arrow {
    display: flex;
    align-items: center;
    margin-right: 4px;
    color: var(--sdkwork-navbar-arrow-color, #969799);
    transition: color 0.3s ease;
  }

  &__text {
    font-size: var(--sdkwork-navbar-text-font-size, 14px);
    color: inherit;
  }
}

// 响应式适配
@media (max-width: 320px) {
  .sdkwork-navbar {
    &__content {
      padding: 0 var(--sdkwork-padding-sm, 12px);
    }

    &__title {
      font-size: 15px;
       max-width: 50%;
    }
  }
}

// 移动端优化
@media (max-width: 768px) {
  .sdkwork-navbar {
    &__title-text {
      max-width: 70%;
    }
  }
}

// 平板设备适配
@media (min-width: 769px) and (max-width: 1024px) {
  .sdkwork-navbar {
    &__content {
      padding: 0 var(--sdkwork-padding-lg, 20px);
    }

    &__title {
      font-size: 17px;
      max-width: 50%;
    }
  }
}

// 无障碍访问支持
.sdkwork-navbar {

  &__left-btn,
  &__right-btn {
    &:focus-visible {
      outline: 2px solid var(--sdkwork-navbar-arrow-color, #969799);
      outline-offset: 2px;
      border-radius: 4px;
    }
    
    /* 兼容性处理：针对不支持focus-visible的浏览器 */
    &:focus {
      outline: 2px solid var(--sdkwork-navbar-arrow-color, #969799);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }
}

// 高对比度模式支持
@media (prefers-contrast: high) {
  .sdkwork-navbar {
    &--light {
      --sdkwork-navbar-border-color: #000;
    }

    &--dark {
      --sdkwork-navbar-border-color: #fff;
    }
  }
}

// 减少动画支持
@media (prefers-reduced-motion: reduce) {
  .sdkwork-navbar {
    transition: none;

    &__left-btn,
    &__right-btn {
      transition: none;
    }

    &__arrow {
      transition: none;
    }
  }
}

// 微信浏览器特殊兼容性处理
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .sdkwork-navbar {
    /* 针对WebKit内核浏览器的优化 */
    -webkit-tap-highlight-color: transparent;
    
    &__left-btn,
    &__right-btn {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
    }
  }
}

// 移动端触摸优化
.sdkwork-navbar {
  /* 防止iOS Safari中的点击延迟 */
  touch-action: manipulation;
  
  /* 防止文本选择 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  
  /* 防止长按菜单 */
  -webkit-touch-callout: none;
  
  &__left-btn,
  &__right-btn {
    /* 优化触摸反馈 */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
    tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
}

// 旧版本浏览器兼容性处理
.sdkwork-navbar {
  /* 针对不支持CSS变量的浏览器 */
  background: #fff;
  background: var(--sdkwork-navbar-background, #fff);
  color: #323233;
  color: var(--sdkwork-navbar-text-color, #323233);
  
  &--dark {
    background: #1a1a1a;
    background: var(--sdkwork-navbar-background, #1a1a1a);
    color: #fff;
    color: var(--sdkwork-navbar-text-color, #fff);
  }
}

// 微信浏览器安全区域适配
@supports (top: constant(safe-area-inset-top)) {
  .sdkwork-navbar__placeholder {
    height: constant(safe-area-inset-top);
  }
}

@supports (top: env(safe-area-inset-top)) {
  .sdkwork-navbar__placeholder {
    height: env(safe-area-inset-top);
  }
}

// 微信浏览器特殊兼容性处理
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .sdkwork-navbar {
    /* 针对WebKit内核浏览器的优化 */
    -webkit-tap-highlight-color: transparent;
    
    &__left-btn,
    &__right-btn {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
    }
  }
}

// 移动端触摸优化
.sdkwork-navbar {
  /* 防止iOS Safari中的点击延迟 */
  touch-action: manipulation;
  
  /* 防止文本选择 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  
  /* 防止长按菜单 */
  -webkit-touch-callout: none;
  
  &__left-btn,
  &__right-btn {
    /* 优化触摸反馈 */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
    tap-highlight-color: rgba(0, 0, 0, 0.1);
  }
}

// 旧版本浏览器兼容性处理
.sdkwork-navbar {
  /* 针对不支持CSS变量的浏览器 */
  background: #fff;
  background: var(--sdkwork-navbar-background, #fff);
  color: #323233;
  color: var(--sdkwork-navbar-text-color, #323233);
  
  &--dark {
    background: #1a1a1a;
    background: var(--sdkwork-navbar-background, #1a1a1a);
    color: #fff;
    color: var(--sdkwork-navbar-text-color, #fff);
  }
}

// 微信浏览器安全区域适配
@supports (top: constant(safe-area-inset-top)) {
  .sdkwork-navbar__placeholder {
    height: constant(safe-area-inset-top);
  }
}

@supports (top: env(safe-area-inset-top)) {
  .sdkwork-navbar__placeholder {
    height: env(safe-area-inset-top);
  }
}
</style>