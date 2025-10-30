<template>
  <div class="sdkwork-pull-refresh-container" :class="themeClass">  
    <van-pull-refresh v-model="internalLoading" :disabled="disabled" :pull-distance="pullDistance" :head-height="headHeight"
      :animation-duration="animationDuration" :success-duration="successDuration" :pulling-text="pullingText"
      :loosing-text="loosingText" :loading-text="loadingText" :success-text="successText" @refresh="handleRefresh"
      @change="handleChange" class="sdkwork-pull-refresh">
      <!-- 动态传递插槽参数给底层 Vant 组件 -->
      <template #pulling="{ distance }" v-if="$slots.pulling">
        <slot name="pulling" :distance="distance" />
      </template>
      <template #loosing="{ distance }" v-if="$slots.loosing">
        <slot name="loosing" :distance="distance" />
      </template>
      <template #loading v-if="$slots.loading">
        <slot name="loading" />
      </template>
      <template #success v-if="$slots.success">
        <slot name="success" />
      </template>
      <slot />
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props 定义 - 兼容 vant 的 PullRefresh 组件
interface Props {
  /** 是否处于加载状态，v-model */
  modelValue?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 下拉距离阈值，触发刷新 */
  pullDistance?: number
  /** 头部高度 */
  headHeight?: number
  /** 动画时长 */
  animationDuration?: number
  /** 成功提示展示时长 */
  successDuration?: number
  /** 下拉时提示文字 */
  pullingText?: string
  /** 释放时提示文字 */
  loosingText?: string
  /** 加载时提示文字 */
  loadingText?: string
  /** 成功提示文字 */
  successText?: string
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  pullDistance: 50,
  headHeight: 50,
  animationDuration: 300,
  successDuration: 500,
  pullingText: '下拉即可刷新...',
  loosingText: '释放即可刷新...',
  loadingText: '加载中...',
  successText: '刷新成功',
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 刷新事件 */
  refresh: []
  /** 状态变化事件，拖动时或状态改变时触发 */
  change: [payload: { status: string; distance: number }]
  /** 加载状态变化事件，v-model */
  'update:modelValue': [loading: boolean]
}>()

// 插槽定义 - 兼容 Vant PullRefresh 标准插槽
defineSlots<{
  /** 下拉状态插槽，接收 distance 参数 */
  pulling?: (props: { distance: number }) => any
  /** 释放状态插槽，接收 distance 参数 */
  loosing?: (props: { distance: number }) => any
  /** 加载状态插槽 */
  loading?: () => any
  /** 成功状态插槽 */
  success?: () => any
  /** 默认插槽 */
  default?: () => any
}>()
 

// 计算属性 - 兼容 v-model
const internalLoading = ref<boolean>(props.modelValue)

// Dark mode support
const isDarkMode = ref(false)

// 检测系统暗黑模式
const detectSystemDarkMode = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// 更新主题
const updateTheme = () => {
  if (props.themeMode === 'dark') {
    isDarkMode.value = true
  } else if (props.themeMode === 'light') {
    isDarkMode.value = false
  } else if (props.themeMode === 'auto') {
    isDarkMode.value = detectSystemDarkMode()
  }
}

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-pull-refresh--dark' : 'sdkwork-pull-refresh--light'
})

// 处理状态变化事件
const handleChange = (payload: { status: string; distance: number }) => {
  // 发射状态变化事件
  emit('change', payload)
}

// 处理刷新事件
const handleRefresh = async () => {
  
  // 发射刷新事件
  emit('refresh')
  
  // 移除自动超时恢复逻辑，让父组件完全控制 loading 状态
  // 父组件应该在数据加载完成后通过 v-model:loading 或 finish() 方法结束 loading 状态
}

// 完成刷新
const finish = () => {
  internalLoading.value = false
}

// 暴露方法
defineExpose({
  /** 完成刷新 */
  finish
})

// 监听主题模式变化
watch(() => props.themeMode, updateTheme)

// 监听 props.modelValue 变化，更新内部状态
// 监听 props.modelValue 变化，更新内部状态
watch(() => props.modelValue, (value) => {
  internalLoading.value = value
  console.log('internalLoading', internalLoading.value)
})

// 监听内部状态变化，触发 update:modelValue 事件
watch(internalLoading, (value) => {
  emit('update:modelValue', value)
})

// 监听内部状态变化，触发 update:modelValue 事件
watch(internalLoading, (value) => {
  emit('update:modelValue', value)
})

// 初始化主题
updateTheme()
</script>

<style scoped lang="scss">
.sdkwork-pull-refresh-container {
  height: 100%;
  min-height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sdkwork-pull-refresh {
  height: 100%;
  min-height: 100%;
}
</style>