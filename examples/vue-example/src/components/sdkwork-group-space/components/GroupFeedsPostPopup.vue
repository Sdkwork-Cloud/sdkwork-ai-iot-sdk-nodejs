<template>
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    :style="{ height: '95%' }"
    round
  >
    <div class="feeds-post-popup">
      <div class="popup-header">
        <div class="popup-title">发布动态</div>
        <van-button
          type="default"
          size="small"
          @click="handleCancel"
          class="cancel-button"
        >
          取消
        </van-button>
      </div>
      
      <div class="popup-content">
        <!-- 主要内容区 -->
        <div class="content-area">
          <van-field
            v-model="postContent"
            type="textarea"
            placeholder="分享你的想法..."
            rows="6"
            maxlength="500"
            show-word-limit
            class="content-input"
            autosize
          />
          
          <!-- 添加内容区域 -->
          <div class="add-content-area">
            <div class="content-items">
              <!-- 图片上传区域 -->
              <div v-if="previewImages.length === 0" class="add-item" @click="selectImages">
                <Icon icon="ri:image-add-line" width="20" height="20" />
                <span>图片</span>
              </div>
              
            <!-- 添加更多图片按钮 -->
            <div v-if="previewImages.length > 0 && previewImages.length < 9" class="add-item" @click="selectImages">
              <Icon icon="ri:image-add-line" width="20" height="20" />
              <span>更多图片</span>
            </div>
              
              <!-- 视频按钮 -->
              <div v-if="!previewVideo" class="add-item" @click="selectVideo">
                <Icon icon="ri:video-line" width="20" height="20" />
                <span>视频</span>
              </div>
              
              <!-- 语音按钮 -->
              <div v-if="!previewAudio" class="add-item" @click="recordAudio">
                <Icon icon="ri:mic-line" width="20" height="20" />
                <span>语音</span>
              </div>
              
              <!-- 文件按钮 -->
              <div v-if="previewFiles.length === 0" class="add-item" @click="selectFiles">
                <Icon icon="ri:attachment-2" width="20" height="20" />
                <span>附件</span>
              </div>
              
              <!-- 链接按钮 -->
              <div class="add-item" @click="showLinkInput = !showLinkInput" :class="{ 'active': showLinkInput }">
                <Icon icon="ri:link" width="20" height="20" />
                <span>链接</span>
              </div>
            </div>
          </div>
          
          <!-- 图片预览 -->
          <ImagePreview 
            :images="previewImages" 
            @delete="removeImage" 
            @add-more="selectImages"
          />
          
          <!-- 视频预览 -->
          <VideoPreview 
            v-if="previewVideo" 
            :video-url="previewVideo" 
            @delete="removeVideo"
          />
          
          <!-- 音频预览 -->
          <AudioPreview 
            v-if="previewAudio" 
            :audio-url="previewAudio" 
            :recording="recordingAudio"
            @delete="removeAudio"
          />
          
          <!-- 文件预览 -->
          <FilePreview 
            :files="previewFiles" 
            @delete="removeFile"
          />
          
          <!-- 链接预览 -->
          <LinkPreview 
            v-if="linkPreview" 
            :preview-data="linkPreview"
          />
        </div>
        
        <!-- 链接输入区域 -->
        <div v-if="showLinkInput" class="link-input-area">
          <van-field
            v-model="linkUrl"
            placeholder="输入链接地址"
            class="link-input"
          >
            <template #left-icon>
              <Icon icon="ri:link" />
            </template>
          </van-field>
        </div>
      </div>
      
      <!-- 底部操作栏 -->
      <div class="popup-footer">
        <van-button
          type="primary"
          size="large"
          :loading="publishing"
          @click="handleSubmit"
          class="submit-button"
          block
        >
          发布
        </van-button>
      </div>
    </div>
  </van-popup>
  

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'
import { useFileDialog } from '@vueuse/core'
import AudioPreview from './AudioPreview.vue'
import VideoPreview from './VideoPreview.vue'
import FilePreview from './FilePreview.vue'
import ImagePreview from './ImagePreview.vue'
import LinkPreview from './LinkPreview.vue'

// Props定义
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// 事件定义
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', content: string, type: string, data: any): void
}

const emit = defineEmits<Emits>()

// 弹窗状态
const showPopup = ref(props.modelValue)
const postContent = ref('')
const publishing = ref(false)
const showLinkInput = ref(false)

// 图片相关
const previewImages = ref<string[]>([])

// 视频相关
const previewVideo = ref<string>('')

// 语音相关
const previewAudio = ref<string>('')
const recordingAudio = ref(false)

// 文件对话框
const { open: selectImagesDialog, onChange: onImagesChange } = useFileDialog({
  accept: 'image/*',
  multiple: true
})

const { open: selectVideoDialog, onChange: onVideoChange } = useFileDialog({
  accept: 'video/*',
  multiple: false
})

const { open: selectFilesDialog, onChange: onFilesChange } = useFileDialog({
  multiple: true
})

// 链接相关
const linkUrl = ref('')
const linkPreview = ref<any>(null)

// 文件相关
const previewFiles = ref<File[]>([])



// 监听弹窗显示状态
watch(() => props.modelValue, (newVal) => {
  showPopup.value = newVal
  if (!newVal) {
    // 关闭弹窗时清空内容
    resetFormData()
  }
})

// 监听本地弹窗状态变化
watch(showPopup, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听链接URL变化
watch(linkUrl, (newVal) => {
  if (newVal && isValidUrl(newVal)) {
    // 模拟获取链接预览
    setTimeout(() => {
      linkPreview.value = {
        title: '链接预览标题',
        description: '这是一个链接预览描述',
        image: 'https://picsum.photos/seed/preview/300/200.jpg'
      }
    }, 500)
  } else {
    linkPreview.value = null
  }
})

// 监听图片选择
onImagesChange((files) => {
  if (!files) return
  
  const maxSize = 5 * 1024 * 1024 // 5MB
  const validImages: string[] = []
  
  for (let i = 0; i < files.length && previewImages.value.length + validImages.length < 9; i++) {
    const file = files[i]
    if (file.size > maxSize) {
      showToast('图片大小不能超过5MB')
      continue
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      validImages.push(result)
      
      if (validImages.length === Math.min(files.length, 9 - previewImages.value.length)) {
        previewImages.value = [...previewImages.value, ...validImages]
      }
    }
    reader.readAsDataURL(file)
  }
})

// 监听视频选择
onVideoChange((files) => {
  const file = files?.[0]
  if (!file) return
  
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    showToast('视频大小不能超过100MB')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    previewVideo.value = result
  }
  reader.readAsDataURL(file)
})

// 监听文件选择
onFilesChange((files) => {
  if (!files) return
  
  const maxSize = 20 * 1024 * 1024 // 20MB
  const validFiles: File[] = []
  
  for (let i = 0; i < files.length && previewFiles.value.length + validFiles.length < 5; i++) {
    const file = files[i]
    if (file.size > maxSize) {
      showToast(`文件 ${file.name} 大小不能超过20MB`)
      continue
    }
    validFiles.push(file)
  }
  
  if (validFiles.length > 0) {
    previewFiles.value = [...previewFiles.value, ...validFiles]
  }
})

// 重置表单数据
const resetFormData = () => {
  postContent.value = ''
  previewImages.value = []
  previewFiles.value = []
  previewVideo.value = ''
  previewAudio.value = ''
  linkUrl.value = ''
  linkPreview.value = null
  showLinkInput.value = false
  recordingAudio.value = false
}

// 处理取消
const handleCancel = () => {
  showPopup.value = false
}

// 处理提交
const handleSubmit = () => {
  if (!postContent.value.trim() && previewImages.value.length === 0 && previewFiles.value.length === 0 && !previewVideo.value && !previewAudio.value && !linkUrl.value) {
    showToast('请输入内容或添加附件')
    return
  }
  
  if (linkUrl.value && !isValidUrl(linkUrl.value)) {
    showToast('请输入有效的链接地址')
    return
  }
  
  publishing.value = true
  
  // 构建提交数据
  const data: any = {}
  let type = 'text'
  
  if (previewImages.value.length > 0) {
    type = 'image'
    data.images = previewImages.value
  }
  
  if (previewVideo.value) {
    type = 'video'
    data.video = previewVideo.value
  }
  
  if (previewAudio.value) {
    type = 'audio'
    data.audio = previewAudio.value
  }
  
  if (linkUrl.value) {
    type = 'link'
    data.linkUrl = linkUrl.value
    data.linkPreview = linkPreview.value
  }
  
  if (previewFiles.value.length > 0) {
    type = 'file'
    data.files = previewFiles.value
  }
  
  // 模拟提交延迟
  setTimeout(() => {
    emit('submit', postContent.value, type, data)
    publishing.value = false
    showToast('发布成功')
    handleCancel()
  }, 1000)
}

// 选择图片
const selectImages = () => {
  selectImagesDialog()
}

// 选择视频
const selectVideo = () => {
  selectVideoDialog()
}

// 选择文件
const selectFiles = () => {
  selectFilesDialog()
}



// 移除视频
const removeVideo = () => {
  previewVideo.value = ''
}

// 录制音频
const recordAudio = () => {
  if (recordingAudio.value) {
    // 停止录制
    recordingAudio.value = false
    // 这里应该是实际的录音停止逻辑，现在只是模拟
    setTimeout(() => {
      previewAudio.value = 'mock-audio-url.mp3'
      showToast('录音完成')
    }, 1000)
    showToast('正在停止录音...')
  } else {
    // 开始录制
    recordingAudio.value = true
    // 这里应该是实际的录音开始逻辑，现在只是模拟
    showToast('正在录音...')
  }
}

// 移除音频
const removeAudio = () => {
  previewAudio.value = ''
  recordingAudio.value = false
}

// 移除图片
const removeImage = (index: number) => {
  previewImages.value.splice(index, 1)
}

// 移除文件
const removeFile = (index: number) => {
  previewFiles.value.splice(index, 1)
}



// 验证URL
const isValidUrl = (url: string): boolean => {
  try {
    return new URL(url).protocol === 'http:' || new URL(url).protocol === 'https:'
  } catch (_) {
    return false
  }
}
</script>

<style scoped>
.feeds-post-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-large, 12px) var(--radius-large, 12px) 0 0;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color, #ebedf0);
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #323233);
}

.cancel-button {
  min-width: 60px;
}

.popup-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-input {
  margin-bottom: 16px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
}

.add-content-area {
  margin-top: 16px;
  margin-bottom: 16px;
}

.content-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.add-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--bg-page, #f7f8fa);
  border: 1px solid var(--border-color, #ebedf0);
  border-radius: 20px;
  color: var(--text-secondary, #969799);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.add-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.add-item:hover::before {
  left: 100%;
}

.add-item:hover {
  border-color: var(--color-primary, #1989fa);
  color: var(--color-primary, #1989fa);
  background: var(--color-primary-light, #e6f7ff);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.15);
}

.add-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.1);
}

.add-item.active {
  border-color: var(--color-primary, #1989fa);
  color: var(--color-primary, #1989fa);
  background: var(--color-primary-light, #e6f7ff);
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.1);
}

.link-input-area {
  padding: 16px;
  background: var(--bg-page, #f7f8fa);
  border-top: 1px solid var(--border-color, #ebedf0);
  max-height: 80px;
  opacity: 1;
  transform-origin: top;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.link-input-area.collapsing {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

.popup-footer {
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--border-color, #ebedf0);
  background: var(--bg-card, #ffffff);
  transition: all 0.3s ease;
}

.post-type-selector {
  height: 100%;
}

.tab-content {
  padding: 10px 0;
}

.content-input {
  margin-bottom: 16px;
}

.content-tools {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}



.link-input {
  margin-bottom: 16px;
}















/* 主题适配样式 */
.theme-light {
  --bg-page: #f7f8fa;
  --bg-card: #ffffff;
  --bg-gray: #f5f5f5;
  --bg-secondary: #fafafa;
  --text-primary: #323233;
  --text-secondary: #969799;
  --text-light: #999999;
  --color-primary: #1989fa;
  --color-primary-light: #1784e3;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #ebedf0;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

.theme-dark {
  --bg-page: #0a0a0a;
  --bg-card: #1a1a1a;
  --bg-gray: #2a2a2a;
  --bg-secondary: #222222;
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --text-light: #969799;
  --color-primary: #1989fa;
  --color-primary-light: #2988e8;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #3a3a3a;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}
</style>