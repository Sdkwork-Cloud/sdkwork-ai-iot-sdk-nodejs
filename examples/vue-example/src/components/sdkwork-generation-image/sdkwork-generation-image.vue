<template>
  <div class="mobile-image-generation">
    <!-- Tabs组件 -->
    <image-tabs v-model="activeTab" />
    
    <!-- 图片上传（参考图、写真、证件照都需要） -->
    <image-uploader 
      v-if="activeTab === 'reference' || activeTab === 'portrait' || activeTab === 'idphoto'" 
      v-model="referenceImage" 
      mode="single"
    />
    
    <!-- 提示词输入 -->
    <prompt-input v-model="prompt" :placeholder="getPromptPlaceholder()" />
    
    <!-- 图片风格选择 -->
    <image-style v-model="selectedStyle" />
    
    <!-- 图片尺寸选择 -->
    <image-size v-model="selectedSize" />
    
    <!-- 写真/证件照特定设置 -->
    <photo-settings 
      v-if="activeTab === 'portrait' || activeTab === 'idphoto'" 
      v-model="photoSettings" 
      :mode="activeTab" 
    />
    
    <!-- 生成按钮 -->
    <generate-button 
      :disabled="isGenerating || !isFormValid" 
      :loading="isGenerating"
      :points-cost="pointsCost"
      @click="generateImage" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ImageTabs from './components/ImageTabs.vue'
import ImageUploader from './components/ImageUploader.vue'
import PromptInput from './components/PromptInput.vue'
import ImageStyle from './components/ImageStyle.vue'
import ImageSize from './components/ImageSize.vue'
import PhotoSettings from './components/PhotoSettings.vue'
import GenerateButton from './components/GenerateButton.vue'

// 响应式数据
const activeTab = ref<'text' | 'reference' | 'portrait' | 'idphoto'>('text') // 默认文生图片
const referenceImage = ref<File[]>([])
const prompt = ref('')
const selectedStyle = ref('')
const selectedSize = ref('1024x1024')
const photoSettings = ref({
  gender: '',
  age: '',
  background: '',
  idType: '',
  idSize: '',
  bgColor: ''
})
const isGenerating = ref(false)
const pointsCost = ref(50) // 默认消耗50积分

// 计算属性
const isFormValid = computed(() => {
  switch (activeTab.value) {
    case 'text':
      // 文生图片：只需要提示词
      return prompt.value.trim().length > 0
    case 'reference':
      // 参考图生成：需要参考图和提示词
      return referenceImage.value.length > 0 && prompt.value.trim().length > 0
    case 'portrait':
      // 写真生成：需要图片、提示词和基本设置
      return referenceImage.value.length > 0 && 
             prompt.value.trim().length > 0 && 
             photoSettings.value.gender
    case 'idphoto':
      // 证件照生成：需要图片、提示词和完整设置
      return referenceImage.value.length > 0 && 
             prompt.value.trim().length > 0 && 
             photoSettings.value.gender && 
             photoSettings.value.background
    default:
      return false
  }
})

// 方法
const getPromptPlaceholder = () => {
  switch (activeTab.value) {
    case 'text':
      return '请输入图片描述，详细描述能生成更好的效果...'
    case 'reference':
      return '描述您希望基于参考图生成的图片内容...'
    case 'portrait':
      return '描述您想要的写真风格和人物特征...'
    case 'idphoto':
      return '描述证件照的具体要求...'
    default:
      return '请输入图片描述...'
  }
}

const generateImage = async () => {
  if (!isFormValid.value || isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    // 这里调用图片生成API
    console.log('生成图片参数:', {
      mode: activeTab.value,
      prompt: prompt.value,
      style: selectedStyle.value,
      size: selectedSize.value,
      referenceImage: referenceImage.value,
      photoSettings: photoSettings.value,
      pointsCost: pointsCost.value
    })
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 生成成功处理
    console.log('图片生成成功!')
  } catch (error) {
    console.error('图片生成失败:', error)
  } finally {
    isGenerating.value = false
  }
}

// 监听tab切换
watch(activeTab, (newTab) => {
  // 切换到非参考图模式时清空图片
  if (newTab !== 'reference') {
    referenceImage.value = []
  }
  
  // 根据模式调整积分消耗
  switch (newTab) {
    case 'text':
      pointsCost.value = 50
      break
    case 'reference':
      pointsCost.value = 80
      break
    case 'portrait':
      pointsCost.value = 100
      break
    case 'idphoto':
      pointsCost.value = 120
      break
  }
})
</script>

<style scoped>
.mobile-image-generation {
  padding: 12px;
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