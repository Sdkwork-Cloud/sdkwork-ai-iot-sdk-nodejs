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
      @toggle-lyrics="showLyrics = !showLyrics"
      @show-config="showConfigPanel = true"
    />
    
    <!-- 歌词编辑区 -->
    <lyrics-editor 
      v-if="showLyrics"
      v-model="lyrics"
    />
    
    <!-- 配置面板 -->
    <music-config-panel 
      v-model="config"
      v-model:show="showConfigPanel"
    />
    
    <!-- 底部生成按钮 -->
    <music-generate-button 
      :disabled="isGenerating || !isFormValid"
      :loading="isGenerating"
      @click="generateMusic"
    />
    

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MusicHeader from './components/MusicHeader.vue'
import SongInput from './components/SongInput.vue'
import LyricsEditor from './components/LyricsEditor.vue'
import MusicGenerateButton from './components/MusicGenerateButton.vue'
import MusicConfigPanel from './components/MusicConfigPanel.vue'

// 响应式数据
const selectedModel = ref('music-gen-v1') // 默认模型
const songInfo = ref('') // 歌曲标题/描述
const showLyrics = ref(false) // 是否显示歌词
const lyrics = ref('') // 歌词内容
const isGenerating = ref(false) // 是否正在生成 
const showConfigPanel = ref(false) // 是否显示配置面板
const config = ref({
  style: '',
  emotion: '',
  scene: '',
  bpm: '',
  duration: ''
}) // 音乐配置

// 计算属性：表单验证
const isFormValid = computed(() => {
  return songInfo.value.trim().length > 0
})

// 生成音乐方法
const generateMusic = async () => {
  if (!isFormValid.value || isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    // 调用音乐生成API
    console.log('生成音乐参数:', {
      model: selectedModel.value,
      songInfo: songInfo.value,
      lyrics: showLyrics.value ? lyrics.value : ''
    })
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 生成成功处理
    console.log('音乐生成成功!')
  } catch (error) {
    console.error('音乐生成失败:', error)
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