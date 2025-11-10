<template>
  <div class="prompt-input">
    <div class="input-header">
      <h4>提示词</h4>
      <div class="char-count">{{ charCount }}/{{ maxLength }}</div>
    </div>
    
    <van-field
      v-model="inputValue"
      type="textarea"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :rows="4"
      autosize
      show-word-limit
      class="prompt-field"
    />
    
    <!-- 提示词建议 -->
    <div class="prompt-suggestions" v-if="suggestions.length > 0">
      <h5>提示词建议</h5>
      <div class="suggestion-list">
        <van-tag 
          v-for="suggestion in suggestions" 
          :key="suggestion"
          type="primary" 
          size="medium"
          @click="applySuggestion(suggestion)"
          class="suggestion-tag"
        >
          {{ suggestion }}
        </van-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入视频描述...'
})
const emit = defineEmits<Emits>()

const maxLength = 500
const inputValue = ref(props.modelValue)

// 提示词建议
const suggestions = ref([
  '一只可爱的小猫在草地上玩耍',
  '美丽的日落海滩风景',
  '城市夜景，灯光璀璨',
  '宇航员在太空漫步',
  '绚丽的烟花表演'
])

// 字符计数
const charCount = computed(() => inputValue.value.length)

// 应用建议
const applySuggestion = (suggestion: string) => {
  if (inputValue.value) {
    inputValue.value += ', ' + suggestion
  } else {
    inputValue.value = suggestion
  }
}

// 监听输入变化
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})
</script>

<style scoped>
.prompt-input {
  background: var(--bg-card);
  border-radius: 8px; 
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.input-header h4 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.char-count {
  color: #999;
  font-size: 12px;
}

.prompt-field {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.prompt-suggestions {
  margin-top: 16px;
}

.prompt-suggestions h5 {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-tag:hover {
  background-color: #1989fa;
  color: white;
}

:deep(.van-field__word-limit) {
  color: #999;
}

:deep(.van-field__body) {
  min-height: 80px;
}

:deep(.van-field__control) {
  font-size: 14px;
  line-height: 1.5;
}
</style>