<template>
  <div class="dubbing-header">
    <div class="header-content">
      <div class="header-title">
        <h2>视频口播生成器</h2>
        <p class="header-subtitle">AI驱动的高质量口播视频制作</p>
      </div>
      
      <div class="header-actions">
        <van-button 
          type="default" 
          size="small" 
          class="help-btn"
          @click="showHelp"
        >
          <van-icon name="question-o" />
          帮助
        </van-button>
      </div>
    </div>
    
    <!-- 进度指示器 -->
    <div class="progress-indicator">
      <div 
        v-for="step in steps" 
        :key="step.id"
        :class="['step', { active: currentStep >= step.id }]"
      >
        <div class="step-icon">{{ step.icon }}</div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'showHelp'): void
}

const emit = defineEmits<Emits>()

const currentStep = ref(1)

const steps = [
  { id: 1, icon: '👤', label: '角色选择' },
  { id: 2, icon: '🎤', label: '声音配置' },
  { id: 3, icon: '📝', label: '文字编辑' },
  { id: 4, icon: '🎬', label: '场景风格' },
  { id: 5, icon: '⚙️', label: '视频配置' }
]

const showHelp = () => {
  emit('showHelp')
}
</script>

<style scoped>
.dubbing-header {
  background: var(--gradient-secondary);
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-glow);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-title h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
}

.header-subtitle {
  margin: 4px 0 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.help-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
}

.help-btn .van-icon {
  margin-right: 4px;
  font-size: 14px;
}

.progress-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: var(--border-color);
  z-index: 1;
}

.step.active:not(:last-child)::after {
  background: var(--accent-blue);
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 4px;
  z-index: 2;
  transition: all 0.3s ease;
}

.step.active .step-icon {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: white;
  box-shadow: 0 0 10px rgba(24, 144, 255, 0.5);
}

.step-label {
  font-size: 10px;
  color: var(--text-secondary);
  text-align: center;
  transition: color 0.3s ease;
}

.step.active .step-label {
  color: var(--accent-blue);
  font-weight: 500;
}
</style>