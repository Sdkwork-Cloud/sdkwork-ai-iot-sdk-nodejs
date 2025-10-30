<template>
  <div class="loading-section">
    <slot name="loading" v-bind="{ loading: true }">
      <VanLoading size="24px" vertical>加载中...</VanLoading>
    </slot>
  </div>
</template>

<script setup lang="ts">
// Props 定义
interface Props {
  /** 加载状态 */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: true
})

defineSlots<{
  /** 加载状态插槽 - 接收 loading 参数 */
  loading?: (props: { loading: boolean }) => any
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