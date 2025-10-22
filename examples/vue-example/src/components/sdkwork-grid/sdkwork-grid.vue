<template>
  <div
    class="sdkwork-grid"
    :class="[
      {
        'sdkwork-grid--bordered': bordered,
        'sdkwork-grid--clickable': clickable,
        'sdkwork-grid--center': center,
        'sdkwork-grid--square': square,
        'sdkwork-grid--reverse': reverse,
        'sdkwork-grid--card': card,
        'sdkwork-grid--hoverable': hoverable
      },
      themeClass
    ]"
    :style="computedStyle"
    @click="handleClick"
  >
    <!-- 网格头部 -->
    <div v-if="$slots.header || title || description" class="sdkwork-grid__header">
      <slot name="header">
        <div v-if="title || description" class="sdkwork-grid__header-content">
          <h3 v-if="title" class="sdkwork-grid__title">{{ title }}</h3>
          <p v-if="description" class="sdkwork-grid__description">{{ description }}</p>
        </div>
      </slot>
    </div>

    <!-- 网格内容 -->
    <div class="sdkwork-grid__content" :style="contentStyle">
      <div class="sdkwork-grid__items" :style="gridStyle">
        <slot />
      </div>
    </div>

    <!-- 网格底部 -->
    <div v-if="$slots.footer" class="sdkwork-grid__footer">
      <slot name="footer" />
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="sdkwork-grid__loading">
      <slot name="loading">
        <van-loading size="24px" vertical>加载中...</van-loading>
      </slot>
    </div>

    <!-- 空状态 -->
    <div v-else-if="empty" class="sdkwork-grid__empty">
      <slot name="empty">
        <van-empty description="暂无数据" image="search">
          <template #description>
            <div class="empty-description">
              <p>暂时没有数据</p>
              <p class="empty-tip">{{ emptyText }}</p>
            </div>
          </template>
        </van-empty>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义 - 兼容 Vant Grid 组件并扩展功能
interface Props {
  /** 网格标题 */
  title?: string
  /** 网格描述 */
  description?: string
  /** 布局方式，可选值为 flex */
  type?: string
  /** Flex 主轴对齐方式 */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
  /** Flex 交叉轴对齐方式 */
  align?: 'top' | 'center' | 'bottom'
  /** 是否自动换行 */
  wrap?: boolean
  /** 栅格间隔 */
  gutter?: string | number
  /** 列数 */
  columns?: number
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
  /** 是否卡片模式 */
  card?: boolean
  /** 是否显示悬停效果 */
  hoverable?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 是否为空状态 */
  empty?: boolean
  /** 空状态提示文字 */
  emptyText?: string
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
  /** 内容区域内边距 */
  contentPadding?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  justify: 'start',
  align: 'top',
  wrap: true,
  gutter: 0,
  columns: 4,
  bordered: false,
  clickable: false,
  center: false,
  square: false,
  reverse: false,
  card: false,
  hoverable: false,
  loading: false,
  empty: false,
  emptyText: '您可以尝试刷新页面或调整筛选条件',
  themeMode: 'auto',
  contentPadding: ''
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
  /** 头部插槽 - 网格顶部区域 */
  header?: () => any
  /** 底部插槽 - 网格底部区域 */
  footer?: () => any
  /** 加载状态插槽 */
  loading?: () => any
  /** 空状态插槽 */
  empty?: () => any
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
  return isDarkMode.value ? 'sdkwork-grid--dark' : 'sdkwork-grid--light'
})

// 计算样式
const computedStyle = computed(() => ({
  ...props.customStyle,
  cursor: props.clickable ? 'pointer' : 'default'
}))

// 网格样式
const gridStyle = computed(() => {
  const style: Record<string, string | number> = {}
  
  // 设置CSS变量用于网格布局
  style['--grid-columns'] = props.columns
  style['--grid-gap'] = typeof props.gutter === 'number' ? `${props.gutter}px` : props.gutter
  
  return style
})

// 内容区域样式
const contentStyle = computed(() => {
  const style: Record<string, string | number> = {}
  
  // 设置内容区域内边距
  if (props.contentPadding) {
    style.padding = typeof props.contentPadding === 'number' ? `${props.contentPadding}px` : props.contentPadding
  }
  
  return style
})

// 处理点击事件
const handleClick = (event: Event) => {
  if (props.loading || props.empty) return
  
  emit('click', event)
  props.onClick?.(event)
}

// 暴露方法
defineExpose({
  /** 获取网格配置 */
  getConfig: () => ({
    columns: props.columns,
    gutter: props.gutter,
    type: props.type,
    justify: props.justify,
    align: props.align,
    bordered: props.bordered,
    clickable: props.clickable,
    center: props.center,
    square: props.square,
    reverse: props.reverse,
    card: props.card,
    hoverable: props.hoverable
  }),
  /** 是否正在加载 */
  isLoading: () => props.loading,
  /** 是否为空状态 */
  isEmpty: () => props.empty
})
</script>

<style scoped lang="scss">
.sdkwork-grid {
  position: relative;
  background: var(--sdkwork-grid-background, #fff);
  border-radius: var(--sdkwork-grid-border-radius, 8px);
  transition: all 0.3s ease-in-out;

  // 边框模式
  &--bordered {
    border: 1px solid var(--sdkwork-grid-border-color, #ebedf0);
  }

  // 卡片模式
  &--card {
    box-shadow: 0 2px 12px var(--sdkwork-grid-shadow-color, rgba(0, 0, 0, 0.1));
    padding: var(--sdkwork-grid-card-padding, 16px);
  }

  // 悬停效果
  &--hoverable:hover {
    box-shadow: 0 4px 16px var(--sdkwork-grid-hover-shadow-color, rgba(0, 0, 0, 0.15));
    transform: translateY(-2px);
  }

  // 点击效果
  &--clickable {
    cursor: pointer;
    
    &:active {
      transform: scale(0.98);
    }
  }

  // 加载状态
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--sdkwork-grid-loading-background, rgba(255, 255, 255, 0.9));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: inherit;
  }

  // 空状态
  &__empty {
    padding: var(--sdkwork-grid-empty-padding, 40px 16px);
    text-align: center;
  }

  // 头部
  &__header {
    padding: var(--sdkwork-grid-header-padding, 16px 16px 12px);
    border-bottom: 1px solid var(--sdkwork-grid-header-border-color, #f0f0f0);

    &-content {
      .sdkwork-grid__title {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--sdkwork-grid-title-color, #323233);
        line-height: 1.4;
      }

      .sdkwork-grid__description {
        margin: 0;
        font-size: 14px;
        color: var(--sdkwork-grid-description-color, #969799);
        line-height: 1.5;
      }
    }
  }

  // 内容区域
  &__content {
    padding: var(--sdkwork-grid-content-padding, 12px);
  }

  // 网格项容器
  &__items {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns, 4), 1fr);
    gap: var(--grid-gap, 12px);
    align-items: stretch;
    
    // 确保网格项高度一致
    & > * {
      height: 100%;
    }
  }

  // 底部
  &__footer {
    padding: var(--sdkwork-grid-footer-padding, 12px 16px 16px);
    border-top: 1px solid var(--sdkwork-grid-footer-border-color, #f0f0f0);
  }
}

// 浅色主题
.sdkwork-grid--light {
  --sdkwork-grid-background: #fff;
  --sdkwork-grid-border-color: #ebedf0;
  --sdkwork-grid-shadow-color: rgba(0, 0, 0, 0.1);
  --sdkwork-grid-hover-shadow-color: rgba(0, 0, 0, 0.15);
  --sdkwork-grid-border-radius: 8px;
  --sdkwork-grid-card-padding: 16px;
  --sdkwork-grid-loading-background: rgba(255, 255, 255, 0.9);
  --sdkwork-grid-empty-padding: 40px 16px;
  --sdkwork-grid-header-padding: 16px 16px 12px;
  --sdkwork-grid-header-border-color: #f0f0f0;
  --sdkwork-grid-title-color: #323233;
  --sdkwork-grid-description-color: #969799;
  --sdkwork-grid-content-padding: 12px;
  --sdkwork-grid-footer-padding: 12px 16px 16px;
  --sdkwork-grid-footer-border-color: #f0f0f0;
}

// 深色主题
.sdkwork-grid--dark {
  --sdkwork-grid-background: #1a1a1a;
  --sdkwork-grid-border-color: #3a3a3a;
  --sdkwork-grid-shadow-color: rgba(0, 0, 0, 0.3);
  --sdkwork-grid-hover-shadow-color: rgba(0, 0, 0, 0.4);
  --sdkwork-grid-border-radius: 8px;
  --sdkwork-grid-card-padding: 16px;
  --sdkwork-grid-loading-background: rgba(26, 26, 26, 0.9);
  --sdkwork-grid-empty-padding: 40px 16px;
  --sdkwork-grid-header-padding: 16px 16px 12px;
  --sdkwork-grid-header-border-color: #2a2a2a;
  --sdkwork-grid-title-color: #e0e0e0;
  --sdkwork-grid-description-color: #888;
  --sdkwork-grid-content-padding: 12px;
  --sdkwork-grid-footer-padding: 12px 16px 16px;
  --sdkwork-grid-footer-border-color: #2a2a2a;
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-grid {
    --sdkwork-grid-card-padding: 12px;
    --sdkwork-grid-content-padding: 12px;
    
    &__header {
      --sdkwork-grid-header-padding: 12px 12px 8px;
    }

    &__footer {
      --sdkwork-grid-footer-padding: 8px 12px 12px;
    }
  }
}
</style>