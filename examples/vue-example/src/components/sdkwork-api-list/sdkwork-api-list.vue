<template>
  <div class="sdkwork-api-list" :class="themeClass">
    <!-- 空状态显示 -->
    <EmptySection v-if="isEmpty && !loading" v-bind="{ empty: true }">
      <template #empty>
        <slot name="empty" v-bind="{ empty: true }" />
      </template>
    </EmptySection>

    <!-- 数据不为空时显示虚拟滚动列表 -->
    <VirtList v-else :list="dataList" :itemKey="itemKey" :minSize="minSize" :itemGap="itemGap" :fixed="fixed" :buffer="buffer"
      :bufferTop="bufferTop" :bufferBottom="bufferBottom" :horizontal="horizontal" :scrollDistance="scrollDistance"
      :fixSelection="fixSelection" :start="start" :offset="offset" :listStyle="listStyle" :listClass="listClass"
      :itemStyle="itemStyle" :itemClass="itemClass" :renderControl="renderControl" 
      @toTop="onReachTop" @toBottom="onReachBottom" @scroll="onScroll" @itemResize="onItemResize"
      @rangeUpdate="onRangeUpdate">
      <!-- 顶部插槽 -->
      <template #header>
        <slot name="header">
           <LoadingIndicator v-if="loading && showPullRefreshIndicator" text="刷新中..." />
          <!-- 搜索区域 -->
          <SearchSection v-if="searchable" :searchable="searchable" @search="handleSearch" />
        </slot>
      </template>

      <!-- 底部插槽 -->
      <template #footer>
        <slot name="footer" />

        <!-- 底部加载更多指示器 -->
        <LoadMoreIndicator v-if="showLoadMoreIndicator" :loading="loadingMore" text="加载更多..." />
      </template>

      <!-- 顶部悬浮插槽 -->
      <template #sticky-header>
        <slot name="sticky-header" />
      </template>

      <!-- 底部悬浮插槽 -->
      <template #sticky-footer>
        <slot name="sticky-footer" />
      </template>

      <!-- 默认插槽 - 列表项内容 -->
      <template #default="{ itemData, index }">
        <ListItem :item="itemData" :index="index" :selectable="selectable" :deletable="deletable"
          :is-selected="isSelected(itemData)" :item-key="getItemKey(itemData, index)" :item-title-field="itemTitleField"
          :item-description-field="itemDescriptionField" :theme-mode="themeMode" :show-border-bottom="showBorderBottom"
          :border-bottom-left-offset="borderBottomLeftOffset" @select="handleItemSelect" @delete="handleItemDelete"
          v-slot="{ item: slotItem, index: slotIndex, selected: slotSelected }">
          <slot :item="slotItem" :index="slotIndex" :selected="slotSelected" />
        </ListItem>
      </template>
    </VirtList>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// 子组件导入
import SearchSection from './components/SearchSection.vue'
import ListItem from './components/ListItem.vue'
import EmptySection from './components/EmptySection.vue'
import LoadMoreSection from './components/LoadMoreSection.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'
import LoadMoreIndicator from './components/LoadMoreIndicator.vue'

// vue-virt-list 虚拟滚动列表组件
import { VirtList } from 'vue-virt-list'

// 通用hooks导入
import { useApiDataLoader } from './hooks/useApiDataLoader'

// 统一类型定义导入
import type {
  BaseApiComponentProps,
  BaseApiComponentEmits,
  BaseApiComponentSlots,
  ListSpecificProps
} from './types/shared'
import { DEFAULT_CONFIG } from '../sdkwork-api-list/types/shared'
// 组件属性定义
interface Props extends BaseApiComponentProps, ListSpecificProps { }

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  api: undefined,
  service: undefined,
  params: () => ({}),
  pageableParams: () => ({}),
  selectable: DEFAULT_CONFIG.selectable,
  deletable: DEFAULT_CONFIG.deletable,
  searchable: DEFAULT_CONFIG.searchable,
  pageSize: DEFAULT_CONFIG.pageSize,
  itemKey: DEFAULT_CONFIG.itemKey,
  itemTitleField: DEFAULT_CONFIG.itemTitleField,
  itemDescriptionField: DEFAULT_CONFIG.itemDescriptionField,
  themeMode: DEFAULT_CONFIG.themeMode,
  showBorderBottom: DEFAULT_CONFIG.showBorderBottom,
  borderBottomLeftOffset: DEFAULT_CONFIG.borderBottomLeftOffset,
  showNoMoreData: DEFAULT_CONFIG.showNoMoreData,
  topSpacing: DEFAULT_CONFIG.topSpacing,
  leftSpacing: DEFAULT_CONFIG.leftSpacing,
  rightSpacing: DEFAULT_CONFIG.rightSpacing,

  // vue-virt-list 虚拟滚动参数
  minSize: DEFAULT_CONFIG.minSize,
  itemGap: DEFAULT_CONFIG.itemGap,
  fixed: DEFAULT_CONFIG.fixed,
  buffer: DEFAULT_CONFIG.buffer,
  bufferTop: undefined,
  bufferBottom: undefined,
  horizontal: DEFAULT_CONFIG.horizontal,
  scrollDistance: DEFAULT_CONFIG.scrollDistance,
  fixSelection: DEFAULT_CONFIG.fixSelection,
  start: DEFAULT_CONFIG.start,
  offset: DEFAULT_CONFIG.offset,
  listStyle: DEFAULT_CONFIG.listStyle,
  listClass: DEFAULT_CONFIG.listClass,
  itemStyle: DEFAULT_CONFIG.itemStyle,
  itemClass: DEFAULT_CONFIG.itemClass,
  renderControl: undefined
})

// 事件定义
interface Emits extends BaseApiComponentEmits { }

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<BaseApiComponentSlots>()

// 响应式数据
const selectedItems = ref<any[]>([]) 

// 自定义下拉刷新状态
const showPullRefreshIndicator = ref(false)
const showLoadMoreIndicator = ref(false)
const isPulling = ref(false)
const pullDistance = ref(0)
const pullStartY = ref(0)

// Dark mode support
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
  return isDarkMode.value ? 'dark-mode' : 'light-mode'
})

// VirtList 事件处理
const onReachTop = () => {
  console.log('列表触顶')
  emit('reach-top')

  // 触顶时自动触发刷新
  if (!loading.value) {
    showPullRefreshIndicator.value = true
    loading.value = true
    onRefreshWithEvent()
  }
}

const onReachBottom = () => {
  console.log('列表触底')
  emit('reach-bottom')
  console.error('has more=======',hasMore.value,loadingMore.value)
  // 触底时自动触发加载更多
  if (hasMore.value && !loadingMore.value) {
    showLoadMoreIndicator.value = true
    onLoadMore()
  }
}

const onScroll = (event: Event) => {
  emit('scroll', event)
}

const onItemResize = (data: { id: string, newSize: number }) => {
  console.log('项尺寸变化:', data)
  emit('item-resize', data)
}

const onRangeUpdate = (data: { inViewBegin: number, inViewEnd: number }) => {
  console.log('可视区范围变更:', data)
  emit('range-update', data)
}

// 加载更多处理（手动触发）
const onLoadMore = async () => {
  if (hasMore.value && !loadingMore.value) {
    await loadDataWithEvent(currentPage.value + 1, true)
  }
}

// 使用通用数据加载器
const {
  dataList,
  currentPage,
  totalElements,
  totalPages,
  loading,
  loadingMore,
  hasMore,
  isEmpty,
  loadData,
  onRefresh
} = useApiDataLoader({
  api: props.api,
  service: props.service,
  params: props.params,
  pageableParams: props.pageableParams,
  pageSize: props.pageSize,
  autoLoad: false // 手动控制加载时机
})

// 计算顶部间距样式
const topSpacingStyle = computed(() => {
  if (typeof props.topSpacing === 'number') {
    return `${props.topSpacing}px`
  }
  return props.topSpacing
})

// 计算左侧间距样式
const leftSpacingStyle = computed(() => {
  if (typeof props.leftSpacing === 'number') {
    return `${props.leftSpacing}px`
  }
  return props.leftSpacing
})

// 计算右侧间距样式
const rightSpacingStyle = computed(() => {
  if (typeof props.rightSpacing === 'number') {
    return `${props.rightSpacing}px`
  }
  return props.rightSpacing
})

// 计算整体间距样式
const spacingStyle = computed(() => ({
  paddingTop: topSpacingStyle.value,
  paddingLeft: leftSpacingStyle.value,
  paddingRight: rightSpacingStyle.value
}))

// 获取列表项唯一键
const getItemKey = (item: any, index: number): string | number | any=> {
  return item[props.itemKey] || index
}

// 检查项是否被选中
const isSelected = (item: any): boolean => {
  return selectedItems.value.some(selected => getItemKey(selected, -1) === getItemKey(item, -1))
}



// 加载数据（包装hooks的方法，添加事件触发）
const loadDataWithEvent = async (page: number = 0, isLoadMore: boolean = false) => {
  try {

    await loadData(page, isLoadMore)
    loading.value = false
    // 触发加载完成事件
    if (dataList.value.length > 0 || page === 0) {
      emit('load', {
        content: dataList.value,
        number: currentPage.value,
        totalElements: totalElements.value,
        totalPages: totalPages.value,
        last: !hasMore.value
      })
    }
  } catch (error) {
    // 确保加载状态被重置
    loading.value = false
  }
}

// 刷新数据（包装hooks的方法）
const onRefreshWithEvent = async () => {
  try {
    loading.value = true
    await loadDataWithEvent(0)
  } catch (error) {
    console.error('刷新数据失败:', error)
    // 确保加载状态被重置
    loading.value = false
  }
}

// 搜索处理
const handleSearch = (keyword: string) => {
  emit('search', keyword)
  loadDataWithEvent(0)
}

// 项选择处理
const handleItemSelect = (item: any) => {
  if (props.selectable) {
    const itemIndex = selectedItems.value.findIndex(
      selected => getItemKey(selected, -1) === getItemKey(item, -1)
    )

    if (itemIndex > -1) {
      selectedItems.value.splice(itemIndex, 1)
    } else {
      selectedItems.value.push(item)
    }
  }
  emit('select', item)
}

// 项删除处理
const handleItemDelete = (item: any) => {
  emit('delete', item)
}

// 下拉刷新状态变化处理
const handlePullRefreshChange = (payload: { status: string; distance: number }) => {
}



// 监听参数变化
watch(() => props.params, () => {
  loadDataWithEvent(0)
}, { deep: true })

// 监听页面大小变化
watch(() => props.pageSize, () => {
  loadDataWithEvent(0)
})

// 计算列表容器高度
const calculateListHeight = () => {
  if (typeof window !== 'undefined') {
    // 获取容器元素，减去搜索区域高度（如果有）
    const container = document.querySelector('.sdkwork-api-list')
    if (container) {
      const searchHeight = props.searchable ? 60 : 0 // 搜索区域大约高度
      const containerHeight = container.clientHeight - searchHeight 
    }
  }
}

// 生命周期
onMounted(() => {
  loadDataWithEvent(0)

  // 延迟计算高度，确保DOM已渲染
  nextTick(() => {
    calculateListHeight()
  })

  // 监听窗口大小变化
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', calculateListHeight)
  }
})

onUnmounted(() => {
  // 清理事件监听
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', calculateListHeight)
  }
})

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => loadDataWithEvent(0),
  /** 加载更多数据 */
  loadMore: () => loadDataWithEvent(currentPage.value + 1, true),
  /** 获取当前数据 */
  getData: () => dataList.value,
  /** 获取选中项 */
  getSelectedItems: () => selectedItems.value,
  /** 清空选中项 */
  clearSelected: () => { selectedItems.value = [] },
  /** 设置选中项 */
  setSelectedItems: (items: any[]) => { selectedItems.value = items }
})
</script>

<style scoped lang="scss">
.sdkwork-api-list {
  height: calc(100vh - 106px);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  /* 加载状态指示器样式 */
  .loading-indicator {
    height: 60px;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-bottom: 1px solid #e0e0e0;
    backdrop-filter: blur(10px);

    .loading-content {
      display: flex;
      align-items: center;
      gap: 12px;

      .loading-icon {
        font-size: 20px;
        color: #007AFF;
        animation: spin 1s linear infinite;
        font-weight: bold;
      }

      .loading-text {
        font-size: 16px;
        color: #007AFF;
        font-weight: 500;
      }
    }
  }

  /* 旋转动画 */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .list-content {
    flex: 1;
    overflow-y: auto;

    /* vue-virt-list 样式调整 */
    :deep(.vue-virt-list) {
      height: 100%;

      .vue-virt-list-scroller {
        height: 100%;
      }

      .vue-virt-list-item {
        box-sizing: border-box;
      }
    }
  }
}

/* Darkmode 支持 */
.sdkwork-api-list.dark-mode {
  background: #000000;
  color: #ffffff;

  .loading-indicator {
    background: rgba(0, 0, 0, 0.95);
    border-bottom: 1px solid #333;

    .loading-content {
      .loading-icon {
        color: #0A84FF;
      }

      .loading-text {
        color: #0A84FF;
      }
    }
  }

  .list-content {
    background: #000000;

    :deep(.vue-virt-list) {
      background: #000000;
    }
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .sdkwork-api-list:not(.light-mode) {
    background: #000000;
    color: #ffffff;

    .list-content {
      background: #000000;

      :deep(.vue-virt-list) {
        background: #000000;
      }
    }
  }
}
</style>