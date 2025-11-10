<template>
  <div class="product-list-logic">
    <!-- 商品列表组件 -->
    <SdkworkProductList
      ref="productListRef"
      :selectable="selectable"
      :deletable="deletable"
      :searchable="searchable"
      :page-size="pageSize"
      :params="filterParams"
      @select="handleProductSelect"
      @delete="handleProductDelete"
      @search="handleSearch"
      @load="handleLoad"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast, showDialog } from 'vant' 
import type { Product, ProductQueryParams } from '@/components/sdkwork-product-list/mock-data'
definePage({
  meta: {
    title: '商品列表',
    hideBackButton: false, 
  }
})
// 组件引用
const productListRef = ref<any>()

// 状态控制
const selectable = ref(false)
const deletable = ref(false)
const searchable = ref(true)
const pageSize = ref(5)

// 筛选参数
const filterParams = ref<ProductQueryParams|any>({
  keyword: '',
  categoryId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  status: undefined,
  tagsInput: ''
})

// 列表数据
const totalProducts = ref(0)
const selectedCount = ref(0)
const currentPage = ref(0)
const totalPages = ref(0)
const selectedProducts = ref<Product[]>([])

// 计算属性
const totalAmount = computed(() => {
  return selectedProducts.value.reduce((sum, product) => sum + product.price, 0)
})

// 生命周期
onMounted(() => {
  showToast('商品列表已加载')
})

// 控制方法
const refreshList = () => {
  productListRef.value?.refresh()
  showToast('列表已刷新')
}

const loadMore = () => {
  productListRef.value?.loadMore()
  showToast('正在加载更多...')
}

const clearSelected = () => {
  productListRef.value?.clearSelected()
  selectedProducts.value = []
  selectedCount.value = 0
  showToast('已清空选择')
}

// 筛选方法
const applyFilters = () => {
  // 处理标签输入
  const tags = filterParams.value.tagsInput
    ? filterParams.value.tagsInput.split(',').map((tag:any) => tag.trim()).filter((tag:any) => tag)
    : undefined

  // 更新筛选参数
  const newParams: ProductQueryParams = {
    ...filterParams.value,
    tags: tags
  }

  // 清除空值
  Object.keys(newParams).forEach(key => {
    if (newParams[key as keyof ProductQueryParams] === '' || newParams[key as keyof ProductQueryParams] === undefined) {
      delete newParams[key as keyof ProductQueryParams]
    }
  })

  // 应用筛选
  productListRef.value?.refresh()
  showToast('筛选条件已应用')
}

// 事件处理
const handleProductSelect = (product: Product) => {
  console.log('选中商品:', product)
  updateSelectedProducts()
}

const handleProductDelete = (product: Product) => {
  console.log('删除商品:', product)
  showDialog({
    title: '删除成功',
    message: `商品"${product.name}"已被删除`
  })
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  filterParams.value.keyword = keyword
}

const handleLoad = (pageData: any) => {
  totalProducts.value = pageData.totalElements || 0
  currentPage.value = pageData.number || 0
  totalPages.value = pageData.totalPages || 0
  console.log('加载数据:', pageData)
}

const handleCheckout = (products: Product[]) => {
  showDialog({
    title: '结算确认',
    message: `确定要结算 ${products.length} 件商品，总金额 ¥${totalAmount.value} 吗？`
  }).then(() => {
    showToast('结算成功！')
    // 这里可以添加实际的结算逻辑
  })
}

// 更新选中商品列表
const updateSelectedProducts = () => {
  const items = productListRef.value?.getSelectedItems() || []
  selectedProducts.value = items
  selectedCount.value = items.length
}

// 移除选中商品
const removeSelectedProduct = (product: Product) => {
  const currentSelected = productListRef.value?.getSelectedItems() || []
  const newSelected = currentSelected.filter((item:any) => item.id !== product.id)
  productListRef.value?.setSelectedItems(newSelected)
  updateSelectedProducts()
  showToast(`已移除: ${product.name}`)
}

// 暴露方法给父组件
defineExpose({
  refreshList,
  loadMore,
  clearSelected,
  applyFilters,
  getSelectedProducts: () => selectedProducts.value,
  getTotalProducts: () => totalProducts.value,
  getSelectedCount: () => selectedCount.value,
  getCurrentPage: () => currentPage.value,
  getTotalPages: () => totalPages.value,
  getTotalAmount: () => totalAmount.value
})
</script>

<style scoped>
.product-list-logic {
  width: 100%;
  height: 100%;
}
</style>