<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto"
    @load="handlePageLoad"
  >
    <div class="header">
      <h1>智能体创建测试页面</h1>
      <p>测试智能体创建组件的完整功能流程</p>
    </div>
    
    <div class="content">
      <!-- 智能体创建组件 -->
      <SdkworkAgentCreate 
        ref="agentCreateRef"
        @submit="handleSubmit"
      />
    </div>
    
    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <van-button type="default" @click="resetForm">重置表单</van-button>
      <van-button type="primary" @click="getFormData">获取表单数据</van-button>
    </div>
    
    <!-- 表单数据预览 -->
    <div class="data-preview" v-if="formData">
      <h3>表单数据预览</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'
import SdkworkAgentCreate from '@/components/sdkwork-agent-create/sdkwork-agent-create.vue'
import type { AgentForm } from '@/components/sdkwork-agent-create/sdkwork-agent-create.vue'

// 页面加载处理
const handlePageLoad = () => {
  console.log('页面已加载')
}

// 组件引用
const agentCreateRef = ref<InstanceType<typeof SdkworkAgentCreate>>()
const formData = ref<AgentForm | null>(null)

// 处理表单提交
const handleSubmit = (data: AgentForm) => {
  console.log('表单提交数据:', data)
  formData.value = data
  showToast('智能体创建成功！')
  
  // 这里可以添加实际提交逻辑
  // 比如调用API接口保存数据
}

// 重置表单
const resetForm = () => {
  if (agentCreateRef.value) {
    agentCreateRef.value.resetForm()
    formData.value = null
    showToast('表单已重置')
  }
}

// 获取表单数据
const getFormData = () => {
  if (agentCreateRef.value) {
    const data = agentCreateRef.value.getFormData()
    formData.value = data
    showToast('已获取表单数据')
  }
}
</script>

<style scoped>
.agent-create-test {
  min-height: 100dvh;
  background: #f5f5f5;
  padding: 16px;
}

.header {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #333;
}

.header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.content {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.action-buttons .van-button {
  flex: 1;
}

.data-preview {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-preview h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.data-preview pre {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agent-create-test {
    padding: 12px;
  }
  
  .header h1 {
    font-size: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>