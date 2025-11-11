<template>
  <div class="sdkwork-segmented">
    <div v-for="(option, index) in options" :key="option.value"
      :class="['segmented-item', { active: modelValue === option.value }]" @click="handleSelect(option.value)">
      {{ option.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Option {
  text: string
  value: string | number | boolean | any
}

interface Props {
  modelValue: string | number | boolean
  options: Option[]
}

interface Emits {
  (e: 'update:modelValue', value: string | number | boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSelect = (value: string | number | boolean) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.sdkwork-segmented {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  overflow: hidden;
}

.segmented-item {
  flex: 1;
  padding: 8px 12px;
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  user-select: none;
}

.segmented-item.active {
  background-color: #ffffff;
  color: #1989fa;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .sdkwork-segmented {
    background-color: #2d3a4e;
  }

  .segmented-item {
    color: #8fa3c4;
  }

  .segmented-item.active {
    background-color: #1e2a3d;
    color: #1989fa;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}
</style>