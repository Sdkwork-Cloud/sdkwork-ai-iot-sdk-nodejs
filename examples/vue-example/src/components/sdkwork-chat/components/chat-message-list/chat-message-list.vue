<template>
  <div class="chat-message-list">
    <!-- 加载更多指示器 -->
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <!-- 消息列表容器 -->
    <div 
      ref="messageListRef" 
      class="message-list-container"
      @scroll="handleScroll"
    >
      <!-- 没有更多数据提示 -->
      <div v-if="!props.hasMore && props.showNoMoreData && messages.length > 0" class="no-more-data">
        <div class="no-more-data-text">{{ props.noMoreDataText }}</div>
      </div>

      <!-- 消息项列表 -->
      <div 
        v-for="message in processedMessages" 
        :key="message.id"
        class="message-item-wrapper"
      >
        <chat-message-item
          :message="message"
          :current-user-id="currentUserId"
          @message-click="$emit('message-click', message)"
          @message-long-press="$emit('message-long-press', message)"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty-state">
        <Icon icon="mdi:message-text-outline" width="48" height="48" class="empty-icon" />
        <div class="empty-text">暂无消息</div>
        <div class="empty-subtext">开始对话吧</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatMessageVO } from '@/services'
import type { UserVO } from '@/services/src/service/user/types'
import { useChatStore } from '@/stores/modules/chat'
import { useAuthStore } from '@/stores/modules/auth'
import ChatMessageItem from '../chat-message-item/chat-message-item.vue'

interface Props {
  messages: ChatMessageVO[]
  currentUserId: string
  currentUser?: UserVO
  receiver?: UserVO
  hasMore?: boolean
  loading?: boolean
  /** 是否显示"没有更多数据"的提示 */
  showNoMoreData?: boolean
  /** 自定义"没有更多数据"的提示文本 */
  noMoreDataText?: string
}

const props = withDefaults(defineProps<Props>(), {
  hasMore: false,
  loading: false,
  showNoMoreData: true,
  noMoreDataText: '没有更多消息了'
})

interface Emits {
  'load-more': []
  'message-click': [message: ChatMessageVO]
  'message-long-press': [message: ChatMessageVO]
}

const emit = defineEmits<Emits>()

// 使用stores
const chatStore = useChatStore()
const authStore = useAuthStore()

// 响应式数据
const messageListRef = ref<HTMLDivElement>()
const isAtBottom = ref(true)

// 计算属性：处理消息显示
const processedMessages = computed(() => {
  return props.messages.map(message => {
    // 使用 role 字段判断是否是当前用户的消息
    const isOwn = message.role === 'USER'
    const sender = isOwn ? authStore.currentUser : props.receiver
    
    return {
      ...message,
      isOwn,
      sender: sender || {
        id: message.role === 'USER' ? props.currentUserId : 'assistant',
        nickname: isOwn ? '我' : '对方',
        avatar: ''
      }
    }
  })
})

// 监听消息列表变化，自动滚动到底部
watch(() => props.messages.length, async (newLength, oldLength = 0) => {
  if (newLength > oldLength && isAtBottom.value) {
    await nextTick()
    scrollToBottom()
  }
}, { immediate: true })

// 处理滚动事件
const handleScroll = () => {
  if (!messageListRef.value) return

  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value
  const threshold = 50

  // 检查是否在底部
  isAtBottom.value = scrollHeight - scrollTop - clientHeight <= threshold

  // 检查是否需要加载更多
  if (scrollTop <= threshold && props.hasMore && !props.loading) {
    emit('load-more')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// 暴露方法给父组件
defineExpose({
  scrollToBottom
})
</script>

<style scoped>
.chat-message-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #666;
  font-size: 14px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.message-list-container {
  flex: 1;
  overflow-y: auto; 
  scroll-behavior: smooth;
}

.message-item-wrapper {
  margin-bottom: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}

/* 没有更多数据提示 */
.no-more-data {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: #999;
  font-size: 14px;
}

.no-more-data-text {
  position: relative;
  padding: 0 20px;
}

.no-more-data-text::before,
.no-more-data-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30px;
  height: 1px;
  background-color: #e0e0e0;
}

.no-more-data-text::before {
  left: -30px;
}

.no-more-data-text::after {
  right: -30px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .message-list-container {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  
  .message-item-wrapper {
    margin-bottom: 12px;
  }
  
  .empty-state {
    padding: 40px 16px;
  }
  
  .empty-icon {
    font-size: 40px;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .loading-indicator {
    color: #aaa;
  }
  
  .spinner {
    border-color: #404040;
    border-top-color: #007bff;
  }
  
  .empty-text {
    color: #aaa;
  }
  
  .empty-subtext {
    color: #666;
  }
}

/* 滚动条样式 */
.message-list-container::-webkit-scrollbar {
  width: 4px;
}

.message-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.message-list-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.message-list-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

@media (prefers-color-scheme: dark) {
  .message-list-container::-webkit-scrollbar-thumb {
    background: #555;
  }
  
  .message-list-container::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
}
</style>