<template>
  <div class="timer-display">
    <div class="timer-value">{{ formattedTime }}</div>
    <div class="timer-label">录制时长</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 当前时长 (秒) */
  duration: number
  /** 时间格式 */
  format?: 'seconds' | 'minutes' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  duration: 0,
  format: 'auto'
})

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(props.duration)
  
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<style scoped>
.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  width: 70%;
  max-width: 400px;
  margin: 0 auto;
}

.timer-value {
  font-size: 42px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
  text-align: center;
  width: 100%;
}

.timer-label {
  font-size: 16px;
  color: #cccccc;
  font-weight: 400;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .timer-display {
    width: 70%;
    max-width: 300px;
  }
  
  .timer-value {
    font-size: 42px;
    letter-spacing: 1px;
  }
  
  .timer-label {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .timer-display {
    width: 70%;
    max-width: 250px;
  }
  
  .timer-value {
    font-size: 42px;
  }
}
</style>