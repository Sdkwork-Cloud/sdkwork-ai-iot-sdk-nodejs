/**
 * Product Store - 商品和SKU类型定义文件
 * 统一管理商品模块的所有类型定义
 */

// 商品状态枚举
export enum ProductStatus {
  DRAFT = 'draft', // 草稿
  PUBLISHED = 'published', // 已发布
  DISABLED = 'disabled', // 已禁用
  DELETED = 'deleted' // 已删除
}

// 商品分类枚举
export enum ProductCategory {
  ELECTRONICS = 'electronics', // 电子产品
  CLOTHING = 'clothing', // 服装
  FOOD = 'food', // 食品
  BOOKS = 'books', // 图书
  HOME = 'home', // 家居
  SPORTS = 'sports', // 运动
  BEAUTY = 'beauty', // 美妆
  TOYS = 'toys', // 玩具
  OTHER = 'other' // 其他
}

// SKU属性类型
export interface SkuAttribute {
  id: string // 属性ID
  name: string // 属性名称
  value: string // 属性值
  image?: string // 属性图片
}

// SKU库存信息
export interface SkuStock {
  quantity: number // 库存数量
  reserved: number // 预留数量
  available: number // 可用数量
}

// SKU价格信息
export interface SkuPrice {
  original: number // 原价（单位：分）
  current: number // 现价（单位：分）
  discount?: number // 折扣
  currency: string // 货币类型
}

// SKU接口
export interface Sku {
  id: string // SKU ID
  productId: string // 商品ID
  skuCode: string // SKU编码
  attributes: SkuAttribute[] // SKU属性
  price: SkuPrice // 价格信息
  stock: SkuStock // 库存信息
  image?: string // SKU图片
  status: ProductStatus // 状态
  createdAt: number // 创建时间戳
  updatedAt: number // 更新时间戳
}

// 商品图片接口
export interface ProductImage {
  id: string // 图片ID
  url: string // 图片URL
  alt?: string // 图片描述
  isPrimary: boolean // 是否为主图
  order: number // 排序
}

// 商品规格接口
export interface ProductSpec {
  id: string // 规格ID
  name: string // 规格名称
  values: string[] // 规格值
  required: boolean // 是否必选
}

// 商品接口
export interface Product {
  id: string // 商品ID
  name: string // 商品名称
  description?: string // 商品描述
  shortDescription?: string // 商品简介
  category: ProductCategory // 商品分类
  images: ProductImage[] // 商品图片
  specs: ProductSpec[] // 商品规格
  skus: Sku[] // SKU列表
  tags: string[] // 商品标签
  status: ProductStatus // 商品状态
  isFeatured: boolean // 是否推荐
  isAvailable: boolean // 是否可售
  viewCount: number // 浏览量
  saleCount: number // 销量
  rating: number // 评分
  reviewCount: number // 评价数
  createdAt: number // 创建时间戳
  updatedAt: number // 更新时间戳
  publishedAt?: number // 发布时间戳
}

// 创建商品参数
export interface CreateProductParams {
  name: string // 商品名称
  description?: string // 商品描述
  shortDescription?: string // 商品简介
  category: ProductCategory // 商品分类
  images: Omit<ProductImage, 'id'>[] // 商品图片
  specs: Omit<ProductSpec, 'id'>[] // 商品规格
  tags?: string[] // 商品标签
  isFeatured?: boolean // 是否推荐
}

// 更新商品参数
export interface UpdateProductParams extends Partial<CreateProductParams> {
  id: string // 商品ID
  status?: ProductStatus // 商品状态
}

// 创建SKU参数
export interface CreateSkuParams {
  productId: string // 商品ID
  skuCode: string // SKU编码
  attributes: Omit<SkuAttribute, 'id'>[] // SKU属性
  price: Omit<SkuPrice, 'currency'> // 价格信息
  stock: Omit<SkuStock, 'available'> // 库存信息
  image?: string // SKU图片
}

// 更新SKU参数
export interface UpdateSkuParams extends Partial<CreateSkuParams> {
  id: string // SKU ID
  status?: ProductStatus // SKU状态
}

// 商品查询参数
export interface ProductQueryParams {
  category?: ProductCategory // 分类筛选
  status?: ProductStatus // 状态筛选
  keyword?: string // 关键词搜索
  isFeatured?: boolean // 是否推荐
  minPrice?: number // 最低价格
  maxPrice?: number // 最高价格
  tags?: string[] // 标签筛选
  page?: number // 页码
  pageSize?: number // 每页数量
  sortBy?: 'createdAt' | 'updatedAt' | 'price' | 'saleCount' | 'rating' // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// SKU查询参数
export interface SkuQueryParams {
  productId?: string // 商品ID
  status?: ProductStatus // 状态筛选
  inStock?: boolean // 是否有库存
  page?: number // 页码
  pageSize?: number // 每页数量
}

// 商品分页信息
export interface ProductPagination {
  page: number // 当前页码
  pageSize: number // 每页数量
  total: number // 总数量
  totalPages: number // 总页数
  hasMore: boolean // 是否有更多
}

// Product Store 状态接口
export interface ProductState {
  // 商品列表
  products: Product[]
  
  // 当前操作的商品
  currentProduct: Product | null
  
  // 商品加载状态
  productsLoading: boolean
  
  // 商品操作错误信息
  productError: string | null
  
  // 商品分页信息
  productPagination: ProductPagination
  
  // 商品搜索参数
  searchParams: ProductQueryParams
  
  // SKU列表
  skus: Sku[]
  
  // 当前操作的SKU
  currentSku: Sku | null
  
  // SKU加载状态
  skusLoading: boolean
  
  // SKU操作错误信息
  skuError: string | null
  
  // 商品分类统计
  categoryStats: Record<ProductCategory, number>
  
  // 商品标签列表
  allTags: string[]
}

// 默认商品查询参数
export const DEFAULT_PRODUCT_QUERY: ProductQueryParams = {
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

// 默认SKU查询参数
export const DEFAULT_SKU_QUERY: SkuQueryParams = {
  page: 1,
  pageSize: 50
}
 