<template>
  <button
    class="send-button"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    @click="$emit('click')"
    type="button"
  >
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
}

interface Emits {
  (e: 'click'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped lang="scss">
.send-button {
  width: 40px;
  height: 40px;
  border: none;
  background: #07c160;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover:not(.disabled) {
    background: #06ae56;
    transform: scale(1.05);
  }
  
  &:active:not(.disabled) {
    transform: scale(0.95);
  }
  
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .icon {
    width: 20px;
    height: 20px;
    color: white;
    margin-left: 2px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .send-button {
    width: 36px;
    height: 36px;
    
    .icon {
      width: 18px;
      height: 18px;
      margin-left: 1px;
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .send-button {
    background: #07c160;
    
    &:hover:not(.disabled) {
      background: #06ae56;
    }
    
    &.disabled {
      background: #555;
    }
  }
}
</style>