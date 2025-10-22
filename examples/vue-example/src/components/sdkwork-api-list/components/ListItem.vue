<template>
  <div
    class="list-item"
    :class="{ 
      'selectable-item': selectable, 
      'selected-item': isSelected, 
      'no-border': !showBorderBottom
    }"
    :data-theme="themeMode"
    :style="{ '--border-bottom-left-offset': `${borderBottomLeftOffset}px` }"
    @click="handleItemClick"
  >
    <!-- 默认列表项内容 -->
    <slot :item="item" :index="index" :selected="isSelected">
      <div class="default-item">
        <div class="item-content">
          <div class="item-title">{{ getItemTitle(item) }}</div>
          <div class="item-description">{{ getItemDescription(item) }}</div>
        </div>
        <div class="item-actions">
          <VanButton
            v-if="deletable"
            size="small"
            type="danger"
            @click.stop="handleDelete"
          >
            删除
          </VanButton>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  item: any
  index: number
  selectable: boolean
  deletable: boolean
  isSelected: boolean
  itemKey: string
  itemTitleField: string
  itemDescriptionField: string
  /** 是否显示底部边框 */
  showBorderBottom?: boolean
  /** 底部边框距离左边的偏移量（像素） */
  borderBottomLeftOffset?: number
  /** 主题模式：'dark' | 'light' | 'auto' */
  themeMode?: 'dark' | 'light' | 'auto'
}

interface Emits {
  (e: 'select', item: any): void
  (e: 'delete', item: any): void
}

const props = withDefaults(defineProps<Props>(), {
  showBorderBottom: true,
  borderBottomLeftOffset: 0
})

const emit = defineEmits<Emits>()

// 获取列表项标题
const getItemTitle = (item: any): string => {
  return item[props.itemTitleField] || '未知标题'
}

// 获取列表项描述
const getItemDescription = (item: any): string => {
  return item[props.itemDescriptionField] || '暂无描述'
}

// 项点击处理
const handleItemClick = () => {
  emit('select', props.item)
}

// 删除处理
const handleDelete = () => {
  emit('delete', props.item)
}
</script>

<style scoped lang="scss">
.list-item {
  position: relative;
  transition: background-color 0.2s;
  --border-bottom-left-offset: 0px;

  &:not(.no-border)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: var(--border-bottom-left-offset, 0px);
    right: 0;
    height: 1px;
    background-color: #f5f5f5;
    transform: scaleY(0.5);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  &.selectable-item {
    cursor: pointer;
  }

  &.selected-item {
    background: rgba(0, 123, 255, 0.08); 
  }

  &.no-border::after {
    display: none;
  }

  .default-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 12px;

    .item-content {
      flex: 1;
      margin-right: 8px;

      .item-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .item-description {
        font-size: 14px;
        color: #666;
        line-height: 1.4;
      }
    }

    .item-actions {
      flex-shrink: 0;
    }
  }
}

/* 主题模式支持 */
.list-item[data-theme="dark"] {
  &:not(.no-border)::after {
    background-color: #333;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &.selected-item {
    background: rgba(0, 123, 255, 0.15);
  }

  .default-item {
    .item-content {
      .item-title {
        color: #ffffff;
      }

      .item-description {
        color: #cccccc;
      }
    }
  }
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .list-item[data-theme="auto"] {
    &:not(.no-border)::after {
      background-color: #333;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    &.selected-item {
      background: rgba(0, 123, 255, 0.15);
    }

    .default-item {
      .item-content {
        .item-title {
          color: #ffffff;
        }

        .item-description {
          color: #cccccc;
        }
      }
    }
  }
}

// 响应式设计
@media (min-width: 768px) {
  .list-item {
    .default-item {
      padding: 16px 16px;

      .item-content {
        .item-title {
          font-size: 18px;
        }

        .item-description {
          font-size: 15px;
        }
      }
    }
  }
}
</style>