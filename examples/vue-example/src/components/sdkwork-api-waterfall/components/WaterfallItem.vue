<template>
  <div
    class="waterfall-item"
    :class="{
      'waterfall-item--selected': isSelected,
      'waterfall-item--selectable': selectable,
      'waterfall-item--deletable': deletable
    }"
    @click="handleClick"
  >
    <!-- 选择框 -->
    <div v-if="selectable" class="selection-overlay">
      <van-checkbox 
        :model-value="isSelected" 
        @update:model-value="handleSelectionChange"
        @click.stop
        class="selection-checkbox"
      />
    </div>

    <!-- 删除按钮 -->
    <div v-if="deletable" class="delete-overlay">
      <van-button
        type="danger"
        
        round
        @click.stop="handleDelete"
        class="delete-button"
      >
        <van-icon name="delete" size="14" />
      </van-button>
    </div>

    <!-- 瀑布流项内容 -->
    <div class="waterfall-item-content">
      <slot :item="item" :index="index" :selected="isSelected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 属性定义
interface Props {
  item: any
  index: number
  selectable?: boolean
  deletable?: boolean
  isSelected?: boolean
  itemKey?: string
  itemTitleField?: string
  itemDescriptionField?: string
}

// 事件定义
interface Emits {
  (e: 'select', item: any): void
  (e: 'delete', item: any): void
  (e: 'click', item: any): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  isSelected: false,
  itemKey: 'id',
  itemTitleField: 'name',
  itemDescriptionField: 'description'
})

const emit = defineEmits<Emits>()

// 事件处理
const handleSelectionChange = (selected: boolean) => {
  if (props.selectable) {
    emit('select', props.item)
  }
}

const handleClick = () => {
  if (props.selectable) {
    handleSelectionChange(!isSelected.value)
  } else {
    emit('click', props.item)
  }
}

const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.item)
  }
}

// 计算属性
const isSelected = computed(() => props.isSelected)

// 获取项标题
const itemTitle = computed(() => {
  return props.item[props.itemTitleField] || ''
})

// 获取项描述
const itemDescription = computed(() => {
  return props.item[props.itemDescriptionField] || ''
})
</script>

<style scoped lang="scss">
.waterfall-item {
  position: relative; 
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
  break-inside: avoid;
  margin-bottom: 6px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &--selected {
    border-color: var(--van-primary-color);
    background: rgba(var(--van-primary-color-rgb), 0.05);
  }

  &--selectable {
    cursor: pointer;
  }

  &--deletable {
    cursor: pointer;
  }
}

.selection-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}

.selection-checkbox {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 4px;
}

.delete-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.delete-button {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ff4d4f;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
  min-width: 24px;
  height: 24px;
  padding: 0;
  
  &:hover {
    background: #ff4d4f;
    color: white;
    transform: scale(1.1);
  }
  
  .van-icon {
    margin: 0;
  }
}

.waterfall-item-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .waterfall-item {
    border-radius: 6px;
    margin-bottom: 1px;
  }

  .selection-overlay {
    top: 6px;
    left: 6px;
  }

  .delete-overlay {
    top: 6px;
    right: 6px;
  }
}

@media (min-width: 1024px) {
  .waterfall-item {
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .selection-overlay {
    top: 10px;
    left: 10px;
  }

  .delete-overlay {
    top: 10px;
    right: 10px;
  }
}
</style>