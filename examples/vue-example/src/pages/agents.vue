<template>
  <sdkwork-page-container 
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 使用智能体列表组件 -->
    <sdkwork-agent-list
      :api="getAgentList"
      :params="{ category: 'all' }"
      :page-size="10"
      :searchable="false"
      @click="handleAgentClick"
      @search="handleSearch"
      @load="handleLoad"
      ref="agentListRef"
    >
      <!-- 空状态 -->
      <template #empty>
        <van-empty description="暂无智能体" image="search">
          <template #description>
            <div class="empty-description">
              <p>暂时没有找到智能体</p>
              <p class="empty-tip">您可以尝试调整搜索条件</p>
            </div>
          </template>
        </van-empty>
      </template>

      <!-- 加载状态 -->
      <template #loading>
        <van-loading size="24px" vertical>加载智能体数据...</van-loading>
      </template>
    </sdkwork-agent-list>

    <!-- 浮动创建按钮 -->
    <template #footer>
      <van-floating-bubble
        v-model:offset="offset"
        axis="xy"
        magnetic="x"
        class="create-bubble"
        @click="handleCreateAgent"
      >
        <van-icon name="plus" size="24" color="#fff" />
      </van-floating-bubble>
    </template>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '@/stores/modules/agent'
import SdkworkAgentList from '@/components/sdkwork-agent-list/sdkwork-agent-list.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { Agent } from '@/components/sdkwork-agent-list/types'

definePage({
    meta: {
        title: '智能体'
    }
})

const router = useRouter()
const agentStore = useAgentStore()
const agentListRef = ref<InstanceType<typeof SdkworkAgentList>>()

// 浮动气泡位置 - 右下角（动态计算）
const offset = ref({ x: 0, y: 0 })

// 计算浮动气泡位置
const calculateBubblePosition = () => {
  // 获取视口尺寸
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // 设置边距 - 紧贴右边，考虑tabbar高度
  const marginRight = 2
  const marginBottom = 80 // 避免遮盖tabbar
  const bubbleSize = 60 // 气泡尺寸
  
  // 计算右下角坐标
  offset.value = {
    x: viewportWidth - bubbleSize - marginRight,
    y: viewportHeight - bubbleSize - marginBottom
  }
}

// API方法 - 获取智能体列表
const getAgentList = async (params: Pageable): Promise<Page<Agent>> => {
  try {
    // 模拟数据 - 由于agent store不存在，使用模拟数据
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'AI助手小冰',
        description: '智能对话助手，能够回答各种问题，提供专业建议和帮助',
        avatar: 'https://via.placeholder.com/300x300/007bff/ffffff?text=AI',
        status: 'online',
        category: '对话助手',
        tags: ['智能对话', '问答', '专业建议'],
        createdTime: '2024-01-15T10:30:00Z',
        updatedTime: '2024-12-15T14:20:00Z',
        usageCount: 1250,
        rating: 4.8,
        isPublic: true,
        owner: '技术部'
      },
      {
        id: '2',
        name: '数据分析专家',
        description: '专业的数据分析智能体，支持多种数据格式处理和可视化分析',
        avatar: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Data',
        status: 'busy',
        category: '数据分析',
        tags: ['数据分析', '可视化', '报表生成'],
        createdTime: '2024-02-20T09:15:00Z',
        updatedTime: '2024-12-14T16:45:00Z',
        usageCount: 890,
        rating: 4.6,
        isPublic: true,
        owner: '数据部'
      },
      {
        id: '3',
        name: '文档助手',
        description: '专业的文档处理智能体，支持文档生成、格式转换和内容优化',
        avatar: 'https://via.placeholder.com/300x300/ffc107/ffffff?text=Doc',
        status: 'offline',
        category: '文档处理',
        tags: ['文档生成', '格式转换', '内容优化'],
        createdTime: '2024-03-10T14:20:00Z',
        updatedTime: '2024-12-13T11:30:00Z',
        usageCount: 670,
        rating: 4.4,
        isPublic: false,
        owner: '文档部'
      },
      {
        id: '4',
        name: '代码审查助手',
        description: '专业的代码审查智能体，支持多种编程语言的代码质量检查和优化建议',
        avatar: 'https://via.placeholder.com/300x300/dc3545/ffffff?text=Code',
        status: 'online',
        category: '开发工具',
        tags: ['代码审查', '质量检查', '优化建议'],
        createdTime: '2024-04-05T11:45:00Z',
        updatedTime: '2024-12-15T09:15:00Z',
        usageCount: 1120,
        rating: 4.7,
        isPublic: true,
        owner: '开发部'
      },
      {
        id: '5',
        name: '翻译助手',
        description: '多语言翻译智能体，支持多种语言间的实时翻译和语言学习辅助',
        avatar: 'https://via.placeholder.com/300x300/6f42c1/ffffff?text=Trans',
        status: 'online',
        category: '语言工具',
        tags: ['多语言翻译', '实时翻译', '语言学习'],
        createdTime: '2024-05-12T16:30:00Z',
        updatedTime: '2024-12-14T13:20:00Z',
        usageCount: 980,
        rating: 4.5,
        isPublic: true,
        owner: '国际部'
      }
    ]
    
    const { page = 0, size = 10 } = params
    const startIndex = page * size
    const endIndex = startIndex + size
    const content = mockAgents.slice(startIndex, endIndex)
    
    return {
      content,
      empty: content.length === 0,
      first: page === 0,
      last: endIndex >= mockAgents.length,
      number: page,
      numberOfElements: content.length,
      size,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
        orders: []
      },
      totalElements: mockAgents.length,
      totalPages: Math.ceil(mockAgents.length / size)
    }
  } catch (error) {
    console.error('获取智能体列表失败:', error)
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
const handleAgentClick = (agent: Agent) => {
  // 生成会话 UUID
  const conversationId = generateUUID()
  // 跳转到聊天页面，传递智能体参数
  router.push(`/chat/${conversationId}?agentId=${agent.id}&agentName=${encodeURIComponent(agent.name)}`)
}

const handleSearch = (keyword: string) => {
  console.log('搜索智能体:', keyword)
}

const handleLoad = (pageData: Page<Agent>) => {
  console.log('智能体数据加载完成:', pageData)
}

// 创建智能体
const handleCreateAgent = () => {
  router.push('/agent/create')
}

const handlePageLoad = () => {
  console.log('智能体页面加载完成')
}

// 生成 UUID 函数
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

onMounted(() => {
  // 页面加载完成
  console.log('智能体页面已加载')
  
  // 初始计算气泡位置
  calculateBubblePosition()
  
  // 监听窗口大小变化，重新计算位置
  window.addEventListener('resize', calculateBubblePosition)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', calculateBubblePosition)
})
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

// 浮动气泡样式
.create-bubble {
  :deep(.van-floating-bubble) {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 123, 255, 0.6);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '智能体'
  }
}
</route>