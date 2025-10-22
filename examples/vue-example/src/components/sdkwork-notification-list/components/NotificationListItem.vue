<template>
  <div class="notification-list-item" @click="handleClick">
    <!-- 选择框 -->
    <div v-if="selectable" class="notification-list-item__selection">
      <van-checkbox v-model="selected" @click.stop />
    </div>

    <!-- 通知图标 -->
    <div class="notification-list-item__icon">
      <div class="notification-icon" :class="`notification-icon--${notification.type}`">
        <van-icon :name="getNotificationIcon(notification.type)" />
      </div>
      <!-- 未读标识 -->
      <div v-if="notification.status === 'unread'" class="unread-indicator"></div>
    </div>

    <!-- 通知内容 -->
    <div class="notification-list-item__content">
      <div class="notification-header">
        <div class="notification-title">
          <span class="title-text">{{ notification.title }}</span>
          <!-- 优先级标识 -->
          <van-tag v-if="notification.priority === 'high'"  type="danger" class="priority-tag">
            重要
          </van-tag>
          <van-tag v-else-if="notification.priority === 'medium'"  type="warning" class="priority-tag">
            中等
          </van-tag>
        </div>
        <div class="notification-time">
          {{ formatTime(notification.timestamp) }}
        </div>
      </div>

      <div class="notification-preview">
        <div class="notification-content">
          {{ truncateContent(notification.content) }}
        </div>
      </div>

      <!-- 通知操作 -->
      <div v-if="notification.actionText" class="notification-actions">
        <van-button
          
          type="primary"
          plain
          @click.stop="handleAction"
          class="action-button"
        >
          {{ notification.actionText }}
        </van-button>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div v-if="deletable" class="notification-list-item__actions">
      <van-button
        
        type="danger"
        plain
        @click.stop="handleDelete"
        class="delete-button"
      >
        删除
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showConfirmDialog } from 'vant'
import type { Notification, NotificationType } from '../types'

interface Props {
  notification: Notification
  selectable?: boolean
  deletable?: boolean
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  isSelected: false
})

interface Emits {
  (e: 'select', notification: Notification): void
  (e: 'delete', notification: Notification): void
  (e: 'read', notification: Notification): void
  (e: 'action', notification: Notification): void
  (e: 'click', notification: Notification): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const selected = ref(props.isSelected)

// 计算属性
const selectedComputed = computed({
  get: () => selected.value,
  set: (value) => {
    selected.value = value
    emit('select', props.notification)
  }
})

// 事件处理
const handleClick = () => {
  if (props.notification.status === 'unread') {
    emit('read', props.notification)
  }
  emit('click', props.notification)
}

const handleDelete = async () => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除通知"${props.notification.title}"吗？`
    })
    emit('delete', props.notification)
  } catch (error) {
    // 用户取消删除
  }
}

const handleAction = () => {
  emit('action', props.notification)
}

// 工具函数
const getNotificationIcon = (type: NotificationType): string => {
  const icons = {
    info: 'info-o',
    success: 'success',
    warning: 'warning-o',
    error: 'cross',
    system: 'bell-o'
  }
  return icons[type] || 'info-o'
}

const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const truncateContent = (content: string, maxLength: number = 50): string => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}
</script>

<style scoped lang="scss">
.notification-list-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    background: #f0f2f5;
  }

  &__selection {
    margin-right: 12px;
    flex-shrink: 0;
    margin-top: 4px;
  }

  &__icon {
    position: relative;
    margin-right: 12px;
    flex-shrink: 0;
    
    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      
      &--info {
        background: #e6f7ff;
        color: #1890ff;
      }
      
      &--success {
        background: #f6ffed;
        color: #52c41a;
      }
      
      &--warning {
        background: #fffbe6;
        color: #faad14;
      }
      
      &--error {
        background: #fff2f0;
        color: #ff4d4f;
      }
      
      &--system {
        background: #f0f2f5;
        color: #666;
      }
    }
    
    .unread-indicator {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background: var(--van-danger-color);
      border-radius: 50%;
      border: 2px solid white;
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
    
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
      
      .notification-title {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        
        .title-text {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 8px;
        }
        
        .priority-tag {
          flex-shrink: 0;
        }
      }
      
      .notification-time {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        margin-left: 8px;
      }
    }
    
    .notification-preview {
      margin-bottom: 8px;
      
      .notification-content {
        font-size: 13px;
        color: #666;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    
    .notification-actions {
      .action-button {
        font-size: 12px;
        padding: 2px 8px;
        height: auto;
      }
    }
  }

  &__actions {
    margin-left: 12px;
    flex-shrink: 0;
    margin-top: 4px;

    .delete-button {
      font-size: 12px;
      padding: 4px 8px;
    }
  }
}
</style>