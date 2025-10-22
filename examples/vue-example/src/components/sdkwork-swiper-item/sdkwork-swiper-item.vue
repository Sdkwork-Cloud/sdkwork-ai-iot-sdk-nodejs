<template>
  <!-- 使用Vant的SwipeItem组件作为基础 -->
  <van-swipe-item
    :class="[customClass, themeClass]"
    :style="itemStyles"
  >
    <slot />
  </van-swipe-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props定义 - 与Vant SwipeItem组件保持一致
interface Props {
  // 自定义类名
  customClass?: string
  
  // 主题配置
  themeMode?: 'dark' | 'light' | 'auto'
  
  // 自定义样式
  width?: number | string
  height?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  customClass: '',
  themeMode: 'auto',
  width: '',
  height: ''
})

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
  return isDarkMode.value ? 'sdkwork-swiper-item--dark' : 'sdkwork-swiper-item--light'
})

// 样式计算
const itemStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return styles
})
</script>

<style scoped lang="scss">
:deep(.van-swipe-item) {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sdkwork-swiper-item-background, transparent);
  color: var(--sdkwork-swiper-item-color, inherit);
  
  /* 确保内容正确显示 */
  > * {
    width: 100%;
    height: 100%;
  }
}

/* 浅色主题 */
.sdkwork-swiper-item--light {
  --sdkwork-swiper-item-background: transparent;
  --sdkwork-swiper-item-color: inherit;
}

/* 深色主题 */
.sdkwork-swiper-item--dark {
  --sdkwork-swiper-item-background: transparent;
  --sdkwork-swiper-item-color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.van-swipe-item) {
    /* 移动端优化 */
  }
}
</style>