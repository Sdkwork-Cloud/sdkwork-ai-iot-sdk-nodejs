<template>
  <div class="sdkwork-uploader-audio">
    <!-- 音频选择区域 -->
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'disabled': disabled, 'has-audios': audioList.length > 0 }"
      @click="handleClick"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <div class="upload-content">
        <!-- 音频列表 -->
        <div v-if="audioList.length > 0" class="audio-list">
          <div 
            v-for="(audio, index) in displayAudios" 
            :key="audio.id"
            class="audio-item"
            :class="{ 'uploading': audio.status === 'uploading', 'success': audio.status === 'success', 'error': audio.status === 'error', 'playing': audio.id === playingAudioId }"
          >
            <!-- 音频播放器 -->
            <div class="audio-player">
              <!-- 播放控制 -->
              <button 
                type="button" 
                class="play-control"
                @click="togglePlay(audio)"
                :disabled="audio.status !== 'success'"
              >
                <Icon v-if="audio.id === playingAudioId" icon="material-symbols:pause" width="20" height="20" />
                <Icon v-else icon="material-symbols:play-arrow" width="20" height="20" />
              </button>
              
              <!-- 音频信息 -->
              <div class="audio-info">
                <div class="audio-name">{{ audio.name }}</div>
                <div class="audio-details">
                  <span class="audio-size">{{ formatFileSize(audio.size) }}</span>
                  <span v-if="audio.duration" class="audio-duration">{{ formatDuration(audio.duration) }}</span>
                  <span class="audio-format">{{ getAudioFormat(audio.file) }}</span>
                </div>
                
                <!-- 音频波形（简化版） -->
                <div v-if="audio.id === playingAudioId" class="audio-waveform">
                  <div 
                    v-for="i in 20" 
                    :key="i" 
                    class="wave-bar"
                    :style="{ height: getRandomWaveHeight() + 'px' }"
                  ></div>
                </div>
                
                <!-- 上传进度 -->
                <div v-if="audio.status === 'uploading'" class="upload-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: audio.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ audio.progress }}%</span>
                </div>
              </div>
              
              <!-- 状态和操作 -->
              <div class="audio-actions">
                <!-- 状态图标 -->
                <div class="status-icons">
                  <span v-if="audio.status === 'success'" class="success-icon">✓</span>
                  <span v-if="audio.status === 'error'" class="error-icon">✗</span>
                </div>
                
                <!-- 操作按钮 -->
                <div class="action-buttons">
                  <button 
                    v-if="audio.status === 'uploading'" 
                    type="button" 
                    class="cancel-btn"
                    @click="cancelUpload(audio.id)"
                  >
                    取消
                  </button>
                  <button 
                    v-else 
                    type="button" 
                    class="remove-btn"
                    @click="removeAudio(audio.id)"
                  >
                    移除
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 添加更多音频按钮 -->
          <div v-if="canAddMoreAudios" class="add-more-btn" @click="handleClick">
            <div class="add-icon">+</div>
            <div class="add-text">添加音频</div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="upload-icon">
            <Icon icon="material-symbols:audio-file" width="48" height="48" />
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
    <div v-if="audioList.length > 0 && !autoUpload" class="upload-actions">
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

    <!-- 音频播放器 -->
    <audio 
      ref="audioPlayer"
      @timeupdate="handleTimeUpdate"
      @ended="handleAudioEnded"
    ></audio>
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
  accept: 'audio/*',
  multiple: false,
  disabled: false,
  autoUpload: true,
  maxSize: 50 * 1024 * 1024, // 50MB
  maxCount: 10,
  maxDuration: 600, // 10分钟
  title: '点击或拖拽音频到此处',
  subtitle: '支持 MP3、WAV、OGG、AAC 等格式',
  bucket: undefined,
  scene: 'audio',
  metadata: () => ({}),
  contentType: 'audio/mpeg',
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
  'audio-add': [files: File[]]
  'audio-remove': [file: File]
  'audio-clear': []
  'audio-play': [file: File]
  'audio-pause': [file: File]
  'audio-ended': [file: File]
  'audio-metadata': [file: File, metadata: AudioMetadata]
}>()

// Refs
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const audioPlayer = ref<HTMLAudioElement>()
const playingAudioId = ref<string>('')

// 音频元数据接口
interface AudioMetadata {
  duration: number
  sampleRate?: number
  channels?: number
  bitrate?: number
}

// 音频列表数据结构
interface AudioItem {
  id: string
  file: File
  name: string
  size: number
  previewUrl: string
  duration?: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  uploadId?: string
}

const audioList = ref<AudioItem[]>([])

// 计算属性
const uploadingCount = computed(() => {
  return audioList.value.filter(audio => audio.status === 'uploading').length
})

const canAddMoreAudios = computed(() => {
  return audioList.value.length < props.maxCount
})

const displayAudios = computed(() => {
  return audioList.value.slice(0, props.maxCount)
})

// 监听modelValue变化
watch(() => props.modelValue, (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    // 同步外部传入的文件
    const currentFileIds = audioList.value.map(item => generateAudioId(item.file))
    const newFilesToAdd = newFiles.filter(file => !currentFileIds.includes(generateAudioId(file)))
    
    if (newFilesToAdd.length > 0) {
      addAudios(newFilesToAdd)
    }
  }
}, { immediate: true })

// 生成音频ID
const generateAudioId = (file: File): string => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

// 创建预览URL
const createPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    resolve(url)
  })
}

// 获取音频元数据
const getAudioMetadata = (file: File): Promise<AudioMetadata> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const audio = new Audio()
    
    audio.onloadedmetadata = () => {
      const metadata: AudioMetadata = {
        duration: audio.duration
      }
      URL.revokeObjectURL(url)
      resolve(metadata)
    }
    
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('无法获取音频元数据'))
    }
    
    audio.src = url
  })
}

// 获取音频格式
const getAudioFormat = (file: File): string => {
  const extension = file.name.split('.').pop()?.toUpperCase() || ''
  const typeMap: Record<string, string> = {
    'mp3': 'MP3',
    'wav': 'WAV',
    'ogg': 'OGG',
    'aac': 'AAC',
    'flac': 'FLAC',
    'm4a': 'M4A',
    'wma': 'WMA'
  }
  
  return typeMap[extension.toLowerCase()] || extension
}

// 创建音频项
const createAudioItem = async (file: File): Promise<AudioItem> => {
  const previewUrl = await createPreviewUrl(file)
  let duration: number | undefined
  
  try {
    const metadata = await getAudioMetadata(file)
    duration = metadata.duration
  } catch (error) {
    console.warn('无法获取音频元数据:', error)
  }
  
  return {
    id: generateAudioId(file),
    file,
    name: file.name,
    size: file.size,
    previewUrl,
    duration,
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
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 获取随机波形高度（简化版）
const getRandomWaveHeight = (): number => {
  return Math.random() * 12 + 4
}

// 处理点击事件
const handleClick = () => {
  if (!props.disabled && canAddMoreAudios.value) {
    fileInput.value?.click()
  }
}

// 处理文件选择
const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    await addAudios(Array.from(input.files))
    input.value = '' // 重置input
  }
}

// 拖拽处理
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!props.disabled && canAddMoreAudios.value) {
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
  
  if (props.disabled || !canAddMoreAudios.value) return
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    await addAudios(Array.from(files))
  }
}

// 添加音频
const addAudios = async (files: File[]) => {
  if (files.length === 0) return
  
  // 过滤非音频文件
  const audioFiles = files.filter(file => file.type.startsWith('audio/'))
  if (audioFiles.length === 0) {
    window.$message?.warning('请选择音频文件')
    return
  }
  
  // 检查数量限制
  const remainingSlots = props.maxCount - audioList.value.length
  const audiosToAdd = audioFiles.slice(0, remainingSlots)
  
  if (audiosToAdd.length === 0) {
    window.$message?.warning(`最多只能上传 ${props.maxCount} 个音频`)
    return
  }
  
  // 验证文件大小
  const validAudios: File[] = []
  const invalidAudios: File[] = []
  
  for (const file of audiosToAdd) {
    if (file.size > props.maxSize) {
      invalidAudios.push(file)
    } else {
      validAudios.push(file)
    }
  }
  
  if (invalidAudios.length > 0) {
    window.$message?.warning(`以下音频文件超过 ${formatFileSize(props.maxSize)} 限制: ${invalidAudios.map(f => f.name).join(', ')}`)
  }
  
  if (validAudios.length === 0) return
  
  // 创建音频项
  const newItems = await Promise.all(validAudios.map(createAudioItem))
  audioList.value = [...audioList.value, ...newItems]
  
  // 更新modelValue
  const currentFiles = audioList.value.map(item => item.file)
  emit('update:modelValue', currentFiles)
  emit('audio-add', validAudios)
  
  // 自动上传
  if (props.autoUpload) {
    startUpload()
  }
}

// 移除音频
const removeAudio = (audioId: string) => {
  const audioIndex = audioList.value.findIndex(item => item.id === audioId)
  if (audioIndex !== -1) {
    const audioItem = audioList.value[audioIndex]
    
    // 如果正在播放，先停止播放
    if (audioItem.id === playingAudioId.value) {
      stopAudio()
    }
    
    // 如果正在上传，先取消上传
    if (audioItem.status === 'uploading' && audioItem.uploadId) {
      window.$uploader?.cancel(audioItem.uploadId)
    }
    
    // 释放预览URL
    URL.revokeObjectURL(audioItem.previewUrl)
    
    audioList.value.splice(audioIndex, 1)
    
    // 更新modelValue
    const currentFiles = audioList.value.map(item => item.file)
    emit('update:modelValue', currentFiles)
    emit('audio-remove', audioItem.file)
  }
}

// 清空所有音频
const clearAll = () => {
  // 停止当前播放
  stopAudio()
  
  // 取消所有正在上传的任务
  audioList.value.forEach(item => {
    if (item.status === 'uploading' && item.uploadId) {
      window.$uploader?.cancel(item.uploadId)
    }
    // 释放预览URL
    URL.revokeObjectURL(item.previewUrl)
  })
  
  audioList.value = []
  emit('update:modelValue', [])
  emit('audio-clear')
}

// 取消上传
const cancelUpload = (audioId: string) => {
  const audioItem = audioList.value.find(item => item.id === audioId)
  if (audioItem && audioItem.uploadId) {
    window.$uploader?.cancel(audioItem.uploadId)
    audioItem.status = 'pending'
    audioItem.progress = 0
    audioItem.uploadId = undefined
  }
}

// 开始上传
const startUpload = () => {
  const pendingAudios = audioList.value.filter(item => item.status === 'pending')
  pendingAudios.forEach(uploadAudio)
}

// 上传单个音频
const uploadAudio = async (audioItem: AudioItem) => {
  if (!window.$uploader) {
    console.error('Uploader not available')
    return
  }
  
  audioItem.status = 'uploading'
  emit('upload-start', audioItem.file)
  
  try {
    const uploadParam: UploadRequestParam = {
      file: audioItem.file,
      bucket: props.bucket || { name: 'default-bucket' },
      name: audioItem.name,
      scene: props.scene,
      metadata: props.metadata,
      contentType: props.contentType || 'audio/mpeg',
      acl: props.acl
    }
    
    const uploadId = await window.$uploader.upload(uploadParam, (progress: UploadProgress) => {
      audioItem.progress = progress.percentage
      emit('upload-progress', audioItem.file, progress.percentage)
    })
    
    audioItem.uploadId = uploadId
    
    const response = await window.$uploader.wait(uploadId)
    audioItem.status = 'success'
    audioItem.progress = 100
    emit('upload-success', audioItem.file, response)
    
    // 检查是否所有音频都上传完成
    const allCompleted = audioList.value.every(item => item.status === 'success' || item.status === 'error')
    if (allCompleted) {
      emit('upload-complete', audioList.value.map(item => item.file))
    }
    
  } catch (error) {
    audioItem.status = 'error'
    emit('upload-error', audioItem.file, error as Error)
    console.error('Upload failed:', error)
  }
}

// 播放控制
const togglePlay = async (audio: AudioItem) => {
  if (!audioPlayer.value) return
  
  if (playingAudioId.value === audio.id) {
    // 暂停当前播放
    audioPlayer.value.pause()
    playingAudioId.value = ''
    emit('audio-pause', audio.file)
  } else {
    // 停止之前的播放
    if (playingAudioId.value) {
      audioPlayer.value.pause()
      emit('audio-pause', audioList.value.find(item => item.id === playingAudioId.value)?.file!)
    }
    
    // 开始新的播放
    audioPlayer.value.src = audio.previewUrl
    await audioPlayer.value.play()
    playingAudioId.value = audio.id
    emit('audio-play', audio.file)
  }
}

// 停止播放
const stopAudio = () => {
  if (!audioPlayer.value) return
  
  if (playingAudioId.value) {
    const audioItem = audioList.value.find(item => item.id === playingAudioId.value)
    if (audioItem) {
      emit('audio-pause', audioItem.file)
    }
  }
  
  audioPlayer.value.pause()
  audioPlayer.value.currentTime = 0
  playingAudioId.value = ''
}

// 处理时间更新
const handleTimeUpdate = () => {
  // 可以在这里实现进度条更新等
}

// 处理音频结束
const handleAudioEnded = () => {
  if (playingAudioId.value) {
    const audioItem = audioList.value.find(item => item.id === playingAudioId.value)
    if (audioItem) {
      emit('audio-ended', audioItem.file)
    }
    playingAudioId.value = ''
  }
}

// 暴露方法给父组件
defineExpose({
  clearAudios: clearAll,
  uploadAudios: startUpload,
  getAudioList: () => {
    return audioList.value.map(item => ({
      file: item.file,
      previewUrl: item.previewUrl,
      duration: item.duration,
      status: item.status === 'success' ? 'uploaded' : undefined
    }))
  },
  playAudio: (audioFile: File) => {
    const audioItem = audioList.value.find(item => item.file === audioFile)
    if (audioItem) {
      togglePlay(audioItem)
    }
  },
  pauseAudio: stopAudio,
  removeAudio
})
</script>

<style scoped>
.sdkwork-uploader-audio {
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

.upload-area.has-audios {
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

.audio-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.audio-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  transition: all 0.2s ease;
}

.audio-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.audio-item.uploading {
  border-color: #3b82f6;
}

.audio-item.success {
  border-color: #10b981;
}

.audio-item.error {
  border-color: #ef4444;
}

.audio-item.playing {
  border-color: #8b5cf6;
  background-color: #faf5ff;
}

.audio-player {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-control {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.play-control:hover:not(:disabled) {
  background-color: #2563eb;
  transform: scale(1.05);
}

.play-control:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.audio-info {
  flex: 1;
  min-width: 0;
}

.audio-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.audio-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.audio-waveform {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 20px;
  margin-top: 4px;
}

.wave-bar {
  width: 2px;
  background-color: #3b82f6;
  border-radius: 1px;
  transition: height 0.1s ease;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #e5e7eb;
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
  color: #6b7280;
  font-weight: 600;
}

.audio-actions {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 8px;
  flex-shrink: 0;
}

.status-icons {
  display: flex;
  align-items: center;
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
  display: flex;
  gap: 8px;
}

.cancel-btn,
.remove-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #f3f4f6;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover,
.remove-btn:hover {
  background-color: #e5e7eb;
}

.add-more-btn {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
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
</style>