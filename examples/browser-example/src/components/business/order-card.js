/**
 * 订单卡片组件
 */

const OrderCard = {
    template: `
        <div class="order-card" :class="statusClass">
            <div class="order-header">
                <div class="order-info">
                    <span class="order-id">订单号: {{ order.orderId }}</span>
                    <span class="order-time">{{ formatTime(order.createTime) }}</span>
                </div>
                <van-tag :type="statusTagType">{{ statusText }}</van-tag>
            </div>
            
            <div class="order-content">
                <div class="product-info">
                    <van-image
                        width="60"
                        height="60"
                        :src="order.productImage"
                        fit="cover"
                        class="product-image"
                    />
                    <div class="product-details">
                        <div class="product-name">{{ order.productName }}</div>
                        <div class="product-spec">{{ order.specification }}</div>
                        <div class="product-price">¥{{ order.price }}</div>
                    </div>
                </div>
                
                <div class="order-actions" v-if="showActions">
                    <van-button 
                        size="small" 
                        type="primary" 
                        v-if="order.status === 'pending'"
                        @click="handlePay"
                    >
                        立即支付
                    </van-button>
                    <van-button 
                        size="small" 
                        plain 
                        v-if="order.status === 'pending'"
                        @click="handleCancel"
                    >
                        取消订单
                    </van-button>
                    <van-button 
                        size="small" 
                        type="success" 
                        v-if="order.status === 'shipped'"
                        @click="handleConfirm"
                    >
                        确认收货
                    </van-button>
                    <van-button 
                        size="small" 
                        plain 
                        v-if="order.status === 'completed' && order.canRefund"
                        @click="handleRefund"
                    >
                        申请退款
                    </van-button>
                </div>
            </div>
            
            <div class="order-footer">
                <div class="total-amount">
                    合计: <span class="amount">¥{{ order.totalAmount }}</span>
                </div>
                <div class="quantity">数量: {{ order.quantity }}</div>
            </div>
        </div>
    `,
    
    props: {
        order: {
            type: Object,
            required: true
        },
        showActions: {
            type: Boolean,
            default: true
        }
    },
    
    computed: {
        statusClass() {
            return `status-${this.order.status}`
        },
        
        statusText() {
            const statusMap = {
                'pending': '待支付',
                'paid': '已支付',
                'shipped': '已发货',
                'completed': '已完成',
                'cancelled': '已取消',
                'refunded': '已退款'
            }
            return statusMap[this.order.status] || this.order.status
        },
        
        statusTagType() {
            const typeMap = {
                'pending': 'warning',
                'paid': 'primary',
                'shipped': 'info',
                'completed': 'success',
                'cancelled': 'danger',
                'refunded': 'default'
            }
            return typeMap[this.order.status] || 'default'
        }
    },
    
    methods: {
        formatTime(timestamp) {
            return new Date(timestamp).toLocaleString('zh-CN')
        },
        
        handlePay() {
            this.$emit('pay', this.order)
        },
        
        handleCancel() {
            this.$emit('cancel', this.order)
        },
        
        handleConfirm() {
            this.$emit('confirm', this.order)
        },
        
        handleRefund() {
            this.$emit('refund', this.order)
        }
    }
}

// 注册全局组件
if (window.Vue) {
    window.Vue.component('order-card', OrderCard)
} else {
    window.OrderCard = OrderCard
}