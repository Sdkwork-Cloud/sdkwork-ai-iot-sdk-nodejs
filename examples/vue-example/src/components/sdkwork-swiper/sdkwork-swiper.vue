<template>
  <!-- 使用Vant的Swipe组件作为基础 -->
  <van-swipe
    ref="swipeRef"
    :autoplay="autoplay"
    :duration="duration"
    :initial-swipe="initialSwipe"
    :loop="loop"
    :show-indicators="showIndicators"
    :indicator-color="indicatorColor"
    :vertical="vertical"
    :touchable="touchable"
    :stop-propagation="stopPropagation"
    :lazy-render="lazyRender"
    :width="width"
    :height="height"
    :class="[customClass, themeClass]"
    @change="handleChange"
  >
    <slot />
    
    <!-- 指示器插槽 -->
    <template v-if="$slots.indicator" #indicator>
      <slot name="indicator" />
    </template>
  </van-swipe>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SwipeInstance } from 'vant'

// 使用插槽
const $slots = defineSlots<{
  default?: (props: {}) => any
  indicator?: (props: {}) => any
}>()

// Props定义 - 与Vant Swipe组件保持一致
interface Props {
  // 基础属性
  autoplay?: number
  duration?: number
  initialSwipe?: number
  loop?: boolean
  showIndicators?: boolean
  indicatorColor?: string
  vertical?: boolean
  touchable?: boolean
  stopPropagation?: boolean
  lazyRender?: boolean
  width?: number | string
  height?: number | string
  
  // 自定义类名
  customClass?: string
  
  // 主题配置
  themeMode?: 'dark' | 'light' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: 0,
  duration: 500,
  initialSwipe: 0,
  loop: true,
  showIndicators: true,
  indicatorColor: '#1989fa',
  vertical: false,
  touchable: true,
  stopPropagation: false,
  lazyRender: true,
  width: '',
  height: '',
  customClass: '',
  themeMode: 'auto'
})

// Emits定义 - 与Vant Swipe组件保持一致
const emit = defineEmits<{
  'change': [index: number]
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
  return isDarkMode.value ? 'sdkwork-swiper--dark' : 'sdkwork-swiper--light'
})

// 引用Vant Swipe实例
const swipeRef = ref<SwipeInstance | null>(null)

// 事件处理
const handleChange = (index: number) => {
  emit('change', index)
}

// 方法 - 与Vant Swipe组件保持一致
const prev = () => {
  swipeRef.value?.prev()
}

const next = () => {
  swipeRef.value?.next()
}

const swipeTo = (index: number, options?: { immediate?: boolean }) => {
  swipeRef.value?.swipeTo(index, options)
}

const resize = () => {
  swipeRef.value?.resize()
}

// Expose方法
defineExpose({
  prev,
  next,
  swipeTo,
  resize
})

// 监听属性变化
watch(() => props.autoplay, (newAutoplay) => {
  if (swipeRef.value) {
    // 重新初始化轮播
    swipeRef.value.resize()
  }
})

watch(() => props.loop, () => {
  if (swipeRef.value) {
    swipeRef.value.resize()
  }
})
</script>

<style scoped lang="scss">
:deep(.van-swipe) {
  position: relative;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
}

:deep(.van-swipe__track) {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  touch-action: pan-y pinch-zoom;
}

:deep(.van-swipe-item) {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}

:deep(.van-swipe__indicators) {
  position: absolute;
  bottom: var(--sdkwork-swiper-indicator-bottom, 12px);
  left: 50%;
  display: flex;
  transform: translateX(-50%);
  z-index: 2;
}

:deep(.van-swipe__indicator) {
  width: var(--sdkwork-swiper-indicator-size, 6px);
  height: var(--sdkwork-swiper-indicator-size, 6px);
  border-radius: 100%;
  background: var(--sdkwork-swiper-indicator-background, rgba(255, 255, 255, 0.3));
  opacity: 0.3;
  margin: 0 3px;
  transition: all 0.3s ease;
  
  &.van-swipe__indicator--active {
    opacity: 1;
    background: var(--sdkwork-swiper-indicator-active-background, #fff);
    transform: scale(1.2);
  }
}

/* 浅色主题 */
.sdkwork-swiper--light {
  --sdkwork-swiper-indicator-background: rgba(0, 0, 0, 0.3);
  --sdkwork-swiper-indicator-active-background: #000;
  --sdkwork-swiper-indicator-bottom: 12px;
  --sdkwork-swiper-indicator-size: 6px;
}

/* 深色主题 */
.sdkwork-swiper--dark {
  --sdkwork-swiper-indicator-background: rgba(255, 255, 255, 0.3);
  --sdkwork-swiper-indicator-active-background: #fff;
  --sdkwork-swiper-indicator-bottom: 12px;
  --sdkwork-swiper-indicator-size: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.van-swipe__indicators) {
    bottom: var(--sdkwork-swiper-indicator-bottom-mobile, 8px);
  }
  
  :deep(.van-swipe__indicator) {
    width: var(--sdkwork-swiper-indicator-size-mobile, 5px);
    height: var(--sdkwork-swiper-indicator-size-mobile, 5px);
    margin: 0 2px;
  }
}

/* 垂直模式 */
:deep(.van-swipe--vertical) {
  .van-swipe__indicators {
    right: var(--sdkwork-swiper-indicator-right, 12px);
    left: auto;
    top: 50%;
    bottom: auto;
    flex-direction: column;
    transform: translateY(-50%);
  }
  
  .van-swipe__indicator {
    margin: 3px 0;
  }
}
</style>