<template>
  <div class="agents-tab-content">
    <!-- 使用sdkwork-agent-list组件展示智能体 -->
    <sdkwork-agent-list
      :api="agentsApi"
      :params="agentParams"
      :selectable="false"
      :deletable="true"
      :searchable="false"
      :page-size="10"
      :agent-key="'id'"
      :agent-name-field="'name'"
      :agent-description-field="'description'"
      @select="handleSelect"
      @delete="handleDelete"
      @search="handleSearch"
      @load="handleLoad"
      @click="handleItemClick"
      ref="agentListRef"
    > 

      <!-- 空状态插槽 -->
      <template #empty>
        <div class="empty-state">
          <van-empty description="暂无智能体" image="search">
            <template #description>
              <div class="empty-description">
                <p>您还没有创建任何智能体</p>
                <p class="empty-tip">创建您的第一个智能体来开始对话吧！</p>
              </div>
            </template>
            <van-button type="primary" size="small" @click="handleCreateAgent">
              创建智能体
            </van-button>
          </van-empty>
        </div>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <div class="loading-state">
          <van-loading size="24px" vertical>加载智能体中...</van-loading>
        </div>
      </template>
    </sdkwork-agent-list>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript'
import type { QueryListParam } from 'sdkwork-sdk-api-typescript'
import { AgentService, AiAgentVO } from '@/services'
import { useConversationStore } from '@/stores/modules/conversation/conversation'

// 组件引用
const agentListRef = ref<any>()

// 获取路由和store实例
const router = useRouter()
const conversationStore = useConversationStore()

// 创建AgentService实例
const agentService = new AgentService()

// 请求参数
const agentParams = ref<QueryListParam|any>({
  categoryId: null,
  status: null,
  sort: 'updatedTime_desc',
  keyword: null
})

// 真实API请求 - 使用AgentService的listByPage方法
const agentsApi = async (params: Pageable): Promise<Page<any>|any> => {
  try {
    const response = await agentService.listByPage(agentParams.value, params)
    return response
  } catch (error) {
    console.error('获取智能体列表失败:', error)
    showToast('获取智能体列表失败')
    
    // 返回空数据避免页面崩溃
    return {
      content: [],
      total: 0,  
      pageNumber: params.pageNumber || 0,
      first: true,
      last: true,
      empty: true
    }
  }
}

// 处理智能体选择
const handleSelect = (agent: AiAgentVO) => {
  handleAgentClick(agent)
}

// 处理智能体点击（开始对话）
const handleAgentClick = async (agent: AiAgentVO) => {
  try {
    // 使用conversation store的open方法创建会话
    const conversation = await conversationStore.open(agent.id as string)

    // 使用conversation的uuid作为会话ID
    const conversationId = conversation.uuid || conversation.id

    // 跳转到聊天页面，传递智能体参数
    router.push(`/chat/${conversationId}?agentId=${agent.id}&agentName=${encodeURIComponent(agent.name || '')}`)
  } catch (error) {
    console.error('创建会话失败:', error)
    showToast('创建会话失败，请重试')
    
    // 如果open方法失败，使用简单的ID作为fallback
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    router.push(`/chat/${conversationId}?agentId=${agent.id}&agentName=${encodeURIComponent(agent.name || '')}`)
  }
}

// 处理智能体删除
const handleDelete = async (agent: AiAgentVO) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除智能体"${agent.name}"吗？此操作不可恢复。`
    })
    
    // 模拟删除操作
    showToast(`智能体"${agent.name}"已删除`)
    
    // 刷新列表
    agentListRef.value?.refresh()
  } catch (error) {
    // 用户取消删除
    console.log('取消删除智能体')
  }
}

// 处理搜索
const handleSearch = (keyword: string) => {
  agentParams.value = {
    ...agentParams.value,
    keyword
  }
  showToast(`搜索智能体: ${keyword}`)
}

// 处理数据加载
const handleLoad = (pageData: Page<AiAgentVO>) => {
  console.log('智能体数据加载完成:', pageData)
}

// 处理智能体项点击
const handleItemClick = (agent: AiAgentVO) => { 
  // 这里可以跳转到智能体详情页面或开始对话
}

// 处理创建智能体
const handleCreateAgent = () => {
  showToast('开始创建智能体')
  // 这里可以跳转到智能体创建页面
}

// 刷新数据方法
const refreshData = () => {
  agentListRef.value?.refresh()
}

// 组件挂载时加载数据
onMounted(() => {
  console.log('智能体Tab内容组件已加载')
})

// 暴露方法给父组件
defineExpose({
  refreshData
})
</script>

<style scoped lang="scss">
.agents-tab-content {
  min-height: 400px;
}

.agents-header {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  
  .create-button {
    width: 100%;
  }
}

.empty-state {
  padding: 40px 0;
  
  .empty-description {
    text-align: center;
    
    p {
      margin: 4px 0;
    }
    
    .empty-tip {
      font-size: 12px;
      color: #999;
    }
  }
}

.loading-state {
  padding: 40px 0;
  text-align: center;
}

// 响应式设计
@media (max-width: 768px) {
  .agents-header {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .agents-header {
    padding: 8px 12px;
  }
}
</style>