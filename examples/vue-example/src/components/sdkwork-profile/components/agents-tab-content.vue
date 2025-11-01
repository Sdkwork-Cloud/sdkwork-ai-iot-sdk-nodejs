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
import { AiAgentVO } from '@/services'
import { useAgentStore } from '@/stores/modules/agent/agent'
 

// 组件引用
const agentListRef = ref<any>()

// agent store
const agentStore = useAgentStore()

// 请求参数
const agentParams = ref<any>({
  category: '',
  status: '',
  sort: 'updatedTime_desc',
  keyword: null
})

// API请求 - 使用agent store获取智能体列表
const agentsApi = async (params: Pageable): Promise<Page<AiAgentVO>|any> => {
  try {
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

// 处理智能体选择
const handleSelect = (agent: AiAgentVO) => {
  showToast(`选择了智能体: ${agent.name}`)
  // 这里可以执行选择后的操作，比如开始对话
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