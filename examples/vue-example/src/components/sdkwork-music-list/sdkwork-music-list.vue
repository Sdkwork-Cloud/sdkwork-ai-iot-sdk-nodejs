<template>
  <SdkworkApiList
    :api="getApiMethod"
    :params="queryParams"
    :selectable="selectable"
    :deletable="deletable"
    :searchable="searchable"
    :page-size="pageSize"
    :item-key="itemKey"
    :item-title-field="itemTitleField"
    :item-description-field="itemDescriptionField"
    :theme-mode="themeMode"
    :show-border-bottom="showBorderBottom"
    @select="handleItemSelect"
    @delete="handleItemDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义音乐项内容 -->
    <template #default="{ item, index, selected }">
      <MusicListItem
        :music="item"
        :index="index"
        :selected="selected"
        :selectable="selectable"
        :deletable="deletable"
        :show-index="false"
        @click="handleItemClick" 
      />
    </template>

    <!-- 自定义空状态 -->
    <template #empty>
      <div class="empty-music">
        <van-icon name="music-o" size="48" />
        <p>暂无音乐</p>
      </div>
    </template>

    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="loading-music">
        <van-loading size="24px" />
        <span>加载音乐中...</span>
      </div>
    </template>

    <!-- 自定义头部区域 -->
    <template #header>
      <slot name="header">
        <!-- 默认头部内容为空，方便扩展 -->
      </slot>
    </template>

    <!-- 自定义底部区域 -->
    <template #footer>
      <div class="list-footer" v-if="selectedCount > 0">
        <van-button 
          type="primary" 
          block 
          @click="handleBatchAction"
        >
          批量操作 ({{ selectedCount }})
        </van-button>
      </div>
    </template>
  </SdkworkApiList>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue'
import MusicListItem from './components/MusicListItem.vue'
import { MusicService } from '@/services/src/service/music'
import type { MusicVO } from '@/services/src/service/music/types'
import type { Page, Pageable } from 'sdkwork-commons-typescript'


// 组件属性
interface Props {
  /** API请求方法 - 优先使用API，否则使用MusicService */
  api?: (params: Pageable) => Promise<Page<MusicVO>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示数量 */
  pageSize?: number
  /** 音乐项唯一键字段 */
  itemKey?: string
  /** 音乐标题字段 */
  itemTitleField?: string
  /** 音乐描述字段 */
  itemDescriptionField?: string
  /** 自动加载数据 */
  autoLoad?: boolean
  /** 默认搜索关键词 */
  defaultKeyword?: string
  /** 主题模式：'dark' | 'light' | 'auto' */
  themeMode?: 'dark' | 'light' | 'auto'
  /** 是否显示边框 */
  showBorderBottom?: boolean
}

// 事件定义
interface Emits {
  (e: 'select', music: MusicVO): void
  (e: 'delete', music: MusicVO): void 
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<MusicVO>): void
  (e: 'click', music: MusicVO): void
  (e: 'batch-action', musics: MusicVO[]): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  searchable: true,
  pageSize: 10,
  itemKey: 'id',
  itemTitleField: 'title',
  itemDescriptionField: 'description',
  autoLoad: true,
  defaultKeyword: '',
  themeMode: 'auto',
  showBorderBottom: false
})

const emit = defineEmits<Emits>()

// 组件引用
const musicListRef = ref<InstanceType<typeof SdkworkApiList>>()

// 服务实例
const musicService = new MusicService()

// 查询参数
const queryParams = ref({
  keyword: props.defaultKeyword,
  ...props.params
})

// 状态数据
const totalMusics = ref(0)
const selectedCount = ref(0)
const currentPage = ref(0)
const totalPages = ref(0)
const selectedMusics = ref<MusicVO[]>([])

// 计算属性
const processingCount = computed(() => {
  return selectedMusics.value.filter(music => music.status === 'PROCESSING').length
})

// 获取API方法 - 支持两种模式：配置api时使用api，否则使用MusicService
const getApiMethod = props.api ? props.api : async (pageableParams: Pageable): Promise<Page<MusicVO>> => {
  try {
    // 创建查询参数，使用正确的QueryListParam类型
    const { keyword, ...otherParams } = queryParams.value
    const queryListParam: any = {
      keyword: keyword || '',
      ...otherParams
    }
    
    return await musicService.listByPage(queryListParam, pageableParams)
  } catch (error) {
    console.error('获取音乐列表失败:', error)
    throw error
  }
}

// 事件处理
const handleItemSelect = (music: MusicVO) => {
  emit('select', music)
  updateSelectedMusics()
  // 移除showToast调用，避免递归更新
}

const handleItemDelete = async (music: MusicVO) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除音乐"${music.title}"吗？此操作不可撤销。`
    })
    
    // 调用删除API - 支持两种模式
    if (props.api) {
      // 如果配置了api，则通过事件让父组件处理删除
      emit('delete', music)
      showToast('删除请求已发送')
    } else {
      // 否则使用MusicService的默认实现
      await musicService.delete(music.id!)
      emit('delete', music)
      showToast('音乐删除成功')
      
      // 刷新列表
      musicListRef.value?.refresh()
    }
  } catch (error) {
    // 用户取消删除或删除失败
    console.log('取消删除或删除失败')
  }
} 

const handleItemClick = (music: MusicVO) => {
  emit('click', music)
}

const handleSearch = (keyword: string) => {
  queryParams.value.keyword = keyword
  emit('search', keyword)
}

const handleLoad = (pageData: Page<MusicVO>) => {
  totalMusics.value = pageData.total || 0
  currentPage.value = pageData.pageable.pageNumber || 0
  totalPages.value = pageData.total/(pageData.pageable.pageSize||10) || 0
  emit('load', pageData)
}

const handleBatchAction = () => {
  if (selectedMusics.value.length === 0) {
    // 移除showToast调用，避免递归更新
    return
  }
  
  emit('batch-action', selectedMusics.value)
  // 移除showToast调用，避免递归更新
}

// 更新选中音乐列表
const updateSelectedMusics = () => {
  const items = musicListRef.value?.getSelectedItems() || []
  selectedMusics.value = items
  selectedCount.value = items.length
}

// 监听选中项变化 - 移除可能导致递归的监听器

// 监听参数变化
watch(() => props.params, (newParams) => {
  queryParams.value = { ...queryParams.value, ...newParams }
}, { deep: true })

// 监听默认关键词变化
watch(() => props.defaultKeyword, (newKeyword) => {
  queryParams.value.keyword = newKeyword
})

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => musicListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => musicListRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => musicListRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => musicListRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => {
    musicListRef.value?.clearSelected()
    selectedMusics.value = []
    selectedCount.value = 0
  },
  /** 设置选中项 */
  setSelectedItems: (items: MusicVO[]) => {
    musicListRef.value?.setSelectedItems(items)
    selectedMusics.value = items
    selectedCount.value = items.length
  },
  /** 设置搜索关键词 */
  setKeyword: (keyword: string) => {
    queryParams.value.keyword = keyword
    musicListRef.value?.refresh()
  },
  /** 获取音乐服务实例 */
  getService: () => musicService,
  /** 手动触发搜索 */
  search: (keyword: string) => {
    handleSearch(keyword)
  }
})
</script>

<style scoped lang="scss">
.list-header {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.list-footer {
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-top: 8px;
}

.empty-music {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty-music p {
  margin-top: 16px;
  font-size: 14px;
}

.loading-music {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
  color: #666;
}

/* Darkmode 支持 */
.sdkwork-music-list.dark-mode {
  .list-header {
    background: #1a1a1a;
    color: #ffffff;
  }

  .list-footer {
    background: #1a1a1a;
    color: #ffffff;
  }

  .empty-music {
    color: #cccccc;
  }

  .loading-music {
    color: #cccccc;
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .sdkwork-music-list:not(.light-mode) {
    .list-header {
      background: #1a1a1a;
      color: #ffffff;
    }

    .list-footer {
      background: #1a1a1a;
      color: #ffffff;
    }

    .empty-music {
      color: #cccccc;
    }

    .loading-music {
      color: #cccccc;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 6px;
  }
  
  .list-footer {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .list-header {
    padding: 8px;
  }
  
  .empty-music {
    padding: 40px 16px;
  }
  
  .loading-music {
    padding: 16px;
  }
}
</style>