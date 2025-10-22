<template>
  <div class="chat-message-list">
    <van-pull-refresh 
      v-model="refreshing" 
      @refresh="onRefresh"
      :head-height="80"
      success-text="刷新成功"
    >
      <div class="messages-container" ref="messagesContainer">
        <div class="messages-content">
          <ChatMessageItem
            v-for="message in messages"
            :key="message.id"
            :message="message"
            @click="handleMessageClick"
            @long-press="handleLongPress"
          />
        </div>
        
        <!-- 加载更多指示器 -->
        <div v-if="loadingMore" class="loading-more">
          <van-loading size="24px" color="#1989fa">加载中...</van-loading>
        </div>
        
        <!-- 滚动到底部按钮 -->
        <button 
          v-if="showScrollToBottom" 
          class="scroll-to-bottom-btn"
          @click="scrollToBottom"
        >
          <svg viewBox="0 0 24 24" fill="white">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
      </div>
    </van-pull-refresh>
    
    <!-- 消息操作菜单 -->
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actionSheetActions"
      @select="handleActionSelect"
      cancel-text="取消"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import ChatMessageItem from '../chat-message-item/chat-message-item.vue'

export interface ChatMessage {
  id: string
  type: 'text' | 'image' | 'voice' | 'video' | 'file'
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: number
  status?: 'sending' | 'sent' | 'failed'
  isOwn?: boolean
}

interface Props {
  messages?: ChatMessage[]
  loading?: boolean
  hasMore?: boolean
}

interface Emits {
  (e: 'refresh'): void
  (e: 'message-click', message: ChatMessage): void
  (e: 'load-more'): void
  (e: 'delete-message', message: ChatMessage): void
  (e: 'resend-message', message: ChatMessage): void
  (e: 'copy-message', message: ChatMessage): void
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  loading: false,
  hasMore: false
})

const emit = defineEmits<Emits>()

const refreshing = ref(false)
const loadingMore = ref(false)
const showScrollToBottom = ref(false)
const showActionSheet = ref(false)
const selectedMessage = ref<ChatMessage | null>(null)
const messagesContainer = ref<HTMLDivElement | null>(null)
const lastScrollTop = ref(0)

// 计算属性
const actionSheetActions = computed(() => [
  { name: '复制', value: 'copy' },
  { name: '删除', value: 'delete', color: '#ee0a24' },
  { name: '重新发送', value: 'resend' }
])

// 监听滚动事件
const handleScroll = () => {
  if (!messagesContainer.value) return
  
  const container = messagesContainer.value
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  // 显示/隐藏滚动到底部按钮
  showScrollToBottom.value = scrollHeight - scrollTop - clientHeight > 100
  
  // 加载更多
  if (scrollTop < 100 && props.hasMore && !loadingMore.value) {
    loadMore()
  }
  
  lastScrollTop.value = scrollTop
}

// 加载更多消息
const loadMore = async () => {
  loadingMore.value = true
  emit('load-more')
  
  // 模拟加载延迟
  setTimeout(() => {
    loadingMore.value = false
  }, 1000)
}

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    showScrollToBottom.value = false
  }
}

// 长按消息处理
const handleLongPress = (message: ChatMessage) => {
  selectedMessage.value = message
  showActionSheet.value = true
}

// 操作选择处理
const handleActionSelect = (action: any) => {
  if (!selectedMessage.value) return
  
  switch (action.value) {
    case 'copy':
      emit('copy-message', selectedMessage.value)
      showToast('已复制')
      break
    case 'delete':
      showConfirmDialog({
        title: '删除消息',
        message: '确定要删除这条消息吗？',
      }).then(() => {
        emit('delete-message', selectedMessage.value!)
        showToast('已删除')
      })
      break
    case 'resend':
      emit('resend-message', selectedMessage.value)
      showToast('重新发送中')
      break
  }
  
  selectedMessage.value = null
}

const onRefresh = () => {
  refreshing.value = true
  emit('refresh')
  
  // 模拟刷新完成
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleMessageClick = (message: ChatMessage) => {
  emit('message-click', message)
}

// 自动滚动到底部
const autoScrollToBottom = () => {
  nextTick(() => {
    scrollToBottom()
  })
}

// 监听消息变化，自动滚动
watch(() => props.messages.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    const lastMessage = props.messages[props.messages.length - 1]
    if (lastMessage?.isOwn) {
      autoScrollToBottom()
    }
  }
})

// 初始化滚动监听
onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll)
    autoScrollToBottom()
  }
})

onUnmounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped lang="scss">
.chat-message-list {
  height: 100%;
  overflow: hidden;
  position: relative;
  
  .messages-container {
    height: 100%;
    overflow-y: auto;
    padding: 16px;
    scroll-behavior: smooth;
    
    .messages-content {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    
    .loading-more {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      color: #999;
    }
    
    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      transition: background 0.2s ease;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  }
  
  .scroll-to-bottom-btn {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: #07c160;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
    transition: all 0.3s ease;
    z-index: 100;
    
    &:hover {
      background: #06ae56;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(7, 193, 96, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .chat-message-list {
    .messages-container {
      &::-webkit-scrollbar-track {
        background: #2d2d2d;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #555;
      }
      
      &::-webkit-scrollbar-thumb:hover {
        background: #666;
      }
    }
    
    .scroll-to-bottom-btn {
      background: #07c160;
      box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
      
      &:hover {
        background: #06ae56;
        box-shadow: 0 6px 16px rgba(7, 193, 96, 0.4);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .chat-message-list {
    .messages-container {
      padding: 12px;
      
      .loading-more {
        padding: 12px;
      }
    }
    
    .scroll-to-bottom-btn {
      right: 16px;
      bottom: 16px;
      width: 40px;
      height: 40px;
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>