<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { showToast, showDialog, Loading } from 'vant'

interface Props {
  // 头像URL（支持v-model）
  modelValue?: string
  // 头像URL（兼容旧版本）
  src?: string
  // 头像大小
  size?: number | string
  // 是否显示上传按钮
  uploadable?: boolean
  // 是否显示AI生成按钮
  showAiGenerate?: boolean
  // 是否圆形头像
  round?: boolean
  // 默认头像文本
  text?: string
  // 头像背景色
  background?: string
  // 是否禁用
  disabled?: boolean
  // 是否显示清空按钮
  showClear?: boolean
  // 上传配置
  uploadConfig?: {
    bucket?: any
    key?: string
    metadata?: Record<string, string>
    contentType?: string
    acl?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  size: '40px',
  uploadable: true,
  showAiGenerate: false,
  round: true,
  text: '',
  background: '#f5f5f5',
  disabled: false,
  showClear: false
})

const emit = defineEmits<{
  // v-model更新事件
  'update:modelValue': [value: string]
  // 头像上传事件
  upload: [file: File]
  // 头像上传开始事件
  'upload-start': [file: File]
  // 头像上传进度事件
  'upload-progress': [progress: any]
  // 头像上传完成事件
  'upload-complete': [result: any]
  // 头像上传失败事件
  'upload-error': [error: any]
  // AI生成头像事件
  aiGenerate: []
  // 头像点击事件
  click: []
  // 清空头像事件
  clear: []
}>()

// 当前头像URL（优先使用modelValue，兼容src）
const avatarSrc = computed({
  get: () => props.modelValue || props.src,
  set: (value) => emit('update:modelValue', value || '')
})

// 上传状态
const isUploading = ref(false)
const uploadProgress = ref(0)
const currentUploadTask = ref<string | null>(null)
const uploaderRef = ref<any>(null)

// 处理头像上传
const handleUpload = async (file: any) => {
  // 处理不同的文件输入格式
  let uploadFile: File | null = null
  
  if (file instanceof File) {
    uploadFile = file
  } else if (file && file.file instanceof File) {
    uploadFile = file.file
  } else if (file && file.content && file.content instanceof File) {
    uploadFile = file.content
  } else if (Array.isArray(file) && file.length > 0) {
    // van-uploader返回的可能是数组
    const fileItem = file[0]
    if (fileItem.file instanceof File) {
      uploadFile = fileItem.file
    } else if (fileItem.content instanceof File) {
      uploadFile = fileItem.content
    }
  }

  if (!uploadFile) {
    showToast('无效的文件格式')
    return false
  }

  // 验证文件类型
  if (!uploadFile.type?.startsWith('image/')) {
    showToast('请上传图片文件')
    return false
  }

  // 验证文件大小（最大5MB）
  if (uploadFile.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过5MB')
    return false
  }

  // 预览图片并更新v-model
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Data = e.target?.result as string
    avatarSrc.value = base64Data
  }
  reader.readAsDataURL(uploadFile)

  // 触发上传事件
  emit('upload', uploadFile)
  
  // 使用window.$uploader进行S3上传
  await uploadToS3(uploadFile)
  
  return true
}

// 使用window.$uploader上传到S3
const uploadToS3 = async (file: File) => {
  if (!window.$uploader) {
    showToast('上传器未初始化')
    return
  }

  try {
    isUploading.value = true
    uploadProgress.value = 0
    
    // 触发上传开始事件
    emit('upload-start', file)
    
    // 构建上传参数
    const uploadConfig = props.uploadConfig || {}
    const uploadParam = {
      file: file,
      bucket: uploadConfig.bucket || { name: 'public' },
      name: file.name,
      scene: 'avatar', 
      metadata: uploadConfig.metadata || {},
      contentType: uploadConfig.contentType || file.type,
      acl: uploadConfig.acl || 'public-read'
    }
    
    // 执行上传并获取任务ID
    const result = await window.$uploader.upload(uploadParam, (progress:any) => {
      uploadProgress.value = progress.percentage
      emit('upload-progress', progress)
    })
    
    // 保存任务ID用于取消操作
    if (result.taskId) {
      currentUploadTask.value = result.taskId
    }
    
    // 上传成功，更新头像URL为S3 URL（仅在成功上传后更新）
    // 注意：这里result.url应该是S3服务器的URL，表示文件已成功上传
    if (result.url && result.url.startsWith('http')) {
      avatarSrc.value = result.url
      showToast('头像上传成功')
      
      // 触发上传完成事件
      emit('upload-complete', result)
    } else {
      // 如果URL无效，保持本地预览
      console.warn('上传返回的URL无效，保持本地预览:', result.url)
      showToast('头像上传完成，但URL无效')
    }
    
  } catch (error) {
    console.error('头像上传失败:', error)
    showToast('头像上传失败，请重试')
    
    // 触发上传失败事件
    emit('upload-error', error)
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// 取消上传
const cancelUpload = () => {
  if (isUploading.value && window.$uploader) {
    // 如果有任务ID，使用任务ID取消
    if (currentUploadTask.value) {
      window.$uploader.cancel(currentUploadTask.value)
    } else {
      // 否则取消所有上传任务
      window.$uploader.cancelAll()
    }
    isUploading.value = false
    uploadProgress.value = 0
    currentUploadTask.value = null
    showToast('上传已取消')
    
    // 清空预览的头像
    avatarSrc.value = ''
  }
}

// 处理AI生成
const handleAiGenerate = () => {
  showDialog({
    title: 'AI生成头像',
    message: '确定要使用AI生成头像吗？',
    showCancelButton: true,
    confirmButtonText: '生成',
    cancelButtonText: '取消'
  }).then(() => {
    emit('aiGenerate')
    showToast('正在生成头像...')
  })
}

// 清空头像
const handleClear = () => {
  if (!props.disabled && avatarSrc.value) {
    showDialog({
      title: '清空头像',
      message: '确定要清空当前头像吗？',
      showCancelButton: true,
      confirmButtonText: '清空',
      cancelButtonText: '取消'
    }).then(() => {
      avatarSrc.value = ''
      showToast('头像已清空')
      emit('clear')
    })
  }
}

// 处理头像点击
const handleClick = () => {
  if (!props.disabled && props.uploadable && !isUploading.value) {
    // 延迟触发，避免与van-uploader的点击事件冲突
    setTimeout(() => {
      // 触发van-uploader的文件选择
      if (uploaderRef.value) {
        uploaderRef.value.chooseFile()
      } else {
        // 备用方案：直接触发文件输入
        const uploaderElement = document.querySelector('.upload-btn input[type="file"]') as HTMLInputElement
        if (uploaderElement) {
          uploaderElement.click()
        }
      }
    }, 10)
  }
  
  emit('click')
}

// 计算样式
const avatarStyle = computed(() => ({
  width: typeof props.size === 'number' ? `${props.size}px` : props.size,
  height: typeof props.size === 'number' ? `${props.size}px` : props.size,
  backgroundColor: props.background
}))

// 监听src变化（兼容旧版本）
watch(() => props.src, (newSrc) => {
  if (!props.modelValue) {
    avatarSrc.value = newSrc
  }
})

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  avatarSrc.value = newValue
})
</script>

<template>
  <div class="sdkwork-avatar">
    <!-- 头像显示区域 -->
    <div class="avatar-container" @click="handleClick">
      <!-- 上传进度遮罩 -->
      <div v-if="isUploading" class="upload-overlay">
        <div class="loading-spinner"></div>
        <div class="progress-text">{{ uploadProgress }}%</div>
        <van-button 
           
          type="danger" 
          @click.stop="cancelUpload"
          class="cancel-btn"
        >
          取消
        </van-button>
      </div>
      
      <van-image
        v-if="avatarSrc"
        :src="avatarSrc"
        :width="size"
        :height="size"
        fit="cover"
        :class="{ disabled: disabled, round: round, square: !round, uploading: isUploading }"
        class="avatar-image"
      >
        <!-- 清空按钮 -->
        <template #extra>
          <div v-if="showClear && !isUploading" class="clear-btn" @click.stop="handleClear">
            <van-icon name="cross" size="12" color="#fff" />
          </div>
        </template>
      </van-image>
      <div v-else class="avatar-placeholder" :style="avatarStyle" :class="{ round: round, square: !round, uploading: isUploading }">
        <span class="placeholder-text">{{ text }}</span>
      </div>

      <!-- 操作按钮区域 -->
      <div v-if="(uploadable || showAiGenerate) && !isUploading" class="avatar-actions">
        <!-- 上传按钮 - 使用van-uploader处理文件选择 -->
        <van-uploader
          v-if="uploadable"
          :disabled="disabled"
          :after-read="handleUpload"
          :max-count="1"
          :preview-image="false"
          :show-upload="false"
          accept="image/*"
          class="upload-btn"
          ref="uploaderRef"
          @click.stop
        >
          <van-button 
             
            type="primary" 
            :disabled="disabled"
            class="action-btn"
            @click.stop 
          >
            上传
          </van-button>
        </van-uploader>

        <!-- AI生成按钮 -->
        <van-button
          v-if="showAiGenerate"
          
          type="success"
          :disabled="disabled"
          @click="handleAiGenerate"
          class="action-btn ai-generate-btn"
        >
          AI生成
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sdkwork-avatar {
  display: inline-block;
  position: relative;
}

.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.avatar-image {
  overflow: hidden;
  display: block;
}

.avatar-image.round {
  border-radius: 50% !important;
}

.avatar-image.square {
  border-radius: 4px !important;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f0f0f0;
}

.avatar-placeholder.round {
  border-radius: 50% !important;
}

.avatar-placeholder.square {
  border-radius: 4px !important;
}

.placeholder-text {
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

.avatar-container:hover .avatar-actions {
  opacity: 1;
}

.avatar-actions {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.action-btn {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upload-btn {
  display: inline-block;
}

.ai-generate-btn {
  background: linear-gradient(45deg, #ff6b6b, #ffa726);
  border: none;
}

.avatar-image.disabled,
.avatar-placeholder.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.avatar-container:hover .avatar-image:not(.disabled),
.avatar-container:hover .avatar-placeholder:not(.disabled) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

/* 上传进度遮罩样式 */
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.avatar-image.round + .upload-overlay,
.avatar-placeholder.round + .upload-overlay {
  border-radius: 50% !important;
}

.avatar-image.square + .upload-overlay,
.avatar-placeholder.square + .upload-overlay {
  border-radius: 4px !important;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.progress-text {
  color: white;
  font-size: 12px;
  margin-top: 8px;
  font-weight: 500;
}

.cancel-btn {
  margin-top: 8px;
  font-size: 10px;
  padding: 1px 4px;
}

.avatar-image.uploading,
.avatar-placeholder.uploading {
  opacity: 0.7;
}

/* 清空按钮样式 */
.clear-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 30;
}

.clear-btn:hover {
  background: #ff7875;
  transform: scale(1.1);
}

.clear-btn:active {
  transform: scale(0.95);
}

.avatar-image.disabled .clear-btn,
.avatar-placeholder.disabled .clear-btn {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>