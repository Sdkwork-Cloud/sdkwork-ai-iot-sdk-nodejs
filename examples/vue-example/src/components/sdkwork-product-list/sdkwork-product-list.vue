<template>
  <SdkworkApiList
    :api="getProductList"
    :params="queryParams"
    :selectable="selectable"
    :deletable="deletable"
    :searchable="searchable"
    :page-size="pageSize"
    :item-key="itemKey"
    :item-title-field="itemTitleField"
    :item-description-field="itemDescriptionField"
    @select="handleItemSelect"
    @delete="handleItemDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义商品项内容 -->
    <template #default="{ item, index, selected }">
      <ProductItem
        :product="item"
        :index="index"
        :selected="selected"
        :selectable="selectable"
        :deletable="deletable"
        @select="handleItemSelect"
        @delete="handleItemDelete"
      />
    </template>

    <!-- 自定义空状态 -->
    <template #empty>
      <div class="empty-product">
        <van-icon name="shopping-cart-o" size="48" />
        <p>暂无商品</p>
      </div>
    </template>

    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="loading-product">
        <van-loading size="24px" />
        <span>加载商品中...</span>
      </div>
    </template>
 

    <!-- 自定义底部区域 -->
    <template #footer>
      <div class="list-footer" v-if="selectedCount > 0">
        <van-button 
          type="primary" 
          block 
          @click="handleCheckout"
        >
          结算选中商品 ({{ selectedCount }})
        </van-button>
      </div>
    </template>
  </SdkworkApiList>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue'
import ProductItem from './components/ProductItem.vue'
import { getProductList } from './mock-data'
import type { Product } from './mock-data'
import type { Page } from 'sdkwork-commons-typescript'

// 组件属性
interface Props {
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示数量 */
  pageSize?: number
  /** 商品项唯一键字段 */
  itemKey?: string
  /** 商品标题字段 */
  itemTitleField?: string
  /** 商品描述字段 */
  itemDescriptionField?: string
  /** 查询参数 */
  params?: Record<string, any>
}

// 事件定义
interface Emits {
  (e: 'select', product: Product): void
  (e: 'delete', product: Product): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<Product>): void
  (e: 'checkout', products: Product[]): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  searchable: true,
  pageSize: 10,
  itemKey: 'id',
  itemTitleField: 'name',
  itemDescriptionField: 'description'
})

const emit = defineEmits<Emits>()

// 组件引用
const productListRef = ref<InstanceType<typeof SdkworkApiList>>()

// 查询参数
const queryParams = ref({
  ...props.params
})

// 状态数据
const totalProducts = ref(0)
const selectedCount = ref(0)
const currentPage = ref(0)
const totalPages = ref(0)
const selectedProducts = ref<Product[]>([])

// 计算属性
const totalAmount = computed(() => {
  return selectedProducts.value.reduce((sum, product) => sum + product.price, 0)
})

// 事件处理
const handleItemSelect = (product: Product) => {
  emit('select', product)
  updateSelectedProducts()
  showToast(`已选择: ${product.name}`)
}

const handleItemDelete = async (product: Product) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除商品"${product.name}"吗？此操作不可撤销。`
    })
    
    emit('delete', product)
    showToast('商品删除成功')
  } catch (error) {
    // 用户取消删除
    console.log('取消删除')
  }
}

const handleSearch = (keyword: string) => {
  queryParams.value.keyword = keyword
  emit('search', keyword)
}

const handleLoad = (pageData: Page<Product>) => {
  totalProducts.value = pageData.total || 0
  currentPage.value = pageData.pageable.pageNumber || 0
  totalPages.value = pageData.total/(pageData.pageable.pageSize||10) || 0
  emit('load', pageData)
}

// 更新选中商品列表
const updateSelectedProducts = () => {
  const items = productListRef.value?.getSelectedItems() || []
  selectedProducts.value = items
  selectedCount.value = items.length
}

// 结算处理
const handleCheckout = () => {
  if (selectedProducts.value.length === 0) {
    showToast('请先选择商品')
    return
  }
  
  showConfirmDialog({
    title: '确认结算',
    message: `确定要结算 ${selectedProducts.value.length} 件商品，总金额 ¥${totalAmount.value} 吗？`
  }).then(() => {
    emit('checkout', selectedProducts.value)
    showToast('结算成功！')
    productListRef.value?.clearSelected()
    selectedProducts.value = []
    selectedCount.value = 0
  })
}

// 监听选中项变化
watch(selectedCount, () => {
  updateSelectedProducts()
})

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => productListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => productListRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => productListRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => productListRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => {
    productListRef.value?.clearSelected()
    selectedProducts.value = []
    selectedCount.value = 0
  },
  /** 设置选中项 */
  setSelectedItems: (items: Product[]) => {
    productListRef.value?.setSelectedItems(items)
    selectedProducts.value = items
    selectedCount.value = items.length
  }
})
</script>

<style scoped>
.list-header {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.list-footer {
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-top: 8px;
}

.empty-product {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty-product p {
  margin-top: 16px;
  font-size: 14px;
}

.loading-product {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 6px;
  }
}
</style>