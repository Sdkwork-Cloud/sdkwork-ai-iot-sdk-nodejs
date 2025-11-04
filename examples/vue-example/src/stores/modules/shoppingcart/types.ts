// 购物车相关类型定义

/**
 * 商品状态枚举
 */
export enum ProductStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

/**
 * 商家类型枚举
 */
export enum MerchantType {
  SELF_OPERATED = 'self_operated', // 自营
  THIRD_PARTY = 'third_party',     // 第三方
  STORE = 'store'                 // 门店
}

/**
 * 商家信息
 */
export interface Merchant {
  id: string
  name: string
  type: MerchantType
  logo?: string
  description?: string
  address?: string
  phone?: string
  rating?: number
}

/**
 * 商品基本信息
 */
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  category?: string
  tags?: string[]
  stock: number
  status: ProductStatus
  merchantId: string
  merchantType: MerchantType
  createdAt: string
  updatedAt: string
}

/**
 * 购物车商品项
 */
export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selected: boolean
  addedAt: string
  updatedAt: string
}

/**
 * 购物车分组
 */
export interface CartGroup {
  merchantId: string
  merchantType: MerchantType
  merchantName: string
  items: CartItem[]
  selected: boolean
  totalQuantity: number
  totalPrice: number
  discountAmount: number
  finalPrice: number
}

/**
 * 购物车操作参数
 */
export interface AddToCartParams {
  productId: string
  product: Product
  quantity?: number
}

/**
 * 购物车更新参数
 */
export interface UpdateCartItemParams {
  quantity?: number
  selected?: boolean
}

/**
 * 购物车查询参数
 */
export interface CartQueryParams {
  selectedOnly?: boolean
  merchantType?: MerchantType
  merchantId?: string
}

/**
 * 分组操作参数
 */
export interface GroupOperationParams {
  merchantId: string
  selected?: boolean
}

/**
 * 购物车统计信息
 */
export interface CartStats {
  totalItems: number
  totalQuantity: number
  selectedItems: number
  selectedQuantity: number
  totalPrice: number
  selectedPrice: number
  discountAmount: number
  finalPrice: number
  groupStats: GroupStats[]
}

/**
 * 分组统计信息
 */
export interface GroupStats {
  merchantId: string
  merchantType: MerchantType
  merchantName: string
  totalItems: number
  totalQuantity: number
  selectedItems: number
  selectedQuantity: number
  totalPrice: number
  selectedPrice: number
  discountAmount: number
  finalPrice: number
}

/**
 * 购物车状态接口
 */
export interface CartState {
  // 购物车商品列表
  items: CartItem[]
  
  // 商家信息映射
  merchants: Record<string, Merchant>
  
  // 加载状态
  loading: boolean
  
  // 错误信息
  error: string | null
  
  // 最后更新时间
  lastUpdated: string | null
}