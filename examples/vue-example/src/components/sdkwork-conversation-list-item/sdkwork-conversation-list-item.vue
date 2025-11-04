<template>
  <div 
    class="sdkwork-conversation-list-item"
    :class="[
      {
        'sdkwork-conversation-list-item--selected': isSelected,
        'sdkwork-conversation-list-item--pinned': conversation.pinned,
        'sdkwork-conversation-list-item--unread': (conversation.unreadCount || 0) > 0,
        'sdkwork-conversation-list-item--disabled': disabled,
        'sdkwork-conversation-list-item--border-bottom': showBorderBottom
      },
      themeClass
    ]"
    @click="handleClick"
  >
    <!-- 头像区域 -->
    <div class="sdkwork-conversation-list-item__avatar">
      <van-image
        :src="conversation.avatar"
        width="44"
        height="44"
        radius="4"
        fit="cover"
      >
        <template v-slot:error>
          <div class="avatar-placeholder">
            <van-icon name="chat-o" size="18" />
          </div>
        </template>
      </van-image>
      
      <!-- 在线状态指示器 -->
      <div 
        v-if="conversation.online" 
        class="online-indicator"
      />
    </div>

    <!-- 内容区域 -->
    <div class="sdkwork-conversation-list-item__content">
      <div class="conversation-header">
        <div class="conversation-title">
          {{ conversation.title }}
          <!-- 置顶标识 -->
          <van-icon v-if="conversation.pinned" name="pin" class="pin-icon" />
        </div>
        <div class="conversation-time">
          {{ formatTime(conversation.updatedAt || conversation.createdAt || '') }}
        </div>
      </div>

      <div class="conversation-preview">
        <div class="last-message">
          <span v-if="conversation.lastMessageId" class="message-content">
            {{ truncateMessage(conversation.lastMessageId?.toString() || '') }}
          </span>
          <span v-else class="no-message">暂无消息</span>
        </div>
        <!-- 未读消息计数 -->
        <div v-if="(conversation.unreadCount || 0) > 0" class="unread-badge">
          {{ (conversation.unreadCount || 0) > 99 ? '99+' : conversation.unreadCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Conversation } from '../sdkwork-conversation-list/types'

// Props 定义 - 参考微信聊天会话列表
interface Props {
  /** 会话数据 */
  conversation: Conversation
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
  disabled: false,
  isSelected: false,
  showBorderBottom: true,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [conversation: Conversation]
  /** 选中事件 */
  select: [conversation: Conversation]
}>()

// Dark mode support - 参考 cell 组件的实现
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
  return isDarkMode.value ? 'sdkwork-conversation-list-item--dark' : 'sdkwork-conversation-list-item--light'
})

// 事件处理
const handleClick = () => {
  if (props.disabled) return
  emit('click', props.conversation)
}

// 工具函数
const formatTime = (timeStr: string): string => {
  const date = window.$date.parse(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  }
}

const truncateMessage = (message: string): string => {
  const maxLength = 30
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
}

// 暴露方法
defineExpose({
  /** 获取会话标题 */
  getTitle: () => props.conversation.title,
  /** 获取未读消息数 */
  getUnreadCount: () => props.conversation.unreadCount || 0,
  /** 是否置顶 */
  isPinned: () => props.conversation.pinned,
  /** 格式化时间 */
  formatTime,
  /** 截断消息 */
  truncateMessage
})
</script>

<style scoped lang="scss">
.sdkwork-conversation-list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--sdkwork-conversation-bg, #ffffff);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  // 底部边框 - 参考微信聊天软件设计
  &.sdkwork-conversation-list-item--border-bottom {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0; // 从左侧开始，符合微信设计
      right: 0;
      height: 1px;
      background: var(--sdkwork-conversation-border-color, #f0f0f0);
      transform: scaleY(0.5);
    }
    
    // 最后一个项不显示边框
    &:last-child::after {
      display: none;
    }
  }
  
  // 状态类
  &--selected {
    background: var(--sdkwork-conversation-bg-selected, #f0f8ff);
  }
  
  &--pinned {
    border-left: 3px solid var(--sdkwork-conversation-pinned-color, #ff976a);
  }
  
  &--unread {
    .conversation-title {
      font-weight: 600;
      color: var(--sdkwork-conversation-text, #333333);
    }
    
    .last-message {
      color: var(--sdkwork-conversation-text, #333333);
      font-weight: 500;
    }
  }
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    
    &:hover {
      background: var(--sdkwork-conversation-bg, #ffffff);
    }
  }
  
  // 交互状态
  &:hover:not(.sdkwork-conversation-list-item--disabled) {
    background: var(--sdkwork-conversation-bg-hover, #f8f9fa);
  }
  
  &:active:not(.sdkwork-conversation-list-item--disabled) {
    background: var(--sdkwork-conversation-bg-active, #f0f2f5);
  }
  
  // 头像区域
  &__avatar {
    position: relative;
    margin-right: 12px;
    flex-shrink: 0;
    
    .avatar-placeholder {
      width: 44px;
      height: 44px;
      background: var(--sdkwork-conversation-avatar-bg, #f0f2f5);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--sdkwork-conversation-text-muted, #999999);
    }
    
    .online-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      background: #07c160;
      border: 2px solid var(--sdkwork-conversation-bg, #ffffff);
      border-radius: 50%;
    }
  }
  
  // 内容区域
  &__content {
    flex: 1;
    min-width: 0;
    
    .conversation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      
      .conversation-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--sdkwork-conversation-text, #333333);
        line-height: 1.4;
        display: flex;
        align-items: center;
        
        // 文本溢出处理
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .pin-icon {
          margin-left: 4px;
          font-size: 12px;
          color: var(--sdkwork-conversation-pinned-color, #ff976a);
          flex-shrink: 0;
        }
      }
      
      .conversation-time {
        font-size: 12px;
        color: var(--sdkwork-conversation-text-muted, #999999);
        white-space: nowrap;
        margin-left: 8px;
      }
    }
    
    .conversation-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .last-message {
        font-size: 14px;
        color: var(--sdkwork-conversation-text-secondary, #666666);
        line-height: 1.4;
        
        // 文本溢出处理
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        margin-right: 8px;

        .no-message {
          color: var(--sdkwork-conversation-text-muted, #999999);
          font-style: italic;
        }
      }
      
      .unread-badge {
        background: #ee0a24;
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 18px;
        text-align: center;
        line-height: 1;
      }
    }
  }
}

// 浅色主题
.sdkwork-conversation-list-item--light {
  --sdkwork-conversation-bg: #ffffff;
  --sdkwork-conversation-bg-hover: #f8f9fa;
  --sdkwork-conversation-bg-active: #f0f2f5;
  --sdkwork-conversation-bg-selected: #f0f8ff;
  --sdkwork-conversation-avatar-bg: #f0f2f5;
  --sdkwork-conversation-text: #333333;
  --sdkwork-conversation-text-secondary: #666666;
  --sdkwork-conversation-text-muted: #999999;
  --sdkwork-conversation-pinned-color: #ff976a;
  --sdkwork-conversation-border-color: #f0f0f0;
}

// 深色主题
.sdkwork-conversation-list-item--dark {
  --sdkwork-conversation-bg: #1a1a1a;
  --sdkwork-conversation-bg-hover: #2d2d2d;
  --sdkwork-conversation-bg-active: #3d3d3d;
  --sdkwork-conversation-bg-selected: #1a2a3a;
  --sdkwork-conversation-avatar-bg: #2d2d2d;
  --sdkwork-conversation-text: #ffffff;
  --sdkwork-conversation-text-secondary: #cccccc;
  --sdkwork-conversation-text-muted: #888888;
  --sdkwork-conversation-pinned-color: #ff976a;
  --sdkwork-conversation-border-color: #2d2d2d;
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-conversation-list-item {
    padding: 10px 12px;
    
    &__avatar {
      margin-right: 10px;
    }
    
    .conversation-header {
      .conversation-title {
        font-size: 15px;
      }
      
      .conversation-time {
        font-size: 11px;
      }
    }
    
    .conversation-preview {
      .last-message {
        font-size: 13px;
      }
    }
  }
}
</style>