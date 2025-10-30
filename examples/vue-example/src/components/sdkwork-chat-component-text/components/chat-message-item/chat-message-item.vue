<template>
  <div 
    class="chat-message-item"
    :class="{
      'message-own': !!message.isOwn,
      'message-other': !message.isOwn,
      'message-sending': message.status === 'PROCESSING',
      'message-failed': message.status === 'FAILED',
      'message-revoked': message.status === 'DELETED'
    }"
    @click="handleClick"
    @contextmenu="handleContextMenu"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- 对方消息头像 -->
    <div v-if="!message.isOwn" class="message-avatar">
      <img 
        v-if="receiver?.faceImage?.url" 
        :src="receiver.faceImage.url" 
        :alt="receiver.nickname"
        class="avatar-image"
      />
      <div v-else class="avatar-placeholder">
        {{ receiver?.nickname?.charAt(0) || 'U' }}
      </div>
    </div>

    <!-- 消息内容区域 -->
    <div class="message-content">
      <!-- 消息气泡 -->
      <chat-message-bubble
        :message="message"
        :is-own="isOwn"
        @bubble-click="$emit('message-click', message)"
      >
        <!-- 消息内容插槽 -->
        <component
          :is="getMessageContentComponent(message.type || 'text')"
          :message="message"
        />
      </chat-message-bubble>

      <!-- 消息状态和时间 -->
      <div class="message-meta">
        <!-- 时间戳 -->
        <span v-if="showTimestamp" class="message-time">
          {{ formatTime(message.createdAt || Date.now()) }}
        </span>

        <!-- 消息状态 -->
        <div v-if="isOwn" class="message-status">
          <span v-if="message.status === 'PROCESSING'" class="status-sending">发送中</span>
          <span v-else-if="message.status === 'FAILED'" class="status-failed">发送失败</span>
          <span v-else-if="message.status === 'SENT'" class="status-sent">已发送</span>
          <span v-else-if="message.status === 'DELIVERED'" class="status-delivered">已送达</span>
          <span v-else-if="message.status === 'READ'" class="status-read">已读</span>
          <span v-else-if="message.status === 'DELETED'" class="status-revoked">已撤回</span>
        </div>
      </div>
    </div>

    <!-- 自己消息头像 -->
    <div v-if="message.isOwn" class="message-avatar">
      <img 
        v-if="currentUser?.faceImage?.url" 
        :src="currentUser.faceImage.url" 
        :alt="currentUser.nickname"
        class="avatar-image"
      />
      <div v-else class="avatar-placeholder">
        {{ currentUser?.nickname?.charAt(0) || 'U' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ChatMessageVO } from '@/services'
import type { UserVO } from '@/services/src/service/user/types'
import { useAuthStore } from '@/stores/modules/auth'
import ChatMessageBubble from './chat-message-bubble.vue'
import MessageContentText from './components/message-content-text/message-content-text.vue'
import MessageContentImage from './components/message-content-image/message-content-image.vue'
import MessageContentFile from './components/message-content-file/message-content-file.vue'
import MessageContentAudio from './components/message-content-audio/message-content-audio.vue'
import MessageContentVideo from './components/message-content-video/message-content-video.vue'

interface Props {
  message: ChatMessageVO & { isOwn?: boolean }
  currentUserId: string
  receiver?: UserVO
  conversationId?: string
}

const props = defineProps<Props>()

interface Emits {
  'message-click': [message: ChatMessageVO]
  'message-long-press': [message: ChatMessageVO]
}

const emit = defineEmits<Emits>()

// 响应式数据
const touchStartTime = ref(0)
const longPressThreshold = 500 // 长按阈值（毫秒）

// 计算属性
const showTimestamp = computed(() => {
  return true // 可根据配置动态调整
})

const authStore = useAuthStore()

const currentUser = computed<UserVO>(() => {
  return authStore.currentUser || {
    id: props.currentUserId,
    nickname: '当前用户',
    faceImage: undefined
  }
})

const isOwn = computed(() => {
  return props.message.senderId === currentUser.value?.id
})

// 获取消息内容组件
const getMessageContentComponent = (type: string) => {
  const componentMap = {
    text: MessageContentText,
    image: MessageContentImage,
    file: MessageContentFile,
    audio: MessageContentAudio,
    video: MessageContentVideo,
    voice: MessageContentAudio // 语音消息也使用音频组件
  }
  return componentMap[type as keyof typeof componentMap] || MessageContentText
}

// 格式化时间
const formatTime = (timestamp: string | number) => {
  // 使用window.$date.parse处理可能的时间字符串格式
  const date = (window as any).$date.parse(timestamp.toString())
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60 * 1000) {
    return '刚刚'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else {
    return (window as any).$date.format(date, 'YYYY-MM-DD HH:mm')
  }
}

// 处理点击事件
const handleClick = () => {
  emit('message-click', props.message)
}

// 处理右键菜单
const handleContextMenu = (event: Event) => {
  event.preventDefault()
  // 这里可以显示自定义菜单
}

// 处理触摸开始
const handleTouchStart = () => {
  touchStartTime.value = Date.now()
  // 可以在这里设置长按定时器
}

// 处理触摸结束
const handleTouchEnd = () => {
  const touchDuration = Date.now() - touchStartTime.value
  if (touchDuration >= longPressThreshold) {
    emit('message-long-press', props.message)
  }
}
</script>

<style scoped>
.chat-message-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 0 16px;
  transition: opacity 0.3s ease;
}

.message-own {
  flex-direction: row-reverse;
}

.message-other {
  flex-direction: row;
}

.message-sending {
  opacity: 0.7;
}

.message-failed {
  opacity: 0.7;
}

.message-revoked {
  opacity: 0.5;
}

.message-avatar {
  flex-shrink: 0;
  margin: 0 8px;
}

.avatar-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-own .message-content {
  align-items: flex-end;
}

.message-other .message-content {
  align-items: flex-start;
}

.message-meta {
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.message-own .message-meta {
  flex-direction: row-reverse;
}

.message-time {
  margin: 0 4px;
}

.message-status {
  display: flex;
  align-items: center;
}

.status-sending {
  color: #ffa500;
}

.status-failed {
  color: #ff4444;
}

.status-sent {
  color: #666;
}

.status-delivered {
  color: #666;
}

.status-read {
  color: #007bff;
}

.status-revoked {
  color: #999;
  font-style: italic;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-message-item {
    padding: 0 0px;
    margin-bottom: 12px;
  }
  
  .message-content {
    max-width: 75%;
  }
  
  .avatar-image,
  .avatar-placeholder {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .message-meta {
    color: #aaa;
  }
  
  .avatar-placeholder {
    background-color: #007bff;
  }
  
  .status-sending {
    color: #ffa500;
  }
  
  .status-failed {
    color: #ff6b6b;
  }
  
  .status-sent,
  .status-delivered {
    color: #aaa;
  }
  
  .status-read {
    color: #4dabf7;
  }
  
  .status-revoked {
    color: #777;
  }
}
</style>