/**
 * 交易状态管理
 */

import { defineStore } from 'https://cdn.jsdelivr.net/npm/pinia@2/dist/pinia.iife.mjs'

export const tradeStore = defineStore('trade', {
    state: () => ({
        orders: [],
        currentOrder: null,
        tradeStats: {},
        loading: false,
        error: null
    }),
    
    actions: {
        /**
         * 获取订单列表
         * @param {Object} params 查询参数
         */
        async getOrders(params = {}) {
            this.loading = true
            this.error = null
            
            try {
                const orders = await window.tradeService.getOrders(params)
                this.orders = orders
                return orders
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        
        /**
         * 获取订单详情
         * @param {string} orderId 订单ID
         */
        async getOrderDetail(orderId) {
            this.loading = true
            this.error = null
            
            try {
                const order = await window.tradeService.getOrderDetail(orderId)
                this.currentOrder = order
                return order
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        
        /**
         * 创建订单
         * @param {Object} orderData 订单数据
         */
        async createOrder(orderData) {
            this.loading = true
            this.error = null
            
            try {
                const order = await window.tradeService.createOrder(orderData)
                this.orders.unshift(order)
                return order
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        
        /**
         * 取消订单
         * @param {string} orderId 订单ID
         */
        async cancelOrder(orderId) {
            this.loading = true
            this.error = null
            
            try {
                const result = await window.tradeService.cancelOrder(orderId)
                
                // 更新本地订单状态
                const orderIndex = this.orders.findIndex(order => order.orderId === orderId)
                if (orderIndex !== -1) {
                    this.orders[orderIndex].status = 'cancelled'
                }
                
                return result
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        
        /**
         * 确认收货
         * @param {string} orderId 订单ID
         */
        async confirmReceipt(orderId) {
            this.loading = true
            this.error = null
            
            try {
                const result = await window.tradeService.confirmReceipt(orderId)
                
                // 更新本地订单状态
                const orderIndex = this.orders.findIndex(order => order.orderId === orderId)
                if (orderIndex !== -1) {
                    this.orders[orderIndex].status = 'completed'
                }
                
                return result
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        
        /**
         * 获取交易统计
         */
        async getTradeStats() {
            this.loading = true
            this.error = null
            
            try {
                const stats = await window.tradeService.getTradeStats()
                this.tradeStats = stats
                return stats
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        
        /**
         * 获取交易记录
         * @param {Object} params 查询参数
         */
        async getTradeRecords(params = {}) {
            this.loading = true
            this.error = null
            
            try {
                const records = await window.tradeService.getTradeRecords(params)
                return records
            } catch (error) {
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        
        /**
         * 清除错误信息
         */
        clearError() {
            this.error = null
        }
    },
    
    getters: {
        /**
         * 获取待支付订单数量
         */
        pendingOrdersCount: (state) => {
            return state.orders.filter(order => order.status === 'pending').length
        },
        
        /**
         * 获取进行中订单数量
         */
        activeOrdersCount: (state) => {
            return state.orders.filter(order => 
                order.status === 'paid' || order.status === 'shipped'
            ).length
        },
        
        /**
         * 获取已完成订单数量
         */
        completedOrdersCount: (state) => {
            return state.orders.filter(order => order.status === 'completed').length
        }
    }
})

// 注册全局store
window.tradeStore = tradeStore