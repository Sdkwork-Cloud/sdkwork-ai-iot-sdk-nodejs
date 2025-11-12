<template>
  <div class="tech-toolbar">
    <!-- 左侧操作区 -->
    <div class="left-actions" v-if="showUploadButton">
      <!-- 添加媒体按钮 -->
      <div class="tech-button-container">
        <van-uploader :after-read="handleMediaUpload" accept="image/*,video/*" multiple>
          <div class="tech-button" :class="{ 'loading': uploading }">
            <Icon v-if="uploadButtonText" icon="ri:upload-2-line" width="16" height="16" class="button-icon" />
            <span v-if="uploadButtonText" class="button-text">{{ uploadButtonText }}</span>
            <Icon v-else icon="ri:add-line" width="16" height="16" class="button-icon" />
          </div>
        </van-uploader>
      </div>
      
      <!-- 背景音乐选择 -->
      <div class="tech-button" :class="{ 'active': selectedBackgroundMusic }" @click="openBackgroundMusicDialog">
        <Icon icon="ri:music-2-line" width="16" height="16" class="button-icon" />
      </div>
      
      <!-- 视频比例选择 -->
      <van-popover
        v-model:show="showAspectRatioPopover"
        placement="top"
        theme="dark"
      >
        <template #reference>
          <div class="tech-button">
            <Icon icon="ri:aspect-ratio-line" width="16" height="16" class="button-icon" />
          </div>
        </template>
        <div class="aspect-ratio-popover">
          <div 
            v-for="option in aspectRatioOptions"
            :key="option.value"
            class="ratio-option"
            :class="{ 'active': selectedAspectRatio === option.value }"
            @click="selectAspectRatio(option.value)"
          >
            {{ option.text }}
          </div>
        </div>
      </van-popover>
    </div>
    
    <!-- 中间操作区 - 生成视频按钮 -->
    <div class="center-actions">
      <div class="video-generate-button" 
           :class="{ 'loading': generatingVideo, 'disabled': !hasMessages }"
           @click="hasMessages && openVideoGenerateDialog()">
        <Icon icon="ri:video-line" width="18" height="18" class="button-icon" />
        <span>生成视频</span>
      </div>
    </div>
    
    <!-- 右侧操作区 -->
    <div class="right-actions">
      <!-- 语音输入 -->
      <div class="tech-button-container">
        <div 
          class="tech-button secondary"
          :class="{ 'loading': speechInputActive }"
          @click="$emit('start-speech-input')"
        >
          <Icon icon="ri:mic-line" width="16" height="16" class="button-icon" />
        </div>
      </div>
      
      <!-- 生成对话 -->
      <div v-if="characters.length >= 2" class="tech-button-container">
        <div 
          class="tech-button primary"
          :class="{ 'loading': generatingDialogue, 'disabled': !inputText.trim() }"
          @click="inputText.trim() && $emit('generate-dialogue')"
        >
          <Icon icon="ri:chat-3-line" width="16" height="16" class="button-icon" />
        </div>
      </div>
    </div>
    
    <!-- 视频生成弹窗 -->
    <VideoGenerateDialog
      v-model="showVideoGenerateDialog"
      :generating="generatingVideo"
      :default-aspect-ratio="selectedAspectRatio"
      @generate="handleVideoGenerate"
    />
    
    <!-- 背景音乐选择弹窗 -->
    <BackgroundMusicDialog
      v-model="showBackgroundMusicDialog"
      :default-music-id="selectedBackgroundMusic"
      @music-change="handleBackgroundMusicChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useTheme } from '@/hooks/theme/useTheme'
import VideoGenerateDialog from './VideoGenerateDialog.vue'
import BackgroundMusicDialog from './BackgroundMusicDialog.vue'

// Props定义
interface Props {
  characters: { length: number }
  inputText: string
  generatingDialogue: boolean
  generatingVideo: boolean
  hasMessages: boolean
  speechInputActive?: boolean
  showUploadButton?: boolean
  uploadButtonText?: string
  defaultAspectRatio?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputText: '',
  generatingDialogue: false,
  generatingVideo: false,
  hasMessages: false,
  speechInputActive: false,
  showUploadButton: true,
  uploadButtonText: '',
  defaultAspectRatio: '16:9'
})

// 视频生成参数接口
interface VideoGenerateParams {
  aspectRatio: string
  duration: number
  quality: string
  styleStrength: number
  motionIntensity: number
  backgroundMusic?: string
}

// Emits定义
const emit = defineEmits<{
  'generate-dialogue': []
  'generate-video': [params: VideoGenerateParams]
  'start-speech-input': []
  'aspect-ratio-change': [aspectRatio: string]
  'background-music-change': [musicId: string]
  'media-upload': [files: File[]]
}>()

// 上传状态
const uploading = ref(false)

// 视频比例选择
const selectedAspectRatio = ref(props.defaultAspectRatio)
const showAspectRatioPopover = ref(false)

// 视频生成弹窗状态
const showVideoGenerateDialog = ref(false)

// 背景音乐选择
const selectedBackgroundMusic = ref('')
const showBackgroundMusicDialog = ref(false)

// 视频比例选项 - 科技蓝主题
const aspectRatioOptions = [
  { text: '16:9', value: '16:9' },
  { text: '9:16', value: '9:16' },
  { text: '1:1', value: '1:1' },
  { text: '4:3', value: '4:3' },
  { text: '21:9', value: '21:9' }
]



// 主题状态
const { isDarkMode } = useTheme()

// 处理媒体上传
const handleMediaUpload = async (files: any) => {
  if (files && files.length > 0) {
    uploading.value = true
    
    try {
      const fileArray = Array.isArray(files) ? files : [files]
      
      // 文件大小检查（可以设置最大文件大小限制）
      const maxSize = 10 * 1024 * 1024 // 10MB
      const oversizedFiles = fileArray.filter((file: File) => file.size > maxSize)
      
      if (oversizedFiles.length > 0) {
        // 这里可以添加错误提示或文件压缩逻辑
        console.warn('文件过大:', oversizedFiles)
      }
      
      // 延迟模拟上传过程，实际应用中替换为真实上传逻辑
      await new Promise(resolve => setTimeout(resolve, 500))
      
      emit('media-upload', fileArray)
    } catch (error) {
      console.error('上传失败:', error)
    } finally {
      uploading.value = false
    }
  }
}



// 选择视频比例
const selectAspectRatio = (ratio: string) => {
  selectedAspectRatio.value = ratio
  showAspectRatioPopover.value = false
  emit('aspect-ratio-change', ratio)
}

// 打开视频生成弹窗
const openVideoGenerateDialog = () => {
  showVideoGenerateDialog.value = true
}

// 打开背景音乐弹窗
const openBackgroundMusicDialog = () => {
  showBackgroundMusicDialog.value = true
}

// 处理背景音乐变化
const handleBackgroundMusicChange = (musicId: string) => {
  selectedBackgroundMusic.value = musicId
  emit('background-music-change', musicId)
}

// 处理视频生成
const handleVideoGenerate = (params: any) => {
  // 更新选中的宽高比
  if (params.aspectRatio) {
    selectedAspectRatio.value = params.aspectRatio
    emit('aspect-ratio-change', params.aspectRatio)
  }
  
  // 添加背景音乐参数
  if (selectedBackgroundMusic.value) {
    params.backgroundMusic = selectedBackgroundMusic.value
  }
  
  // 触发父组件的生成视频事件，传递所有参数
  emit('generate-video', params)
}
</script>

<style scoped>
/* 主工具栏容器 - 科技蓝主题 */
.tech-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.08);
  position: relative;
  overflow: hidden;
}

/* 科技感背景纹理 */
.tech-toolbar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(0, 122, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0, 122, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.left-actions, .right-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.center-actions {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 科技按钮容器 */
.tech-button-container {
  position: relative;
}

/* 无边框科技按钮基础样式 */
.tech-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.15);
}

.tech-button.primary {
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.tech-button.secondary {
  background: linear-gradient(135deg, #5ac8fa 0%, #007aff 100%);
  box-shadow: 0 2px 8px rgba(90, 200, 250, 0.3);
}

.tech-button.success {
  background: linear-gradient(135deg, #30d158 0%, #00a832 100%);
  box-shadow: 0 2px 8px rgba(48, 209, 88, 0.3);
}

.tech-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.25);
}

.tech-button.primary:hover {
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
}

.tech-button.secondary:hover {
  box-shadow: 0 4px 12px rgba(90, 200, 250, 0.4);
}

.tech-button.success:hover {
  box-shadow: 0 4px 12px rgba(48, 209, 88, 0.4);
}

.tech-button:active {
  transform: translateY(0) scale(0.98);
}

.tech-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 加载状态 */
.tech-button.loading {
  position: relative;
  color: transparent;
}

.tech-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 图标样式 */
.button-icon {
  color: #333;
}

.tech-button.primary .button-icon,
.tech-button.secondary .button-icon,
.tech-button.success .button-icon {
  color: white;
}

/* 按钮文本 */
.button-text {
  margin-left: 4px;
  font-size: 12px;
  font-weight: 500;
}



/* 视频比例选择器弹窗 */
.aspect-ratio-popover {
  padding: 8px 0;
  border-radius: 12px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.ratio-option {
  padding: 10px 36px 10px 20px;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ratio-option:hover {
  background: rgba(0, 122, 255, 0.3);
}

.ratio-option.active {
  color: #007aff;
  background: rgba(0, 122, 255, 0.2);
}

.ratio-option.active::after {
  content: '✓';
  color: #007aff;
  font-weight: bold;
  margin-left: 8px;
}

/* 视频比例选择器按钮 */
.tech-button[title="Aspect Ratio"] {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.2) 100%);
}

/* 中间视频生成按钮样式 */
.video-generate-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: white;
  font-weight: 500;
  font-size: 14px;
  position: relative;
}

.video-generate-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
}

.video-generate-button:active {
  transform: translateY(0);
}

.video-generate-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.video-generate-button.loading {
  color: transparent;
}

.video-generate-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

/* 深色主题适配 */
html[data-theme="dark"] .tech-toolbar {
  background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%);
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.15);
}

html[data-theme="dark"] .tech-button {
  background: rgba(44, 44, 46, 0.9);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
}

html[data-theme="dark"] .button-icon {
  color: #ffffff;
}

html[data-theme="dark"] .tech-toolbar::before {
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(0, 122, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(0, 122, 255, 0.05) 0%, transparent 50%);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .tech-toolbar {
    padding: 6px 8px;
  }
  
  .left-actions, .right-actions {
    gap: 8px;
  }
  
  .tech-button {
    width: 32px;
    height: 32px;
  }
}
@media (max-width: 768px) {
  .toolbar-row {
    padding: 2px 8px;
  }
  
  .right-actions .van-button,
  .left-actions .van-button {
    width: 36px;
    height: 36px;
  }
}
</style>