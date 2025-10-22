<template>
  <div class="sdkwork-text-to-speech">
    <!-- 语音合成主界面 -->
    <div class="tts-container">
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="section-header">
          <h3 class="section-title">文本输入</h3>
          <div class="text-counter">
            {{ text.length }}/{{ maxTextLength }}
          </div>
        </div>
        
        <van-field
          v-model="text"
          type="textarea"
          rows="4"
          placeholder="请输入要合成的文本内容..."
          :maxlength="maxTextLength"
          show-word-limit
          class="text-input"
        />
      </div>

      <!-- 发音人选择 -->
      <div class="speaker-section">
        <div class="section-header">
          <h3 class="section-title">发音人选择</h3>
          <van-button 
            type="primary" 
            size="small" 
            @click="showVoicePopup = true"
            class="select-btn"
          >
            选择发音人
          </van-button>
        </div>
        
        <div class="selected-speaker" v-if="selectedSpeaker">
          <div class="speaker-info">
            <van-icon name="music" class="speaker-icon" />
            <div class="speaker-details">
              <div class="speaker-name">{{ selectedSpeaker.name }}</div>
              <div class="speaker-meta">
                <van-tag v-if="selectedSpeaker.gender" >{{ selectedSpeaker.gender === 'female' ? '女声' : '男声' }}</van-tag>
                <van-tag v-if="selectedSpeaker.language" >{{ selectedSpeaker.language }}</van-tag>
              </div>
            </div>
          </div>
          <van-button 
            type="default" 
            size="small" 
            @click="previewSpeaker"
            class="preview-btn"
          >
            试听
          </van-button>
        </div>
        
        <div class="no-speaker" v-else>
          <van-empty description="请选择发音人" image="search">
            <van-button type="primary" size="small" @click="showVoicePopup = true">
              选择发音人
            </van-button>
          </van-empty>
        </div>
      </div>

      <!-- 合成设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h3 class="section-title">合成设置</h3>
        </div>
        
        <sdkwork-cell-group>
          <sdkwork-cell title="语速" center>
            <template #value>
              <van-slider 
                v-model="speed" 
                :min="0.5" 
                :max="2" 
                :step="0.1"
                class="speed-slider"
              >
                <template #button>
                  <div class="slider-value">{{ speed.toFixed(1) }}x</div>
                </template>
              </van-slider>
            </template>
          </sdkwork-cell>
          
          <sdkwork-cell title="音量" center>
            <template #value>
              <van-slider 
                v-model="volume" 
                :min="0" 
                :max="100" 
                :step="1"
                class="volume-slider"
              >
                <template #button>
                  <div class="slider-value">{{ volume }}%</div>
                </template>
              </van-slider>
            </template>
          </sdkwork-cell>
          
          <sdkwork-cell title="音调" center>
            <template #value>
              <van-slider 
                v-model="pitch" 
                :min="-12" 
                :max="12" 
                :step="1"
                class="pitch-slider"
              >
                <template #button>
                  <div class="slider-value">{{ pitch > 0 ? '+' : '' }}{{ pitch }}</div>
                </template>
              </van-slider>
            </template>
          </sdkwork-cell>
        </sdkwork-cell-group>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <van-button 
          type="primary" 
          size="large" 
          block
          @click="synthesizeSpeech"
          :disabled="!canSynthesize"
          :loading="isSynthesizing"
          class="synthesize-btn"
        >
          <template #loading>
            <van-loading type="spinner" size="20px" />
            合成中...
          </template>
          <template #default>
            <van-icon name="play" class="btn-icon" />
            开始合成
          </template>
        </van-button>
        
        <van-button 
          type="default" 
          size="large" 
          block
          @click="stopPlayback"
          :disabled="!isPlaying"
          class="stop-btn"
        >
          <van-icon name="pause" class="btn-icon" />
          停止播放
        </van-button>
      </div>

      <!-- 播放控制 -->
      <div class="playback-section" v-if="audioUrl">
        <div class="section-header">
          <h3 class="section-title">播放控制</h3>
          <van-button 
            type="success" 
            size="small" 
            @click="downloadAudio"
            class="download-btn"
          >
            <van-icon name="down" class="btn-icon" />
            下载
          </van-button>
        </div>
        
        <div class="audio-player">
          <audio 
            ref="audioElement" 
            :src="audioUrl" 
            controls
            class="audio-element"
            @play="handlePlay"
            @pause="handlePause"
            @ended="handleEnded"
          ></audio>
          
          <div class="playback-info">
            <div class="info-item">
              <span class="info-label">文件大小:</span>
              <span class="info-value">{{ formatFileSize(audioSize) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">合成时间:</span>
              <span class="info-value">{{ synthesisTime }}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发音人选择弹出层 -->
    <SdkworkVoiceListPopup
      v-model="showVoicePopup"
      title="选择发音人"
      height="70vh"
      :selected-speaker-id="selectedSpeaker?.id"
      @confirm="handleVoiceConfirm"
      @close="showVoicePopup = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { showToast } from 'vant' 
import SdkworkVoiceListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'
import { VoiceSpeakerVO } from '@/services'

// 事件定义
interface Emits {
  (e: 'synthesis-complete', data: SynthesisResult): void
  (e: 'synthesis-error', error: any): void
  (e: 'speaker-selected', speaker: VoiceSpeakerVO): void
  (e: 'playback-started'): void
  (e: 'playback-stopped'): void
}

const emit = defineEmits<Emits>()

// 类型定义
interface SynthesisResult {
  audioUrl: string
  audioSize: number
  synthesisTime: number
  text: string
  speaker: VoiceSpeakerVO
  settings: SynthesisSettings
}

interface SynthesisSettings {
  speed: number
  volume: number
  pitch: number
}

// 响应式数据
const text = ref('')
const maxTextLength = ref(1000)
const selectedSpeaker = ref<VoiceSpeakerVO | null>(null)
const showVoicePopup = ref(false)

// 合成参数
const speed = ref(1.0)
const volume = ref(80)
const pitch = ref(0)

// 合成状态
const isSynthesizing = ref(false)
const isPlaying = ref(false)
const audioUrl = ref('')
const audioSize = ref(0)
const synthesisTime = ref(0)

// DOM 引用
const audioElement = ref<HTMLAudioElement | null>(null)

// 计算属性
const canSynthesize = computed(() => {
  return text.value.trim().length > 0 && selectedSpeaker.value !== null
})

/**
 * 处理发音人确认
 */
const handleVoiceConfirm = (speaker: VoiceSpeakerVO) => {
  selectedSpeaker.value = speaker
  showVoicePopup.value = false
  showToast(`已选择发音人: ${speaker.name}`)
  emit('speaker-selected', speaker)
}

/**
 * 试听发音人
 */
const previewSpeaker = async () => {
  if (!selectedSpeaker.value) {
    showToast('请先选择发音人')
    return
  }

  try {
    // 使用默认文本进行试听
    const previewText = '欢迎使用语音合成服务，这是发音人试听效果。'
    await synthesizeText(previewText, true)
  } catch (error) {
    console.error('试听失败:', error)
    showToast('试听失败，请重试')
  }
}

/**
 * 开始语音合成
 */
const synthesizeSpeech = async () => {
  if (!canSynthesize.value) {
    showToast('请输入文本并选择发音人')
    return
  }

  try {
    await synthesizeText(text.value, false)
  } catch (error) {
    console.error('合成失败:', error)
    showToast('合成失败，请重试')
  }
}

/**
 * 合成文本
 */
const synthesizeText = async (content: string, isPreview: boolean = false) => {
  isSynthesizing.value = true
  
  try {
    const startTime = Date.now()
    
    // 模拟合成过程 - 实际应该调用语音合成API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟合成结果
    const mockAudioUrl = `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LMeSw=`
    const mockSize = Math.floor(Math.random() * 50000) + 10000
    
    audioUrl.value = mockAudioUrl
    audioSize.value = mockSize
    synthesisTime.value = Date.now() - startTime
    
    if (isPreview) {
      showToast('试听播放中...')
    } else {
      showToast('合成完成，开始播放')
      
      // 触发合成完成事件
      const result: SynthesisResult = {
        audioUrl: mockAudioUrl,
        audioSize: mockSize,
        synthesisTime: synthesisTime.value,
        text: content,
        speaker: selectedSpeaker.value!,
        settings: {
          speed: speed.value,
          volume: volume.value,
          pitch: pitch.value
        }
      }
      emit('synthesis-complete', result)
    }
    
    // 自动播放
    setTimeout(() => {
      if (audioElement.value) {
        audioElement.value.play()
      }
    }, 100)
    
  } catch (error) {
    emit('synthesis-error', error)
    throw error
  } finally {
    isSynthesizing.value = false
  }
}

/**
 * 停止播放
 */
const stopPlayback = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
  }
  isPlaying.value = false
}

/**
 * 处理播放开始
 */
const handlePlay = () => {
  isPlaying.value = true
}

/**
 * 处理播放暂停
 */
const handlePause = () => {
  isPlaying.value = false
}

/**
 * 处理播放结束
 */
const handleEnded = () => {
  isPlaying.value = false
}

/**
 * 下载音频文件
 */
const downloadAudio = () => {
  if (!audioUrl.value) {
    showToast('没有可下载的音频文件')
    return
  }

  try {
    // 创建下载链接
    const link = document.createElement('a')
    link.href = audioUrl.value
    link.download = `语音合成_${Date.now()}.wav`
    link.style.display = 'none'
    
    // 添加到文档并触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    showToast('音频文件下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    showToast('下载失败，请重试')
  }
}

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 组件卸载时清理资源
onUnmounted(() => {
  stopPlayback()
  if (audioUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(audioUrl.value)
  }
})
</script>

<style scoped lang="scss">
.sdkwork-text-to-speech {
  padding: 16px;
  
  .tts-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--van-text-color);
      margin: 0;
    }
    
    .text-counter {
      font-size: 12px;
      color: var(--van-gray-6);
    }
  }
  
  .input-section {
    margin-bottom: 24px;
    
    .text-input {
      :deep(.van-field__body) {
        border: 1px solid var(--van-border-color);
        border-radius: 8px;
        padding: 12px;
        
        textarea {
          resize: none;
          border: none;
          outline: none;
          font-size: 14px;
          line-height: 1.5;
        }
      }
    }
  }
  
  .speaker-section {
    margin-bottom: 24px;
    
    .selected-speaker {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      background: var(--van-background-2);
      border-radius: 8px;
      border: 1px solid var(--van-border-color);
      
      .speaker-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .speaker-icon {
          font-size: 24px;
          color: var(--van-primary-color);
        }
        
        .speaker-details {
          .speaker-name {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .speaker-meta {
            display: flex;
            gap: 4px;
          }
        }
      }
      
      .preview-btn {
        font-size: 12px;
      }
    }
    
    .no-speaker {
      padding: 24px 0;
    }
  }
  
  .settings-section {
    margin-bottom: 24px;
    
    :deep(.sdkwork-cell) {
      padding: 16px 0;
      
      .sdkwork-cell__title {
        flex: none;
        width: 60px;
      }
      
      .sdkwork-cell__value {
        flex: 1;
        padding: 0 16px;
      }
    }
    
    .slider-value {
      background: var(--van-primary-color);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      min-width: 30px;
      text-align: center;
    }
  }
  
  .action-section {
    margin-bottom: 24px;
    
    .synthesize-btn, .stop-btn {
      margin-bottom: 12px;
      
      .btn-icon {
        margin-right: 6px;
      }
    }
  }
  
  .playback-section {
    .audio-player {
      .audio-element {
        width: 100%;
        margin-bottom: 12px;
      }
      
      .playback-info {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: var(--van-gray-6);
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-text-to-speech {
    padding: 12px;
    
    .section-header {
      .section-title {
        font-size: 15px;
      }
    }
    
    .selected-speaker {
      padding: 12px;
      
      .speaker-info {
        gap: 8px;
        
        .speaker-icon {
          font-size: 20px;
        }
        
        .speaker-details {
          .speaker-name {
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>