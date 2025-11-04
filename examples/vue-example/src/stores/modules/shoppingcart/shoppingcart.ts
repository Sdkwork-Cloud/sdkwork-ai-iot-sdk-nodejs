import { defineStore } from 'pinia'
import type { 
  CartItem, 
  CartState, 
  AddToCartParams, 
  UpdateCartItemParams, 
  CartQueryParams, 
  CartStats,
  GroupStats,
  CartGroup,
  GroupOperationParams,
  Merchant
} from './types'
import { ProductStatus, MerchantType } from './types'

/**
 * 购物车 Store
 * 专注于购物车商品管理、数量调整、选择操作等
 */
export const useShoppingCartStore = defineStore('shoppingcart', {
  // ==================== State ====================
  state: (): CartState => ({
    // 购物车商品列表
    items: [],
    
    // 商家信息映射
    merchants: {},
    
    // 加载状态
    loading: false,
    
    // 错误信息
    error: null,
    
    // 最后更新时间
    lastUpdated: null
  }),

  // ==================== Getters ====================
  getters: {
    /**
     * 检查购物车是否为空
     */
    isEmpty: (state): boolean => {
      return state.items.length === 0
    },

    /**
     * 获取购物车商品总数
     */
    totalItems: (state): number => {
      return state.items.length
    },

    /**
     * 获取购物车商品总数量
     */
    totalQuantity: (state): number => {
      return state.items.reduce((total: number, item) => total + item.quantity, 0)
    },

    /**
     * 获取选中的商品列表
     */
    selectedItems: (state): CartItem[] => {
      return state.items.filter(item => item.selected)
    },

    /**
     * 获取选中的商品数量
     */
    selectedQuantity: (state): number => {
      return state.items.filter(item => item.selected).reduce((total: number, item) => total + item.quantity, 0)
    },

    /**
     * 获取购物车总价格
     */
    totalPrice: (state): number => {
      return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    },

    /**
     * 获取选中商品总价格
     */
    selectedPrice: (state): number => {
      return state.items.filter(item => item.selected).reduce((total: number, item) => total + (item.product.price * item.quantity), 0)
    },

    /**
     * 获取折扣金额
     */
    discountAmount: (state): number => {
      return state.items.reduce((total, item) => {
        const originalPrice = item.product.originalPrice || item.product.price
        return total + ((originalPrice - item.product.price) * item.quantity)
      }, 0)
    },

    /**
     * 获取最终价格（总价 - 折扣）
     */
    finalPrice: (state): number => {
      return state.items.reduce((total: number, item) => total + (item.product.price * item.quantity), 0)
    },

    /**
     * 获取购物车统计信息
     */
    cartStats: (state): CartStats => {
      const totalPrice = state.items.reduce((total: number, item) => total + (item.product.price * item.quantity), 0)
      const selectedItems = state.items.filter(item => item.selected)
      const selectedPrice = selectedItems.reduce((total: number, item) => total + (item.product.price * item.quantity), 0)
      const discountAmount = state.items.reduce((total: number, item) => {
        const originalPrice = item.product.originalPrice || item.product.price
        return total + ((originalPrice - item.product.price) * item.quantity)
      }, 0)
      
      // 计算分组统计信息
      const groupStats: GroupStats[] = []
      const groups: Record<string, CartGroup> = {}
      
      state.items.forEach(item => {
        const merchantId = item.product.merchantId
        const merchant = state.merchants[merchantId]
        
        if (!groups[merchantId]) {
          groups[merchantId] = {
            merchantId,
            merchantType: item.product.merchantType,
            merchantName: merchant?.name || '未知商家',
            items: [],
            selected: false,
            totalQuantity: 0,
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0
          }
        }
        
        groups[merchantId].items.push(item)
        groups[merchantId].totalQuantity += item.quantity
        groups[merchantId].totalPrice += item.product.price * item.quantity
        
        const originalPrice = item.product.originalPrice || item.product.price
        groups[merchantId].discountAmount += (originalPrice - item.product.price) * item.quantity
        
        if (item.selected) {
          groups[merchantId].selected = true
        }
      })
      
      Object.values(groups).forEach(group => {
        group.finalPrice = group.totalPrice
        
        groupStats.push({
          merchantId: group.merchantId,
          merchantType: group.merchantType,
          merchantName: group.merchantName,
          totalItems: group.items.length,
          totalQuantity: group.totalQuantity,
          selectedItems: group.items.filter(item => item.selected).length,
          selectedQuantity: group.items.filter(item => item.selected).reduce((total: number, item) => total + item.quantity, 0),
          totalPrice: group.totalPrice,
          selectedPrice: group.items.filter(item => item.selected).reduce((total: number, item) => total + (item.product.price * item.quantity), 0),
          discountAmount: group.discountAmount,
          finalPrice: group.finalPrice
        })
      })
      
      return {
        totalItems: state.items.length,
        totalQuantity: state.items.reduce((total: number, item) => total + item.quantity, 0),
        selectedItems: selectedItems.length,
        selectedQuantity: selectedItems.reduce((total: number, item) => total + item.quantity, 0),
        totalPrice: totalPrice,
        selectedPrice: selectedPrice,
        discountAmount: discountAmount,
        finalPrice: totalPrice,
        groupStats: groupStats
      }
    },

    /**
     * 检查是否有错误
     */
    hasError: (state): boolean => {
      return state.error !== null
    },

    /**
     * 检查是否有库存不足的商品
     */
    hasOutOfStockItems: (state): boolean => {
      return state.items.some(item => 
        item.product.status === ProductStatus.OUT_OF_STOCK || 
        item.quantity > item.product.stock
      )
    },

    /**
     * 获取库存不足的商品列表
     */
    outOfStockItems: (state): CartItem[] => {
      return state.items.filter(item => 
        item.product.status === ProductStatus.OUT_OF_STOCK || 
        item.quantity > item.product.stock
      )
    },

    /**
     * 获取购物车分组列表
     */
    cartGroups: (state): CartGroup[] => {
      const groups: Record<string, CartGroup> = {}
      
      state.items.forEach(item => {
        const merchantId = item.product.merchantId
        const merchant = state.merchants[merchantId]
        
        if (!groups[merchantId]) {
          groups[merchantId] = {
            merchantId,
            merchantType: item.product.merchantType,
            merchantName: merchant?.name || '未知商家',
            items: [],
            selected: false,
            totalQuantity: 0,
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0
          }
        }
        
        groups[merchantId].items.push(item)
        groups[merchantId].totalQuantity += item.quantity
        groups[merchantId].totalPrice += item.product.price * item.quantity
        
        const originalPrice = item.product.originalPrice || item.product.price
        groups[merchantId].discountAmount += (originalPrice - item.product.price) * item.quantity
        
        // 更新分组选择状态
        if (item.selected) {
          groups[merchantId].selected = true
        }
      })
      
      // 计算最终价格
      Object.values(groups).forEach(group => {
        group.finalPrice = group.totalPrice
      })
      
      return Object.values(groups)
    },

    /**
     * 获取按商家类型分组的购物车
     */
    groupedByMerchantType: (state): Record<MerchantType, CartGroup[]> => {
      const groups: Record<string, CartGroup> = {}
      
      state.items.forEach(item => {
        const merchantId = item.product.merchantId
        const merchant = state.merchants[merchantId]
        
        if (!groups[merchantId]) {
          groups[merchantId] = {
            merchantId,
            merchantType: item.product.merchantType,
            merchantName: merchant?.name || '未知商家',
            items: [],
            selected: false,
            totalQuantity: 0,
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0
          }
        }
        
        groups[merchantId].items.push(item)
        groups[merchantId].totalQuantity += item.quantity
        groups[merchantId].totalPrice += item.product.price * item.quantity
        
        const originalPrice = item.product.originalPrice || item.product.price
        groups[merchantId].discountAmount += (originalPrice - item.product.price) * item.quantity
        
        if (item.selected) {
          groups[merchantId].selected = true
        }
      })
      
      // 计算最终价格
      Object.values(groups).forEach(group => {
        group.finalPrice = group.totalPrice
      })
      
      const result: Record<MerchantType, CartGroup[]> = {
        [MerchantType.SELF_OPERATED]: [],
        [MerchantType.THIRD_PARTY]: [],
        [MerchantType.STORE]: []
      }
      
      Object.values(groups).forEach((group: CartGroup) => {
        result[group.merchantType].push(group)
      })
      
      return result
    },

    /**
     * 获取选中的分组
     */
    selectedGroups: (state): CartGroup[] => {
      const groups: Record<string, CartGroup> = {}
      
      state.items.forEach(item => {
        const merchantId = item.product.merchantId
        const merchant = state.merchants[merchantId]
        
        if (!groups[merchantId]) {
          groups[merchantId] = {
            merchantId,
            merchantType: item.product.merchantType,
            merchantName: merchant?.name || '未知商家',
            items: [],
            selected: false,
            totalQuantity: 0,
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0
          }
        }
        
        groups[merchantId].items.push(item)
        groups[merchantId].totalQuantity += item.quantity
        groups[merchantId].totalPrice += item.product.price * item.quantity
        
        const originalPrice = item.product.originalPrice || item.product.price
        groups[merchantId].discountAmount += (originalPrice - item.product.price) * item.quantity
        
        if (item.selected) {
          groups[merchantId].selected = true
        }
      })
      
      // 计算最终价格
      Object.values(groups).forEach(group => {
        group.finalPrice = group.totalPrice
      })
      
      return Object.values(groups).filter(group => group.selected)
    },

    /**
     * 检查是否所有分组都被选中
     */
    allGroupsSelected: (state): boolean => {
      const groups: Record<string, CartGroup> = {}
      
      state.items.forEach(item => {
        const merchantId = item.product.merchantId
        const merchant = state.merchants[merchantId]
        
        if (!groups[merchantId]) {
          groups[merchantId] = {
            merchantId,
            merchantType: item.product.merchantType,
            merchantName: merchant?.name || '未知商家',
            items: [],
            selected: false,
            totalQuantity: 0,
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0
          }
        }
        
        groups[merchantId].items.push(item)
        groups[merchantId].totalQuantity += item.quantity
        groups[merchantId].totalPrice += item.product.price * item.quantity
        
        const originalPrice = item.product.originalPrice || item.product.price
        groups[merchantId].discountAmount += (originalPrice - item.product.price) * item.quantity
        
        if (item.selected) {
          groups[merchantId].selected = true
        }
      })
      
      // 计算最终价格
      Object.values(groups).forEach(group => {
        group.finalPrice = group.totalPrice
      })
      
      const groupArray = Object.values(groups)
      return groupArray.length > 0 && groupArray.every(group => group.selected)
    },

    /**
     * 获取分组统计信息
     */
    groupStats: (state): GroupStats[] => {
      const groups: Record<string, CartGroup> = {}
      
      state.items.forEach(item => {
        const merchantId = item.product.merchantId
        const merchant = state.merchants[merchantId]
        
        if (!groups[merchantId]) {
          groups[merchantId] = {
            merchantId,
            merchantType: item.product.merchantType,
            merchantName: merchant?.name || '未知商家',
            items: [],
            selected: false,
            totalQuantity: 0,
            totalPrice: 0,
            discountAmount: 0,
            finalPrice: 0
          }
        }
        
        groups[merchantId].items.push(item)
        groups[merchantId].totalQuantity += item.quantity
        groups[merchantId].totalPrice += item.product.price * item.quantity
        
        const originalPrice = item.product.originalPrice || item.product.price
        groups[merchantId].discountAmount += (originalPrice - item.product.price) * item.quantity
        
        if (item.selected) {
          groups[merchantId].selected = true
        }
      })
      
      // 计算最终价格
      Object.values(groups).forEach(group => {
        group.finalPrice = group.totalPrice
      })
      
      return Object.values(groups).map((group: CartGroup) => ({
        merchantId: group.merchantId,
        merchantType: group.merchantType,
        merchantName: group.merchantName,
        totalItems: group.items.length,
        totalQuantity: group.totalQuantity,
        selectedItems: group.items.filter((item: CartItem) => item.selected).length,
        selectedQuantity: group.items.filter((item: CartItem) => item.selected).reduce((total: number, item: CartItem) => total + item.quantity, 0),
        totalPrice: group.totalPrice,
        selectedPrice: group.items.filter((item: CartItem) => item.selected).reduce((total: number, item: CartItem) => total + (item.product.price * item.quantity), 0),
        discountAmount: group.discountAmount,
        finalPrice: group.finalPrice
      }))
    }
  },

  // ==================== Actions ====================
  actions: {
    /**
     * 添加商品到购物车
     */
    async addToCart(params: AddToCartParams): Promise<CartItem | null> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // 检查商品是否已存在
        const existingItemIndex = this.items.findIndex(item => item.productId === params.productId)
        
        if (existingItemIndex !== -1) {
          // 商品已存在，更新数量
          const existingItem = this.items[existingItemIndex]
          const newQuantity = existingItem.quantity + (params.quantity || 1)
          
          // 检查库存
          if (newQuantity > existingItem.product.stock) {
            this.error = '库存不足'
            return null
          }
          
          const updatedItem = {
            ...existingItem,
            quantity: newQuantity,
            updatedAt: new Date().toISOString()
          }
          
          this.items[existingItemIndex] = updatedItem
          this.lastUpdated = new Date().toISOString()
          return updatedItem
        } else {
          // 新商品
          const newItem: CartItem = {
            id: Date.now().toString(),
            productId: params.productId,
            product: params.product,
            quantity: params.quantity || 1,
            selected: true,
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          // 检查库存
          if (newItem.quantity > newItem.product.stock) {
            this.error = '库存不足'
            return null
          }
          
          this.items.push(newItem)
          this.lastUpdated = new Date().toISOString()
          return newItem
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '添加商品失败'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * 更新购物车商品
     */
    async updateCartItem(itemId: string, params: UpdateCartItemParams): Promise<CartItem | null> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const itemIndex = this.items.findIndex(item => item.id === itemId)
        if (itemIndex === -1) {
          this.error = '商品不存在'
          return null
        }
        
        const existingItem = this.items[itemIndex]
        
        // 检查库存
        if (params.quantity && params.quantity > existingItem.product.stock) {
          this.error = '库存不足'
          return null
        }
        
        const updatedItem = {
          ...existingItem,
          ...params,
          updatedAt: new Date().toISOString()
        }
        
        this.items[itemIndex] = updatedItem
        this.lastUpdated = new Date().toISOString()
        return updatedItem
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新商品失败'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * 删除购物车商品
     */
    async removeFromCart(itemId: string): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const itemIndex = this.items.findIndex(item => item.id === itemId)
        if (itemIndex === -1) {
          this.error = '商品不存在'
          return false
        }
        
        this.items.splice(itemIndex, 1)
        this.lastUpdated = new Date().toISOString()
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除商品失败'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * 清空购物车
     */
    async clearCart(): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        this.items = []
        this.lastUpdated = new Date().toISOString()
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '清空购物车失败'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * 选择/取消选择商品
     */
    async toggleItemSelection(itemId: string, selected?: boolean): Promise<CartItem | null> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 150))
        
        const itemIndex = this.items.findIndex(item => item.id === itemId)
        if (itemIndex === -1) {
          this.error = '商品不存在'
          return null
        }
        
        const existingItem = this.items[itemIndex]
        const newSelected = selected !== undefined ? selected : !existingItem.selected
        
        const updatedItem = {
          ...existingItem,
          selected: newSelected,
          updatedAt: new Date().toISOString()
        }
        
        this.items[itemIndex] = updatedItem
        this.lastUpdated = new Date().toISOString()
        return updatedItem
      } catch (error) {
        this.error = error instanceof Error ? error.message : '选择商品失败'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * 全选/取消全选
     */
    async toggleAllSelection(selected?: boolean): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const newSelected = selected !== undefined ? selected : !this.items.every(item => item.selected)
        
        this.items = this.items.map(item => ({
          ...item,
          selected: newSelected,
          updatedAt: new Date().toISOString()
        }))
        
        this.lastUpdated = new Date().toISOString()
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '全选操作失败'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * 增加商品数量
     */
    async increaseQuantity(itemId: string, amount: number = 1): Promise<CartItem | null> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 150))
        
        const itemIndex = this.items.findIndex(item => item.id === itemId)
        if (itemIndex === -1) {
          this.error = '商品不存在'
          return null
        }
        
        const existingItem = this.items[itemIndex]
        const newQuantity = existingItem.quantity + amount
        
        // 检查库存
        if (newQuantity > existingItem.product.stock) {
          this.error = '库存不足'
          return null
        }
        
        const updatedItem = {
          ...existingItem,
          quantity: newQuantity,
          updatedAt: new Date().toISOString()
        }
        
        this.items[itemIndex] = updatedItem
        this.lastUpdated = new Date().toISOString()
        return updatedItem
      } catch (error) {
        this.error = error instanceof Error ? error.message : '增加数量失败'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * 减少商品数量
     */
    async decreaseQuantity(itemId: string, amount: number = 1): Promise<CartItem | null> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 150))
        
        const itemIndex = this.items.findIndex(item => item.id === itemId)
        if (itemIndex === -1) {
          this.error = '商品不存在'
          return null
        }
        
        const existingItem = this.items[itemIndex]
        const newQuantity = Math.max(1, existingItem.quantity - amount)
        
        const updatedItem = {
          ...existingItem,
          quantity: newQuantity,
          updatedAt: new Date().toISOString()
        }
        
        this.items[itemIndex] = updatedItem
        this.lastUpdated = new Date().toISOString()
        return updatedItem
      } catch (error) {
        this.error = error instanceof Error ? error.message : '减少数量失败'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取购物车商品列表
     */
    async getCartItems(params?: CartQueryParams): Promise<CartItem[]> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 300))
        
        let filteredItems = this.items
        
        if (params?.selectedOnly) {
          filteredItems = filteredItems.filter(item => item.selected)
        }
        
        return filteredItems
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取购物车商品失败'
        return []
      } finally {
        this.loading = false
      }
    },

    /**
     * 清空错误信息
     */
    clearError(): void {
      this.error = null
    },

    /**
     * 重置状态
     */
    reset(): void {
      this.items = []
      this.merchants = {}
      this.loading = false
      this.error = null
      this.lastUpdated = null
    },

    /**
     * 添加商家信息
     */
    async addMerchant(merchant: Merchant): Promise<void> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        this.merchants[merchant.id] = merchant
        this.lastUpdated = new Date().toISOString()
      } catch (error) {
        this.error = error instanceof Error ? error.message : '添加商家信息失败'
      } finally {
        this.loading = false
      }
    },

    /**
     * 选择/取消选择分组
     */
    async toggleGroupSelection(params: GroupOperationParams): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const { merchantId, selected } = params
        
        // 检查分组是否存在
        const groupItems = this.items.filter(item => item.product.merchantId === merchantId)
        if (groupItems.length === 0) {
          this.error = '分组不存在'
          return false
        }
        
        const newSelected = selected !== undefined ? selected : !groupItems.every(item => item.selected)
        
        // 更新该分组下所有商品的选择状态
        this.items = this.items.map(item => {
          if (item.product.merchantId === merchantId) {
            return {
              ...item,
              selected: newSelected,
              updatedAt: new Date().toISOString()
            }
          }
          return item
        })
        
        this.lastUpdated = new Date().toISOString()
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '分组选择操作失败'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * 全选/取消全选分组
     */
    async toggleAllGroupsSelection(selected?: boolean): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // 检查是否所有分组都被选中
        const allSelected = this.items.length > 0 && this.items.every(item => item.selected)
        const newSelected = selected !== undefined ? selected : !allSelected
        
        // 更新所有商品的选择状态
        this.items = this.items.map(item => ({
          ...item,
          selected: newSelected,
          updatedAt: new Date().toISOString()
        }))
        
        this.lastUpdated = new Date().toISOString()
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '全选分组操作失败'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * 清空指定分组的购物车
     */
    async clearGroup(merchantId: string): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const originalLength = this.items.length
        this.items = this.items.filter(item => item.product.merchantId !== merchantId)
        
        if (this.items.length === originalLength) {
          this.error = '分组不存在或已为空'
          return false
        }
        
        this.lastUpdated = new Date().toISOString()
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : '清空分组失败'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取指定分组的商品列表
     */
    async getGroupItems(merchantId: string): Promise<CartItem[]> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const groupItems = this.items.filter(item => item.product.merchantId === merchantId)
        
        if (groupItems.length === 0) {
          this.error = '分组不存在或为空'
          return []
        }
        
        return groupItems
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取分组商品失败'
        return []
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取按商家类型过滤的商品列表
     */
    async getItemsByMerchantType(merchantType: MerchantType): Promise<CartItem[]> {
      this.loading = true
      this.error = null

      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 200))
        
        return this.items.filter(item => item.product.merchantType === merchantType)
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取商家类型商品失败'
        return []
      } finally {
        this.loading = false
      }
    }
  }
})