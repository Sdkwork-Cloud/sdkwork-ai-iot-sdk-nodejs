<template>
  <div 
    class="sdkwork-agent-profile"
    :class="themeClass"
  >
    <!-- 智能体基本信息卡片 -->
    <div class="agent-basic-info">
      <div class="agent-avatar-section">
        <div class="avatar-container">
          <van-image
            :src="agent.icon || agent.faceImage?.url"
            width="80"
            height="80"
            radius="50%"
            fit="cover"
            class="agent-avatar"
          >
            <template v-slot:error>
              <div class="avatar-placeholder">
                <iconify-icon icon="mdi:robot-outline" width="32" height="32" />
              </div>
            </template>
          </van-image>
          
          <!-- 在线状态指示器 -->
          <div class="status-indicator" :class="agent.status">
            <div class="status-dot"></div>
            <span class="status-text">{{ getStatusText(agent.status) }}</span>
          </div>
        </div>
        
        <div class="agent-info">
          <div class="agent-name">
            {{ agent.name }}
            <van-tag v-if="agent.owner === 'public'" type="success">公开</van-tag>
            <van-tag v-else type="warning">私有</van-tag>
          </div>
          <div class="agent-id">ID: {{ agent.id }}</div>
          <div class="agent-category">
            <van-tag type="primary">{{ agent.bizType || agent.type }}</van-tag>
          </div>
        </div>
      </div>
      
      <!-- 智能体描述 -->
      <div class="agent-description">
        <p>{{ agent.description }}</p>
      </div>
    </div>
    
    <!-- 智能体统计信息 -->
    <div class="agent-stats">
      <sdkwork-row gutter="12">
        <sdkwork-col span="6">
          <div class="stat-item">
            <div class="stat-number">{{ agent.usageCount || 0 }}</div>
            <div class="stat-label">使用次数</div>
          </div>
        </sdkwork-col>
        <sdkwork-col span="6">
          <div class="stat-item">
            <div class="stat-number">{{ agent.rating || 0 }}</div>
            <div class="stat-label">评分</div>
          </div>
        </sdkwork-col>
        <sdkwork-col span="6">
          <div class="stat-item">
            <div class="stat-number">{{ agent.tags?.length || 0 }}</div>
            <div class="stat-label">标签数</div>
          </div>
        </sdkwork-col>
        <sdkwork-col span="6">
          <div class="stat-item">
            <div class="stat-number">{{ getDaysSinceCreated(agent.createdAt || agent.createdTime) }}</div>
            <div class="stat-label">创建天数</div>
          </div>
        </sdkwork-col>
      </sdkwork-row>
    </div>
    
    <!-- 通用设置 -->
    <div class="general-settings" v-if="showSettings">
      <div class="section-title">通用设置</div>
      <sdkwork-cell-group>
        <sdkwork-cell title="智能体类型" :value="agentType" />
        <sdkwork-cell title="养成模式" :value="trainingMode" />
        <sdkwork-cell title="互动频率" :value="interactionFrequency" />
        <sdkwork-cell title="学习速度" :value="learningSpeed" />
        <sdkwork-cell title="记忆容量" :value="memoryCapacity" />
        <sdkwork-cell title="语音设置" center is-link @click="showVoicePopup = true">
          <template #value>
            <div class="voice-selector">
              <van-icon name="music" class="voice-icon" />
              <span v-if="selectedSpeaker" class="selected-voice">
                {{ selectedSpeaker.name }}
              </span>
              <span v-else class="placeholder">请选择发音人</span>
            </div>
          </template>
        </sdkwork-cell>
        <sdkwork-cell title="自动学习">
          <template #right-icon>
            <van-switch v-model="autoLearning" size="20" />
          </template>
        </sdkwork-cell>
        <sdkwork-cell title="语音交互">
          <template #right-icon>
            <van-switch v-model="voiceInteraction" size="20" />
          </template>
        </sdkwork-cell>
        <sdkwork-cell title="情感识别">
          <template #right-icon>
            <van-switch v-model="emotionRecognition" size="20" />
          </template>
        </sdkwork-cell>
      </sdkwork-cell-group>
    </div>
    
    <!-- 养成计划组件 -->
    <div class="training-plan" v-if="showTrainingPlan">
      <div class="section-title">养成计划</div>
      
      <!-- 宠物类养成计划 -->
      <pet-training-plan
        v-if="trainingMode === 'pet'"
        :agent="agent"
        :config="trainingConfig"
        @level-up="handleLevelUp"
        @skill-learned="handleSkillLearned"
      />
      
      <!-- 虚拟角色养成计划 -->
      <virtual-character-training-plan
        v-else-if="trainingMode === 'virtual-character'"
        :agent="agent"
        :config="trainingConfig"
        @level-up="handleLevelUp"
        @skill-learned="handleSkillLearned"
      />
      
      <!-- 游戏NPC养成计划 -->
      <game-npc-training-plan
        v-else-if="trainingMode === 'game-npc'"
        :agent="agent"
        :config="trainingConfig"
        @level-up="handleLevelUp"
        @skill-learned="handleSkillLearned"
      />
      
      <!-- 默认养成计划 -->
      <default-training-plan
        v-else
        :agent="agent"
        :config="trainingConfig"
        @level-up="handleLevelUp"
        @skill-learned="handleSkillLearned"
      />
    </div>
    
    <!-- 智能体标签 -->
    <div class="agent-tags">
      <div class="section-title">标签</div>
      <div class="tags-container">
        <van-tag
          v-for="tag in agent.tags"
          :key="tag"
          type="primary" 
          class="tag-item"
        >
          {{ tag }}
        </van-tag>
        <div v-if="!agent.tags || agent.tags.length === 0" class="no-tags">暂无标签</div>
      </div>
    </div>
    
    <!-- 智能体详细信息 -->
    <div class="agent-details">
      <sdkwork-cell-group>
        <sdkwork-cell title="创建时间" :value="formatDate(agent.createdAt || agent.createdTime)" />
        <sdkwork-cell title="更新时间" :value="formatDate(agent.updatedAt || agent.updatedTime)" />
        <sdkwork-cell title="所有者" :value="agent.owner" />
        <sdkwork-cell title="状态" :value="getStatusText(agent.status)" />
        <sdkwork-cell title="养成模式" :value="trainingMode" />
        <sdkwork-cell title="当前等级" :value="currentLevel" />
      </sdkwork-cell-group>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <van-button 
        type="primary" 
        size="large" 
        @click="handleStartChat"
        class="action-btn"
      >
        <iconify-icon icon="mdi:message-outline" width="16" height="16" class="mr-2" />
        开始对话
      </van-button>
      
      <van-button 
        type="default" 
        size="large" 
        @click="handleEdit"
        class="action-btn"
      >
        <iconify-icon icon="mdi:pencil-outline" width="16" height="16" class="mr-2" />
        编辑信息
      </van-button>
      
      <van-button 
        type="warning" 
        size="large" 
        @click="handleTraining"
        class="action-btn"
      >
        <iconify-icon icon="mdi:school-outline" width="16" height="16" class="mr-2" />
        开始养成
      </van-button>
      
      <van-button 
        type="warning" 
        size="large" 
        @click="handleShare"
        class="action-btn"
      >
        <iconify-icon icon="mdi:share-outline" width="16" height="16" class="mr-2" />
        分享智能体
      </van-button>
    </div>
    
    <!-- 语音选择弹出层 -->
    <SdkworkVoiceListPopup
      v-model="showVoicePopup"
      title="选择发音人"
      height="70vh"
      :selected-speaker-id="selectedSpeaker?.id"
      @confirm="handleVoiceConfirm"
      @close="showVoicePopup = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue' 
// 导入养成计划子组件
import PetTrainingPlan from './components/PetTrainingPlan.vue'
import VirtualCharacterTrainingPlan from './components/VirtualCharacterTrainingPlan.vue'
import GameNpcTrainingPlan from './components/GameNpcTrainingPlan.vue'
import DefaultTrainingPlan from './components/DefaultTrainingPlan.vue'
import SdkworkVoiceListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'
import { AiAgentVO, VoiceSpeakerVO } from '@/services'

interface SdkworkAgentProfileProps {
  /** 智能体数据 */
  agent: AiAgentVO|any
  /** 是否显示编辑按钮 */
  editable?: boolean
  /** 是否显示分享按钮 */
  shareable?: boolean
  /** 是否显示通用设置 */
  showSettings?: boolean
  /** 是否显示养成计划 */
  showTrainingPlan?: boolean
  /** 智能体类型 */
  agentType?: 'pet' | 'virtual-character' | 'game-npc' | 'assistant'
  /** 养成模式 */
  trainingMode?: 'pet' | 'virtual-character' | 'game-npc' | 'default'
  /** 养成配置 */
  trainingConfig?: TrainingConfig
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<SdkworkAgentProfileProps>(), {
  editable: true,
  shareable: true,
  showSettings: true,
  showTrainingPlan: true,
  agentType: 'assistant',
  trainingMode: 'default',
  themeMode: 'auto',
  trainingConfig: () => ({
    interactionFrequency: 'normal',
    learningSpeed: 'medium',
    memoryCapacity: 'standard',
    autoLearning: true,
    voiceInteraction: false,
    emotionRecognition: true
  })
})

interface TrainingConfig {
  interactionFrequency: 'low' | 'normal' | 'high'
  learningSpeed: 'slow' | 'medium' | 'fast'
  memoryCapacity: 'small' | 'standard' | 'large'
  autoLearning: boolean
  voiceInteraction: boolean
  emotionRecognition: boolean
}

interface SdkworkAgentProfileEmits {
  /** 开始对话事件 */
  (e: 'start-chat', agent: AiAgentVO): void
  /** 编辑智能体事件 */
  (e: 'edit', agent: AiAgentVO): void
  /** 分享智能体事件 */
  (e: 'share', agent: AiAgentVO): void
  /** 开始养成事件 */
  (e: 'start-training', agent: AiAgentVO): void
  /** 等级提升事件 */
  (e: 'level-up', agent: AiAgentVO, newLevel: number): void
  /** 技能学习事件 */
  (e: 'skill-learned', agent: AiAgentVO, skill: string): void
  /** 语音更换事件 */
  (e: 'voice-changed', agent: AiAgentVO, speaker: VoiceSpeakerVO): void
}

const emit = defineEmits<SdkworkAgentProfileEmits>()

const IconifyIcon = Icon

// 响应式数据
const autoLearning = ref(props.trainingConfig.autoLearning)
const voiceInteraction = ref(props.trainingConfig.voiceInteraction)
const emotionRecognition = ref(props.trainingConfig.emotionRecognition)
const currentLevel = ref<any>(1)
const showVoicePopup = ref(false)
const selectedSpeaker = ref<VoiceSpeakerVO | null>(null)

// Dark mode support - 参考 sdkwork-cell 的主题处理方式
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'agent-profile--dark' : 'agent-profile--light'
})

// 计算属性
const interactionFrequency = computed(() => {
  const frequencyMap = {
    'low': '低频',
    'normal': '中频', 
    'high': '高频'
  }
  return frequencyMap[props.trainingConfig.interactionFrequency]
})

const learningSpeed = computed(() => {
  const speedMap = {
    'slow': '慢速',
    'medium': '中速',
    'fast': '快速'
  }
  return speedMap[props.trainingConfig.learningSpeed]
})

const memoryCapacity = computed(() => {
  const capacityMap = {
    'small': '小容量',
    'standard': '标准容量',
    'large': '大容量'
  }
  return capacityMap[props.trainingConfig.memoryCapacity]
})

/**
 * 获取状态文本
 */
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'online': '在线',
    'offline': '离线',
    'busy': '忙碌'
  }
  return statusMap[status] || '未知'
}

/**
 * 格式化日期
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 计算创建天数
 */
const getDaysSinceCreated = (createdTime: string) => {
  const created = new Date(createdTime)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - created.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * 处理开始对话
 */
const handleStartChat = () => {
  emit('start-chat', props.agent)
  showToast('开始与智能体对话')
}

/**
 * 处理编辑
 */
const handleEdit = () => {
  if (props.editable) {
    emit('edit', props.agent)
    showToast('编辑智能体信息')
  }
}

/**
 * 处理分享
 */
const handleShare = () => {
  if (props.shareable) {
    emit('share', props.agent)
    showToast('分享智能体')
  }
}

/**
 * 处理养成
 */
const handleTraining = () => {
  emit('start-training', props.agent)
  showToast('开始智能体养成')
}

/**
 * 处理等级提升
 */
const handleLevelUp = (newLevel: number) => {
  currentLevel.value = newLevel
  emit('level-up', props.agent, newLevel)
  showToast(`智能体升级到 ${newLevel} 级！`)
}

/**
 * 处理技能学习
 */
const handleSkillLearned = (skill: string) => {
  emit('skill-learned', props.agent, skill)
  showToast(`学会了新技能：${skill}`)
}

/**
 * 处理语音确认
 */
const handleVoiceConfirm = (speaker: VoiceSpeakerVO) => {
  selectedSpeaker.value = speaker
  showVoicePopup.value = false
  showToast(`已选择发音人：${speaker.name}`)
  
  // 触发语音更换事件
  emit('voice-changed', props.agent, speaker)
}
</script>

<style scoped lang="scss">
.sdkwork-agent-profile {
  padding: 16px;
  min-height: 100dvh;
  
  // CSS 变量系统 - 参考 sdkwork-cell 的主题处理方式
  --agent-profile-bg: #f7f8fa;
  --agent-profile-card-bg: #ffffff;
  --agent-profile-text-primary: #333333;
  --agent-profile-text-secondary: #666666;
  --agent-profile-text-meta: #999999;
  --agent-profile-border-color: #f0f0f0;
  --agent-profile-section-title: #333333;
  --agent-profile-stat-number: var(--van-primary-color);
  --agent-profile-stat-label: #666666;
  --agent-profile-tag-bg: #f5f5f5;
  --agent-profile-tag-text: #666666;
  
  background: var(--agent-profile-bg);
  
  .agent-basic-info {
    background: var(--agent-profile-card-bg);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 12px;
    
    .agent-avatar-section {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .avatar-container {
        position: relative;
        margin-right: 16px;
        
        .agent-avatar {
          .avatar-placeholder {
            width: 80px;
            height: 80px;
            background: var(--agent-profile-tag-bg);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--agent-profile-text-meta);
          }
        }
        
        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          display: flex;
          align-items: center;
          background: var(--agent-profile-card-bg);
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          
          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 4px;
          }
          
          &.online {
            .status-dot {
              background: var(--van-success-color);
            }
            .status-text {
              color: var(--van-success-color);
            }
          }
          
          &.offline {
            .status-dot {
              background: var(--van-gray-5);
            }
            .status-text {
              color: var(--van-gray-5);
            }
          }
          
          &.busy {
            .status-dot {
              background: var(--van-warning-color);
            }
            .status-text {
              color: var(--van-warning-color);
            }
          }
        }
      }
      
      .agent-info {
        flex: 1;
        
        .agent-name {
          font-size: 18px;
          font-weight: 600;
          color: var(--agent-profile-text-primary);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .agent-id {
          font-size: 12px;
          color: var(--agent-profile-text-meta);
          margin-bottom: 8px;
        }
        
        .agent-category {
          .van-tag {
            font-size: 10px;
          }
        }
      }
    }
    
    .agent-description {
      p {
        font-size: 14px;
        color: var(--agent-profile-text-secondary);
        line-height: 1.5;
        margin: 0;
      }
    }
  }
  
  .agent-stats {
    background: var(--agent-profile-card-bg);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        font-size: 18px;
        font-weight: 600;
        color: var(--agent-profile-stat-number);
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 12px;
        color: var(--agent-profile-stat-label);
      }
    }
  }
  
  .agent-tags {
    background: var(--agent-profile-card-bg);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--agent-profile-section-title);
      margin-bottom: 12px;
    }
    
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tag-item {
        margin-bottom: 4px;
      }
      
      .no-tags {
        font-size: 12px;
        color: var(--agent-profile-text-meta);
        font-style: italic;
      }
    }
  }
  
  .general-settings {
    background: var(--agent-profile-card-bg);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--agent-profile-section-title);
      margin-bottom: 12px;
    }
    
    .sdkwork-cell {
      padding: 12px 0;
      
      :deep(.sdkwork-cell__title) {
        font-size: 14px;
        color: var(--agent-profile-text-secondary);
      }
      
      :deep(.sdkwork-cell__value) {
        font-size: 14px;
        color: var(--agent-profile-text-primary);
      }
    }
  }
  
  .training-plan {
    background: var(--agent-profile-card-bg);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--agent-profile-section-title);
      margin-bottom: 12px;
    }
  }
  
  .agent-details {
    background: var(--agent-profile-card-bg);
    border-radius: 8px;
    margin-bottom: 12px;
    
    .sdkwork-cell {
      padding: 12px 16px;
      
      :deep(.sdkwork-cell__title) {
        font-size: 14px;
        color: var(--agent-profile-text-secondary);
      }
      
      :deep(.sdkwork-cell__value) {
        font-size: 14px;
        color: var(--agent-profile-text-primary);
      }
    }
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .action-btn {
      .mr-2 {
        margin-right: 8px;
      }
    }
  }
}

// 语音选择器样式
.voice-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .voice-icon {
    color: var(--agent-profile-stat-number);
    font-size: 16px;
  }
  
  .selected-voice {
    color: var(--agent-profile-text-primary);
    font-size: 14px;
  }
  
  .placeholder {
    color: var(--agent-profile-text-meta);
    font-size: 14px;
  }
}

// 浅色主题
.agent-profile--light {
  --agent-profile-bg: #f7f8fa;
  --agent-profile-card-bg: #ffffff;
  --agent-profile-text-primary: #333333;
  --agent-profile-text-secondary: #666666;
  --agent-profile-text-meta: #999999;
  --agent-profile-border-color: #f0f0f0;
  --agent-profile-section-title: #333333;
  --agent-profile-stat-number: var(--van-primary-color);
  --agent-profile-stat-label: #666666;
  --agent-profile-tag-bg: #f5f5f5;
  --agent-profile-tag-text: #666666;
}

// 深色主题
.agent-profile--dark {
  --agent-profile-bg: #0f0f0f;
  --agent-profile-card-bg: #1a1a1a;
  --agent-profile-text-primary: #e0e0e0;
  --agent-profile-text-secondary: #a0a0a0;
  --agent-profile-text-meta: #888888;
  --agent-profile-border-color: #3a3a3a;
  --agent-profile-section-title: #e0e0e0;
  --agent-profile-stat-number: var(--van-primary-color);
  --agent-profile-stat-label: #a0a0a0;
  --agent-profile-tag-bg: #2a2a2a;
  --agent-profile-tag-text: #a0a0a0;
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-agent-profile {
    padding: 12px;
    
    .agent-basic-info {
      padding: 16px;
      
      .agent-avatar-section {
        .avatar-container {
          margin-right: 12px;
          
          .agent-avatar {
            width: 60px;
            height: 60px;
          }
        }
        
        .agent-info {
          .agent-name {
            font-size: 16px;
          }
        }
      }
    }
    
    .action-buttons {
      .action-btn {
        font-size: 14px;
      }
    }
  }
}
</style>