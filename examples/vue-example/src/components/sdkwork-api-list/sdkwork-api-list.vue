<template>
  <div class="sdkwork-api-list" :class="themeClass">
    <!-- 空状态显示 -->
    <EmptySection v-if="isEmpty && !loading" v-bind="{ empty: true }">
      <template #empty>
        <slot name="empty" v-bind="{ empty: true }" />
      </template>
    </EmptySection>

    <!-- 数据不为空时显示vant列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefreshWithEvent" v-else>
      <van-list
        v-model:loading="loading"
        :finished="!hasMore"
        finished-text="没有更多了"
        @load="onLoadMore"
        :immediate-check="false"
        :offset="300"
      >
        <!-- 顶部插槽 -->
        <template #header>
          <slot name="header">
            <!-- 搜索区域 -->
            <SearchSection v-if="searchable" :searchable="searchable" @search="handleSearch" />
          </slot>
        </template>

        <!-- 列表项内容 -->
        <div v-for="(itemData, index) in dataList" :key="getItemKey(itemData, index)">
          <ListItem :item="itemData" :index="index" :selectable="selectable" :deletable="deletable"
            :is-selected="isSelected(itemData)" :item-key="getItemKey(itemData, index)" :item-title-field="itemTitleField"
            :item-description-field="itemDescriptionField" :theme-mode="themeMode" :show-border-bottom="showBorderBottom"
            :border-bottom-left-offset="borderBottomLeftOffset" @select="handleItemSelect" @delete="handleItemDelete"
            v-slot="{ item: slotItem, index: slotIndex, selected: slotSelected }">
            <slot :item="slotItem" :index="slotIndex" :selected="slotSelected" />
          </ListItem>
        </div>

        <!-- 底部插槽 -->
        <template #footer>
          <slot name="footer" />
        </template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// 子组件导入
import SearchSection from './components/SearchSection.vue'
import ListItem from './components/ListItem.vue'
import EmptySection from './components/EmptySection.vue'

// vant 组件导入
import { PullRefresh, List } from 'vant'

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


})

// 事件定义
interface Emits extends BaseApiComponentEmits { }

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<BaseApiComponentSlots>()

// 响应式数据
const selectedItems = ref<any[]>([]) 

// vant 下拉刷新状态
const refreshing = ref(false)

// 防止初始化时连续加载的标志
const isInitialized = ref(false)
const preventAutoLoadMore = ref(false)
const lastLoadMoreTime = ref(0)
const LOAD_MORE_DEBOUNCE = 2000 // 增加到2秒防抖 

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

// vant 列表事件处理 - 加载更多
const onLoadMore = async () => {
  console.error('onLoadMore===============')
  
  // 防止重复加载：如果已经在加载中或没有更多数据，直接返回
  if (loading.value || loadingMore.value || !hasMore.value) {
    console.error('阻止重复加载，当前状态:', { loading: loading.value, loadingMore: loadingMore.value, hasMore: hasMore.value })
    return
  }
  
  // 设置加载更多状态（不是loading状态）
  loadingMore.value = true
  
  await loadDataWithEvent(currentPage.value + 1, true)
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
  autoLoad: true // 启用自动加载第一页数据，确保van-list有内容可以触发@load事件
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
  // 确保key的唯一性，优先使用item的id字段，如果不存在则使用index
  // 但需要确保即使item[props.itemKey]为falsy值（如0、''、null、undefined）也能正确处理
  const keyValue = item[props.itemKey]
  if (keyValue !== undefined && keyValue !== null && keyValue !== '') {
    return keyValue
  }
  // 如果itemKey字段不存在或为空，使用索引作为key，但需要确保唯一性
  return `index_${index}`
}

// 检查项是否被选中
const isSelected = (item: any): boolean => {
  return selectedItems.value.some(selected => getItemKey(selected, -1) === getItemKey(item, -1))
}



// 加载数据（包装hooks的方法，添加事件触发）
const loadDataWithEvent = async (page: number = 0, isLoadMore: boolean = false) => {
  try {
    // 记录加载前的数据长度，用于判断是否有新数据
    const prevDataLength = dataList.value.length
    
    await loadData(page, isLoadMore)
    
    // 只有在有数据变化时才触发load事件
    // 对于第一页加载或数据长度有变化时触发
    const hasDataChange = page === 0 || dataList.value.length !== prevDataLength
    
    if (hasDataChange) {
      emit('load', {
        content: dataList.value,
        number: currentPage.value,
        totalElements: totalElements.value,
        totalPages: totalPages.value,
        last: !hasMore.value
      })
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    // 确保加载状态被重置，van-list需要这个状态来停止加载动画
    loading.value = false
  }
}

// 刷新数据（包装hooks的方法）
const onRefreshWithEvent = async () => {
  try {
    // 重置下拉刷新状态，van-pull-refresh需要这个状态来显示加载动画
    refreshing.value = true
    
    // 调用数据加载
    await loadDataWithEvent(0)
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    // 确保下拉刷新状态被重置，van-pull-refresh需要这个状态来停止加载动画
    refreshing.value = false
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
  // 打印所有属性配置
  console.log('=== sdkwork-api-list 所有属性配置 ===')
  console.log('基础API配置:')
  console.log('- api:', props.api)
  console.log('- service:', props.service)
  console.log('- params:', props.params)
  console.log('- pageableParams:', props.pageableParams)
  console.log('- pageSize:', props.pageSize)
  
  console.log('功能配置:')
  console.log('- selectable:', props.selectable)
  console.log('- deletable:', props.deletable)
  console.log('- searchable:', props.searchable)
  console.log('- itemKey:', props.itemKey)
  console.log('- itemTitleField:', props.itemTitleField)
  console.log('- itemDescriptionField:', props.itemDescriptionField)
  
  console.log('主题和样式配置:')
  console.log('- themeMode:', props.themeMode)
  console.log('- showBorderBottom:', props.showBorderBottom)
  console.log('- borderBottomLeftOffset:', props.borderBottomLeftOffset)
  console.log('- showNoMoreData:', props.showNoMoreData)
  console.log('- topSpacing:', props.topSpacing)
  console.log('- leftSpacing:', props.leftSpacing)
  console.log('- rightSpacing:', props.rightSpacing)
  
  console.log('虚拟滚动配置:')
  console.log('- minSize:', props.minSize)
  console.log('- itemGap:', props.itemGap)
  console.log('- fixed:', props.fixed)
  console.log('- buffer:', props.buffer)
  console.log('- bufferTop:', props.bufferTop)
  console.log('- bufferBottom:', props.bufferBottom)
  console.log('- horizontal:', props.horizontal)
  console.log('- scrollDistance:', props.scrollDistance)
  console.log('- fixSelection:', props.fixSelection)
  console.log('- start:', props.start)
  console.log('- offset:', props.offset)
  console.log('- listStyle:', props.listStyle)
  console.log('- listClass:', props.listClass)
  console.log('- itemStyle:', props.itemStyle)
  console.log('- itemClass:', props.itemClass)
  console.log('- renderControl:', props.renderControl)
  
  console.log('=== 配置打印结束 ===')

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

  /* vant 列表样式调整 - 确保van-list有正确的滚动容器 */
  :deep(.van-pull-refresh) {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .van-pull-refresh__track {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0; /* 重要：允许内容收缩 */
    }
  }

  :deep(.van-list) {
    flex: 1;
    overflow-y: auto;
    min-height: 0; /* 重要：允许内容收缩 */
    
    /* 确保van-list内部容器正确设置 */
    .van-list__inner {
      min-height: 100%;
    }
  }
}

/* Darkmode 支持 */
.sdkwork-api-list.dark-mode {
  background: #000000;
  color: #ffffff;

  /* vant 组件深色模式适配 */
  :deep(.van-pull-refresh) {
    background: #000000;
    color: #ffffff;
  }

  :deep(.van-list) {
    background: #000000;
    color: #ffffff;
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .sdkwork-api-list:not(.light-mode) {
    background: #000000;
    color: #ffffff;

    :deep(.van-pull-refresh) {
      background: #000000;
      color: #ffffff;
    }

    :deep(.van-list) {
      background: #000000;
      color: #ffffff;
    }
  }
}
</style>