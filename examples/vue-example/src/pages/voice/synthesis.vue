<template>
  <div class="voice-synthesis-page">
   

    <!-- 语音合成组件 -->
    <SdkworkVoiceSynthesis
      :theme-mode="themeMode"
      :default-text="defaultText"
      :default-speaker="defaultSpeaker"
      :show-advanced-params="true"
      @start="handleSynthesisStart"
      @complete="handleSynthesisComplete"
      @error="handleSynthesisError"
      @speaker-change="handleSpeakerChange"
    />

    <!-- 合成结果展示 -->
    <div v-if="synthesisResult" class="result-section">
      <sdkwork-cell-group :theme-mode="themeMode">
        <sdkwork-cell title="合成结果" :theme-mode="themeMode">
          <template #value>
            <div class="result-info">
              <span class="duration">时长: {{ synthesisResult.duration }}秒</span>
              <span class="file-size">大小: {{ formatFileSize(synthesisResult.fileSize) }}</span>
            </div>
          </template>
        </sdkwork-cell>
        
        <sdkwork-cell title="操作" :theme-mode="themeMode">
          <template #value>
            <div class="result-actions">
              <van-button 
                type="primary" 
                size="small" 
                @click="playResult"
                :loading="playing"
              >
                播放
              </van-button>
              <van-button 
                type="default" 
                size="small" 
                @click="downloadResult"
              >
                下载
              </van-button>
            </div>
          </template>
        </sdkwork-cell>
      </sdkwork-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import SdkworkVoiceSynthesis from '@/components/sdkwork-voice-synthesis/sdkwork-voice-synthesis.vue'
import type { VoiceSpeakerVO } from '@/services'
import type { SynthesisData, SynthesisResult } from '@/components/sdkwork-voice-synthesis/types'
definePage({
    meta: {
        title: '语音合成' 
    }
})
// 主题模式
const themeMode = ref<'light' | 'dark' | 'auto'>('auto')

// 默认文本
const defaultText = ref('欢迎使用语音合成功能，请输入您想要转换的文本内容。')

// 默认发音人
const defaultSpeaker = ref<VoiceSpeakerVO | null>(null)

// 合成结果
const synthesisResult = ref<SynthesisResult | null>(null)

// 播放状态
const playing = ref(false)

// 音频播放器
const audioPlayer = ref<HTMLAudioElement | null>(null)

// 处理合成开始
const handleSynthesisStart = (data: SynthesisData) => {
  console.log('合成开始:', data)
  synthesisResult.value = null
}

// 处理合成完成
const handleSynthesisComplete = (result: SynthesisResult) => {
  console.log('合成完成:', result)
  synthesisResult.value = result
  showToast('语音合成完成')
}

// 处理合成错误
const handleSynthesisError = (error: Error) => {
  console.error('合成错误:', error)
  showToast('合成失败，请重试')
}

// 处理发音人变更
const handleSpeakerChange = (speaker: VoiceSpeakerVO) => {
  console.log('发音人变更:', speaker)
  defaultSpeaker.value = speaker
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 播放合成结果
const playResult = async () => {
  if (!synthesisResult.value) return
  
  playing.value = true
  
  try {
    if (!audioPlayer.value) {
      audioPlayer.value = new Audio()
    }
    
    audioPlayer.value.src = synthesisResult.value.audioUrl
    await audioPlayer.value.play()
    
    // 监听播放结束
    audioPlayer.value.onended = () => {
      playing.value = false
    }
    
    audioPlayer.value.onerror = () => {
      playing.value = false
      showToast('播放失败')
    }
  } catch (error) {
    console.error('播放失败:', error)
    playing.value = false
    showToast('播放失败')
  }
}

// 下载合成结果
const downloadResult = () => {
  if (!synthesisResult.value) return
  
  try {
    const link = document.createElement('a')
    link.href = synthesisResult.value.audioUrl
    link.download = `synthesis-result.${synthesisResult.value.audioUrl.split('.').pop() || 'mp3'}`
    link.click()
    showToast('开始下载')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败')
  }
}
</script>

<style scoped>
.voice-synthesis-page {
   height: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px 0;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.result-section {
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.duration,
.file-size {
  font-size: 12px;
  color: #666;
}

.result-actions {
  display: flex;
  gap: 8px;
}

/* 暗色主题支持 */
:global(.theme-dark) .voice-synthesis-page {
  background: #1a1a1a;
}

:global(.theme-dark) .page-title {
  color: #fff;
}

:global(.theme-dark) .page-description {
  color: #999;
}

:global(.theme-dark) .result-section {
  background: #2a2a2a;
}

/* 响应式设计 */
@media (max-width: 768px) { 
  
  .page-title {
    font-size: 20px;
  }
  
  .result-actions {
    flex-direction: column;
    gap: 6px;
  }
  
  .result-actions .van-button {
    width: 100%;
  }
}
</style>