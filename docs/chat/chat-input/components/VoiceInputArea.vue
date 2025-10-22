<template>
  <div class="voice-input-area">
    <button
      class="voice-record-button"
      :class="{ recording: isRecording }"
      @mousedown="startRecording"
      @mouseup="stopRecording"
      @touchstart="startRecording"
      @touchend="stopRecording"
      type="button"
    >
      <div class="voice-icon">
        <svg v-if="!isRecording" class="mic-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        <div v-else class="recording-animation">
          <div class="pulse"></div>
          <div class="pulse delay-1"></div>
          <div class="pulse delay-2"></div>
        </div>
      </div>
      <span class="voice-text">{{ isRecording ? '松开结束' : '按住说话' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'start-recording'): void
  (e: 'stop-recording', audioBlob?: Blob): void
}

const emit = defineEmits<Emits>()

const isRecording = ref(false)
const recordingTimer = ref<any | null>(null)

const startRecording = () => {
  isRecording.value = true
  emit('start-recording')
  
  // 模拟录音超时（60秒）
  recordingTimer.value = setTimeout(() => {
    stopRecording()
  }, 60000)
}

const stopRecording = () => {
  if (recordingTimer.value) {
    clearTimeout(recordingTimer.value)
    recordingTimer.value = null
  }
  
  if (isRecording.value) {
    isRecording.value = false
    // 模拟生成音频blob（实际项目中需要真实的录音实现）
    const audioBlob = new Blob()
    emit('stop-recording', audioBlob)
  }
}

// 清理定时器
onUnmounted(() => {
  if (recordingTimer.value) {
    clearTimeout(recordingTimer.value)
  }
})
</script>

<style scoped lang="scss">
.voice-input-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .voice-record-button {
    width: 100%;
    height: 44px;
    border: 2px solid #e0e0e0;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #07c160;
      background: #f7fff7;
    }
    
    &.recording {
      border-color: #07c160;
      background: #07c160;
      
      .voice-text {
        color: white;
      }
    }
    
    .voice-icon {
      position: relative;
      width: 24px;
      height: 24px;
      
      .mic-icon {
        width: 24px;
        height: 24px;
        color: #666;
      }
      
      .recording-animation {
        position: relative;
        width: 24px;
        height: 24px;
        
        .pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid #ff4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
          opacity: 0;
          
          &.delay-1 {
            animation-delay: 0.5s;
          }
          
          &.delay-2 {
            animation-delay: 1s;
          }
        }
      }
    }
    
    .voice-text {
      font-size: 14px;
      font-weight: 500;
      color: #666;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .voice-input-area {
    .voice-record-button {
      height: 40px;
      
      .voice-icon {
        width: 20px;
        height: 20px;
        
        .mic-icon {
          width: 20px;
          height: 20px;
        }
      }
      
      .voice-text {
        font-size: 13px;
      }
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .voice-input-area {
    .voice-record-button {
      border-color: #444;
      background: #2d2d2d;
      
      &:hover {
        border-color: #07c160;
        background: #1a3d29;
      }
      
      &.recording {
        border-color: #07c160;
        background: #07c160;
      }
      
      .mic-icon {
        color: #ccc;
      }
      
      .voice-text {
        color: #ccc;
      }
    }
  }
}
</style>