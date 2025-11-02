<template>
  <div class="loading-section">
    <slot :loading="loading">
      <!-- 默认加载状态 -->
      <div class="default-loading">
        <van-loading size="24px" vertical>加载智能体数据...</van-loading>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
// 属性定义
interface Props {
  loading?: boolean
}

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义加载状态内容 */
  default(props: { loading: boolean }): any
}>()

const props = withDefaults(defineProps<Props>(), {
  loading: false
})
</script>

<style scoped lang="scss">
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  min-height: 200px;

  .default-loading {
    text-align: center;
    color: #999;
    
    :deep(.van-loading__text) {
      margin-top: 12px;
      font-size: 14px;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-section {
    padding: 30px 16px;
    min-height: 150px;
  }
}
 
</style>