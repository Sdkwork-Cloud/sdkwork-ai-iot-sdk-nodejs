<template>
  <div class="sdkwork-container" :class="containerClasses" :style="containerStyles">
    <!-- 主要内容插槽 -->
    <slot />

    <!-- 安全区域适配 -->
    <div v-if="safeArea" class="safe-area-inset"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 容器主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否启用安全区域适配 */
  safeArea?: boolean
  /** 是否可滚动 */
  scrollable?: boolean
  /** 容器宽度 */
  width?: string | number
  /** 容器高度 */
  height?: string | number
  /** 最大宽度 */
  maxWidth?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 内边距 */
  padding?: string | number
  /** 外边距 */
  margin?: string | number
  /** 背景颜色 */
  backgroundColor?: string
  /** 圆角大小 */
  borderRadius?: string | number
  /** 阴影 */
  boxShadow?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 边框颜色 */
  borderColor?: string
  /** 是否启用flex布局 */
  flex?: boolean
  /** flex方向 */
  flexDirection?: 'row' | 'column'
  /** 水平对齐方式 */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /** 垂直对齐方式 */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  /** 是否启用网格布局 */
  grid?: boolean
  /** 网格列数 */
  gridColumns?: number
  /** 网格间距 */
  gridGap?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  themeMode: 'auto',
  safeArea: false,
  scrollable: false,
  width: '100%',
  height: 'auto',
  maxWidth: '100%',
  maxHeight: 'none',
  padding: '0',
  margin: '0',
  backgroundColor: 'transparent',
  borderRadius: '0',
  boxShadow: 'none',
  bordered: false,
  borderColor: '#ebedf0',
  flex: false,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  grid: false,
  gridColumns: 1,
  gridGap: '0'
})

// 计算容器类名
const containerClasses = computed(() => ({
  'sdkwork-container--bordered': props.bordered,
  'sdkwork-container--flex': props.flex,
  'sdkwork-container--grid': props.grid,
  'sdkwork-container--safe-area': props.safeArea,
  [`sdkwork-container--theme-${props.themeMode}`]: props.themeMode !== 'auto'
}))

// 计算容器样式
const containerStyles = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  ...(props.height !== '100%' && { height: typeof props.height === 'number' ? `${props.height}px` : props.height }),
  maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
  maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
  padding: typeof props.padding === 'number' ? `${props.padding}px` : props.padding,
  margin: typeof props.margin === 'number' ? `${props.margin}px` : props.margin,
  backgroundColor: props.backgroundColor,
  borderRadius: typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
  boxShadow: props.boxShadow,
  borderColor: props.borderColor,
  ...(props.flex && {
    display: 'flex',
    flexDirection: props.flexDirection,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems
  }),
  ...(props.grid && {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.gridColumns}, 1fr)`,
    gap: typeof props.gridGap === 'number' ? `${props.gridGap}px` : props.gridGap
  })
}))

// 暴露方法给父组件
defineExpose({
  scrollToTop: () => {
    // 滚动到顶部功能需要父容器实现
    console.warn('scrollToTop方法需要父容器实现滚动功能')
  },
  scrollToBottom: () => {
    // 滚动到底部功能需要父容器实现
    console.warn('scrollToBottom方法需要父容器实现滚动功能')
  }
})
</script>

<style scoped lang="scss">
.sdkwork-container {
  position: relative;
  box-sizing: border-box;
  flex: 1;
  min-height: auto;
  overflow: visible;

  // 基础样式
  &--bordered {
    border: 1px solid v-bind(borderColor);
  }

  // 主题样式
  &--theme-light {
    background-color: #ffffff;
    color: #333333;
  }

  &--theme-dark {
    background-color: #1a1a1a;
    color: #ffffff;
  }

  // 安全区域适配
  &--safe-area {
    padding-bottom: env(safe-area-inset-bottom);

    .safe-area-inset {
      height: env(safe-area-inset-bottom);
      background: inherit;
    }
  }


}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-container {
    // 响应式样式调整
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .sdkwork-container {
    &--theme-auto {
      background-color: #1a1a1a;
      color: #ffffff;
    }
  }
}

// 打印样式
@media print {
  .sdkwork-container {
    .safe-area-inset {
      display: none;
    }
  }
}
</style>