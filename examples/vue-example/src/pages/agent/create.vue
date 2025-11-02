<template>
  <sdkwork-page-container class="agent-create-page">  
      <SdkworkAgentCreate
        @agent-created="handleAgentCreated"
        @agent-canceled="handleAgentCanceled"
        :theme-mode="themeMode"
        class="agent-create-component"
      /> 
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

// 组件导入
import SdkworkAgentCreate from '@/components/sdkwork-agent-create/sdkwork-agent-create.vue'

// 路由和国际化
const router = useRouter()
const { t } = useI18n()

// 主题模式 - 支持 light/dark/auto
const themeMode = ref<'light' | 'dark' | 'auto'>('auto')

// 深色模式检测
const isDarkMode = computed(() => {
  if (themeMode.value === 'dark') return true
  if (themeMode.value === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 处理智能体创建成功
const handleAgentCreated = (agentData: any) => {
  console.log('智能体创建成功:', agentData)
  
  // 显示成功提示
  showToast({
    message: t('agent.create.successMessage'),
    type: 'success',
    duration: 2000
  })

  // 延迟跳转到智能体列表页面
  setTimeout(() => {
    router.push('/agent/list')
  }, 2000)
}

// 处理智能体创建取消
const handleAgentCanceled = () => {
  console.log('智能体创建取消')
  
  // 显示取消提示
  showToast({
    message: t('agent.create.cancelMessage'),
    type: 'fail',
    duration: 1500
  })

  // 延迟返回上一页
  setTimeout(() => {
    router.back()
  }, 1500)
}
</script>

<style scoped lang="scss">
.agent-create-page {
  min-height: 100dvh; 
  width: 100%;
  max-width: 100%;
  padding: 0px; 
  box-sizing: border-box;
  
  // CSS 变量系统 - 支持主题切换
  --sdkwork-agent-create-page-bg: #f5f5f5;
  --sdkwork-agent-create-page-text-color: #323233;
  --sdkwork-agent-create-page-card-bg: #ffffff;
  --sdkwork-agent-create-page-card-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  // 深色主题变量
  &.dark-mode {
    --sdkwork-agent-create-page-bg: #1a1a1a;
    --sdkwork-agent-create-page-text-color: #ffffff;
    --sdkwork-agent-create-page-card-bg: #2a2a2a;
    --sdkwork-agent-create-page-card-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .page-header {
    text-align: center;
    margin-bottom: 30px;
    color: var(--sdkwork-agent-create-page-text-color);

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .page-description {
      font-size: 1.1rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }
  } 
}
 

// 响应式设计
@media (max-width: 768px) {
  .agent-create-page {
    padding: 0px;

    .page-header {
      h1 {
        font-size: 2rem;
      }

      .page-description {
        font-size: 1rem;
      }
    }
 
  }
}

@media (max-width: 480px) {
  .agent-create-page {
    padding: 0px;

    .page-header {
      h1 {
        font-size: 1.8rem;
      }
    }
  }
}
</style>