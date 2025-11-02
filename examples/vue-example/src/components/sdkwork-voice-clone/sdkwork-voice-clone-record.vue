<template>
  <div class="sdkwork-voice-clone-record" :class="[currentTheme]">
    <!-- 操作提示 -->
    <div class="instruction-section">
      <div class="instruction-text">请朗读以下文字内容</div>
    </div>

    <!-- 朗读文本区域 -->
    <div class="text-section">
      <div class="instruction-tip">录制时的语气和情感也会被克隆到，请根据实际情况进行朗读</div>
      <div class="text-content">
        {{ text }}
      </div>
    </div>

    <!-- 底部操作区域 -->
    <div class="bottom-section">
      <!-- 录制提示区域 - 移到按钮上方 -->
      <div class="record-tip-section">
        <div class="record-tip" v-if="!recorderStore.isRecording">
          点击开始录制您的语音
        </div>
        <div class="record-tip" v-else>
          正在录音中... {{ recordTime }}
        </div>
      </div>

      <!-- 录制和上传功能 -->
      <div class="action-row">
        <!-- 录制功能 -->
        <div class="record-section">
          <van-button v-if="!recorderStore.isRecording" type="primary" :disabled="disabled" @click="startRecording"
            class="record-btn" round>
            <Icon icon="mdi:microphone" width="32" height="32" />
          </van-button>

          <van-button v-else type="danger" @click="stopRecording" class="record-btn recording" round>
            <Icon icon="mdi:pause-circle" width="32" height="32" />
          </van-button>
        </div>

        <!-- 上传音频按钮 -->
        <div v-if="uploadable" class="upload-section">
          <van-uploader :disabled="disabled" :after-read="handleUpload" :max-count="1" :accept="accept"
            class="audio-uploader">
            <van-button type="default" :disabled="disabled" class="upload-btn" plain>
              <Icon icon="mdi:upload" width="16" height="16" />
              上传音频
            </van-button>
          </van-uploader>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted, onMounted, watch } from 'vue'
import { showToast, showDialog } from 'vant'
import { Icon } from '@iconify/vue'
import { useRecorderStore } from '@/stores/modules/recorder/recorder'
import { RecordState } from '@/stores/modules/recorder/types'
import { useTheme } from '@/hooks/theme/useTheme' 

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
}>()

// 使用 recorder store
const recorderStore = useRecorderStore()

// 使用主题 hook
const { currentTheme, isDarkMode } = useTheme() 

// 计算属性
const recordTime = computed(() => {
  const minutes = Math.floor(recorderStore.currentDuration / 60)
  const seconds = recorderStore.currentDuration % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 监听录制状态变化
watch(() => recorderStore.currentState, (newState, oldState) => {
  if (newState === RecordState.STOPPED && oldState === RecordState.RECORDING) {
    // 录制完成，触发录制完成事件
    if (recorderStore.currentRecord?.data) {
      emit('record', recorderStore.currentRecord.data)
      showToast('录音完成')
    }
  } else if (newState === RecordState.ERROR) {
    // 录制错误
    showToast(recorderStore.errorMessage || '录制失败')
  }
})

// 处理音频上传
const handleUpload = (file: any) => {
  const fileItem = Array.isArray(file) ? file[0] : file

  // 验证文件类型
  if (!fileItem.file?.type?.startsWith('audio/')) {
    showToast('请上传音频文件')
    return false
  }

  // 验证文件大小
  if (fileItem.file?.size > props.maxSize * 1024 * 1024) {
    showToast(`文件大小不能超过${props.maxSize}MB`)
    return false
  }

  emit('upload', fileItem.file)
  showToast('音频上传成功')
  return true
}

// 开始录音
const startRecording = async () => {
  try {
    // 检查是否正在录制
    if (recorderStore.isRecording) {
      showToast('正在录制中...')
      return
    }

    // 开始录制
    await recorderStore.startRecording({
      realtime: false,
      enableWave: false,
      sampleRate: 16000,
      format: 'wav'
    })

    showToast('开始录音...')

  } catch (error) {
    showToast('无法访问麦克风，请检查权限设置')
    console.error('录音错误:', error)
  }
}

// 停止录音
const stopRecording = async () => {
  try {
    if (recorderStore.isRecording) {
      await recorderStore.stopRecording()
    }
  } catch (error) {
    showToast('停止录音失败')
    console.error('停止录音错误:', error)
  }
}

// 开始克隆
const startClone = () => {
  showDialog({
    title: '开始语音克隆',
    message: '确定要开始语音克隆吗？这可能需要一些时间。',
    showCancelButton: true,
    confirmButtonText: '开始克隆',
    cancelButtonText: '取消'
  }).then(() => {
    emit('clone')
    showToast('语音克隆已开始...')
  })
}

// 组件卸载时清理
onUnmounted(() => {
  // 如果正在录制，停止录制
  if (recorderStore.isRecording) {
    recorderStore.stopRecording()
  }
})
</script>

<style scoped>
/* 基础样式 */
.sdkwork-voice-clone-record {
  padding: 20px;
  border-radius: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sdkwork-voice-clone-record::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

/* 深色主题样式 */
.sdkwork-voice-clone-record.dark {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(74, 144, 226, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.sdkwork-voice-clone-record.dark::before {
  background: radial-gradient(circle at 20% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(108, 92, 231, 0.08) 0%, transparent 50%);
}

/* 浅色主题样式 */
.sdkwork-voice-clone-record.light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(108, 117, 125, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.sdkwork-voice-clone-record.light::before {
  background: radial-gradient(circle at 20% 80%, rgba(108, 117, 125, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(173, 181, 189, 0.04) 0%, transparent 50%);
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
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.sdkwork-voice-clone-record.dark .instruction-text {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
}

.sdkwork-voice-clone-record.light .instruction-text {
  color: #2c3e50;
  text-shadow: 0 0 20px rgba(52, 152, 219, 0.4);
}

.instruction-tip {
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
  transition: color 0.3s ease;
}

.sdkwork-voice-clone-record.dark .instruction-tip {
  color: rgba(113, 113, 113, 0.8);
  text-shadow: 0 0 10px rgba(67, 68, 68, 0.5);
}

.sdkwork-voice-clone-record.light .instruction-tip {
  color: rgba(108, 117, 125, 0.8);
  text-shadow: 0 0 10px rgba(108, 117, 125, 0.3);
}

/* 文本区域 */
.text-section {
  flex: 1;
  width: 100%;
  min-height: 360px;
  max-height: 520px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.text-content {
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  font-size: 15px;
  line-height: 1.5;
  font-weight: 500;
  min-height: 300px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sdkwork-voice-clone-record.dark .text-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.sdkwork-voice-clone-record.light .text-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
  border: 1px solid rgba(108, 117, 125, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  color: #2c3e50;
}

/* 底部操作区域 */
.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  width: 100%;
  min-height: 100px;
  flex-shrink: 0;
}

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
  font-weight: 500;
  transition: color 0.3s ease;
}

.sdkwork-voice-clone-record.dark .record-tip {
  color: #666;
}

.sdkwork-voice-clone-record.light .record-tip {
  color: #6c757d;
}

/* 录制功能区域 */
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
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.sdkwork-voice-clone-record.dark .upload-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.sdkwork-voice-clone-record.light .upload-btn {
  background: rgba(108, 117, 125, 0.1);
  border: 1px solid rgba(108, 117, 125, 0.2);
  color: #2c3e50;
}

.upload-btn:hover {
  transform: scale(1.05);
}

.sdkwork-voice-clone-record.dark .upload-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.sdkwork-voice-clone-record.light .upload-btn:hover {
  background: rgba(108, 117, 125, 0.15);
  border-color: rgba(108, 117, 125, 0.3);
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
  .sdkwork-voice-clone-record {
    padding: 16px;
    min-height: 350px;
  }

  .record-btn {
    width: 70px;
    height: 70px;
    font-size: 20px;
  }
}

.van-icon {
  margin-right: 6px;
}
</style>