<template>
  <div class="image-uploader">
    <!-- 上传模式选择 -->
    <div class="upload-mode">
      <div class="mode-selection">
        <div 
          class="mode-option" 
          :class="{ active: currentMode === 'single' }"
          @click="currentMode = 'single'"
        >
          <van-icon name="photo" />
          <span>单图参考</span>
        </div>
        <div 
          class="mode-option" 
          :class="{ active: currentMode === 'first-last' }"
          @click="currentMode = 'first-last'"
        >
          <van-icon name="photo-o" />
          <span>首位帧</span>
        </div>
      </div>
    </div>

    <!-- 上传区域 -->
    <div class="upload-area">
      <!-- 单图上传模式 -->
      <div v-if="currentMode === 'single'" class="single-upload">
        <van-uploader 
          v-model="fileList" 
          :max-count="1" 
          :after-read="afterRead"
          :before-read="beforeRead"
          upload-text="上传图片"
        />
      </div>

      <!-- 首尾帧上传模式 -->
      <div v-if="currentMode === 'first-last'" class="first-last-upload">
        <div class="upload-item">
          <p>首帧图片</p>
          <van-uploader 
            v-model="firstFrameList" 
            :max-count="1" 
            :after-read="afterRead"
            :before-read="beforeRead"
            upload-text="上传首帧"
          />
        </div>
        <div class="upload-item">
          <p>尾帧图片</p>
          <van-uploader 
            v-model="lastFrameList" 
            :max-count="1" 
            :after-read="afterRead"
            :before-read="beforeRead"
            upload-text="上传尾帧"
          />
        </div>
      </div>
    </div>

    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { showToast } from 'vant'

interface Props {
  modelValue: File[]
  mode?: 'single' | 'first-last'
}

interface Emits {
  (e: 'update:modelValue', value: File[]): void
  (e: 'update:mode', value: 'single' | 'first-last'): void
}

interface UploadFile {
  file: File
  url: string
  name: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'single'
})
const emit = defineEmits<Emits>()

// 上传模式
const currentMode = ref(props.mode)

// 单图上传文件列表
const fileList = ref<UploadFile[]>([])

// 首尾帧上传文件列表
const firstFrameList = ref<UploadFile[]>([])
const lastFrameList = ref<UploadFile[]>([])

// 计算所有图片
const allImages = computed(() => {
  if (currentMode.value === 'single') {
    return fileList.value
  } else {
    return [...firstFrameList.value, ...lastFrameList.value]
  }
})

// 是否有图片上传
const hasImages = computed(() => allImages.value.length > 0)

// 文件验证
const beforeRead = (file: any) => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    showToast('请上传图片文件')
    return false
  }
  
  // 检查文件大小（最大10MB）
  if (file.size > 10 * 1024 * 1024) {
    showToast('图片大小不能超过10MB')
    return false
  }
  
  return true
}

// 文件读取完成
const afterRead = (file: any) => {
  // 更新文件列表
  updateFiles()
  
  showToast('上传成功')
}

// 更新文件列表
const updateFiles = () => {
  const files: File[] = []
  
  if (currentMode.value === 'single') {
    files.push(...fileList.value.map(item => item.file))
  } else {
    files.push(...firstFrameList.value.map(item => item.file))
    files.push(...lastFrameList.value.map(item => item.file))
  }
  
  emit('update:modelValue', files)
}

// 图片预览
const previewImage = (file: UploadFile) => {
  // 这里可以集成图片预览功能
  console.log('预览图片:', file)
}

// 监听模式变化
watch(currentMode, (newMode) => {
  emit('update:mode', newMode)
  // 切换模式时清空文件
  fileList.value = []
  firstFrameList.value = []
  lastFrameList.value = []
  emit('update:modelValue', [])
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  // 如果外部传入空数组，清空内部文件列表
  if (newValue.length === 0) {
    fileList.value = []
    firstFrameList.value = []
    lastFrameList.value = []
  }
})
</script>

<style scoped>
.image-uploader {
  background: var(--bg-card);
  border-radius: 12px; 
  margin-bottom: 16px; 
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
}

.image-uploader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-blue), #00b4ff);
  border-radius: 12px 12px 0 0;
}

.image-uploader:hover {
  border-color: var(--accent-blue);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.25);
  transform: translateY(-2px);
}

.upload-mode {
  margin-bottom: 20px;
}

.mode-selection {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid #4a5568;
}

.mode-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  background: transparent;
}

.mode-option.active {
  background: var(--accent-blue);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.mode-option .van-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.mode-option span {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.upload-area {
  margin-bottom: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid #4a5568;
}

.single-upload {
  width: 100%;
}

.single-upload :deep(.van-uploader) {
  width: 100%;
}

.single-upload :deep(.van-uploader__wrapper) {
  display: flex;
  justify-content: center;
}

.single-upload :deep(.van-uploader__upload) {
  width: 100%;
  max-width: 300px;
  height: 140px;
  border-radius: 12px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  transition: all 0.3s ease;
}

.single-upload :deep(.van-uploader__upload:hover) {
  border-color: var(--accent-blue);
  background: var(--bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.first-last-upload {
  display: flex;
  gap: 16px;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
}

.upload-item {
  flex: 1;
  min-width: 0;
  max-width: 180px;
}

.upload-item :deep(.van-uploader) {
  display: flex;
  justify-content: center;
}

.upload-item :deep(.van-uploader__upload) {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  transition: all 0.3s ease;
}

.upload-item :deep(.van-uploader__upload:hover) {
  border-color: var(--accent-blue);
  background: var(--bg-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.upload-item p {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  text-align: center;
}

.image-preview {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid #4a5568;
}

.image-preview h4 {
  margin-bottom: 12px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid var(--accent-blue);
  padding-bottom: 8px;
}

.preview-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-item {
  width: 80px;
  text-align: center;
  cursor: pointer;
}

.preview-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.preview-item span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.van-uploader__upload-icon) {
  color: var(--text-secondary);
  font-size: 24px;
}

:deep(.van-uploader__upload-text) {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 8px;
}

:deep(.van-uploader__preview-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}
</style>