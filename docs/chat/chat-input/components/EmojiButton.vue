<template>
  <button
    class="emoji-button"
    @click="$emit('click')"
    type="button"
  >
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <circle cx="8.5" cy="10.5" r="1.5"/>
      <circle cx="15.5" cy="10.5" r="1.5"/>
      <path d="M12 16c-1.48 0-2.75-.81-3.45-2H15.45c-.7 1.19-1.97 2-3.45 2z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'click'): void
}

defineEmits<Emits>()
</script>

<style scoped lang="scss">
.emoji-button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
  
  &:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .icon {
    width: 20px;
    height: 20px;
    color: #666;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .emoji-button {
    width: 32px;
    height: 32px;
    margin-left: 6px;
    
    .icon {
      width: 18px;
      height: 18px;
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .emoji-button {
    &:hover {
      background: #333;
    }
    
    .icon {
      color: #ccc;
    }
  }
}
</style>