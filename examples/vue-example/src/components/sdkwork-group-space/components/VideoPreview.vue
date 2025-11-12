<template>
  <div v-if="videoUrl" class="video-preview">
    <video :src="videoUrl" controls class="video-player"></video>
    <div class="delete-btn" @click="handleDelete">
      <Icon icon="ri:close-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  videoUrl: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: []
}>()

const handleDelete = () => {
  emit('delete')
}
</script>

<style scoped>
.video-preview {
  position: relative;
  margin-top: 16px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.video-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.video-preview:hover video {
  transform: scale(1.02);
}

.video-player {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background: var(--bg-gray, #f5f5f5);
  border-radius: var(--radius, 8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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