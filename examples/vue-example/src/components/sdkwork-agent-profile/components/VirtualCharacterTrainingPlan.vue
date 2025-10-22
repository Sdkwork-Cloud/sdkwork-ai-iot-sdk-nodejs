<template>
  <div class="virtual-character-training-plan">
    <!-- 角色养成进度 -->
    <div class="character-progress">
      <div class="progress-header">
        <h3>角色养成进度</h3>
        <span class="level">Lv.{{ currentLevel }}</span>
      </div>
      
      <!-- 经验值进度条 -->
      <div class="exp-progress">
        <div class="exp-info">
          <span>经验值</span>
          <span>{{ currentExp }}/{{ maxExp }}</span>
        </div>
        <van-progress 
          :percentage="expPercentage" 
          stroke-width="8" 
          color="#7239ea"
        />
      </div>
      
      <!-- 角色属性 -->
      <div class="character-attributes">
        <sdkwork-row gutter="12">
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:brain" width="20" height="20" color="#3498db" />
              <div class="attribute-value">{{ attributes.intelligence }}</div>
              <div class="attribute-label">智力</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:heart" width="20" height="20" color="#e74c3c" />
              <div class="attribute-value">{{ attributes.emotion }}</div>
              <div class="attribute-label">情感</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:account-group" width="20" height="20" color="#2ecc71" />
              <div class="attribute-value">{{ attributes.social }}</div>
              <div class="attribute-label">社交</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:lightbulb" width="20" height="20" color="#f39c12" />
              <div class="attribute-value">{{ attributes.creativity }}</div>
              <div class="attribute-label">创意</div>
            </div>
          </sdkwork-col>
        </sdkwork-row>
      </div>
    </div>
    
    <!-- 技能树 -->
    <div class="skill-tree">
      <div class="section-title">技能树</div>
      <div class="skills-container">
        <div 
          v-for="skill in skills" 
          :key="skill.id"
          class="skill-item"
          :class="{ 
            'skill-unlocked': skill.unlocked, 
            'skill-available': skill.available && !skill.unlocked 
          }"
          @click="handleLearnSkill(skill)"
        >
          <div class="skill-icon">
            <iconify-icon :icon="skill.icon" width="24" height="24" />
          </div>
          <div class="skill-info">
            <div class="skill-name">{{ skill.name }}</div>
            <div class="skill-level">Lv.{{ skill.level }}</div>
          </div>
          <div class="skill-status">
            <van-tag v-if="skill.unlocked" type="success">已掌握</van-tag>
            <van-tag v-else-if="skill.available" type="warning">可学习</van-tag>
            <van-tag v-else type="default">未解锁</van-tag>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 养成任务 -->
    <div class="training-tasks">
      <div class="section-title">成长任务</div>
      <sdkwork-cell-group>
        <sdkwork-cell 
          v-for="task in growthTasks" 
          :key="task.id"
          :title="task.name"
          :value="task.reward"
          :label="task.description"
        >
          <template #right-icon>
            <van-progress 
              v-if="task.progress > 0 && task.progress < 100"
              :percentage="task.progress" 
              stroke-width="4" 
              :show-pivot="false"
              size="small"
            />
            <van-tag v-else :type="task.completed ? 'success' : 'primary'">
              {{ task.completed ? '已完成' : '进行中' }}
            </van-tag>
          </template>
        </sdkwork-cell>
      </sdkwork-cell-group>
    </div>
    
    <!-- 养成操作 -->
    <div class="training-actions">
      <sdkwork-row gutter="8">
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="primary" 
            @click="handleStudy"
          >
            <iconify-icon icon="mdi:book" width="16" height="16" />
            学习
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="success" 
            @click="handleSocialize"
          >
            <iconify-icon icon="mdi:account-group" width="16" height="16" />
            社交
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="warning" 
            @click="handleCreate"
          >
            <iconify-icon icon="mdi:palette" width="16" height="16" />
            创作
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="default" 
            @click="handleReflect"
          >
            <iconify-icon icon="mdi:meditation" width="16" height="16" />
            反思
          </van-button>
        </sdkwork-col>
      </sdkwork-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'
import type { Agent } from '../../sdkwork-agent-list/types'

interface VirtualCharacterTrainingPlanProps {
  agent: Agent
  config: any
}

interface VirtualCharacterTrainingPlanEmits {
  (e: 'level-up', newLevel: number): void
  (e: 'skill-learned', skill: string): void
}

const props = defineProps<VirtualCharacterTrainingPlanProps>()
const emit = defineEmits<VirtualCharacterTrainingPlanEmits>()

const IconifyIcon = Icon

// 角色属性
const attributes = reactive({
  intelligence: 65,
  emotion: 70,
  social: 55,
  creativity: 60
})

// 养成数据
const currentLevel = ref(5)
const currentExp = ref(1200)
const maxExp = ref(2000)

// 技能树
const skills = ref([
  {
    id: 1,
    name: '语言表达',
    icon: 'mdi:chat',
    level: 1,
    unlocked: true,
    available: false,
    requirement: { level: 1, intelligence: 30 }
  },
  {
    id: 2,
    name: '情感理解',
    icon: 'mdi:heart',
    level: 2,
    unlocked: true,
    available: false,
    requirement: { level: 2, emotion: 40 }
  },
  {
    id: 3,
    name: '逻辑思维',
    icon: 'mdi:brain',
    level: 3,
    unlocked: false,
    available: true,
    requirement: { level: 3, intelligence: 60 }
  },
  {
    id: 4,
    name: '创意写作',
    icon: 'mdi:pen',
    level: 4,
    unlocked: false,
    available: false,
    requirement: { level: 4, creativity: 70 }
  },
  {
    id: 5,
    name: '社交技巧',
    icon: 'mdi:account-group',
    level: 5,
    unlocked: false,
    available: false,
    requirement: { level: 5, social: 80 }
  }
])

// 成长任务
const growthTasks = ref([
  {
    id: 1,
    name: '阅读学习',
    description: '完成3篇专业文章阅读',
    reward: '+15智力',
    progress: 67,
    completed: false
  },
  {
    id: 2,
    name: '情感交流',
    description: '进行5次深度对话',
    reward: '+10情感',
    progress: 40,
    completed: false
  },
  {
    id: 3,
    name: '创意项目',
    description: '完成1个创意作品',
    reward: '+20创意',
    progress: 0,
    completed: false
  }
])

// 计算属性
const expPercentage = computed(() => {
  return Math.round((currentExp.value / maxExp.value) * 100)
})

/**
 * 处理学习
 */
const handleStudy = () => {
  attributes.intelligence = Math.min(100, attributes.intelligence + 5)
  currentExp.value += 10
  checkLevelUp()
  updateSkillAvailability()
  showToast('学习完成，智力提升')
}

/**
 * 处理社交
 */
const handleSocialize = () => {
  attributes.social = Math.min(100, attributes.social + 8)
  attributes.emotion = Math.min(100, attributes.emotion + 3)
  currentExp.value += 12
  checkLevelUp()
  updateSkillAvailability()
  showToast('社交活动完成，社交能力提升')
}

/**
 * 处理创作
 */
const handleCreate = () => {
  attributes.creativity = Math.min(100, attributes.creativity + 10)
  attributes.intelligence = Math.min(100, attributes.intelligence + 2)
  currentExp.value += 15
  checkLevelUp()
  updateSkillAvailability()
  showToast('创作完成，创意能力提升')
}

/**
 * 处理反思
 */
const handleReflect = () => {
  attributes.emotion = Math.min(100, attributes.emotion + 6)
  attributes.intelligence = Math.min(100, attributes.intelligence + 3)
  currentExp.value += 8
  checkLevelUp()
  updateSkillAvailability()
  showToast('反思完成，情感理解提升')
}

/**
 * 处理学习技能
 */
const handleLearnSkill = (skill: any) => {
  if (!skill.available || skill.unlocked) return
  
  skill.unlocked = true
  skill.available = false
  currentExp.value += 50
  
  emit('skill-learned', skill.name)
  showToast(`学会了新技能：${skill.name}`)
  
  checkLevelUp()
  updateSkillAvailability()
}

/**
 * 检查升级
 */
const checkLevelUp = () => {
  if (currentExp.value >= maxExp.value) {
    currentLevel.value++
    currentExp.value = 0
    maxExp.value = currentLevel.value * 500
    emit('level-up', currentLevel.value)
    updateSkillAvailability()
  }
}

/**
 * 更新技能可用性
 */
const updateSkillAvailability = () => {
  skills.value.forEach(skill => {
    if (!skill.unlocked) {
      skill.available = 
        currentLevel.value >= skill.requirement.level 
    }
  })
}

// 初始化时更新技能可用性
updateSkillAvailability()
</script>

<style scoped lang="scss">
.virtual-character-training-plan {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .character-progress {
    margin-bottom: 16px;
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      
      .level {
        background: var(--van-primary-color);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }
    
    .exp-progress {
      margin-bottom: 16px;
      
      .exp-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 12px;
        color: #666;
      }
    }
    
    .character-attributes {
      .attribute-item {
        text-align: center;
        
        .attribute-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 4px 0;
        }
        
        .attribute-label {
          font-size: 10px;
          color: #999;
        }
      }
    }
  }
  
  .skill-tree {
    margin-bottom: 16px;
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    .skills-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .skill-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.3s;
        
        &.skill-unlocked {
          background: #f6ffed;
          border-color: #b7eb8f;
        }
        
        &.skill-available {
          background: #fff7e6;
          border-color: #ffd591;
          cursor: pointer;
          
          &:hover {
            background: #ffe7ba;
          }
        }
        
        .skill-icon {
          margin-right: 12px;
          
          :deep(svg) {
            color: #666;
          }
        }
        
        .skill-info {
          flex: 1;
          
          .skill-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 2px;
          }
          
          .skill-level {
            font-size: 10px;
            color: #999;
          }
        }
        
        .skill-status {
          margin-left: 8px;
        }
      }
    }
  }
  
  .training-tasks {
    margin-bottom: 16px;
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    .sdkwork-cell {
      padding: 8px 0;
    }
  }
  
  .training-actions {
    .van-button {
      width: 100%;
    }
  }
}
</style>