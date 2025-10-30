<template>
  <button 
    class="chat-input-send-button"
    :disabled="!canSend"
    @click="$emit('send')"
  >
    <Icon icon="mdi:send" width="24" height="24" class="send-icon" /> 
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
interface Props {
  canSend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canSend: false
})

interface Emits {
  'send': []
}

const emit = defineEmits<Emits>()
</script>

<style scoped>
.chat-input-send-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chat-input-send-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: scale(1.05);
}

.chat-input-send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.send-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.send-icon svg {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .chat-input-send-button {
    width: 36px;
    height: 36px;
  }
  
  .send-icon {
    width: 20px;
    height: 20px;
  }
}
</style>