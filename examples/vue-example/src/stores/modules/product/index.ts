/**
 * Product Store 模块导出
 */

// 导出商品管理store
export { useProductStore } from './product'

// 导出商品相关类型和枚举
export type {
  Product,
  Sku,
  ProductImage,
  ProductSpec,
  SkuAttribute,
  SkuPrice,
  SkuStock,
  CreateProductParams,
  UpdateProductParams,
  CreateSkuParams,
  UpdateSkuParams,
  ProductQueryParams,
  SkuQueryParams,
  ProductState,
  ProductPagination
} from './types'

export {
  ProductStatus,
  ProductCategory,
  DEFAULT_PRODUCT_QUERY,
  DEFAULT_SKU_QUERY
} from './types'