<template>
  <div 
    class="order-list-item" 
    :class="{ selected, 'has-actions': showActions }"
    @click="handleClick"
  >
    <!-- 订单头部 -->
    <div class="order-header">
      <slot name="header">
        <div class="header-content">
          <!-- 订单基本信息 -->
          <div class="order-basic-info">
            <span class="order-no">订单号: {{ order.orderNo }}</span>
            <span class="create-time">{{ formatTime(order.createTime) }}</span>
          </div>
          
          <!-- 订单状态 -->
          <div class="order-status">
            <van-tag 
              :color="statusConfig[order.status]?.color" 
              :plain="true"
              class="status-tag"
            >
              {{ order.statusText || statusConfig[order.status]?.text }}
            </van-tag>
          </div>
        </div>
      </slot>
    </div>

    <!-- 订单内容 -->
    <div class="order-content">
      <slot name="content">
        <div class="content-main">
          <!-- 客户信息 -->
          <div class="customer-info">
            <van-icon name="user-o" class="info-icon" />
            <span class="customer-name">{{ order.customerName }}</span>
            <span v-if="order.customerPhone" class="customer-phone">{{ order.customerPhone }}</span>
          </div>
          
          <!-- 配送地址 -->
          <div v-if="order.shippingAddress" class="shipping-address">
            <van-icon name="location-o" class="info-icon" />
            <span class="address-text">{{ order.shippingAddress }}</span>
          </div>
          
          <!-- 订单商品 -->
          <div v-if="order.items && order.items.length > 0" class="order-items">
            <div class="items-preview">
              <div 
                v-for="(item, index) in order.items.slice(0, 3)" 
                :key="item.id" 
                class="item-preview"
              >
                <img v-if="item.productImage" :src="item.productImage" class="item-image" />
                <div v-else class="item-image-placeholder">
                  {{ item.productName.charAt(0) }}
                </div>
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-quantity">×{{ item.quantity }}</span>
              </div>
              <div v-if="order.items.length > 3" class="more-items">
                等{{ order.items.length }}件商品
              </div>
            </div>
          </div>
          
          <!-- 订单金额 -->
          <div class="order-amount">
            <span class="amount-label">实付金额:</span>
            <span class="amount-value">
              {{ order.currency || '¥' }}{{ formatAmount(order.totalAmount) }}
            </span>
          </div>
        </div>
      </slot>
    </div>

    <!-- 订单底部 -->
    <div class="order-footer">
      <slot name="footer">
        <div class="footer-content">
          <!-- 选择操作 -->
          <div v-if="selectable" class="selection-action">
            <van-checkbox 
              v-model="isSelected" 
              @click.stop="handleSelect"
              class="selection-checkbox"
            />
          </div>
          
          <!-- 操作按钮区域 -->
          <div v-if="showActions" class="action-buttons">
            <slot name="actions">
              <!-- 默认操作按钮 -->
              <van-button 
                v-for="button in filteredActionButtons" 
                :key="button.key"
                :type="button.type || 'default'" 
                :icon="button.icon"
                :disabled="button.disabled"
                size="small"
                @click.stop="handleAction(button.key)"
                class="action-button"
              >
                {{ button.text }}
              </van-button>
              
              <!-- 删除按钮 -->
              <van-button 
                v-if="deletable" 
                type="danger" 
                icon="delete" 
                size="small"
                @click.stop="handleDelete"
                class="action-button"
              >
                删除
              </van-button>
            </slot>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue' 
import { Order, OrderActionButton, OrderStatusConfig } from '../types'

// 组件属性定义
interface Props {
  /** 订单数据 */
  order: Order
  /** 订单索引 */
  index?: number
  /** 是否选中 */
  selected?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 自定义操作按钮 */
  actionButtons?: OrderActionButton[]
  /** 订单状态配置 */
  statusConfig?: OrderStatusConfig
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  index: 0,
  selected: false,
  selectable: false,
  deletable: false,
  showActions: true,
  actionButtons: () => [],
  statusConfig: () => ({})
})

// 事件定义
interface Emits {
  (e: 'select', order: Order): void
  (e: 'delete', order: Order): void
  (e: 'action', order: Order, action: string): void
  (e: 'click', order: Order): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  /** 订单头部自定义插槽 */
  header?: { order: Order; index: number }
  /** 订单内容自定义插槽 */
  content?: { order: Order; index: number }
  /** 订单底部自定义插槽 */
  footer?: { order: Order; index: number }
  /** 订单操作自定义插槽 */
  actions?: { order: Order; index: number }
}>()

// 响应式数据
const isSelected = ref(props.selected)

// 计算属性
const filteredActionButtons = computed(() => {
  return props.actionButtons.filter(button => {
    if (button.showCondition) {
      return button.showCondition(props.order)
    }
    return true
  })
})

// 监听选中状态变化
watch(() => props.selected, (newVal) => {
  isSelected.value = newVal
})

// 事件处理函数
const handleSelect = () => {
  if (props.selectable) {
    isSelected.value = !isSelected.value
    emit('select', props.order)
  }
}

const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.order)
  }
}

const handleAction = (action: string) => {
  emit('action', props.order, action)
}

const handleClick = () => {
  emit('click', props.order)
}

// 工具函数
const formatTime = (time: string): string => {
  try {
    const date = new Date(time)
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return time
  }
}

const formatAmount = (amount: number): string => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<style scoped lang="scss">
.order-list-item {
  background: #ffffff;
  border-radius: 8px;
  margin: 8px 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &.selected {
    background: #f0f8ff;
    border: 1px solid #1890ff;
  }
  
  &.has-actions {
    padding-bottom: 12px;
  }

  .order-header {
    margin-bottom: 12px;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .order-basic-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .order-no {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        
        .create-time {
          font-size: 12px;
          color: #999;
        }
      }
      
      .order-status {
        .status-tag {
          font-size: 12px;
          padding: 2px 8px;
        }
      }
    }
  }

  .order-content {
    margin-bottom: 16px;
    
    .content-main {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .customer-info,
      .shipping-address {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #666;
        
        .info-icon {
          font-size: 14px;
          color: #999;
        }
        
        .customer-name {
          font-weight: 500;
        }
        
        .customer-phone {
          margin-left: 8px;
          color: #999;
        }
        
        .address-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      
      .order-items {
        .items-preview {
          display: flex;
          flex-direction: column;
          gap: 6px;
          
          .item-preview {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px;
            background: #f8f9fa;
            border-radius: 4px;
            
            .item-image {
              width: 32px;
              height: 32px;
              border-radius: 4px;
              object-fit: cover;
            }
            
            .item-image-placeholder {
              width: 32px;
              height: 32px;
              border-radius: 4px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
            }
            
            .item-name {
              flex: 1;
              font-size: 13px;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .item-quantity {
              font-size: 12px;
              color: #999;
            }
          }
          
          .more-items {
            font-size: 12px;
            color: #999;
            text-align: center;
            padding: 4px;
          }
        }
      }
      
      .order-amount {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        
        .amount-label {
          font-size: 13px;
          color: #666;
        }
        
        .amount-value {
          font-size: 18px;
          font-weight: bold;
          color: #ff6b6b;
        }
      }
    }
  }

  .order-footer {
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .selection-action {
        .selection-checkbox {
          :deep(.van-checkbox__icon) {
            font-size: 18px;
          }
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 8px;
        
        .action-button {
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .order-list-item {
    margin: 6px 8px;
    padding: 12px;
    
    .order-header .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      
      .order-status {
        align-self: flex-end;
      }
    }
    
    .order-content .content-main .order-amount {
      justify-content: space-between;
    }
    
    .order-footer .footer-content {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
      
      .action-buttons {
        justify-content: flex-end;
        
        .van-button {
          flex: 1;
          max-width: 100px;
        }
      }
    }
  }
}

// 动画效果
.order-list-item {
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>