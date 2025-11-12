<template>
  <div class="mobile-video-generation">
    <!-- Tabs组件 -->
    <video-tabs v-model="activeTab" />
    
    <!-- 图生视频模式下的图片上传 -->
    <image-uploader 
      v-if="props.allowImageUpload && activeTab === 'image'" 
      v-model="imageFiles" 
      :mode="uploadMode" 
    />
    
    <!-- 提示词输入 -->
    <prompt-input v-model="prompt" :placeholder="getPromptPlaceholder()" />
    
    <!-- 视频时长选择 -->
    <video-duration v-if="props.showDuration" v-model="duration" />
    
    <!-- 视频风格选择 -->
    <video-style v-if="props.showStyle" v-model="selectedStyle" />
    

    
    <!-- 生成按钮 -->
    <generate-button 
      :disabled="isGenerating || !isFormValid" 
      @click="generateVideo" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import VideoTabs from './components/VideoTabs.vue'
import ImageUploader from './components/ImageUploader.vue'
import PromptInput from './components/PromptInput.vue'
import VideoStyle from './components/VideoStyle.vue'
import VideoDuration from './components/VideoDuration.vue'
import GenerateButton from './components/GenerateButton.vue'
import { useGenerationStore } from '@/stores'
import type { GenerateVideoParam } from 'sdkwork-sdk-api-typescript'

// 组件Props定义
interface VideoGenerationProps {
  /** 初始提示词 */
  initialPrompt?: string
  /** 初始风格 */
  initialStyle?: string
  /** 初始时长(秒) */
  initialDuration?: number
  /** 是否显示时长选择器 */
  showDuration?: boolean
  /** 是否显示风格选择器 */
  showStyle?: boolean
  /** 是否支持图片上传 */
  allowImageUpload?: boolean
}

// 组件事件定义
interface VideoGenerationEvents {
  (e: 'generate-start'): void
  (e: 'generate-success', result: any): void
  (e: 'generate-error', error: any): void
}

// 使用默认值
const props = withDefaults(defineProps<VideoGenerationProps>(), {
  initialPrompt: '',
  initialStyle: '',
  initialDuration: 5,
  showDuration: true,
  showStyle: true,
  allowImageUpload: true
})

// 定义事件发射器
const emit = defineEmits<VideoGenerationEvents>()

// Store初始化
const generationStore = useGenerationStore()
const { currentTask } = storeToRefs(generationStore)

// 响应式数据
const activeTab = ref<'text' | 'image'>('text') // 默认文生视频
const imageFiles = ref<File[]>([])
const uploadMode = ref<'single' | 'first-last'>('single') // 上传模式
const prompt = ref(props.initialPrompt) // 使用props中的初始值
const selectedStyle = ref(props.initialStyle) // 使用props中的初始值
const duration = ref(props.initialDuration) // 使用props中的初始值

// 计算属性
const isGenerating = computed(() => currentTask.value?.status === 'generating')

// 计算属性
const isFormValid = computed(() => {
  // 文生视频模式：只需要提示词
  if (activeTab.value === 'text') {
    return prompt.value.trim().length > 0
  }
  // 图生视频模式：需要图片和提示词
  return imageFiles.value.length > 0 && prompt.value.trim().length > 0
})

// 方法
const getPromptPlaceholder = () => {
  return activeTab.value === 'text' 
    ? '请输入视频描述，详细描述能生成更好的效果...' 
    : '描述您希望基于图片生成的视频内容...'
}

const generateVideo = async () => {
  if (!isFormValid.value || isGenerating.value) return
  
  // 触发生成开始事件
  emit('generate-start')
  
  try {
    // 准备视频生成参数，遵循GenerateVideoParam VO标准
    const videoParams: GenerateVideoParam = {
      prompt: prompt.value,
      style: selectedStyle.value || undefined,
      n: 1, // 生成一个视频
      width: 1280,
      height: 720,
      responseFormat: 'url'
    }
    
    // 如果是图片模式，添加图片相关信息
    if (activeTab.value === 'image' && imageFiles.value.length > 0) {
      // 注意：根据GenerateVideoParam的VO定义，可能需要将图片转换为base64或其他格式
      // 这里假设API会处理图片文件，如果需要特殊处理，请根据实际VO定义调整
    }
    
    // 调用store中的视频生成方法
    const result = await generationStore.generateVideo(videoParams)
    
    // 生成成功处理
    console.log('视频生成成功:', result)
    
    // 触发成功事件
    emit('generate-success', result)
    
    // 可以在这里添加成功后的逻辑，如跳转到结果页等
    // 例如：router.push(`/generation/result/${result.id}`)
  } catch (error) {
    console.error('视频生成失败:', error)
    
    // 触发错误事件
    emit('generate-error', error)
    
    // 可以在这里添加错误处理，如显示错误提示
  }
}

// 监听tab切换
watch(activeTab, (newTab) => {
  if (newTab === 'text') {
    // 切换到文生视频时清空图片
    imageFiles.value = []
  }
})
</script>

<style scoped>
.mobile-video-generation {
  padding: 16px;
  padding-bottom: 120px;
  min-height: 100vh; 
  color: var(--text-primary);
}

/* 科技蓝主题 - 深色模式 */
:root {
  --bg-primary: #0a1629;
  --bg-secondary: #1a2438;
  --bg-card: #1e2a3d;
  --text-primary: #ffffff;
  --text-secondary: #8fa3c4;
  --accent-blue: #1890ff;
  --accent-blue-light: #40a9ff;
  --accent-blue-dark: #096dd9;
  --border-color: #2d3a4e;
  --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  --gradient-secondary: linear-gradient(135deg, #1a2438 0%, #2d3a4e 100%);
  --shadow-glow: 0 0 20px rgba(24, 144, 255, 0.3);
}

/* 科技蓝主题 - 浅色模式 */
@media (prefers-color-scheme: light) {
  :root {
    --bg-primary: #f0f8ff;
    --bg-secondary: #e6f7ff;
    --bg-card: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    --accent-blue: #1890ff;
    --accent-blue-light: #40a9ff;
    --accent-blue-dark: #096dd9;
    --border-color: #d1e9ff;
    --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    --gradient-secondary: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 100%);
    --shadow-glow: 0 0 15px rgba(24, 144, 255, 0.2);
  }
}

/* 强制深色模式 */
html[data-theme="dark"] {
  --bg-primary: #0a1629;
  --bg-secondary: #1a2438;
  --bg-card: #1e2a3d;
  --text-primary: #ffffff;
  --text-secondary: #8fa3c4;
  --accent-blue: #1890ff;
  --accent-blue-light: #40a9ff;
  --accent-blue-dark: #096dd9;
  --border-color: #2d3a4e;
  --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  --gradient-secondary: linear-gradient(135deg, #1a2438 0%, #2d3a4e 100%);
  --shadow-glow: 0 0 20px rgba(24, 144, 255, 0.3);
}
</style>