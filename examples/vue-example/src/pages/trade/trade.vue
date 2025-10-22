<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <div class="trade-tabs">
      <sdkwork-tabs v-model:active="activeTab">
        <sdkwork-tab title="交易记录">
          <div class="trade-list">
            <van-empty v-if="tradeList.length === 0" description="暂无交易记录" />
            <sdkwork-cell-group v-else>
              <sdkwork-cell
                v-for="trade in tradeList"
                :key="trade.id"
                :title="trade.productName"
                :value="`¥${trade.amount}`"
                :label="trade.createTime"
              />
            </sdkwork-cell-group>
          </div>
        </sdkwork-tab>
        <sdkwork-tab title="订单管理">
          <div class="order-list">
            <van-empty v-if="orderList.length === 0" description="暂无订单" />
            <sdkwork-cell-group v-else>
              <sdkwork-cell
                v-for="order in orderList"
                :key="order.id"
                :title="order.orderNo"
                :value="order.status"
                :label="order.createTime"
              />
            </sdkwork-cell-group>
          </div>
        </sdkwork-tab>
      </sdkwork-tabs>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePage({
    meta: {
        title: '交易中心'
    }
})

const activeTab = ref(0)

const tradeList = ref([
  {
    id: '1',
    productName: 'AIoT设备套餐',
    amount: 2999,
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    productName: '云服务订阅',
    amount: 199,
    createTime: '2024-01-14 14:20:00'
  }
])

const orderList = ref([
  {
    id: '1',
    orderNo: 'ORDER20240115001',
    status: '已完成',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    orderNo: 'ORDER20240114001',
    status: '处理中',
    createTime: '2024-01-14 14:20:00'
  }
])
</script>

<style scoped lang="scss">
.trade-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
  
  .trade-tabs {
    margin-top: 10px;
  }
  
  .trade-list,
  .order-list {
    padding: 10px;
  }
}
</style>

<route>
{
  meta: {
    layout: 'default',
    title: '交易中心'
  }
}
</route>