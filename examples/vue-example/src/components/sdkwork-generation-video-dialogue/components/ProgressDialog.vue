<template>
  <van-popup 
    v-model:show="show" 
    :close-on-click-overlay="false" 
    position="center"
    :style="{ 
      backgroundColor: isDarkMode ? '#1a1a1a' : undefined
    }"
  >
    <div class="progress-dialog">
      <div class="dialog-header">
        <span class="dialog-title">{{ title }}</span>
      </div>
      <div class="progress-content">
        <van-progress :percentage="progress" stroke-width="8" />
        <div class="progress-text">{{ text }}</div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTheme } from '@/hooks/theme/useTheme'

// Props
interface Props {
  modelValue: boolean
  title?: string
  progress?: number
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '正在生成视频',
  progress: 0,
  text: ''
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// 响应式数据
const show = ref(props.modelValue)

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

// 暴露方法给父组件
defineExpose({
  close: () => {
    show.value = false
  }
})
</script>

<style lang="scss" scoped>
.progress-dialog {
  width: 300px;
  padding: 24px;
  
  .dialog-header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    
    .dialog-title {
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .progress-content {
    .progress-text {
      margin-top: 16px;
      text-align: center;
      font-size: 14px;
    }
  }
}

// 主题相关样式
:root {
  --dialog-bg-color: #ffffff;
  --text-primary-color: #323233;
  --text-secondary-color: #646566;
}

html[data-theme="dark"] {
  --dialog-bg-color: #1a1a1a;
  --text-primary-color: #f0f0f0;
  --text-secondary-color: #c0c0c0;
}

.progress-dialog {
  background-color: var(--dialog-bg-color);
  
  .dialog-header {
    .dialog-title {
      color: var(--text-primary-color);
    }
  }
  
  .progress-content {
    .progress-text {
      color: var(--text-secondary-color);
    }
  }
}
</style>