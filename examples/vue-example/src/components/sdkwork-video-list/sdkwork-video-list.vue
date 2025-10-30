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
    @select="handleItemSelect"
    @delete="handleItemDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义视频项内容 -->
    <template #default="{ item, index, selected }">
      <VideoListItem
        :video="item"
        :index="index"
        :selected="selected"
        :selectable="selectable"
        :deletable="deletable"
        @select="handleItemSelect"
        @delete="handleItemDelete"
        @click="handleItemClick"
      />
    </template>

    <!-- 自定义空状态 -->
    <template #empty>
      <div class="empty-video">
        <van-icon name="video-o" size="48" />
        <p>暂无视频</p>
      </div>
    </template>

    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="loading-video">
        <van-loading size="24px" />
        <span>加载视频中...</span>
      </div>
    </template>

    <!-- 自定义头部区域 -->
    <template #header>
      <div class="list-header">
        <van-tag type="primary">视频总数: {{ totalVideos }}</van-tag>
        <van-tag type="success">选中: {{ selectedCount }}</van-tag>
        <van-tag type="warning">当前页: {{ currentPage + 1 }}/{{ totalPages }}</van-tag>
        <van-tag type="danger" v-if="processingCount > 0">处理中: {{ processingCount }}</van-tag>
      </div>
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
import VideoListItem from './components/VideoListItem.vue'
import { VideoService } from '@/services/src/service/video'
import type { VideoVO } from '@/services/src/service/video/types'
import type { Page, Pageable } from 'sdkwork-commons-typescript'


// 组件属性
interface Props {
  /** API请求方法 - 优先使用API，否则使用VideoService */
  api?: (params: Pageable) => Promise<Page<VideoVO>>
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
  /** 视频项唯一键字段 */
  itemKey?: string
  /** 视频标题字段 */
  itemTitleField?: string
  /** 视频描述字段 */
  itemDescriptionField?: string
  /** 自动加载数据 */
  autoLoad?: boolean
  /** 默认搜索关键词 */
  defaultKeyword?: string
}

// 事件定义
interface Emits {
  (e: 'select', video: VideoVO): void
  (e: 'delete', video: VideoVO): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<VideoVO>): void
  (e: 'click', video: VideoVO): void
  (e: 'batch-action', videos: VideoVO[]): void
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
  defaultKeyword: ''
})

const emit = defineEmits<Emits>()

// 组件引用
const videoListRef = ref<InstanceType<typeof SdkworkApiList>>()

// 服务实例
const videoService = new VideoService()

// 查询参数
const queryParams = ref({
  keyword: props.defaultKeyword,
  ...props.params
})

// 状态数据
const totalVideos = ref(0)
const selectedCount = ref(0)
const currentPage = ref(0)
const totalPages = ref(0)
const selectedVideos = ref<VideoVO[]>([])

// 计算属性
const processingCount = computed(() => {
  return selectedVideos.value.filter(video => video.status === 'PROCESSING').length
})

// 获取API方法 - 支持两种模式：配置api时使用api，否则使用VideoService
const getApiMethod = props.api ? props.api : async (pageableParams: Pageable): Promise<Page<VideoVO>> => {
  try {
    // 创建查询参数，使用正确的QueryListParam类型
    const { keyword, ...otherParams } = queryParams.value
    const queryListParam: any = {
      keyword: keyword || '',
      ...otherParams
    }
    
    return await videoService.listByPage(queryListParam, pageableParams)
  } catch (error) {
    console.error('获取视频列表失败:', error)
    throw error
  }
}

// 事件处理
const handleItemSelect = (video: VideoVO) => {
  emit('select', video)
  updateSelectedVideos()
  showToast(`已选择: ${video.title}`)
}

const handleItemDelete = async (video: VideoVO) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除视频"${video.title}"吗？此操作不可撤销。`
    })
    
    // 调用删除API - 支持两种模式
    if (props.api) {
      // 如果配置了api，则通过事件让父组件处理删除
      emit('delete', video)
      showToast('删除请求已发送')
    } else {
      // 否则使用VideoService的默认实现
      await videoService.delete(video.id!)
      emit('delete', video)
      showToast('视频删除成功')
      
      // 刷新列表
      videoListRef.value?.refresh()
    }
  } catch (error) {
    // 用户取消删除或删除失败
    console.log('取消删除或删除失败')
  }
}

const handleItemClick = (video: VideoVO) => {
  emit('click', video)
}

const handleSearch = (keyword: string) => {
  queryParams.value.keyword = keyword
  emit('search', keyword)
}

const handleLoad = (pageData: Page<VideoVO>) => {
  totalVideos.value = pageData.total || 0
  currentPage.value = pageData.pageable.pageNumber || 0
  totalPages.value = pageData.total/(pageData.pageable.pageSize||10) || 0
  emit('load', pageData)
}

const handleBatchAction = () => {
  if (selectedVideos.value.length === 0) {
    showToast('请先选择视频')
    return
  }
  
  emit('batch-action', selectedVideos.value)
  showToast(`已选择 ${selectedVideos.value.length} 个视频进行批量操作`)
}

// 更新选中视频列表
const updateSelectedVideos = () => {
  const items = videoListRef.value?.getSelectedItems() || []
  selectedVideos.value = items
  selectedCount.value = items.length
}

// 监听选中项变化
watch(selectedCount, () => {
  updateSelectedVideos()
})

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
  refresh: () => videoListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => videoListRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => videoListRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => videoListRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => {
    videoListRef.value?.clearSelected()
    selectedVideos.value = []
    selectedCount.value = 0
  },
  /** 设置选中项 */
  setSelectedItems: (items: VideoVO[]) => {
    videoListRef.value?.setSelectedItems(items)
    selectedVideos.value = items
    selectedCount.value = items.length
  },
  /** 设置搜索关键词 */
  setKeyword: (keyword: string) => {
    queryParams.value.keyword = keyword
    videoListRef.value?.refresh()
  },
  /** 获取视频服务实例 */
  getService: () => videoService,
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

.empty-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty-video p {
  margin-top: 16px;
  font-size: 14px;
}

.loading-video {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
  color: #666;
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
  
  .empty-video {
    padding: 40px 16px;
  }
  
  .loading-video {
    padding: 16px;
  }
}
</style>