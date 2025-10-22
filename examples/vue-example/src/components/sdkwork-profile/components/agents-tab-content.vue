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
import { showToast, showConfirmDialog } from 'vant'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 智能体接口定义
interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  category: string
  tags: string[]
  createdTime: string
  updatedTime: string
  usageCount: number
  rating: number
  isPublic: boolean
  owner: string
}

// 组件引用
const agentListRef = ref<any>()

// 请求参数
const agentParams = ref<any>({
  category: '',
  status: '',
  sort: 'updatedTime_desc',
  keyword: null
})

// 模拟API请求
const agentsApi = async (params: Pageable): Promise<Page<Agent>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { page = 0, size = 10 } = params
  const startIndex = page * size
  
  // 模拟数据
  const mockData: Agent[] = Array.from({ length: size }, (_, index) => ({
    id: `agent_${startIndex + index + 1}`,
    name: `智能体 ${startIndex + index + 1}`,
    description: `这是一个功能强大的智能体，可以帮助您解决各种问题，提供专业的AI助手服务`,
    avatar: `https://picsum.photos/80/80?random=${startIndex + index + 1}`,
    status: ['online', 'offline', 'busy'][Math.floor(Math.random() * 3)] as 'online' | 'offline' | 'busy',
    category: ['客服', '创作', '学习', '娱乐'][Math.floor(Math.random() * 4)],
    tags: ['AI助手', '智能对话', '专业服务'],
    createdTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    usageCount: Math.floor(Math.random() * 1000),
    rating: Math.floor(Math.random() * 50) / 10, // 0-5分
    isPublic: Math.random() > 0.5,
    owner: 'current_user'
  }))
  
  return {
    content: mockData,
    totalElements: 50,
    totalPages: Math.ceil(50 / size),
    size,
    number: page,
    first: page === 0,
    last: page >= Math.ceil(50 / size) - 1,
    empty: mockData.length === 0
  }
}

// 处理智能体选择
const handleSelect = (agent: Agent) => {
  showToast(`选择了智能体: ${agent.name}`)
  // 这里可以执行选择后的操作，比如开始对话
}

// 处理智能体删除
const handleDelete = async (agent: Agent) => {
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
const handleLoad = (pageData: Page<Agent>) => {
  console.log('智能体数据加载完成:', pageData)
}

// 处理智能体项点击
const handleItemClick = (agent: Agent) => {
  showToast(`查看智能体: ${agent.name}`)
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