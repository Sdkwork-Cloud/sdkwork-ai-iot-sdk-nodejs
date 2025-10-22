<template>
  <div 
    class="sdkwork-api-tab-list"
    :class="themeClass"
  >
    <!-- 顶部Tabs区域 -->
    <div v-if="showTabs" class="tab-section">
      <van-tabs 
        v-model:active="activeTab" 
        :sticky="tabsSticky"
        :swipeable="tabsSwipeable"
        @change="handleTabChange"
      >
        <van-tab 
          v-for="tab in tabsData" 
          :key="getTabKey(tab)" 
          :title="getTabTitle(tab)"
          :name="getTabValue(tab)"
        >
          <!-- Tab内容区域 -->
          <div class="tab-content">
            <!-- 搜索区域 -->
            <SearchSection
              v-if="searchable"
              :searchable="searchable"
              @search="handleSearch"
            />

            <!-- 下拉刷新和列表区域 -->
            <sdkwork-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <!-- 列表内容 -->
              <div class="list-content">
                <!-- 空状态 -->
                <EmptySection
                  v-if="!loading && !dataList.length"
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
                    :show-border-bottom="props.showBorderBottom"
                    :border-bottom-left-offset="props.borderBottomLeftOffset"
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
                    ref="loadMoreSectionRef"
                  />
                </div>
              </div>
            </sdkwork-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 无Tabs时的普通列表 -->
    <div v-else class="no-tab-section">
      <!-- 搜索区域 -->
      <SearchSection
        v-if="searchable"
        :searchable="searchable"
        @search="handleSearch"
      />

      <!-- 下拉刷新和列表区域 -->
      <sdkwork-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <!-- 列表内容 -->
        <div class="list-content">
          <!-- 空状态 -->
          <EmptySection
            v-if="!loading && !dataList.length"
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
              ref="loadMoreSectionRef"
            />
          </div>
        </div>
      </sdkwork-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 子组件导入
import SearchSection from '../sdkwork-api-list/components/SearchSection.vue'
import ListItem from '../sdkwork-api-list/components/ListItem.vue'
import LoadingSection from '../sdkwork-api-list/components/LoadingSection.vue'
import EmptySection from '../sdkwork-api-list/components/EmptySection.vue'
import LoadMoreSection from '../sdkwork-api-list/components/LoadMoreSection.vue'

// Tab数据类型定义
interface TabItem {
  value: string | number
  title: string
  params?: Record<string, any>
  [key: string]: any
}

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
  /** Tabs数据数组 */
  tabs?: TabItem[]
  /** Tabs API方法 */
  tabsApi?: () => Promise<TabItem[]>
  /** Tabs字段映射配置 */
  tabsFieldMap?: {
    value?: string
    title?: string
    params?: string
  }
  /** Tabs是否粘性定位 */
  tabsSticky?: boolean
  /** Tabs是否支持滑动切换 */
  tabsSwipeable?: boolean
  /** 默认激活的Tab */
  defaultActiveTab?: string | number
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
  tabs: () => [],
  tabsSticky: true,
  tabsSwipeable: true,
  defaultActiveTab: ''
})

// 事件定义
interface Emits {
  (e: 'select', item: any): void
  (e: 'delete', item: any): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<any>): void
  (e: 'tab-change', tab: TabItem, params: Record<string, any>): void
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
  /** Tab标题自定义插槽 */
  'tab-title'?: (props: { tab: TabItem }) => any
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
const activeTab = ref<string | number>(props.defaultActiveTab)
const tabsData = ref<TabItem[]>([])
const tabsLoading = ref(false)

// 深色模式检测
const isDarkMode = ref(false)

// 检测系统深色模式偏好
const detectSystemDarkMode = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// 更新主题
const updateTheme = () => {
  if (props.themeMode === 'dark') {
    isDarkMode.value = true
  } else if (props.themeMode === 'light') {
    isDarkMode.value = false
  } else if (props.themeMode === 'auto') {
    isDarkMode.value = detectSystemDarkMode()
  }
}

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'dark-mode' : 'light-mode'
})

// DOM引用
const loadMoreSectionRef = ref<InstanceType<typeof LoadMoreSection>>()

// 观察器实例
let observer: IntersectionObserver | null = null

// 计算属性
const isEmpty = computed(() => !loading.value && dataList.value.length === 0)
const isFirstLoad = computed(() => currentPage.value === 0 && dataList.value.length === 0)
const showTabs = computed(() => tabsData.value.length > 0)

// 当前Tab的参数
const currentTabParams = computed(() => {
  if (!showTabs.value) return props.params
  
  const currentTab = tabsData.value.find(tab => getTabValue(tab) === activeTab.value)
  return {
    ...props.params,
    ...(currentTab?.params || {})
  }
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

// Tab切换处理
const handleTabChange = (name: string | number) => {
  activeTab.value = name
  const currentTab = tabsData.value.find(tab => getTabValue(tab) === name)
  
  if (currentTab) {
    emit('tab-change', currentTab, currentTab.params || {})
    loadData(0)
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
.sdkwork-api-tab-list {
  height: 100%;
  display: flex;
  flex-direction: column; 

  .tab-section {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.van-tabs) {
      flex: 1;
      display: flex;
      flex-direction: column;

      .van-tabs__content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .van-tab__pane {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }

    .tab-content {
      flex: 1;
      display: flex;
      flex-direction: column;
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
  }
}

/* Darkmode 支持 */
.sdkwork-api-tab-list.dark-mode {
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