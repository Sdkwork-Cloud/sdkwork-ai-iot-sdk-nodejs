<template>
  <div class="sdkwork-uploader-file">
    <!-- 文件选择区域 -->
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'disabled': disabled }"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <Icon icon="material-symbols:cloud-upload" width="48" height="48" />
        </div>
        <div class="upload-text">
          <p class="upload-title">{{ title }}</p>
          <p class="upload-subtitle">{{ subtitle }}</p>
        </div>
        <!-- 使用 window.$files API 替代原生 input -->
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="fileList.length > 0" class="file-list">
      <div class="file-list-header">
        <span>已选择文件 ({{ fileList.length }})</span>
        <button 
          v-if="fileList.length > 1" 
          type="button" 
          class="clear-all-btn"
          @click="clearAll"
        >
          清空全部
        </button>
      </div>
      
      <div class="file-items">
        <div 
          v-for="file in fileList" 
          :key="file.id"
          class="file-item"
          :class="{ 'uploading': file.status === 'uploading', 'success': file.status === 'success', 'error': file.status === 'error' }"
        >
          <div class="file-info">
            <div class="file-icon">
              <Icon icon="material-symbols:description" width="24" height="24" />
            </div>
            <div class="file-details">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
          </div>
          
          <div class="file-actions">
            <!-- 上传进度 -->
            <div v-if="file.status === 'uploading'" class="upload-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: file.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ file.progress }}%</span>
            </div>
            
            <!-- 状态图标 -->
            <div v-else class="status-icons">
              <span v-if="file.status === 'success'" class="success-icon">✓</span>
              <span v-if="file.status === 'error'" class="error-icon">✗</span>
            </div>
            
            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button 
                v-if="file.status === 'uploading'" 
                type="button" 
                class="cancel-btn"
                @click="cancelUpload(file.id)"
              >
                取消
              </button>
              <button 
                v-else 
                type="button" 
                class="remove-btn"
                @click="removeFile(file.id)"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传按钮 -->
    <div v-if="fileList.length > 0 && !autoUpload" class="upload-actions">
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
  accept: '*/*',
  multiple: false,
  disabled: false,
  autoUpload: true,
  maxSize: 100 * 1024 * 1024, // 100MB
  maxCount: 10,
  title: '点击或拖拽文件到此处',
  subtitle: '支持所有文件类型',
  bucket: undefined,
  scene: 'default',
  metadata: () => ({}),
  contentType: 'application/octet-stream',
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
  'file-add': [files: File[]]
  'file-remove': [file: File]
  'file-clear': []
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)

// 文件列表数据结构
interface FileItem {
  id: string
  file: File
  name: string
  size: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  uploadId?: string
}

const fileList = ref<FileItem[]>([])

// 计算属性
const uploadingCount = computed(() => {
  return fileList.value.filter(item => item.status === 'uploading').length
})

const canAddMoreFiles = computed(() => {
  return props.maxCount === 0 || fileList.value.length < props.maxCount
})

// 监听modelValue变化
watch(() => props.modelValue, (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    // 同步外部传入的文件
    const currentFileIds = fileList.value.map(item => item.id)
    const newItems = newFiles
      .filter(file => !currentFileIds.includes(generateFileId(file)))
      .map(file => createFileItem(file))
    
    fileList.value = [...fileList.value, ...newItems]
    
    // 自动上传
    if (props.autoUpload) {
      nextTick(() => {
        startUpload()
      })
    }
  }
}, { immediate: true })

// 生成文件ID
const generateFileId = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

// 创建文件项
const createFileItem = (file: File): FileItem => {
  return {
    id: generateFileId(file),
    file,
    name: file.name,
    size: file.size,
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
  if (!props.disabled && canAddMoreFiles.value) {
    try {
      const result = await window.$files.chooseFile({
        count: props.multiple ? props.maxCount : 1,
        success: (res) => {
          console.log('文件选择成功:', res)
        },
        fail: (error) => {
          console.error('文件选择失败:', error)
        },
        complete: () => {
          console.log('文件选择完成')
        }
      })
      
      if (result.tempFiles && result.tempFiles.length > 0) {
        addFiles(result.tempFiles)
      }
    } catch (error) {
      console.error('文件选择异常:', error)
    }
  }
}

// 处理文件选择（保留用于拖拽上传）
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    addFiles(Array.from(input.files))
    input.value = '' // 重置input
  }
}

// 处理拖拽事件
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled && canAddMoreFiles.value) {
    isDragOver.value = true
  }
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (!props.disabled && canAddMoreFiles.value && event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

// 添加文件
const addFiles = (files: File[]) => {
  if (files.length === 0) return
  
  // 检查文件数量限制
  const remainingSlots = props.maxCount === 0 ? Infinity : props.maxCount - fileList.value.length
  const filesToAdd = files.slice(0, remainingSlots)
  
  if (filesToAdd.length === 0) {
    window.$message?.warning(`最多只能上传 ${props.maxCount} 个文件`)
    return
  }
  
  // 验证文件大小
  const validFiles: File[] = []
  const invalidFiles: File[] = []
  
  filesToAdd.forEach(file => {
    if (file.size > props.maxSize) {
      invalidFiles.push(file)
    } else {
      validFiles.push(file)
    }
  })
  
  if (invalidFiles.length > 0) {
    window.$message?.error(`以下文件超过最大限制 ${formatFileSize(props.maxSize)}: ${invalidFiles.map(f => f.name).join(', ')}`)
  }
  
  if (validFiles.length === 0) return
  
  // 添加有效文件
  const newItems = validFiles.map(file => createFileItem(file))
  fileList.value = [...fileList.value, ...newItems]
  
  // 更新modelValue
  const currentFiles = fileList.value.map(item => item.file)
  emit('update:modelValue', currentFiles)
  emit('file-add', validFiles)
  
  // 自动上传
  if (props.autoUpload) {
    startUpload()
  }
}

// 移除文件
const removeFile = (fileId: string) => {
  const fileIndex = fileList.value.findIndex(item => item.id === fileId)
  if (fileIndex !== -1) {
    const fileItem = fileList.value[fileIndex]
    
    // 如果正在上传，先取消上传
    if (fileItem.status === 'uploading' && fileItem.uploadId) {
      window.$uploader?.cancel(fileItem.uploadId)
    }
    
    fileList.value.splice(fileIndex, 1)
    
    // 更新modelValue
    const currentFiles = fileList.value.map(item => item.file)
    emit('update:modelValue', currentFiles)
    emit('file-remove', fileItem.file)
  }
}

// 清空所有文件
const clearAll = () => {
  // 取消所有正在上传的任务
  fileList.value.forEach(item => {
    if (item.status === 'uploading' && item.uploadId) {
      window.$uploader?.cancel(item.uploadId)
    }
  })
  
  fileList.value = []
  emit('update:modelValue', [])
  emit('file-clear')
}

// 取消上传
const cancelUpload = (fileId: string) => {
  const fileItem = fileList.value.find(item => item.id === fileId)
  if (fileItem && fileItem.uploadId) {
    window.$uploader?.cancel(fileItem.uploadId)
    fileItem.status = 'pending'
    fileItem.progress = 0
    fileItem.uploadId = undefined
  }
}

// 开始上传
const startUpload = async () => {
  const pendingFiles = fileList.value.filter(item => item.status === 'pending')
  
  if (pendingFiles.length === 0) return
  
  for (const fileItem of pendingFiles) {
    await uploadFile(fileItem)
  }
  
  // 所有文件上传完成
  emit('upload-complete', fileList.value.map(item => item.file))
}

// 上传单个文件
const uploadFile = async (fileItem: FileItem) => {
  if (!window.$uploader) {
    console.error('Uploader not available')
    return
  }
  
  fileItem.status = 'uploading'
  fileItem.progress = 0
  
  emit('upload-start', fileItem.file)
  
  try {
    const uploadParam: UploadRequestParam = {
      file: fileItem.file,
      bucket: props.bucket || { name: 'default-bucket' },
      name: fileItem.name,
      scene: props.scene,
      metadata: props.metadata,
      contentType: props.contentType,
      acl: props.acl
    }
    
    const response = await window.$uploader.upload(uploadParam, (progress: UploadProgress) => {
      fileItem.progress = progress.percentage
      emit('upload-progress', fileItem.file, progress.percentage)
    })
    
    fileItem.status = 'success'
    fileItem.progress = 100
    emit('upload-success', fileItem.file, response)
    
  } catch (error) {
    fileItem.status = 'error'
    emit('upload-error', fileItem.file, error as Error)
    console.error('Upload failed:', error)
  }
}

// 暴露方法给父组件
const clearFiles = () => {
  clearAll()
}

const uploadFiles = () => {
  startUpload()
}

const getFileList = () => {
  return fileList.value.map(item => ({
    file: item.file,
    status: item.status,
    progress: item.progress,
    response: item.status === 'success' ? 'uploaded' : undefined
  }))
}

// 暴露方法
defineExpose({
  clearFiles,
  uploadFiles,
  getFileList
})
</script>

<style scoped>
.sdkwork-uploader-file {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9fafb;
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

.upload-content {
  position: relative;
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

.file-list {
  margin-top: 16px;
}

.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.clear-all-btn {
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
}

.clear-all-btn:hover {
  background-color: #fef2f2;
}

.file-items {
  space-y: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  background-color: white;
  transition: all 0.2s ease;
}

.file-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-item.uploading {
  border-left: 4px solid #3b82f6;
}

.file-item.success {
  border-left: 4px solid #10b981;
}

.file-item.error {
  border-left: 4px solid #ef4444;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.file-icon {
  color: #6b7280;
  margin-right: 12px;
}

.file-details {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background-color: #e5e7eb;
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
  color: #6b7280;
  min-width: 30px;
}

.status-icons {
  display: flex;
  align-items: center;
}

.success-icon {
  color: #10b981;
  font-weight: bold;
}

.error-icon {
  color: #ef4444;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.cancel-btn,
.remove-btn {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.remove-btn:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
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