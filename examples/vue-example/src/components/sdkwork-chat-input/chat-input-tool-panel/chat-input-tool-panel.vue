<template>
  <div class="chat-input-tool-panel">
    <!-- 核心功能区域 -->
    <div class="tool-section">
      <h4 class="section-title">常用工具</h4>
      <div class="tool-grid">
        <!-- 图片工具 -->
        <button class="tool-item" @click="image" :disabled="loadingStates.image">
          <div class="tool-icon-wrapper">
            <Icon icon="mdi:image" width="28" height="28" class="tool-icon" />
            <div v-if="loadingStates.image" class="loading-spinner"></div>
          </div>
          <div class="tool-label">图片</div>
        </button>

        <!-- 文件工具 -->
        <button class="tool-item" @click="file" :disabled="loadingStates.file">
          <div class="tool-icon-wrapper">
            <Icon icon="mdi:file-document-outline" width="28" height="28" class="tool-icon" />
            <div v-if="loadingStates.file" class="loading-spinner"></div>
          </div>
          <div class="tool-label">文件</div>
        </button>

        <!-- 相机工具 -->
        <button v-if="enableCamera" class="tool-item" @click="camera">
          <Icon icon="mdi:camera" width="28" height="28" class="tool-icon" />
          <div class="tool-label">相机</div>
        </button>

        <!-- 视频工具 -->
        <button class="tool-item" @click="video" :disabled="loadingStates.video">
          <div class="tool-icon-wrapper">
            <Icon icon="mdi:video" width="28" height="28" class="tool-icon" />
            <div v-if="loadingStates.video" class="loading-spinner"></div>
          </div>
          <div class="tool-label">视频</div>
        </button>

        <!-- 位置工具 -->
        <button class="tool-item" @click="location" :disabled="loadingStates.location">
          <div class="tool-icon-wrapper">
            <Icon icon="mdi:map-marker" width="28" height="28" class="tool-icon" />
            <div v-if="loadingStates.location" class="loading-spinner"></div>
          </div>
          <div class="tool-label">位置</div>
        </button>

        <!-- 语音通话 -->
        <button class="tool-item" @click="voiceCall">
          <Icon icon="mdi:microphone" width="28" height="28" class="tool-icon" />
          <div class="tool-label">语音通话</div>
        </button>

        <!-- 视频通话 -->
        <button class="tool-item" @click="videoCall">
          <Icon icon="mdi:video" width="28" height="28" class="tool-icon" />
          <div class="tool-label">视频通话</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

interface Props {
  enableCamera?: boolean
  targetUserId?: string
  conversationId?: string
}

const props = withDefaults(defineProps<Props>(), {
  enableCamera: true,
  targetUserId: ''
})

interface Emits {
  'select-tool': [tool: string]
  'send-image': [imageFile: File]
  'send-file': [file: File]
  'send-video': [videoFile: File]
  'send-rtc-request': [type: 'video' | 'voice', targetUserId: string]
  'send-location': [latitude: number, longitude: number, address?: string]
  'take-photo': []
}

const emit = defineEmits<Emits>()

// 工具类型枚举
const ToolType = {
  IMAGE: 'image',
  FILE: 'file', 
  CAMERA: 'camera',
  VIDEO: 'video',
  LOCATION: 'location',
  VOICE_CALL: 'voice-call',
  VIDEO_CALL: 'video-call'
} as const

type ToolType = typeof ToolType[keyof typeof ToolType]

// 加载状态管理
const loadingStates = ref<Record<string, boolean>>({})

// 工具选择处理
const handleToolSelect = (tool: ToolType) => {
  emit('select-tool', tool)
}

// 文件选择处理
const selectFile = async (type: 'image' | 'file' | 'video'): Promise<File | null> => {
  const fileApis = {
    image: 'chooseImage',
    file: 'chooseFile', 
    video: 'chooseVideo'
  }
  
  try {
    loadingStates.value[type] = true
    
    const result = await (window as any).$files[fileApis[type]]({
      count: 1,
      success: (res: any) => {
        if (res.tempFiles && res.tempFiles[0]) {
          return res.tempFiles[0]
        }
        return null
      },
      fail: (error: any) => {
        throw new Error(`选择${type}失败: ${error.message || error}`)
      }
    })
    
    return result
  } catch (error) {
    console.error(`工具 ${type} 操作失败:`, error)
    return null
  } finally {
    loadingStates.value[type] = false
  }
}

// 文件验证
const validateFile = (file: File, type: string): boolean => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (file.size > maxSize) {
    console.error('文件大小超过限制')
    return false
  }
  
  switch (type) {
    case 'image':
      return file.type.startsWith('image/')
    case 'video':
      return file.type.startsWith('video/')
    case 'file':
      return true
    default:
      return false
  }
}

// 工具事件处理器
const toolHandlers = {
  // 图片选择
  async image() {
    handleToolSelect(ToolType.IMAGE)
    const file = await selectFile('image')
    if (file && validateFile(file, 'image')) {
      emit('send-image', file)
    }
  },
  
  // 文件选择
  async file() {
    handleToolSelect(ToolType.FILE)
    const file = await selectFile('file')
    if (file && validateFile(file, 'file')) {
      emit('send-file', file)
    }
  },
  
  // 视频选择
  async video() {
    handleToolSelect(ToolType.VIDEO)
    const file = await selectFile('video')
    if (file && validateFile(file, 'video')) {
      emit('send-video', file)
    }
  },
  
  // 相机
  camera() {
    handleToolSelect(ToolType.CAMERA)
    emit('take-photo')
  },
  
  // 位置获取
  async location() {
    handleToolSelect(ToolType.LOCATION)
    
    if (!navigator.geolocation) {
      console.error('浏览器不支持地理位置服务')
      return
    }
    
    try {
      loadingStates.value.location = true
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        })
      })
      
      const { latitude, longitude } = position.coords
      emit('send-location', latitude, longitude)
    } catch (error) {
      console.error('获取位置失败:', error)
    } finally {
      loadingStates.value.location = false
    }
  },
  
  // 语音通话
  voiceCall() {
    handleToolSelect(ToolType.VOICE_CALL)
    emit('send-rtc-request', 'voice', props.targetUserId)
  },
  
  // 视频通话
  videoCall() {
    handleToolSelect(ToolType.VIDEO_CALL)
    emit('send-rtc-request', 'video', props.targetUserId)
  }
}

// 导出工具处理器
const { image, file, video, camera, location, voiceCall, videoCall } = toolHandlers
</script>

<style scoped>
.chat-input-tool-panel {
  padding: 16px;
  height: auto;
  min-height: 180px;
  background-color: #fff;
}

.tool-section {
  margin-bottom: 12px;
}

.section-title {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  border: none;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 90px;
  aspect-ratio: 1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.tool-item:hover {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(33, 150, 243, 0.2);
}

.tool-item:active {
  transform: translateY(-1px) scale(0.98);
  transition: all 0.1s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tool-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
}

.tool-icon {
  font-size: 28px;
  line-height: 1;
  filter: brightness(0.9);
  transition: transform 0.2s ease;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tool-item:hover .tool-icon {
  transform: scale(1.1);
  filter: brightness(1);
}

.tool-label {
  font-size: 13px;
  color: #555;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  min-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.3px;
  transition: color 0.2s ease;
}

.tool-item:hover .tool-label {
  color: #1976d2;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-input-tool-panel {
    padding: 16px;
    height: auto;
    min-height: 200px;
  }
  
  .tool-section {
    margin-bottom: 12px;
  }
  
  .section-title {
    font-size: 12px;
    margin-bottom: 8px;
    color: #777;
  }
  
  .tool-grid {
    gap: 12px;
  }
  
  .tool-item {
    padding: 14px 10px;
    min-height: 85px;
    border-radius: 10px;
  }
  
  .tool-icon {
    font-size: 24px;
    min-height: 28px;
  }
  
  .tool-label {
    font-size: 12px;
    min-height: 16px;
    font-weight: 600;
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .chat-input-tool-panel {
    padding: 12px;
    height: auto;
    min-height: 180px;
  }
  
  .tool-grid {
    gap: 10px;
    grid-template-columns: repeat(4, 1fr);
  }
  
  .tool-item {
    padding: 12px 8px;
    min-height: 75px;
    border-radius: 8px;
  }
  
  .tool-icon {
    font-size: 22px;
    min-height: 26px;
  }
  
  .tool-label {
    font-size: 11px;
    min-height: 14px;
    font-weight: 600;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .chat-input-tool-panel {
    background-color: #1e1e1e;
  }
  
  .section-title {
    color: #aaa;
  }
  
  .tool-item {
    background: linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }
  
  .tool-item:hover {
    background: linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    border-color: rgba(33, 150, 243, 0.3);
  }
  
  .tool-label {
    color: #e0e0e0;
  }
  
  .tool-item:hover .tool-label {
    color: #64b5f6;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .tool-item:hover {
    transform: none;
    box-shadow: none;
  }
  
  .tool-item:active {
    background-color: #e9ecef;
    transform: scale(0.95);
  }
  
  @media (prefers-color-scheme: dark) {
    .tool-item:active {
      background-color: #4a4a4a;
    }
  }
}
</style>