<template>
  <div class="minimal-dubbing-generation">
    <!-- 图片上传区域 -->
    <div class="image-section">
      <sdkwork-uploader-image
        v-model="uploadedImageFiles"
        :multiple="false"
        :auto-upload="true"
        :max-count="1"
        title="上传或生成角色图片"
        subtitle="支持 JPG、PNG、GIF、WEBP 等格式，或使用AI生成"
        :show-prompt="true"
        :ai-generate="true"
        :prompt-value="imagePrompt"
        @update:prompt="handlePromptUpdate"
        @ai-generate="handleAiGenerate"
        @image-ai-generate="handleImageAiGenerate"
        @upload-success="handleUploadSuccess"
        @image-remove="handleImageRemove"
        @image-preview="handleImagePreview"
        class="image-uploader"
      />
    </div>
  <!-- 文字输入 -->
      <div class="text-section">
        <div class="section-header">
          <span class="section-title">口播文字</span>
          <span class="char-count"></span>
        </div>
        <van-field
          v-model="scriptText"
          type="textarea"
          :rows="4"
          autosize
          maxlength="1000"
          show-word-limit
          placeholder="请输入口播文字内容..."
          class="script-field"
        />
        <div class="ai-suggestion">
          <van-button 
            size="small" 
            @click="generateWithAI"
            :loading="isGeneratingAI"
            class="ai-btn"
          >
            <van-icon name="magic" />
            AI生成
          </van-button>
        </div>
      </div>
    <!-- 核心功能区域 -->
    <van-cell-group class="core-section">
        <!-- 分镜选择 -->
      <van-cell 
        :title="selectedStoryboard ? `分镜设置 (${selectedStoryboard.shots.length}个镜头)` : '选择分镜'" 
        :label="selectedStoryboard ? selectedStoryboard.videoDescription : '点击设置分镜'"
        icon="photo-o"
        is-link
        @click="showStoryboardPopup = true"
        class="option-cell"
      >
        <template #icon>
          <div class="cell-icon">🎬</div>
        </template>
      </van-cell>
      <!-- 角色选择 -->
      <van-cell 
        :title="selectedCameo?.name || '选择角色'" 
        :label="selectedCameo ? selectedCameo.description : '点击选择角色'"
        icon="user-o"
        is-link
        @click="showCameoPopup = true"
        class="option-cell"
      >
        <template #icon>
          <div class="cell-icon">👤</div>
        </template>
      </van-cell>

      <!-- 语音选择 -->
      <van-cell 
        :title="selectedVoice?.name || '选择语音'" 
        :label="selectedVoice ? selectedVoice.description : '点击选择语音'"
        icon="volume-o"
        is-link
        @click="showVoicePopup = true"
        class="option-cell"
      >
        <template #icon>
          <div class="cell-icon">🎤</div>
        </template>
      </van-cell>

    
    </van-cell-group>

    <!-- 生成按钮 -->
    <GenerateButton
      :disabled="isGenerating || !isFormValid"
      :loading="isGenerating"
      @click="generateDubbingVideo"
    />

    <!-- 角色选择弹窗 -->
    <SdkworkCameosListPopup
      v-model="showCameoPopup"
      title="选择角色"
      height="100vh"
      confirm-text="确认选择"
      :selected-cameo-id="selectedCameo?.id"
      @confirm="handleCameoConfirm"
      @select="handleCameoSelect"
    />

    <!-- 语音选择弹窗 -->
    <SdkworkVoiceSpeakerCategoryListPopup
      v-model="showVoicePopup"
      title="选择语音"
      height="100vh"
      confirm-text="确认选择"
      :selected-speaker-id="selectedVoice?.id"
      @confirm="handleVoiceConfirm"
      @select="handleVoiceSelect"
    />

    <!-- 分镜选择弹窗 -->
    <StoryboardPopup
      v-model="showStoryboardPopup"
      :selected-storyboard="selectedStoryboard"
      @confirm="handleStoryboardConfirm"
      @select="handleStoryboardSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SdkworkCameosListPopup from '@/components/sdkwork-cameos-list-popup/sdkwork-cameos-list-popup.vue'
import SdkworkVoiceSpeakerCategoryListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'
import GenerateButton from './components/GenerateButton.vue'
import StoryboardPopup from './components/StoryboardPopup.vue'
import SdkworkUploaderImage from '@/components/sdkwork-uploader-image/sdkwork-uploader-image.vue'
import type { Cameo } from '@/components/sdkwork-cameos-list/types'
import type { VoiceSpeakerVO } from '@/services'

interface Shot {
  id: string
  content: string  // 镜头内容描述
  dialogue: string  // 播报内容（台词）
  duration: number  // 时长（秒）
  startFrame?: string  // 首帧图片URL或描述
  endFrame?: string    // 尾帧图片URL或描述
}

interface Storyboard {
  videoDescription: string  // 视频描述
  shots: Shot[]              // 镜头列表
}

interface Emits {
  (e: 'showHelp'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const uploadedImage = ref<File | null>(null)
const uploadedImageFiles = ref<File[]>([])
const imagePreviewUrl = ref('')
const imagePrompt = ref('')
const isGeneratingImage = ref(false)

const selectedCameo = ref<Cameo | null>(null)
const showCameoPopup = ref(false)

const selectedVoice = ref<VoiceSpeakerVO | null>(null)
const showVoicePopup = ref(false)

const selectedStoryboard = ref<Storyboard | null|any>(null)
const showStoryboardPopup = ref(false)

const scriptText = ref('')
const isGeneratingAI = ref(false)

const isGenerating = ref(false)

// 计算属性：表单验证
const isFormValid = computed(() => {
  return (
    (uploadedImage.value !== null || selectedCameo.value !== null) &&
    selectedVoice.value !== null &&
    selectedStoryboard.value !== null &&
    scriptText.value.trim().length > 0
  )
})

// 图片上传相关方法
const handleUploadSuccess = (fileInfo: any) => {
  const file = fileInfo.file || fileInfo
  uploadedImage.value = file
  
  // 生成预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreviewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleImageRemove = () => {
  uploadedImage.value = null
  imagePreviewUrl.value = ''
}

const handleImagePreview = (image: any) => {
  // 处理图片预览
  console.log('Preview image:', image)
}

// AI图片生成相关方法
const handlePromptUpdate = (prompt: string) => {
  imagePrompt.value = prompt
}

const handleAiGenerate = (prompt: string) => {
  imagePrompt.value = prompt
  generateImageWithAI(prompt)
}

const handleImageAiGenerate = () => {
  if (!imagePrompt.value.trim()) {
    imagePrompt.value = '生成一个适合口播视频的角色形象，表情自然，背景简洁'
  }
  generateImageWithAI(imagePrompt.value)
}

const generateImageWithAI = async (prompt: string) => {
  if (isGeneratingImage.value) return
  
  isGeneratingImage.value = true
  
  try {
    // 模拟AI图片生成
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 生成一个模拟的图片URL
    const aiImageUrl = `https://picsum.photos/seed/${Date.now()}/400/300.jpg`
    
    // 创建一个模拟的File对象
    fetch(aiImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'ai-generated.jpg', { type: 'image/jpeg' })
        uploadedImageFiles.value = [file]
        uploadedImage.value = file
        imagePreviewUrl.value = aiImageUrl
      })
    
    console.log('AI图片生成成功:', prompt)
  } catch (error) {
    console.error('AI图片生成失败:', error)
  } finally {
    isGeneratingImage.value = false
  }
}

// AI生成文字
const generateWithAI = async () => {
  if (isGeneratingAI.value) return
  
  isGeneratingAI.value = true
  
  try {
    // 模拟AI生成
    await new Promise(resolve => setTimeout(resolve, 2000))
    scriptText.value = `这是一段由AI生成的口播文字示例，可以根据您的需求进行修改。AI生成的文字能够更好地匹配语音节奏和情感表达。`
  } catch (error) {
    console.error('AI生成失败:', error)
  } finally {
    isGeneratingAI.value = false
  }
}

// 角色选择处理
const handleCameoSelect = (cameo: Cameo) => {
  selectedCameo.value = cameo
}

const handleCameoConfirm = (cameo: Cameo) => {
  selectedCameo.value = cameo
}

// 语音选择处理
const handleVoiceSelect = (voice: VoiceSpeakerVO) => {
  selectedVoice.value = voice
}

const handleVoiceConfirm = (voice: VoiceSpeakerVO) => {
  selectedVoice.value = voice
}

// 分镜选择处理
const handleStoryboardSelect = (storyboard: Storyboard) => {
  selectedStoryboard.value = storyboard
}

const handleStoryboardConfirm = (storyboard: Storyboard) => {
  selectedStoryboard.value = storyboard
}

// 同步上传图片文件数组和图片对象
watch(uploadedImage, (newValue) => {
  if (newValue) {
    if (!uploadedImageFiles.value.includes(newValue)) {
      uploadedImageFiles.value = [newValue]
    }
  } else {
    uploadedImageFiles.value = []
  }
})

// 生成口播视频
const generateDubbingVideo = async () => {
  if (!isFormValid.value || isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    // 构建生成参数
    const generateParams = {
      character: uploadedImage.value ? 'uploaded' : selectedCameo.value?.id,
      voice: selectedVoice.value?.id,
      storyboard: selectedStoryboard.value?.id,
      script: scriptText.value
    }
    
    console.log('生成口播视频参数:', generateParams)
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    console.log('口播视频生成成功!')
    
    // 这里可以添加成功提示
  } catch (error) {
    console.error('口播视频生成失败:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.minimal-dubbing-generation {
  padding-bottom: 200px;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* 图片上传区域 */
.image-section {
  margin-bottom: 24px;
  padding: 0 5px;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-card);
}

.upload-area:hover {
  border-color: var(--accent-blue);
  background: rgba(24, 144, 255, 0.05);
}

.upload-placeholder {
  color: var(--text-secondary);
}

.upload-placeholder .van-icon {
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.upload-hint {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.upload-preview {
  position: relative;
  display: inline-block;
}

.upload-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.upload-actions {
  position: absolute;
  top: 8px;
  right: 8px;
}

.remove-btn {
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
}

/* 核心功能区域 */
.core-section {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

:deep(.core-section .van-cell) {
  background: var(--bg-card);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

:deep(.core-section .van-cell:last-child) {
  border-bottom: none;
}

:deep(.core-section .van-cell__title) {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
}

:deep(.core-section .van-cell__label) {
  color: var(--text-secondary);
  font-size: 14px;
}

:deep(.core-section .van-cell__right-icon) {
  color: var(--text-secondary);
}

.cell-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 12px;
}

:deep(.core-section .van-cell__value) {
  color: var(--text-primary);
}

/* 文字输入区域 */
.text-section {
  margin-top: 16px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
}

.char-count {
  font-size: 12px;
  color: var(--text-secondary);
}

:deep(.script-field .van-field__body) {
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

:deep(.script-field .van-field__control) {
  color: var(--text-primary);
}

.ai-suggestion {
  margin-top: 12px;
  text-align: right;
}

.ai-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
}

/* 生成按钮区域 */
.generate-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
}

.generate-btn {
  background: var(--gradient-primary);
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  height: 52px;
}

.generate-btn:disabled {
  background: var(--bg-secondary);
  color: var(--text-secondary);
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