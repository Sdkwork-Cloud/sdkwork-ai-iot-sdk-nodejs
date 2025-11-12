<template>
  <div class="ppt-video-generation">
    <!-- PPT上传区域 -->
    <div v-if="!pptParsed" class="ppt-upload-section">
      <div class="section-header">
        <h3 class="section-title">上传PPT文件</h3>
        <p class="section-subtitle">支持上传PPT、PPTX格式文件，系统将自动解析每页内容并生成分镜</p>
      </div>
      
      <SdkworkUploaderFile
        v-model="uploadedPptFiles"
        :multiple="false"
        :auto-upload="true"
        :max-count="1"
        accept=".ppt,.pptx"
        title="点击或拖拽PPT文件到此处"
        subtitle="支持PPT、PPTX格式，文件大小不超过50MB"
        :max-size="50 * 1024 * 1024"
        @upload-success="handlePptUploadSuccess"
        @file-add="handlePptFileAdd"
      />
    </div>

    <!-- PPT解析和分镜编辑区域 -->
    <div v-else class="ppt-storyboard-section">
      <!-- PPT信息展示 -->
      <div class="ppt-info-card">
        <div class="ppt-info-header">
          <div class="ppt-icon">📊</div>
          <div class="ppt-details">
            <h4 class="ppt-name">{{ pptFileName }}</h4>
            <p class="ppt-meta">{{ totalSlides }} 页PPT | {{ formatFileSize(pptFileSize) }}</p>
          </div>
          <van-button
            type="default"
            size="small"
            @click="resetPptUpload"
            class="reset-btn"
          >
            重新上传
          </van-button>
        </div>
      </div>

      <!-- 分镜设置 -->
      <van-cell-group class="storyboard-section">
        <!-- 配音设置 -->
        <van-cell 
          :title="selectedVoice?.name || '选择配音'" 
          :label="selectedVoice ? selectedVoice.description : '点击选择配音语音'"
          icon="volume-o"
          is-link
          @click="showVoicePopup = true"
          class="option-cell"
        >
          <template #icon>
            <div class="cell-icon">🎤</div>
          </template>
        </van-cell>

        <!-- 视频风格 -->
        <van-cell 
          :title="selectedStyle?.name || '选择视频风格'" 
          :label="selectedStyle ? selectedStyle.description : '点击选择视频风格'"
          icon="apps-o"
          is-link
          @click="showStylePopup = true"
          class="option-cell"
        >
          <template #icon>
            <div class="cell-icon">🎨</div>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 分镜编辑 -->
      <div class="storyboard-editor">
        <div class="editor-header">
          <h4 class="editor-title">分镜编辑</h4>
          <van-button
            type="primary"
            size="small"
            @click="autoGenerateNarration"
            :loading="isGeneratingNarration"
            class="auto-btn"
          >
            <van-icon name="magic" />
            自动生成台词
          </van-button>
        </div>

        <div class="slides-container">
          <div 
            v-for="(slide, index) in slides" 
            :key="slide.id"
            class="slide-item"
          >
            <div class="slide-header">
              <span class="slide-number">第 {{ index + 1 }} 页</span>
              <div class="slide-actions">
                <van-button
                  type="default"
                  size="mini"
                  @click="previewSlide(slide)"
                >
                  预览
                </van-button>
              </div>
            </div>

            <div class="slide-preview">
              <img 
                v-if="slide.thumbnail"
                :src="slide.thumbnail" 
                :alt="`第${index + 1}页预览`"
                class="slide-thumbnail"
              />
              <div v-else class="slide-placeholder">
                <van-icon name="photo" size="32" />
                <span>加载预览中...</span>
              </div>
            </div>

            <div class="slide-content">
              <van-field
                v-model="slide.title"
                label="标题"
                placeholder="请输入此页标题"
                class="slide-field"
              />
              <van-field
                v-model="slide.narration"
                type="textarea"
                :rows="3"
                autosize
                label="台词"
                placeholder="请输入此页配音台词"
                maxlength="200"
                show-word-limit
                class="slide-field"
              />
              <div class="slide-duration">
                <span class="duration-label">预计时长：</span>
                <van-stepper 
                  v-model="slide.duration" 
                  :min="2" 
                  :max="30" 
                  :step="1"
                  input-width="50px"
                  button-size="24px"
                />
                <span class="duration-unit">秒</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 生成按钮 -->
    <PptGenerateButton
      v-if="pptParsed"
      :disabled="isGenerating || !isFormValid"
      :loading="isGenerating"
      @click="generateVideo"
      button-text="生成PPT视频"
    />

    <!-- 语音选择弹窗 -->
    <SdkworkVoiceSpeakerCategoryListPopup
      v-model="showVoicePopup"
      title="选择配音"
      height="100vh"
      confirm-text="确认选择"
      :selected-speaker-id="selectedVoice?.id"
      @confirm="handleVoiceConfirm"
      @select="handleVoiceSelect"
    />

    <!-- 视频风格选择弹窗 -->
    <StylePopup
      v-model="showStylePopup"
      :selected-style="selectedStyle || undefined"
      @confirm="handleStyleConfirm"
      @select="handleStyleSelect"
    />

    <!-- PPT预览弹窗 -->
    <van-popup
      v-model:show="showPreviewPopup"
      position="center"
      :style="{ width: '90%', maxHeight: '80vh' }"
      round
    >
      <div class="preview-popup">
        <div class="preview-header">
          <h4 class="preview-title">{{ currentPreviewSlide?.title || 'PPT预览' }}</h4>
          <van-button
            type="default"
            size="mini"
            @click="showPreviewPopup = false"
          >
            关闭
          </van-button>
        </div>
        <div class="preview-content">
          <img 
            v-if="currentPreviewSlide?.thumbnail"
            :src="currentPreviewSlide.thumbnail" 
            :alt="currentPreviewSlide.title"
            class="preview-image"
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SdkworkUploaderFile from '@/components/sdkwork-uploader-file/sdkwork-uploader-file.vue'
import SdkworkVoiceSpeakerCategoryListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'
import PptGenerateButton from '@/components/sdkwork-generation-video-ppt/components/PptGenerateButton.vue'
import StylePopup from '@/components/sdkwork-generation-video-ppt/components/StylePopup.vue'
import type { VoiceSpeakerVO } from '@/services'
definePage({
    meta: {
        title: 'PPT视频生成' 
    }
})
// PPT幻灯片接口
interface PptSlide {
  id: string
  pageNumber: number
  title: string
  content: string
  narration: string
  duration: number  // 时长（秒）
  thumbnail: string // 缩略图URL
  notes?: string    // 演讲者备注
}

// 视频风格接口
interface VideoStyle {
  id: string
  name: string
  description: string
  thumbnail: string
}

// 响应式数据
const uploadedPptFiles = ref<File[]>([])
const pptParsed = ref(false)
const pptFileName = ref('')
const pptFileSize = ref(0)
const totalSlides = ref(0)
const slides = ref<PptSlide[]>([])

const selectedVoice = ref<VoiceSpeakerVO | null>(null)
const showVoicePopup = ref(false)

const selectedStyle = ref<VideoStyle | null>(null)
const showStylePopup = ref(false)

const isGeneratingNarration = ref(false)
const isGenerating = ref(false)
const showPreviewPopup = ref(false)
const currentPreviewSlide = ref<PptSlide | null>(null)

// 计算属性
const isFormValid = computed(() => {
  return (
    pptParsed.value &&
    selectedVoice.value !== null &&
    selectedStyle.value !== null &&
    slides.value.every(slide => slide.narration.trim().length > 0)
  )
})

// 方法
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handlePptFileAdd = (files: File[]) => {
  console.log('PPT文件添加:', files)
}

const handlePptUploadSuccess = async (_file: File, _response: any) => {
  console.log('PPT文件上传成功:', _file, _response)
  
  // 更新PPT信息
  pptFileName.value = _file.name
  pptFileSize.value = _file.size
  
  // 模拟PPT解析过程
  try {
    // 实际应该调用API解析PPT
    await parsePptFile(_file)
  } catch (error) {
    console.error('PPT解析失败:', error)
    // 显示错误提示
    window.$message?.error('PPT解析失败，请检查文件是否损坏')
  }
}

const parsePptFile = async (_file: File) => {
  // 模拟解析过程
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 模拟解析结果，实际应该从API获取
  totalSlides.value = 5
  
  // 创建幻灯片数据
  slides.value = Array.from({ length: totalSlides.value }, (_, index) => ({
    id: `slide-${index + 1}`,
    pageNumber: index + 1,
    title: `第${index + 1}页标题`,
    content: `第${index + 1}页内容描述`,
    narration: '',  // 初始为空，等待用户填写或AI生成
    duration: 5,   // 默认5秒
    thumbnail: `https://picsum.photos/seed/ppt-slide-${index + 1}/800/450.jpg`,
    notes: `第${index + 1}页备注信息`
  }))
  
  // 标记解析完成
  pptParsed.value = true
  
  console.log('PPT解析完成，共', totalSlides.value, '页')
}

const autoGenerateNarration = async () => {
  if (isGeneratingNarration.value) return
  
  isGeneratingNarration.value = true
  
  try {
    // 模拟AI生成台词
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 为每页生成台词
    slides.value.forEach((slide, index) => {
      slide.narration = `这是第${index + 1}页的自动生成台词，可以根据PPT内容进行详细介绍，帮助观众更好地理解演示内容。`
    })
    
    console.log('自动生成台词完成')
  } catch (error) {
    console.error('自动生成台词失败:', error)
  } finally {
    isGeneratingNarration.value = false
  }
}

const resetPptUpload = () => {
  uploadedPptFiles.value = []
  pptParsed.value = false
  pptFileName.value = ''
  pptFileSize.value = 0
  totalSlides.value = 0
  slides.value = []
  selectedVoice.value = null
  selectedStyle.value = null
}

const previewSlide = (slide: PptSlide) => {
  currentPreviewSlide.value = slide
  showPreviewPopup.value = true
}

const handleVoiceSelect = (voice: VoiceSpeakerVO) => {
  selectedVoice.value = voice
}

const handleVoiceConfirm = (voice: VoiceSpeakerVO) => {
  selectedVoice.value = voice
}

const handleStyleSelect = (style: VideoStyle) => {
  selectedStyle.value = style
}

const handleStyleConfirm = (style: VideoStyle) => {
  selectedStyle.value = style
}

const generateVideo = async () => {
  if (!isFormValid.value || isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    // 构建生成参数
    const generateParams = {
      pptFile: uploadedPptFiles.value[0],
      voice: selectedVoice.value?.id,
      style: selectedStyle.value?.id,
      slides: slides.value.map(slide => ({
        id: slide.id,
        pageNumber: slide.pageNumber,
        title: slide.title,
        narration: slide.narration,
        duration: slide.duration
      }))
    }
    
    console.log('生成PPT视频参数:', generateParams)
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    console.log('PPT视频生成成功!')
    
    // 显示成功提示
    window.$message?.success('PPT视频生成成功!')
    
    // 可以在这里跳转到视频预览页面或进行其他操作
    // router.push('/video-preview?videoUrl=' + encodeURIComponent(videoUrl))
    
  } catch (error) {
    console.error('PPT视频生成失败:', error)
    window.$message?.error('PPT视频生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.ppt-video-generation {
  padding-bottom: 80px;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* PPT上传区域 */
.ppt-upload-section {
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
  text-align: center;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* PPT信息卡片 */
.ppt-info-card {
  margin: 16px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.ppt-info-header {
  display: flex;
  align-items: center;
}

.ppt-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
}

.ppt-details {
  flex: 1;
}

.ppt-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.ppt-meta {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.reset-btn {
  margin-left: 8px;
}

/* 分镜设置区域 */
.storyboard-section {
  margin: 16px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

:deep(.storyboard-section .van-cell) {
  background: var(--bg-card);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

:deep(.storyboard-section .van-cell:last-child) {
  border-bottom: none;
}

:deep(.storyboard-section .van-cell__title) {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
}

:deep(.storyboard-section .van-cell__label) {
  color: var(--text-secondary);
  font-size: 14px;
}

:deep(.storyboard-section .van-cell__right-icon) {
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

:deep(.storyboard-section .van-cell__value) {
  color: var(--text-primary);
}

/* 分镜编辑区域 */
.storyboard-editor {
  margin: 16px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.editor-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.auto-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.slides-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slide-item {
  padding: 16px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.slide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.slide-number {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.slide-preview {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-secondary);
  aspect-ratio: 16 / 9;
}

.slide-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.slide-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-secondary);
}

.slide-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slide-field {
  background: var(--bg-secondary);
}

:deep(.slide-field .van-field__label) {
  color: var(--text-primary);
  font-weight: 500;
}

:deep(.slide-field .van-field__control) {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.slide-duration {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-label {
  font-size: 14px;
  color: var(--text-primary);
}

.duration-unit {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 预览弹窗 */
.preview-popup {
  padding: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.preview-content {
  width: 100%;
  text-align: center;
}

.preview-image {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
}

/* 主题变量 */
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

/* 浅色模式 */
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

/* 深色模式 */
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