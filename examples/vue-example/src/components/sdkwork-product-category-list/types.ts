/**
 * SDKWork Product Category List 组件类型定义
 */

import type { Page } from 'sdkwork-commons-typescript'

/**
 * 商品数据类型
 */
export interface Product {
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

/**
 * 商品分类数据类型
 */
export interface ProductCategory {
  id: string | number
  name: string
  description?: string
  icon?: string
  color?: string
  count?: number
  sort?: number
  parentId?: string | number
  children?: ProductCategory[]
  [key: string]: any
}

/**
 * 组件属性类型
 */
export interface ProductCategoryListProps {
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

/**
 * 事件类型
 */
export interface ProductCategoryListEmits {
  /** 商品选择事件 */
  select: [product: Product]
  /** 商品删除事件 */
  delete: [product: Product]
  /** 搜索事件 */
  search: [keyword: string]
  /** 数据加载完成事件 */
  load: [pageData: Page<Product>]
  /** 分类选择事件 */
  'select-category': [category: ProductCategory]
}

/**
 * 商品项组件属性类型
 */
export interface ProductItemProps {
  /** 商品数据 */
  product: Product
  /** 商品索引 */
  index: number
  /** 是否选中 */
  selected?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
}

/**
 * 商品项组件事件类型
 */
export interface ProductItemEmits {
  /** 选择商品 */
  select: [product: Product]
  /** 删除商品 */
  delete: [product: Product]
}

/**
 * Mock数据接口类型
 */
export interface MockProductApi {
  /** 获取商品分类列表 */
  getProductCategories: () => Promise<ProductCategory[]>
  /** 获取商品列表 */
  getProductList: (params: any) => Promise<Page<Product>>
}

/**
 * 商品搜索参数类型
 */
export interface ProductSearchParams {
  /** 关键词 */
  keyword?: string
  /** 分类ID */
  categoryId?: string | number
  /** 价格范围 */
  priceRange?: [number, number]
  /** 排序方式 */
  sortBy?: 'price' | 'sales' | 'rating' | 'newest'
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
  /** 标签过滤 */
  tags?: string[]
  /** 库存状态 */
  inStock?: boolean
  /** 商品状态 */
  status?: Product['status']
}