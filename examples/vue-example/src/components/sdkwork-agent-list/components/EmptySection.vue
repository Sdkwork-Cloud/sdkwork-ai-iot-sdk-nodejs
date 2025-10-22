<template>
  <div class="empty-section">
    <slot :empty="empty">
      <!-- 默认空状态 -->
      <van-empty description="暂无智能体数据" image="search">
        <template #description>
          <div class="empty-description">
            <p>暂时没有找到智能体</p>
            <p class="empty-tip">您可以尝试调整搜索条件或创建新的智能体</p>
          </div>
        </template>
        <van-button round type="primary" class="empty-button" @click="handleCreate">
          创建智能体
        </van-button>
      </van-empty>
    </slot>
  </div>
</template>

<script setup lang="ts">
// 属性定义
interface Props {
  empty?: boolean
}

// 事件定义
interface Emits {
  (e: 'create'): void
}

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义空状态内容 */
  default(props: { empty: boolean }): any
}>()

const props = withDefaults(defineProps<Props>(), {
  empty: true
})

const emit = defineEmits<Emits>()

// 创建智能体处理
const handleCreate = () => {
  emit('create')
}
</script>

<style scoped lang="scss">
.empty-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  min-height: 300px;

  .empty-description {
    text-align: center;
    
    p {
      margin: 4px 0;
      color: #969799;
      font-size: 14px;
    }
    
    .empty-tip {
      font-size: 12px;
      color: #c8c9cc;
    }
  }

  .empty-button {
    margin-top: 16px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .empty-section {
    padding: 40px 16px;
    min-height: 200px;
  }
}

@media (min-width: 1024px) {
  .empty-section {
    padding: 80px 24px;
    min-height: 400px;
  }
}
</style>