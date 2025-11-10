<template>
  <div class="mobile-video-generation">
    <!-- Tabs组件 -->
    <video-tabs v-model="activeTab" />
    
    <!-- 图生视频模式下的图片上传 -->
    <image-uploader 
      v-if="activeTab === 'image'" 
      v-model="imageFiles" 
      :mode="uploadMode" 
    />
    
    <!-- 提示词输入 -->
    <prompt-input v-model="prompt" :placeholder="getPromptPlaceholder()" />
        <!-- 视频时长选择 -->
    <video-duration v-model="duration" />
    <!-- 视频风格选择 -->
    <video-style v-model="selectedStyle" />
    

    
    <!-- 生成按钮 -->
    <generate-button 
      :disabled="isGenerating || !isFormValid" 
      @click="generateVideo" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VideoTabs from './components/VideoTabs.vue'
import ImageUploader from './components/ImageUploader.vue'
import PromptInput from './components/PromptInput.vue'
import VideoStyle from './components/VideoStyle.vue'
import VideoDuration from './components/VideoDuration.vue'
import GenerateButton from './components/GenerateButton.vue'

// 响应式数据
const activeTab = ref<'text' | 'image'>('text') // 默认文生视频
const imageFiles = ref<File[]>([])
const uploadMode = ref<'single' | 'first-last'>('single') // 上传模式
const prompt = ref('')
const selectedStyle = ref('')
const duration = ref(5) // 默认5秒
const isGenerating = ref(false)

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
  
  isGenerating.value = true
  
  try {
    // 这里调用视频生成API
    console.log('生成视频参数:', {
      mode: activeTab.value,
      prompt: prompt.value,
      style: selectedStyle.value,
      duration: duration.value,
      images: imageFiles.value
    })
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成成功处理
    console.log('视频生成成功!')
  } catch (error) {
    console.error('视频生成失败:', error)
  } finally {
    isGenerating.value = false
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