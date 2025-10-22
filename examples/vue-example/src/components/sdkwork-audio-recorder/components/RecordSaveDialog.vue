<template>
  <sdkwork-popup
    :model-value="showDialog"
    :title="'保存录制文件'"
    :position="'center'"
    :width="'400px'"
    :round="true"
    :closeable="true"
    :close-on-click-overlay="false"
    :theme-mode="themeMode"
    :custom-class="themeClass"
    @update:model-value="handlePopupUpdate"
    @close="handleCancel"
  >
    <!-- 录制信息 -->
    <div class="record-info">
      <div class="info-item">
        <span class="info-label">录制时长:</span>
        <span class="info-value">{{ formatDuration(record.duration) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">文件大小:</span>
        <span class="info-value">{{ formatFileSize(record.size) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">录制时间:</span>
        <span class="info-value">{{ formatTimestamp(record.createdAt) }}</span>
      </div>
    </div>
    
    <!-- 标题输入 -->
    <div class="title-input-section">
      <label class="input-label">录制标题</label>
      <input 
        ref="titleInput"
        v-model="recordTitle" 
        type="text" 
        class="title-input"
        placeholder="请输入录制标题"
        maxlength="50"
        @keyup.enter="handleSave"
      />
      <div class="input-hint">
        <span class="char-count">{{ recordTitle.length }}/50</span>
      </div>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <button class="btn btn-cancel" @click="handleCancel">
          取消保存
        </button>
        <button class="btn btn-save" @click="handleSave">
          确认保存
        </button>
      </div>
    </template>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import type { AudioRecord } from '../../../stores/modules/recorder/types'
import SdkworkPopup from '../../sdkwork-popup/sdkwork-popup.vue'

interface Props {
  /** 是否显示对话框 */
  show?: boolean
  /** 录制数据 */
  record?: AudioRecord
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

interface Emits {
  /** 保存事件 */
  (e: 'save', data: { record: AudioRecord; title: string }): void
  /** 取消事件 */
  (e: 'cancel', record: AudioRecord): void
  /** 关闭事件 */
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  record: () => ({
    blob: undefined,
    buffer: undefined,
    duration: 0,
    size: 0,
    createdAt: Date.now(),
    id: ''
  }),
  themeMode: 'auto'
})

const emit = defineEmits<Emits>()

// 响应式数据
const showDialog = ref(false)
const recordTitle = ref('')
const titleInput = ref<HTMLInputElement>()

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
  return isDarkMode.value ? 'save-dialog--dark' : 'save-dialog--light'
})

// 监听显示状态变化
watch(() => props.show, (newVal) => {
  showDialog.value = newVal
  
  if (newVal) {
    // 生成默认标题
    recordTitle.value = generateDefaultTitle()
    
    // 延迟聚焦输入框
    nextTick(() => {
      titleInput.value?.focus()
      titleInput.value?.select()
    })
  }
})

// 生成默认标题
const generateDefaultTitle = (): string => {
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const durationStr = formatDuration(props.record.duration)
  
  return `录制_${dateStr.replace(/\//g, '')}_${timeStr.replace(/:/g, '')}_${durationStr.replace(/:/g, '')}`
}

// 格式化时长
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化时间戳
const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 处理保存
const handleSave = () => {
  if (!props.record) return
  
  const title = recordTitle.value.trim() || generateDefaultTitle()
  
  emit('save', {
    record: props.record,
    title: title
  })
  
  // 重置状态
  showDialog.value = false
  recordTitle.value = ''
}

// 处理取消
const handleCancel = () => {
  emit('cancel', props.record)
  emit('close')
  
  // 重置状态
  showDialog.value = false
  recordTitle.value = ''
}

// 处理弹出框更新
const handlePopupUpdate = (value: boolean) => {
  if (!value) {
    handleCancel()
  }
}

// 暴露方法
defineExpose({
  /** 打开对话框 */
  open: (data: AudioRecord) => {
    showDialog.value = true
    recordTitle.value = generateDefaultTitle()
    
    nextTick(() => {
      titleInput.value?.focus()
      titleInput.value?.select()
    })
  },
  
  /** 关闭对话框 */
  close: () => {
    showDialog.value = false
    recordTitle.value = ''
  }
})
</script>

<style scoped>
.record-save-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

/* 保存对话框样式 */
.save-dialog-body {
  padding: 16px;
}

.record-info {
  background: var(--sdkwork-popup-content-background, #fff);
  border: 1px solid var(--sdkwork-popup-border-color, #ddd);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: var(--sdkwork-popup-content-color, #333);
}

.info-value {
  font-size: 14px;
  color: var(--sdkwork-popup-content-color, #333);
  font-weight: 500;
}

.title-input-section {
  margin-top: 16px;
}

.input-label {
  display: block;
  font-size: 14px;
  color: var(--sdkwork-popup-content-color, #333);
  margin-bottom: 8px;
  font-weight: 500;
}

.title-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--sdkwork-popup-border-color, #ddd);
  border-radius: 6px;
  background: var(--sdkwork-popup-content-background, #fff);
  color: var(--sdkwork-popup-content-color, #333);
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.title-input:focus {
  outline: none;
  border-color: var(--sdkwork-popup-primary-color, #409EFF);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.title-input::placeholder {
  color: var(--sdkwork-popup-content-color, #999);
}

.input-hint {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.char-count {
  font-size: 12px;
  color: var(--sdkwork-popup-content-color, #999);
}

.dialog-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid var(--sdkwork-popup-footer-border-color, #f0f0f0);
  background: var(--sdkwork-popup-footer-background, #fafafa);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-cancel {
  background: var(--sdkwork-popup-secondary-color, #f0f0f0);
  color: var(--sdkwork-popup-content-color, #666);
}

.btn-cancel:hover {
  background: var(--sdkwork-popup-secondary-hover-color, #e0e0e0);
  transform: translateY(-1px);
}

.btn-save {
  background: var(--sdkwork-popup-primary-color, #409EFF);
  color: white;
}

.btn-save:hover {
  background: var(--sdkwork-popup-primary-hover-color, #66b1ff);
  transform: translateY(-1px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .record-save-dialog-overlay {
    padding: 16px;
  }
  
  .record-save-dialog {
    padding: 20px;
    max-width: 320px;
  }
  
  .dialog-title {
    font-size: 16px;
  }
  
  .record-info {
    padding: 12px;
  }
  
  .info-item {
    font-size: 13px;
  }
  
  .title-input {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 13px;
    min-width: 80px;
  }
}

@media (max-width: 480px) {
  .record-save-dialog-overlay {
    padding: 12px;
  }
  
  .record-save-dialog {
    padding: 16px;
    max-width: 280px;
  }
  
  .dialog-title {
    font-size: 15px;
  }
  
  .record-info {
    padding: 10px;
  }
  
  .info-item {
    font-size: 12px;
  }
  
  .title-input {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .btn {
    padding: 7px 14px;
    font-size: 12px;
    min-width: 70px;
  }
}
</style>