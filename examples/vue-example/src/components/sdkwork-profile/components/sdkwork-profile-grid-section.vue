<template>
  <sdkwork-section :bordered="true" :round="true" contentPadding="0px" class="profile-grid-section">
    <sdkwork-grid :columns="4" :gutter="3" :bordered="false" :clickable="true" align="center" square>
      <sdkwork-grid-item
        v-for="item in gridItems"
        :key="item.id"
        :text="item.text"
        :icon="item.icon" 
        :badge="item.badge"
        @click="handleGridItemClick(item)"
      />
    </sdkwork-grid>
  </sdkwork-section>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { showToast } from 'vant'

// 定义props
interface GridItem {
  id: number
  text: string
  icon: string
  badge?: string
  route?: string
}

interface Props {
  items?: GridItem[]
}

const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

// 定义emits
const emit = defineEmits<{
  itemClick: [item: GridItem]
}>()

// 网格项配置
const gridItems = ref<GridItem[]>([
  { id: 1, text: '订单', icon: 'mdi:shopping', badge: '5', route: '/trade/order/list' },
  { id: 2, text: '账户', icon: 'mdi:account-balance-wallet', badge: '', route: '/account/wallet' },
  { id: 3, text: '收藏', icon: 'mdi:heart', badge: '12', route: '/user/favorites' },
  { id: 4, text: '浏览记录', icon: 'mdi:history', badge: '', route: '/user/history' },
  { id: 5, text: '预约', icon: 'mdi:calendar-clock', badge: '', route: '/appointment/list' }
])

// 如果传入了自定义items，则使用自定义items
if (props.items && props.items.length > 0) {
  gridItems.value = props.items
}

// 处理网格项点击
const handleGridItemClick = (item: GridItem) => {
  showToast(`点击了：${item.text}`)
  
  // 触发itemClick事件
  emit('itemClick', item)
}

// 暴露方法给父组件
defineExpose({
  refreshGridItems: (newItems: GridItem[]) => {
    gridItems.value = newItems
  }
})
</script>

<style scoped lang="scss">
.profile-grid-section {
  margin: 16px 0;
}
</style>