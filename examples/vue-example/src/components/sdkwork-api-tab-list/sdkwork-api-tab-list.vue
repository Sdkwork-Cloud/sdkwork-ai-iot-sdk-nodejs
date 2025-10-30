<template>
  <div class="sdkwork-api-tab-list" :class="themeClass">
    <!-- 顶部Tabs区域 -->
    <div v-if="showTabs" class="tab-section">
      <van-tabs v-model:active="activeTab" :sticky="tabsSticky" :swipeable="tabsSwipeable" @change="handleTabChange">
        <van-tab v-for="tab in tabsData" :key="getTabKey(tab)" :title="getTabTitle(tab)" :name="getTabValue(tab)">
          <!-- Tab内容区域 -->
          <div class="tab-content">
            <!-- 搜索区域 -->
            <SearchSection v-if="searchable" :searchable="searchable" @search="handleSearch" />

            <!-- 下拉刷新和列表区域 -->
            <SdkworkPullRefresh v-model="loading" @refresh="handleRefresh">
              <!-- 列表内容 -->
              <div class="list-content">
                <!-- 空状态 -->
                <EmptySection v-if="!loading && !dataList.length" v-slot="{ empty }">
                  <slot name="empty" v-bind="{ empty }" />
                </EmptySection>

                <!-- 数据列表 -->
                <div v-else class="data-section">
                  <!-- 顶部插槽 -->
                  <slot name="header" />

                  <!-- 列表项 -->
                  <ListItem v-for="(item, index) in dataList" :key="getItemKey(item, index)" :item="item" :index="index"
                    :selectable="selectable" :deletable="deletable" :is-selected="isSelected(item)" :item-key="itemKey"
                    :item-title-field="itemTitleField" :item-description-field="itemDescriptionField"
                    :show-border-bottom="props.showBorderBottom"
                    :border-bottom-left-offset="props.borderBottomLeftOffset" @select="handleItemSelect"
                    @delete="handleItemDelete" v-slot="{ item: slotItem, index: slotIndex, selected: slotSelected }">
                    <slot :item="slotItem" :index="slotIndex" :selected="slotSelected" />
                  </ListItem>

                  <!-- 底部插槽 -->
                  <slot name="footer" />

                  <!-- 加载更多指示器 -->
                  <LoadMoreSection :has-more="hasMore" :loading-more="loadingMore" :data-list="dataList"
                    ref="loadMoreSectionRef" />
                </div>
              </div>
            </SdkworkPullRefresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 无Tabs时的普通列表 -->
    <div v-else class="no-tab-section">
      <!-- 搜索区域 -->
      <SearchSection v-if="searchable" :searchable="searchable" @search="handleSearch" />

      <!-- 下拉刷新和列表区域 -->
      <SdkworkPullRefresh v-model="loading" @refresh="handleRefresh">
        <!-- 列表内容 -->
        <div class="list-content">
          <!-- 空状态 -->
          <EmptySection v-if="!loading && !dataList.length" v-slot="{ empty }">
            <slot name="empty" v-bind="{ empty }" />
          </EmptySection>

          <!-- 数据列表 -->
          <div v-else class="data-section">
            <!-- 顶部插槽 -->
            <slot name="header" />

            <!-- 列表项 -->
            <ListItem v-for="(item, index) in dataList" :key="getItemKey(item, index)" :item="item" :index="index"
              :selectable="selectable" :deletable="deletable" :is-selected="isSelected(item)" :item-key="itemKey"
              :item-title-field="itemTitleField" :item-description-field="itemDescriptionField"
              @select="handleItemSelect" @delete="handleItemDelete"
              v-slot="{ item: slotItem, index: slotIndex, selected: slotSelected }">
              <slot :item="slotItem" :index="slotIndex" :selected="slotSelected" />
            </ListItem>

            <!-- 底部插槽 -->
            <slot name="footer" />

            <!-- 加载更多指示器 -->
            <LoadMoreSection :has-more="hasMore" :loading-more="loadingMore" :data-list="dataList"
              ref="loadMoreSectionRef" />
          </div>
        </div>
      </SdkworkPullRefresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { CURDService, Page, Pageable } from 'sdkwork-commons-typescript'

// 子组件导入
import SearchSection from '../sdkwork-api-list/components/SearchSection.vue'
import ListItem from '../sdkwork-api-list/components/ListItem.vue'
import LoadingSection from '../sdkwork-api-list/components/LoadingSection.vue'
import EmptySection from '../sdkwork-api-list/components/EmptySection.vue'
import LoadMoreSection from '../sdkwork-api-list/components/LoadMoreSection.vue'

// 通用hooks导入
import { useApiDataLoader } from '../sdkwork-api-list/hooks/useApiDataLoader'

// 统一类型定义导入
import type {
  BaseApiComponentProps,
  BaseApiComponentEmits,
  BaseApiComponentSlots,
  TabItem,
  TabSpecificProps
} from '../sdkwork-api-list/types/shared'
import { DEFAULT_CONFIG } from '../sdkwork-api-list/types/shared'

// 组件属性定义
interface Props extends BaseApiComponentProps, TabSpecificProps { }

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
  tabs: () => [],
  tabsSticky: DEFAULT_CONFIG.tabsSticky,
  tabsSwipeable: DEFAULT_CONFIG.tabsSwipeable,
  topSpacing: DEFAULT_CONFIG.topSpacing,
  leftSpacing: DEFAULT_CONFIG.leftSpacing,
  rightSpacing: DEFAULT_CONFIG.rightSpacing
})

// 事件定义
interface Emits extends BaseApiComponentEmits {
  (e: 'tab-change', tab: TabItem, params: Record<string, any>): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<BaseApiComponentSlots & {
  /** Tab标题自定义插槽 */
  'tab-title'?: (props: { tab: TabItem }) => any
}>()

// 响应式数据
const selectedItems = ref<any[]>([])
const activeTab = ref<string | number | any>(props.defaultActiveTab)
const tabsData = ref<TabItem[]>([])
const tabsLoading = ref(false)
// 计算属性
const showTabs = computed(() => tabsData.value.length > 0)
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
  return isDarkMode.value ? 'api-tab-list--dark' : 'api-tab-list--light'
})

// DOM引用
const loadMoreSectionRef = ref<InstanceType<typeof LoadMoreSection>>()

// 观察器实例
let observer: IntersectionObserver | null = null
// 当前Tab的参数
const currentTabParams = computed(() => {
  if (!showTabs.value) return props.params

  const currentTab = tabsData.value.find(tab => getTabValue(tab) === activeTab.value)
  return {
    ...props.params,
    ...(currentTab?.params || {})
  }
})

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
  isFirstLoad,
  loadData,
  onRefresh
} = useApiDataLoader({
  api: props.api,
  service: props.service,
  params: currentTabParams,
  pageableParams: props.pageableParams,
  pageSize: props.pageSize,
  autoLoad: false // 手动控制加载时机
})




// 获取列表项唯一键
const getItemKey = (item: any, index: number): string | number => {
  return item[props.itemKey] || index
}

// 检查项是否被选中
const isSelected = (item: any): boolean => {
  return selectedItems.value.some(selected => getItemKey(selected, -1) === getItemKey(item, -1))
}

// 获取Tab的唯一键
const getTabKey = (tab: TabItem): string | number => {
  return getTabValue(tab)
}

// 获取Tab的显示标题
const getTabTitle = (tab: TabItem): string => {
  return tab.title || String(tab.value)
}

// 获取Tab的值
const getTabValue = (tab: TabItem): string | number => {
  return tab.value
}

// 构建请求参数
const buildRequestParams = (page: number = 0): Pageable => {
  const baseParams: Pageable = {
    page,
    size: props.pageSize,
    ...currentTabParams.value
  }

  return baseParams
}

// 加载Tabs数据
const loadTabsData = async () => {
  if (props.tabsApi) {
    try {
      tabsLoading.value = true
      const data = await props.tabsApi()
      tabsData.value = data

      // 设置默认激活的Tab
      if (tabsData.value.length > 0 && !activeTab.value) {
        activeTab.value = getTabValue(tabsData.value[0])
      }
    } catch (error) {
      console.error('加载Tabs数据失败:', error)
    } finally {
      tabsLoading.value = false
    }
  } else if (props.tabs.length > 0) {
    tabsData.value = props.tabs

    // 设置默认激活的Tab
    if (tabsData.value.length > 0 && !activeTab.value) {
      activeTab.value = getTabValue(tabsData.value[0])
    }
  }
}

// 加载数据（包装hooks的方法，添加事件触发）
const loadDataWithEvent = async (page: number = 0, isLoadMore: boolean = false) => {
  try {
    await loadData(page, isLoadMore)

    // 触发加载完成事件
    if (dataList.value.length > 0 || page === 0) {
      emit('load', {
        content: dataList.value,
        number: currentPage.value,
        totalElements: totalElements.value,
        totalPages: totalPages.value,
        last: !hasMore.value,
        empty: dataList.value.length === 0,
        first: currentPage.value === 0,
        numberOfElements: dataList.value.length,
        size: props.pageSize
      })
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 刷新数据包装器
const handleRefresh = () => {
  loadDataWithEvent(0)
}

// 搜索处理
const handleSearch = (keyword: string) => {
  emit('search', keyword)
  loadDataWithEvent(0)
}

// Tab切换处理
const handleTabChange = (name: string | number) => {
  activeTab.value = name
  const currentTab = tabsData.value.find(tab => getTabValue(tab) === name)

  if (currentTab) {
    emit('tab-change', currentTab, currentTab.params || {})
    loadDataWithEvent(0)
  }
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
  if (!loadMoreSectionRef.value?.$el) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore.value && !loadingMore.value && !loading.value) {
          loadDataWithEvent(currentPage.value + 1, true)
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

// 监听Tab切换
watch(activeTab, () => {
  loadData(0)
})

// 生命周期
onMounted(() => {
  loadTabsData().then(() => {
    loadData(0)
    nextTick(() => {
      initObserver()
    })
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
  setSelectedItems: (items: any[]) => { selectedItems.value = items },
  /** 获取当前激活的Tab */
  getActiveTab: () => activeTab.value,
  /** 设置激活的Tab */
  setActiveTab: (tabName: string | number) => { activeTab.value = tabName },
  /** 获取Tabs数据 */
  getTabsData: () => tabsData.value
})
</script>

<style scoped lang="scss">
:deep(.van-tabs) {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;

  .van-tabs__wrap {
    flex-shrink: 0;
    /* 防止tabs导航栏被压缩 */
  }

  .van-tabs__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100% - 44px);
    /* 减去tabs导航栏高度 */
    min-height: 0;
    /* 允许内容区域收缩 */
  }
  .van-tab__panel,
  .van-tab__pane,
  .van-tab__pane-wrapper {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    min-height: 100% !important;
    overflow: hidden !important;
    position: relative !important;
  }

  .van-tab__pane>* {
    flex: 1;
    height: 100%;
  }
}

.sdkwork-api-tab-list {
  height: 100%;
  display: flex;
  flex-direction: column;



  .tab-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    /* 使用视口高度确保容器有明确高度 */
    min-height: 100%;



    .tab-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100% !important;
      min-height: 100%;
      overflow: hidden;
    }
  }

  .no-tab-section {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .list-content {
    flex: 1;
    overflow-y: auto;
    height: 100%;
  }
}

/* Darkmode 支持 */
.sdkwork-api-tab-list.dark-mode {
  background: #000000;
  color: #ffffff;

  .list-content {
    background: #000000;
    height: 100%;
  }

  /* Tabs深色模式样式 */
  :deep(.van-tabs) {
    --van-tabs-nav-background: #1a1a1a;
    --van-tab-active-color: #409eff;
    --van-tab-text-color: #e0e0e0;
    --van-tab-disabled-text-color: #666;
    --van-tabs-bottom-bar-color: #409eff;
    --van-tabs-nav-background-color: #1a1a1a;
    --van-tab-background-color: #1a1a1a;
  }

  :deep(.van-tab) {
    background-color: #1a1a1a;
    color: #e0e0e0;

    &.van-tab--active {
      color: #409eff;
    }
  }

  :deep(.van-tabs__nav) {
    background-color: #1a1a1a;
  }

  :deep(.van-tabs__line) {
    background-color: #409eff;
  }

  :deep(.van-tabs__content) {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .sdkwork-api-tab-list:not(.light-mode) {
    background: #000000;
    color: #ffffff;

    .list-content {
      background: #000000;
    }

    /* Tabs深色模式样式 */
    :deep(.van-tabs) {
      --van-tabs-nav-background: #1a1a1a;
      --van-tab-active-color: #409eff;
      --van-tab-text-color: #e0e0e0;
      --van-tab-disabled-text-color: #666;
      --van-tabs-bottom-bar-color: #409eff;
      --van-tabs-nav-background-color: #1a1a1a;
      --van-tab-background-color: #1a1a1a;
    }

    :deep(.van-tab) {
      background-color: #1a1a1a;
      color: #e0e0e0;

      &.van-tab--active {
        color: #409eff;
      }
    }

    :deep(.van-tabs__nav) {
      background-color: #1a1a1a;
    }

    :deep(.van-tabs__line) {
      background-color: #409eff;
    }

    :deep(.van-tabs__content) {
      background-color: #1a1a1a;
      color: #e0e0e0;
    }
  }
}
</style>