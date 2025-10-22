<template>
  <sdkwork-page-container 
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 会话列表 -->
    <sdkwork-conversation-list
      :api="getConversationList"
      :params="queryParams"
      :selectable="false"
      :deletable="false"
      :searchable="false"
      :page-size="10"
      @select="handleSelect"
      @delete="handleDelete"
      @search="handleSearch"
      @load="handleLoad"
      ref="conversationListRef"
    >
      <!-- 空状态 -->
      <template #empty>
        <van-empty description="暂无聊天会话" image="search">
          <template #description>
            <div class="empty-description">
              <p>暂时没有聊天会话</p>
              <p class="empty-tip">您可以开始新的对话</p>
            </div>
          </template>
        </van-empty>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <van-loading size="24px" vertical>加载会话数据...</van-loading>
      </template>
    </sdkwork-conversation-list>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router' 
import type { Conversation, ConversationPage, ConversationPageable, ConversationQueryParams } from '../components/sdkwork-conversation-list/types'
import SdkworkConversationList from '../components/sdkwork-conversation-list/sdkwork-conversation-list.vue'
import SdkworkPageContainer from '../components/sdkwork-page-container/sdkwork-page-container.vue'

definePage({
    meta: {
        title: '对话'
    }
})

// 组件引用
const conversationListRef = ref<InstanceType<typeof SdkworkConversationList>>()

// 查询参数
const queryParams = reactive<ConversationQueryParams>({
  status: 'active',
  keyword: '',
  agentId: '',
  pinned: undefined,
  muted: undefined
})

// 模拟会话数据
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: '技术支持',
    description: '与技术支持团队的对话',
    type: 'text',
    status: 'active',
    participants: [
      {
        id: 'user-1',
        name: '用户',
        type: 'user',
        online: true
      },
      {
        id: 'agent-1',
        name: '技术支持',
        avatar: 'https://via.placeholder.com/300x300/007bff/ffffff?text=TS',
        type: 'agent',
        online: true
      }
    ],
    lastMessage: {
      id: 'msg-1',
      content: '您好，有什么可以帮助您的？',
      sender: 'agent',
      timestamp: '2024-12-15T10:30:00Z',
      type: 'text',
      read: false
    },
    unreadCount: 2,
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    agentId: 'agent-1',
    agentName: '技术支持',
    tags: ['技术支持', '帮助'],
    pinned: false,
    muted: false
  },
  {
    id: '2',
    title: '智能家居群',
    description: '智能家居设备管理群聊',
    type: 'text',
    status: 'active',
    participants: [
      {
        id: 'user-1',
        name: '用户',
        type: 'user',
        online: true
      },
      {
        id: 'agent-2',
        name: '智能家居助手',
        avatar: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Home',
        type: 'agent',
        online: true
      }
    ],
    lastMessage: {
      id: 'msg-2',
      content: '小明：客厅温度已调整到25度',
      sender: 'user',
      timestamp: '2024-12-15T09:15:00Z',
      type: 'text',
      read: true
    },
    unreadCount: 5,
    createdAt: '2024-12-14T08:00:00Z',
    updatedAt: '2024-12-15T09:15:00Z',
    agentId: 'agent-2',
    agentName: '智能家居助手',
    tags: ['家居', '设备'],
    pinned: false,
    muted: false
  },
  {
    id: '3',
    title: '智能音箱',
    description: '智能音箱设备对话',
    type: 'text',
    status: 'active',
    participants: [
      {
        id: 'user-1',
        name: '用户',
        type: 'user',
        online: false
      },
      {
        id: 'agent-3',
        name: '智能音箱',
        avatar: 'https://via.placeholder.com/300x300/ffc107/ffffff?text=Speaker',
        type: 'agent',
        online: true
      }
    ],
    lastMessage: {
      id: 'msg-3',
      content: '设备运行正常',
      sender: 'agent',
      timestamp: '2024-12-14T16:20:00Z',
      type: 'text',
      read: true
    },
    unreadCount: 0,
    createdAt: '2024-12-13T10:00:00Z',
    updatedAt: '2024-12-14T16:20:00Z',
    agentId: 'agent-3',
    agentName: '智能音箱',
    tags: ['音箱', '设备'],
    pinned: false,
    muted: false
  },
  {
    id: '4',
    title: '天气预报助手',
    description: '天气预报查询对话',
    type: 'text',
    status: 'active',
    participants: [
      {
        id: 'user-1',
        name: '用户',
        type: 'user',
        online: true
      },
      {
        id: 'agent-4',
        name: '天气预报助手',
        avatar: 'https://via.placeholder.com/300x300/17a2b8/ffffff?text=Weather',
        type: 'agent',
        online: true
      }
    ],
    lastMessage: {
      id: 'msg-4',
      content: '今天晴转多云，气温18-25度',
      sender: 'agent',
      timestamp: '2024-12-14T07:30:00Z',
      type: 'text',
      read: true
    },
    unreadCount: 0,
    createdAt: '2024-12-12T09:00:00Z',
    updatedAt: '2024-12-14T07:30:00Z',
    agentId: 'agent-4',
    agentName: '天气预报助手',
    tags: ['天气', '预报'],
    pinned: true,
    muted: false
  },
  {
    id: '5',
    title: '安防系统',
    description: '安防系统监控对话',
    type: 'text',
    status: 'active',
    participants: [
      {
        id: 'user-1',
        name: '用户',
        type: 'user',
        online: true
      },
      {
        id: 'agent-5',
        name: '安防系统',
        avatar: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Security',
        type: 'agent',
        online: true
      }
    ],
    lastMessage: {
      id: 'msg-5',
      content: '门窗关闭状态正常',
      sender: 'agent',
      timestamp: '2024-12-13T18:00:00Z',
      type: 'text',
      read: false
    },
    unreadCount: 1,
    createdAt: '2024-12-11T14:00:00Z',
    updatedAt: '2024-12-13T18:00:00Z',
    agentId: 'agent-5',
    agentName: '安防系统',
    tags: ['安防', '监控'],
    pinned: false,
    muted: true
  }
]

const router = useRouter()

// API方法 - 获取会话列表
const getConversationList = async (params: ConversationPageable): Promise<ConversationPage> => {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    const { page = 0, size = 10, filters } = params
    let filteredConversations = [...mockConversations]

    // 应用过滤器
    if (filters) {
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        filteredConversations = filteredConversations.filter(conv =>
          conv.title.toLowerCase().includes(keyword) ||
          conv.description?.toLowerCase().includes(keyword) ||
          conv.lastMessage?.content.toLowerCase().includes(keyword)
        )
      }

      if (filters.agentId) {
        filteredConversations = filteredConversations.filter(conv => conv.agentId === filters.agentId)
      }

      if (filters.pinned !== undefined) {
        filteredConversations = filteredConversations.filter(conv => conv.pinned === filters.pinned)
      }

      if (filters.muted !== undefined) {
        filteredConversations = filteredConversations.filter(conv => conv.muted === filters.muted)
      }
    }

    const startIndex = page * size
    const endIndex = startIndex + size
    const content = filteredConversations.slice(startIndex, endIndex)

    return {
      content,
      empty: content.length === 0,
      first: page === 0,
      last: endIndex >= filteredConversations.length,
      number: page,
      numberOfElements: content.length,
      size,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
        orders: []
      },
      totalElements: filteredConversations.length,
      totalPages: Math.ceil(filteredConversations.length / size)
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
    return {
      content: [],
      empty: true,
      first: true,
      last: true,
      number: 0,
      numberOfElements: 0,
      size: params.size || 10,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
        orders: []
      },
      totalElements: 0,
      totalPages: 0
    }
  }
}

// 事件处理
const handleSelect = (conversation: Conversation) => {
  router.push(`/chat/${conversation.id}`)
}

const handleDelete = async (conversation: Conversation) => {
  console.log('删除会话:', conversation.title)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: ConversationPage) => {
  console.log('会话数据加载完成:', pageData)
}

const handlePageLoad = () => {
  console.log('页面加载完成')
}
</script>

<style scoped lang="scss">
.empty-description {
  text-align: center;
  
  p {
    margin: 4px 0;
    color: #969799;
    font-size: 14px;
  }
  
  .empty-tip {
    font-size: 12px;
    color: #c8c9cc;
  }
}
 
</style>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '对话'
  }
}
</route>