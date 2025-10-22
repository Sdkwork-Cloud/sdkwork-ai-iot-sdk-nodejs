/**
 * 交易服务 - 处理交易相关业务逻辑
 */

class TradeService {
    constructor() {
        this.baseUrl = '/api/trade'
    }

    /**
     * 获取订单列表
     * @param {Object} params 查询参数
     * @returns {Promise<Array>} 订单列表
     */
    async getOrders(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString()
            const response = await fetch(`${this.baseUrl}/orders?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`获取订单列表失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('获取订单列表失败:', error)
            throw error
        }
    }

    /**
     * 获取订单详情
     * @param {string} orderId 订单ID
     * @returns {Promise<Object>} 订单详情
     */
    async getOrderDetail(orderId) {
        try {
            const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`获取订单详情失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('获取订单详情失败:', error)
            throw error
        }
    }

    /**
     * 创建交易订单
     * @param {Object} orderData 订单数据
     * @returns {Promise<Object>} 创建的订单
     */
    async createOrder(orderData) {
        try {
            const response = await fetch(`${this.baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(orderData)
            })
            
            if (!response.ok) {
                throw new Error(`创建订单失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('创建订单失败:', error)
            throw error
        }
    }

    /**
     * 取消订单
     * @param {string} orderId 订单ID
     * @returns {Promise<Object>} 取消结果
     */
    async cancelOrder(orderId) {
        try {
            const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`取消订单失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('取消订单失败:', error)
            throw error
        }
    }

    /**
     * 确认收货
     * @param {string} orderId 订单ID
     * @returns {Promise<Object>} 确认结果
     */
    async confirmReceipt(orderId) {
        try {
            const response = await fetch(`${this.baseUrl}/orders/${orderId}/confirm`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`确认收货失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('确认收货失败:', error)
            throw error
        }
    }

    /**
     * 获取交易统计
     * @returns {Promise<Object>} 交易统计数据
     */
    async getTradeStats() {
        try {
            const response = await fetch(`${this.baseUrl}/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`获取交易统计失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('获取交易统计失败:', error)
            throw error
        }
    }

    /**
     * 获取交易记录
     * @param {Object} params 查询参数
     * @returns {Promise<Array>} 交易记录列表
     */
    async getTradeRecords(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString()
            const response = await fetch(`${this.baseUrl}/records?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`获取交易记录失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('获取交易记录失败:', error)
            throw error
        }
    }

    /**
     * 获取支付令牌
     * @returns {string} 认证令牌
     */
    getToken() {
        const authData = localStorage.getItem('auth_data')
        if (authData) {
            const auth = JSON.parse(authData)
            return auth.token
        }
        return ''
    }
}

// 创建全局交易服务实例
window.tradeService = new TradeService()