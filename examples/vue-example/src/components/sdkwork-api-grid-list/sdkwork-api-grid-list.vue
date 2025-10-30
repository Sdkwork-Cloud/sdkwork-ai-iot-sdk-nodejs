<template>
  <div class="sdkwork-api-grid-list">
    <!-- 搜索区域 -->
    <SearchSection v-if="searchable" :searchable="searchable" @search="handleSearch" />
    <!-- 下拉刷新和网格区域 -->
    <SdkworkPullRefresh v-model="loading" @refresh="onRefresh">
      <!-- 网格内容 -->
      <div class="grid-content" :style="spacingStyle">
        <!-- 顶部插槽 - 在任何情况下都显示 -->
        <slot name="header" />

        <!-- 空状态 -->
        <EmptySection v-if="!loading && !dataList.length" v-slot="{ empty }">
          <slot name="empty" v-bind="{ empty }" />
        </EmptySection>

        <!-- 数据网格 -->
        <div v-else class="data-section">
          <!-- 网格容器 -->
          <div class="grid-container" :style="{
            'grid-template-columns': `repeat(${columns}, 1fr)`,
            'gap': `${gap}px`
          }">
            <!-- 网格项 -->
            <GridItem v-for="(item, index) in dataList" :key="getItemKey(item, index)" :item="item" :index="index"
              :selectable="selectable" :deletable="deletable" :is-selected="isSelected(item)" :item-key="itemKey"
              :item-title-field="itemTitleField" :item-description-field="itemDescriptionField"
              @select="handleItemSelect" @delete="handleItemDelete"
              v-slot="{ item: slotItem, index: slotIndex, selected: slotSelected }">
              <slot :item="slotItem" :index="slotIndex" :selected="slotSelected" />
            </GridItem>
          </div>

          <!-- 底部插槽 -->
          <slot name="footer" />

          <!-- 加载更多指示器 -->
          <LoadMoreSection :has-more="hasMore" :loading-more="loadingMore" :data-list="dataList"
            ref="loadMoreSectionRef" />
        </div>
      </div>
    </SdkworkPullRefresh>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { CURDService, Page, Pageable } from 'sdkwork-commons-typescript'

// 子组件导入
import SearchSection from '../sdkwork-api-list/components/SearchSection.vue'
import GridItem from './components/GridItem.vue'
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
  GridSpecificProps,
} from '../sdkwork-api-list/types/shared'
import { DEFAULT_CONFIG } from '../sdkwork-api-list/types/shared'
// 组件属性定义
interface Props extends BaseApiComponentProps, GridSpecificProps { }

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
  columns: DEFAULT_CONFIG.columns,
  gap: DEFAULT_CONFIG.gap,
  topSpacing: DEFAULT_CONFIG.topSpacing,
  leftSpacing: DEFAULT_CONFIG.leftSpacing,
  rightSpacing: DEFAULT_CONFIG.rightSpacing
})

// 事件定义
interface Emits extends BaseApiComponentEmits { }

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<BaseApiComponentSlots>()

// 响应式数据
const selectedItems = ref<any[]>([])

// DOM引用
const loadMoreSectionRef = ref<InstanceType<typeof LoadMoreSection>>()

// 观察器实例
let observer: IntersectionObserver | null = null

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
  params: props.params,
  pageableParams: props.pageableParams,
  pageSize: props.pageSize,
  autoLoad: false // 手动控制加载时机
})

// 间距样式
const spacingStyle = computed(() => ({
  'padding-top': typeof props.topSpacing === 'number' ? `${props.topSpacing}px` : props.topSpacing,
  'padding-left': typeof props.leftSpacing === 'number' ? `${props.leftSpacing}px` : props.leftSpacing,
  'padding-right': typeof props.rightSpacing === 'number' ? `${props.rightSpacing}px` : props.rightSpacing
}))

// 获取网格项唯一键
const getItemKey = (item: any, index: number): string | number => {
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
    loadingMore.value = false
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
    console.error('加载数据失败:', error)
  }
}

// 刷新数据（包装hooks的方法）
const onRefreshWithEvent = () => {
  onRefresh()
  loadDataWithEvent(0)
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

// 监听列数变化，重新布局
watch(() => props.columns, () => {
  nextTick(() => {
    // 网格布局会自动响应columns变化
  })
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
.sdkwork-api-grid-list {
  height: 100%;
  display: flex;
  flex-direction: column;

  .grid-content {
    flex: 1;
    overflow-y: auto;
  }

  .data-section {
    padding: 0 var(--van-padding-md);
  }

  .grid-container {
    display: grid;
    margin-bottom: var(--van-padding-md);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-api-grid-list {
    .data-section {
      padding: 0 var(--van-padding-sm);
    }

    .grid-container {
      gap: 12px;
    }
  }
}

@media (min-width: 1024px) {
  .sdkwork-api-grid-list {
    .data-section {
      padding: 0 var(--van-padding-lg);
    }

    .grid-container {
      gap: 20px;
    }
  }
}
</style>