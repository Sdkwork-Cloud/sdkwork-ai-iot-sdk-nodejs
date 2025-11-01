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
      :pageNumber-size="10"
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
import { useConversationStore } from '@/stores/modules/conversation'
import type { ConversationVO } from '@/services/src/service/conversation/types'
import type { ConversationPage, ConversationPageable, ConversationQueryParams } from '../components/sdkwork-conversation-list/types'
import SdkworkConversationList from '../components/sdkwork-conversation-list/sdkwork-conversation-list.vue'
import SdkworkPageContainer from '../components/sdkwork-page-container/sdkwork-page-container.vue'

definePage({
    meta: {
        title: '对话',
        hideBackButton: true
    }
})

const router = useRouter()
const conversationStore = useConversationStore()

// 组件引用
const conversationListRef = ref<InstanceType<typeof SdkworkConversationList>>()

// 查询参数
const queryParams = reactive<ConversationQueryParams>({
  status: undefined,
  keyword: '',
  agentId: '',
  pinned: undefined,
  muted: undefined
})

// API方法 - 获取会话列表（使用真实逻辑）
const getConversationList = async (params: ConversationPageable): Promise<ConversationPage|any> => {
  try {
    console.log('getConversationList:', params)
    
    // 使用conversation store的loadMoreConversations方法获取真实会话列表
    await conversationStore.loadMoreConversations(params.pageNumber || 0, params.pageSize || 10)
    
    // 返回格式化的分页数据
    return {
      content: conversationStore.sortedConversations,
      empty: conversationStore.sortedConversations.length === 0,
      first: (params.pageNumber || 0) === 0,
      last: conversationStore.sortedConversations.length < (params.pageSize || 10),
      pageNumber: params.pageNumber || 0,
      numberOfElements: conversationStore.sortedConversations.length,
      pageSize: params.pageSize || 10,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
        orders: []
      },
      totalElements: conversationStore.sortedConversations.length,
      totalPages: Math.ceil(conversationStore.sortedConversations.length / (params.pageSize || 10))
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
    return {
      content: [],
      empty: true,
      first: true,
      last: true,
      pageNumber: params.pageNumber || 0,
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
const handleSelect = async (conversation: ConversationVO) => {
  try {
    console.log('选择会话:', conversation)
    
    // 使用conversation store切换当前会话
    await conversationStore.switchConversation(conversation.id as string)
    
    // 跳转到聊天页面
    const conversationId = conversation.uuid || conversation.id
    router.push(`/chat/${conversationId}`)
  } catch (error) {
    console.error('选择会话失败:', error)
  }
}

const handleDelete = async (conversation: ConversationVO) => {
  try {
    console.log('删除会话:', conversation)
    
    // 使用conversation store删除会话
    await conversationStore.deleteConversation(conversation.id as string)
    
    // 显示删除成功提示
    console.log('会话删除成功')
  } catch (error) {
    console.error('删除会话失败:', error)
  }
}

const handleSearch = (keyword: string) => {
  console.log('搜索会话:', keyword)
  // 这里可以添加搜索会话的逻辑
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