<template>
  <div class="music-header">
    <!-- 模型选择器 -->
    <div class="model-selector">
      <van-field
        readonly
        clickable
        :value="selectedModelName"
        placeholder="选择音乐生成模型"
        @click="showModelPicker = true"
        class="model-field"
      >
        <template #right-icon>
          <van-icon name="arrow-down" />
        </template>
      </van-field>
    </div>
    
    <!-- 历史记录按钮和弹窗 -->
    <van-button 
      type="default" 
      size="small" 
      @click="$emit('showHistory')"
      class="history-btn"
    >
      <van-icon name="clock-o" />
      生成历史
    </van-button>
    
    <!-- 模型选择器弹窗 -->
    <van-popup v-model:show="showModelPicker" position="bottom">
      <van-picker
        :columns="modelOptions"
        @confirm="onModelConfirm"
        @cancel="showModelPicker = false"
        :default-index="defaultModelIndex"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MusicHistoryPanel from './MusicHistoryPanel.vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'showHistory'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showModelPicker = ref(false)
const showHistoryPopup = ref(false)

// 模型选项
const modelOptions = [
  { text: '基础音乐模型 (music-gen-v1)', value: 'music-gen-v1' },
  { text: '流行音乐模型 (pop-music-v2)', value: 'pop-music-v2' },
  { text: '古典音乐模型 (classical-v1)', value: 'classical-v1' },
  { text: '电子音乐模型 (electronic-v1)', value: 'electronic-v1' },
  { text: '民谣音乐模型 (folk-music-v1)', value: 'folk-music-v1' }
]

// 当前选中的模型名称
const selectedModelName = computed(() => {
  const model = modelOptions.find(m => m.value === props.modelValue)
  return model ? model.text : '选择音乐生成模型'
})

// 默认模型索引
const defaultModelIndex = computed(() => {
  return modelOptions.findIndex(m => m.value === props.modelValue)
})

// 确认选择模型
const onModelConfirm = (value: any) => {
  emit('update:modelValue', value.value)
  showModelPicker.value = false
}
</script>

<style scoped>
.music-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 12px 0;
  background: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.model-selector {
  flex: 1;
  margin-right: 12px;
}

.model-field {
  background: transparent;
  border: none;
}

:deep(.model-field .van-field__body) {
  padding: 0;
}

:deep(.model-field .van-field__control) {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.history-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
}

.history-btn .van-icon {
  margin-right: 4px;
  font-size: 14px;
}

:deep(.van-picker) {
  background: var(--bg-card);
}

:deep(.van-picker__toolbar) {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

:deep(.van-picker__confirm) {
  color: var(--accent-blue);
}

:deep(.van-picker__cancel) {
  color: var(--text-secondary);
}

:deep(.van-picker-column__item) {
  color: var(--text-primary);
}

:deep(.van-picker-column__item--selected) {
  color: var(--accent-blue);
}
</style>