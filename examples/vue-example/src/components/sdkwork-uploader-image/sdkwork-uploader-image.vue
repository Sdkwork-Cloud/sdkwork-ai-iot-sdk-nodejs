<template>
  <div class="sdkwork-uploader-image">
    <!-- 图片选择区域 -->
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'disabled': disabled, 'has-images': imageList.length > 0 }"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <div class="upload-content">
        <!-- 图片预览 -->
        <div v-if="imageList.length > 0" class="image-previews">
          <div 
            v-for="(image, index) in displayImages" 
            :key="image.id"
            class="image-preview"
            :class="{ 'uploading': image.status === 'uploading', 'success': image.status === 'success', 'error': image.status === 'error' }"
          >
            <img :src="image.previewUrl" :alt="image.name" class="preview-img" />
            <div class="image-overlay">
              <!-- 上传进度 -->
              <div v-if="image.status === 'uploading'" class="upload-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: image.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ image.progress }}%</span>
              </div>
              
              <!-- 状态图标 -->
              <div v-else class="status-icons">
                <span v-if="image.status === 'success'" class="success-icon">✓</span>
                <span v-if="image.status === 'error'" class="error-icon">✗</span>
              </div>
              
              <!-- 操作按钮 -->
              <div class="action-buttons">
                <button 
                  v-if="image.status === 'uploading'" 
                  type="button" 
                  class="cancel-btn"
                  @click.stop="cancelUpload(image.id)"
                >
                  取消
                </button>
                <button 
                  v-else 
                  type="button" 
                  class="remove-btn"
                  @click.stop="removeImage(image.id)"
                >
                  移除
                </button>
              </div>
            </div>
            
            <!-- 文件信息 -->
            <div class="image-info">
              <div class="image-name">{{ image.name }}</div>
              <div class="image-size">{{ formatFileSize(image.size) }}</div>
              <div v-if="image.dimensions" class="image-dimensions">
                {{ image.dimensions.width }}×{{ image.dimensions.height }}
              </div>
            </div>
          </div>
          
          <!-- 添加更多图片按钮 -->
          <div v-if="canAddMoreImages" class="add-more-btn" @click="handleClick">
            <div class="add-icon">+</div>
            <div class="add-text">添加图片</div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="upload-icon">
            <Icon icon="material-symbols:image" width="48" height="48" />
          </div>
          <div class="upload-text">
            <p class="upload-title">{{ title }}</p>
            <p class="upload-subtitle">{{ subtitle }}</p>
          </div>
        </div>
        
        <!-- 使用 window.$files API 替代原生 input -->
      </div>
    </div>

    <!-- 上传按钮 -->
    <div v-if="imageList.length > 0 && !autoUpload" class="upload-actions">
      <button 
        type="button" 
        class="upload-btn primary"
        :disabled="uploadingCount > 0"
        @click="startUpload"
      >
        {{ uploadingCount > 0 ? `上传中... (${uploadingCount})` : '开始上传' }}
      </button>
      <button 
        type="button" 
        class="upload-btn secondary"
        @click="clearAll"
      >
        取消
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import type { UploadRequestParam, UploadResponse, UploadProgress } from '@/core/upload/types'

// Props定义
interface Props {
  modelValue?: File[]
  accept?: string
  multiple?: boolean
  disabled?: boolean
  autoUpload?: boolean
  maxSize?: number
  maxCount?: number
  maxWidth?: number
  maxHeight?: number
  quality?: number
  title?: string
  subtitle?: string
  bucket?: any
  scene?: string
  metadata?: Record<string, string>
  contentType?: string
  acl?: 'private' | 'public-read' | 'public-read-write'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: 'image/*',
  multiple: false,
  disabled: false,
  autoUpload: true,
  maxSize: 10 * 1024 * 1024, // 10MB
  maxCount: 10,
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  title: '点击或拖拽图片到此处',
  subtitle: '支持 JPG、PNG、GIF、WEBP 等格式',
  bucket: undefined,
  scene: 'image',
  metadata: () => ({}),
  contentType: 'image/jpeg',
  acl: 'private'
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [files: File[]]
  'upload-start': [file: File]
  'upload-progress': [file: File, progress: number]
  'upload-success': [file: File, response: UploadResponse]
  'upload-error': [file: File, error: Error]
  'upload-complete': [files: File[]]
  'image-add': [files: File[]]
  'image-remove': [file: File]
  'image-clear': []
  'image-preview': [file: File, previewUrl: string]
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)

// 图片列表数据结构
interface ImageItem {
  id: string
  file: File
  name: string
  size: number
  previewUrl: string
  dimensions?: { width: number; height: number }
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  uploadId?: string
}

const imageList = ref<ImageItem[]>([])

// 计算属性
const uploadingCount = computed(() => {
  return imageList.value.filter(item => item.status === 'uploading').length
})

const canAddMoreImages = computed(() => {
  return props.maxCount === 0 || imageList.value.length < props.maxCount
})

const displayImages = computed(() => {
  return props.multiple ? imageList.value : imageList.value.slice(0, 1)
})

// 监听modelValue变化
watch(() => props.modelValue, async (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    const currentImageIds = imageList.value.map(item => item.id)
    const newItems = await Promise.all(
      newFiles
        .filter(file => !currentImageIds.includes(generateImageId(file)))
        .map(file => createImageItem(file))
    )
    
    imageList.value = [...imageList.value, ...newItems]
    
    if (props.autoUpload) {
      nextTick(() => {
        startUpload()
      })
    }
  }
}, { immediate: true })

// 生成图片ID
const generateImageId = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

// 创建预览URL
const createPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    resolve(url)
  })
}

// 获取图片尺寸
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(url)
    }
    
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  })
}

// 创建图片项
const createImageItem = async (file: File): Promise<ImageItem> => {
  const previewUrl = await createPreviewUrl(file)
  const dimensions = await getImageDimensions(file)
  
  return {
    id: generateImageId(file),
    file,
    name: file.name,
    size: file.size,
    previewUrl,
    dimensions,
    status: 'pending',
    progress: 0
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理点击事件
const handleClick = async () => {
  if (!props.disabled && canAddMoreImages.value) {
    try {
      const result = await window.$files.chooseImage({
        count: props.multiple ? props.maxCount : 1,
        success: (res) => {
          console.log('图片选择成功:', res)
        },
        fail: (error) => {
          console.error('图片选择失败:', error)
        },
        complete: () => {
          console.log('图片选择完成')
        }
      })
      
      if (result.tempFiles && result.tempFiles.length > 0) {
        await addImages(result.tempFiles)
      }
    } catch (error) {
      console.error('图片选择异常:', error)
    }
  }
}

// 处理文件选择（保留用于拖拽上传）
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    await addImages(Array.from(input.files))
    input.value = ''
  }
}

// 处理拖拽事件
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled && canAddMoreImages.value) {
    isDragOver.value = true
  }
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (!props.disabled && canAddMoreImages.value && event.dataTransfer?.files) {
    await addImages(Array.from(event.dataTransfer.files))
  }
}

// 添加图片
const addImages = async (files: File[]) => {
  if (files.length === 0) return
  
  // 过滤非图片文件
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  if (imageFiles.length === 0) {
    window.$message?.warning('请选择图片文件')
    return
  }
  
  const remainingSlots = props.maxCount === 0 ? Infinity : props.maxCount - imageList.value.length
  const imagesToAdd = imageFiles.slice(0, remainingSlots)
  
  if (imagesToAdd.length === 0) {
    window.$message?.warning(`最多只能上传 ${props.maxCount} 张图片`)
    return
  }
  
  // 验证文件大小
  const validImages: File[] = []
  const invalidImages: File[] = []
  
  for (const file of imagesToAdd) {
    if (file.size > props.maxSize) {
      invalidImages.push(file)
    } else {
      validImages.push(file)
    }
  }
  
  if (invalidImages.length > 0) {
    window.$message?.error(`以下图片超过最大限制 ${formatFileSize(props.maxSize)}: ${invalidImages.map(f => f.name).join(', ')}`)
  }
  
  if (validImages.length === 0) return
  
  // 添加有效图片
  const newItems = await Promise.all(validImages.map(file => createImageItem(file)))
  imageList.value = [...imageList.value, ...newItems]
  
  // 更新modelValue
  const currentFiles = imageList.value.map(item => item.file)
  emit('update:modelValue', currentFiles)
  emit('image-add', validImages)
  
  // 触发预览事件
  newItems.forEach(item => {
    emit('image-preview', item.file, item.previewUrl)
  })
  
  // 自动上传
  if (props.autoUpload) {
    startUpload()
  }
}

// 移除图片
const removeImage = (imageId: string) => {
  const imageIndex = imageList.value.findIndex(item => item.id === imageId)
  if (imageIndex !== -1) {
    const imageItem = imageList.value[imageIndex]
    
    // 如果正在上传，先取消上传
    if (imageItem.status === 'uploading' && imageItem.uploadId) {
      window.$uploader?.cancel(imageItem.uploadId)
    }
    
    // 释放预览URL
    URL.revokeObjectURL(imageItem.previewUrl)
    
    imageList.value.splice(imageIndex, 1)
    
    // 更新modelValue
    const currentFiles = imageList.value.map(item => item.file)
    emit('update:modelValue', currentFiles)
    emit('image-remove', imageItem.file)
  }
}

// 清空所有图片
const clearAll = () => {
  // 取消所有正在上传的任务
  imageList.value.forEach(item => {
    if (item.status === 'uploading' && item.uploadId) {
      window.$uploader?.cancel(item.uploadId)
    }
    // 释放预览URL
    URL.revokeObjectURL(item.previewUrl)
  })
  
  imageList.value = []
  emit('update:modelValue', [])
  emit('image-clear')
}

// 取消上传
const cancelUpload = (imageId: string) => {
  const imageItem = imageList.value.find(item => item.id === imageId)
  if (imageItem && imageItem.uploadId) {
    window.$uploader?.cancel(imageItem.uploadId)
    imageItem.status = 'pending'
    imageItem.progress = 0
    imageItem.uploadId = undefined
  }
}

// 开始上传
const startUpload = async () => {
  const pendingImages = imageList.value.filter(item => item.status === 'pending')
  
  if (pendingImages.length === 0) return
  
  for (const imageItem of pendingImages) {
    await uploadImage(imageItem)
  }
  
  // 所有图片上传完成
  emit('upload-complete', imageList.value.map(item => item.file))
}

// 上传单个图片
const uploadImage = async (imageItem: ImageItem) => {
  if (!window.$uploader) {
    console.error('Uploader not available')
    return
  }
  
  imageItem.status = 'uploading'
  imageItem.progress = 0
  
  emit('upload-start', imageItem.file)
  
  try {
    const uploadParam: UploadRequestParam = {
      file: imageItem.file,
      bucket: props.bucket || { name: 'default-bucket' },
      name: imageItem.name,
      scene: props.scene,
      metadata: props.metadata,
      contentType: props.contentType || 'image/jpeg',
      acl: props.acl
    }
    
    const response = await window.$uploader.upload(uploadParam, (progress: UploadProgress) => {
      imageItem.progress = progress.percentage
      emit('upload-progress', imageItem.file, progress.percentage)
    })
    
    imageItem.status = 'success'
    imageItem.progress = 100
    emit('upload-success', imageItem.file, response)
    
  } catch (error) {
    imageItem.status = 'error'
    emit('upload-error', imageItem.file, error as Error)
    console.error('Upload failed:', error)
  }
}

// 暴露方法给父组件
const clearImages = () => {
  clearAll()
}

const uploadImages = () => {
  startUpload()
}

const getImageList = () => {
  return imageList.value.map(item => ({
    file: item.file,
    previewUrl: item.previewUrl,
    dimensions: item.dimensions,
    status: item.status,
    progress: item.progress,
    response: item.status === 'success' ? 'uploaded' : undefined
  }))
}

// 暴露方法
defineExpose({
  clearImages,
  uploadImages,
  getImageList
})
</script>

<style scoped>
.sdkwork-uploader-image {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  min-height: 200px;
}

.upload-area:hover {
  border-color: #3b82f6;
  background-color: #f0f9ff;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #dbeafe;
}

.upload-area.disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #f3f4f6;
}

.upload-area.disabled:hover {
  border-color: #d1d5db;
  background-color: #f3f4f6;
}

.upload-area.has-images {
  padding: 16px;
  min-height: auto;
}

.upload-content {
  position: relative;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.upload-icon {
  color: #6b7280;
  margin-bottom: 12px;
}

.upload-area:hover .upload-icon {
  color: #3b82f6;
}

.upload-text {
  color: #6b7280;
}

.upload-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.upload-subtitle {
  font-size: 14px;
  margin: 0;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.image-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-preview.uploading {
  border-left: 4px solid #3b82f6;
}

.image-preview.success {
  border-left: 4px solid #10b981;
}

.image-preview.error {
  border-left: 4px solid #ef4444;
}

.preview-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 500;
}

.status-icons {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.success-icon {
  color: #10b981;
}

.error-icon {
  color: #ef4444;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.cancel-btn,
.remove-btn {
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-color: #ef4444;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.7);
}

.image-info {
  padding: 8px;
  background: white;
}

.image-name {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.image-size,
.image-dimensions {
  font-size: 11px;
  color: #6b7280;
}

.add-more-btn {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9fafb;
}

.add-more-btn:hover {
  border-color: #3b82f6;
  background-color: #f0f9ff;
}

.add-icon {
  font-size: 24px;
  color: #6b7280;
  margin-bottom: 8px;
}

.add-text {
  font-size: 12px;
  color: #6b7280;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-input:disabled {
  cursor: not-allowed;
}

.upload-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
}

.upload-btn {
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.upload-btn.primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.upload-btn.primary:hover:not(:disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.upload-btn.primary:disabled {
  background-color: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.upload-btn.secondary {
  background-color: white;
  border-color: #d1d5db;
  color: #374151;
}

.upload-btn.secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}
</style>