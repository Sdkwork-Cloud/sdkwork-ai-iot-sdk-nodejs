<template>
  <div class="chat-item" @click="$emit('click', chat)">
    <div class="chat-avatar">
      <van-image
        :src="chat.avatar"
        width="48"
        height="48"
        radius="8"
        fit="cover"
      >
        <template v-slot:error>
          <div class="avatar-placeholder">
            <van-icon name="user-o" size="20" />
          </div>
        </template>
      </van-image>
      
      <!-- 在线状态指示器 -->
      <div v-if="chat.online" class="online-indicator"></div>
      
      <!-- 对话类型图标 -->
      <div class="chat-type-icon">
        <van-icon 
          :name="getChatTypeIcon(chat.type)" 
          :class="getChatTypeIconClass(chat.type)"
          size="12"
        />
      </div>
    </div>
    
    <div class="chat-content">
      <div class="chat-header">
        <div class="chat-title">
          {{ chat.title }}
        </div>
        <div class="chat-time">
          {{ formatTime(chat.timestamp) }}
        </div>
      </div>
      
      <div class="chat-preview">
        <div class="last-message">
          {{ chat.lastMessage }}
        </div>
        <div v-if="chat.unreadCount > 0" class="unread-badge">
          {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Chat {
  id: string
  title: string
  avatar: string
  lastMessage: string
  unreadCount: number
  timestamp: string
  type: 'user' | 'group' | 'agent' | 'device'
  online?: boolean
}

interface Props {
  chat: Chat
}

defineProps<Props>()
defineEmits<{
  click: [chat: Chat]
}>()

const getChatTypeIcon = (type: string) => {
  const icons = {
    user: 'friends-o',
    group: 'cluster-o',
    agent: 'robot-o',
    device: 'home-o'
  }
  return icons[type as keyof typeof icons] || 'chat-o'
}

const getChatTypeIconClass = (type: string) => {
  const classes = {
    user: 'icon-user',
    group: 'icon-group',
    agent: 'icon-agent',
    device: 'icon-device'
  }
  return classes[type as keyof typeof classes] || 'icon-default'
}

const formatTime = (timestamp: string) => {
  // 简化时间格式化逻辑
  if (timestamp.includes(':')) {
    return timestamp
  } 
  
  if (timestamp === '昨天') return '昨天'
  if (timestamp === '前天') return '前天'
  
  return timestamp
}
</script>

<style scoped lang="scss">
.chat-item {
  display: flex;
  align-items: center;
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
  
  .chat-avatar {
    position: relative;
    margin-right: 12px;
    
    .avatar-placeholder {
      width: 48px;
      height: 48px;
      background: #f0f2f5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }
    
    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 12px;
      height: 12px;
      background: #07c160;
      border: 2px solid white;
      border-radius: 50%;
    }
    
    .chat-type-icon {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      
      .van-icon {
        &.icon-user {
          color: var(--van-primary-color);
        }
        &.icon-group {
          color: var(--van-success-color);
        }
        &.icon-agent {
          color: var(--van-warning-color);
        }
        &.icon-device {
          color: var(--van-info-color);
        }
        &.icon-default {
          color: #999;
        }
      }
    }
  }
  
  .chat-content {
    flex: 1;
    min-width: 0;
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      
      .chat-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        line-height: 1.4;
        
        // 文本溢出处理
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .chat-time {
        font-size: 12px;
        color: #999;
        white-space: nowrap;
        margin-left: 8px;
      }
    }
    
    .chat-preview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .last-message {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
        
        // 文本溢出处理
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        margin-right: 8px;
      }
      
      .unread-badge {
        background: var(--van-danger-color);
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
</style>