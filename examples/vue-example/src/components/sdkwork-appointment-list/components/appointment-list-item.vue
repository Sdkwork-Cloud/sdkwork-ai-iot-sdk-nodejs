<template>
  <div 
    class="appointment-list-item" 
    :class="{ selected, 'has-actions': showActions }"
    @click="handleClick"
  >
    <!-- 预约头部 -->
    <div class="appointment-header">
      <slot name="header">
        <div class="header-content">
          <!-- 预约基本信息 -->
          <div class="appointment-basic-info">
            <span class="appointment-no">预约号: {{ appointment.appointmentNo }}</span>
            <span class="appointment-type">{{ getTypeText(appointment.type) }}</span>
          </div>
          
          <!-- 预约状态 -->
          <div class="appointment-status">
            <van-tag 
              :color="statusConfig[appointment.status]?.color" 
              :plain="true"
              class="status-tag"
            >
              {{ appointment.statusText || statusConfig[appointment.status]?.text }}
            </van-tag>
          </div>
        </div>
      </slot>
    </div>

    <!-- 预约内容 -->
    <div class="appointment-content">
      <slot name="content">
        <div class="content-main">
          <!-- 预约标题 -->
          <div class="appointment-title">
            <van-icon name="notes-o" class="title-icon" />
            <span class="title-text">{{ appointment.title }}</span>
          </div>
          
          <!-- 时间信息 -->
          <div class="time-info">
            <van-icon name="clock-o" class="info-icon" />
            <span class="time-text">{{ formatDateTime(appointment.dateTime) }}</span>
            <span v-if="appointment.duration" class="duration-text">
              ({{ appointment.duration }}分钟)
            </span>
          </div>
          
          <!-- 地点信息 -->
          <div v-if="appointment.location" class="location-info">
            <van-icon name="location-o" class="info-icon" />
            <span class="location-text">{{ appointment.location }}</span>
          </div>
          
          <!-- 服务人员信息 -->
          <div class="staff-info">
            <van-icon name="user-o" class="info-icon" />
            <span class="staff-name">{{ appointment.staffName }}</span>
          </div>
          
          <!-- 客户信息 -->
          <div class="customer-info">
            <van-icon name="friends-o" class="info-icon" />
            <span class="customer-name">{{ appointment.customerName }}</span>
            <span v-if="appointment.customerPhone" class="customer-phone">
              {{ appointment.customerPhone }}
            </span>
          </div>
          
          <!-- 服务项目 -->
          <div v-if="appointment.serviceItems && appointment.serviceItems.length > 0" class="service-items">
            <div class="items-preview">
              <div 
                v-for="(item, index) in appointment.serviceItems.slice(0, 3)" 
                :key="item.id" 
                class="item-preview"
              >
                <span class="item-name">{{ item.serviceName }}</span>
                <span v-if="item.duration" class="item-duration">({{ item.duration }}分钟)</span>
                <span v-if="item.fee" class="item-fee">¥{{ formatAmount(item.fee) }}</span>
              </div>
              <div v-if="appointment.serviceItems.length > 3" class="more-items">
                等{{ appointment.serviceItems.length }}项服务
              </div>
            </div>
          </div>
          
          <!-- 预约费用 -->
          <div v-if="appointment.fee" class="appointment-fee">
            <span class="fee-label">预约费用:</span>
            <span class="fee-value">
              {{ appointment.currency || '¥' }}{{ formatAmount(appointment.fee) }}
            </span>
          </div>
          
          <!-- 客户备注 -->
          <div v-if="appointment.notes" class="customer-notes">
            <van-icon name="comment-o" class="notes-icon" />
            <span class="notes-text">{{ appointment.notes }}</span>
          </div>
        </div>
      </slot>
    </div>

    <!-- 预约底部 -->
    <div class="appointment-footer">
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
import { Appointment, AppointmentActionButton, AppointmentStatusConfig, AppointmentType } from '../types'

// 组件属性定义
interface Props {
  /** 预约数据 */
  appointment: Appointment
  /** 预约索引 */
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
  actionButtons?: AppointmentActionButton[]
  /** 预约状态配置 */
  statusConfig?: AppointmentStatusConfig
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
  (e: 'select', appointment: Appointment): void
  (e: 'delete', appointment: Appointment): void
  (e: 'action', appointment: Appointment, action: string): void
  (e: 'click', appointment: Appointment): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  /** 预约头部自定义插槽 */
  header?: { appointment: Appointment; index: number }
  /** 预约内容自定义插槽 */
  content?: { appointment: Appointment; index: number }
  /** 预约底部自定义插槽 */
  footer?: { appointment: Appointment; index: number }
  /** 预约操作自定义插槽 */
  actions?: { appointment: Appointment; index: number }
}>()

// 响应式数据
const isSelected = ref(props.selected)

// 计算属性
const filteredActionButtons = computed(() => {
  return props.actionButtons.filter(button => {
    if (button.showCondition) {
      return button.showCondition(props.appointment)
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
    emit('select', props.appointment)
  }
}

const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.appointment)
  }
}

const handleAction = (action: string) => {
  emit('action', props.appointment, action)
}

const handleClick = () => {
  emit('click', props.appointment)
}

// 工具函数
const formatDateTime = (dateTime: string): string => {
  try {
    const date = new Date(dateTime)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateTime
  }
}

const formatAmount = (amount: number): string => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const getTypeText = (type: AppointmentType): string => {
  const typeMap: Record<AppointmentType, string> = {
    [AppointmentType.SERVICE]: '服务预约',
    [AppointmentType.MEDICAL]: '医疗就诊',
    [AppointmentType.BEAUTY]: '美容美发',
    [AppointmentType.EDUCATION]: '教育培训',
    [AppointmentType.BUSINESS]: '商务会议',
    [AppointmentType.OTHER]: '其他预约'
  }
  return typeMap[type] || '预约'
}
</script>

<style scoped lang="scss">
.appointment-list-item {
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

  .appointment-header {
    margin-bottom: 12px;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .appointment-basic-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .appointment-no {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }
        
        .appointment-type {
          font-size: 12px;
          color: #666;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }
      }
      
      .appointment-status {
        .status-tag {
          font-size: 12px;
          padding: 2px 8px;
        }
      }
    }
  }

  .appointment-content {
    margin-bottom: 16px;
    
    .content-main {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .appointment-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 15px;
        font-weight: 500;
        color: #333;
        
        .title-icon {
          font-size: 16px;
          color: #1890ff;
        }
      }
      
      .time-info,
      .location-info,
      .staff-info,
      .customer-info,
      .customer-notes {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #666;
        
        .info-icon,
        .notes-icon {
          font-size: 14px;
          color: #999;
        }
        
        .time-text,
        .location-text,
        .staff-name,
        .customer-name,
        .notes-text {
          flex: 1;
        }
        
        .duration-text {
          color: #999;
          font-size: 12px;
        }
        
        .customer-phone {
          margin-left: 8px;
          color: #999;
        }
      }
      
      .service-items {
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
            font-size: 13px;
            
            .item-name {
              flex: 1;
              color: #333;
              font-weight: 500;
            }
            
            .item-duration {
              color: #666;
              font-size: 12px;
            }
            
            .item-fee {
              color: #ff6b35;
              font-weight: 500;
              font-size: 12px;
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
      
      .appointment-fee {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-top: 1px solid #f0f0f0;
        
        .fee-label {
          font-size: 13px;
          color: #666;
        }
        
        .fee-value {
          font-size: 15px;
          font-weight: 600;
          color: #ff6b35;
        }
      }
      
      .customer-notes {
        background: #f8f9fa;
        padding: 8px;
        border-radius: 4px;
        margin-top: 8px;
        
        .notes-text {
          color: #666;
          font-size: 13px;
          line-height: 1.4;
        }
      }
    }
  }

  .appointment-footer {
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      
      .selection-action {
        .selection-checkbox {
          margin-right: 8px;
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 8px;
        
        .action-button {
          min-width: 80px;
        }
      }
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .appointment-list-item {
    background: #2d3748;
    color: #e2e8f0;
    
    .appointment-header {
      .header-content {
        .appointment-basic-info {
          .appointment-no {
            color: #e2e8f0;
          }
          
          .appointment-type {
            color: #cbd5e0;
            background: #4a5568;
          }
        }
      }
    }
    
    .appointment-content {
      .content-main {
        .appointment-title {
          color: #e2e8f0;
        }
        
        .time-info,
        .location-info,
        .staff-info,
        .customer-info,
        .customer-notes {
          color: #cbd5e0;
          
          .info-icon,
          .notes-icon {
            color: #a0aec0;
          }
        }
        
        .service-items {
          .items-preview {
            .item-preview {
              background: #4a5568;
              
              .item-name {
                color: #e2e8f0;
              }
              
              .item-duration {
                color: #a0aec0;
              }
            }
          }
        }
        
        .appointment-fee {
          border-top-color: #4a5568;
          
          .fee-label {
            color: #cbd5e0;
          }
        }
        
        .customer-notes {
          background: #4a5568;
          
          .notes-text {
            color: #cbd5e0;
          }
        }
      }
    }
    
    .appointment-footer {
      .footer-content {
        border-top-color: #4a5568;
      }
    }
  }
}
</style>