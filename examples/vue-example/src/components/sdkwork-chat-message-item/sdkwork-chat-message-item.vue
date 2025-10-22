<template>
  <div 
    class="chat-message-item"
    :class="[message.type + '-message', { 'system-message': message.type === 'system' }]"
    :data-message-id="message.id"
  >
    <!-- 头像 -->
    <div class="message-avatar">{{ message.avatar }}</div>
    
    <!-- 消息气泡 -->
    <SdkworkChatMessageBubble
      :message="message"
      :style-options="styleOptions"
      @regenerate="$emit('regenerate', $event)"
      @download="$emit('download', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import SdkworkChatMessageBubble from '@/components/sdkwork-chat-message-bubble/sdkwork-chat-message-bubble.vue'

// Props 定义
interface Props {
  message: {
    id: string | number
    type: 'user' | 'ai' | 'system' | 'generating'
    text: string
    avatar: string
    style?: string
    music?: {
      title: string
      url: string
      style: string
    }
    status?: string
    progress?: number
    timestamp?: number
  }
  styleOptions: Array<{
    label: string
    value: string
    icon: string
  }>
}

const props = defineProps<Props>()

// Emit 事件定义
const emit = defineEmits<{
  'regenerate': [message: any]
  'download': [message: any]
}>()
</script>

<style scoped>
.chat-message-item {
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  animation: fadeInUp 0.3s ease;
  box-sizing: border-box;
}

.chat-message-item:last-child {
  margin-bottom: 0;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  flex-shrink: 0;
  margin: 0 12px;
  font-weight: 600;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.system-message .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.user-message .message-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.ai-message .message-avatar {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* 动画 */
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

/* 移动端优化 */
@media (max-width: 768px) {
  .chat-message-item {
    margin-bottom: 16px;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin: 0 8px;
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  .chat-message-item {
    animation: none;
  }
}
</style>