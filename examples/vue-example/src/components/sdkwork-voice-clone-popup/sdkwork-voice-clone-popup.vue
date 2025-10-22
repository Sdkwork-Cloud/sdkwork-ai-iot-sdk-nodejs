<template>
  <sdkwork-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: height }"
    round
    :close-on-click-overlay="false"
  >
    <div class="voice-clone-popup">
      <!-- 头部标题栏 -->
      <div class="popup-header">
        <div class="header-content">
          <h3 class="popup-title">{{ title }}</h3>
          <!-- 右上角关闭图标 -->
          <van-icon name="cross" class="close-icon" @click="handleClose" />
        </div>
      </div>

      <!-- 语音克隆内容 -->
      <div class="popup-content">
        <SdkworkVoiceClone
          :text="text"
          :uploadable="uploadable"
          :recordable="recordable"
          :accept="accept"
          :max-size="maxSize"
          :disabled="disabled"
          @upload="handleUpload"
          @record="handleRecord"
          @clone="handleClone"
        />
      </div> 
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SdkworkVoiceClone from '@/components/sdkwork-voice-clone/sdkwork-voice-clone.vue'

// Props 定义
interface Props {
  modelValue?: boolean
  title?: string
  height?: string
  confirmText?: string
  text?: string
  uploadable?: boolean
  recordable?: boolean
  accept?: string
  maxSize?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '语音克隆',
  height: '100dvh',
  confirmText: '开始克隆',
  text: '请朗读这段文字：欢迎使用语音克隆功能，请清晰地朗读这段文字。',
  uploadable: true,
  recordable: true,
  accept: 'audio/*',
  maxSize: 10,
  disabled: false
})

// Emits 定义
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', audioFile?: File, audioBlob?: Blob): void
  (e: 'close'): void
  (e: 'upload', file: File): void
  (e: 'record', audioBlob: Blob): void
  (e: 'clone'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const visible = ref(props.modelValue)
const currentAudioFile = ref<File | null>(null)
const currentAudioBlob = ref<Blob | null>(null)

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听 visible 变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 处理确认克隆
const handleConfirm = () => {
  if (currentAudioFile.value || currentAudioBlob.value) {
    emit('confirm', currentAudioFile.value || undefined, currentAudioBlob.value || undefined)
    visible.value = false
  }
}

// 处理关闭
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 处理音频上传
const handleUpload = (file: File) => {
  currentAudioFile.value = file
  currentAudioBlob.value = null
  emit('upload', file)
}

// 处理音频录制
const handleRecord = (audioBlob: Blob) => {
  currentAudioBlob.value = audioBlob
  currentAudioFile.value = null
  emit('record', audioBlob)
}

// 处理克隆开始
const handleClone = () => {
  emit('clone')
}
</script>

<style scoped>
.voice-clone-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
}

.voice-clone-popup::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(108, 92, 231, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.popup-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
  letter-spacing: 0.5px;
}

.close-icon {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.close-icon:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.popup-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.confirm-btn {
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #4a90e2, #6c5ce7);
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3),
              0 2px 8px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
  color: #ffffff;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4),
              0 3px 12px rgba(74, 144, 226, 0.6);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .popup-header {
    padding: 16px;
  }
  
  .popup-title {
    font-size: 16px;
  }
  
  .popup-footer {
    padding: 16px;
  }
  
  .popup-content {
    padding: 0;
  }
}
</style>