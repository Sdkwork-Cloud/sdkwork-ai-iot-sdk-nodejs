<template>
  <div class="sdkwork-api-waterfall" :class="themeClass">
    <!-- 搜索区域 -->
    <SearchSection
      v-if="props.searchable"
      :searchable="props.searchable"
      @search="handleSearch"
    />

    <!-- 瀑布流内容 -->
    <div class="waterfall-content" :style="spacingStyle">
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

      <!-- 数据瀑布流 -->
      <div v-else class="data-section">
        <!-- 顶部插槽 -->
        <slot name="header" />

        <!-- 瀑布流容器 -->
        <Waterfall
          ref="waterfallRef"
          :list="dataList"
          :row-key="waterfallRowKey"
          :img-selector="imgSelector"
          :width="width"
          :breakpoints="breakpoints"
          :gutter="gutter"
          :space="space"
          :has-around-gutter="hasAroundGutter"
          :pos-duration="posDuration"
          :animation-prefix="animationPrefix"
          :animation-effect="animationEffect"
          :animation-duration="animationDuration"
          :animation-delay="animationDelay"
          :animation-cancel="animationCancel"
          :background-color="backgroundColor"
          :load-props="loadProps"
          :lazyload="lazyload"
          :cross-origin="crossOrigin"
          :delay="delay"
          :align="align"
          :horizontal-order="horizontalOrder"
          :height-difference="heightDifference"
          @after-render="onAfterRender"
          class="waterfall-container"
        >
          <template #default="{ item, url, index }">
            <WaterfallItem
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
            </WaterfallItem>
          </template>
        </Waterfall>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { CURDService, Page, Pageable } from 'sdkwork-commons-typescript' 

// 子组件导入
import SearchSection from '../sdkwork-api-list/components/SearchSection.vue'
import WaterfallItem from './components/WaterfallItem.vue'
import LoadingSection from '../sdkwork-api-list/components/LoadingSection.vue'
import EmptySection from '../sdkwork-api-list/components/EmptySection.vue'
import LoadMoreSection from '../sdkwork-api-list/components/LoadMoreSection.vue'

// vue3-waterfall-plugin 组件导入
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

// 通用hooks导入
import { useApiDataLoader } from '../sdkwork-api-list/hooks/useApiDataLoader'

// 统一类型定义导入
import type { 
  BaseApiComponentProps, 
  BaseApiComponentEmits, 
  BaseApiComponentSlots,
  GridSpecificProps,
  ListSpecificProps
} from '../sdkwork-api-list/types/shared'
import { DEFAULT_CONFIG } from '../sdkwork-api-list/types/shared'

// 瀑布流组件特定属性接口
export interface WaterfallSpecificProps {
  /** 瀑布流数据唯一键字段名 */
  waterfallRowKey?: string
  /** 图片字段选择器，支持 xxx.xxx.xxx 格式 */
  imgSelector?: string
  /** 卡片在 PC 上的宽度 */
  width?: number
  /** 响应式断点配置 */
  breakpoints?: Record<number, { rowPerView: number }>
  /** 卡片之间的间隙 */
  gutter?: number
  /** 行间隙 */
  space?: number
  /** 容器四周是否有 gutter 边距 */
  hasAroundGutter?: boolean
  /** 卡片移动到正确位置的动画时间 */
  posDuration?: number
  /** 动画类名前缀 */
  animationPrefix?: string
  /** 卡片入场动画效果 */
  animationEffect?: string
  /** 卡片入场动画执行时间 */
  animationDuration?: number
  /** 卡片入场动画延迟 */
  animationDelay?: number
  /** 是否取消动画 */
  animationCancel?: boolean
  /** 背景颜色 */
  backgroundColor?: string
  /** 懒加载图片组件属性设置 */
  loadProps?: Record<string, any>
  /** 是否开启懒加载 */
  lazyload?: boolean
  /** 图片加载是否开启跨域 */
  crossOrigin?: boolean
  /** 布局刷新的防抖时间 */
  delay?: number
  /** 卡片的对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 卡片是否按照从左到右的顺序排列 */
  horizontalOrder?: boolean
  /** 高度差容限值 */
  heightDifference?: number
}

// 组件属性定义
interface Props extends  BaseApiComponentProps,  ListSpecificProps, WaterfallSpecificProps {}

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
  
  // 瀑布流组件特定属性默认值
  waterfallRowKey: 'id',
  imgSelector: 'src',
  width: 200,
  breakpoints: () => ({
    1200: { rowPerView: 2 },
    800: { rowPerView: 2 },
    500: { rowPerView: 2 }
  }),
  gutter: 10,
  space: 10,
  hasAroundGutter: true,
  posDuration: 300,
  animationPrefix: 'animate__animated',
  animationEffect: 'fadeIn',
  animationDuration: 1000,
  animationDelay: 300,
  animationCancel: false,
  backgroundColor: '#ffffff',
  loadProps: () => ({}),
  lazyload: true,
  crossOrigin: true,
  delay: 300,
  align: 'center',
  horizontalOrder: false,
  heightDifference: 0
})

// 瀑布流组件特定事件接口
export interface WaterfallSpecificEmits {
  /** 瀑布流渲染完成事件 */
  (e: 'after-render'): void
}

// 事件定义
interface Emits extends BaseApiComponentEmits, WaterfallSpecificEmits {}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<BaseApiComponentSlots>()

// 响应式数据
const selectedItems = ref<any[]>([])

// DOM引用
const loadMoreSectionRef = ref<InstanceType<typeof LoadMoreSection>>()

// 瀑布流组件引用
const waterfallRef = ref<InstanceType<typeof Waterfall>>()

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
  autoLoad: true // 允许自动加载数据
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

// 获取瀑布流项唯一键
const getItemKey = (item: any, index: number): string | number => {
  return item[props.itemKey] || index
}

// 检查项是否被选中
const isSelected = (item: any): boolean => {
  return selectedItems.value.some(selected => getItemKey(selected, -1) === getItemKey(item, -1))
}

// 瀑布流渲染完成事件
const onAfterRender = () => {
  emit('after-render')
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



// 生命周期
onMounted(() => {
  // 数据加载由useApiDataLoader自动处理，autoLoad: true
  nextTick(() => {
    initObserver()
  })
 console.error('props.api',props.api)
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
  /** 手动触发布局刷新 */
  renderer: () => waterfallRef.value?.renderer?.(),
  /** 获取瀑布流组件实例 */
  getWaterfallInstance: () => waterfallRef.value
})
</script>

<style scoped lang="scss">
.sdkwork-api-waterfall {
  height: 100%;
  display: flex;
  flex-direction: column;

  .waterfall-content {
    flex: 1;
    overflow-y: auto;
  }

  .data-section {
    padding: 0 data-section;
  }

  .waterfall-container {
    margin-bottom: var(--van-padding-md);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-api-waterfall {
    .data-section {
      padding: 0 0;
    }
  }
}

/* 暗色主题支持 */
.sdkwork-api-waterfall.dark-mode {
  .waterfall-container {
    background-color: #1a1a1a;
  }
}

.sdkwork-api-waterfall.light-mode {
  .waterfall-container {
    background-color: #ffffff;
  }
}

</style>