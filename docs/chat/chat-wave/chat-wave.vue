<template>
  <div class="chat-wave" v-if="isSpeaking">
    <div class="voice-wave">
      <div class="wave-bar" v-for="i in 8" :key="i" :style="getWaveStyle(i)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  isSpeaking: boolean
}

const props = defineProps<Props>()

const getWaveStyle = (index: number) => {
  const height = Math.random() * 20 + 5
  const delay = index * 0.1
  return {
    height: `${height}px`,
    animationDelay: `${delay}s`
  }
}

let waveInterval: number

onMounted(() => {
  // 模拟语音波形
  waveInterval = setInterval(() => {
    // 语音状态由父组件控制
  }, 2000)
})

onUnmounted(() => {
  clearInterval(waveInterval)
})
</script>

<style scoped lang="scss">
.chat-wave {
  .voice-wave {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 30px;
    
    .wave-bar {
      width: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 2px;
      animation: wave 1.5s ease-in-out infinite;
      
      @keyframes wave {
        0%, 100% {
          transform: scaleY(0.3);
        }
        50% {
          transform: scaleY(1);
        }
      }
    }
  }
}
</style>