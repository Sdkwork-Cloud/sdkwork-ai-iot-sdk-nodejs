<template>
  <!-- 使用Vant的CollapseItem组件作为基础 -->
  <van-collapse-item
    :name="name"
    :title="title"
    :value="value"
    :icon="icon"
    :label="label"
    :disabled="disabled"
    :border="border"
    :is-link="isLink"
    :class="themeClass"
  >
    <!-- 自定义插槽支持 -->
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    
    <template v-if="$slots.value" #value>
      <slot name="value" />
    </template>
    
    <template v-if="$slots.icon" #icon>
      <slot name="icon" />
    </template>
    
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    
    <template v-if="$slots['right-icon']" #right-icon>
      <slot name="right-icon" />
    </template>
    
    <!-- 默认插槽内容 -->
    <slot />
  </van-collapse-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props定义 - 兼容Vant CollapseItem组件
interface Props {
  // 唯一标识符，默认为索引值
  name?: string | number
  // 标题
  title?: string
  // 标题右侧内容
  value?: string
  // 标题左侧图标名称或图片链接
  icon?: string
  // 标题描述信息
  label?: string
  // 是否禁用面板
  disabled?: boolean
  // 是否显示内边框
  border?: boolean
  // 是否显示标题右侧箭头
  isLink?: boolean
  // 主题模式
  themeMode?: 'dark' | 'light' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  title: '',
  value: '',
  icon: '',
  label: '',
  disabled: false,
  border: true,
  isLink: true,
  themeMode: 'auto'
})

// 插槽定义
const $slots = defineSlots<{
  /** 自定义标题内容 */
  title?: (props: {}) => any
  /** 自定义标题右侧内容 */
  value?: (props: {}) => any
  /** 自定义图标 */
  icon?: (props: {}) => any
  /** 自定义描述信息 */
  label?: (props: {}) => any
  /** 自定义右侧图标 */
  'right-icon'?: (props: {}) => any
  /** 默认插槽 - 面板内容 */
  default?: (props: {}) => any
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
  return isDarkMode.value ? 'sdkwork-collapse-item--dark' : 'sdkwork-collapse-item--light'
})

// 暴露方法
defineExpose({
  /**
   * 获取面板名称
   */
  getName: () => props.name,
  
  /**
   * 获取面板标题
   */
  getTitle: () => props.title,
  
  /**
   * 获取面板值
   */
  getValue: () => props.value,
  
  /**
   * 是否禁用
   */
  isDisabled: () => props.disabled
})
</script>

<style scoped lang="scss">
.sdkwork-collapse-item {
  // 基础样式
  :deep(.van-collapse-item) {
    // 使用CSS变量实现主题切换
    --sdkwork-collapse-background: var(--sdkwork-collapse-background, #fff);
    --sdkwork-collapse-border-color: var(--sdkwork-collapse-border-color, #ebedf0);
    --sdkwork-collapse-title-background: var(--sdkwork-collapse-title-background, #fff);
    --sdkwork-collapse-title-color: var(--sdkwork-collapse-title-color, #323233);
    --sdkwork-collapse-title-disabled-color: var(--sdkwork-collapse-title-disabled-color, #c8c9cc);
    --sdkwork-collapse-content-background: var(--sdkwork-collapse-content-background, #fff);
    --sdkwork-collapse-content-color: var(--sdkwork-collapse-content-color, #333);
    --sdkwork-collapse-icon-color: var(--sdkwork-collapse-icon-color, #969799);
    
    // 应用Vant主题变量
    --van-collapse-item-content-background: var(--sdkwork-collapse-content-background);
    --van-collapse-item-content-text-color: var(--sdkwork-collapse-content-color);
    --van-collapse-item-title-disabled-color: var(--sdkwork-collapse-title-disabled-color);
    --van-collapse-item-title-text-color: var(--sdkwork-collapse-title-color);
    --van-collapse-item-title-background: var(--sdkwork-collapse-title-background);
    --van-collapse-item-border-color: var(--sdkwork-collapse-border-color);
    --van-collapse-item-arrow-color: var(--sdkwork-collapse-icon-color);
  }
}

// 浅色主题
.sdkwork-collapse-item--light {
  :deep(.van-collapse-item) {
    --sdkwork-collapse-background: #fff;
    --sdkwork-collapse-border-color: #ebedf0;
    --sdkwork-collapse-title-background: #fff;
    --sdkwork-collapse-title-color: #323233;
    --sdkwork-collapse-title-disabled-color: #c8c9cc;
    --sdkwork-collapse-content-background: #fff;
    --sdkwork-collapse-content-color: #333;
    --sdkwork-collapse-icon-color: #969799;
  }
}

// 深色主题
.sdkwork-collapse-item--dark {
  :deep(.van-collapse-item) {
    --sdkwork-collapse-background: #1a1a1a;
    --sdkwork-collapse-border-color: #3a3a3a;
    --sdkwork-collapse-title-background: #2d2d2d;
    --sdkwork-collapse-title-color: #fff;
    --sdkwork-collapse-title-disabled-color: #555;
    --sdkwork-collapse-content-background: #1a1a1a;
    --sdkwork-collapse-content-color: #fff;
    --sdkwork-collapse-icon-color: #888;
  }
}

// 响应式主题切换支持
@media (prefers-color-scheme: dark) {
  .sdkwork-collapse-item:not(.sdkwork-collapse-item--light):not(.sdkwork-collapse-item--dark) {
    :deep(.van-collapse-item) {
      --sdkwork-collapse-background: #1a1a1a;
      --sdkwork-collapse-border-color: #3a3a3a;
      --sdkwork-collapse-title-background: #2d2d2d;
      --sdkwork-collapse-title-color: #fff;
      --sdkwork-collapse-title-disabled-color: #555;
      --sdkwork-collapse-content-background: #1a1a1a;
      --sdkwork-collapse-content-color: #fff;
      --sdkwork-collapse-icon-color: #888;
    }
  }
}

@media (prefers-color-scheme: light) {
  .sdkwork-collapse-item:not(.sdkwork-collapse-item--light):not(.sdkwork-collapse-item--dark) {
    :deep(.van-collapse-item) {
      --sdkwork-collapse-background: #fff;
      --sdkwork-collapse-border-color: #ebedf0;
      --sdkwork-collapse-title-background: #fff;
      --sdkwork-collapse-title-color: #323233;
      --sdkwork-collapse-title-disabled-color: #c8c9cc;
      --sdkwork-collapse-content-background: #fff;
      --sdkwork-collapse-content-color: #333;
      --sdkwork-collapse-icon-color: #969799;
    }
  }
}
</style>