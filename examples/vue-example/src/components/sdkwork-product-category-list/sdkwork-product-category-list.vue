<template>
  <SdkworkApiCategoryList
    :api="getProductList"
    :category-api="getProductCategories"
    :params="queryParams"
    :selectable="selectable"
    :deletable="deletable"
    :searchable="searchable"
    :page-size="pageSize"
    :item-key="itemKey"
    :item-title-field="itemTitleField"
    :item-description-field="itemDescriptionField"
    :category-key="categoryKey"
    :category-name-field="categoryNameField"
    :category-count-field="categoryCountField"
    :default-category-id="defaultCategoryId"
    @select="handleItemSelect"
    @delete="handleItemDelete"
    @search="handleSearch"
    @load="handleLoad"
    @select-category="handleCategorySelect"
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

    <!-- 自定义分类项内容 -->
    <template #category="{ category, index }">
      <div class="product-category-item">
        <slot name="category" :category="category" :index="index"> 
          <span class="category-name">{{ category.name }}</span> 
        </slot>
      </div>
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
  </SdkworkApiCategoryList>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SdkworkApiCategoryList from '../sdkwork-api-category-list/sdkwork-api-category-list.vue'
import ProductItem from './components/ProductItem.vue'
import { getProductCategories, getProductList } from './mock-data'
import type { Page } from 'sdkwork-commons-typescript'

// 商品数据类型
interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  categoryId: string | number
  stock: number
  status: 'active' | 'inactive' | 'soldout'
  tags?: string[]
  rating?: number
  sales?: number
  [key: string]: any
}

// 分类数据类型
interface Category {
  id: string | number
  name: string
  count?: number
  icon?: string
  [key: string]: any
}

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
  /** 分类唯一键字段 */
  categoryKey?: string
  /** 分类名称字段 */
  categoryNameField?: string
  /** 分类数量字段 */
  categoryCountField?: string
  /** 默认选中分类ID */
  defaultCategoryId?: string | number
  /** 查询参数 */
  params?: Record<string, any>
}

// 事件定义
interface Emits {
  (e: 'select', product: Product): void
  (e: 'delete', product: Product): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<Product>): void
  (e: 'select-category', category: Category): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  searchable: true,
  pageSize: 10,
  itemKey: 'id',
  itemTitleField: 'name',
  itemDescriptionField: 'description',
  categoryKey: 'id',
  categoryNameField: 'name',
  categoryCountField: 'count'
})

const emit = defineEmits<Emits>()

// 查询参数
const queryParams = ref({
  ...props.params
})



// 事件处理
const handleItemSelect = (product: Product) => {
  emit('select', product)
}

const handleItemDelete = (product: Product) => {
  emit('delete', product)
}

const handleSearch = (keyword: string) => {
  queryParams.value.keyword = keyword
  emit('search', keyword)
}

const handleLoad = (pageData: Page<Product>) => {
  emit('load', pageData)
}

const handleCategorySelect = (category: Category) => {
  queryParams.value.categoryId = category.id
  emit('select-category', category)
}
</script>

<style scoped>
.product-category-item {
  display: flex;
  align-items: center;
  padding: 8px 0px;
  gap: 8px;
}

.product-category-item .category-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.product-category-item .category-count {
  font-size: 12px;
  color: #999;
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
</style>