<template>
  <div class="control-buttons" :class="containerClass">
    <!-- 状态指示器 -->
    <div class="state-indicator" :class="stateIndicatorClass">
      <span class="state-text">{{ stateText }}</span>
      <div v-if="isProcessing" class="processing-indicator">
        <div class="spinner"></div>
        <span>处理中...</span>
      </div>
    </div>

    <!-- 控制按钮区域 -->
    <div class="controls-container">
      <!-- 空闲/停止状态：显示开始录制按钮 -->
      <div v-if="isIdleState" class="controls-row">
        <div class="button-spacer"></div>
        <button 
          class="control-btn start-btn" 
          @click="handleRecordStart" 
          title="开始录制"
          :disabled="isProcessing"
        >
          <sdkwork-icon icon="material-symbols:mic-rounded" width="60" height="60" />
        </button>
        <div class="button-spacer"></div>
      </div>

      <!-- 录制中状态：显示取消、暂停、结束按钮 -->
      <div v-else-if="currentState === RecordState.RECORDING" class="controls-row">
        <button 
          class="control-btn cancel-btn" 
          @click="handleRecordCancel" 
          title="取消录制"
          :disabled="isProcessing"
        >
          <sdkwork-icon icon="material-symbols:close-rounded" width="32" height="32" />
        </button>
        <button 
          class="control-btn pause-btn" 
          @click="handleRecordPause" 
          title="暂停录制"
          :disabled="isProcessing"
        >
          <sdkwork-icon icon="material-symbols:pause-rounded" width="60" height="60" />
        </button>
        <button 
          class="control-btn finish-btn" 
          @click="handleRecordFinish" 
          title="结束录制"
          :disabled="isProcessing"
        >
          <sdkwork-icon icon="material-symbols:check-rounded" width="32" height="32" />
        </button>
      </div>

      <!-- 暂停状态：显示取消、继续、结束按钮 -->
      <div v-else-if="currentState === RecordState.PAUSED" class="controls-row">
        <button 
          class="control-btn cancel-btn" 
          @click="handleRecordCancel" 
          title="取消录制"
          :disabled="isProcessing"
        >
          <sdkwork-icon icon="material-symbols:close-rounded" width="32" height="32" />
        </button>
        <button 
          class="control-btn resume-btn" 
          @click="handleRecordResume" 
          title="继续录制"
          :disabled="isProcessing"
        >
          <sdkwork-icon icon="material-symbols:play-arrow-rounded" width="60" height="60" />
        </button>
        <button 
          class="control-btn finish-btn" 
          @click="handleRecordFinish" 
          title="结束录制"
          :disabled="isProcessing"
        >
          <sdkwork-icon icon="material-symbols:check-rounded" width="32" height="32" />
        </button>
      </div>

      <!-- 处理中/错误状态：显示状态信息 -->
      <div v-else class="controls-row">
        <div class="state-message">
          <span v-if="isProcessing">正在处理录制文件...</span>
          <span v-else-if="isErrorState" class="error-message">录制出现错误</span>
        </div>
      </div>
    </div>
    
    <!-- 底部说明文字插槽 -->
    <div class="hint-slot">
      <slot name="hint"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRecorderStore } from '../../../stores/modules/recorder'
import { RecordState } from '../../../stores/modules/recorder/types'

interface Props {
  /** 是否启用移动端优化 */
  mobileOptimized?: boolean
  /** 是否禁用所有按钮 */
  disabled?: boolean
}

interface Emits {
  /** 开始录制事件 */
  (e: 'record-start'): void
  /** 暂停录制事件 */
  (e: 'record-pause'): void
  /** 继续录制事件 */
  (e: 'record-resume'): void
  /** 取消录制事件 */
  (e: 'record-cancel'): void
  /** 结束录制事件 */
  (e: 'record-finish'): void
}

const props = withDefaults(defineProps<Props>(), {
  mobileOptimized: true,
  disabled: false
})

const emit = defineEmits<Emits>()

// 使用录制器 store
const recorderStore = useRecorderStore()

// 从 store 获取状态
const currentState = computed(() => recorderStore.currentState)
const isProcessing = computed(() => 
  recorderStore.currentState === RecordState.PROCESSING || 
  props.disabled
)

// 计算属性
const isIdleState = computed(() => 
  currentState.value === RecordState.IDLE || 
  currentState.value === RecordState.STOPPED
)

const isErrorState = computed(() => 
  currentState.value === RecordState.ERROR
)

const containerClass = computed(() => ({
  'control-buttons--mobile': props.mobileOptimized && isMobile(),
  'control-buttons--disabled': isProcessing.value
}))

const stateIndicatorClass = computed(() => ({
  'state-indicator--idle': isIdleState.value,
  'state-indicator--recording': currentState.value === RecordState.RECORDING,
  'state-indicator--paused': currentState.value === RecordState.PAUSED,
  'state-indicator--processing': isProcessing.value,
  'state-indicator--error': isErrorState.value
}))

const stateText = computed(() => {
  switch (currentState.value) {
    case RecordState.IDLE:
      return '准备录制'
    case RecordState.RECORDING:
      return '录制中...'
    case RecordState.PAUSED:
      return '已暂停'
    case RecordState.PROCESSING:
      return '处理中...'
    case RecordState.STOPPED:
      return '录制完成'
    case RecordState.ERROR:
      return '录制错误'
    default:
      return '未知状态'
  }
})

// 移动端检测
const isMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768
  }
  return false
}

// 事件处理
const handleRecordStart = () => {
  if (!isProcessing.value) {
    emit('record-start')
  }
}

const handleRecordPause = () => {
  if (!isProcessing.value) {
    emit('record-pause')
  }
}

const handleRecordResume = () => {
  if (!isProcessing.value) {
    emit('record-resume')
  }
}

const handleRecordCancel = () => {
  if (!isProcessing.value) {
    emit('record-cancel')
  }
}

const handleRecordFinish = () => {
  if (!isProcessing.value) {
    emit('record-finish')
  }
}
</script>

<style scoped>
.control-buttons {
  position: relative;
  padding: 24px 20px 32px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8)); 
  z-index: 100;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.control-buttons--mobile {
  padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px));
}

.control-buttons--disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 状态指示器 */
.state-indicator {
  text-align: center;
  margin-bottom: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.state-indicator--idle {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
}

.state-indicator--recording {
  background: rgba(0, 191, 255, 0.1);
  color: #00bfff;
  animation: pulse 2s infinite;
}

.state-indicator--paused {
  background: rgba(30, 144, 255, 0.1);
  color: #1e90ff;
}

.state-indicator--processing {
  background: rgba(70, 130, 180, 0.1);
  color: #4682b4;
}

.state-indicator--error {
  background: rgba(220, 20, 60, 0.1);
  color: #dc143c;
}

.state-text {
  font-weight: 600;
}

.processing-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 控制按钮容器 */
.controls-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.button-spacer {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.control-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.control-btn:not(:disabled):active {
  transform: translateY(0);
}

.start-btn {
  background: #007aff;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 122, 255, 0.4);
  width: 100px;
  height: 100px;
}

.start-btn:not(:disabled):hover {
  background: #3395ff;
  box-shadow: 0 6px 24px rgba(0, 122, 255, 0.5);
}

.cancel-btn {
  background: #464747;
  color: white;
  box-shadow: 0 4px 16px rgba(65, 105, 225, 0.3);
  width: 60px;
  height: 60px;
}

.cancel-btn:not(:disabled):hover {
  background: #5a7de8;
  box-shadow: 0 6px 20px rgba(65, 105, 225, 0.4);
}

.pause-btn {
  background: #1e90ff;
  color: white;
  box-shadow: 0 4px 16px rgba(30, 144, 255, 0.3);
  width: 75px;
  height: 75px;
}

.pause-btn:not(:disabled):hover {
  background: #3aa0ff;
  box-shadow: 0 6px 20px rgba(30, 144, 255, 0.4);
}

.resume-btn {
  background: #00bfff;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 191, 255, 0.3);
  width: 75px;
  height: 75px;
}

.resume-btn:not(:disabled):hover {
  background: #26c9ff;
  box-shadow: 0 6px 20px rgba(0, 191, 255, 0.4);
}

.finish-btn {
  background: #07c160;
  color: white;
  box-shadow: 0 4px 16px rgba(7, 193, 96, 0.3);
  width: 60px;
  height: 60px;
}

.finish-btn:not(:disabled):hover {
  background: #09d76a;
  box-shadow: 0 6px 20px rgba(7, 193, 96, 0.4);
}

/* 状态消息 */
.state-message {
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-size: 14px;
}

.error-message {
  color: #dc3545;
  font-weight: 500;
}

/* 底部说明文字插槽样式 */
.hint-slot {
  margin-top: 24px;
  text-align: center;
}

/* 动画 */
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .control-buttons {
    padding: 20px 16px 24px;
    min-height: 160px;
  }
  
  .control-buttons--mobile {
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  }
  
  .state-indicator {
    margin-bottom: 16px;
    font-size: 13px;
  }
  
  .controls-row {
    max-width: 320px;
  }
  
  .button-spacer {
    width: 50px;
    height: 50px;
  }
  
  .start-btn {
    width: 80px;
    height: 80px;
  }
  
  .cancel-btn, .finish-btn {
    width: 50px;
    height: 50px;
  }
  
  .pause-btn, .resume-btn {
    width: 70px;
    height: 70px;
  }
  
  .hint-slot {
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .control-buttons {
    padding: 16px 12px 20px;
    min-height: 140px;
  }
  
  .control-buttons--mobile {
    padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  }
  
  .state-indicator {
    margin-bottom: 12px;
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .controls-row {
    max-width: 280px;
  }
  
  .button-spacer {
    width: 40px;
    height: 40px;
  }
  
  .start-btn {
    width: 70px;
    height: 70px;
  }
  
  .cancel-btn, .finish-btn {
    width: 45px;
    height: 45px;
  }
  
  .pause-btn, .resume-btn {
    width: 65px;
    height: 65px;
  }
  
  .hint-slot {
    margin-top: 16px;
  }
}
</style>