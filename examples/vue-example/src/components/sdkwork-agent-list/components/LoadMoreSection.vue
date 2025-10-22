<template>
  <div class="load-more-section" ref="loadMoreRef">
    <slot :has-more="hasMore" :loading-more="loadingMore" :data-list="dataList">
      <!-- 默认加载更多状态 -->
      <div v-if="hasMore && loadingMore" class="loading-more">
        <van-loading size="20px">加载更多智能体...</van-loading>
      </div>
      <div v-else-if="hasMore && !loadingMore" class="load-more-tip">
        <span>上拉加载更多</span>
      </div>
      <div v-else-if="dataList.length > 0" class="no-more-data">
        <span>没有更多智能体了</span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 属性定义
interface Props {
  hasMore?: boolean
  loadingMore?: boolean
  dataList?: any[]
}

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义加载更多内容 */
  default(props: { hasMore: boolean; loadingMore: boolean; dataList: any[] }): any
}>()

const props = withDefaults(defineProps<Props>(), {
  hasMore: false,
  loadingMore: false,
  dataList: () => []
})

// DOM引用
const loadMoreRef = ref<HTMLElement>()

// 暴露给父组件的方法
defineExpose({
  /** 获取DOM元素 */
  $el: loadMoreRef
})
</script>

<style scoped lang="scss">
.load-more-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #969799;
  font-size: 14px;

  .loading-more {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .load-more-tip {
    text-align: center;
    color: #c8c9cc;
  }

  .no-more-data {
    text-align: center;
    color: #dcdee0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .load-more-section {
    padding: 16px;
    font-size: 13px;
  }
}

@media (min-width: 1024px) {
  .load-more-section {
    padding: 24px;
    font-size: 15px;
  }
}
</style>