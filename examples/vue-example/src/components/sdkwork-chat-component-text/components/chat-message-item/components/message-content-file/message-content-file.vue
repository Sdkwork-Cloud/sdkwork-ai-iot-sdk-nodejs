<template>
  <div class="message-content-file" @click="handleFileClick">
    <div class="file-icon">
      <Icon :icon="fileIcon" width="20" height="20" class="file-icon-svg" />
    </div>
    <div class="file-info">
      <div class="file-name">{{ fileName }}</div>
      <div class="file-meta">
        <span class="file-size">{{ fileSize }}</span>
        <span v-if="fileType" class="file-type">{{ fileType }}</span>
      </div>
    </div>
    <div class="file-action">
      <button class="download-button" @click.stop="handleDownload">
        <Icon icon="mdi:download" width="16" height="16" class="download-icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatMessageVO } from '@/services'

interface Props {
  message: ChatMessageVO
}

const props = defineProps<Props>()

// 计算属性
const fileName = computed(() => {
  return '未知文件'
})

const fileSize = computed(() => {
  return '未知大小'
})

const fileType = computed(() => {
  return ''
})

const fileIcon = computed(() => {
  return 'mdi:paperclip'
})

// 处理文件点击
const handleFileClick = () => {
  // 这里可以触发文件预览或下载
  console.log('文件点击:', fileName.value)
}

// 处理下载
const handleDownload = () => {
  // ChatMessageVO没有attachment属性
  console.log('下载文件:', fileName.value)
}
</script>

<style scoped>
.message-content-file {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 300px;
}

.message-content-file:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.file-icon {
  margin-right: 12px;
  font-size: 24px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.file-action {
  margin-left: 8px;
}

.download-button {
  padding: 6px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-button:hover {
  background-color: #dee2e6;
}

.download-icon {
  font-size: 16px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-content-file {
    max-width: 250px;
    padding: 10px;
  }
  
  .file-icon {
    font-size: 20px;
    margin-right: 10px;
  }
  
  .file-name {
    font-size: 13px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .message-content-file {
    background-color: #2d2d2d;
    border-color: #404040;
  }
  
  .message-content-file:hover {
    background-color: #3a3a3a;
  }
  
  .file-name {
    color: #fff;
  }
  
  .file-meta {
    color: #aaa;
  }
  
  .download-button:hover {
    background-color: #4a4a4a;
  }
}
</style>