<template>
  <sdkwork-popup 
    :visible="modelValue"
    title="字幕列表"
    width="600px"
    height="400px"
    :show-close="true"
    @update:visible="handleVisibleUpdate"
    @close="handleClose"
  >
    <div class="subtitle-list-dialog">
      <!-- 搜索和筛选 -->
      <div class="dialog-header">
        <div class="search-container">
          <sdkwork-icon icon="mdi:magnify" class="search-icon" />
          <input 
            v-model="searchText" 
            type="text" 
            placeholder="搜索字幕内容..."
            class="search-input"
          />
        </div>
        
        <div class="filter-container">
          <select v-model="filterType" class="filter-select">
            <option value="all">全部字幕</option>
            <option value="current">当前附近</option>
            <option value="dynamic">动态字幕</option>
          </select>
        </div>
      </div>

      <!-- 字幕列表 -->
      <div class="subtitle-list-container">
        <div 
          v-if="filteredEntries.length === 0" 
          class="empty-state"
        >
          <sdkwork-icon icon="mdi:subtitles-outline" class="empty-icon" />
          <p class="empty-text">暂无字幕内容</p>
        </div>

        <div v-else class="subtitle-list">
          <div 
            v-for="entry in filteredEntries" 
            :key="getEntryKey(entry)"
            class="subtitle-item"
            :class="{ 
              'active': isActiveEntry(entry), 
              'playing': isPlayingEntry(entry),
              'dynamic': isDynamicEntry(entry)
            }"
            @click="handleItemClick(entry)"
          >
            <div class="entry-time">
              <span class="time-start">{{ formatTime(entry.startTime || 0) }}</span>
              <span class="time-separator">→</span>
              <span class="time-end">{{ formatTime(entry.endTime || 0) }}</span>
            </div>
            
            <div class="entry-content">
              <div class="entry-text">{{ entry.text }}</div>
              <div v-if="isDynamicEntry(entry)" class="entry-badge">
                <span class="badge dynamic-badge">动态</span>
              </div>
            </div>
            
            <div class="entry-actions">
              <sdkwork-icon 
                v-if="isActiveEntry(entry)" 
                icon="mdi:play" 
                class="action-icon playing-icon"
              />
              <sdkwork-icon 
                v-else 
                icon="mdi:play-circle-outline" 
                class="action-icon"
                @click.stop="handleItemClick(entry)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="dialog-footer">
        <div class="stats-info">
          <span class="stat-item">
            总计: {{ totalEntries }} 条
          </span>
          <span class="stat-item">
            动态: {{ dynamicEntriesCount }} 条
          </span>
          <span class="stat-item">
            当前: {{ currentEntryIndex + 1 }}
          </span>
        </div>
      </div>
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SubtitleEntry, Subtitles } from '@/core/subtitles'

interface Props {
  modelValue: boolean
  subtitles?: Subtitles | null
  currentTime: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'seek-to', time: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const searchText = ref('')
const filterType = ref<'all' | 'current' | 'dynamic'>('all')

// 计算属性
const allEntries = computed(() => {
  const entries: SubtitleEntry[] = []
  
  // 添加静态字幕
  if (props.subtitles?.entries) {
    entries.push(...props.subtitles.entries.map((entry, index) => ({
      ...entry,
      sequence: index + 1,
      isDynamic: false
    })))
  }
  
  // 添加动态字幕（需要从store获取，这里简化处理）
  // 实际使用时应该从store中获取dynamicEntries
  
  return entries.sort((a, b) => (a.startTime || 0) - (b.startTime || 0))
})

const filteredEntries = computed(() => {
  let entries = allEntries.value
  
  // 搜索过滤
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    entries = entries.filter(entry => 
      entry.text?.toLowerCase().includes(searchLower)
    )
  }
  
  // 类型过滤
  if (filterType.value === 'current') {
    const currentTime = props.currentTime
    entries = entries.filter(entry => 
      Math.abs((entry.startTime || 0) - currentTime) < 30000 // 30秒范围内
    )
  } else if (filterType.value === 'dynamic') {
    entries = entries.filter(entry => entry.isDynamic)
  }
  
  return entries
})

const totalEntries = computed(() => allEntries.value.length)
const dynamicEntriesCount = computed(() => allEntries.value.filter(entry => entry.isDynamic).length)

const currentEntryIndex = computed(() => {
  if (!props.subtitles?.entries) return -1
  
  return props.subtitles.entries.findIndex(entry => 
    props.currentTime >= (entry.startTime || 0) && 
    props.currentTime <= (entry.endTime || 0)
  )
})

// 判断方法
const isActiveEntry = (entry: SubtitleEntry): boolean => {
  return currentEntryIndex.value === (entry.sequence ? entry.sequence - 1 : -1)
}

const isPlayingEntry = (entry: SubtitleEntry): boolean => {
  return props.currentTime >= (entry.startTime || 0) && 
         props.currentTime <= (entry.endTime || 0)
}

const isDynamicEntry = (entry: SubtitleEntry): boolean => {
  return !!entry.isDynamic
}

const getEntryKey = (entry: SubtitleEntry): string => {
  return `${entry.sequence}-${entry.startTime}-${entry.endTime}`
}

// 时间格式化
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const ms = Math.floor((milliseconds % 1000) / 10)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

// 事件处理
const handleItemClick = (entry: SubtitleEntry) => {
  if (entry.startTime !== undefined) {
    emit('seek-to', entry.startTime)
  }
}

const handleVisibleUpdate = (visible: boolean) => {
  emit('update:modelValue', visible)
}

const handleClose = () => {
  emit('update:modelValue', false)
}

// 监听对话框打开，重置搜索
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    searchText.value = ''
    filterType.value = 'all'
  }
})
</script>

<style scoped>
.subtitle-list-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dialog-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.search-container {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
  outline: none;
  border-color: #007aff;
}

.filter-container {
  min-width: 120px;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.filter-select:focus {
  outline: none;
  border-color: #007aff;
}

.subtitle-list-container {
  flex: 1;
  overflow-y: auto;
  margin: 0 -4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  margin: 0;
}

.subtitle-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px;
}

.subtitle-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.subtitle-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.subtitle-item.active {
  background: rgba(0, 122, 255, 0.2);
  border-color: #007aff;
}

.subtitle-item.playing {
  background: rgba(0, 122, 255, 0.1);
}

.subtitle-item.dynamic {
  border-left: 3px solid #ff9500;
}

.entry-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.time-separator {
  margin: 2px 0;
  opacity: 0.5;
}

.entry-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry-text {
  font-size: 14px;
  line-height: 1.4;
  color: white;
  word-wrap: break-word;
}

.entry-badge {
  display: flex;
  gap: 4px;
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.dynamic-badge {
  background: #ff9500;
  color: black;
}

.entry-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.subtitle-item:hover .entry-actions {
  opacity: 1;
}

.action-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-icon:hover {
  color: #007aff;
}

.playing-icon {
  color: #007aff;
}

.dialog-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 滚动条样式 */
.subtitle-list-container::-webkit-scrollbar {
  width: 6px;
}

.subtitle-list-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.subtitle-list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.subtitle-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .dialog-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .subtitle-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .entry-time {
    flex-direction: row;
    min-width: auto;
    gap: 8px;
  }
  
  .time-separator {
    margin: 0;
  }
  
  .stats-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>