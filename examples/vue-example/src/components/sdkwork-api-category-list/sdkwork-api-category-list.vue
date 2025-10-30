<template>
  <div class="sdkwork-api-category-list" :class="themeClass">
    <!-- 搜索区域 -->
    <SearchSection v-if="searchable" :searchable="searchable" @search="handleSearch" />

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧分类栏 -->
      <div class="category-sidebar" v-if="showCategorySidebar">
        <!-- 分类加载状态 -->
        <div v-if="categoryLoading" class="category-loading">
          <div class="loading-spinner"></div>
          <span>加载分类中...</span>
        </div>

        <!-- 分类列表 -->
        <div v-else class="category-list">
          <CategoryItem v-for="(category, index) in categoryList" :key="getCategoryKey(category, index)"
            :category="category" :index="index" :active="isCategoryActive(category)" :category-key="categoryKey"
            :category-name-field="categoryNameField" :category-count-field="categoryCountField"
            @select="handleCategorySelect" v-slot="{ category: slotCategory, index: slotIndex }">
            <slot name="category" v-bind="{ category: slotCategory, index: slotIndex }" />
          </CategoryItem>
        </div>
      </div>

      <!-- 右侧内容列表 -->
      <div class="content-list" :class="{ 'with-sidebar': showCategorySidebar }">
        <!-- 下拉刷新和列表区域 -->
        <SdkworkPullRefresh v-model="loading" @refresh="onRefresh">
          <!-- 列表内容 -->
          <div class="list-content" :style="spacingStyle">
            <!-- 加载状态 -->
            <LoadingSection v-if="loading && !dataList.length" v-slot="{ loading }">
              <slot name="loading" v-bind="{ loading }" />
            </LoadingSection>

            <!-- 空状态 -->
            <EmptySection v-else-if="!loading && !dataList.length" v-slot="{ empty }">
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
                :show-border-bottom="props.showBorderBottom" :border-bottom-left-offset="props.borderBottomLeftOffset"
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
import CategoryItem from './components/CategoryItem.vue'

// 通用hooks导入
import { useApiDataLoader } from '../sdkwork-api-list/hooks/useApiDataLoader'

// 统一类型定义导入
import type {
  BaseApiComponentProps,
  BaseApiComponentEmits,
  BaseApiComponentSlots, 
  CategorySpecificProps,
} from '../sdkwork-api-list/types/shared'
import { DEFAULT_CONFIG } from '../sdkwork-api-list/types/shared'
import { CategoryVO } from '@/services'
// 组件属性定义
interface Props extends BaseApiComponentProps, CategorySpecificProps { }

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  api: undefined,
  service: undefined,
  params: () => ({}),
  pageableParams: () => ({}),
  selectable: DEFAULT_CONFIG.selectable,
  selectionMode: DEFAULT_CONFIG.selectionMode,
  deletable: DEFAULT_CONFIG.deletable,
  searchable: DEFAULT_CONFIG.searchable,
  pageSize: DEFAULT_CONFIG.pageSize,
  itemKey: DEFAULT_CONFIG.itemKey,
  itemTitleField: DEFAULT_CONFIG.itemTitleField,
  itemDescriptionField: DEFAULT_CONFIG.itemDescriptionField,
  categorys: () => [],
  categoryKey: DEFAULT_CONFIG.categoryKey,
  categoryNameField: DEFAULT_CONFIG.categoryNameField,
  categoryCountField: DEFAULT_CONFIG.categoryCountField,
  themeMode: DEFAULT_CONFIG.themeMode,
  topSpacing: DEFAULT_CONFIG.topSpacing,
  leftSpacing: DEFAULT_CONFIG.leftSpacing,
  rightSpacing: DEFAULT_CONFIG.rightSpacing
})

// 事件定义
interface Emits extends BaseApiComponentEmits {
  (e: 'select-category', category: CategoryVO): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<BaseApiComponentSlots & {
  /** 分类插槽 - 自定义分类项内容 */
  category?(props: { category: CategoryVO; index: number }): any
}>()

// 响应式数据
const categoryList = ref<CategoryVO[]>([])
const categoryLoading = ref(false)
const selectedItems = ref<any[]>([])
const selectedCategory = ref<CategoryVO | null>(null)

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
  return isDarkMode.value ? 'api-category-list--dark' : 'api-category-list--light'
})

// DOM引用
const loadMoreSectionRef = ref<InstanceType<typeof LoadMoreSection>>()

// 观察器实例
let observer: IntersectionObserver | null = null

// 构建请求参数
const buildRequestParams = (): Record<string, any> => {
  const baseParams = { ...props.params }

  // 如果选择了分类，添加分类参数
  if (selectedCategory.value) {
    baseParams.categoryId = getCategoryKey(selectedCategory.value, -1)
  }

  return baseParams
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
  isFirstLoad,
  loadData,
  onRefresh
} = useApiDataLoader({
  api: props.api,
  service: props.service,
  params: buildRequestParams(),
  pageableParams: props.pageableParams,
  pageSize: props.pageSize,
  autoLoad: false // 手动控制加载时机
})

// 计算属性
const showCategorySidebar = computed(() => categoryList.value.length > 0)

// 间距样式
const spacingStyle = computed(() => ({
  'padding-top': typeof props.topSpacing === 'number' ? `${props.topSpacing}px` : props.topSpacing,
  'padding-left': typeof props.leftSpacing === 'number' ? `${props.leftSpacing}px` : props.leftSpacing,
  'padding-right': typeof props.rightSpacing === 'number' ? `${props.rightSpacing}px` : props.rightSpacing
}))

// 获取列表项唯一键
const getItemKey = (item: any, index: number): string | number => {
  return item[props.itemKey] || index
}

// 获取分类项唯一键
const getCategoryKey = (category: CategoryVO|any, index: number): string | number => {
  return category[props.categoryKey] || index
}

// 获取分类项名称
const getCategoryName = (category: CategoryVO|any): string => {
  return category[props.categoryNameField] || '未知分类'
}

// 获取分类项数量
const getCategoryCount = (category: CategoryVO|any): number | string => {
  return category[props.categoryCountField] || ''
}

// 检查分类是否激活
const isCategoryActive = (category: CategoryVO|any): boolean => {
  if (!selectedCategory.value) return false
  return getCategoryKey(category, -1) === getCategoryKey(selectedCategory.value, -1)
}

// 检查项是否被选中
const isSelected = (item: any): boolean => {
  return selectedItems.value.some(selected => getItemKey(selected, -1) === getItemKey(item, -1))
}


// 加载分类数据
const loadCategories = async () => {
  if (categoryLoading.value) return

  try {
    categoryLoading.value = true

    if (props.categoryApi) {
      // 通过API获取分类数据
      categoryList.value = await props.categoryApi()
    } else if (props.categorys && props.categorys.length > 0) {
      // 使用传入的分类数据
      categoryList.value = props.categorys
    }

    // 设置默认选中的分类
    if (props.defaultCategoryId && categoryList.value.length > 0) {
      const defaultCategory = categoryList.value.find(
        category => getCategoryKey(category, -1) === props.defaultCategoryId
      )
      if (defaultCategory) {
        selectedCategory.value = defaultCategory
      }
    } else if (categoryList.value.length > 0) {
      // 默认选中第一个分类
      selectedCategory.value = categoryList.value[0]
    }
  } catch (error) {
    console.error('加载分类数据失败:', error)
  } finally {
    categoryLoading.value = false
  }
}

// 搜索处理
const handleSearch = (keyword: string) => {
  emit('search', keyword)
  loadData(0)
}

// 分类选择处理
const handleCategorySelect = (category: CategoryVO) => {
  selectedCategory.value = category
  emit('select-category', category)
  loadData(0) // 切换分类时重新加载数据
}

// 项选择处理
const handleItemSelect = (item: any) => {
  if (props.selectable) {
    const itemIndex = selectedItems.value.findIndex(
      selected => getItemKey(selected, -1) === getItemKey(item, -1)
    )

    if (itemIndex > -1) {
      // 如果已选中，则取消选中
      selectedItems.value.splice(itemIndex, 1)
    } else {
      if (props.selectionMode === 'single') {
        // 单选模式：清空之前的选择，只选中当前项
        selectedItems.value = [item]
      } else {
        // 多选模式：添加当前项到选中列表
        selectedItems.value.push(item)
      }
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

// 监听分类数据变化
watch(() => props.categorys, () => {
  if (props.categorys && props.categorys.length > 0) {
    categoryList.value = props.categorys
  }
}, { deep: true })

// 生命周期
onMounted(() => {
  loadCategories().then(() => {
    loadData(0)
  })
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
  setSelectedItems: (items: any[]) => {
    if (props.selectionMode === 'single' && items.length > 1) {
      console.warn('单选模式下只能设置一个选中项，将使用第一个项')
      selectedItems.value = [items[0]]
    } else {
      selectedItems.value = items
    }
  },
  /** 获取分类数据 */
  getCategories: () => categoryList.value,
  /** 获取当前选中的分类 */
  getSelectedCategory: () => selectedCategory.value,
  /** 设置选中的分类 */
  setSelectedCategory: (category: CategoryVO) => {
    selectedCategory.value = category
    loadData(0)
  }
})
</script>

<style scoped lang="scss">
.sdkwork-api-category-list {
  height: 100%;
  display: flex;
  flex-direction: column;

  // CSS 变量系统 - 参考 sdkwork-cell 的主题处理方式
  --api-category-list-bg: #ffffff;
  --api-category-list-sidebar-bg: #fafafa;
  --api-category-list-sidebar-border: #e8e8e8;
  --api-category-list-text-primary: #333333;
  --api-category-list-text-secondary: #666666;
  --api-category-list-text-meta: #999999;
  --api-category-list-border-color: #f0f0f0;
  --api-category-list-hover-bg: #f5f5f5;
  --api-category-list-active-bg: #f0f0f0;
  --api-category-list-active-border: #1890ff;
  --api-category-list-count-bg: #f0f0f0;
  --api-category-list-count-text: #999999;
}

.sdkwork-api-category-list .main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  height: 100%;
}

.sdkwork-api-category-list .main-content .category-sidebar {
  width: 160px;
  min-width: 140px;
  max-width: 180px;
  background: var(--api-category-list-sidebar-bg);
  border-right: 1px solid var(--api-category-list-sidebar-border);
  overflow-y: auto;
  display: block;
  flex-shrink: 0;
}

.sdkwork-api-category-list .main-content .content-list {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: block;
}

.sdkwork-api-category-list .main-content .category-sidebar .category-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--api-category-list-text-meta);
}

.sdkwork-api-category-list .main-content .category-sidebar .category-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--api-category-list-text-meta);
}

.sdkwork-api-category-list .main-content .category-sidebar .category-loading .loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--api-category-list-border-color);
  border-top: 2px solid var(--api-category-list-active-border);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.sdkwork-api-category-list .main-content .category-sidebar .category-loading span {
  margin-left: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.sdkwork-api-category-list .main-content .category-sidebar .category-list .category-item {
  padding: 8px 10px;
  border-bottom: 1px solid var(--api-category-list-border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.sdkwork-api-category-list .main-content .category-sidebar .category-list .category-item:hover {
  background: var(--api-category-list-hover-bg);
}

.sdkwork-api-category-list .main-content .category-sidebar .category-list .category-item.active {
  background: var(--api-category-list-active-bg);
  border-right: 2px solid var(--api-category-list-active-border);
}

.sdkwork-api-category-list .main-content .category-sidebar .category-list .category-item .default-category {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.sdkwork-api-category-list .main-content .category-sidebar .category-list .category-item .default-category .category-name {
  font-size: 13px;
  color: var(--api-category-list-text-secondary);
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.sdkwork-api-category-list .main-content .category-sidebar .category-list .category-item .default-category .category-count {
  font-size: 10px;
  color: var(--api-category-list-count-text);
  background: var(--api-category-list-count-bg);
  padding: 1px 4px;
  border-radius: 8px;
}

.sdkwork-api-category-list .main-content .content-list {
  flex: 1;
  overflow: hidden;
  display: block;
}

.sdkwork-api-category-list .main-content .content-list.with-sidebar {
  margin-left: 0;
}

.sdkwork-api-category-list .main-content .content-list .list-content {
  height: 100%;
  overflow-y: auto;
}

/* 响应式设计 - 始终保持左右布局，调整宽度 */
@media (max-width: 1024px) {
  .sdkwork-api-category-list .main-content .category-sidebar {
    width: 140px;
    min-width: 120px;
    max-width: 160px;
  }
}

@media (max-width: 768px) {
  .sdkwork-api-category-list .main-content .category-sidebar {
    width: 120px;
    min-width: 100px;
    max-width: 140px;
  }
}

@media (max-width: 480px) {
  .sdkwork-api-category-list .main-content .category-sidebar {
    width: 100px;
    min-width: 80px;
    max-width: 120px;
  }
}

// 浅色主题
.api-category-list--light {
  --api-category-list-bg: #ffffff;
  --api-category-list-sidebar-bg: #fafafa;
  --api-category-list-sidebar-border: #e8e8e8;
  --api-category-list-text-primary: #333333;
  --api-category-list-text-secondary: #666666;
  --api-category-list-text-meta: #999999;
  --api-category-list-border-color: #f0f0f0;
  --api-category-list-hover-bg: #f5f5f5;
  --api-category-list-active-bg: #f0f0f0;
  --api-category-list-active-border: #1890ff;
  --api-category-list-count-bg: #f0f0f0;
  --api-category-list-count-text: #999999;
}

// 深色主题
.api-category-list--dark {
  --api-category-list-bg: #1a1a1a;
  --api-category-list-sidebar-bg: #2a2a2a;
  --api-category-list-sidebar-border: #3a3a3a;
  --api-category-list-text-primary: #e0e0e0;
  --api-category-list-text-secondary: #a0a0a0;
  --api-category-list-text-meta: #888888;
  --api-category-list-border-color: #3a3a3a;
  --api-category-list-hover-bg: #3a3a3a;
  --api-category-list-active-bg: #4a4a4a;
  --api-category-list-active-border: #1890ff;
  --api-category-list-count-bg: #3a3a3a;
  --api-category-list-count-text: #a0a0a0;
}
</style>