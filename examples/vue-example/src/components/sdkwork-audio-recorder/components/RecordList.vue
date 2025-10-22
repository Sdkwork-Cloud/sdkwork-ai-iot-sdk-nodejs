<template>
  <div class="record-list-section">
    <div v-if="records.length > 0" class="record-list-header">
      <h3 class="list-title">录制记录</h3>
      <button class="clear-btn" @click="handleClear" title="清空记录">
        <sdkwork-icon icon="material-symbols:delete-outline-rounded" width="18" height="18" />
      </button>
    </div>
    
    <div v-if="records.length > 0" class="record-list">
      <AudioRecordListItem 
        v-for="record in records" 
        :key="record.id" 
        :record="record"
        :active-record-id="activeRecordId"
        :show-time="false"
        :show-download="showActions"
        :show-delete="showActions"
        :theme-mode="themeMode"
        @record-click="handleRecordClick"
        @record-play="handleRecordPlay"
        @record-pause="handleRecordPause"
        @record-download="handleRecordDownload"
        @record-delete="handleRecordDelete"
      />
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">
        <sdkwork-icon icon="material-symbols:mic-outline-rounded" width="48" height="48" />
      </div>
      <p class="empty-text">暂无录音记录</p>
      <p class="empty-subtext">开始录制音频后，记录将显示在这里</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioRecord } from '../../../stores/modules/recorder/types'
import AudioRecordListItem from './AudioRecordListItem.vue'

interface Props {
  /** 录制记录列表 */
  records: AudioRecord[]
  /** 当前激活的记录ID */
  activeRecordId?: string
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 最大显示记录数 */
  maxRecords?: number
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

interface Emits {
  /** 记录点击事件 */
  (e: 'record-click', record: AudioRecord): void
  /** 记录播放事件 */
  (e: 'record-play', record: AudioRecord): void
  /** 记录暂停事件 */
  (e: 'record-pause', record: AudioRecord): void
  /** 记录下载事件 */
  (e: 'record-download', record: AudioRecord): void
  /** 记录删除事件 */
  (e: 'record-delete', record: AudioRecord): void
  /** 清空记录事件 */
  (e: 'record-clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  maxRecords: 10,
  themeMode: 'auto'
})

const emit = defineEmits<Emits>()

const formatRecordDuration = (duration: number) => {
  if (!duration || duration <= 0) return '0秒'
  
  // 将毫秒转换为秒
  const totalSeconds = Math.floor(duration / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  
  if (minutes > 0) {
    return `${minutes}分${remainingSeconds.toString().padStart(2, '0')}秒`
  } else {
    return `${totalSeconds}秒`
  }
}

const handleRecordClick = (record: AudioRecord) => {
  emit('record-click', record)
}

const handleRecordPlay = (record: AudioRecord) => {
  emit('record-play', record)
}

const handleRecordPause = (record: AudioRecord) => {
  emit('record-pause', record)
}

const handleRecordDownload = (record: AudioRecord) => {
  emit('record-download', record)
}

const handleRecordDelete = (record: AudioRecord) => {
  emit('record-delete', record)
}

const handleClear = () => {
  emit('record-clear')
}
</script>

<style scoped>
.record-list-section {
  margin-top: 20px; 
  padding-top: 16px;
}

.record-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #333333;
  color: #ffffff;
}

.record-list {
  max-height: 200px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #666;
}

.empty-subtext {
  font-size: 14px;
  margin: 0;
  color: #999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .record-list-section {
    margin-top: 16px;
    padding-top: 12px;
  }
  
  .list-title {
    font-size: 15px;
  }
  
  .empty-state {
    padding: 30px 16px;
  }
  
  .empty-text {
    font-size: 15px;
  }
  
  .empty-subtext {
    font-size: 13px;
  }
}
</style>