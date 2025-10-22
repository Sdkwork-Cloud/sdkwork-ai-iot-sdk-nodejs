<template>
  <div class="line-waveform">
    <svg :width="svgWidth" :height="svgHeight" class="waveform-svg">
      <path 
        :d="wavePath" 
        :stroke="isPlaying ? '#007bff' : '#6c757d'"
        stroke-width="2" 
        fill="none"
        class="wave-path"
      />
      <path 
        v-if="isPlaying"
        :d="wavePath" 
        stroke="#00ff88"
        stroke-width="1" 
        fill="none"
        opacity="0.6"
        class="glow-path"
      />
    </svg>
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

const svgWidth = 300
const svgHeight = 40

// 生成线形波形路径
const wavePath = computed(() => {
  const points = 100
  const path = []
  
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * svgWidth
    const timeOffset = currentTime.value * 10
    const amplitude = isPlaying.value ? 15 : 8
    
    // 使用正弦波生成波形
    const y = svgHeight / 2 + 
      Math.sin((i * 0.2) + timeOffset) * amplitude +
      Math.sin((i * 0.5) + timeOffset * 0.7) * amplitude * 0.5
    
    if (i === 0) {
      path.push(`M ${x} ${y}`)
    } else {
      path.push(`L ${x} ${y}`)
    }
  }
  
  return path.join(' ')
})
</script>

<style scoped>
.line-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
  overflow: hidden;
}

.waveform-svg {
  width: 100%;
  height: 100%;
}

.wave-path {
  transition: stroke 0.3s ease;
}

.glow-path {
  filter: blur(1px);
  transition: opacity 0.3s ease;
}
</style>