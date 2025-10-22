<template>
  <div class="waveform-component" :class="mode">
    <!-- 根据波形类型渲染不同的波形组件 -->
    <component 
      :is="waveformComponents[waveformType]" 
      :mode="mode"
      :theme-color="themeColor"
      :bar-count="barCount"
      :min-height="minHeight"
      :max-height="maxHeight"
      :is-playing="isPlaying"
      :progress="progress"
      :volume="volume"
    />
    
    <slot name="waveform-custom"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import BarWaveform from './waveform/BarWaveform.vue'
import LineWaveform from './waveform/LineWaveform.vue'
import CircleWaveform from './waveform/CircleWaveform.vue'

interface Props {
  mode?: 'card' | 'bottom-bar' | 'fullscreen'
  themeColor?: string
  barCount?: number
  minHeight?: number
  maxHeight?: number
  waveformType?: 'bar' | 'line' | 'circle'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'card',
  themeColor: '#3b82f6',
  barCount: 60,
  minHeight: 10,
  maxHeight: 40,
  waveformType: 'bar'
})

const playerStore = usePlayerStore()

// 播放状态数据
const isPlaying = computed(() => playerStore.playbackState.isPlaying)
const progress = computed(() => playerStore.playbackState.progress)
const volume = computed(() => playerStore.playbackState.volume)

// 波形组件映射
const waveformComponents = shallowRef({
  bar: BarWaveform,
  line: LineWaveform,
  circle: CircleWaveform
})
</script>

<style scoped>
.waveform-component {
  width: 100%;
}

/* 不同模式的尺寸 */
.waveform-component.card {
  height: 30px;
}

.waveform-component.fullscreen {
  height: 60px;
}

.waveform-component.bottom-bar {
  height: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .waveform-component.card {
    height: 25px;
  }
  
  .waveform-component.fullscreen {
    height: 40px;
  }
  
  .waveform-component.bottom-bar {
    height: 15px;
  }
}

@media (max-width: 480px) {
  .waveform-component.card {
    height: 20px;
  }
  
  .waveform-component.fullscreen {
    height: 30px;
  }
  
  .waveform-component.bottom-bar {
    display: none;
  }
}
</style>