<template>
  <div class="loading-section">
    <slot name="loading">
      <VanLoading size="24px" vertical>加载中...</VanLoading>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineSlots<{
  /** 加载状态插槽 */
  loading?: () => any
}>()
</script>

<style scoped lang="scss">
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}
</style>