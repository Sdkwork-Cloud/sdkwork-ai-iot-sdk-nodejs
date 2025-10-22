<template>
  <div
    class="sdkwork-cell-group"
    :class="[
      {
        'sdkwork-cell-group--inset': inset,
        'sdkwork-cell-group--borderless': !border,
        'sdkwork-cell-group--card': card
      },
      themeClass
    ]"
    :style="computedStyle"
  >
    <!-- 标题 -->
    <div v-if="$slots.title || title" class="sdkwork-cell-group__title">
      <slot name="title">
        <span v-if="title" class="sdkwork-cell-group__title-text">{{ title }}</span>
      </slot>
    </div>
    
    <!-- 内容区域 -->
    <div class="sdkwork-cell-group__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义 - 兼容 vant 的 CellGroup 组件
interface Props {
  /** 分组标题 */
  title?: string
  /** 是否显示外边框 */
  border?: boolean
  /** 是否为圆角卡片风格 */
  card?: boolean
  /** 是否为圆角卡片风格 */
  inset?: boolean
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  border: true,
  card: false,
  inset: false,
  themeMode: 'auto'
})

// 插槽定义
defineSlots<{
  /** 标题插槽 */
  title?: () => any
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
  return isDarkMode.value ? 'sdkwork-cell-group--dark' : 'sdkwork-cell-group--light'
})

// 计算样式
const computedStyle = computed(() => ({
  ...props.customStyle
}))

// 暴露方法
defineExpose({
  /** 获取分组标题 */
  getTitle: () => props.title,
  /** 是否显示边框 */
  hasBorder: () => props.border,
  /** 是否为卡片风格 */
  isCard: () => props.card || props.inset
})
</script>

<style scoped lang="scss">
.sdkwork-cell-group {
  background: var(--sdkwork-cell-group-background, transparent);
  
  // 卡片风格
  &--card {
    margin: 16px;
    border-radius: 8px;
    overflow: hidden;
    
    .sdkwork-cell-group__content {
      border-radius: 8px;
    }
  }
  
  // 内嵌风格
  &--inset {
    margin: 0 16px;
    border-radius: 8px;
    overflow: hidden;
    
    .sdkwork-cell-group__content {
      border-radius: 8px;
    }
  }
  
  // 无边框
  &--borderless {
    .sdkwork-cell-group__content {
      border: none;
      border-radius: 0;
    }
  }
}

.sdkwork-cell-group__title {
  padding: 16px 16px 8px;
  color: var(--sdkwork-cell-group-title-color, #969799);
  font-size: 14px;
  line-height: 16px;
  
  .sdkwork-cell-group__title-text {
    display: block;
  }
}

.sdkwork-cell-group__content {
  background: var(--sdkwork-cell-group-content-background, #fff);
  
  // 有边框时的样式
  &:not(.sdkwork-cell-group--borderless) {
    border: 1px solid var(--sdkwork-cell-group-border-color, #ebedf0);
    border-radius: 2px;
  }
  
  // 处理内部单元格的边框
  :deep(.sdkwork-cell) {
    &:last-child::after {
      display: none;
    }
    
    // 在卡片风格中移除内部边框
    .sdkwork-cell-group--card &,
    .sdkwork-cell-group--inset & {
      &::after {
        left: 16px;
      }
      
      &:last-child::after {
        display: none;
      }
    }
  }
}

// 浅色主题
.sdkwork-cell-group--light {
  --sdkwork-cell-group-background: transparent;
  --sdkwork-cell-group-title-color: #969799;
  --sdkwork-cell-group-content-background: #fff;
  --sdkwork-cell-group-border-color: #ebedf0;
}

// 深色主题
.sdkwork-cell-group--dark {
  --sdkwork-cell-group-background: transparent;
  --sdkwork-cell-group-title-color: #888;
  --sdkwork-cell-group-content-background: #1a1a1a;
  --sdkwork-cell-group-border-color: #3a3a3a;
}
</style>