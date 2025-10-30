<template>
  <sdkwork-page-container safe-area :scrollable="false" theme-mode="auto">
    <!-- 使用智能体列表组件 -->
    <sdkwork-agent-list :api="getAgentList" :params="{ category: 'all' }" :page-size="10" :searchable="false"
      @click="handleAgentClick" @search="handleSearch" @load="handleLoad" ref="agentListRef">
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

    <van-floating-bubble v-model:offset="offset" axis="xy" magnetic="x" class="create-bubble"
      @click="handleCreateAgent">
      <van-icon name="plus" size="24" color="#fff" />
    </van-floating-bubble>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '@/stores/modules/agent'
import { useConversationStore } from '@/stores/modules/conversation'
import SdkworkAgentList from '@/components/sdkwork-agent-list/sdkwork-agent-list.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { AiAgentVO } from '@/services'

definePage({
  meta: {
    title: '智能体',
    hideBackButton: true
  }
})

const router = useRouter()
const agentStore = useAgentStore()
const conversationStore = useConversationStore()
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
const getAgentList = async (params: Pageable): Promise<Page<AiAgentVO>|any> => {
  try {
    console.error('getAgentList:', params)
    // 使用agent store获取智能体列表
    const page = await agentStore.list({}, params)

    return page
  } catch (error) {
    console.error('获取智能体列表失败:', error)
    return {
      content: [],
      empty: true,
      first: true,
      last: true,
      pageNumber: 0,
      numberOfElements: 0,
      pageSize: params.pageSize || 10,
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
const handleAgentClick = async (agent: AiAgentVO) => {
  try {
    // 使用conversation store的open方法创建会话
    const conversation = await conversationStore.open(agent.id as any)

    // 使用conversation的uuid作为会话ID
    const conversationId = conversation.uuid || conversation.id

    // 跳转到聊天页面，传递智能体参数
    router.push(`/chat/${conversationId}?agentId=${agent.id}&agentName=${encodeURIComponent(agent.name || '')}`)
  } catch (error) {
    console.error('创建会话失败:', error)
    // 如果open方法失败，使用原来的UUID生成方式作为fallback
    const conversationId = generateUUID()
    router.push(`/chat/${conversationId}?agentId=${agent.id}&agentName=${encodeURIComponent(agent.name || '')}`)
  }
}

const handleSearch = (keyword: string) => {
  console.log('搜索智能体:', keyword)
}

const handleLoad = (pageData: Page<AiAgentVO>) => {
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
  return window.$uuid()
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