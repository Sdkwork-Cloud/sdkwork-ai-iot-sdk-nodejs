<template>
  <div class="image-uploader">
    <div class="upload-header">
      <van-icon name="photo" class="header-icon" />
      <span>上传参考图片</span>
    </div>
    
    <van-uploader 
      v-model="fileList" 
      :max-count="1" 
      :after-read="afterRead"
      :before-read="beforeRead"
      upload-text="点击上传图片"
      class="uploader"
    />
    
    <div class="upload-tips">
      <van-icon name="info" class="tip-icon" />
      <span>支持 JPG、PNG 格式，最大 10MB</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { showToast } from 'vant'

interface Props {
  modelValue: File[]
  mode?: 'single' | 'first-last'
}

interface Emits {
  (e: 'update:modelValue', value: File[]): void
}

interface UploadFile {
  file: File
  url: string
  name: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 文件列表
const fileList = ref<UploadFile[]>([])

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
  const files: File[] = fileList.value.map(item => item.file)
  emit('update:modelValue', files)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  // 如果外部传入空数组，清空内部文件列表
  if (newValue.length === 0) {
    fileList.value = []
  }
})
</script>

<style scoped>
.image-uploader {
  background: var(--bg-card);
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px;
}

.upload-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.header-icon {
  margin-right: 8px;
  color: var(--accent-blue);
  font-size: 16px;
}

.uploader {
  margin-bottom: 12px;
  width: 100%;
}

:deep(.van-uploader) {
  width: 100%;
}

:deep(.van-uploader__wrapper) {
  width: 100%;
}

:deep(.van-uploader__upload) {
  width: 100%;
  height: 120px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

:deep(.van-uploader__upload:hover) {
  border-color: var(--accent-blue);
  background: rgba(0, 123, 255, 0.05);
}

:deep(.van-uploader__upload-text) {
  font-size: 14px;
  color: var(--text-secondary);
}

:deep(.van-uploader__preview) {
  width: 100%;
  margin: 0;
}

:deep(.van-uploader__preview-image) {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.upload-tips {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 12px;
}

.tip-icon {
  margin-right: 4px;
  font-size: 12px;
}
</style>