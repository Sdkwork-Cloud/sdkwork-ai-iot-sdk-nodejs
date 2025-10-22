<template>
  <div 
    class="sdkwork-notification-item"
    :class="[
      {
        'sdkwork-notification-item--selected': isSelected,
        'sdkwork-notification-item--unread': notification.status === 'unread',
        'sdkwork-notification-item--disabled': disabled,
        'sdkwork-notification-item--border-bottom': showBorderBottom
      },
      themeClass
    ]"
    @click="handleClick"
  >
    <!-- 选择框 -->
    <div v-if="selectable" class="sdkwork-notification-item__selection">
      <van-checkbox v-model="selected" @click.stop />
    </div>

    <!-- 通知图标 -->
    <div class="sdkwork-notification-item__icon">
      <div class="notification-icon" :class="`notification-icon--${notification.type}`">
        <van-icon :name="getNotificationIcon(notification.type)" />
      </div>
      <!-- 未读标识 -->
      <div v-if="notification.status === 'unread'" class="unread-indicator"></div>
    </div>

    <!-- 通知内容 -->
    <div class="sdkwork-notification-item__content">
      <div class="notification-header">
        <div class="notification-title">
          <span class="title-text">{{ notification.title }}</span>
          <!-- 优先级标识 -->
          <van-tag v-if="notification.priority === 'high'" type="danger" class="priority-tag">
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
    <div v-if="deletable" class="sdkwork-notification-item__actions">
      <van-button
        size="small"
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
import type { Notification, NotificationType } from '../sdkwork-notification-list/types'

// Props 定义
interface Props {
  /** 通知数据 */
  notification: Notification
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否选中 */
  isSelected?: boolean
  /** 是否显示底部边框 */
  showBorderBottom?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  disabled: false,
  isSelected: false,
  showBorderBottom: true,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 选择事件 */
  select: [notification: Notification]
  /** 删除事件 */
  delete: [notification: Notification]
  /** 阅读事件 */
  read: [notification: Notification]
  /** 操作事件 */
  action: [notification: Notification]
  /** 点击事件 */
  click: [notification: Notification]
}>()

// Dark mode support
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-notification-item--dark' : 'sdkwork-notification-item--light'
})

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
  if (props.disabled) return
  
  if (props.notification.status === 'unread') {
    emit('read', props.notification)
  }
  emit('click', props.notification)
}

const handleDelete = async () => {
  if (props.disabled) return
  
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
  if (props.disabled) return
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

// 暴露方法
defineExpose({
  /** 获取通知标题 */
  getTitle: () => props.notification.title,
  /** 获取通知状态 */
  getStatus: () => props.notification.status,
  /** 是否未读 */
  isUnread: () => props.notification.status === 'unread',
  /** 格式化时间 */
  formatTime,
  /** 截断内容 */
  truncateContent
})
</script>

<style scoped lang="scss">
.sdkwork-notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  background: var(--sdkwork-notification-bg, #ffffff);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  // 底部边框
  &.sdkwork-notification-item--border-bottom {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--sdkwork-notification-border-color, #f0f0f0);
      transform: scaleY(0.5);
    }
    
    // 最后一个项不显示边框
    &:last-child::after {
      display: none;
    }
  }
  
  // 状态类
  &--selected {
    background: var(--sdkwork-notification-bg-selected, #f0f8ff);
  }
  
  &--unread {
    background: var(--sdkwork-notification-bg-unread, #f8f9fa);
  }
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  // 主题样式
  &--light {
    --sdkwork-notification-bg: #ffffff;
    --sdkwork-notification-bg-selected: #f0f8ff;
    --sdkwork-notification-bg-unread: #f8f9fa;
    --sdkwork-notification-border-color: #f0f0f0;
  }
  
  &--dark {
    --sdkwork-notification-bg: #1a1a1a;
    --sdkwork-notification-bg-selected: #2a2a2a;
    --sdkwork-notification-bg-unread: #2a2a2a;
    --sdkwork-notification-border-color: #333333;
  }
  
  &:hover:not(.sdkwork-notification-item--disabled) {
    background: var(--sdkwork-notification-bg-hover, #f8f9fa);
  }
  
  &:active:not(.sdkwork-notification-item--disabled) {
    background: var(--sdkwork-notification-bg-active, #f0f2f5);
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
        background: var(--sdkwork-notification-icon-info-bg, #e6f7ff);
        color: var(--sdkwork-notification-icon-info-color, #1890ff);
      }
      
      &--success {
        background: var(--sdkwork-notification-icon-success-bg, #f6ffed);
        color: var(--sdkwork-notification-icon-success-color, #52c41a);
      }
      
      &--warning {
        background: var(--sdkwork-notification-icon-warning-bg, #fffbe6);
        color: var(--sdkwork-notification-icon-warning-color, #faad14);
      }
      
      &--error {
        background: var(--sdkwork-notification-icon-error-bg, #fff2f0);
        color: var(--sdkwork-notification-icon-error-color, #ff4d4f);
      }
      
      &--system {
        background: var(--sdkwork-notification-icon-system-bg, #f9f0ff);
        color: var(--sdkwork-notification-icon-system-color, #722ed1);
      }
    }

    .unread-indicator {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--sdkwork-notification-unread-indicator, #ff4d4f);
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
        gap: 8px;

        .title-text {
          font-size: 14px;
          font-weight: 500;
          color: var(--sdkwork-notification-title-color, #262626);
          line-height: 1.4;
        }

        .priority-tag {
          flex-shrink: 0;
        }
      }

      .notification-time {
        font-size: 12px;
        color: var(--sdkwork-notification-time-color, #8c8c8c);
        flex-shrink: 0;
        margin-left: 8px;
      }
    }

    .notification-preview {
      .notification-content {
        font-size: 13px;
        color: var(--sdkwork-notification-content-color, #595959);
        line-height: 1.5;
        word-break: break-word;
      }
    }

    .notification-actions {
      margin-top: 8px;

      .action-button {
        font-size: 12px;
      }
    }
  }

  &__actions {
    margin-left: 12px;
    flex-shrink: 0;

    .delete-button {
      font-size: 12px;
    }
  }
}

// 主题变量定义
.sdkwork-notification-item--light {
  --sdkwork-notification-bg-hover: #f8f9fa;
  --sdkwork-notification-bg-active: #f0f2f5;
  --sdkwork-notification-title-color: #262626;
  --sdkwork-notification-time-color: #8c8c8c;
  --sdkwork-notification-content-color: #595959;
  --sdkwork-notification-unread-indicator: #ff4d4f;
  
  // 图标颜色
  --sdkwork-notification-icon-info-bg: #e6f7ff;
  --sdkwork-notification-icon-info-color: #1890ff;
  --sdkwork-notification-icon-success-bg: #f6ffed;
  --sdkwork-notification-icon-success-color: #52c41a;
  --sdkwork-notification-icon-warning-bg: #fffbe6;
  --sdkwork-notification-icon-warning-color: #faad14;
  --sdkwork-notification-icon-error-bg: #fff2f0;
  --sdkwork-notification-icon-error-color: #ff4d4f;
  --sdkwork-notification-icon-system-bg: #f9f0ff;
  --sdkwork-notification-icon-system-color: #722ed1;
}

.sdkwork-notification-item--dark {
  --sdkwork-notification-bg-hover: #2a2a2a;
  --sdkwork-notification-bg-active: #333333;
  --sdkwork-notification-title-color: #ffffff;
  --sdkwork-notification-time-color: #a6a6a6;
  --sdkwork-notification-content-color: #cccccc;
  --sdkwork-notification-unread-indicator: #ff7875;
  
  // 图标颜色
  --sdkwork-notification-icon-info-bg: #15395b;
  --sdkwork-notification-icon-info-color: #69c0ff;
  --sdkwork-notification-icon-success-bg: #162312;
  --sdkwork-notification-icon-success-color: #95de64;
  --sdkwork-notification-icon-warning-bg: #2b2111;
  --sdkwork-notification-icon-warning-color: #ffc53d;
  --sdkwork-notification-icon-error-bg: #2a1215;
  --sdkwork-notification-icon-error-color: #ff7875;
  --sdkwork-notification-icon-system-bg: #1a1325;
  --sdkwork-notification-icon-system-color: #b37feb;
}
</style>