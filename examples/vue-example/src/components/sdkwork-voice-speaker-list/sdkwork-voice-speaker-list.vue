<template>
  <div class="sdkwork-speaker-list">
    <!-- 使用API List组件 -->
    <sdkwork-api-list 
      :api="api" 
      :params="buildParams" 
      :selectable="selectable" 
      :deletable="deletable"
      :searchable="searchable" 
      :page-size="pageSize" 
      :item-key="itemKey" 
      :item-title-field="itemTitleField"
      :item-description-field="itemDescriptionField" 
      :left-spacing="0" 
      :right-spacing="0" 
      @select="handleSelect"
      @delete="handleDelete" 
      @search="handleSearch" 
      @load="handleLoad" 
      ref="apiListRef" 
      showBorderBottom 
      :borderBottomLeftOffset="70"
    >
      <!-- 自定义发音人列表项 -->
      <template #default="{ item, index, selected }">
        <sdkwork-voice-speaker-item
          :speaker="item" 
          :is-selected="selected" 
          :show-border-bottom="true"
          @click="handleItemClick" 
          @select="handleItemSelect"
          @play-sample="handleItemPlaySample"
          @favorite="handleItemFavorite"
        />
      </template>

      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <van-empty description="暂无发音人" image="search">
            <template #description>
              <div class="empty-description">
                <p>暂时没有可用的发音人</p>
                <p class="empty-tip">您可以调整搜索条件或联系管理员添加</p>
              </div>
            </template>
          </van-empty>
        </slot>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <slot name="loading">
          <van-loading size="24px" vertical>加载发音人数据...</van-loading>
        </slot>
      </template>

      <!-- 头部插槽 -->
      <template #header>
        <slot name="header" />
      </template>

      <!-- 底部插槽 -->
      <template #footer>
        <slot name="footer" />
      </template>
    </sdkwork-api-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue' 
import type { SpeakerPage, SpeakerPageable, SpeakerEvents } from './types'
import type { Pageable } from 'sdkwork-commons-typescript' 
import { VoiceSpeakerVO } from '@/services'

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: SpeakerPageable) => Promise<SpeakerPage>
  /** 查询参数 */
  params?: any
  /** 是否支持行选择 */
  selectable?: boolean
  /** 是否支持行删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 列表项唯一键字段名 */
  itemKey?: string
  /** 列表项标题字段名 */
  itemTitleField?: string
  /** 列表项描述字段名 */
  itemDescriptionField?: string
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  selectable: false,
  deletable: false,
  searchable: false,
  pageSize: 10,
  itemKey: 'id',
  itemTitleField: 'displayName',
  itemDescriptionField: 'description'
})

// 事件定义
const emit = defineEmits<SpeakerEvents>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义列表项内容 */
  default?: (props: { speaker: VoiceSpeakerVO; index: number; selected: boolean }) => any
  /** 头部插槽 - 列表顶部区域 */
  header?: () => any
  /** 底部插槽 - 列表底部区域 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
}>()

// DOM引用
const apiListRef = ref<InstanceType<typeof SdkworkApiList>>()

// 计算属性
const buildParams = computed(() => {
  const baseParams: Pageable = {
    page: 0,
    size: props.pageSize,
    filters: props.params
  }
  return baseParams
})

// 事件处理
const handleSelect = (speaker: VoiceSpeakerVO) => {
  emit('select', speaker)
}

const handleDelete = (speaker: VoiceSpeakerVO) => {
  emit('delete', speaker)
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: SpeakerPage) => {
  emit('load', pageData)
}

const handleItemSelect = (speaker: VoiceSpeakerVO) => {
  emit('select', speaker)
}

const handleItemDelete = (speaker: VoiceSpeakerVO) => {
  emit('delete', speaker)
}

const handleItemClick = (speaker: VoiceSpeakerVO) => {
  emit('click', speaker)
}

const handleItemPlaySample = (speaker: VoiceSpeakerVO) => {
  emit('play-sample', speaker)
}

const handleItemFavorite = (speaker: VoiceSpeakerVO) => {
  emit('favorite', speaker)
}

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => apiListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => apiListRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => apiListRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => apiListRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => apiListRef.value?.clearSelected(),
  /** 设置选中项 */
  setSelectedItems: (items: VoiceSpeakerVO[]) => apiListRef.value?.setSelectedItems(items),
  /** 根据ID选择发音人 */
  selectSpeakerById: (id: string) => {
    const data = apiListRef.value?.getData() || []
    const speaker = data.find(s => s.id === id)
    if (speaker) {
      apiListRef.value?.setSelectedItems([speaker])
      emit('select', speaker)
    }
  },
  /** 获取收藏的发音人 */
  getFavoriteSpeakers: () => {
    const data = apiListRef.value?.getData() || []
    return data.filter(s => s.favorite)
  },
  /** 根据语言筛选发音人 */
  filterByLanguage: (language: string) => {
    const data = apiListRef.value?.getData() || []
    return data.filter(s => s.language === language)
  },
  /** 根据类型筛选发音人 */
  filterByType: (type: string) => {
    const data = apiListRef.value?.getData() || []
    return data.filter(s => s.type === type)
  }
})
</script>

<style scoped lang="scss">
.sdkwork-speaker-list {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  /* 确保API列表组件使用最大高度 */
  :deep(.sdkwork-api-list) {
    height: 100%;
    min-height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* 确保下拉刷新组件使用最大高度 */
  :deep(.sdkwork-pull-refresh) {
    height: 100%;
    min-height: 100%;
  }
}

.empty-description {
  text-align: center;
}

.empty-description p {
  margin: 4px 0;
  color: #969799;
  font-size: 14px;
}

.empty-description .empty-tip {
  font-size: 12px;
  color: #c8c9cc;
}
</style>