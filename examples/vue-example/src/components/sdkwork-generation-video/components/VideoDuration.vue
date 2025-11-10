<template>
  <div class="video-duration">
    <div class="duration-header">
      <h4>视频时长</h4>
      <span class="duration-value">{{ duration }}秒</span>
    </div>
    
    <!-- 时长滑块 -->
    <div class="duration-slider">
      <van-slider 
        v-model="duration" 
        :min="minDuration" 
        :max="maxDuration" 
        :step="step"
        bar-height="4px"
        :active-color="accentBlue"
        @change="onDurationChange"
      />
      
      <!-- 刻度标记 -->
      <div class="duration-marks">
        <span v-for="mark in durationMarks" :key="mark" class="mark">
          {{ mark }}s
        </span>
      </div>
    </div>
    
    <!-- 快速选择 -->
    <div class="quick-selection">
      <h5>快速选择</h5>
      <div class="quick-buttons">
        <van-button 
          v-for="option in quickOptions" 
          :key="option.value"
          :type="duration === option.value ? 'primary' : 'default'"
          size="small"
          @click="setDuration(option.value)"
          class="quick-btn"
        >
          {{ option.label }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  modelValue: number
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

interface QuickOption {
  value: number
  label: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 时长配置
const minDuration = 3
const maxDuration = 30
const step = 1
const duration = ref(props.modelValue)

// 滑块颜色
const accentBlue = '#007bff' 

// 快速选择选项
const quickOptions: QuickOption[] = [
  { value: 5, label: '5秒' },
  { value: 10, label: '10秒' },
  { value: 15, label: '15秒' },
  { value: 20, label: '20秒' },
  { value: 25, label: '25秒' }
]

// 刻度标记
const durationMarks = computed(() => {
  const marks = []
  for (let i = minDuration; i <= maxDuration; i += 5) {
    marks.push(i)
  }
  return marks
})

// 设置时长
const setDuration = (value: number) => {
  duration.value = value
  emit('update:modelValue', value)
}

// 时长变化回调
const onDurationChange = (value: number) => {
  emit('update:modelValue', value)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  duration.value = newValue
})
</script>

<style scoped>
.video-duration {
  background: var(--bg-card);
  border-radius: 8px; 
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.duration-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.duration-header h4 {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.duration-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent-blue);
}

.duration-slider {
  margin-bottom: 24px;
}

.duration-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.mark {
  font-size: 11px;
  color: #cbd5e0;
  font-weight: 500;
  transform: translateX(-50%);
}

.quick-selection h5 {
  margin: 0 0 12px 0;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-btn {
  flex: 1;
  min-width: 60px;
}

:deep(.van-slider) {
  background: #4a5568;
}

:deep(.van-slider__bar) {
  background: linear-gradient(90deg, #007bff, #00b4ff);
}

:deep(.van-slider__button) {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #007bff, #00b4ff);
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.5);
}

:deep(.van-slider__button::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
}

:deep(.van-slider__button-wrapper) {
  z-index: 1;
}

:deep(.van-button--default) {
  background: var(--bg-secondary);
  color: #ffffff;
  border-color: var(--border-color);
  font-weight: 500;
}

:deep(.van-button--primary) {
  background: var(--accent-blue);
  border-color: var(--accent-blue);
}
</style>