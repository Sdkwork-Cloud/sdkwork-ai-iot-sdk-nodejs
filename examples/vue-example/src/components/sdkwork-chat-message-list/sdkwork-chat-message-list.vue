<template>
  <div class="chat-message-list" ref="messageListRef" :style="{ height: computedContainerHeight }">
    <!-- 使用 sdkwork-api-list 组件 -->
    <SdkworkApiList :api="mockApi" :params="apiParams" :searchable="false" :selectable="false" :deletable="false"
      :page-size="pageSize" :item-key="'id'" :theme-mode="'auto'" :show-border-bottom="false" @load="handleApiLoad" 
      ref="apiListRef">
      <!-- 默认插槽 - 自定义列表项内容 -->
      <template #default="{ item, index, selected }">
        <SdkworkChatMessageItem :message="item" :style-options="styleOptions"
          @regenerate="$emit('regenerate', $event)" @download="$emit('download', $event)" />
      </template>

      <!-- 空状态插槽 -->
      <template #empty>
        <div class="empty-state">
          <div class="empty-icon">💬</div>
          <div class="empty-text">暂无消息</div>
        </div>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>
      </template>

      <!-- 底部插槽 - 用于放置输入框 -->
      <template #footer>
        <slot name="footer" />
      </template>
    </SdkworkApiList>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, type PropType, onMounted, onUnmounted } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import SdkworkApiList from '@/components/sdkwork-api-list/sdkwork-api-list.vue'
import SdkworkChatMessageItem from '@/components/sdkwork-chat-message-item/sdkwork-chat-message-item.vue'

// 消息类型定义
interface Message {
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

interface StyleOption {
  label: string
  value: string
  icon: string
}

// Props 定义
const props = defineProps({
  // 消息列表
  messages: {
    type: Array as PropType<Message[]>,
    default: () => []
  },

  // 风格选项配置
  styleOptions: {
    type: Array as PropType<StyleOption[]>,
    default: () => [
      { label: '流行', value: 'pop', icon: '🎤' },
      { label: '摇滚', value: 'rock', icon: '🎸' },
      { label: '电子', value: 'electronic', icon: '🎧' },
      { label: '古典', value: 'classical', icon: '🎻' },
      { label: '爵士', value: 'jazz', icon: '🎷' },
      { label: '民谣', value: 'folk', icon: '🎶' },
      { label: '嘻哈', value: 'hiphop', icon: '🎤' },
      { label: '氛围', value: 'ambient', icon: '🌌' },
      { label: '电影配乐', value: 'cinematic', icon: '🎬' },
      { label: '游戏音乐', value: 'game', icon: '🎮' }
    ]
  },

  // 是否自动滚动到底部
  autoScroll: {
    type: Boolean,
    default: true
  },

  // 输入框高度（由父组件传递）
  inputBoxHeight: {
    type: Number,
    default: 0
  },

  // 容器高度（默认值）
  containerHeight: {
    type: String,
    default: '100%'
  }
})

// Emit 事件定义
const emit = defineEmits<{
  'regenerate': [message: Message]
  'download': [message: Message]
}>()

// 插槽定义
defineSlots<{
  /** 底部插槽 - 用于放置输入框 */
  footer?: () => any
}>()

// 响应式数据
const messageListRef = ref<HTMLDivElement>()
const apiListRef = ref<InstanceType<typeof SdkworkApiList>>()
const keyboardHeight = ref(0)
const safeAreaBottom = ref(0)
const containerHeight = ref('100%')

// API 参数
const apiParams = ref({})
const pageSize = ref(20)

// 计算容器高度 - 优化版本
const computedContainerHeight = computed(() => {
  const viewportHeight = window.innerHeight
  const navbarHeight = 46 // 导航栏高度

  // 如果有输入框高度，减去输入框高度
  if (props.inputBoxHeight > 0) {
    // 正常情况下的高度
    const availableHeight = viewportHeight - props.inputBoxHeight - navbarHeight
    return `${Math.max(availableHeight, 200)}px` // 确保最小高度
  }

  // 默认情况：100vh减去导航栏高度
  return `calc(100dvh - ${navbarHeight}px)`
})

// 系统欢迎消息
const systemMessage = ref<Message>({
  id: 'system-welcome',
  type: 'system',
  text: '你好！我是AI音乐助手，请输入音乐描述，我将为你生成专属音乐。',
  avatar: '🤖',
  timestamp: Date.now()
})

// 模拟 API 函数
const mockApi = async (params: Pageable): Promise<Page<Message>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const { page = 0, size = pageSize.value } = params

  // 模拟数据 - 这里可以根据实际需求生成模拟消息
  const mockMessages: Message[] = props.messages.slice(page * size, (page + 1) * size)

  return {
    content: mockMessages,
    totalElements: props.messages.length,
    totalPages: Math.ceil(props.messages.length / size),
    size,
    number: page,
    first: page === 0,
    last: page >= Math.ceil(props.messages.length / size) - 1,
    empty: mockMessages.length === 0
  }
}

// API 加载完成处理
const handleApiLoad = (pageData: Page<Message>) => {
  // 可以在这里处理加载完成后的逻辑
  console.log('API 加载完成:', pageData)
}

// 计算属性
const getStyleLabel = (styleValue: string) => {
  const style = props.styleOptions.find(s => s.value === styleValue)
  return style?.label || '流行'
}

// 更新键盘状态（由父组件调用）
const updateKeyboardState = (keyboardOpen: boolean, height: number, safeArea: number) => {
  keyboardHeight.value = height
  safeAreaBottom.value = safeArea

  // 延迟滚动以确保DOM已更新
  setTimeout(() => {
    scrollToBottom()
  }, 100)
}

// 自动滚动到底部
const scrollToBottom = () => {
  if (!props.autoScroll) return

  nextTick(() => {
    if (messageListRef.value) {
      // 使用更通用的滚动方法
      const container = messageListRef.value.querySelector('.sdkwork-api-list .list-content') || messageListRef.value
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  })
}

// 监听消息列表变化
watch(() => props.messages, (newMessages, oldMessages) => {
  // 只有当有新消息时才触发滚动
  if (newMessages.length > oldMessages.length) {
    // 有新消息时刷新API列表
    apiListRef.value?.refresh()
    // 延迟滚动以确保消息已渲染
    setTimeout(() => {
      scrollToBottom()
    }, 150)
  }
}, { deep: true })

// 暴露方法给父组件
const scrollToMessage = (messageId: string | number) => {
  nextTick(() => {
    const messageElement = messageListRef.value?.querySelector(`[data-message-id="${messageId}"]`)
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

// 键盘打开时调整消息列表
const adjustMessageListForKeyboard = () => {
  nextTick(() => {
    if (messageListRef.value) {
      const container = messageListRef.value.querySelector('.sdkwork-api-list .list-content')
      if (container) {
        // 滚动到键盘上方位置
        container.scrollTop = container.scrollHeight - keyboardHeight.value
      }
    }
  })
}

// 计算安全区域底部距离
const calculateSafeAreaBottom = () => {
  if (typeof window !== 'undefined') {
    const style = getComputedStyle(document.documentElement)
    const safeAreaBottomValue = style.getPropertyValue('--safe-area-inset-bottom')

    if (safeAreaBottomValue) {
      safeAreaBottom.value = parseInt(safeAreaBottomValue) || 0
    } else {
      // 默认安全区域值
      safeAreaBottom.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 34 : 0
    }
  }
}

// 生命周期钩子
onMounted(() => {
  calculateSafeAreaBottom()
})

// 暴露方法
defineExpose({
  scrollToBottom,
  scrollToMessage,
  updateKeyboardState,
  keyboardHeight,
  safeAreaBottom,
  refresh: () => apiListRef.value?.refresh()
})
</script>

<style scoped>
.chat-message-list {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 确保 sdkwork-api-list 正确限制高度和滚动 */
.chat-message-list :deep(.sdkwork-api-list) {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-message-list :deep(.list-content) {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}


/* 系统消息容器 */
.system-message-container {
  padding: 16px;
  padding-bottom: 8px;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  color: #666;
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0099ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #666;
}

/* 动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .system-message-container {
    padding: 12px;
    padding-bottom: 8px;
  }

  .empty-state {
    padding: 40px 16px;
  }

  .empty-icon {
    font-size: 36px;
  }

  .empty-text {
    font-size: 14px;
  }

  .loading-state {
    padding: 30px 16px;
  }
}

/* 安全区域支持 */
@supports (padding: max(0px)) {
  .system-message-container {
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
}

/* 无障碍优化 */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
    border-top-color: #666;
  }
}
</style>