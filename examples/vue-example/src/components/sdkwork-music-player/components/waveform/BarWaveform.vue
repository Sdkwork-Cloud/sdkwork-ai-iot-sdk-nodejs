<template>
  <div class="bar-waveform">
    <div 
      v-for="(bar, index) in waveformData" 
      :key="index"
      class="bar"
      :style="{
        height: `${bar}%`,
        backgroundColor: isPlaying ? '#007bff' : '#6c757d',
        transition: 'height 0.1s ease, background-color 0.3s ease'
      }"
    ></div>
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

// 生成模拟波形数据
const waveformData = computed(() => {
  const bars = 32
  const data = []
  
  for (let i = 0; i < bars; i++) {
    // 根据播放状态和位置生成动态波形
    const baseHeight = Math.random() * 30 + 10
    const timeFactor = Math.sin((currentTime.value + i) * 0.1) * 0.5 + 0.5
    const playFactor = isPlaying.value ? 1.5 : 0.8
    
    data.push(Math.min(100, baseHeight * timeFactor * playFactor))
  }
  
  return data
})
</script>

<style scoped>
.bar-waveform {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 40px;
  width: 100%;
  padding: 4px 0;
}

.bar {
  flex: 1;
  margin: 0 1px;
  min-height: 2px;
  border-radius: 2px;
  transition: all 0.1s ease;
}

.bar:hover {
  opacity: 0.8;
}
</style>