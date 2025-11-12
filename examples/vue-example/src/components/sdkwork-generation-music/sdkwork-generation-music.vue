<template>
  <div class="mobile-music-generation">
    <!-- Header区域 -->
    <music-header 
      v-model="selectedModel" 
    />
    
    <!-- 歌曲信息输入区 -->
    <song-input 
      v-model="songInfo"
      :show-lyrics="showLyrics"
      :disabled="props.disabled"
      @toggle-lyrics="handleLyricsToggle"
      @show-config="handleShowConfig"
    />
    
    <!-- 歌词编辑区 -->
    <lyrics-editor 
      v-if="showLyrics"
      v-model="lyrics"
      :disabled="props.disabled"
    />
    
    <!-- 配置面板 -->
    <music-config-panel 
      v-model="config"
      v-model:show="showConfigPanel"
      :disabled="props.disabled"
    />
    
    <!-- 底部生成按钮 -->
    <music-generate-button 
      :disabled="props.disabled || isGenerating || !isFormValid"
      :loading="isGenerating"
      :points-cost="50 * props.pointsCoefficient"
      @click="generateMusic"
    />
    

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGenerationStore } from '@/stores/modules/generation/generation'
import type { GenerateMusicParam } from 'sdkwork-sdk-api-typescript'
import type { 
  SdkworkGenerationMusicProps, 
  SdkworkGenerationMusicEvents,
  MusicConfig 
} from './types'
import {
  MusicHeader,
  SongInput,
  LyricsEditor,
  MusicGenerateButton,
  MusicConfigPanel
} from './components'

// 定义Props并设置默认值
const props = withDefaults(defineProps<SdkworkGenerationMusicProps>(), {
  defaultModel: 'music-gen-v1',
  disabled: false,
  showLyrics: false,
  defaultLyrics: '',
  pointsCoefficient: 1
})

// 定义事件
const emit = defineEmits<SdkworkGenerationMusicEvents>()

// 状态管理
const generationStore = useGenerationStore()

// 响应式数据
const selectedModel = ref(props.defaultModel || 'music-gen-v1') // 默认模型
const songInfo = ref('一首轻快的流行歌曲') // 歌曲标题/描述
const showLyrics = ref(props.showLyrics || false) // 是否显示歌词
const lyrics = ref(props.defaultLyrics || '') // 歌词内容
const isGenerating = ref(false) // 是否正在生成 
const showConfigPanel = ref(false) // 是否显示配置面板
const config = ref<MusicConfig>({
  style: '',
  emotion: '',
  scene: '',
  bpm: '',
  duration: ''
}) // 音乐配置

// 计算属性：表单验证
const isFormValid = computed(() => {
  if (props.disabled) return false
  return songInfo.value.trim().length > 0
})

// 监听表单验证状态变化
watch(isFormValid, (isValid) => {
  emit('validation-change', isValid)
})

// 监听模型选择变化
watch(selectedModel, (model) => {
  emit('model-change', model)
})

// 处理歌词切换
const handleLyricsToggle = (value: boolean) => {
  showLyrics.value = value
}

// 处理配置面板显示
const handleShowConfig = () => {
  showConfigPanel.value = true
}

// 生成音乐方法
const generateMusic = async () => {
  if (!isFormValid.value || isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    // 构建API参数
    const params: GenerateMusicParam = {
      prompt: songInfo.value,
      model: selectedModel.value,
      lyrics: showLyrics.value ? lyrics.value : '',
      n: 1,
      tempo: config.value.bpm ? Number(config.value.bpm) : undefined,
      style: config.value.style || '',
      instrument: config.value.emotion || ''
    }
    
    // 发射生成开始事件
    emit('generation-start', params)
    
    // 调用store中的generateMusic方法
    const result = await generationStore.generateMusic(params)
    
    // 发射成功事件
    emit('generation-success', result)
    
    // 成功提示
    console.log('音乐生成成功:', result)
  } catch (error) {
    // 标准化错误对象
    const errorObj = error instanceof Error ? error : new Error(String(error))
    
    // 发射错误事件
    emit('generation-error', errorObj)
    console.error('音乐生成失败:', errorObj)
    
    // 显示错误提示
    console.error('生成失败:', errorObj.message)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.mobile-music-generation {
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