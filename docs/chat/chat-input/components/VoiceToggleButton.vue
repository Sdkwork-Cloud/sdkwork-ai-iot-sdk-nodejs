<template>
  <button
    class="voice-toggle-button"
    :class="{ 'voice-mode': isVoiceMode }"
    @click="$emit('toggle')"
    type="button"
  >
    <svg v-if="!isVoiceMode" class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3.7v6.8l-2.5 2.5c-.4.4-.9.6-1.5.6-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2 .6 0 1.1.2 1.5.6L12 3.7z"/>
      <path d="M17.5 12c0 2.8-2.2 5-5 5s-5-2.2-5-5h2c0 1.7 1.3 3 3 3s3-1.3 3-3h2z"/>
      <path d="M19 12c0 3.9-3.1 7-7 7s-7-3.1-7-7h2c0 2.8 2.2 5 5 5s5-2.2 5-5h2z"/>
    </svg>
    <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/>
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5h10z"/>
      <path d="M17 11v2c0 2.76-2.24 5-5 5s-5-2.24-5-5v-2H5v2c0 3.87 3.13 7 7 7s7-3.13 7-7v-2h-2z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
interface Props {
  isVoiceMode?: boolean
}

interface Emits {
  (e: 'toggle'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped lang="scss">
.voice-toggle-button {
  width: 40px;
  height: 40px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: #e0e0e0;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.voice-mode {
    background: #07c160;
    color: white;
    
    &:hover {
      background: #06ae56;
    }
  }
  
  .icon {
    width: 20px;
    height: 20px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .voice-toggle-button {
    width: 36px;
    height: 36px;
    
    .icon {
      width: 18px;
      height: 18px;
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .voice-toggle-button {
    background: #333;
    color: #fff;
    
    &:hover {
      background: #444;
    }
    
    &.voice-mode {
      background: #07c160;
      
      &:hover {
        background: #06ae56;
      }
    }
  }
}
</style>