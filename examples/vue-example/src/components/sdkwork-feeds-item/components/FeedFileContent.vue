<template>
  <div v-if="files && files.length" class="feed-files">
    <div
      v-for="(file, index) in files"
      :key="index"
      class="file-item"
      @click="handleFileClick(file)"
    >
      <div class="file-icon">
        <Icon :icon="getFileIcon(file.name)" width="24" height="24" />
      </div>
      <div class="file-info">
        <div class="file-name">{{ file.name }}</div>
        <div class="file-meta">
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
          <span class="file-type" v-if="file.type">{{ getFileType(file.type) }}</span>
        </div>
      </div>
      <div class="file-action">
        <Icon icon="ri:download-line" width="18" height="18" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface FileItem {
  name: string
  size: number
  type?: string
  url?: string
}

interface Props {
  files: FileItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  fileClick: [file: FileItem]
}>()

const handleFileClick = (file: FileItem) => {
  emit('fileClick', file)
}

const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  const iconMap: Record<string, string> = {
    // 文档类型
    pdf: 'ri:file-pdf-line',
    doc: 'ri:file-word-line',
    docx: 'ri:file-word-line',
    xls: 'ri:file-excel-line',
    xlsx: 'ri:file-excel-line',
    ppt: 'ri:file-ppt-line',
    pptx: 'ri:file-ppt-line',
    txt: 'ri:file-text-line',
    md: 'ri:file-markdown-line',
    
    // 图片类型
    jpg: 'ri:image-line',
    jpeg: 'ri:image-line',
    png: 'ri:image-line',
    gif: 'ri:image-line',
    svg: 'ri:image-line',
    webp: 'ri:image-line',
    
    // 音频类型
    mp3: 'ri:music-2-line',
    wav: 'ri:music-2-line',
    flac: 'ri:music-2-line',
    aac: 'ri:music-2-line',
    
    // 视频类型
    mp4: 'ri:video-line',
    avi: 'ri:video-line',
    mov: 'ri:video-line',
    mkv: 'ri:video-line',
    webm: 'ri:video-line',
    
    // 压缩文件
    zip: 'ri:file-zip-line',
    rar: 'ri:file-zip-line',
    '7z': 'ri:file-zip-line',
    tar: 'ri:file-zip-line',
    gz: 'ri:file-zip-line',
    
    // 代码文件
    js: 'ri:code-s-slash-line',
    ts: 'ri:code-s-slash-line',
    html: 'ri:code-box-line',
    css: 'ri:code-box-line',
    vue: 'ri:vuejs-line',
    react: 'ri:reactjs-line',
    
    // 其他常见类型
    exe: 'ri:settings-3-line',
    dmg: 'ri:apple-line',
    iso: 'ri:cd-line',
  }
  
  return iconMap[extension || ''] || 'ri:file-line'
}

const getFileType = (mimeType: string): string => {
  const typeMap: Record<string, string> = {
    // 图片类型
    'image/jpeg': 'JPEG图片',
    'image/png': 'PNG图片',
    'image/gif': 'GIF图片',
    'image/svg+xml': 'SVG图片',
    'image/webp': 'WebP图片',
    
    // 文档类型
    'application/pdf': 'PDF文档',
    'application/msword': 'Word文档',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word文档',
    'application/vnd.ms-excel': 'Excel表格',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel表格',
    'application/vnd.ms-powerpoint': 'PPT演示文稿',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPT演示文稿',
    'text/plain': '文本文件',
    
    // 音频类型
    'audio/mpeg': 'MP3音频',
    'audio/wav': 'WAV音频',
    'audio/flac': 'FLAC音频',
    
    // 视频类型
    'video/mp4': 'MP4视频',
    'video/avi': 'AVI视频',
    'video/quicktime': 'MOV视频',
    'video/x-msvideo': 'AVI视频',
    'video/webm': 'WebM视频',
    
    // 压缩文件
    'application/zip': 'ZIP压缩包',
    'application/x-rar-compressed': 'RAR压缩包',
    'application/x-7z-compressed': '7Z压缩包',
  }
  
  return typeMap[mimeType] || mimeType.split('/')[1]?.toUpperCase() || '未知类型'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.feed-files {
  margin-bottom: 12px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--bg-page, #f7f8fa);
  border-radius: var(--radius, 8px);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color, #ebedf0);
}

.file-item:last-child {
  margin-bottom: 0;
}

.file-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary, #1989fa);
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-gray, #f0f2f5);
  border-radius: var(--radius-small, 6px);
  margin-right: 12px;
  color: var(--color-primary, #1989fa);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary, #323233);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.file-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary, #969799);
}

.file-action {
  display: flex;
  align-items: center;
  color: var(--text-secondary, #969799);
  transition: color 0.2s ease;
}

.file-item:hover .file-action {
  color: var(--color-primary, #1989fa);
}
</style>