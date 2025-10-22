<template>
  <sdkwork-popup
    :model-value="show"
    :title="'录音记录'"
    :position="'bottom'"
    :width="'100%'"
    :height="'80vh'"
    :max-height="'80vh'"
    :round="true"
    :closeable="true"
    :close-on-click-overlay="true"
    :safe-area-inset-bottom="true"
    :theme-mode="themeMode"
    :custom-class="themeClass"
    @update:model-value="handlePopupUpdate"
    @close="handleClose"
  >
    <!-- 弹窗内容容器 -->
    <div class="popup-container">
      <!-- 内容区域 -->
      <div class="popup-content">
        <RecordList 
          :records="records" 
          :active-record-id="activeRecordId" 
          :show-actions="true"
          :max-records="maxRecords"
          @record-click="handleRecordClick"
          @record-play="handleRecordPlay"
          @record-download="handleRecordDownload"
          @record-delete="handleRecordDelete"
          @record-clear="handleRecordClear"
        />
      </div>

      <!-- 固定在底部的footer -->
      <div class="popup-footer">
        <div class="record-count">
          共 {{ records.length }} 条录音记录
        </div>
        <button class="clear-all-btn" @click="handleClearAll" :disabled="records.length === 0">
          清空全部
        </button>
      </div>
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRecorderStore } from '../../../stores/modules/recorder'
import type { AudioRecord } from '../../../stores/modules/recorder/types'
import RecordList from './RecordList.vue'
import SdkworkPopup from '../../sdkwork-popup/sdkwork-popup.vue'

interface Props {
  /** 是否显示弹窗 */
  show: boolean
  /** 当前激活的记录ID */
  activeRecordId?: string
  /** 最大显示记录数 */
  maxRecords?: number
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

interface Emits {
  /** 关闭弹窗事件 */
  (e: 'close'): void
  /** 记录点击事件 */
  (e: 'record-click', record: AudioRecord): void
  /** 记录播放事件 */
  (e: 'record-play', record: AudioRecord): void
  /** 记录下载事件 */
  (e: 'record-download', record: AudioRecord): void
  /** 记录删除事件 */
  (e: 'record-delete', record: AudioRecord): void
  /** 清空记录事件 */
  (e: 'record-clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  maxRecords: 20,
  themeMode: 'auto'
})

// 使用录制器 store
const recorderStore = useRecorderStore()

// 从 store 获取录音记录
const records = computed(() => recorderStore.records)

// 主题检测
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'record-list-popup--dark' : 'record-list-popup--light'
})
const emit = defineEmits<Emits>()

// 处理关闭弹窗
const handleClose = () => {
  emit('close')
}

// 处理弹出框更新
const handlePopupUpdate = (value: boolean) => {
  if (!value) {
    handleClose()
  }
}

// 处理记录点击
const handleRecordClick = (record: AudioRecord) => {
  emit('record-click', record)
}

// 处理记录播放
const handleRecordPlay = (record: AudioRecord) => {
  emit('record-play', record)
}

// 处理记录下载
const handleRecordDownload = (record: AudioRecord) => {
  emit('record-download', record)
}

// 处理记录删除
const handleRecordDelete = (record: AudioRecord) => {
  emit('record-delete', record)
}

// 处理清空记录
const handleRecordClear = () => {
  emit('record-clear')
}

// 处理清空全部
const handleClearAll = () => {
  if (records.value?.length > 0) {
    emit('record-clear')
  }
}

// 监听ESC键关闭弹窗
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    handleClose()
  }
}

// 监听键盘事件
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 录音记录弹窗样式 */
.popup-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.popup-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.popup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px; 
  background: var(--sdkwork-popup-footer-background, #fafafa);
  border-top: 1px solid var(--sdkwork-popup-border-color, #ddd);
  flex-shrink: 0;
}

.record-count {
  font-size: 14px;
  color: var(--sdkwork-popup-content-color, #999);
}

.clear-all-btn {
  background: var(--sdkwork-popup-secondary-color, #f0f0f0);
  border: 1px solid var(--sdkwork-popup-border-color, #ddd);
  color: var(--sdkwork-popup-content-color, #666);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.clear-all-btn:hover:not(:disabled) {
  background: var(--sdkwork-popup-secondary-hover-color, #e0e0e0);
  border-color: var(--sdkwork-popup-border-color, #ccc);
  transform: translateY(-1px);
}

.clear-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .popup-content {
    padding: 12px;
  }
  
  .popup-footer {
    padding: 12px;
  }
  
  .record-count {
    font-size: 13px;
  }
  
  .clear-all-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .popup-content {
    padding: 8px;
  }
  
  .popup-footer {
    padding: 8px;
  }
  
  .record-count {
    font-size: 12px;
  }
  
  .clear-all-btn {
    padding: 5px 10px;
    font-size: 12px;
  }
}
</style>