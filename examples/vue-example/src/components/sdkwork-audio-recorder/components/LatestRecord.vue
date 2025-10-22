<template>
  <div class="latest-record-section">
    <!-- 最新录音记录 -->
    <AudioRecordListItem 
      v-if="latestRecord"
      :record="latestRecord"
      :active-record-id="activeRecordId"
      :show-time="true"
      :show-download="false"
      :show-delete="true"
      :theme-mode="themeMode"
      @record-click="handleRecordClick"
      @record-play="handleRecordPlay"
      @record-pause="handleRecordPause"
      @record-delete="handleRecordDelete"
    />

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <sdkwork-icon icon="material-symbols:mic-off-rounded" width="24" height="24" />
      <span>暂无录音记录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRecorderStore } from '../../../stores/modules/recorder'
import type { AudioRecord } from '../../../stores/modules/recorder/types'
import AudioRecordListItem from './AudioRecordListItem.vue'

interface Props {
  /** 当前激活的记录ID */
  activeRecordId?: string
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
  /** 记录删除事件 */
  (e: 'record-delete', record: AudioRecord): void
}

const props = withDefaults(defineProps<Props>(), {
  themeMode: 'auto'
})

const emit = defineEmits<Emits>()

// 使用录制器 store
const recorderStore = useRecorderStore()

// 从 store 获取录音记录
const records = computed(() => recorderStore.records)

// 计算最新录音记录
const latestRecord = computed(() => {
  if (!records.value || records.value.length === 0) return null
  return records.value[0] // 最新的记录在数组第一个位置
})

const handleRecordClick = (record: AudioRecord) => {
  emit('record-click', record)
}

const handleRecordPlay = (record: AudioRecord) => {
  emit('record-play', record)
}

const handleRecordPause = (record: AudioRecord) => {
  emit('record-pause', record)
}

const handleRecordDelete = (record: AudioRecord) => {
  emit('record-delete', record)
}

</script>

<style scoped>
.latest-record-section {
  margin-top: 10px; 
  padding-top: 16px;
}

.latest-record {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease; 
}

.latest-record:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.record-icon {
  color: #007aff;
  flex-shrink: 0;
}

.record-info {
  flex: 1;
  min-width: 0;
}

.record-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-duration {
  font-size: 12px;
  color: #999999;
}

.record-time {
  font-size: 12px;
  color: #666666;
  flex-shrink: 0;
}

.record-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #333333;
  color: #ffffff;
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: #666666;
  font-size: 14px;
  text-align: center;
  justify-content: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .latest-record-section {
    margin-top: 16px;
    padding-top: 12px;
  }
  
  .latest-record {
    padding: 0px 0px;
  }
  
  .more-btn {
    padding: 10px 12px;
  }
  
  .record-name {
    font-size: 13px;
  }
  
  .record-duration, .record-time {
    font-size: 11px;
  }
}
</style>