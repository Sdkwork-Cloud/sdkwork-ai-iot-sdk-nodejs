<template>
  <div class="pet-training-plan">
    <!-- 宠物养成进度 -->
    <div class="training-progress">
      <div class="progress-header">
        <h3>宠物养成进度</h3>
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
          color="#07c160"
        />
      </div>
      
      <!-- 宠物属性 -->
      <div class="pet-attributes">
        <sdkwork-row gutter="12">
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:heart" width="20" height="20" color="#ff6b6b" />
              <div class="attribute-value">{{ attributes.health }}</div>
              <div class="attribute-label">健康</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:food" width="20" height="20" color="#ffa726" />
              <div class="attribute-value">{{ attributes.hunger }}</div>
              <div class="attribute-label">饱食</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:emoticon-happy" width="20" height="20" color="#4ecdc4" />
              <div class="attribute-value">{{ attributes.happiness }}</div>
              <div class="attribute-label">快乐</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:lightning-bolt" width="20" height="20" color="#ffd93d" />
              <div class="attribute-value">{{ attributes.energy }}</div>
              <div class="attribute-label">精力</div>
            </div>
          </sdkwork-col>
        </sdkwork-row>
      </div>
    </div>
    
    <!-- 养成任务 -->
    <div class="training-tasks">
      <div class="section-title">今日任务</div>
      <sdkwork-cell-group>
        <sdkwork-cell 
          v-for="task in dailyTasks" 
          :key="task.id"
          :title="task.name"
          :value="task.reward"
          :label="task.description"
        >
          <template #right-icon>
            <van-tag :type="task.completed ? 'success' : 'primary'">
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
            @click="handleFeed"
            :disabled="attributes.hunger >= 100"
          >
            <iconify-icon icon="mdi:food" width="16" height="16" />
            喂食
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="success" 
            @click="handlePlay"
            :disabled="attributes.energy <= 0"
          >
            <iconify-icon icon="mdi:gamepad" width="16" height="16" />
            玩耍
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="warning" 
            @click="handleTrain"
            :disabled="attributes.energy <= 0"
          >
            <iconify-icon icon="mdi:dumbbell" width="16" height="16" />
            训练
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="default" 
            @click="handleRest"
            :disabled="attributes.energy >= 100"
          >
            <iconify-icon icon="mdi:sleep" width="16" height="16" />
            休息
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

interface PetTrainingPlanProps {
  agent: Agent
  config: any
}

interface PetTrainingPlanEmits {
  (e: 'level-up', newLevel: number): void
  (e: 'skill-learned', skill: string): void
}

const props = defineProps<PetTrainingPlanProps>()
const emit = defineEmits<PetTrainingPlanEmits>()

const IconifyIcon = Icon

// 宠物属性
const attributes = reactive({
  health: 80,
  hunger: 60,
  happiness: 70,
  energy: 50
})

// 养成数据
const currentLevel = ref(3)
const currentExp = ref(450)
const maxExp = ref(1000)

// 计算属性
const expPercentage = computed(() => {
  return Math.round((currentExp.value / maxExp.value) * 100)
})

// 每日任务
const dailyTasks = ref([
  {
    id: 1,
    name: '喂食宠物',
    description: '给宠物喂食3次',
    reward: '+10经验',
    completed: false
  },
  {
    id: 2,
    name: '玩耍训练',
    description: '与宠物玩耍30分钟',
    reward: '+15经验',
    completed: false
  },
  {
    id: 3,
    name: '健康检查',
    description: '完成宠物健康检查',
    reward: '+20经验',
    completed: true
  }
])

/**
 * 处理喂食
 */
const handleFeed = () => {
  attributes.hunger = Math.min(100, attributes.hunger + 20)
  attributes.happiness = Math.min(100, attributes.happiness + 5)
  currentExp.value += 5
  checkLevelUp()
  showToast('喂食成功，宠物饱食度提升')
}

/**
 * 处理玩耍
 */
const handlePlay = () => {
  attributes.energy = Math.max(0, attributes.energy - 10)
  attributes.happiness = Math.min(100, attributes.happiness + 15)
  currentExp.value += 8
  checkLevelUp()
  showToast('玩耍愉快，宠物快乐度提升')
}

/**
 * 处理训练
 */
const handleTrain = () => {
  attributes.energy = Math.max(0, attributes.energy - 15)
  attributes.hunger = Math.max(0, attributes.hunger - 10)
  currentExp.value += 12
  checkLevelUp()
  showToast('训练完成，宠物经验值增加')
}

/**
 * 处理休息
 */
const handleRest = () => {
  attributes.energy = Math.min(100, attributes.energy + 30)
  attributes.health = Math.min(100, attributes.health + 5)
  showToast('宠物休息中，精力恢复')
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
    
    // 学习新技能
    if (currentLevel.value % 3 === 0) {
      const newSkill = `宠物技能 Lv.${Math.floor(currentLevel.value / 3)}`
      emit('skill-learned', newSkill)
    }
  }
}
</script>

<style scoped lang="scss">
.pet-training-plan {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .training-progress {
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
    
    .pet-attributes {
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
      
      &:disabled {
        opacity: 0.5;
      }
    }
  }
}
</style>