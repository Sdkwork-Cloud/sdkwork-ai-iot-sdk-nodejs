<template>
  <div class="sdkwork-voice-speaker-category-list" :class="themeClass">
    <!-- 基于sdkwork-api-category-list组件实现 -->
    <SdkworkApiCategoryList :api="computedApi" :params="params" :searchable="searchable" :selectable="selectable"
      :page-size="pageSize" :category-api="computedCategoryApi" :categorys="computedCategorys"
      :category-key="categoryKey" :category-name-field="categoryNameField" :category-count-field="categoryCountField"
      :default-category-id="defaultCategoryId" :theme-mode="themeMode" @select="handleSelect" @search="handleSearch"
      @select-category="handleSelectCategory" @load="handleLoad">
      <!-- 自定义列表项内容 -->
      <template #default="{ item, selected }">
        <sdkwork-voice-speaker-category-item :speaker="item" :active="selected" :theme-mode="themeMode" @select="(speaker: any) => {
          handleVoiceSelect(speaker)
        }" />
      </template>

      <!-- 自定义分类项内容 -->
      <template #category="{ category }">
        <div class="voice-category-item">
          <span class="category-name">{{ category.name }}</span>
          <span class="category-count" v-if="category.count">({{ category.count }})</span>
        </div>
      </template>

      <!-- 空状态 -->
      <template #empty>
        <div class="voice-empty">
          <van-icon name="music" size="48" color="#ccc" />
          <div class="empty-text">暂无发音人</div>
        </div>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <div class="voice-loading">
          <van-loading size="24px" />
          <span>加载发音人中...</span>
        </div>
      </template>
    </SdkworkApiCategoryList>


    <!-- 语音克隆弹窗 -->
    <SdkworkVoiceClonePopup v-model:show="showVoiceClonePopup" @confirm="handleVoiceCloneConfirm"
      @close="handleVoiceCloneCancel" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudioStore } from '@/stores/modules/audio'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import SdkworkApiCategoryList from '../sdkwork-api-category-list/sdkwork-api-category-list.vue'
import SdkworkVoiceClonePopup from '../sdkwork-voice-clone-popup/sdkwork-voice-clone-popup.vue'
import { defaultVoiceApi, defaultCategoryApi, defaultVoiceCategories } from './default-data'
import { VoiceSpeakerVO } from '@/services'
import { VoiceCategory } from '@/stores/modules/audio/types'
 
// 组件属性定义
interface Props {
  /** API请求方法（可选，不传则使用默认数据） */
  api?: (params: Pageable) => Promise<Page<VoiceSpeakerVO>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持搜索 */
  searchable?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 分类数据API方法（可选，不传则使用默认数据） */
  categoryApi?: () => Promise<VoiceCategory[]>
  /** 分类数据列表 */
  categorys?: VoiceCategory[]
  /** 分类项唯一键字段名 */
  categoryKey?: string
  /** 分类项名称字段名 */
  categoryNameField?: string
  /** 分类项数量字段名 */
  categoryCountField?: string
  /** 默认选中的分类ID */
  defaultCategoryId?: string | number
  /** 当前选中的发音人ID */
  selectedSpeakerId?: string | number
  /** 是否显示克隆声音按钮 */
  showCloneButton?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  searchable: true,
  selectable: true,
  pageSize: 20,
  categorys: () => [],
  categoryKey: 'id',
  categoryNameField: 'name',
  categoryCountField: 'count',
  showCloneButton: true,
  themeMode: 'auto'
})

// 事件定义
interface Emits {
  (e: 'select', speaker: VoiceSpeakerVO): void
  (e: 'search', keyword: string): void
  (e: 'select-category', category: VoiceCategory): void
  (e: 'load', pageData: Page<VoiceSpeakerVO>): void
  (e: 'clone', data: any): void
}

const emit = defineEmits<Emits>()

const audioStore = useAudioStore()

// 语音克隆弹窗显示状态
const showVoiceClonePopup = ref(false)

// Dark mode support - 参考 sdkwork-cell 的主题处理方式
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
  return isDarkMode.value ? 'voice-list--dark' : 'voice-list--light'
})

// 计算属性 - 处理默认数据
const computedApi = computed(() => props.api || defaultVoiceApi)
const computedCategoryApi = computed(() => props.categoryApi || defaultCategoryApi)
const computedCategorys = computed(() => props.categorys && props.categorys.length > 0 ? props.categorys : defaultVoiceCategories)

// 处理发音人选择
const handleSelect = (speaker: VoiceSpeakerVO) => {
  if (props.selectable) {
    audioStore.setSelectedSpeaker(speaker)
  }
  emit('select', speaker)
}

// 处理发音人选择（来自VoiceItem组件）
const handleVoiceSelect = (speaker: VoiceSpeakerVO) => {
  handleSelect(speaker)
}

// 处理搜索
const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

// 处理分类选择
const handleSelectCategory = (category: VoiceCategory) => {
  emit('select-category', category)
}

// 处理数据加载完成
const handleLoad = (pageData: Page<VoiceSpeakerVO>) => {
  emit('load', pageData)
}

// 处理语音克隆确认
const handleVoiceCloneConfirm = (data: any) => {
  showVoiceClonePopup.value = false
  emit('clone', data)
}

// 处理语音克隆取消
const handleVoiceCloneCancel = () => {
  showVoiceClonePopup.value = false
}

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => {
    // 可以通过ref调用SdkworkApiCategoryList的方法
  },
  /** 获取当前选中的发音人 */
  getSelectedSpeaker: () => audioStore.selectedSpeaker,
  /** 设置选中的发音人 */
  setSelectedSpeaker: (speaker: VoiceSpeakerVO) => {
    audioStore.setSelectedSpeaker(speaker)
  }
})
</script>

<style scoped lang="scss">
.sdkwork-voice-speaker-category-list {
  height: 100%;
  background: var(--voice-list-bg, #ffffff);

  // CSS 变量系统 - 参考 sdkwork-cell 的主题处理方式
  --voice-list-bg: #ffffff;
  --voice-list-text-color: #333333;
  --voice-list-text-secondary: #666666;
  --voice-list-text-meta: #999999;
  --voice-list-empty-color: #999999;
}

.voice-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--voice-list-empty-color);
}

.voice-empty .empty-text {
  margin-top: 12px;
  font-size: 14px;
}

.voice-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--voice-list-empty-color);
}

.voice-loading span {
  margin-left: 8px;
}

.voice-category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.voice-category-item .category-name {
  font-size: 13px;
  color: var(--voice-list-text-secondary);
}

.voice-category-item .category-count {
  font-size: 11px;
  color: var(--voice-list-text-meta);
}

/* 克隆声音浮动按钮样式 */
.voice-clone-button {
  position: fixed;
  right: 20px;
  bottom: 80px;
  /* 避免遮盖底部栏 */
  z-index: 1000;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.voice-clone-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

// 深色主题适配
.voice-list--dark {
  --voice-list-bg: #1a1a1a;
  --voice-list-text-color: #ffffff;
  --voice-list-text-secondary: #a0a0a0;
  --voice-list-text-meta: #8c8c8c;
  --voice-list-empty-color: #8c8c8c;
}
</style>