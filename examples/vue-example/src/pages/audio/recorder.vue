<template>
  <sdkwork-page-container>
    <!-- 音频录制器组件 -->
    <SdkworkAudioRecorder
      :config="config"
      :show-record-list="true"
      :show-subtitle="true"
      :wave-width="400"
      :wave-height="120"
      :wave-line-color="'#409EFF'"
      container-class="simple-recorder"
      @record-start="handleRecordStart"
      @record-stop="handleRecordStop"
      @record-error="handleRecordError"
    />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkAudioRecorder from '@/components/sdkwork-audio-recorder/sdkwork-audio-recorder.vue'
import type { RecorderConfig, AudioRecord } from '@/stores/modules/recorder/types'
definePage({
    meta: {
        hideHeader: true
    }
})
// 配置
const config = ref<RecorderConfig>({
  sampleRate: 16000,
  format: 'pcm',
  enableWave: true,
  realtime: false,
  recordToFile: true,
  maxDuration: 0
})

// 事件处理函数
const handleRecordStart = () => {
  console.log('录制开始')
}

const handleRecordStop = (data: AudioRecord) => {
  console.log('录制停止', data)
}

const handleRecordError = (error: Error) => {
  console.error('录制错误', error)
}
</script>

<style scoped>  
</style>