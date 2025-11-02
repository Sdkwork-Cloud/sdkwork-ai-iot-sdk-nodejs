<template>
  <SdkworkPopup
    v-model:modelValue="showPopup"
    :title="title"
    :width="width"
    :height="height"
    :position="position"
    :closeable="closeable"
    :close-on-click-overlay="closeOnClickOverlay"
    :round="round"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :safe-area-inset-top="safeAreaInsetTop"
    :lock-scroll="lockScroll"
    :theme-mode="themeMode"
    @open="handleOpen"
    @close="handleClose"
    @opened="handleOpened"
    @closed="handleClosed"
    @click-overlay="handleClickOverlay"
  >
    <!-- 生成功能导航内容 -->
    <div class="generation-popup-content">
      <SdkworkGenerationNavigations 
        @feature-click="handleFeatureClick"
        ref="navigationsRef"
      />
    </div>
  </SdkworkPopup>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import SdkworkPopup from '../sdkwork-popup/sdkwork-popup.vue'
import SdkworkGenerationNavigations from '../sdkwork-generation-navigations/sdkwork-generation-navigations.vue'

// Props定义
interface Props {
  /** 弹窗显示状态 */
  modelValue?: boolean
  /** 弹窗标题 */
  title?: string
  /** 弹窗宽度 */
  width?: string | number
  /** 弹窗高度 */
  height?: string | number
  /** 弹窗位置 */
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  /** 是否显示关闭按钮 */
  closeable?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickOverlay?: boolean
  /** 是否显示圆角 */
  round?: boolean
  /** 是否开启底部安全区适配 */
  safeAreaInsetBottom?: boolean
  /** 是否开启顶部安全区适配 */
  safeAreaInsetTop?: boolean
  /** 是否锁定背景滚动 */
  lockScroll?: boolean
  /** 主题模式 */
  themeMode?: 'dark' | 'light' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: 'AI生成功能',
  width: '100%',
  height: '90%',
  position: 'bottom',
  closeable: true,
  closeOnClickOverlay: true,
  round: false,
  safeAreaInsetBottom: true,
  safeAreaInsetTop: false,
  lockScroll: true,
  themeMode: 'auto'
})

// Emits定义
const emit = defineEmits<{
  /** 更新弹窗显示状态 */
  'update:modelValue': [value: boolean]
  /** 弹窗打开事件 */
  'open': []
  /** 弹窗关闭事件 */
  'close': []
  /** 弹窗打开完成事件 */
  'opened': []
  /** 弹窗关闭完成事件 */
  'closed': []
  /** 点击遮罩层事件 */
  'click-overlay': []
  /** 功能项点击事件 */
  'feature-click': [feature: any]
}>()

// 弹窗显示状态
const showPopup = ref(props.modelValue)

// 导航组件引用
const navigationsRef = ref<InstanceType<typeof SdkworkGenerationNavigations>>()

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  showPopup.value = newVal
})

// 监听内部状态变化
watch(showPopup, (newVal) => {
  emit('update:modelValue', newVal)
})

// 打开弹窗
const open = () => {
  showPopup.value = true
}

// 关闭弹窗
const close = () => {
  showPopup.value = false
}

// 处理功能项点击
const handleFeatureClick = (feature: any) => {
  console.log('功能项被点击:', feature)
  
  // 触发功能项点击事件
  emit('feature-click', feature)
  
  // 根据配置决定是否关闭弹窗
  if (props.closeOnClickOverlay) {
    close()
  }
}

// 弹窗事件处理
const handleOpen = () => {
  emit('open')
}

const handleClose = () => {
  emit('close')
}

const handleOpened = () => {
  emit('opened')
}

const handleClosed = () => {
  emit('closed')
}

const handleClickOverlay = () => {
  emit('click-overlay')
}

// 获取导航组件的方法
const getFeaturesByCategory = (category: 'video' | 'image' | 'audio') => {
  return navigationsRef.value?.getFeaturesByCategory(category)
}

// 获取所有功能列表
const getAllFeatures = () => {
  if (!navigationsRef.value) return []
  
  const videoFeatures = navigationsRef.value.videoFeatures || []
  const imageFeatures = navigationsRef.value.imageFeatures || []
  const audioFeatures = navigationsRef.value.audioFeatures || []
  
  return [...videoFeatures, ...imageFeatures, ...audioFeatures]
}

// 暴露方法给父组件
defineExpose({
  open,
  close,
  getFeaturesByCategory,
  getAllFeatures,
  navigationsRef
})
</script>

<style scoped lang="scss">
.generation-popup-content {
  height: 100%;
  overflow-y: auto;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--sdkwork-scrollbar-track, #f1f1f1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--sdkwork-scrollbar-thumb, #c1c1c1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--sdkwork-scrollbar-thumb-hover, #a8a8a8);
  }
}

// 深色主题适配
:global(.dark) .generation-popup-content {
  &::-webkit-scrollbar-track {
    background: var(--sdkwork-scrollbar-track-dark, #2a2a2a);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--sdkwork-scrollbar-thumb-dark, #555);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--sdkwork-scrollbar-thumb-hover-dark, #666);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .generation-popup-content {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .generation-popup-content {
    &::-webkit-scrollbar {
      width: 2px;
    }
  }
}
</style>