<template>
  <div class="sdkwork-uploader-video">
    <!-- 视频选择区域 -->
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'disabled': disabled, 'has-videos': videoList.length > 0 }"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <div class="upload-content">
        <!-- 视频预览 -->
        <div v-if="videoList.length > 0" class="video-previews">
          <div 
            v-for="(video, index) in displayVideos" 
            :key="video.id"
            class="video-preview"
            :class="{ 'uploading': video.status === 'uploading', 'success': video.status === 'success', 'error': video.status === 'error' }"
          >
            <div class="video-thumbnail">
              <video 
                :src="video.previewUrl" 
                :poster="video.thumbnailUrl"
                class="preview-video"
                @loadedmetadata="handleVideoMetadata(video.id, $event)"
              ></video>
              <div class="video-overlay">
                <!-- 播放按钮 -->
                <button 
                  v-if="video.duration" 
                  type="button" 
                  class="play-btn"
                  @click.stop="playVideo(video)"
                >
                  <Icon icon="material-symbols:play-arrow" width="24" height="24" />
                </button>
                
                <!-- 上传进度 -->
                <div v-if="video.status === 'uploading'" class="upload-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: video.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ video.progress }}%</span>
                </div>
                
                <!-- 状态图标 -->
                <div v-else class="status-icons">
                  <span v-if="video.status === 'success'" class="success-icon">✓</span>
                  <span v-if="video.status === 'error'" class="error-icon">✗</span>
                </div>
                
                <!-- 操作按钮 -->
                <div class="action-buttons">
                  <button 
                    v-if="video.status === 'uploading'" 
                    type="button" 
                    class="cancel-btn"
                    @click.stop="cancelUpload(video.id)"
                  >
                    取消
                  </button>
                  <button 
                    v-else 
                    type="button" 
                    class="remove-btn"
                    @click.stop="removeVideo(video.id)"
                  >
                    移除
                  </button>
                </div>
              </div>
              
              <!-- 视频时长 -->
              <div v-if="video.duration" class="video-duration">
                {{ formatDuration(video.duration) }}
              </div>
            </div>
            
            <!-- 视频信息 -->
            <div class="video-info">
              <div class="video-name">{{ video.name }}</div>
              <div class="video-size">{{ formatFileSize(video.size) }}</div>
              <div v-if="video.dimensions" class="video-dimensions">
                {{ video.dimensions.width }}×{{ video.dimensions.height }}
              </div>
              <div v-if="video.duration" class="video-duration-text">
                时长: {{ formatDuration(video.duration) }}
              </div>
            </div>
          </div>
          
          <!-- 添加更多视频按钮 -->
          <div v-if="canAddMoreVideos" class="add-more-btn" @click="handleClick">
            <div class="add-icon">+</div>
            <div class="add-text">添加视频</div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="upload-icon">
            <Icon icon="material-symbols:video-library" width="48" height="48" />
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
    <div v-if="videoList.length > 0 && !autoUpload" class="upload-actions">
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

    <!-- 视频播放模态框 -->
    <div v-if="playingVideo" class="video-modal" @click="stopVideo">
      <div class="modal-content" @click.stop>
        <video 
          :src="playingVideo.previewUrl" 
          controls 
          autoplay
          class="modal-video"
        ></video>
        <button type="button" class="close-btn" @click="stopVideo">×</button>
      </div>
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
  maxDuration?: number // 最大时长（秒）
  maxWidth?: number
  maxHeight?: number
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
  accept: 'video/*',
  multiple: false,
  disabled: false,
  autoUpload: true,
  maxSize: 500 * 1024 * 1024, // 500MB
  maxCount: 5,
  maxDuration: 600, // 10分钟
  maxWidth: 3840,
  maxHeight: 2160,
  title: '点击或拖拽视频到此处',
  subtitle: '支持 MP4、AVI、MOV、WMV 等格式',
  bucket: undefined,
  scene: 'video',
  metadata: () => ({}),
  contentType: 'video/mp4',
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
  'video-add': [files: File[]]
  'video-remove': [file: File]
  'video-clear': []
  'video-preview': [file: File, previewUrl: string]
  'video-metadata': [file: File, metadata: VideoMetadata]
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const playingVideo = ref<VideoItem | null>(null)

// 视频元数据接口
interface VideoMetadata {
  duration: number
  width: number
  height: number
  videoCodec?: string
  audioCodec?: string
}

// 视频列表数据结构
interface VideoItem {
  id: string
  file: File
  name: string
  size: number
  previewUrl: string
  thumbnailUrl?: string
  duration?: number
  dimensions?: { width: number; height: number }
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  uploadId?: string
}

const videoList = ref<VideoItem[]>([])

// 计算属性
const uploadingCount = computed(() => {
  return videoList.value.filter(video => video.status === 'uploading').length
})

const canAddMoreVideos = computed(() => {
  return videoList.value.length < props.maxCount
})

const displayVideos = computed(() => {
  return videoList.value.slice(0, props.maxCount)
})

// 监听modelValue变化
watch(() => props.modelValue, (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    // 同步外部传入的文件
    const currentFileIds = videoList.value.map(item => generateVideoId(item.file))
    const newFilesToAdd = newFiles.filter(file => !currentFileIds.includes(generateVideoId(file)))
    
    if (newFilesToAdd.length > 0) {
      addVideos(newFilesToAdd)
    }
  }
}, { immediate: true })

// 生成视频ID
const generateVideoId = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

// 创建预览URL
const createPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    resolve(url)
  })
}

// 获取视频元数据
const getVideoMetadata = (file: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    
    video.onloadedmetadata = () => {
      const metadata: VideoMetadata = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      }
      URL.revokeObjectURL(url)
      resolve(metadata)
    }
    
    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('无法获取视频元数据'))
    }
    
    video.src = url
  })
}

// 创建缩略图
const createThumbnail = (file: File, time = 1): Promise<string> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    video.onloadeddata = () => {
      video.currentTime = Math.min(time, video.duration || 1)
    }
    
    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8)
      URL.revokeObjectURL(url)
      resolve(thumbnailUrl)
    }
    
    video.src = url
  })
}

// 创建视频项
const createVideoItem = async (file: File): Promise<VideoItem> => {
  const previewUrl = await createPreviewUrl(file)
  let thumbnailUrl: string | undefined
  let metadata: VideoMetadata | undefined
  
  try {
    metadata = await getVideoMetadata(file)
    thumbnailUrl = await createThumbnail(file)
  } catch (error) {
    console.warn('无法获取视频元数据:', error)
  }
  
  return {
    id: generateVideoId(file),
    file,
    name: file.name,
    size: file.size,
    previewUrl,
    thumbnailUrl,
    duration: metadata?.duration,
    dimensions: metadata ? { width: metadata.width, height: metadata.height } : undefined,
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

// 格式化时长
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}

// 处理点击事件
const handleClick = () => {
  if (!props.disabled && canAddMoreVideos.value) {
    fileInput.value?.click()
  }
}

// 处理文件选择
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    await addVideos(Array.from(input.files))
    input.value = '' // 重置input
  }
}

// 拖拽处理
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled && canAddMoreVideos.value) {
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
  
  if (props.disabled || !canAddMoreVideos.value) return
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    await addVideos(Array.from(files))
  }
}

// 添加视频
const addVideos = async (files: File[]) => {
  if (files.length === 0) return
  
  // 过滤非视频文件
  const videoFiles = files.filter(file => file.type.startsWith('video/'))
  if (videoFiles.length === 0) {
    window.$message?.warning('请选择视频文件')
    return
  }
  
  // 检查数量限制
  const remainingSlots = props.maxCount - videoList.value.length
  const videosToAdd = videoFiles.slice(0, remainingSlots)
  
  if (videosToAdd.length === 0) {
    window.$message?.warning(`最多只能上传 ${props.maxCount} 个视频`)
    return
  }
  
  // 验证文件大小
  const validVideos: File[] = []
  const invalidVideos: File[] = []
  
  for (const file of videosToAdd) {
    if (file.size > props.maxSize) {
      invalidVideos.push(file)
    } else {
      validVideos.push(file)
    }
  }
  
  if (invalidVideos.length > 0) {
    window.$message?.warning(`以下视频文件超过 ${formatFileSize(props.maxSize)} 限制: ${invalidVideos.map(f => f.name).join(', ')}`)
  }
  
  if (validVideos.length === 0) return
  
  // 创建视频项
  const newItems = await Promise.all(validVideos.map(createVideoItem))
  videoList.value = [...videoList.value, ...newItems]
  
  // 更新modelValue
  const currentFiles = videoList.value.map(item => item.file)
  emit('update:modelValue', currentFiles)
  emit('video-add', validVideos)
  
  // 自动上传
  if (props.autoUpload) {
    startUpload()
  }
}

// 移除视频
const removeVideo = (videoId: string) => {
  const videoIndex = videoList.value.findIndex(item => item.id === videoId)
  if (videoIndex !== -1) {
    const videoItem = videoList.value[videoIndex]
    
    // 如果正在上传，先取消上传
    if (videoItem.status === 'uploading' && videoItem.uploadId) {
      window.$uploader?.cancel(videoItem.uploadId)
    }
    
    // 释放预览URL
    URL.revokeObjectURL(videoItem.previewUrl)
    
    videoList.value.splice(videoIndex, 1)
    
    // 更新modelValue
    const currentFiles = videoList.value.map(item => item.file)
    emit('update:modelValue', currentFiles)
    emit('video-remove', videoItem.file)
  }
}

// 清空所有视频
const clearAll = () => {
  // 取消所有正在上传的任务
  videoList.value.forEach(item => {
    if (item.status === 'uploading' && item.uploadId) {
      window.$uploader?.cancel(item.uploadId)
    }
    // 释放预览URL
    URL.revokeObjectURL(item.previewUrl)
  })
  
  videoList.value = []
  emit('update:modelValue', [])
  emit('video-clear')
}

// 取消上传
const cancelUpload = (videoId: string) => {
  const videoItem = videoList.value.find(item => item.id === videoId)
  if (videoItem && videoItem.uploadId) {
    window.$uploader?.cancel(videoItem.uploadId)
    videoItem.status = 'pending'
    videoItem.progress = 0
    videoItem.uploadId = undefined
  }
}

// 开始上传
const startUpload = () => {
  const pendingVideos = videoList.value.filter(item => item.status === 'pending')
  pendingVideos.forEach(uploadVideo)
}

// 上传单个视频
const uploadVideo = async (videoItem: VideoItem) => {
  if (!window.$uploader) {
    console.error('Uploader not available')
    return
  }
  
  videoItem.status = 'uploading'
  emit('upload-start', videoItem.file)
  
  try {
    const uploadParam: UploadRequestParam = {
      file: videoItem.file,
      bucket: props.bucket || { name: 'default-bucket' },
      name: videoItem.name,
      scene: props.scene,
      metadata: props.metadata,
      contentType: props.contentType || 'video/mp4',
      acl: props.acl
    }
    
    const uploadId = await window.$uploader.upload(uploadParam, (progress: UploadProgress) => {
      videoItem.progress = progress.percentage
      emit('upload-progress', videoItem.file, progress.percentage)
    })
    
    videoItem.uploadId = uploadId
    
    const response = await window.$uploader.wait(uploadId)
    videoItem.status = 'success'
    videoItem.progress = 100
    emit('upload-success', videoItem.file, response)
    
    // 检查是否所有视频都上传完成
    const allCompleted = videoList.value.every(item => item.status === 'success' || item.status === 'error')
    if (allCompleted) {
      emit('upload-complete', videoList.value.map(item => item.file))
    }
    
  } catch (error) {
    videoItem.status = 'error'
    emit('upload-error', videoItem.file, error as Error)
    console.error('Upload failed:', error)
  }
}

// 处理视频元数据
const handleVideoMetadata = (videoId: string, event: Event) => {
  const video = event.target as HTMLVideoElement
  const videoItem = videoList.value.find(item => item.id === videoId)
  
  if (videoItem && !videoItem.duration) {
    videoItem.duration = video.duration
    videoItem.dimensions = { width: video.videoWidth, height: video.videoHeight }
    
    const metadata: VideoMetadata = {
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight
    }
    
    emit('video-metadata', videoItem.file, metadata)
  }
}

// 播放视频
const playVideo = (video: VideoItem) => {
  playingVideo.value = video
}

// 停止播放
const stopVideo = () => {
  playingVideo.value = null
}

// 暴露方法给父组件
defineExpose({
  clearVideos: clearAll,
  uploadVideos: startUpload,
  getVideoList: () => {
    return videoList.value.map(item => ({
      file: item.file,
      previewUrl: item.previewUrl,
      thumbnailUrl: item.thumbnailUrl,
      duration: item.duration,
      dimensions: item.dimensions,
      status: item.status === 'success' ? 'uploaded' : undefined
    }))
  },
  removeVideo
})
</script>

<style scoped>
.sdkwork-uploader-video {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  cursor: pointer;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-area.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-area.has-videos {
  padding: 16px;
  text-align: left;
}

.upload-content {
  position: relative;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  color: #9ca3af;
}

.upload-text {
  text-align: center;
}

.upload-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.upload-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
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

.video-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.video-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  transition: all 0.2s ease;
}

.video-preview:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.video-preview.uploading {
  border-color: #3b82f6;
}

.video-preview.success {
  border-color: #10b981;
}

.video-preview.error {
  border-color: #ef4444;
}

.video-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  background-color: #000;
  overflow: hidden;
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-thumbnail:hover .video-overlay {
  opacity: 1;
}

.play-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-btn:hover {
  background-color: white;
  transform: scale(1.05);
}

.upload-progress {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: white;
  font-weight: 600;
}

.status-icons {
  position: absolute;
  top: 8px;
  right: 8px;
}

.success-icon {
  color: #10b981;
  font-weight: bold;
  font-size: 16px;
}

.error-icon {
  color: #ef4444;
  font-weight: bold;
  font-size: 16px;
}

.action-buttons {
  position: absolute;
  top: 8px;
  left: 8px;
}

.cancel-btn,
.remove-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover,
.remove-btn:hover {
  background-color: white;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 12px;
}

.video-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-size,
.video-dimensions,
.video-duration-text {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.add-more-btn {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  height: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9fafb;
}

.add-more-btn:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.add-icon {
  font-size: 32px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.add-text {
  font-size: 14px;
  color: #6b7280;
}

.upload-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.upload-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn.primary {
  background-color: #3b82f6;
  color: white;
}

.upload-btn.primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.upload-btn.primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.upload-btn.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.upload-btn.secondary:hover {
  background-color: #e5e7eb;
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-video {
  width: 100%;
  height: auto;
  max-height: 80vh;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>