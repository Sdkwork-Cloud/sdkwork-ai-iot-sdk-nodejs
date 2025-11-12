<template>
  <van-popup 
    v-model:show="show" 
    position="bottom" 
    :style="{ 
      backgroundColor: isDarkMode ? '#1a1a1a' : undefined
    }"
  >
    <van-picker 
      :columns="columns" 
      @confirm="onConfirm" 
      @cancel="close"
    />
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTheme } from '@/hooks/theme/useTheme'

// Props
interface Props {
  modelValue: boolean
  pickerType: 'resolution' | 'format' | 'music'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  pickerType: 'resolution'
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value: string): void
}>()

// 响应式数据
const show = ref(props.modelValue)

// 分辨率选项
const resolutionOptions = [
  { text: '480p', value: '480p' },
  { text: '720p', value: '720p' },
  { text: '1080p', value: '1080p' },
  { text: '4K', value: '4K' }
]

// 格式选项
const formatOptions = [
  { text: 'MP4', value: 'mp4' },
  { text: 'MOV', value: 'mov' },
  { text: 'AVI', value: 'avi' },
  { text: 'WebM', value: 'webm' }
]

// 背景音乐选项
const musicOptions = [
  { text: '无', value: '' },
  { text: '轻快', value: 'light' },
  { text: '温馨', value: 'warm' },
  { text: '励志', value: 'inspiring' },
  { text: '浪漫', value: 'romantic' }
]

// 根据pickerType返回对应的选项
const columns = computed(() => {
  switch (props.pickerType) {
    case 'resolution':
      return resolutionOptions
    case 'format':
      return formatOptions
    case 'music':
      return musicOptions
    default:
      return []
  }
})

// 使用主题
const { isDarkMode } = useTheme()

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  show.value = newVal
})

// 监听show变化并触发update:modelValue
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
})

// 关闭弹窗
const close = () => {
  show.value = false
}

// 确认选择
const onConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const value = selectedValues[0]
  emit('confirm', value)
  close()
}

// 暴露方法给父组件
defineExpose({
  close
})
</script>

<style lang="scss" scoped>
// 这里可以添加自定义样式，但van-picker已经提供了默认样式

// 主题相关样式
:root {
  --dialog-bg-color: #ffffff;
}

html[data-theme="dark"] {
  --dialog-bg-color: #1a1a1a;
}
</style>