<template>
  <van-pull-refresh
    v-model:loading="loading"
    :disabled="disabled"
    :head-height="headHeight"
    :animation-duration="animationDuration"
    :success-duration="successDuration"
    :pulling-text="pullingText"
    :loosing-text="loosingText"
    :loading-text="loadingText"
    :success-text="successText"
    @refresh="handleRefresh"
    :class="themeClass"
    style="height: 100%;"
  >
    <slot />
    
    
  </van-pull-refresh>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PullRefresh as VanPullRefresh } from 'vant'

// Props 定义 - 兼容 vant 的 PullRefresh 组件
interface Props {
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
  /** 刷新成功后的回调 */
  onRefresh?: () => void
  /** 当前状态（v-model支持） */
  status?: PullRefreshStatus
}

const props = withDefaults(defineProps<Props>(), {
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
  /** 状态变化事件 */
  'update:status': [status: PullRefreshStatus]
}>()

// 插槽定义
defineSlots<{
  /** 下拉状态插槽 */
  pulling?: () => any
  /** 释放状态插槽 */
  loosing?: () => any
  /** 加载状态插槽 */
  loading?: () => any
  /** 成功状态插槽 */
  success?: () => any
  /** 默认插槽 */
  default?: () => any
}>()

// 状态类型
type PullRefreshStatus = 'normal' | 'pulling' | 'loosing' | 'loading' | 'success'

// 响应式数据
const loading = ref(false)
const internalStatus = ref<PullRefreshStatus>(props.status || 'normal')

// 计算属性 - 兼容 v-model:status
const status = computed({
  get: () => props.status !== undefined ? props.status : internalStatus.value,
  set: (value: PullRefreshStatus) => {
    internalStatus.value = value
    loading.value = value === 'loading'
    emit('update:status', value)
  }
})

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

// 处理刷新事件
const handleRefresh = () => {
  status.value = 'loading'
  emit('refresh')
  props.onRefresh?.()
}

// 完成刷新
const finish = () => {
  status.value = 'success'
  loading.value = false
}

// 暴露方法
defineExpose({
  /** 完成刷新 */
  finish,
  /** 获取当前状态 */
  getStatus: () => status.value
})

// 监听主题模式变化
watch(() => props.themeMode, updateTheme)

// 监听状态变化，同步到loading
watch(status, (newStatus) => {
  loading.value = newStatus === 'loading'
})

// 初始化主题
updateTheme()
</script>

<style scoped lang="scss"> 
</style>