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
    <photo-settings-component 
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
import { useGenerationStore } from '@/stores/modules/generation/generation'
import type { GenerateImageParam } from 'sdkwork-sdk-api-typescript'
import type { 
  SdkworkGenerationImageProps, 
  SdkworkGenerationImageEvents,
  ImageGenerationMode,
  PhotoSettings 
} from './types'
import {
  ImageTabs,
  ImageUploader,
  PromptInput,
  ImageStyle,
  ImageSize,
  PhotoSettings as PhotoSettingsComponent,
  GenerateButton
} from './components'

// 定义Props并设置默认值
const props = withDefaults(defineProps<SdkworkGenerationImageProps>(), {
  defaultTab: 'text',
  disabled: false,
  showPointsCost: true,
  pointsCoefficient: 1
})

// 定义事件
const emit = defineEmits<SdkworkGenerationImageEvents>()

// 状态管理
const generationStore = useGenerationStore()

// 响应式数据
const activeTab = ref<ImageGenerationMode>(props.defaultTab || 'text')
const referenceImage = ref<File[]>([])
const prompt = ref('')
const selectedStyle = ref('')
const selectedSize = ref('1024x1024')
const photoSettings = ref<PhotoSettings>({
  gender: '',
  age: '',
  background: '',
  idType: '',
  idSize: '',
  bgColor: ''
})
const isGenerating = ref(false)
const pointsCost = ref(50 * props.pointsCoefficient) // 基础积分消耗乘以系数

// 计算属性
const isFormValid = computed(() => {
  if (props.disabled) return false
  
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
    // 构建API参数
    const [width, height] = selectedSize.value.split('x').map(Number)
    
    // 基础参数
    const params: GenerateImageParam = {
      prompt: prompt.value,
      model: selectedStyle.value || 'stable-diffusion-v1.5',
      width: width || 1024,
      height: height || 1024,
      n: 1,
      responseFormat: 'url',
      aspectRatio: selectedSize.value.includes(':') ? selectedSize.value : '1:1',
      style: selectedStyle.value
    }
    
    // 发射生成开始事件
    emit('generation-start', params)
    
    // 调用store中的generateImage方法
    const result = await generationStore.generateImage(params)
    
    // 发射成功事件
    emit('generation-success', result)
    
    // 成功提示
    console.log('图片生成成功:', result)
  } catch (error) {
    // 标准化错误对象
    const errorObj = error instanceof Error ? error : new Error(String(error))
    
    // 发射错误事件
    emit('generation-error', errorObj)
    console.error('图片生成失败:', errorObj)
    
    // 显示错误提示
    console.error('生成失败:', errorObj.message)
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
  const baseCost: Record<ImageGenerationMode, number> = {
    'text': 50,
    'reference': 80,
    'portrait': 100,
    'idphoto': 120
  }
  pointsCost.value = baseCost[newTab] * props.pointsCoefficient
  
  // 发射标签页切换事件
  emit('tab-change', newTab)
})

// 监听表单验证状态变化
watch(isFormValid, (isValid) => {
  // 使用类型断言确保类型兼容性
  (emit as any)('validation-change', isValid)
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