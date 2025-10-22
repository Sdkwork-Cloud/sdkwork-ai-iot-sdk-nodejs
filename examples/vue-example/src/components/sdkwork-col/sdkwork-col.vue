<template>
  <div
    class="sdkwork-col"
    :class="[
      {
        [`sdkwork-col--${computedSpan}`]: computedSpan && computedSpan <= 24,
        [`sdkwork-col--offset-${computedOffset}`]: computedOffset && computedOffset <= 24,
        [`sdkwork-col--order-${order}`]: order,
        'sdkwork-col--flex': flex,
        'sdkwork-col--align-center': align === 'center',
        'sdkwork-col--align-bottom': align === 'bottom',
        'sdkwork-col--xs': hasBreakpoint('xs'),
        'sdkwork-col--sm': hasBreakpoint('sm'),
        'sdkwork-col--md': hasBreakpoint('md'),
        'sdkwork-col--lg': hasBreakpoint('lg'),
        'sdkwork-col--xl': hasBreakpoint('xl')
      },
      themeClass
    ]"
    :style="computedStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'

// Props 定义 - 兼容 vant 的 Col 组件
interface Props {
  /** 列元素宽度（共24等分），可选值为 0-24 的整数或 auto */
  span?: string | number
  /** 列元素偏移距离（共24等分），可选值为 0-24 的整数 */
  offset?: string | number
  /** 列元素顺序，用于 flex 布局下排序 */
  order?: string | number
  /** flex 布局属性 */
  flex?: string | number
  /** 内容对齐方式，可选值为 center */
  align?: 'center' | 'top' | 'bottom'
  /** 响应式配置，支持 xs/sm/md/lg/xl 断点 */
  xs?: string | number | { span?: string | number; offset?: string | number }
  sm?: string | number | { span?: string | number; offset?: string | number }
  md?: string | number | { span?: string | number; offset?: string | number }
  lg?: string | number | { span?: string | number; offset?: string | number }
  xl?: string | number | { span?: string | number; offset?: string | number }
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
}

const props:any = withDefaults(defineProps<Props>(), {
  span: 24,
  offset: 0,
  order: 0,
  flex: '',
  align: 'top',
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
}>()

// 从父级 Row 组件获取栅格间隔
const rowGutter = inject<number>('sdkwork-row-gutter', 0)

// 响应式断点配置
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
}

// 当前断点状态
const currentBreakpoint = ref('')

// 监听窗口大小变化
const updateBreakpoint = () => {
  const width = window.innerWidth
  if (width >= breakpoints.xl) currentBreakpoint.value = 'xl'
  else if (width >= breakpoints.lg) currentBreakpoint.value = 'lg'
  else if (width >= breakpoints.md) currentBreakpoint.value = 'md'
  else if (width >= breakpoints.sm) currentBreakpoint.value = 'sm'
  else currentBreakpoint.value = 'xs'
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
  }
})

// 计算响应式 span 和 offset
const computedSpan = computed(() => {
  const bp = currentBreakpoint.value
  if (bp && props[bp]) {
    if (typeof props[bp] === 'object') {
      return props[bp].span || props.span
    }
    return props[bp]
  }
  return props.span
})

const computedOffset = computed(() => {
  const bp = currentBreakpoint.value
  if (bp && props[bp] && typeof props[bp] === 'object') {
    return props[bp].offset || props.offset
  }
  return props.offset
})

// 检查是否有断点配置
const hasBreakpoint = (bp: string) => {
  return !!props[bp]
}

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
  return isDarkMode.value ? 'sdkwork-col--dark' : 'sdkwork-col--light'
})

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, string | number> = {
    ...props.customStyle
  }

  // 处理栅格间隔 - 精确计算
  if (rowGutter) {
    const gutterValue = typeof rowGutter === 'number' ? `${rowGutter / 2}px` : `calc(${rowGutter} / 2)`
    style.paddingLeft = gutterValue
    style.paddingRight = gutterValue
  }

  // 处理 flex 属性 - 与 Vant 一致
  if (props.flex) {
    if (typeof props.flex === 'number') {
      style.flex = `${props.flex} ${props.flex} auto`
    } else {
      style.flex = props.flex
    }
  }

  // 处理 order
  if (props.order) {
    style.order = props.order
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
  /** 获取列配置 */
  getConfig: () => ({
    span: computedSpan.value,
    offset: computedOffset.value,
    order: props.order,
    flex: props.flex,
    currentBreakpoint: currentBreakpoint.value
  })
})
</script>

<style scoped>
.sdkwork-col {
  box-sizing: border-box;
  float: left;
  min-height: 1px;
}

/* 栅格系统 - 24列 */
.sdkwork-col--0 { display: none; }
.sdkwork-col--1 { width: 4.16666667%; }
.sdkwork-col--2 { width: 8.33333333%; }
.sdkwork-col--3 { width: 12.5%; }
.sdkwork-col--4 { width: 16.66666667%; }
.sdkwork-col--5 { width: 20.83333333%; }
.sdkwork-col--6 { width: 25%; }
.sdkwork-col--7 { width: 29.16666667%; }
.sdkwork-col--8 { width: 33.33333333%; }
.sdkwork-col--9 { width: 37.5%; }
.sdkwork-col--10 { width: 41.66666667%; }
.sdkwork-col--11 { width: 45.83333333%; }
.sdkwork-col--12 { width: 50%; }
.sdkwork-col--13 { width: 54.16666667%; }
.sdkwork-col--14 { width: 58.33333333%; }
.sdkwork-col--15 { width: 62.5%; }
.sdkwork-col--16 { width: 66.66666667%; }
.sdkwork-col--17 { width: 70.83333333%; }
.sdkwork-col--18 { width: 75%; }
.sdkwork-col--19 { width: 79.16666667%; }
.sdkwork-col--20 { width: 83.33333333%; }
.sdkwork-col--21 { width: 87.5%; }
.sdkwork-col--22 { width: 91.66666667%; }
.sdkwork-col--23 { width: 95.83333333%; }
.sdkwork-col--24 { width: 100%; }

/* 偏移量 */
.sdkwork-col--offset-0 { margin-left: 0; }
.sdkwork-col--offset-1 { margin-left: 4.16666667%; }
.sdkwork-col--offset-2 { margin-left: 8.33333333%; }
.sdkwork-col--offset-3 { margin-left: 12.5%; }
.sdkwork-col--offset-4 { margin-left: 16.66666667%; }
.sdkwork-col--offset-5 { margin-left: 20.83333333%; }
.sdkwork-col--offset-6 { margin-left: 25%; }
.sdkwork-col--offset-7 { margin-left: 29.16666667%; }
.sdkwork-col--offset-8 { margin-left: 33.33333333%; }
.sdkwork-col--offset-9 { margin-left: 37.5%; }
.sdkwork-col--offset-10 { margin-left: 41.66666667%; }
.sdkwork-col--offset-11 { margin-left: 45.83333333%; }
.sdkwork-col--offset-12 { margin-left: 50%; }
.sdkwork-col--offset-13 { margin-left: 54.16666667%; }
.sdkwork-col--offset-14 { margin-left: 58.33333333%; }
.sdkwork-col--offset-15 { margin-left: 62.5%; }
.sdkwork-col--offset-16 { margin-left: 66.66666667%; }
.sdkwork-col--offset-17 { margin-left: 70.83333333%; }
.sdkwork-col--offset-18 { margin-left: 75%; }
.sdkwork-col--offset-19 { margin-left: 79.16666667%; }
.sdkwork-col--offset-20 { margin-left: 83.33333333%; }
.sdkwork-col--offset-21 { margin-left: 87.5%; }
.sdkwork-col--offset-22 { margin-left: 91.66666667%; }
.sdkwork-col--offset-23 { margin-left: 95.83333333%; }
.sdkwork-col--offset-24 { margin-left: 100%; }

/* 排序 */
.sdkwork-col--order-0 { order: 0; }
.sdkwork-col--order-1 { order: 1; }
.sdkwork-col--order-2 { order: 2; }
.sdkwork-col--order-3 { order: 3; }
.sdkwork-col--order-4 { order: 4; }
.sdkwork-col--order-5 { order: 5; }
.sdkwork-col--order-6 { order: 6; }
.sdkwork-col--order-7 { order: 7; }
.sdkwork-col--order-8 { order: 8; }
.sdkwork-col--order-9 { order: 9; }
.sdkwork-col--order-10 { order: 10; }
.sdkwork-col--order-11 { order: 11; }
.sdkwork-col--order-12 { order: 12; }
.sdkwork-col--order-13 { order: 13; }
.sdkwork-col--order-14 { order: 14; }
.sdkwork-col--order-15 { order: 15; }
.sdkwork-col--order-16 { order: 16; }
.sdkwork-col--order-17 { order: 17; }
.sdkwork-col--order-18 { order: 18; }
.sdkwork-col--order-19 { order: 19; }
.sdkwork-col--order-20 { order: 20; }
.sdkwork-col--order-21 { order: 21; }
.sdkwork-col--order-22 { order: 22; }
.sdkwork-col--order-23 { order: 23; }
.sdkwork-col--order-24 { order: 24; }

/* flex 布局 */
.sdkwork-col--flex {
  display: flex;
  flex-direction: column;
}

/* 内容对齐方式 */
.sdkwork-col--align-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sdkwork-col--align-bottom {
  display: flex;
  align-items: flex-end;
}

/* 响应式断点 */
@media (max-width: 575px) {
  .sdkwork-col--xs-0 { display: none; }
  .sdkwork-col--xs-1 { width: 4.16666667%; }
  .sdkwork-col--xs-2 { width: 8.33333333%; }
  .sdkwork-col--xs-3 { width: 12.5%; }
  .sdkwork-col--xs-4 { width: 16.66666667%; }
  .sdkwork-col--xs-5 { width: 20.83333333%; }
  .sdkwork-col--xs-6 { width: 25%; }
  .sdkwork-col--xs-7 { width: 29.16666667%; }
  .sdkwork-col--xs-8 { width: 33.33333333%; }
  .sdkwork-col--xs-9 { width: 37.5%; }
  .sdkwork-col--xs-10 { width: 41.66666667%; }
  .sdkwork-col--xs-11 { width: 45.83333333%; }
  .sdkwork-col--xs-12 { width: 50%; }
  .sdkwork-col--xs-13 { width: 54.16666667%; }
  .sdkwork-col--xs-14 { width: 58.33333333%; }
  .sdkwork-col--xs-15 { width: 62.5%; }
  .sdkwork-col--xs-16 { width: 66.66666667%; }
  .sdkwork-col--xs-17 { width: 70.83333333%; }
  .sdkwork-col--xs-18 { width: 75%; }
  .sdkwork-col--xs-19 { width: 79.16666667%; }
  .sdkwork-col--xs-20 { width: 83.33333333%; }
  .sdkwork-col--xs-21 { width: 87.5%; }
  .sdkwork-col--xs-22 { width: 91.66666667%; }
  .sdkwork-col--xs-23 { width: 95.83333333%; }
  .sdkwork-col--xs-24 { width: 100%; }
}

@media (min-width: 576px) and (max-width: 767px) {
  .sdkwork-col--sm-0 { display: none; }
  .sdkwork-col--sm-1 { width: 4.16666667%; }
  .sdkwork-col--sm-2 { width: 8.33333333%; }
  .sdkwork-col--sm-3 { width: 12.5%; }
  .sdkwork-col--sm-4 { width: 16.66666667%; }
  .sdkwork-col--sm-5 { width: 20.83333333%; }
  .sdkwork-col--sm-6 { width: 25%; }
  .sdkwork-col--sm-7 { width: 29.16666667%; }
  .sdkwork-col--sm-8 { width: 33.33333333%; }
  .sdkwork-col--sm-9 { width: 37.5%; }
  .sdkwork-col--sm-10 { width: 41.66666667%; }
  .sdkwork-col--sm-11 { width: 45.83333333%; }
  .sdkwork-col--sm-12 { width: 50%; }
  .sdkwork-col--sm-13 { width: 54.16666667%; }
  .sdkwork-col--sm-14 { width: 58.33333333%; }
  .sdkwork-col--sm-15 { width: 62.5%; }
  .sdkwork-col--sm-16 { width: 66.66666667%; }
  .sdkwork-col--sm-17 { width: 70.83333333%; }
  .sdkwork-col--sm-18 { width: 75%; }
  .sdkwork-col--sm-19 { width: 79.16666667%; }
  .sdkwork-col--sm-20 { width: 83.33333333%; }
  .sdkwork-col--sm-21 { width: 87.5%; }
  .sdkwork-col--sm-22 { width: 91.66666667%; }
  .sdkwork-col--sm-23 { width: 95.83333333%; }
  .sdkwork-col--sm-24 { width: 100%; }
}

@media (min-width: 768px) and (max-width: 991px) {
  .sdkwork-col--md-0 { display: none; }
  .sdkwork-col--md-1 { width: 4.16666667%; }
  .sdkwork-col--md-2 { width: 8.33333333%; }
  .sdkwork-col--md-3 { width: 12.5%; }
  .sdkwork-col--md-4 { width: 16.66666667%; }
  .sdkwork-col--md-5 { width: 20.83333333%; }
  .sdkwork-col--md-6 { width: 25%; }
  .sdkwork-col--md-7 { width: 29.16666667%; }
  .sdkwork-col--md-8 { width: 33.33333333%; }
  .sdkwork-col--md-9 { width: 37.5%; }
  .sdkwork-col--md-10 { width: 41.66666667%; }
  .sdkwork-col--md-11 { width: 45.83333333%; }
  .sdkwork-col--md-12 { width: 50%; }
  .sdkwork-col--md-13 { width: 54.16666667%; }
  .sdkwork-col--md-14 { width: 58.33333333%; }
  .sdkwork-col--md-15 { width: 62.5%; }
  .sdkwork-col--md-16 { width: 66.66666667%; }
  .sdkwork-col--md-17 { width: 70.83333333%; }
  .sdkwork-col--md-18 { width: 75%; }
  .sdkwork-col--md-19 { width: 79.16666667%; }
  .sdkwork-col--md-20 { width: 83.33333333%; }
  .sdkwork-col--md-21 { width: 87.5%; }
  .sdkwork-col--md-22 { width: 91.66666667%; }
  .sdkwork-col--md-23 { width: 95.83333333%; }
  .sdkwork-col--md-24 { width: 100%; }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .sdkwork-col--lg-0 { display: none; }
  .sdkwork-col--lg-1 { width: 4.16666667%; }
  .sdkwork-col--lg-2 { width: 8.33333333%; }
  .sdkwork-col--lg-3 { width: 12.5%; }
  .sdkwork-col--lg-4 { width: 16.66666667%; }
  .sdkwork-col--lg-5 { width: 20.83333333%; }
  .sdkwork-col--lg-6 { width: 25%; }
  .sdkwork-col--lg-7 { width: 29.16666667%; }
  .sdkwork-col--lg-8 { width: 33.33333333%; }
  .sdkwork-col--lg-9 { width: 37.5%; }
  .sdkwork-col--lg-10 { width: 41.66666667%; }
  .sdkwork-col--lg-11 { width: 45.83333333%; }
  .sdkwork-col--lg-12 { width: 50%; }
  .sdkwork-col--lg-13 { width: 54.16666667%; }
  .sdkwork-col--lg-14 { width: 58.33333333%; }
  .sdkwork-col--lg-15 { width: 62.5%; }
  .sdkwork-col--lg-16 { width: 66.66666667%; }
  .sdkwork-col--lg-17 { width: 70.83333333%; }
  .sdkwork-col--lg-18 { width: 75%; }
  .sdkwork-col--lg-19 { width: 79.16666667%; }
  .sdkwork-col--lg-20 { width: 83.33333333%; }
  .sdkwork-col--lg-21 { width: 87.5%; }
  .sdkwork-col--lg-22 { width: 91.66666667%; }
  .sdkwork-col--lg-23 { width: 95.83333333%; }
  .sdkwork-col--lg-24 { width: 100%; }
}

@media (min-width: 1200px) {
  .sdkwork-col--xl-0 { display: none; }
  .sdkwork-col--xl-1 { width: 4.16666667%; }
  .sdkwork-col--xl-2 { width: 8.33333333%; }
  .sdkwork-col--xl-3 { width: 12.5%; }
  .sdkwork-col--xl-4 { width: 16.66666667%; }
  .sdkwork-col--xl-5 { width: 20.83333333%; }
  .sdkwork-col--xl-6 { width: 25%; }
  .sdkwork-col--xl-7 { width: 29.16666667%; }
  .sdkwork-col--xl-8 { width: 33.33333333%; }
  .sdkwork-col--xl-9 { width: 37.5%; }
  .sdkwork-col--xl-10 { width: 41.66666667%; }
  .sdkwork-col--xl-11 { width: 45.83333333%; }
  .sdkwork-col--xl-12 { width: 50%; }
  .sdkwork-col--xl-13 { width: 54.16666667%; }
  .sdkwork-col--xl-14 { width: 58.33333333%; }
  .sdkwork-col--xl-15 { width: 62.5%; }
  .sdkwork-col--xl-16 { width: 66.66666667%; }
  .sdkwork-col--xl-17 { width: 70.83333333%; }
  .sdkwork-col--xl-18 { width: 75%; }
  .sdkwork-col--xl-19 { width: 79.16666667%; }
  .sdkwork-col--xl-20 { width: 83.33333333%; }
  .sdkwork-col--xl-21 { width: 87.5%; }
  .sdkwork-col--xl-22 { width: 91.66666667%; }
  .sdkwork-col--xl-23 { width: 95.83333333%; }
  .sdkwork-col--xl-24 { width: 100%; }
}

/* 主题样式 */
.sdkwork-col--light {
  --sdkwork-col-bg-color: transparent;
  --sdkwork-col-text-color: var(--sdkwork-text-color, #323233);
}

.sdkwork-col--dark {
  --sdkwork-col-bg-color: var(--sdkwork-dark-bg-color, #1a1a1a);
  --sdkwork-col-text-color: var(--sdkwork-dark-text-color, #ffffff);
  background-color: var(--sdkwork-col-bg-color);
  color: var(--sdkwork-col-text-color);
}
</style>