<template>
  <div class="load-more-indicator">
    <div class="load-more-content">
      <div v-if="loading" class="loading-icon">↻</div>
      <div v-else class="load-more-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading?: boolean
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  text: '加载更多...'
})
</script>

<style scoped lang="scss">
.load-more-indicator {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #e0e0e0;

  .load-more-content {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .loading-icon {
      font-size: 20px;
      color: #007AFF;
      animation: spin 1s linear infinite;
      font-weight: bold;
    }
    
    .load-more-text {
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
:global(.dark-mode) .load-more-indicator {
  background: rgba(0, 0, 0, 0.95);
  border-top: 1px solid #333;

  .load-more-content {
    .loading-icon {
      color: #0A84FF;
    }
    
    .load-more-text {
      color: #0A84FF;
    }
  }
}
</style>