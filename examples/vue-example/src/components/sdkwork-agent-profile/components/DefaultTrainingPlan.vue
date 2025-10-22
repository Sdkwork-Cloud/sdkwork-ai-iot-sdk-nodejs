<template>
  <div class="default-training-plan">
    <!-- 通用养成计划 -->
    <div class="training-overview">
      <sdkwork-row gutter="12">
        <sdkwork-col span="8">
          <div class="training-stat">
            <div class="stat-value">{{ currentLevel }}</div>
            <div class="stat-label">当前等级</div>
          </div>
        </sdkwork-col>
        <sdkwork-col span="8">
          <div class="training-stat">
            <div class="stat-value">{{ experiencePoints }}</div>
            <div class="stat-label">经验值</div>
          </div>
        </sdkwork-col>
        <sdkwork-col span="8">
          <div class="training-stat">
            <div class="stat-value">{{ learnedSkills.length }}</div>
            <div class="stat-label">已学技能</div>
          </div>
        </sdkwork-col>
      </sdkwork-row>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <div class="progress-item">
        <div class="progress-label">经验进度</div>
        <van-progress :percentage="experienceProgress" stroke-width="8" color="#1989fa" />
        <div class="progress-text">{{ experiencePoints }} / {{ nextLevelExperience }}</div>
      </div>
    </div>

    <!-- 技能列表 -->
    <div class="skills-section">
      <div class="section-subtitle">已学技能</div>
      <div class="skills-list">
        <van-tag
          v-for="skill in learnedSkills"
          :key="skill"
          type="success"
          size="medium"
          class="skill-tag"
        >
          {{ skill }}
        </van-tag>
        <div v-if="learnedSkills.length === 0" class="no-skills">暂无技能</div>
      </div>
    </div>

    <!-- 可学技能 -->
    <div class="available-skills-section">
      <div class="section-subtitle">可学技能</div>
      <div class="available-skills">
        <van-grid :column-num="2" :gutter="10">
          <van-grid-item
            v-for="skill in availableSkills"
            :key="skill.name"
            :text="skill.name"
            :icon="skill.icon"
            @click="learnSkill(skill.name)"
          />
        </van-grid>
      </div>
    </div>

    <!-- 训练按钮 -->
    <div class="training-actions">
      <van-button 
        type="primary" 
        size="large" 
        @click="startTraining"
        class="training-btn"
      >
        <iconify-icon icon="mdi:brain" width="16" height="16" class="mr-2" />
        开始训练
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'
import type { Agent } from '../../sdkwork-agent-list/types'

interface DefaultTrainingPlanProps {
  agent: Agent
  config: any
}

interface DefaultTrainingPlanEmits {
  (e: 'level-up', newLevel: number): void
  (e: 'skill-learned', skill: string): void
}

const props = defineProps<DefaultTrainingPlanProps>()
const emit = defineEmits<DefaultTrainingPlanEmits>()

const IconifyIcon = Icon

// 训练数据
const currentLevel = ref(1)
const experiencePoints = ref(150)
const learnedSkills = ref(['基础对话', '情感识别', '知识检索'])

// 可学技能列表
const availableSkills = ref([
  { name: '多语言支持', icon: 'mdi:translate' },
  { name: '数据分析', icon: 'mdi:chart-bar' },
  { name: '代码生成', icon: 'mdi:code-braces' },
  { name: '创意写作', icon: 'mdi:pen' }
])

// 计算属性
const nextLevelExperience = computed(() => currentLevel.value * 200)
const experienceProgress = computed(() => {
  return Math.min((experiencePoints.value / nextLevelExperience.value) * 100, 100)
})

/**
 * 开始训练
 */
const startTraining = () => {
  // 模拟训练获得经验
  const gainedExp = Math.floor(Math.random() * 50) + 20
  experiencePoints.value += gainedExp
  
  // 检查是否升级
  if (experiencePoints.value >= nextLevelExperience.value) {
    currentLevel.value += 1
    experiencePoints.value = experiencePoints.value - nextLevelExperience.value
    emit('level-up', currentLevel.value)
    showToast(`升级到 ${currentLevel.value} 级！`)
  } else {
    showToast(`训练完成，获得 ${gainedExp} 经验值`)
  }
}

/**
 * 学习技能
 */
const learnSkill = (skillName: string) => {
  if (!learnedSkills.value.includes(skillName)) {
    learnedSkills.value.push(skillName)
    emit('skill-learned', skillName)
    showToast(`学会了新技能：${skillName}`)
  } else {
    showToast('已经学会这个技能了')
  }
}
</script>

<style scoped>
.default-training-plan {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 12px;
}

.training-overview {
  margin-bottom: 20px;
}

.training-stat {
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1989fa;
}

.stat-label {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-label {
  font-size: 14px;
  color: #323233;
  margin-bottom: 8px;
}

.progress-text {
  font-size: 12px;
  color: #969799;
  text-align: center;
  margin-top: 8px;
}

.skills-section, .available-skills-section {
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  margin: 2px;
}

.no-skills {
  text-align: center;
  color: #969799;
  font-size: 14px;
  padding: 20px;
}

.available-skills {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.training-actions {
  text-align: center;
}

.training-btn {
  width: 100%;
  margin-top: 12px;
}

.mr-2 {
  margin-right: 8px;
}
</style>