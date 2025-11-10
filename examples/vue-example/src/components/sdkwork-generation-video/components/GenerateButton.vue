<template>
  <div class="generate-button">
    <van-button 
      :type="buttonType"
      :loading="loading"
      :disabled="disabled"
      :loading-text="loadingText"
      block
      round
      size="large"
      @click="handleClick"
      class="generate-btn"
    >
      <template v-if="!loading">
        <van-icon name="play" class="btn-icon" />
        {{ buttonText }}
        <span v-if="!disabled && pointsCost > 0" class="points-cost">
          消耗 {{ pointsCost }} 积分
        </span>
      </template>
    </van-button>
    
    <!-- 提示信息 -->
    <div v-if="showHint" class="generate-hint">
      <van-icon name="info" class="hint-icon" />
      <span>{{ hintText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  disabled?: boolean
  loading?: boolean
  pointsCost?: number
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  pointsCost: 100
})

const emit = defineEmits<Emits>()

// 按钮类型
const buttonType = computed(() => {
  if (props.disabled) return 'default'
  return 'primary'
})

// 按钮文本
const buttonText = computed(() => {
  if (props.disabled) return '请填写完整信息'
  return '生成视频'
})

// 加载文本
const loadingText = computed(() => {
  return '正在生成视频...'
})

// 是否显示提示
const showHint = computed(() => {
  return props.disabled && !props.loading
})

// 提示文本
const hintText = computed(() => {
  if (props.disabled) {
    return '请填写提示词和必要信息'
  }
  return ''
})

// 点击处理
const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.generate-button {
  position: fixed;
  bottom: 0px;
  left: 16px;
  right: 16px;
  z-index: 1000;
  background: black;
  padding: 16px 0;
  margin: 0 -16px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.generate-btn {
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
}

.generate-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 6px rgba(8, 121, 242, 0.3);
}

.btn-icon {
  margin-right: 8px;
  font-size: 18px;
}

.generate-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(255, 183, 77, 0.1);
  border: 1px solid rgba(255, 183, 77, 0.3);
  border-radius: 6px;
  color: #ffa726;
  font-size: 12px;
}

.hint-icon {
  margin-right: 4px;
  font-size: 14px;
}

.points-cost {
  margin-left: 8px;
  font-size: 12px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #007bff, #00b4ff);
  border-color: #007bff;
}

:deep(.van-button--default) {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

:deep(.van-button--default.van-button--disabled) {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-secondary);
}

:deep(.van-button--primary.van-button--disabled) {
  background-color: rgba(0, 123, 255, 0.5);
  border-color: rgba(0, 123, 255, 0.5);
  color: white;
}

:deep(.van-loading__spinner) {
  color: white;
}
</style>