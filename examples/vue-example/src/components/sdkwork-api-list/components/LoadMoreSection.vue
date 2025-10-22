<template>
  <div v-if="hasMore" ref="loadMoreRef" class="load-more-section">
    <VanLoading v-if="loadingMore" size="24px">加载中...</VanLoading>
    <div v-else class="load-more-tip">上拉加载更多</div>
  </div>
  <div v-else-if="showNoMoreData && dataList.length > 0" class="no-more-section">
    <div class="no-more-tip">没有更多数据了</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasMore: boolean
  loadingMore: boolean
  dataList: any[]
  /** 是否显示"没有更多数据了"的提示 */
  showNoMoreData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNoMoreData: false
})

defineExpose({
  loadMoreRef: ref<HTMLElement>()
})
</script>

<style scoped lang="scss">
.load-more-section,
.no-more-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  color: #999;
  font-size: 14px;
}
</style>