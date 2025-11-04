/**
 * Product Store - 商品和SKU管理模块
 * 提供完整的商品管理功能，包括商品列表、SKU管理、搜索筛选等
 */

import { defineStore } from 'pinia'
import {
  ProductStatus,
  ProductCategory,
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
  ProductPagination,
  DEFAULT_PRODUCT_QUERY,
  DEFAULT_SKU_QUERY
} from './types'

// 默认商品分页信息
const DEFAULT_PAGINATION: ProductPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
  hasMore: false
}

// 默认分类统计
const DEFAULT_CATEGORY_STATS: Record<ProductCategory, number> = {
  [ProductCategory.ELECTRONICS]: 0,
  [ProductCategory.CLOTHING]: 0,
  [ProductCategory.FOOD]: 0,
  [ProductCategory.BOOKS]: 0,
  [ProductCategory.HOME]: 0,
  [ProductCategory.SPORTS]: 0,
  [ProductCategory.BEAUTY]: 0,
  [ProductCategory.TOYS]: 0,
  [ProductCategory.OTHER]: 0
}

export const useProductStore = defineStore('product', {
  // ==================== State ====================
  state: (): ProductState => ({
    // 商品列表
    products: [],
    
    // 当前操作的商品
    currentProduct: null,
    
    // 商品加载状态
    productsLoading: false,
    
    // 商品操作错误信息
    productError: null,
    
    // 商品分页信息
    productPagination: DEFAULT_PAGINATION,
    
    // 商品搜索参数
    searchParams: DEFAULT_PRODUCT_QUERY,
    
    // SKU列表
    skus: [],
    
    // 当前操作的SKU
    currentSku: null,
    
    // SKU加载状态
    skusLoading: false,
    
    // SKU操作错误信息
    skuError: null,
    
    // 商品分类统计
    categoryStats: DEFAULT_CATEGORY_STATS,
    
    // 商品标签列表
    allTags: []
  }),

  // ==================== Getters ====================
  getters: {
    /**
     * 获取商品列表
     */
    productList: (state): Product[] => state.products,
    
    /**
     * 获取当前商品
     */
    activeProduct: (state): Product | null => state.currentProduct,
    
    /**
     * 检查商品是否正在加载
     */
    isProductsLoading: (state): boolean => state.productsLoading,
    
    /**
     * 获取商品错误信息
     */
    productErrorMessage: (state): string | null => state.productError,
    
    /**
     * 获取商品分页信息
     */
    paginationInfo: (state): ProductPagination => state.productPagination,
    
    /**
     * 获取搜索参数
     */
    searchParameters: (state): ProductQueryParams => state.searchParams,
    
    /**
     * 获取SKU列表
     */
    skuList: (state): Sku[] => state.skus,
    
    /**
     * 获取当前SKU
     */
    activeSku: (state): Sku | null => state.currentSku,
    
    /**
     * 检查SKU是否正在加载
     */
    isSkusLoading: (state): boolean => state.skusLoading,
    
    /**
     * 获取SKU错误信息
     */
    skuErrorMessage: (state): string | null => state.skuError,
    
    /**
     * 获取分类统计
     */
    categoryStatistics: (state): Record<ProductCategory, number> => state.categoryStats,
    
    /**
     * 获取所有标签
     */
    tags: (state): string[] => state.allTags,
    
    /**
     * 获取已发布的商品
     */
    publishedProducts: (state): Product[] => {
      return state.products.filter(product => product.status === ProductStatus.PUBLISHED)
    },
    
    /**
     * 获取推荐商品
     */
    featuredProducts: (state): Product[] => {
      return state.products.filter(product => product.isFeatured && product.status === ProductStatus.PUBLISHED)
    },
    
    /**
     * 获取有库存的商品
     */
    availableProducts: (state): Product[] => {
      return state.products.filter(product => {
        if (product.status !== ProductStatus.PUBLISHED) return false
        return product.skus.some(sku => sku.stock.available > 0)
      })
    },
    
    /**
     * 获取商品统计信息
     */
    productStats: (state) => {
      const stats = {
        total: state.products.length,
        published: 0,
        draft: 0,
        disabled: 0,
        featured: 0,
        available: 0
      }
      
      state.products.forEach(product => {
        switch (product.status) {
          case ProductStatus.PUBLISHED:
            stats.published++
            if (product.isFeatured) stats.featured++
            if (product.skus.some(sku => sku.stock.available > 0)) stats.available++
            break
          case ProductStatus.DRAFT:
            stats.draft++
            break
          case ProductStatus.DISABLED:
            stats.disabled++
            break
        }
      })
      
      return stats
    },
    
    /**
     * 获取当前商品的SKU列表
     */
    currentProductSkus: (state): Sku[] => {
      if (!state.currentProduct) return []
      return state.currentProduct.skus
    },
    
    /**
     * 获取当前商品的最低价格
     */
    currentProductMinPrice: (state): number | null => {
      if (!state.currentProduct || state.currentProduct.skus.length === 0) return null
      return Math.min(...state.currentProduct.skus.map(sku => sku.price.current))
    },
    
    /**
     * 获取当前商品的最高价格
     */
    currentProductMaxPrice: (state): number | null => {
      if (!state.currentProduct || state.currentProduct.skus.length === 0) return null
      return Math.max(...state.currentProduct.skus.map(sku => sku.price.current))
    }
  },

  // ==================== Actions ====================
  actions: {
    // ==================== 商品管理 Actions ====================

    /**
     * 创建商品
     */
    async createProduct(params: CreateProductParams): Promise<Product> {
      this.productsLoading = true
      this.productError = null

      try {
        // 生成商品ID
        const productId = `PRODUCT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // 创建商品对象
        const product: Product = {
          id: productId,
          name: params.name,
          description: params.description,
          shortDescription: params.shortDescription,
          category: params.category,
          images: params.images.map((img, index) => ({
            id: `IMG_${Date.now()}_${index}`,
            ...img
          })),
          specs: params.specs.map((spec, index) => ({
            id: `SPEC_${Date.now()}_${index}`,
            ...spec
          })),
          skus: [],
          tags: params.tags || [],
          status: ProductStatus.DRAFT,
          isFeatured: params.isFeatured || false,
          isAvailable: false,
          viewCount: 0,
          saleCount: 0,
          rating: 0,
          reviewCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }

        // 添加到商品列表
        this.products.unshift(product)
        this.currentProduct = product

        // 更新分类统计
        this.updateCategoryStats()
        
        // 更新标签列表
        this.updateTags()

        console.log(`商品创建成功: ${productId}, 名称: ${params.name}`)
        
        return product
      } catch (error) {
        this.productError = error instanceof Error ? error.message : '创建商品失败'
        console.error('创建商品失败:', error)
        throw error
      } finally {
        this.productsLoading = false
      }
    },

     

    /**
     * 删除商品
     */
    async deleteProduct(productId: string): Promise<boolean> {
      this.productsLoading = true
      this.productError = null

      try {
        const productIndex = this.products.findIndex(p => p.id === productId)
        
        if (productIndex === -1) {
          throw new Error(`商品不存在: ${productId}`)
        }

        // 软删除：将状态改为已删除
        this.products[productIndex].status = ProductStatus.DELETED
        this.products[productIndex].updatedAt = Date.now()

        // 如果当前商品是正在删除的商品，清空currentProduct
        if (this.currentProduct?.id === productId) {
          this.currentProduct = null
        }

        // 更新分类统计
        this.updateCategoryStats()

        console.log(`商品删除成功: ${productId}`)
        
        return true
      } catch (error) {
        this.productError = error instanceof Error ? error.message : '删除商品失败'
        console.error('删除商品失败:', error)
        throw error
      } finally {
        this.productsLoading = false
      }
    },

    /**
     * 获取商品列表
     */
    async fetchProducts(params?: ProductQueryParams): Promise<Product[]> {
      this.productsLoading = true
      this.productError = null

      try {
        // 合并搜索参数
        this.searchParams = {
          ...this.searchParams,
          ...params
        }

        // 模拟API调用获取商品列表
        // 在实际项目中，这里应该调用后端API
        await new Promise(resolve => setTimeout(resolve, 500))

        // 应用筛选条件
        let filteredProducts = this.products.filter(product => {
          // 状态筛选
          if (this.searchParams.status && product.status !== this.searchParams.status) {
            return false
          }
          
          // 分类筛选
          if (this.searchParams.category && product.category !== this.searchParams.category) {
            return false
          }
          
          // 推荐筛选
          if (this.searchParams.isFeatured !== undefined && product.isFeatured !== this.searchParams.isFeatured) {
            return false
          }
          
          // 关键词搜索
          if (this.searchParams.keyword) {
            const keyword = this.searchParams.keyword.toLowerCase()
            const nameMatch = product.name.toLowerCase().includes(keyword)
            const descMatch = product.description?.toLowerCase().includes(keyword)
            const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(keyword))
            
            if (!nameMatch && !descMatch && !tagMatch) {
              return false
            }
          }
          
          // 标签筛选
          if (this.searchParams.tags && this.searchParams.tags.length > 0) {
            const hasMatchingTag = this.searchParams.tags.some(tag => 
              product.tags.includes(tag)
            )
            if (!hasMatchingTag) return false
          }
          
          // 价格筛选
          if (this.searchParams.minPrice || this.searchParams.maxPrice) {
            const minPrice = product.skus.reduce((min, sku) => Math.min(min, sku.price.current), Infinity)
            const maxPrice = product.skus.reduce((max, sku) => Math.max(max, sku.price.current), 0)
            
            if (this.searchParams.minPrice && minPrice < this.searchParams.minPrice) return false
            if (this.searchParams.maxPrice && maxPrice > this.searchParams.maxPrice) return false
          }
          
          return true
        })

        // 应用排序
        filteredProducts.sort((a, b) => {
          const order = this.searchParams.sortOrder === 'asc' ? 1 : -1
          
          switch (this.searchParams.sortBy) {
            case 'price':
              const aMinPrice = a.skus.reduce((min, sku) => Math.min(min, sku.price.current), Infinity)
              const bMinPrice = b.skus.reduce((min, sku) => Math.min(min, sku.price.current), Infinity)
              return (aMinPrice - bMinPrice) * order
            
            case 'saleCount':
              return (a.saleCount - b.saleCount) * order
            
            case 'rating':
              return (a.rating - b.rating) * order
            
            case 'updatedAt':
              return (a.updatedAt - b.updatedAt) * order
            
            case 'createdAt':
            default:
              return (a.createdAt - b.createdAt) * order
          }
        })

        // 更新分页信息
        const page = this.searchParams.page || 1
        const pageSize = this.searchParams.pageSize || 20
        const total = filteredProducts.length
        const totalPages = Math.ceil(total / pageSize)
        const hasMore = page < totalPages

        this.productPagination = {
          page,
          pageSize,
          total,
          totalPages,
          hasMore
        }

        // 返回分页后的商品列表
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

        console.log(`获取商品列表成功，第${page}页，共${paginatedProducts.length}条记录`)
        
        return paginatedProducts
      } catch (error) {
        this.productError = error instanceof Error ? error.message : '获取商品列表失败'
        console.error('获取商品列表失败:', error)
        throw error
      } finally {
        this.productsLoading = false
      }
    },

    /**
     * 获取商品详情
     */
    async getProductDetail(productId: string): Promise<Product> {
      this.productsLoading = true
      this.productError = null

      try {
        const product = this.products.find(p => p.id === productId)
        
        if (!product) {
          throw new Error(`商品不存在: ${productId}`)
        }

        this.currentProduct = product
        
        // 增加浏览量
        product.viewCount++
        product.updatedAt = Date.now()

        console.log(`获取商品详情成功: ${productId}`)
        
        return product
      } catch (error) {
        this.productError = error instanceof Error ? error.message : '获取商品详情失败'
        console.error('获取商品详情失败:', error)
        throw error
      } finally {
        this.productsLoading = false
      }
    },

    /**
     * 搜索商品
     */
    async searchProducts(keyword: string, params?: Omit<ProductQueryParams, 'keyword'>): Promise<Product[]> {
      return await this.fetchProducts({
        ...params,
        keyword
      })
    },

    /**
     * 设置当前商品
     */
    setCurrentProduct(product: Product | null): void {
      this.currentProduct = product
    },

    /**
     * 清除商品错误信息
     */
    clearProductError(): void {
      this.productError = null
    },

    /**
     * 重置搜索参数
     */
    resetSearchParams(): void {
      this.searchParams = DEFAULT_PRODUCT_QUERY
    },

    // ==================== SKU管理 Actions ====================

    /**
     * 创建SKU
     */
    async createSku(params: CreateSkuParams): Promise<Sku> {
      this.skusLoading = true
      this.skuError = null

      try {
        const product = this.products.find(p => p.id === params.productId)
        
        if (!product) {
          throw new Error(`商品不存在: ${params.productId}`)
        }

        // 检查SKU编码是否重复
        const existingSku = product.skus.find(sku => sku.skuCode === params.skuCode)
        if (existingSku) {
          throw new Error(`SKU编码已存在: ${params.skuCode}`)
        }

        // 生成SKU ID
        const skuId = `SKU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // 创建SKU对象
        const sku: Sku = {
          id: skuId,
          productId: params.productId,
          skuCode: params.skuCode,
          attributes: params.attributes.map((attr, index) => ({
            id: `ATTR_${Date.now()}_${index}`,
            ...attr
          })),
          price: {
            ...params.price,
            currency: 'CNY'
          },
          stock: {
            ...params.stock,
            available: params.stock.quantity - params.stock.reserved
          },
          image: params.image,
          status: ProductStatus.PUBLISHED,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }

        // 添加到商品SKU列表
        product.skus.push(sku)
        product.updatedAt = Date.now()

        // 如果商品状态是已发布，更新可用状态
        if (product.status === ProductStatus.PUBLISHED) {
          product.isAvailable = product.skus.some(s => s.stock.available > 0)
        }

        // 更新当前商品
        if (this.currentProduct?.id === params.productId) {
          this.currentProduct = product
        }

        console.log(`SKU创建成功: ${skuId}, 商品: ${params.productId}`)
        
        return sku
      } catch (error) {
        this.skuError = error instanceof Error ? error.message : '创建SKU失败'
        console.error('创建SKU失败:', error)
        throw error
      } finally {
        this.skusLoading = false
      }
    },
 

    /**
     * 获取SKU列表
     */
    async fetchSkus(params?: SkuQueryParams): Promise<Sku[]> {
      this.skusLoading = true
      this.skuError = null

      try {
        // 模拟API调用获取SKU列表
        await new Promise(resolve => setTimeout(resolve, 300))

        let filteredSkus: Sku[] = []

        // 收集所有SKU
        this.products.forEach(product => {
          filteredSkus.push(...product.skus)
        })

        // 应用筛选条件
        if (params?.productId) {
          filteredSkus = filteredSkus.filter(sku => sku.productId === params.productId)
        }

        if (params?.status) {
          filteredSkus = filteredSkus.filter(sku => sku.status === params.status)
        }

        if (params?.inStock) {
          filteredSkus = filteredSkus.filter(sku => sku.stock.available > 0)
        }

        console.log(`获取SKU列表成功，共${filteredSkus.length}条记录`)
        
        return filteredSkus
      } catch (error) {
        this.skuError = error instanceof Error ? error.message : '获取SKU列表失败'
        console.error('获取SKU列表失败:', error)
        throw error
      } finally {
        this.skusLoading = false
      }
    },

    /**
     * 获取SKU详情
     */
    async getSkuDetail(skuId: string): Promise<Sku> {
      this.skusLoading = true
      this.skuError = null

      try {
        let foundSku: Sku | null = null
        
        // 在所有商品中查找SKU
        for (const product of this.products) {
          const sku = product.skus.find(s => s.id === skuId)
          if (sku) {
            foundSku = sku
            this.currentProduct = product
            break
          }
        }

        if (!foundSku) {
          throw new Error(`SKU不存在: ${skuId}`)
        }

        this.currentSku = foundSku

        console.log(`获取SKU详情成功: ${skuId}`)
        
        return foundSku
      } catch (error) {
        this.skuError = error instanceof Error ? error.message : '获取SKU详情失败'
        console.error('获取SKU详情失败:', error)
        throw error
      } finally {
        this.skusLoading = false
      }
    },

    /**
     * 设置当前SKU
     */
    setCurrentSku(sku: Sku | null): void {
      this.currentSku = sku
    },

    /**
     * 清除SKU错误信息
     */
    clearSkuError(): void {
      this.skuError = null
    },

    // ==================== 辅助方法 ====================

    /**
     * 更新分类统计
     */
    updateCategoryStats(): void {
      const stats = { ...DEFAULT_CATEGORY_STATS }
      
      this.products.forEach(product => {
        if (product.status !== ProductStatus.DELETED) {
          stats[product.category] = (stats[product.category] || 0) + 1
        }
      })
      
      this.categoryStats = stats
    },

    /**
     * 更新标签列表
     */
    updateTags(): void {
      const allTags = new Set<string>()
      
      this.products.forEach(product => {
        product.tags.forEach(tag => allTags.add(tag))
      })
      
      this.allTags = Array.from(allTags).sort()
    },

    /**
     * 生成SKU编码
     */
    generateSkuCode(productId: string, attributes: SkuAttribute[]): string {
      const attributeStr = attributes
        .map(attr => `${attr.name}:${attr.value}`)
        .join('_')
        .replace(/[^a-zA-Z0-9:_]/g, '')
      
      return `${productId}_${attributeStr}`
    },

    /**
     * 检查SKU属性组合是否唯一
     */
    isSkuAttributeCombinationUnique(productId: string, attributes: SkuAttribute[]): boolean {
      const product = this.products.find(p => p.id === productId)
      if (!product) return true

      return !product.skus.some(sku => {
        if (sku.attributes.length !== attributes.length) return false
        
        return sku.attributes.every(skuAttr => {
          const matchingAttr = attributes.find(attr => attr.name === skuAttr.name)
          return matchingAttr && matchingAttr.value === skuAttr.value
        })
      })
    },

    /**
     * 获取商品的最低价格
     */
    getProductMinPrice(product: Product): number {
      if (product.skus.length === 0) return 0
      return Math.min(...product.skus.map(sku => sku.price.current))
    },

    /**
     * 获取商品的最高价格
     */
    getProductMaxPrice(product: Product): number {
      if (product.skus.length === 0) return 0
      return Math.max(...product.skus.map(sku => sku.price.current))
    },

    /**
     * 获取商品的总库存
     */
    getProductTotalStock(product: Product): number {
      return product.skus.reduce((total, sku) => total + sku.stock.quantity, 0)
    },

    /**
     * 获取商品的可售库存
     */
    getProductAvailableStock(product: Product): number {
      return product.skus.reduce((total, sku) => total + sku.stock.available, 0)
    }
  }
})