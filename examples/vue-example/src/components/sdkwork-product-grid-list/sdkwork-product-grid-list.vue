<template>
  <SdkworkApiGridList
    ref="gridListRef"
    :api="getAIProductList"
    :params="filterParams"
    :selectable="selectable"
    :deletable="deletable"
    :searchable="searchable"
    :page-size="pageSize"
    :columns="columns"
    :gap="gap"
    :top-spacing="topSpacing"
    :left-spacing="leftSpacing"
    :right-spacing="rightSpacing"
    :item-key="itemKey"
    :item-title-field="itemTitleField"
    :item-description-field="itemDescriptionField"
    @select="handleProductSelect"
    @delete="handleProductDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 默认商品网格项 -->
    <template #default="{ item, index, selected }">
      <ProductGridItem
        :product="item"
        :index="index"
        :selected="selected"
        :selectable="selectable"
        :deletable="deletable"
        @select="$emit('select', item)"
        @delete="$emit('delete', item)"
        @click="$emit('item-click', item)"
      />
    </template>

    <!-- 空状态 -->
    <template #empty>
      <div class="empty-product-grid">
        <van-icon name="shopping-cart-o" size="48" color="#c8c9cc" />
        <p class="empty-text">暂无商品数据</p>
        <van-button type="primary" size="small" @click="handleRefresh">
          刷新商品
        </van-button>
      </div>
    </template>

    <!-- 加载状态 -->
    <template #loading>
      <div class="loading-product-grid">
        <van-loading size="24px" color="#1989fa" />
        <span class="loading-text">加载商品中...</span>
      </div>
    </template>

    <!-- 头部区域 -->
    <template #header>
      <!-- 透传父组件传入的header slot内容 -->
      <slot name="header" /> 
    </template>

    <!-- 底部区域 -->
    <template #footer>
      <div class="product-grid-footer" v-if="selectedCount > 0">
        <van-button 
          type="primary" 
          block 
          @click="handleBatchOperation"
          class="batch-btn"
        >
          批量操作 ({{ selectedCount }})
        </van-button>
      </div>
    </template>

  </SdkworkApiGridList>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import SdkworkApiGridList from '../sdkwork-api-grid-list/sdkwork-api-grid-list.vue'
import ProductGridItem from './components/ProductGridItem.vue'
import { getAIProductList } from './ai-iot-products'
import type { AIProduct } from './ai-iot-products'
import { ProductVO } from '@/services'

// 组件属性定义
interface Props {
  /** 筛选参数 */
  filterParams?: Record<string, any>
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 网格列数 */
  columns?: number
  /** 网格间距 */
  gap?: number
  /** 顶部间距，支持CSS单位（如px, rem, vh等），默认6px */
  topSpacing?: string | number
  /** 左侧间距，支持CSS单位（如px, rem, vh等），默认8px */
  leftSpacing?: string | number
  /** 右侧间距，支持CSS单位（如px, rem, vh等），默认8px */
  rightSpacing?: string | number
  /** 商品唯一键字段 */
  itemKey?: string
  /** 商品标题字段 */
  itemTitleField?: string
  /** 商品描述字段 */
  itemDescriptionField?: string
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  filterParams: () => ({}),
  selectable: false,
  deletable: false,
  searchable: true,
  pageSize: 12,
  columns: 2,
  gap: 16,
  topSpacing: '6px',
  leftSpacing: '8px',
  rightSpacing: '8px',
  itemKey: 'id',
  itemTitleField: 'name',
  itemDescriptionField: 'description'
})

// 事件定义
interface Emits {
  (e: 'select', product: ProductVO): void
  (e: 'delete', product: ProductVO): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<ProductVO>): void
  (e: 'item-click', product: ProductVO): void
  (e: 'batch-operation', products: ProductVO[]): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  /** 自定义内容插槽 */
  'custom-content'?: (props: { 
    products: ProductVO[]
    selectedProducts: ProductVO[]
    totalProducts: number
    selectedCount: number
  }) => any,
  "header"?: () => any
}>()

// 组件引用
const gridListRef = ref<InstanceType<typeof SdkworkApiGridList>>()

// 响应式数据
const dataList = ref<ProductVO[]>([])
const selectedItems = ref<ProductVO[]>([])
const totalProducts = ref(0)
const selectedCount = ref(0)

// 计算属性
const totalAmount = computed(() => {
  return selectedItems.value.reduce((sum, product) => sum + Number(product.price), 0)
})

// 事件处理
const handleProductSelect = (product: ProductVO) => {
  emit('select', product)
  updateSelectedProducts()
}

const handleProductDelete = (product: ProductVO) => {
  emit('delete', product)
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: Page<ProductVO>) => {
  dataList.value = pageData.content || []
  totalProducts.value = pageData.total || 0
  emit('load', pageData)
}

const handleRefresh = () => {
  gridListRef.value?.refresh()
}

const handleBatchOperation = () => {
  emit('batch-operation', selectedItems.value)
}

// 更新选中商品列表
const updateSelectedProducts = () => {
  const items = gridListRef.value?.getSelectedItems() || []
  selectedItems.value = items
  selectedCount.value = items.length
}

// 监听选中项变化
watch(selectedCount, () => {
  updateSelectedProducts()
})

// 暴露给父组件的方法
defineExpose({
  /** 刷新商品列表 */
  refresh: () => gridListRef.value?.refresh(),
  /** 获取商品列表 */
  getProducts: () => dataList.value,
  /** 获取选中商品 */
  getSelectedProducts: () => selectedItems.value,
  /** 清空选中商品 */
  clearSelected: () => gridListRef.value?.clearSelected(),
  /** 设置选中商品 */
  setSelectedProducts: (products: ProductVO[]) => gridListRef.value?.setSelectedItems(products),
  /** 获取总金额 */
  getTotalAmount: () => totalAmount.value
})
</script>

<style scoped lang="scss">
.empty-product-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #c8c9cc;
  text-align: center;

  .empty-text {
    margin: 16px 0;
    font-size: 14px;
    color: #969799;
  }
}

.loading-product-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 12px;
  color: #646566;

  .loading-text {
    font-size: 14px;
  }
}

.product-grid-header {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.product-grid-footer {
  padding: 16px;
  background: #f7f8fa;
  border-radius: 6px;
  margin-top: 16px;

  .batch-btn {
    border-radius: 20px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-grid-header {
    flex-direction: column;
    gap: 6px;
    padding: 10px;
  }

  .product-grid-footer {
    padding: 12px;
  }
}
</style>