<template>
  <component
    :is="iconComponent"
    :icon="icon"
    :width="width"
    :height="height"
    :color="color"
    :flip="flip"
    :rotate="rotate"
    :class="computedClass"
    :style="computedStyle"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'

// Props 定义 - 兼容 iconify/vue 的 API
interface Props {
  /** 图标名称，格式为 "collection:icon-name" */
  icon: string
  /** 图标宽度 */
  width?: string | number
  /** 图标高度 */
  height?: string | number
  /** 图标颜色 */
  color?: string
  /** 图标翻转 */
  flip?: 'horizontal' | 'vertical' | 'both'
  /** 图标旋转角度 */
  rotate?: number | string
  /** 自定义类名 */
  customClass?: string
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 是否内联显示 */
  inline?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 点击事件 */
  onClick?: (event: Event) => void
}

const props = withDefaults(defineProps<Props>(), {
  width: '1em',
  height: '1em',
  color: 'currentColor',
  flip: undefined,
  rotate: 0,
  customClass: '',
  customStyle: () => ({}),
  inline: false,
  disabled: false
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [event: Event]
}>()

// 计算类名
const computedClass = computed(() => {
  const classes = ['sdkwork-icon']
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  if (props.inline) {
    classes.push('sdkwork-icon--inline')
  }
  
  if (props.disabled) {
    classes.push('sdkwork-icon--disabled')
  }
  
  return classes.join(' ')
})

// 计算样式
const computedStyle = computed(() => ({
  ...props.customStyle,
  cursor: props.onClick || props.disabled ? 'pointer' : 'default',
  opacity: props.disabled ? 0.5 : 1
}))

// 图标组件
const iconComponent = computed(() => {
  return h(IconifyIcon, {
    icon: props.icon,
    width: typeof props.width === 'string' ? props.width : Number(props.width),
    height: typeof props.height === 'string' ? props.height : Number(props.height),
    color: props.color,
    flip: props.flip,
    rotate: props.rotate as any,
    onClick: (event: Event) => {
      if (!props.disabled) {
        emit('click', event)
        props.onClick?.(event)
      }
    }
  })
})

// 暴露方法，方便外部调用
defineExpose({
  /** 获取图标名称 */
  getIconName: () => props.icon,
  /** 获取图标尺寸 */
  getIconSize: () => ({ width: props.width, height: props.height }),
  /** 是否禁用 */
  isDisabled: () => props.disabled
})
</script>

<style scoped lang="scss">
.sdkwork-icon {
  display: inline-block;
  vertical-align: middle;
  
  // 内联模式
  &--inline {
    display: inline;
    vertical-align: baseline;
  }
  
  // 禁用状态
  &--disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  
  // 点击效果
  &:not(.sdkwork-icon--disabled) {
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:active {
      opacity: 0.6;
    }
  }
}
</style>