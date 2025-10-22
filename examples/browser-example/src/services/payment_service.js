/**
 * 支付服务 - 处理支付相关业务逻辑
 */

class PaymentService {
    constructor() {
        this.baseUrl = '/api/payment'
    }

    /**
     * 创建支付订单
     * @param {Object} orderData 订单数据
     * @returns {Promise<Object>} 支付信息
     */
    async createPayment(orderData) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(orderData)
            })
            
            if (!response.ok) {
                throw new Error(`支付创建失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('创建支付订单失败:', error)
            throw error
        }
    }

    /**
     * 查询支付状态
     * @param {string} paymentId 支付ID
     * @returns {Promise<Object>} 支付状态
     */
    async getPaymentStatus(paymentId) {
        try {
            const response = await fetch(`${this.baseUrl}/status/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`支付状态查询失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('查询支付状态失败:', error)
            throw error
        }
    }

    /**
     * 取消支付订单
     * @param {string} paymentId 支付ID
     * @returns {Promise<Object>} 取消结果
     */
    async cancelPayment(paymentId) {
        try {
            const response = await fetch(`${this.baseUrl}/cancel/${paymentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`支付取消失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('取消支付订单失败:', error)
            throw error
        }
    }

    /**
     * 获取支付方式列表
     * @returns {Promise<Array>} 支付方式列表
     */
    async getPaymentMethods() {
        try {
            const response = await fetch(`${this.baseUrl}/methods`, {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            
            if (!response.ok) {
                throw new Error(`获取支付方式失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('获取支付方式失败:', error)
            throw error
        }
    }

    /**
     * 申请退款
     * @param {Object} refundData 退款数据
     * @returns {Promise<Object>} 退款结果
     */
    async requestRefund(refundData) {
        try {
            const response = await fetch(`${this.baseUrl}/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(refundData)
            })
            
            if (!response.ok) {
                throw new Error(`退款申请失败: ${response.status}`)
            }
            
            return await response.json()
        } catch (error) {
            console.error('申请退款失败:', error)
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

// 创建全局支付服务实例
window.paymentService = new PaymentService()