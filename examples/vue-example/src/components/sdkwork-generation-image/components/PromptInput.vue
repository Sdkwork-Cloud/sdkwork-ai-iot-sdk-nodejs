<template>
  <div class="prompt-input">
    <div class="input-header">
      <van-icon name="edit" class="header-icon" />
      <span>图片描述</span>
    </div>
    
    <van-field
      v-model="inputValue"
      type="textarea"
      :placeholder="placeholder"
      autosize 
      class="prompt-field"
      @blur="handleBlur"
    />
    
    <div class="input-tips">
      <van-icon name="info" class="tip-icon" />
      <span>详细描述图片内容，越详细效果越好</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = ref(props.modelValue)
const placeholder = ref(props.placeholder || '请输入图片描述...')

// 监听输入值变化
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue
  }
})

const handleBlur = () => {
  // 可以在这里添加输入验证逻辑
}
</script>

<style scoped>
.prompt-input {
  background: var(--bg-card);
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px;
}

.input-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.header-icon {
  margin-right: 8px;
  color: var(--accent-blue);
  font-size: 16px;
}

.prompt-field {
  margin-bottom: 12px;
  padding:0px !important;
}

:deep(.van-field__body) {
  font-size: 16px;
  line-height: 1.5;
}

:deep(.van-field__control) {
  min-height: 120px;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
}

.input-tips {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 12px;
}

.tip-icon {
  margin-right: 4px;
  font-size: 12px;
}
</style>