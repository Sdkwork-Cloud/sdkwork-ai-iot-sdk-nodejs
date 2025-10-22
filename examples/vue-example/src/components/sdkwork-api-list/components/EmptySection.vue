<template>
  <div class="empty-section">
    <slot name="empty">
      <VanEmpty description="暂无数据" />
    </slot>
  </div>
</template>

<script setup lang="ts">
defineSlots<{
  /** 空状态插槽 */
  empty?: () => any
}>()
</script>

<style scoped lang="scss">
.empty-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}
</style>