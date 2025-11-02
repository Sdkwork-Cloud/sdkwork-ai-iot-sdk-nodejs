<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { showToast, showDialog } from 'vant'
import { Icon } from '@iconify/vue' 
import SdkworkVoiceCloneRecord from './sdkwork-voice-clone-record.vue'
import SdkworkVoiceClonePreview from './sdkwork-voice-clone-preview.vue'

interface Props {
  // 朗读文本
  text?: string
  // 是否显示上传功能
  uploadable?: boolean
  // 是否显示录制功能
  recordable?: boolean
  // 音频文件类型限制
  accept?: string
  // 最大文件大小（MB）
  maxSize?: number
  // 是否禁用
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '请朗读这段文字：欢迎使用语音克隆功能，请清晰地朗读这段文字。',
  uploadable: true,
  recordable: true,
  accept: 'audio/*',
  maxSize: 10,
  disabled: false
})

const emit = defineEmits<{
  // 音频上传事件
  upload: [file: File]
  // 音频录制完成事件
  record: [audioBlob: Blob | ArrayBuffer]
  // 克隆开始事件
  clone: []
  // 音色保存事件
  save: [voiceName: string, audioData?: Blob | string]
}>()

// 状态管理
const currentView = ref<'record' | 'preview'>('record')
const audioData = ref<Blob | ArrayBuffer | string | null | any>(null)

// 切换到预览界面
const switchToPreview = (data?: Blob | ArrayBuffer | string) => {
  if (data) {
    audioData.value = data
  }
  currentView.value = 'preview'
}

// 切换回录制界面
const switchToRecord = () => {
  currentView.value = 'record'
  audioData.value = null
}

// 处理音色保存
const handleSaveVoice = (voiceName: string, audioData?: Blob | string) => {
  emit('save', voiceName, audioData)
  showToast('音色保存成功')
}

// 处理音频上传
const handleUpload = (file: File) => {
  emit('upload', file)
  switchToPreview(file)
}

// 处理音频录制完成
const handleRecord = (audioBlob: Blob | ArrayBuffer) => {
  emit('record', audioBlob)
  switchToPreview(audioBlob)
}

// 组件卸载时清理
onUnmounted(() => {
  if (audioData.value && typeof audioData.value === 'string') {
    URL.revokeObjectURL(audioData.value)
  }
})
</script>

<template>
  <div class="sdkwork-voice-clone">
    <!-- 录制界面 -->
    <SdkworkVoiceCloneRecord v-if="currentView === 'record'" :text="text" :uploadable="uploadable"
      :recordable="recordable" :accept="accept" :max-size="maxSize" :disabled="disabled" @upload="handleUpload"
      @record="handleRecord" @clone="$emit('clone')" />

    <!-- 预览界面 -->
    <SdkworkVoiceClonePreview v-else :audio-data="audioData" @save="handleSaveVoice" @back="switchToRecord" />
  </div>
</template>

<style scoped>
.sdkwork-voice-clone { 
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 0px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(74, 144, 226, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.sdkwork-voice-clone::before {
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

/* 操作提示区域 */
.instruction-section {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.instruction-text {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
  letter-spacing: 0.5px;
}

.instruction-tip {
  font-size: 14px;
  color: rgba(113, 113, 113, 0.8);
  line-height: 1.6;
  font-style: italic;
  text-shadow: 0 0 10px rgba(67, 68, 68, 0.5);
}

/* 文本区域 - 占比更大 */
.text-section {
  flex: 1;
  width: 100%;
  min-height: 360px;
  max-height: 420px;
  margin-bottom: 30px;
}

.text-content {
  padding: 25px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 18px;
  line-height: 1.8;
  font-weight: 500;
}

.text-wrapper {
  line-height: 1.8;
  color: #2d3748;
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 500;
}

.text-tip {
  font-size: 14px;
  color: #718096;
  font-style: italic;
}

/* 底部操作区域 */
.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
}

/* 操作行 */
.action-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

/* 录制提示区域 */
.record-tip-section {
  text-align: center;
  margin-bottom: 10px;
}

.record-tip {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

/* 录制功能区域 - 底部居中 */
.record-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.record-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  font-size: 24px;
  margin-bottom: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(74, 144, 226, 0.4);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #4a90e2, #6c5ce7);
}

.record-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4),
    0 3px 12px rgba(74, 144, 226, 0.6);
}

.record-btn.recording {
  animation: pulse 1.5s infinite;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.record-time {
  font-size: 14px;
  font-weight: 600;
  margin-left: 4px;
}

/* 上传音频区域 */
.upload-section {
  display: flex;
  align-items: center;
}

.upload-btn {
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* 克隆操作区域 */
.clone-section {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}

.clone-btn {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}

.clone-tip {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(244, 67, 54, 0.4);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-voice-clone { 
    min-height: 350px;
  }

  .record-btn {
    width: 70px;
    height: 70px;
    font-size: 20px;
  }

  .text-wrapper {
    font-size: 13px;
  }
}

.van-icon {
  margin-right: 6px;
}
</style>