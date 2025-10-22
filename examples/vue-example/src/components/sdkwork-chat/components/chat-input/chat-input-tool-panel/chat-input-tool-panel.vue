<template>
  <div class="chat-input-tool-panel">
    <!-- 核心功能区域 -->
    <div class="tool-section">
      <h4 class="section-title">常用工具</h4>
      <div class="tool-grid">
        <!-- 图片工具 -->
        <button class="tool-item" @click="handleImageSelect">
          <Icon icon="mdi:image" width="28" height="28" class="tool-icon" />
          <div class="tool-label">图片</div>
        </button>

        <!-- 文件工具 -->
        <button class="tool-item" @click="handleFileSelect">
          <Icon icon="mdi:file-document-outline" width="28" height="28" class="tool-icon" />
          <div class="tool-label">文件</div>
        </button>

        <!-- 相机工具 -->
        <button v-if="enableCamera" class="tool-item" @click="handleCamera">
          <Icon icon="mdi:camera" width="28" height="28" class="tool-icon" />
          <div class="tool-label">相机</div>
        </button>

        <!-- 视频工具 -->
        <button class="tool-item" @click="handleVideoSelect">
          <Icon icon="mdi:video" width="28" height="28" class="tool-icon" />
          <div class="tool-label">视频</div>
        </button>

        <!-- 位置工具 -->
        <button class="tool-item" @click="handleLocation">
          <Icon icon="mdi:map-marker" width="28" height="28" class="tool-icon" />
          <div class="tool-label">位置</div>
        </button>

        <!-- 语音通话 -->
        <button class="tool-item" @click="handleVoiceCall">
          <Icon icon="mdi:microphone" width="28" height="28" class="tool-icon" />
          <div class="tool-label">语音通话</div>
        </button>

        <!-- 视频通话 -->
        <button class="tool-item" @click="handleVideoCall">
          <Icon icon="mdi:video" width="28" height="28" class="tool-icon" />
          <div class="tool-label">视频通话</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  enableCamera?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableCamera: true
})

interface Emits {
  'select-tool': [tool: string]
  'upload-file': [file: File]
  'take-photo': []
  'record-video': []
}

const emit = defineEmits<Emits>()

// 处理图片选择
const handleImageSelect = async () => {
  try {
    const result = await (window as any).$files.chooseImage({
      count: 1,
      success: (res: any) => {
        if (res.tempFiles && res.tempFiles[0]) {
          handleFileUpload(res.tempFiles[0], 'image')
        }
      },
      fail: (error: any) => {
        console.error('选择图片失败:', error)
      }
    })
    emit('select-tool', 'image')
  } catch (error) {
    console.error('选择图片失败:', error)
  }
}

// 处理文件选择
const handleFileSelect = async () => {
  try {
    const result = await (window as any).$files.chooseFile({
      count: 1,
      success: (res: any) => {
        if (res.tempFiles && res.tempFiles[0]) {
          handleFileUpload(res.tempFiles[0], 'file')
        }
      },
      fail: (error: any) => {
        console.error('选择文件失败:', error)
      }
    })
    emit('select-tool', 'file')
  } catch (error) {
    console.error('选择文件失败:', error)
  }
}

// 处理视频选择
const handleVideoSelect = async () => {
  try {
    const result = await (window as any).$files.chooseVideo({
      count: 1,
      success: (res: any) => {
        if (res.tempFiles && res.tempFiles[0]) {
          handleFileUpload(res.tempFiles[0], 'video')
        }
      },
      fail: (error: any) => {
        console.error('选择视频失败:', error)
      }
    })
    emit('select-tool', 'video')
  } catch (error) {
    console.error('选择视频失败:', error)
  }
}

// 处理相机
const handleCamera = () => {
  emit('select-tool', 'camera')
  emit('take-photo')
}

// 处理位置
const handleLocation = () => {
  emit('select-tool', 'location')
  console.log('选择位置')
}

// 处理联系人
const handleContact = () => {
  emit('select-tool', 'contact')
  console.log('选择联系人')
}

// 处理语音通话
const handleVoiceCall = () => {
  emit('select-tool', 'voice-call')
  console.log('发起语音通话')
}

// 处理视频通话
const handleVideoCall = () => {
  emit('select-tool', 'video-call')
  console.log('发起视频通话')
}

// 处理文件上传
const handleFileUpload = (file: File, type: string) => {
  if (validateFile(file, type)) {
    emit('upload-file', file)
  } else {
    console.error('文件类型或大小不符合要求')
  }
}

// 验证文件
const validateFile = (file: File, type: string): boolean => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (file.size > maxSize) {
    console.error('文件大小超过限制')
    return false
  }
  
  // 根据类型进行验证
  switch (type) {
    case 'image':
      return file.type.startsWith('image/')
    case 'video':
      return file.type.startsWith('video/')
    case 'file':
      return true // 文件类型较宽松
    default:
      return false
  }
}
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

.tool-icon {
  font-size: 28px;
  line-height: 1;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
  transition: transform 0.2s ease;
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