<template>
  <div v-if="audioUrl" class="audio-preview">
    <div class="audio-info">
      <Icon icon="ri:mic-line" width="24" height="24" />
      <div class="audio-details">
        <div class="audio-name">语音消息</div>
        <div class="audio-status">{{ recording ? '正在录音...' : '录音完成' }}</div>
      </div>
    </div>
    <div class="delete-btn" @click="handleDelete">
      <Icon icon="ri:close-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  audioUrl: string
  recording?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  recording: false
})

const emit = defineEmits<{
  delete: []
}>()

const handleDelete = () => {
  emit('delete')
}
</script>

<style scoped>
.audio-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-top: 16px;
  background: var(--bg-page, #f7f8fa);
  border-radius: var(--radius, 8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.audio-preview:hover {
  background: var(--bg-gray, #f0f2f5);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.audio-preview:hover .audio-info .iconify {
  transform: scale(1.1);
  color: var(--color-primary, #1989fa);
}

.audio-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.audio-info .iconify {
  transition: all 0.3s ease;
}

.audio-details {
  display: flex;
  flex-direction: column;
}

.audio-name {
  font-weight: 500;
  color: var(--text-primary, #323233);
}

.audio-status {
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