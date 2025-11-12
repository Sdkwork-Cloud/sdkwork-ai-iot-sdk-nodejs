<template>
  <div v-if="files.length > 0" class="file-list">
    <div
      v-for="(file, index) in files"
      :key="index"
      class="file-item"
    >
      <Icon icon="ri:file-text-line" width="24" height="24" />
      <div class="file-info">
        <div class="file-name">{{ file.name }}</div>
        <div class="file-size">{{ formatFileSize(file.size) }}</div>
      </div>
      <div class="delete-btn" @click="handleDelete(index)">
        <Icon icon="ri:close-line" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  files: File[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [index: number]
}>()

const handleDelete = (index: number) => {
  emit('delete', index)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.file-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-page, #f7f8fa);
  border-radius: var(--radius, 8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-item:hover {
  background: var(--bg-gray, #f0f2f5);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.file-item .iconify {
  color: var(--color-primary, #1989fa);
  font-size: 24px;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.file-item:hover .iconify {
  transform: scale(1.1);
  color: var(--color-primary, #1989fa);
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary, #323233);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: var(--text-secondary, #969799);
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  cursor: pointer;
  z-index: 1;
}

.delete-btn:hover {
  background: rgba(255, 59, 48, 0.8);
  transform: scale(1.1);
}
</style>