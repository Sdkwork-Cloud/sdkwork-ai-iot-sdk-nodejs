<template>
  <div :class="['message-item', { 'own-message': message.isOwn }]">
    <div class="message-avatar">
      <van-image
        :src="message.avatar"
        width="36"
        height="36"
        round
        fit="cover"
      />
    </div>
    <div class="message-content">
      <div class="message-bubble">
        <div class="message-text">{{ message.content }}</div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChatMessage {
  id: string
  content: string
  avatar: string
  timestamp: Date
  isOwn: boolean
}

interface Props {
  message: ChatMessage
}

defineProps<Props>()

const formatTime = (timestamp: string | Date | number) => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : 
           typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped lang="scss">
.message-item {
  display: flex;
  margin-bottom: 16px;
  
  &.own-message {
    flex-direction: row-reverse;
    
    .message-content {
      align-items: flex-end;
    }
    
    .message-bubble {
      background: var(--van-primary-color);
      color: white;
    }
  }
  
  .message-avatar {
    margin: 0 8px;
  }
  
  .message-content {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    
    .message-bubble {
      background: white;
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      
      .message-text {
        font-size: 14px;
        line-height: 1.4;
      }
      
      .message-time {
        font-size: 10px;
        opacity: 0.6;
        margin-top: 4px;
      }
    }
  }
}
</style>