<template>
  <div class="chat-input-toolbar">
    <!-- 语音按钮保留在左侧 -->
    <button v-if="enableVoice" class="tool-button" @click="$emit('toggle-voice-input')">
      <Icon v-if="isVoiceInput" icon="mdi:microphone" width="18" height="18" class="voice-active-icon" />
      <Icon v-else icon="mdi:microphone-outline" width="18" height="18" class="voice-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
interface Props {
  enableVoice?: boolean
  isVoiceInput?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableVoice: true,
  isVoiceInput: false
})

interface Emits {
  'toggle-voice-input': []
}

const emit = defineEmits<Emits>()
</script>

<style scoped>
.chat-input-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.tool-button:hover {
  background-color: #e9ecef;
  transform: scale(1.05);
}

.voice-icon, .voice-active-icon {
  font-size: 18px;
}

.voice-active-icon {
  color: #ff4444;
}

@media (max-width: 768px) {
  .tool-button {
    width: 36px;
    height: 36px;
  }
}

@media (prefers-color-scheme: dark) {
  .tool-button {
    background-color: #3a3a3a;
  }
  
  .tool-button:hover {
    background-color: #4a4a4a;
  }
}
</style>