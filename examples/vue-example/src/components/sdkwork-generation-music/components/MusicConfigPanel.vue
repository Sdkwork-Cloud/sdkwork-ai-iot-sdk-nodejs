<template>
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    round
    :style="{ height: '70%' }"
  >
    <div class="config-panel">
      <!-- 面板头部 -->
      <div class="panel-header">
        <h3>音乐配置</h3>
        <van-button 
          type="primary" 
          size="small" 
          @click="closePanel"
          class="close-btn"
        >
          完成
        </van-button>
      </div>
      
      <!-- 配置内容 -->
      <div class="config-content">
        <!-- 音乐风格选择 -->
        <div class="config-section">
          <h4>音乐风格</h4>
          <div class="option-grid">
            <van-button 
              v-for="style in styleOptions" 
              :key="style.value"
              :type="config.style === style.value ? 'primary' : 'default'"
              size="small"
              @click="updateConfig('style', style.value)"
              class="option-btn"
            >
              {{ style.label }}
            </van-button>
          </div>
        </div>
        
        <!-- 情绪选择 -->
        <div class="config-section">
          <h4>情绪</h4>
          <div class="option-grid">
            <van-button 
              v-for="emotion in emotionOptions" 
              :key="emotion.value"
              :type="config.emotion === emotion.value ? 'primary' : 'default'"
              size="small"
              @click="updateConfig('emotion', emotion.value)"
              class="option-btn"
            >
              {{ emotion.label }}
            </van-button>
          </div>
        </div>
        
        <!-- 场景选择 -->
        <div class="config-section">
          <h4>场景</h4>
          <div class="option-grid">
            <van-button 
              v-for="scene in sceneOptions" 
              :key="scene.value"
              :type="config.scene === scene.value ? 'primary' : 'default'"
              size="small"
              @click="updateConfig('scene', scene.value)"
              class="option-btn"
            >
              {{ scene.label }}
            </van-button>
          </div>
        </div>
         
      </div>
      
      <!-- 底部操作 -->
      <div class="panel-footer">
        <van-button 
          type="default" 
          size="large" 
          @click="resetConfig"
          class="reset-btn"
        >
          重置配置
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Config {
  style: string
  emotion: string
  scene: string
  bpm?: string
  duration?: string
}

interface Props {
  modelValue: Config
  show: boolean
}

interface Emits {
  (e: 'update:modelValue', value: Config): void
  (e: 'update:show', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 使用计算属性替代双向监听
const showPopup = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

// 使用本地ref管理配置状态
const config = ref<Config>({
  style: '',
  emotion: '',
  scene: '',
  bpm: '',
  duration: ''
})

// 监听外部变化更新本地状态
watch(() => props.modelValue, (newValue) => {
  config.value = { ...newValue }
}, { immediate: true, deep: true })

// 监听本地变化并触发事件
watch(config, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

// 风格选项
const styleOptions = [
  { label: '流行', value: 'pop' },
  { label: '摇滚', value: 'rock' },
  { label: '电子', value: 'electronic' },
  { label: '古典', value: 'classical' },
  { label: '民谣', value: 'folk' },
  { label: '爵士', value: 'jazz' },
  { label: '嘻哈', value: 'hiphop' },
  { label: 'R&B', value: 'r&b' }
]

// 情绪选项
const emotionOptions = [
  { label: '快乐', value: 'happy' },
  { label: '悲伤', value: 'sad' },
  { label: '平静', value: 'calm' },
  { label: '激动', value: 'excited' },
  { label: '浪漫', value: 'romantic' },
  { label: '神秘', value: 'mysterious' },
  { label: '紧张', value: 'tense' },
  { label: '放松', value: 'relaxed' }
]

// 场景选项
const sceneOptions = [
  { label: '背景音乐', value: 'background' },
  { label: '舞蹈音乐', value: 'dance' },
  { label: '学习音乐', value: 'study' },
  { label: '工作音乐', value: 'work' },
  { label: '运动音乐', value: 'exercise' },
  { label: '睡眠音乐', value: 'sleep' },
  { label: '冥想音乐', value: 'meditation' },
  { label: '派对音乐', value: 'party' }
]

// 关闭面板
const closePanel = () => {
  showPopup.value = false
}

// 更新配置方法
const updateConfig = (key: keyof Config, value: string) => {
  config.value = {
    ...config.value,
    [key]: value
  }
}

// 重置配置
const resetConfig = () => {
  const newConfig = {
    style: '',
    emotion: '',
    scene: '',
    bpm: '',
    duration: ''
  }
  config.value = newConfig
}
</script>

<style scoped>
.config-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
}

.panel-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: white;
}

.config-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

.config-section h4 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.option-btn {
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

:deep(.option-btn.van-button--default) {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.option-btn.van-button--primary) {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
  color: white;
}

.advanced-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.bpm-field .van-field__label),
:deep(.duration-field .van-field__label) {
  color: var(--text-primary);
  font-size: 14px;
}

:deep(.bpm-field .van-field__control),
:deep(.duration-field .van-field__control) {
  color: var(--text-primary);
}

.panel-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
}

.reset-btn {
  width: 100%;
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

:deep(.van-field) {
  background: var(--bg-card);
  border-radius: 6px;
}

:deep(.van-field__body) {
  background: var(--bg-card);
}

:deep(.van-field__control) {
  color: var(--text-primary);
}
</style>