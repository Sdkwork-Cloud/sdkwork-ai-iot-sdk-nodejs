<template>
  <sdkwork-page-container class="agent-profile-page">

    <!-- 智能体Profile组件 -->
    <sdkwork-agent-profile :agent="currentAgent" :editable="isOwner" :shareable="true" :show-settings="true"
      :show-training-plan="true" :agent-type="agentType" :training-mode="trainingMode" :training-config="trainingConfig"
      @start-chat="handleStartChat" @edit="handleEdit" @share="handleShare" @start-training="handleStartTraining"
      @level-up="handleLevelUp" @skill-learned="handleSkillLearned" @voice-changed="handleVoiceChanged" />

    <!-- 加载状态 -->
    <van-loading v-if="loading" size="24px" vertical class="loading-container">
      加载智能体信息...
    </van-loading>

    <!-- 错误状态 -->
    <van-empty v-else-if="error" description="加载失败" image="error" class="error-container">
      <template #description>
        <div class="error-description">
          <p>无法加载智能体信息</p>
          <p class="error-tip">{{ error }}</p>
        </div>
      </template>
      <van-button round type="primary" @click="loadAgentInfo">
        重新加载
      </van-button>
    </van-empty>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import SdkworkAgentProfile from '@/components/sdkwork-agent-profile/sdkwork-agent-profile.vue'
import type { Agent } from '@/components/sdkwork-agent-list/types'
import { VoiceSpeakerVO } from '@/services'

// 页面配置
definePage({
  meta: {
    title: '智能体详情',
    requiresAuth: false,
  }
})

const route: any = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const error = ref('')
const currentAgent = ref<Agent>({
  id: '',
  name: '',
  description: '',
  avatar: '',
  status: 'offline',
  category: '',
  tags: [],
  createdTime: '',
  updatedTime: '',
  usageCount: 0,
  rating: 0,
  isPublic: false,
  owner: ''
})

// 养成计划相关数据
const agentType = ref<'pet' | 'virtual-character' | 'game-npc' | 'assistant'>('assistant')
const trainingMode = ref<'pet' | 'virtual-character' | 'game-npc' | 'default'>('default')
const trainingConfig = ref({
  interactionFrequency: 'normal' as 'low' | 'normal' | 'high',
  learningSpeed: 'medium' as 'slow' | 'medium' | 'fast',
  memoryCapacity: 'standard' as 'small' | 'standard' | 'large',
  autoLearning: true,
  voiceInteraction: false,
  emotionRecognition: true
})

// 计算属性
const agentId = computed(() => route.params.id as string)
const isOwner = computed(() => {
  // 这里应该根据实际用户信息判断是否为所有者
  return currentAgent.value.owner === 'current-user-id'
})

/**
 * 加载智能体信息
 */
const loadAgentInfo = async () => {
  loading.value = true
  error.value = ''

  try {
    // 模拟API调用获取智能体信息
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟数据 - 实际应该从API获取
    const mockAgent: Agent = {
      id: agentId.value || 'agent-001',
      name: '智能助手',
      description: '这是一个功能强大的智能助手，可以帮助您处理各种任务，包括回答问题、提供建议、执行操作等。',
      avatar: 'https://via.placeholder.com/80x80/1890ff/ffffff?text=AI',
      status: 'online',
      category: '助手',
      tags: ['智能对话', '任务处理', '知识问答', '工具集成'],
      createdTime: '2024-01-15T10:30:00Z',
      updatedTime: '2024-10-19T14:20:00Z',
      usageCount: 1250,
      rating: 4.8,
      isPublic: true,
      owner: 'user-001'
    }

    currentAgent.value = mockAgent
    showToast('智能体信息加载成功')
  } catch (err) {
    console.error('加载智能体信息失败:', err)
    error.value = '网络错误或智能体不存在'
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

/**
 * 处理返回
 */
const handleBack = () => {
  router.back()
}

/**
 * 处理开始对话
 */
const handleStartChat = (agent: Agent) => {
  console.log('开始与智能体对话:', agent.name)
  // 跳转到对话页面
  router.push(`/chat/${agent.id}`)
}

/**
 * 处理编辑
 */
const handleEdit = (agent: Agent) => {
  console.log('编辑智能体:', agent.name)
  // 跳转到编辑页面
  router.push(`/agent/edit/${agent.id}`)
}

/**
 * 处理分享
 */
const handleShare = async (agent: Agent) => {
  try {
    // 模拟分享功能
    if (navigator.share) {
      await navigator.share({
        title: agent.name,
        text: agent.description,
        url: window.location.href
      })
      showToast('分享成功')
    } else {
      // 备用分享方式
      const shareUrl = `${window.location.origin}/agent/${agent.id}`
      await navigator.clipboard.writeText(shareUrl)
      showToast('链接已复制到剪贴板')
    }
  } catch (err: any) {
    console.error('分享失败:', err)
    // 如果分享被取消，不显示错误
    if (err.name !== 'AbortError') {
      showToast('分享失败')
    }
  }
}

/**
 * 处理开始养成
 */
const handleStartTraining = (agent: Agent) => {
  console.log('开始智能体养成:', agent.name)
  // 跳转到养成页面
  router.push(`/agent/training/${agent.id}`)
}

/**
 * 处理等级提升
 */
const handleLevelUp = (agent: Agent, newLevel: number) => {
  console.log(`智能体 ${agent.name} 升级到 ${newLevel} 级`)
  // 可以在这里记录等级变化或发送到服务器
}

/**
 * 处理技能学习
 */
const handleSkillLearned = (agent: Agent, skill: string) => {
  console.log(`智能体 ${agent.name} 学会了新技能: ${skill}`)
  // 可以在这里记录技能学习或发送到服务器
}

/**
 * 处理语音更换
 */
const handleVoiceChanged = (agent: Agent, speaker: VoiceSpeakerVO) => {
  console.log(`智能体 ${agent.name} 更换发音人: ${speaker.name}`)
  showToast(`已更换发音人为: ${speaker.name}`)

  // 这里可以调用API更新智能体的语音配置
  // 例如：updateAgentVoiceConfig(agent.id, speaker)
}

// 生命周期
onMounted(() => {
  if (!agentId.value) {
    error.value = '智能体ID不能为空'
    loading.value = false
    return
  }

  loadAgentInfo()
})

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  if (newId && newId !== agentId.value) {
    loadAgentInfo()
  }
})
</script>

<style scoped lang="scss">
.agent-profile-page {
  min-height: 100dvh;
  background: #f7f8fa;

  .page-content {
    padding-bottom: env(safe-area-inset-bottom);

    .loading-container {
      padding: 60px 20px;
      text-align: center;
    }

    .error-container {
      padding: 60px 20px;

      .error-description {
        text-align: center;

        p {
          margin: 4px 0;
          font-size: 14px;
          color: #666;
        }

        .error-tip {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}


// 深色模式支持
@media (prefers-color-scheme: dark) {
  .agent-profile-page {
    background: #1a1a1a;
  }
}
</style>