<template>
  <div class="game-npc-training-plan">
    <!-- NPC养成进度 -->
    <div class="npc-progress">
      <div class="progress-header">
        <h3>NPC养成进度</h3>
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
          color="#e74c3c"
        />
      </div>
      
      <!-- NPC属性 -->
      <div class="npc-attributes">
        <sdkwork-row gutter="12">
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:sword" width="20" height="20" color="#e74c3c" />
              <div class="attribute-value">{{ attributes.strength }}</div>
              <div class="attribute-label">力量</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:shield" width="20" height="20" color="#3498db" />
              <div class="attribute-value">{{ attributes.defense }}</div>
              <div class="attribute-label">防御</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:run" width="20" height="20" color="#2ecc71" />
              <div class="attribute-value">{{ attributes.agility }}</div>
              <div class="attribute-label">敏捷</div>
            </div>
          </sdkwork-col>
          <sdkwork-col span="6">
            <div class="attribute-item">
              <iconify-icon icon="mdi:magic-staff" width="20" height="20" color="#9b59b6" />
              <div class="attribute-value">{{ attributes.magic }}</div>
              <div class="attribute-label">魔法</div>
            </div>
          </sdkwork-col>
        </sdkwork-row>
      </div>
    </div>
    
    <!-- 任务系统 -->
    <div class="quest-system">
      <div class="section-title">任务系统</div>
      <div class="quests-container">
        <div 
          v-for="quest in quests" 
          :key="quest.id"
          class="quest-item"
          :class="{ 
            'quest-completed': quest.completed, 
            'quest-available': quest.available && !quest.completed 
          }"
          @click="handleAcceptQuest(quest)"
        >
          <div class="quest-icon">
            <iconify-icon :icon="quest.icon" width="24" height="24" />
          </div>
          <div class="quest-info">
            <div class="quest-name">{{ quest.name }}</div>
            <div class="quest-difficulty">
              <van-tag :type="getDifficultyType(quest.difficulty)" size="medium">
                {{ quest.difficulty }}
              </van-tag>
            </div>
            <div class="quest-reward">奖励: {{ quest.reward }}</div>
          </div>
          <div class="quest-status">
            <van-tag v-if="quest.completed" type="success" size="medium">已完成</van-tag>
            <van-tag v-else-if="quest.inProgress" type="warning" size="medium">进行中</van-tag>
            <van-tag v-else-if="quest.available" type="primary" size="medium">可接受</van-tag>
            <van-tag v-else type="default" size="medium">未解锁</van-tag>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 装备系统 -->
    <div class="equipment-system">
      <div class="section-title">装备系统</div>
      <div class="equipment-slots">
        <div class="equipment-row">
          <div class="equipment-slot" @click="handleEquip('weapon')">
            <div class="slot-icon">
              <iconify-icon icon="mdi:sword" width="20" height="20" />
            </div>
            <div class="slot-info">
              <div class="slot-name">武器</div>
              <div class="slot-item">{{ equipment.weapon || '空' }}</div>
            </div>
          </div>
          <div class="equipment-slot" @click="handleEquip('armor')">
            <div class="slot-icon">
              <iconify-icon icon="mdi:shield" width="20" height="20" />
            </div>
            <div class="slot-info">
              <div class="slot-name">护甲</div>
              <div class="slot-item">{{ equipment.armor || '空' }}</div>
            </div>
          </div>
        </div>
        <div class="equipment-row">
          <div class="equipment-slot" @click="handleEquip('accessory')">
            <div class="slot-icon">
              <iconify-icon icon="mdi:ring" width="20" height="20" />
            </div>
            <div class="slot-info">
              <div class="slot-name">饰品</div>
              <div class="slot-item">{{ equipment.accessory || '空' }}</div>
            </div>
          </div>
          <div class="equipment-slot" @click="handleEquip('special')">
            <div class="slot-icon">
              <iconify-icon icon="mdi:star" width="20" height="20" />
            </div>
            <div class="slot-info">
              <div class="slot-name">特殊</div>
              <div class="slot-item">{{ equipment.special || '空' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 养成操作 -->
    <div class="training-actions">
      <sdkwork-row gutter="8">
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="primary" 
            @click="handleTrain"
          >
            <iconify-icon icon="mdi:dumbbell" width="16" height="16" />
            训练
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="success" 
            @click="handleBattle"
          >
            <iconify-icon icon="mdi:sword-cross" width="16" height="16" />
            战斗
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="warning" 
            @click="handleExplore"
          >
            <iconify-icon icon="mdi:map" width="16" height="16" />
            探索
          </van-button>
        </sdkwork-col>
        <sdkwork-col span="6">
          <van-button 
            size="small" 
            type="default" 
            @click="handleRest"
          >
            <iconify-icon icon="mdi:campfire" width="16" height="16" />
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

interface GameNpcTrainingPlanProps {
  agent: Agent
  config: any
}

interface GameNpcTrainingPlanEmits {
  (e: 'level-up', newLevel: number): void
  (e: 'skill-learned', skill: string): void
}

const props = defineProps<GameNpcTrainingPlanProps>()
const emit = defineEmits<GameNpcTrainingPlanEmits>()

const IconifyIcon = Icon

// NPC属性
const attributes = reactive({
  strength: 70,
  defense: 60,
  agility: 55,
  magic: 45
})

// 养成数据
const currentLevel = ref(7)
const currentExp = ref(1800)
const maxExp = ref(3000)

// 装备系统
interface Equipment {
  weapon: string
  armor: string
  accessory: string
  special: string
}

const equipment = reactive<Equipment|any>({
  weapon: '铁剑',
  armor: '皮甲',
  accessory: '',
  special: ''
})

// 任务系统
const quests = ref([
  {
    id: 1,
    name: '新手训练',
    icon: 'mdi:sword',
    difficulty: '简单',
    reward: '经验+50，铜币+100',
    available: true,
    inProgress: false,
    completed: false,
    requirement: { level: 1 }
  },
  {
    id: 2,
    name: '怪物讨伐',
    icon: 'mdi:skull',
    difficulty: '普通',
    reward: '经验+100，银币+50',
    available: true,
    inProgress: true,
    completed: false,
    requirement: { level: 3 }
  },
  {
    id: 3,
    name: '宝藏探索',
    icon: 'mdi:treasure-chest',
    difficulty: '困难',
    reward: '经验+200，金币+20',
    available: false,
    inProgress: false,
    completed: false,
    requirement: { level: 5 }
  },
  {
    id: 4,
    name: 'Boss挑战',
    icon: 'mdi:dragon',
    difficulty: '极难',
    reward: '经验+500，传说装备',
    available: false,
    inProgress: false,
    completed: false,
    requirement: { level: 10 }
  }
])

// 计算属性
const expPercentage = computed(() => {
  return Math.round((currentExp.value / maxExp.value) * 100)
})

/**
 * 获取难度类型
 */
const getDifficultyType = (difficulty: string) => {
  const typeMap: Record<string, any> = {
    '简单': 'success',
    '普通': 'primary',
    '困难': 'warning',
    '极难': 'danger'
  }
  return typeMap[difficulty] || 'default'
}

/**
 * 处理训练
 */
const handleTrain = () => {
  attributes.strength = Math.min(100, attributes.strength + 5)
  attributes.defense = Math.min(100, attributes.defense + 3)
  currentExp.value += 15
  checkLevelUp()
  updateQuestAvailability()
  showToast('训练完成，力量提升')
}

/**
 * 处理战斗
 */
const handleBattle = () => {
  attributes.strength = Math.min(100, attributes.strength + 8)
  attributes.agility = Math.min(100, attributes.agility + 4)
  currentExp.value += 25
  checkLevelUp()
  updateQuestAvailability()
  showToast('战斗胜利，获得经验')
}

/**
 * 处理探索
 */
const handleExplore = () => {
  attributes.agility = Math.min(100, attributes.agility + 6)
  attributes.magic = Math.min(100, attributes.magic + 3)
  currentExp.value += 20
  checkLevelUp()
  updateQuestAvailability()
  showToast('探索完成，发现新区域')
}

/**
 * 处理休息
 */
const handleRest = () => {
  attributes.defense = Math.min(100, attributes.defense + 5)
  showToast('休息完成，防御力恢复')
}

/**
 * 处理接受任务
 */
const handleAcceptQuest = (quest: any) => {
  if (!quest.available || quest.completed) return
  
  if (!quest.inProgress) {
    quest.inProgress = true
    showToast(`已接受任务：${quest.name}`)
  } else {
    // 完成任务
    quest.inProgress = false
    quest.completed = true
    currentExp.value += getQuestRewardExp(quest.difficulty)
    
    // 随机获得装备
    if (Math.random() > 0.7) {
      const newEquipment = getRandomEquipment()
      equipment[newEquipment.slot] = newEquipment.name
      showToast(`完成任务！获得${newEquipment.name}`)
    } else {
      showToast('任务完成！获得经验奖励')
    }
    
    checkLevelUp()
    updateQuestAvailability()
  }
}

/**
 * 处理装备
 */
const handleEquip = (slot: string) => {
  if (equipment[slot]) {
    showToast(`已装备：${equipment[slot]}`)
  } else {
    showToast('该装备槽为空')
  }
}

/**
 * 获取任务奖励经验
 */
const getQuestRewardExp = (difficulty: string) => {
  const expMap: Record<string, number> = {
    '简单': 50,
    '普通': 100,
    '困难': 200,
    '极难': 500
  }
  return expMap[difficulty] || 50
}

/**
 * 获取随机装备
 */
const getRandomEquipment = () => {
  const equipmentList = [
    { slot: 'weapon', name: '钢剑' },
    { slot: 'armor', name: '锁子甲' },
    { slot: 'accessory', name: '力量戒指' },
    { slot: 'special', name: '魔法护符' }
  ]
  return equipmentList[Math.floor(Math.random() * equipmentList.length)]
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
    if (currentLevel.value % 5 === 0) {
      const newSkill = `战斗技能 Lv.${Math.floor(currentLevel.value / 5)}`
      emit('skill-learned', newSkill)
    }
    
    updateQuestAvailability()
  }
}

/**
 * 更新任务可用性
 */
const updateQuestAvailability = () => {
  quests.value.forEach(quest => {
    if (!quest.completed && !quest.inProgress) {
      quest.available = currentLevel.value >= quest.requirement.level
    }
  })
}

// 初始化时更新任务可用性
updateQuestAvailability()
</script>

<style scoped lang="scss">
.game-npc-training-plan {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .npc-progress {
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
    
    .npc-attributes {
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
  
  .quest-system {
    margin-bottom: 16px;
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    .quests-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .quest-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.3s;
        
        &.quest-completed {
          background: #f6ffed;
          border-color: #b7eb8f;
        }
        
        &.quest-available {
          background: #e6f7ff;
          border-color: #91d5ff;
          cursor: pointer;
          
          &:hover {
            background: #bae7ff;
          }
        }
        
        .quest-icon {
          margin-right: 12px;
          
          :deep(svg) {
            color: #666;
          }
        }
        
        .quest-info {
          flex: 1;
          
          .quest-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
          }
          
          .quest-difficulty {
            margin-bottom: 2px;
          }
          
          .quest-reward {
            font-size: 10px;
            color: #999;
          }
        }
        
        .quest-status {
          margin-left: 8px;
        }
      }
    }
  }
  
  .equipment-system {
    margin-bottom: 16px;
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    .equipment-slots {
      .equipment-row {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
        
        .equipment-slot {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover {
            background: #f5f5f5;
          }
          
          .slot-icon {
            margin-right: 12px;
            
            :deep(svg) {
              color: #666;
            }
          }
          
          .slot-info {
            .slot-name {
              font-size: 12px;
              color: #999;
              margin-bottom: 2px;
            }
            
            .slot-item {
              font-size: 14px;
              font-weight: 500;
              color: #333;
            }
          }
        }
      }
    }
  }
  
  .training-actions {
    .van-button {
      width: 100%;
    }
  }
}
</style>