<template>
  <div 
    class="sdkwork-api-list"
    :class="props.themeMode"
  >
    <!-- 搜索区域 -->
    <SearchSection
      v-if="searchable"
      :searchable="searchable"
      @search="handleSearch"
    />

    <!-- 下拉刷新和列表区域 -->
    <sdkwork-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 列表内容 -->
      <div class="list-content" :style="spacingStyle">
        <!-- 加载状态 -->
        <LoadingSection
          v-if="loading && !dataList.length"
          v-slot="{ loading }"
        >
          <slot name="loading" v-bind="{ loading }" />
        </LoadingSection>

        <!-- 空状态 -->
        <EmptySection
          v-else-if="!loading && !dataList.length"
          v-slot="{ empty }"
        >
          <slot name="empty" v-bind="{ empty }" />
        </EmptySection>

        <!-- 数据列表 -->
        <div v-else class="data-section">
          <!-- 顶部插槽 -->
          <slot name="header" />

          <!-- 列表项 -->
          <ListItem
            v-for="(item, index) in dataList"
            :key="getItemKey(item, index)"
            :item="item"
            :index="index"
            :selectable="selectable"
            :deletable="deletable"
            :is-selected="isSelected(item)"
            :item-key="itemKey"
            :item-title-field="itemTitleField"
            :item-description-field="itemDescriptionField"
            :theme-mode="themeMode"
            :show-border-bottom="showBorderBottom"
            :border-bottom-left-offset="borderBottomLeftOffset"
            @select="handleItemSelect"
            @delete="handleItemDelete"
            v-slot="{ item: slotItem, index: slotIndex, selected: slotSelected }"
          >
            <slot :item="slotItem" :index="slotIndex" :selected="slotSelected" />
          </ListItem>

          <!-- 底部插槽 -->
          <slot name="footer" />

          <!-- 加载更多指示器 -->
          <LoadMoreSection
            :has-more="hasMore"
            :loading-more="loadingMore"
            :data-list="dataList"
            :show-no-more-data="showNoMoreData"
            ref="loadMoreSectionRef"
          />
        </div>
      </div>
    </sdkwork-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 子组件导入
import SearchSection from './components/SearchSection.vue'
import ListItem from './components/ListItem.vue'
import LoadingSection from './components/LoadingSection.vue'
import EmptySection from './components/EmptySection.vue'
import LoadMoreSection from './components/LoadMoreSection.vue'

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<any>>
  /** 请求参数 */
  params?: Record<string, any>
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
  /** 主题模式：'dark' | 'light' | 'auto' */
  themeMode?: 'dark' | 'light' | 'auto'
  /** 是否显示底部边框 */
  showBorderBottom?: boolean
  /** 底部边框距离左边的偏移量（像素） */
  borderBottomLeftOffset?: number
  /** 是否显示"没有更多数据了"的提示 */
  showNoMoreData?: boolean
  /** 顶部间距，支持CSS单位（如px, rem, vh等），默认16px */
  topSpacing?: string | number
  /** 左侧间距，支持CSS单位（如px, rem, vh等），默认0 */
  leftSpacing?: string | number
  /** 右侧间距，支持CSS单位（如px, rem, vh等），默认0 */
  rightSpacing?: string | number
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  selectable: false,
  deletable: false,
  searchable: false,
  pageSize: 10,
  itemKey: 'id',
  itemTitleField: 'name',
  itemDescriptionField: 'description',
  themeMode: 'auto',
  showBorderBottom: true,
  borderBottomLeftOffset: 0,
  showNoMoreData: false,
  topSpacing: '6px',
  leftSpacing: '8px',
  rightSpacing: '8px'
})

// 事件定义
interface Emits {
  (e: 'select', item: any): void
  (e: 'delete', item: any): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<any>): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义列表项内容 */
  default(props: { item: any; index: number; selected: boolean }): any
  /** 头部插槽 - 列表顶部区域 */
  header?: () => any
  /** 底部插槽 - 列表底部区域 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
}>()

// 响应式数据
const dataList = ref<any[]>([])
const currentPage = ref(0)
const totalElements = ref(0)
const totalPages = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const refreshing = ref(false)
const selectedItems = ref<any[]>([])
const hasMore = ref(true)

// DOM引用
const loadMoreSectionRef = ref<InstanceType<typeof LoadMoreSection>>()

// 观察器实例
let observer: IntersectionObserver | null = null

// 计算属性
const isEmpty = computed(() => !loading.value && dataList.value.length === 0)
const isFirstLoad = computed(() => currentPage.value === 0 && dataList.value.length === 0)

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
const getItemKey = (item: any, index: number): string | number => {
  return item[props.itemKey] || index
}

// 检查项是否被选中
const isSelected = (item: any): boolean => {
  return selectedItems.value.some(selected => getItemKey(selected, -1) === getItemKey(item, -1))
}

// 构建请求参数
const buildRequestParams = (page: number = 0): Pageable => {
  const baseParams: Pageable = {
    page,
    size: props.pageSize,
    ...props.params
  }

  return baseParams
}

// 加载数据
const loadData = async (page: number = 0, isLoadMore: boolean = false) => {
  if (loading.value && !isLoadMore) return

  try {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
    }

    const params = buildRequestParams(page)
    const response = await props.api(params)

    // 处理响应数据
    if (page === 0) {
      dataList.value = response.content || []
    } else {
      dataList.value = [...dataList.value, ...(response.content || [])]
    }

    currentPage.value = response.number || 0
    totalElements.value = response.totalElements || 0
    totalPages.value = response.totalPages || 0
    hasMore.value = !response.last && (response.number || 0) < (response.totalPages || 0) - 1

    // 触发加载完成事件
    emit('load', response)
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
    refreshing.value = false
  }
}

// 刷新数据
const onRefresh = () => {
  refreshing.value = true
  loadData(0)
}

// 搜索处理
const handleSearch = (keyword: string) => {
  emit('search', keyword)
  loadData(0)
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

// 初始化观察器
const initObserver = () => {
  if (!loadMoreSectionRef.value?.$el) {
    // 如果元素不存在，延迟重试
    setTimeout(() => {
      if (loadMoreSectionRef.value?.$el) {
        initObserver()
      }
    }, 100)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore.value && !loadingMore.value && !loading.value) {
          loadData(currentPage.value + 1, true)
        }
      })
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }
  )

  observer.observe(loadMoreSectionRef.value.$el)
}

// 销毁观察器
const destroyObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// 监听参数变化
watch(() => props.params, () => {
  loadData(0)
}, { deep: true })

// 监听页面大小变化
watch(() => props.pageSize, () => {
  loadData(0)
})

// 生命周期
onMounted(() => {
  loadData(0)
  nextTick(() => {
    initObserver()
  })
})

onUnmounted(() => {
  destroyObserver()
})

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => loadData(0),
  /** 加载更多数据 */
  loadMore: () => loadData(currentPage.value + 1, true),
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
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  /* 确保 sdkwork-pull-refresh 使用最大高度 */
  :deep(.sdkwork-pull-refresh) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .list-content {
    flex: 1;
    overflow-y: auto;
  }
}

/* Darkmode 支持 */
.sdkwork-api-list.dark-mode {
  background: #000000;
  color: #ffffff;

  .list-content {
    background: #000000;
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .sdkwork-api-list:not(.light-mode) {
    background: #000000;
    color: #ffffff;

    .list-content {
      background: #000000;
    }
  }
}
</style>