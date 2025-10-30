<template>
  <div class="sdkwork-chat-message-list" :class="themeClass">
    <!-- 消息列表容器 -->
    <div class="message-list-container" ref="containerRef" @scroll="handleScroll">
      <!-- 加载更多指示器 -->
      <div v-if="loadingMore" class="loading-more-indicator">
        <slot name="load-more" :loading="loadingMore" :has-more="hasMore">
          <div class="loading-more-default">
            <div class="spinner"></div>
            <span>加载更多消息...</span>
          </div>
        </slot>
      </div>

      <!-- 消息列表 -->
      <div v-if="messages.length > 0" class="message-list">
        <!-- 时间分隔线 -->
        <div v-for="(message, index) in messages" :key="getMessageKey(message, index)">
          <!-- 时间分隔线 -->
          <div v-if="showTimeDivider && shouldShowTimeDivider(message, index)" class="time-divider">
            <slot name="time-divider" :time="getMessageDate(message)"
              :messages="getMessagesByDate(getMessageDate(message))">
              <div class="time-divider-default">
                <span class="time-divider-text">{{ formatMessageDate(message.createdAt) }}</span>
              </div>
            </slot>
          </div>

          <!-- 使用封装好的消息项组件 -->
          <sdkwork-chat-message-item :message="message" :current-user-id="currentUserId" :receiver="receiver"
            :conversation-id="conversationId" :show-avatar="showAvatar" @message-click="handleMessageClick"
            @message-long-press="handleMessageLongPress" />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty-state">
        <slot name="empty">
          <div class="empty-state-default">
            <Icon icon="mdi:message-text-outline" width="48" height="48" class="empty-icon" />
            <div class="empty-text">暂无消息</div>
            <div class="empty-subtext">开始对话吧</div>
          </div>
        </slot>
      </div>

      <!-- 没有更多数据提示 -->
      <div v-if="!hasMore && showNoMoreData && messages.length > 0" class="no-more-data">
        <slot name="load-more" :loading="loadingMore" :has-more="hasMore">
          <div class="no-more-data-text">{{ noMoreDataText }}</div>
        </slot>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-indicator">
      <slot name="loading">
        <div class="loading-indicator">
          <div class="spinner"></div>
          <span>加载中...</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import SdkworkChatMessageItem from '../sdkwork-chat-message-item/sdkwork-chat-message-item.vue'
import type { ChatMessageVO } from '@/services'

// 导入类型定义
import type {
  ChatMessageSpecificProps,
  ChatMessageEmits,
  ChatMessageSlots,
  ChatMessageInstance
} from './types/shared'
import { CHAT_MESSAGE_DEFAULT_CONFIG } from './types/shared'

// 组件属性定义 - 参考 sdkwork-chat 的使用方式
interface Props extends ChatMessageSpecificProps {
  /** 消息列表数据 */
  messages?: ChatMessageVO[]
  /** 加载状态 */
  loading?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否显示没有更多数据提示 */
  showNoMoreData?: boolean
  /** 自定义"没有更多数据"的提示文本 */
  noMoreDataText?: string
  /** 是否还有更多数据 */
  hasMore?: boolean
  /** 滚动加载阈值（距离顶部的像素） */
  scrollLoadThreshold?: number
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  // 消息数据
  messages: () => [],
  loading: false,

  // 聊天消息特定配置
  currentUserId: undefined,
  currentUser: undefined,
  receiver: undefined,
  conversationId: undefined,
  showAvatar: CHAT_MESSAGE_DEFAULT_CONFIG.showAvatar,
  autoScrollToBottom: CHAT_MESSAGE_DEFAULT_CONFIG.autoScrollToBottom,
  scrollThreshold: CHAT_MESSAGE_DEFAULT_CONFIG.scrollThreshold,
  showTimeDivider: CHAT_MESSAGE_DEFAULT_CONFIG.showTimeDivider,
  timeDividerFormat: CHAT_MESSAGE_DEFAULT_CONFIG.timeDividerFormat,
  showMessageStatus: CHAT_MESSAGE_DEFAULT_CONFIG.showMessageStatus,
  enableLongPress: CHAT_MESSAGE_DEFAULT_CONFIG.enableLongPress,
  enableClick: CHAT_MESSAGE_DEFAULT_CONFIG.enableClick,
  customMessageRenderer: undefined,

  // 主题和显示配置
  themeMode: CHAT_MESSAGE_DEFAULT_CONFIG.themeMode,
  showNoMoreData: CHAT_MESSAGE_DEFAULT_CONFIG.showNoMoreData,
  hasMore: true,

  // 自定义文本
  noMoreDataText: '没有更多消息了',

  // 滚动加载配置
  scrollLoadThreshold: 100
})

// 事件定义
interface Emits extends ChatMessageEmits {
  /** 加载更多事件 */
  (e: 'load-more'): void
  /** 添加消息事件 */
  (e: 'add-message', message: ChatMessageVO): void
  /** 更新消息事件 */
  (e: 'update-message', payload: { messageId: string | number; updates: Partial<ChatMessageVO> }): void
  /** 删除消息事件 */
  (e: 'delete-message', messageId: string | number): void
  /** 清空消息事件 */
  (e: 'clear-messages'): void
  /** 滚动事件 */
  (e: 'scroll', event: Event): void
  /** 滚动到底部事件 */
  (e: 'scroll-to-bottom'): void
  /** 滚动到顶部事件 */
  (e: 'scroll-to-top'): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<ChatMessageSlots>()

// 组件引用
const containerRef = ref<HTMLElement>()

// 响应式数据
const messageDates = ref<Map<string, ChatMessageVO[]>>(new Map())
const lastScrollPosition = ref(0)
const isScrolling = ref(false)
const selectedMessages = ref<Set<string | number>>(new Set())

// 加载状态
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(props.hasMore)

// 监听 props.hasMore 变化
watch(() => props.hasMore, (value) => {
  hasMore.value = value
})

// 处理加载更多消息
const handleLoadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    loadingMore.value = true
    emit('load-more')

    // 模拟加载延迟，实际使用时应该等待API响应
    setTimeout(() => {
      loadingMore.value = false
    }, 1000)
  }
}

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
  return isDarkMode.value ? 'dark-mode' : 'light-mode'
})

// 检查消息是否属于当前用户
const isOwnMessage = (message: ChatMessageVO): boolean => {
  if (message.isOwn !== undefined) return message.isOwn
  return message.senderId === props.currentUserId
}

// 获取消息日期
const getMessageDate = (message: ChatMessageVO): string => {
  if (!message.createdAt) return 'unknown'

  try {
    const date = window.$date.parse(message.createdAt)
    return date.toDateString()
  } catch {
    return 'unknown'
  }
}
 
// 格式化消息日期
const formatMessageDate = (timeString?: string): string => {
  if (!timeString) return ''

  try {
    const date = window.$date.parse(timeString)
    const now = new Date()

    // 今天
    if (date.toDateString() === now.toDateString()) {
      return '今天'
    }

    // 昨天
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return '昨天'
    }

    // 一周内
    const diff = now.getTime() - date.getTime()
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      return `${days}天前`
    }

    // 更早的时间
    return date.toLocaleDateString('zh-CN')
  } catch {
    return timeString
  }
}

// 获取消息发送者头像
const getMessageAvatar = (message: ChatMessageVO): string | undefined => {
  if (isOwnMessage(message)) {
    return props.currentUser?.faceImage?.url
  }
  return props.receiver?.faceImage?.url
}

// 获取消息发送者名称
const getMessageSenderName = (message: ChatMessageVO): string => {
  if (isOwnMessage(message)) {
    return props.currentUser?.nickname || props.currentUser?.username || '我'
  }
  return props.receiver?.nickname || props.receiver?.username || '对方'
}

// 获取消息发送者首字母
const getMessageSenderInitials = (message: ChatMessageVO): string => {
  const name = getMessageSenderName(message)
  return name.charAt(0).toUpperCase()
}


// 获取消息的唯一键
const getMessageKey = (message: ChatMessageVO, index: number): string | number => {
  // 优先使用消息ID
  if (message.id) {
    return message.id
  }

  // 如果没有ID，使用索引作为后备
  return index
}

// 获取消息状态图标
const getMessageStatusIcon = (message: ChatMessageVO): string => {
  switch (message.status) {
    case 'SENT': return '✓'
    case 'DELIVERED': return '✓✓'
    case 'READ': return '✓✓✓'
    case 'FAILED': return '✗'
    case 'PROCESSING': return '⏳'
    case 'EDITED': return '✏️'
    case 'DELETED': return '🗑️'
    default: return '✓'
  }
}

// 检查是否显示时间分隔线
const shouldShowTimeDivider = (message: ChatMessageVO, index: number): boolean => {
  if (!props.showTimeDivider) return false

  const currentDate = getMessageDate(message)

  // 如果是第一条消息，显示分隔线
  if (index === 0) return true

  // 获取上一条消息
  const messages = props.messages || []
  if (index > 0) {
    const prevMessage = messages[index - 1]
    const prevDate = getMessageDate(prevMessage)
    return currentDate !== prevDate
  }

  return false
}

// 按日期获取消息
const getMessagesByDate = (date: string): ChatMessageVO[] => {
  const messages = props.messages || []
  return messages.filter((msg: any) => getMessageDate(msg) === date)
}

// 处理消息点击
const handleMessageClick = (message: ChatMessageVO) => {
  if (props.enableClick) {
    emit('message-click', message)
  }
}

// 处理消息长按
const handleMessageLongPress = (message: ChatMessageVO) => {
  if (props.enableLongPress) {
    emit('message-long-press', message)
  }
}


// 滚动到底部
const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
  if (containerRef.value) {
    containerRef.value.scrollTo({
      top: containerRef.value.scrollHeight,
      behavior: behavior
    })
  }
  emit('scroll-to-bottom')
}

// 滚动到顶部
const scrollToTop = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
  emit('scroll-to-top')
}

// 滚动到指定消息
const scrollToMessage = (messageId: string | number) => {
  // 实现滚动到指定消息的逻辑
  console.log('Scroll to message:', messageId)
}

// 添加消息
const addMessage = (message: ChatMessageVO) => {
  // 通过事件通知父组件添加消息
  emit('add-message', message)
}

// 更新消息
const updateMessage = (messageId: string | number, updates: Partial<ChatMessageVO>) => {
  // 通过事件通知父组件更新消息
  emit('update-message', { messageId, updates })
}

// 删除消息
const deleteMessage = (messageId: string | number) => {
  // 通过事件通知父组件删除消息
  emit('delete-message', messageId)
}

// 清空消息列表
const clearMessages = () => {
  // 通过事件通知父组件清空消息
  emit('clear-messages')
}

// 获取消息列表
const getMessages = (): ChatMessageVO[] => {
  return props.messages || []
}

// 获取未读消息数量
const getUnreadCount = (): number => {
  return 0;

}

// 标记消息为已读
const markAsRead = (messageId?: string | number) => {

}

// 滚动事件处理
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop

  // 当滚动到顶部附近时触发加载更多
  if (scrollTop <= props.scrollLoadThreshold && !loadingMore.value && hasMore.value) {
    handleLoadMore()
  }

  // 触发滚动事件
  emit('scroll', event)
}

// 暴露方法给父组件
defineExpose<ChatMessageInstance>({
  scrollToBottom,
  scrollToTop,
  scrollToMessage,
  addMessage,
  updateMessage,
  deleteMessage,
  clearMessages,
  getMessages,
  getUnreadCount,
  markAsRead
})

</script>

<style scoped lang="scss">
.sdkwork-chat-message-list {
  height: 100%;
  min-height: 100%;

  /* 消息列表容器样式 */
  .message-list-container {
    height: 100%;
    overflow-y: auto;
    position: relative;
    /* 优化滚动条显示 */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  }

  /* Webkit浏览器滚动条样式 */
  .message-list-container::-webkit-scrollbar {
    width: 6px;
  }

  .message-list-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .message-list-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  .message-list-container::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  /* 当内容未溢出时隐藏滚动条 */
  .message-list-container:not(:hover)::-webkit-scrollbar-thumb {
    background: transparent;
  }

  .message-list {
    padding: 8px 0;
    height: 100%;
  }

  /* 时间分隔线 */
  .time-divider {
    display: flex;
    justify-content: center;
    margin: 16px 0;

    .time-divider-default {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 12px;
      padding: 4px 12px;

      .time-divider-text {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
  }

  /* 加载更多指示器 */
  .loading-more-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .loading-more-default {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 14px;
  }

  /* 加载指示器 */
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
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  /* 空状态 */
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

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30px;
      height: 1px;
      background-color: #e0e0e0;
    }

    &::before {
      left: -30px;
    }

    &::after {
      right: -30px;
    }
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .empty-state {
      padding: 40px 16px;
    }

    .empty-icon {
      font-size: 40px;
    }
  }
}
</style>