<template>
  <div class="sdkwork-speech-to-text">
    <!-- 语音识别主界面 -->
    <div class="stt-container">
      <!-- 识别结果区域 -->
      <div class="result-section">
        <div class="section-header">
          <h3 class="section-title">识别结果</h3>
          <div class="result-actions">
            <van-button 
              type="default" 
              size="small" 
              @click="clearResult"
              :disabled="!resultText"
              class="clear-btn"
            >
              清空
            </van-button>
            <van-button 
              type="primary" 
              size="small" 
              @click="copyResult"
              :disabled="!resultText"
              class="copy-btn"
            >
              复制
            </van-button>
          </div>
        </div>
        
        <div class="result-content">
          <van-field
            v-model="resultText"
            type="textarea"
            rows="6"
            placeholder="识别结果将显示在这里..."
            readonly
            class="result-textarea"
          />
          
          <!-- 识别状态指示器 -->
          <div class="recognition-status">
            <div class="status-indicator" :class="{ active: isListening, error: recognitionError }">
              <van-icon 
                :name="recognitionError ? 'warning' : isListening ? 'volume' : 'volume-o'" 
                class="status-icon"
              />
              <span class="status-text">
                {{ recognitionError ? '识别错误' : isListening ? '正在识别中...' : '等待语音输入' }}
              </span>
            </div>
            
            <!-- 实时音量指示器 -->
            <div class="volume-indicator" v-if="isListening">
              <div class="volume-bars">
                <div 
                  v-for="i in 5" 
                  :key="i" 
                  class="volume-bar"
                  :class="{ active: i <= currentVolumeLevel }"
                ></div>
              </div>
              <span class="volume-text">音量: {{ currentVolumeLevel * 20 }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 语音控制区域 -->
      <div class="control-section">
        <div class="section-header">
          <h3 class="section-title">语音控制</h3>
        </div>
        
        <div class="control-buttons">
          <!-- 开始/停止识别按钮 -->
          <van-button
            :type="isListening ? 'danger' : 'primary'"
            size="large"
            :loading="isLoading"
            @click="toggleRecognition"
            class="recognition-btn"
          >
            <van-icon :name="isListening ? 'pause' : 'play'" />
            {{ isListening ? '停止识别' : '开始识别' }}
          </van-button>
          
          <!-- 录音控制 -->
          <div class="recording-controls" v-if="isListening">
            <van-button
              type="warning"
              size="small"
              @click="pauseRecognition"
              :disabled="!isListening || isPaused"
              class="pause-btn"
            >
              <van-icon name="pause" />
              暂停
            </van-button>
            
            <van-button
              type="success"
              size="small"
              @click="resumeRecognition"
              :disabled="!isPaused"
              class="resume-btn"
            >
              <van-icon name="play" />
              继续
            </van-button>
          </div>
        </div>
        
        <!-- 录音时长 -->
        <div class="recording-info" v-if="isListening">
          <div class="recording-time">
            <van-icon name="clock" />
            录音时长: {{ formatTime(recordingTime) }}
          </div>
          <div class="recording-size">
            <van-icon name="graph" />
            识别字数: {{ resultText.length }}
          </div>
        </div>
      </div>

      <!-- 识别设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h3 class="section-title">识别设置</h3>
        </div>
        
        <sdkwork-cell-group>
          <!-- 语言选择 -->
          <sdkwork-cell title="识别语言" center is-link @click="showLanguagePopup = true">
            <template #value>
              <div class="selected-language">
                <van-icon name="globe" />
                {{ selectedLanguage.name }}
              </div>
            </template>
          </sdkwork-cell>
          
          <!-- 识别模式 -->
          <sdkwork-cell title="识别模式" center>
            <template #value>
              <van-radio-group v-model="recognitionMode" direction="horizontal">
                <van-radio name="continuous">连续识别</van-radio>
                <van-radio name="single">单次识别</van-radio>
              </van-radio-group>
            </template>
          </sdkwork-cell>
          
          <!-- 自动标点 -->
          <sdkwork-cell title="自动标点" center>
            <template #value>
              <van-switch v-model="autoPunctuation" size="20" />
            </template>
          </sdkwork-cell>
          
          <!-- 静音检测 -->
          <sdkwork-cell title="静音检测" center>
            <template #value>
              <van-switch v-model="silenceDetection" size="20" />
            </template>
          </sdkwork-cell>
          
          <!-- 静音阈值 -->
          <sdkwork-cell title="静音阈值" center v-if="silenceDetection">
            <template #value>
              <van-slider 
                v-model="silenceThreshold" 
                :min="1" 
                :max="10" 
                :step="1"
                class="threshold-slider"
              >
                <template #button>
                  <div class="slider-value">{{ silenceThreshold }}秒</div>
                </template>
              </van-slider>
            </template>
          </sdkwork-cell>
        </sdkwork-cell-group>
      </div>
    </div>

    <!-- 语言选择弹窗 -->
    <sdkwork-popup 
      v-model:show="showLanguagePopup" 
      position="bottom"
      round
      class="language-popup"
    >
      <div class="popup-header">
        <h3 class="popup-title">选择识别语言</h3>
        <van-button type="primary" size="small" @click="showLanguagePopup = false">
          确定
        </van-button>
      </div>
      
      <van-radio-group v-model="selectedLanguage.code">
        <sdkwork-cell-group>
          <sdkwork-cell
            v-for="language in supportedLanguages"
            :key="language.code"
            :title="language.name"
            clickable
            @click="selectLanguage(language)"
          >
            <template #right-icon>
              <van-radio :name="language.code" />
            </template>
          </sdkwork-cell>
        </sdkwork-cell-group>
      </van-radio-group>
    </sdkwork-popup>

    <!-- 识别历史 -->
    <div class="history-section" v-if="recognitionHistory.length > 0">
      <div class="section-header">
        <h3 class="section-title">识别历史</h3>
        <van-button 
          type="default" 
          size="small" 
          @click="clearHistory"
          class="clear-history-btn"
        >
          清空历史
        </van-button>
      </div>
      
      <div class="history-list">
        <sdkwork-cell
          v-for="(item, index) in recognitionHistory.slice(0, 5)"
          :key="index"
          :title="formatTime(item.timestamp)"
          :value="item.text.substring(0, 50) + (item.text.length > 50 ? '...' : '')"
          clickable
          @click="loadHistoryItem(item)"
        >
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </sdkwork-cell>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useSpeechRecognition } from '@vueuse/core'
import { showToast, showConfirmDialog } from 'vant'

// 事件定义
const emit = defineEmits<{
  'recognition-start': []
  'recognition-stop': [result: string]
  'recognition-error': [error: Error]
  'recognition-complete': [result: string]
}>()

// 响应式数据
const resultText = ref('')
const isListening = ref(false)
const isPaused = ref(false)
const isLoading = ref(false)
const recognitionError = ref('')
const recordingTime = ref(0)
const currentVolumeLevel = ref(0)

// 识别设置
const selectedLanguage = ref({ code: 'zh-CN', name: '中文（普通话）' })
const recognitionMode = ref<'continuous' | 'single'>('continuous')
const autoPunctuation = ref(true)
const silenceDetection = ref(true)
const silenceThreshold = ref(3)

// UI状态
const showLanguagePopup = ref(false)
const recognitionHistory = ref<Array<{ text: string; timestamp: number }>>([])

// 支持的语言列表
const supportedLanguages = [
  { code: 'zh-CN', name: '中文（普通话）' },
  { code: 'zh-TW', name: '中文（台湾）' },
  { code: 'zh-HK', name: '中文（香港）' },
  { code: 'en-US', name: '英语（美国）' },
  { code: 'en-GB', name: '英语（英国）' },
  { code: 'ja-JP', name: '日语' },
  { code: 'ko-KR', name: '韩语' },
  { code: 'fr-FR', name: '法语' },
  { code: 'de-DE', name: '德语' },
  { code: 'es-ES', name: '西班牙语' }
]

// 使用VueUse的语音识别
const {
  isSupported,
  isListening: vueuseListening,
  isFinal,
  result,
  error,
  start,
  stop
} = useSpeechRecognition({
  continuous: computed(() => recognitionMode.value === 'continuous').value as any
})

// 计时器
let recordingTimer: number | null = null
let volumeUpdateTimer: number | null = null

// 计算属性
const isSpeechSupported = computed(() => {
  if (!isSupported) {
    showToast('您的浏览器不支持语音识别功能')
    return false
  }
  return true
})

// 方法
const toggleRecognition = async () => {
  if (!isSpeechSupported.value) return
  
  if (isListening.value) {
    await stopRecognition()
  } else {
    await startRecognition()
  }
}

const startRecognition = async () => {
  try {
    isLoading.value = true
    recognitionError.value = ''
    
    // 重置录音时间
    recordingTime.value = 0
    
    // 开始语音识别
    await start()
    
    isListening.value = true
    isPaused.value = false
    
    // 开始计时
    startRecordingTimer()
    
    // 开始音量检测
    startVolumeDetection()
    
    emit('recognition-start')
    showToast('开始语音识别')
    
  } catch (err) {
    console.error('语音识别启动失败:', err)
    recognitionError.value = '语音识别启动失败'
    emit('recognition-error', err as Error)
    showToast('语音识别启动失败')
  } finally {
    isLoading.value = false
  }
}

const stopRecognition = async () => {
  try {
    await stop()
    
    isListening.value = false
    isPaused.value = false
    
    // 停止计时和音量检测
    stopRecordingTimer()
    stopVolumeDetection()
    
    // 保存到历史记录
    if (resultText.value.trim()) {
      saveToHistory()
    }
    
    emit('recognition-stop', resultText.value)
    emit('recognition-complete', resultText.value)
    showToast('语音识别已停止')
    
  } catch (err) {
    console.error('停止语音识别失败:', err)
    recognitionError.value = '停止语音识别失败'
    emit('recognition-error', err as Error)
  }
}

const pauseRecognition = () => {
  isPaused.value = true
  stopRecordingTimer()
  stopVolumeDetection()
  showToast('语音识别已暂停')
}

const resumeRecognition = () => {
  isPaused.value = false
  startRecordingTimer()
  startVolumeDetection()
  showToast('语音识别已继续')
}

const clearResult = () => {
  resultText.value = ''
  showToast('已清空识别结果')
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(resultText.value)
    showToast('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    showToast('复制失败')
  }
}

const selectLanguage = (language: any) => {
  selectedLanguage.value = language
  showLanguagePopup.value = false
  showToast(`已切换到${language.name}`)
}

const clearHistory = async () => {
  try {
    await showConfirmDialog({
      title: '确认清空',
      message: '确定要清空所有识别历史记录吗？'
    })
    
    recognitionHistory.value = []
    showToast('历史记录已清空')
  } catch {
    // 用户取消操作
  }
}

const loadHistoryItem = (item: any) => {
  resultText.value = item.text
  showToast('已加载历史记录')
}

// 计时器相关方法
const startRecordingTimer = () => {
  recordingTimer = window.setInterval(() => {
    recordingTime.value++
  }, 1000)
}

const stopRecordingTimer = () => {
  if (recordingTimer) {
    clearInterval(recordingTimer)
    recordingTimer = null
  }
}

const startVolumeDetection = () => {
  // 模拟音量检测（实际项目中应该使用真实的音频分析）
  volumeUpdateTimer = window.setInterval(() => {
    currentVolumeLevel.value = Math.floor(Math.random() * 5) + 1
  }, 200)
}

const stopVolumeDetection = () => {
  if (volumeUpdateTimer) {
    clearInterval(volumeUpdateTimer)
    volumeUpdateTimer = null
  }
  currentVolumeLevel.value = 0
}

const saveToHistory = () => {
  recognitionHistory.value.unshift({
    text: resultText.value,
    timestamp: Date.now()
  })
  
  // 限制历史记录数量
  if (recognitionHistory.value.length > 50) {
    recognitionHistory.value = recognitionHistory.value.slice(0, 50)
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 监听语音识别结果
watch(result, (newResult) => {
  if (newResult) {
    resultText.value = newResult
    
    // 如果是最终结果且是单次识别模式，自动停止
    if (isFinal && recognitionMode.value === 'single') {
      stopRecognition()
    }
  }
})

// 监听错误
watch(error, (newError) => {
  if (newError) {
    recognitionError.value = newError.message 
    showToast(`识别错误: ${newError.message}`)
  }
})

// 生命周期
onMounted(() => {
  // 检查浏览器支持情况
  if (!isSpeechSupported.value) {
    showToast('您的浏览器不支持语音识别功能')
  }
})

onUnmounted(() => {
  // 清理资源
  stopRecordingTimer()
  stopVolumeDetection()
  if (isListening.value) {
    stop()
  }
})
</script>

<style scoped lang="scss">
.sdkwork-speech-to-text {
  padding: 16px;
  
  .stt-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 8px;
    border-bottom: 1px solid var(--van-border-color);
    
    .section-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--van-text-color);
    }
    
    .result-actions {
      display: flex;
      gap: 8px;
    }
  }
  
  .result-section {
    .result-content {
      padding: 16px;
      
      .result-textarea {
        :deep(.van-field__control) {
          font-size: 14px;
          line-height: 1.5;
          min-height: 120px;
        }
      }
      
      .recognition-status {
        margin-top: 16px;
        padding: 12px;
        background: var(--van-background-2);
        border-radius: 8px;
        
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          
          &.active {
            color: var(--van-primary-color);
          }
          
          &.error {
            color: var(--van-danger-color);
          }
          
          .status-icon {
            font-size: 18px;
          }
          
          .status-text {
            font-size: 14px;
            font-weight: 500;
          }
        }
        
        .volume-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .volume-bars {
            display: flex;
            align-items: end;
            gap: 2px;
            height: 20px;
            
            .volume-bar {
              width: 4px;
              background: var(--van-gray-4);
              border-radius: 2px;
              transition: all 0.2s ease;
              
              &.active {
                background: var(--van-primary-color);
              }
              
              &:nth-child(1) { height: 4px; }
              &:nth-child(2) { height: 8px; }
              &:nth-child(3) { height: 12px; }
              &:nth-child(4) { height: 16px; }
              &:nth-child(5) { height: 20px; }
            }
          }
          
          .volume-text {
            font-size: 12px;
            color: var(--van-text-color-2);
          }
        }
      }
    }
  }
  
  .control-section {
    .control-buttons {
      padding: 16px;
      text-align: center;
      
      .recognition-btn {
        min-width: 140px;
        margin-bottom: 12px;
        
        :deep(.van-icon) {
          margin-right: 6px;
        }
      }
      
      .recording-controls {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 12px;
      }
    }
    
    .recording-info {
      display: flex;
      justify-content: space-around;
      padding: 12px 16px;
      background: var(--van-background-2);
      border-top: 1px solid var(--van-border-color);
      
      .recording-time,
      .recording-size {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--van-text-color-2);
        
        .van-icon {
          font-size: 14px;
        }
      }
    }
  }
  
  .settings-section {
    .selected-language {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--van-text-color-2);
      
      .van-icon {
        font-size: 16px;
      }
    }
    
    .threshold-slider {
      :deep(.van-slider__button) {
        width: 24px;
        height: 24px;
        
        .slider-value {
          font-size: 10px;
          line-height: 24px;
        }
      }
    }
  }
  
  .history-section {
    margin-top: 16px;
    
    .history-list {
      .sdkwork-cell {
        :deep(.sdkwork-cell__value) {
          color: var(--van-text-color-2);
          font-size: 13px;
        }
      }
    }
  }
  
  .language-popup {
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--van-border-color);
      
      .popup-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .sdkwork-cell-group {
      max-height: 60vh;
      overflow-y: auto;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-speech-to-text {
    padding: 12px;
    
    .stt-container {
      border-radius: 8px;
    }
    
    .section-header {
      padding: 12px 12px 6px;
      
      .section-title {
        font-size: 15px;
      }
    }
    
    .result-section .result-content {
      padding: 12px;
    }
    
    .control-section .control-buttons {
      padding: 12px;
    }
  }
}
</style>