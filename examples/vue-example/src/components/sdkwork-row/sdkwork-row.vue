<template>
  <div
    class="sdkwork-row"
    :class="[
      {
        'sdkwork-row--flex': type === 'flex',
        'sdkwork-row--justify-center': justify === 'center',
        'sdkwork-row--justify-end': justify === 'end',
        'sdkwork-row--justify-space-between': justify === 'space-between',
        'sdkwork-row--justify-space-around': justify === 'space-around',
        'sdkwork-row--align-top': align === 'top',
        'sdkwork-row--align-center': align === 'center',
        'sdkwork-row--align-bottom': align === 'bottom',
        'sdkwork-row--wrap': wrap
      },
      themeClass
    ]"
    :style="computedStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

// Props 定义 - 兼容 vant 的 Row 组件
interface Props {
  /** 布局方式，可选值为 flex */
  type?: string
  /** Flex 主轴对齐方式，可选值为 end center space-around space-between */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
  /** Flex 交叉轴对齐方式，可选值为 top center bottom */
  align?: 'top' | 'center' | 'bottom'
  /** 是否自动换行 */
  wrap?: boolean
  /** 栅格间隔，默认单位为 px */
  gutter?: string | number
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  justify: 'start',
  align: 'top',
  wrap: true,
  gutter: 0,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
}>()

// 为子组件提供栅格间隔
const gutterValue = computed(() => {
  if (typeof props.gutter === 'number') return props.gutter
  if (typeof props.gutter === 'string') {
    const num = parseInt(props.gutter)
    return isNaN(num) ? 0 : num
  }
  return 0
})

provide('sdkwork-row-gutter', gutterValue)

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
  return isDarkMode.value ? 'sdkwork-row--dark' : 'sdkwork-row--light'
})

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, string | number> = {
    ...props.customStyle
  }

  // 处理栅格间隔 - 与 Vant 一致
  if (props.gutter) {
    const gutterValue = typeof props.gutter === 'number' ? `${props.gutter / 2}px` : `calc(${props.gutter} / 2)`
    style.marginLeft = `-${gutterValue}`
    style.marginRight = `-${gutterValue}`
  }

  return style
})

// 处理点击事件
const handleClick = (event: Event) => {
  emit('click', event)
  props.onClick?.(event)
}

// 暴露方法
defineExpose({
  /** 获取行配置 */
  getConfig: () => ({
    gutter: props.gutter,
    type: props.type,
    justify: props.justify,
    align: props.align,
    wrap: props.wrap
  })
})
</script>

<style scoped>
.sdkwork-row {
  box-sizing: border-box;
  display: block;
  /* 清除浮动 - 解决高度塌陷问题 */
  overflow: hidden;
}

.sdkwork-row--flex {
  display: flex;
  flex-wrap: wrap;
}

.sdkwork-row--flex.sdkwork-row--nowrap {
  flex-wrap: nowrap;
}

.sdkwork-row--justify-center {
  justify-content: center;
}

.sdkwork-row--justify-end {
  justify-content: flex-end;
}

.sdkwork-row--justify-space-between {
  justify-content: space-between;
}

.sdkwork-row--justify-space-around {
  justify-content: space-around;
}

.sdkwork-row--align-top {
  align-items: flex-start;
}

.sdkwork-row--align-center {
  align-items: center;
}

.sdkwork-row--align-bottom {
  align-items: flex-end;
}

.sdkwork-row--wrap {
  flex-wrap: wrap;
}

/* 主题样式 */
.sdkwork-row--light {
  --sdkwork-row-bg-color: transparent;
}

.sdkwork-row--dark {
  --sdkwork-row-bg-color: var(--sdkwork-dark-bg-color, #1a1a1a);
  background-color: var(--sdkwork-row-bg-color);
}
</style>