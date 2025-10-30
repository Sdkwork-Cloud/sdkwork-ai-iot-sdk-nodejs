<template>
  <div class="empty-section">
    <slot name="empty" v-bind="{ empty: true }">
      <VanEmpty description="暂无数据" />
    </slot>
  </div>
</template>

<script setup lang="ts">
// Props 定义
interface Props {
  /** 空状态 */
  empty?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  empty: true
})

defineSlots<{
  /** 空状态插槽 - 接收 empty 参数 */
  empty?: (props: { empty: boolean }) => any
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