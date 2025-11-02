<template>
  <div
    class="sdkwork-generation-waterfall"
    :class="themeClass"
  >
    <!-- 使用sdkwork-api-waterfall组件作为基础 -->
    <SdkworkApiWaterfall
      :api="api"
      :params="computedParams"
      :selectable="selectable"
      :deletable="deletable"
      :searchable="searchable"
      :page-size="pageSize"
      :item-key="itemKey"
      :item-title-field="itemTitleField"
      :item-description-field="itemDescriptionField"
      :columns="columns"
      :gap="gap"
      left-spacing="0px"
      right-spacing="0px"
      @search="handleSearch"
      @load="handleLoad"
      @select="handleSelect"
      @delete="handleDelete"
      ref="waterfallRef"
    >
      <!-- 自定义瀑布流项内容 -->
      <template #default="{ item, index, selected }">
        <SdkworkGenerationWaterfallItem
          :item="item"
          :index="index"
          :selected="selected"
          :theme-mode="themeMode"
          :show-stats="showStats"
          :show-meta="showMeta"
          :show-status="showStatus"
          :clickable="clickable"
          @click="handleItemClick"
        >
          <!-- 传递插槽内容 -->
          <template v-if="$slots['item-image']" #image>
            <slot name="item-image" :item="item" :index="index" />
          </template>
          <template v-if="$slots['item-title']" #title>
            <slot name="item-title" :item="item" :index="index" />
          </template>
          <template v-if="$slots['item-description']" #description>
            <slot name="item-description" :item="item" :index="index" />
          </template>
          <template v-if="$slots['item-meta']" #meta>
            <slot name="item-meta" :item="item" :index="index" />
          </template>
          <template v-if="$slots['item-actions']" #actions>
            <slot name="item-actions" :item="item" :index="index" />
          </template>
        </SdkworkGenerationWaterfallItem>
      </template>

      <!-- 空状态插槽 -->
      <template #empty>
        <div class="empty-state">
          <slot name="empty">
            <van-empty :description="emptyText" image="search">
              <template #description>
                <div class="empty-description">
                  <p>{{ emptyText }}</p>
                  <p v-if="emptyTip" class="empty-tip">{{ emptyTip }}</p>
                </div>
              </template>
              <van-button 
                v-if="showCreateButton" 
                type="primary" 
                size="small" 
                @click="handleCreate"
              >
                {{ createButtonText }}
              </van-button>
            </van-empty>
          </slot>
        </div>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <div class="loading-state">
          <slot name="loading">
            <van-loading size="24px" vertical>{{ loadingText }}</van-loading>
          </slot>
        </div>
      </template>

      <!-- 头部插槽 -->
      <template #header>
        <slot name="header" />
      </template>

      <!-- 底部插槽 -->
      <template #footer>
        <slot name="footer" />
      </template>
    </SdkworkApiWaterfall>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import SdkworkApiWaterfall from '@/components/sdkwork-api-waterfall/sdkwork-api-waterfall.vue'
import SdkworkGenerationWaterfallItem from './components/sdkwork-generation-waterfall-item.vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 组件引用
const waterfallRef = ref<any>()

// Props 定义
interface Props {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<any>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持项选择 */
  selectable?: boolean
  /** 是否支持项删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 瀑布流项唯一键字段名 */
  itemKey?: string
  /** 瀑布流项标题字段名 */
  itemTitleField?: string
  /** 瀑布流项描述字段名 */
  itemDescriptionField?: string
  /** 瀑布流列数 */
  columns?: number
  /** 列间距 */
  gap?: number
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否显示统计信息（浏览量、点赞数） */
  showStats?: boolean
  /** 是否显示元信息（时间、状态） */
  showMeta?: boolean
  /** 是否显示状态标签 */
  showStatus?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 空状态文本 */
  emptyText?: string
  /** 空状态提示 */
  emptyTip?: string
  /** 是否显示创建按钮 */
  showCreateButton?: boolean
  /** 创建按钮文本 */
  createButtonText?: string
  /** 加载文本 */
  loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  selectable: false,
  deletable: false,
  searchable: false,
  pageSize: 12,
  itemKey: 'id',
  itemTitleField: 'title',
  itemDescriptionField: 'description',
  columns: 2,
  gap: 16,
  themeMode: 'auto',
  showStats: true,
  showMeta: true,
  showStatus: true,
  clickable: true,
  emptyText: '暂无作品',
  emptyTip: '开始创作您的第一个作品吧！',
  showCreateButton: true,
  createButtonText: '开始创作',
  loadingText: '加载作品中...'
})

// Emit 事件定义
interface Emits {
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<any>): void
  (e: 'select', item: any): void
  (e: 'delete', item: any): void
  (e: 'item-click', item: any, index: number): void
  (e: 'create'): void
  (e: 'refresh'): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义整个瀑布流项 */
  default?: (props: { item: any; index: number; selected: boolean }) => any
  /** 项图片插槽 */
  'item-image'?: (props: { item: any; index: number }) => any
  /** 项标题插槽 */
  'item-title'?: (props: { item: any; index: number }) => any
  /** 项描述插槽 */
  'item-description'?: (props: { item: any; index: number }) => any
  /** 项元信息插槽 */
  'item-meta'?: (props: { item: any; index: number }) => any
  /** 项操作插槽 */
  'item-actions'?: (props: { item: any; index: number }) => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
  /** 头部插槽 */
  header?: () => any
  /** 底部插槽 */
  footer?: () => any
}>()

// 计算属性
const themeClass = computed(() => {
  return `theme-${props.themeMode}`
})

const computedParams = computed(() => ({
  ...props.params,
  // 可以在这里添加一些默认参数
}))

// 事件处理
const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: Page<any>) => {
  emit('load', pageData)
}

const handleSelect = (item: any) => {
  emit('select', item)
}

const handleDelete = (item: any) => {
  emit('delete', item)
}

const handleItemClick = (item: any, index: number) => {
  emit('item-click', item, index)
}

const handleCreate = () => {
  emit('create')
}

// 组件挂载后自动加载数据
onMounted(() => {
  console.error('sdkwork-generation-waterfall============',props.api)
  if (waterfallRef.value) {
    waterfallRef.value.refresh()
  }
})

// 监听参数变化
watch(() => props.params, () => {
  // 参数变化时刷新数据
  if (waterfallRef.value) {
    waterfallRef.value.refresh()
  }
}, { deep: true })

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => waterfallRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => waterfallRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => waterfallRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => waterfallRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => waterfallRef.value?.clearSelected(),
  /** 设置选中项 */
  setSelectedItems: (items: any[]) => waterfallRef.value?.setSelectedItems(items)
})
</script>

<style scoped lang="scss">
.sdkwork-generation-waterfall {
  height: 100%;
  
  &.theme-light {
    --generation-bg: #ffffff;
    --generation-text: #333333;
    --generation-border: #e0e0e0;
  }
  
  &.theme-dark {
    --generation-bg: #1a1a1a;
    --generation-text: #ffffff;
    --generation-border: #333333;
  }
  
  &.theme-auto {
    @media (prefers-color-scheme: light) {
      --generation-bg: #ffffff;
      --generation-text: #333333;
      --generation-border: #e0e0e0;
    }
    
    @media (prefers-color-scheme: dark) {
      --generation-bg: #1a1a1a;
      --generation-text: #ffffff;
      --generation-border: #333333;
    }
  }
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  
  .empty-description {
    margin-top: 16px;
    
    p {
      margin: 8px 0;
      color: var(--generation-text);
      font-size: 14px;
    }
    
    .empty-tip {
      font-size: 12px;
      color: #999;
    }
  }
}

.loading-state {
  padding: 40px 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-generation-waterfall {
    .empty-state,
    .loading-state {
      padding: 20px 16px;
    }
  }
}
</style>