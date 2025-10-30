<template>
  <div class="loading-indicator">
    <div class="loading-content">
      <div class="loading-icon">↻</div>
      <div class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '刷新中...'
})
</script>

<style scoped lang="scss">
.loading-indicator { 
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-bottom: 1px solid #e0e0e0;
  backdrop-filter: blur(10px);

  .loading-content {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .loading-icon {
      font-size: 20px;
      color: #007AFF;
      animation: spin 1s linear infinite;
      font-weight: bold;
    }
    
    .loading-text {
      font-size: 16px;
      color: #007AFF;
      font-weight: 500;
    }
  }
}

/* 旋转动画 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Darkmode 支持 */
:global(.dark-mode) .loading-indicator {
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid #333;

  .loading-content {
    .loading-icon {
      color: #0A84FF;
    }
    
    .loading-text {
      color: #0A84FF;
    }
  }
}
</style>