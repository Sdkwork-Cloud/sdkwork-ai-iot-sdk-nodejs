<template>
  <div class="circle-waveform">
    <div class="circle-container">
      <div 
        v-for="(circle, index) in circleData" 
        :key="index"
        class="circle"
        :style="{
          width: `${circle.size}px`,
          height: `${circle.size}px`,
          opacity: circle.opacity,
          backgroundColor: isPlaying ? circle.color : '#6c757d',
          transform: `scale(${circle.scale})`,
          animationDelay: `${circle.delay}s`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'

const playerStore = usePlayerStore()

const props = defineProps<{
  waveType?: string
}>()

const isPlaying = computed(() => playerStore.isPlaying)
const currentTime = computed(() => playerStore.currentTime)

// 生成圆形波形数据
const circleData = computed(() => {
  const circles = 8
  const data = []
  
  for (let i = 0; i < circles; i++) {
    const timeOffset = currentTime.value * 2
    const pulse = Math.sin(timeOffset + i * 0.5) * 0.5 + 0.5
    
    data.push({
      size: 6 + pulse * 8,
      opacity: 0.3 + pulse * 0.7,
      scale: 0.8 + pulse * 0.4,
      color: `hsl(${(i * 45 + timeOffset * 10) % 360}, 70%, 60%)`,
      delay: i * 0.1
    })
  }
  
  return data
})
</script>

<style scoped>
.circle-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
}

.circle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.circle {
  border-radius: 50%;
  transition: all 0.3s ease;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
}

.circle:hover {
  transform: scale(1.3) !important;
}
</style>