<template>
  <sdkwork-api-tab-list
    ref="tabListRef"
    :api="api"
    :tabs="orderTabs"
    :tabs-api="tabsApi"
    :params="mergedParams"
    :searchable="searchable"
    :selectable="selectable"
    :deletable="deletable"
    :page-size="pageSize"
    :default-active-tab="defaultActiveTab"
    @tab-change="handleTabChange"
    @select="handleSelect"
    @delete="handleDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义订单项 -->
    <template #default="{ item, index, selected }">
      <order-list-item
        :order="item"
        :index="index"
        :selected="selected"
        :selectable="selectable"
        :deletable="deletable"
        :show-actions="showActions"
        :action-buttons="actionButtons"
        @select="handleItemSelect"
        @delete="handleItemDelete"
        @action="handleItemAction"
        @click="handleItemClick"
      >
        <!-- 传递插槽 -->
        <template v-if="$slots['order-header']" #header>
          <slot name="order-header" :order="item" :index="index" />
        </template>
        
        <template v-if="$slots['order-content']" #content>
          <slot name="order-content" :order="item" :index="index" />
        </template>
        
        <template v-if="$slots['order-footer']" #footer>
          <slot name="order-footer" :order="item" :index="index" />
        </template>
        
        <template v-if="$slots['order-actions']" #actions>
          <slot name="order-actions" :order="item" :index="index" />
        </template>
      </order-list-item>
    </template>

    <!-- 传递其他插槽 -->
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>

    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>

    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>

    <template v-if="$slots['tab-title']" #tab-title>
      <slot name="tab-title"/>
    </template>
  </sdkwork-api-tab-list>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { TabItem } from '../sdkwork-api-tab-list/types'

// 组件导入
import SdkworkApiTabList from '../sdkwork-api-tab-list/sdkwork-api-tab-list.vue'
import OrderListItem from './components/order-list-item.vue'



// 从types.ts导入类型定义和默认配置
import type { Order, OrderItem, PaymentStatus, ShippingStatus, OrderActionButton, OrderStatusConfig } from './types'
import { OrderStatus, DEFAULT_STATUS_CONFIG, DEFAULT_ACTION_BUTTONS, DEFAULT_ORDER_TABS } from './types'

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<Order>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持搜索 */
  searchable?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 订单Tabs数据 */
  tabs?: TabItem[]
  /** 订单Tabs API方法 */
  tabsApi?: () => Promise<TabItem[]>
  /** 默认激活的Tab */
  defaultActiveTab?: string | number
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 自定义操作按钮 */
  actionButtons?: OrderActionButton[]
  /** 订单状态配置 */
  statusConfig?: OrderStatusConfig
}



// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  searchable: true,
  selectable: false,
  deletable: false,
  pageSize: 10,
  tabs: () => DEFAULT_ORDER_TABS,
  defaultActiveTab: 'all',
  showActions: true,
  actionButtons: () => DEFAULT_ACTION_BUTTONS,
  statusConfig: () => DEFAULT_STATUS_CONFIG
})

// 事件定义
interface Emits {
  (e: 'select', order: Order): void
  (e: 'delete', order: Order): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<Order>): void
  (e: 'tab-change', tab: TabItem, params: Record<string, any>): void
  (e: 'action', order: Order, action: string): void
  (e: 'click', order: Order): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义订单项内容 */
  default?: (props: { order: Order; index: number; selected: boolean }) => any
  /** 头部插槽 */
  header?: () => any
  /** 底部插槽 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
  /** Tab标题自定义插槽 */
  'tab-title'?: () => any
  /** 订单头部自定义插槽 */
  'order-header'?: (props: { order: Order; index: number }) => any
  /** 订单内容自定义插槽 */
  'order-content'?: (props: { order: Order; index: number }) => any
  /** 订单底部自定义插槽 */
  'order-footer'?: (props: { order: Order; index: number }) => any
  /** 订单操作自定义插槽 */
  'order-actions'?: (props: { order: Order; index: number }) => any
}>()

// 响应式数据
const tabListRef = ref<InstanceType<typeof SdkworkApiTabList>>()

// 默认订单Tabs
const defaultOrderTabs = ref<TabItem[]>([
  { value: 'all', title: '全部订单', params: { status: '' } },
  { value: OrderStatus.PENDING, title: '待处理', params: { status: OrderStatus.PENDING } },
  { value: OrderStatus.CONFIRMED, title: '已确认', params: { status: OrderStatus.CONFIRMED } },
  { value: OrderStatus.PROCESSING, title: '处理中', params: { status: OrderStatus.PROCESSING } },
  { value: OrderStatus.SHIPPED, title: '已发货', params: { status: OrderStatus.SHIPPED } },
  { value: OrderStatus.DELIVERED, title: '已完成', params: { status: OrderStatus.DELIVERED } }
])

// 计算属性
const orderTabs = computed(() => {
  return props.tabs.length > 0 ? props.tabs : defaultOrderTabs.value
})

const mergedParams = computed(() => {
  return {
    ...props.params
  }
})

// 事件处理函数
const handleTabChange = (tab: TabItem, params: Record<string, any>) => {
  emit('tab-change', tab, params)
}

const handleSelect = (order: Order) => {
  emit('select', order)
}

const handleDelete = (order: Order) => {
  emit('delete', order)
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: Page<Order>) => {
  emit('load', pageData)
}

const handleItemSelect = (order: Order) => {
  emit('select', order)
}

const handleItemDelete = (order: Order) => {
  emit('delete', order)
}

const handleItemAction = (order: Order, action: string) => {
  emit('action', order, action)
}

const handleItemClick = (order: Order) => {
  emit('click', order)
}

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => tabListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => tabListRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => tabListRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => tabListRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => tabListRef.value?.clearSelected(),
  /** 设置选中项 */
  setSelectedItems: (items: Order[]) => tabListRef.value?.setSelectedItems(items),
  /** 获取当前激活的Tab */
  getActiveTab: () => tabListRef.value?.getActiveTab(),
  /** 设置激活的Tab */
  setActiveTab: (tabName: string | number) => tabListRef.value?.setActiveTab(tabName),
  /** 获取Tabs数据 */
  getTabsData: () => tabListRef.value?.getTabsData() || []
})
</script>

<style scoped lang="scss">
.sdkwork-order-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>