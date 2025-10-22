# SDKWork Order List 组件

基于Vue 3、setup语法糖和TypeScript的订单列表组件，采用sdkwork-api-tab-list实现，具有极佳的可扩展性和代码质量。

## 功能特性

- ✅ 基于sdkwork-api-tab-list实现，支持Tab切换
- ✅ 完整的订单数据类型定义
- ✅ 自定义订单项组件，高度可定制
- ✅ 支持多种订单状态和操作
- ✅ 响应式设计，适配移动端和PC端
- ✅ 完整的TypeScript类型支持
- ✅ 丰富的插槽系统

## 安装依赖

确保项目中已安装Vant 4.x：

```bash
npm install vant@^4.9.21
```

## 基础用法

```vue
<template>
  <sdkwork-order-list
    :api="getOrderList"
    searchable
    selectable
    @select="handleSelect"
    @action="handleAction"
    @tab-change="handleTabChange"
  >
    <!-- 自定义订单头部 -->
    <template #order-header="{ order }">
      <div class="custom-header">
        <span class="order-no">{{ order.orderNo }}</span>
        <span class="create-time">{{ formatTime(order.createTime) }}</span>
      </div>
    </template>
  </sdkwork-order-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// API方法
const getOrderList = async (params: Pageable): Promise<Page<any>> => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (order: any) => {
  console.log('选中订单:', order.orderNo)
}

const handleAction = (order: any, action: string) => {
  console.log('操作:', action, '订单:', order.orderNo)
}

const handleTabChange = (tab: any, params: Record<string, any>) => {
  console.log('Tab切换:', tab.title, '参数:', params)
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}
</script>
```

## 高级用法

### 自定义操作按钮

```vue
<template>
  <sdkwork-order-list
    :api="getOrderList"
    :action-buttons="customActionButtons"
    @action="handleCustomAction"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { OrderActionButton } from 'sdkwork-order-list'

// 自定义操作按钮
const customActionButtons = ref<OrderActionButton[]>([
  { key: 'view', text: '查看详情', type: 'primary', icon: 'eye-o' },
  { key: 'export', text: '导出订单', type: 'success', icon: 'down' },
  { key: 'print', text: '打印订单', type: 'default', icon: 'printer' },
  { 
    key: 'cancel', 
    text: '取消订单', 
    type: 'warning', 
    icon: 'close',
    showCondition: (order) => order.status === 'pending'
  }
])

const handleCustomAction = (order: any, action: string) => {
  switch (action) {
    case 'view':
      // 查看详情逻辑
      break
    case 'export':
      // 导出逻辑
      break
    case 'print':
      // 打印逻辑
      break
    case 'cancel':
      // 取消逻辑
      break
  }
}
</script>
```

### 自定义Tabs配置

```vue
<template>
  <sdkwork-order-list
    :api="getOrderList"
    :tabs="customTabs"
    :default-active-tab="'today'"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabItem } from 'sdkwork-api-tab-list'

// 自定义Tabs
const customTabs = ref<TabItem[]>([
  { value: 'today', title: '今日订单', params: { date: 'today' } },
  { value: 'week', title: '本周订单', params: { date: 'week' } },
  { value: 'month', title: '本月订单', params: { date: 'month' } },
  { value: 'pending', title: '待处理订单', params: { status: 'pending' } },
  { value: 'urgent', title: '加急订单', params: { priority: 'high' } }
])
</script>
```

## 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | `(params: Pageable) => Promise<Page<Order>>` | - | 必传，API请求方法 |
| params | `Record<string, any>` | `{}` | 请求参数对象 |
| searchable | `boolean` | `true` | 是否支持搜索 |
| selectable | `boolean` | `false` | 是否支持选择 |
| deletable | `boolean` | `false` | 是否支持删除 |
| pageSize | `number` | `10` | 每页显示条数 |
| tabs | `TabItem[]` | `DEFAULT_ORDER_TABS` | 订单Tabs数据 |
| tabsApi | `() => Promise<TabItem[]>` | - | 订单Tabs API方法 |
| defaultActiveTab | `string \| number` | `'all'` | 默认激活的Tab |
| showActions | `boolean` | `true` | 是否显示操作按钮 |
| actionButtons | `OrderActionButton[]` | `DEFAULT_ACTION_BUTTONS` | 自定义操作按钮 |
| statusConfig | `OrderStatusConfig` | `DEFAULT_STATUS_CONFIG` | 订单状态配置 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(order: Order) => void` | 订单选择事件 |
| delete | `(order: Order) => void` | 订单删除事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: Page<Order>) => void` | 数据加载完成事件 |
| tab-change | `(tab: TabItem, params: Record<string, any>) => void` | Tab切换事件 |
| action | `(order: Order, action: string) => void` | 操作按钮点击事件 |
| click | `(order: Order) => void` | 订单项点击事件 |

## 插槽系统

组件提供丰富的插槽系统，支持高度自定义：

### 主要插槽

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ order: Order, index: number, selected: boolean }` | 自定义订单项内容 |
| order-header | `{ order: Order, index: number }` | 订单头部自定义 |
| order-content | `{ order: Order, index: number }` | 订单内容自定义 |
| order-footer | `{ order: Order, index: number }` | 订单底部自定义 |
| order-actions | `{ order: Order, index: number }` | 订单操作自定义 |

### 布局插槽

| 插槽名 | 说明 |
|--------|------|
| header | 列表顶部区域 |
| footer | 列表底部区域 |
| empty | 空状态显示内容 |
| loading | 加载状态显示内容 |
| tab-title | Tab标题自定义内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-order-list ref="orderListRef" :api="getOrderList" />
  <van-button @click="handleRefresh">刷新</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const orderListRef = ref()

const handleRefresh = () => {
  orderListRef.value.refresh()
}

const getSelectedOrders = () => {
  const selected = orderListRef.value.getSelectedItems()
  console.log('选中订单:', selected)
}
</script>
```

### 可用方法

- `refresh()`: 刷新数据
- `loadMore()`: 加载更多数据
- `getData()`: 获取当前数据
- `getSelectedItems()`: 获取选中项
- `clearSelected()`: 清空选中项
- `setSelectedItems(items: Order[])`: 设置选中项
- `getActiveTab()`: 获取当前激活的Tab
- `setActiveTab(tabName: string | number)`: 设置激活的Tab
- `getTabsData()`: 获取Tabs数据

## 样式定制

组件使用SCSS编写，支持CSS变量定制：

```css
.sdkwork-order-list {
  --order-bg-color: #ffffff;
  --order-border-radius: 8px;
  --order-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --order-selected-bg: #f0f8ff;
  
  --status-pending-color: #ff6b35;
  --status-confirmed-color: #1890ff;
  --status-processing-color: #52c41a;
  --status-shipped-color: #722ed1;
  --status-delivered-color: #13c2c2;
}
```

## 最佳实践

### 1. 数据格式规范

确保API返回的数据符合Order接口定义：

```typescript
{
  id: '123',
  orderNo: 'ORD202412150001',
  status: 'pending',
  statusText: '待处理',
  createTime: '2024-12-15T10:30:00Z',
  totalAmount: 299.99,
  customerName: '张三',
  customerPhone: '13800138000',
  shippingAddress: '北京市朝阳区xxx街道xxx号',
  items: [
    {
      id: '1',
      productId: 'P001',
      productName: '智能手机',
      quantity: 1,
      unitPrice: 299.99,
      totalPrice: 299.99
    }
  ]
}
```

### 2. 自定义状态配置

```typescript
const customStatusConfig = {
  pending: { text: '等待处理', color: '#ff9500', icon: 'clock' },
  confirmed: { text: '订单确认', color: '#007aff', icon: 'checkmark' },
  // ... 其他状态配置
}
```

### 3. 条件显示操作按钮

```typescript
const actionButtons = [
  {
    key: 'ship',
    text: '立即发货',
    type: 'primary',
    showCondition: (order) => order.status === 'confirmed' && order.paymentStatus === 'paid'
  }
]
```

## 故障排除

### 数据不显示
- 检查API返回的数据结构是否符合Order接口
- 确认订单状态值在statusConfig中有对应配置
- 查看浏览器控制台错误信息

### 操作按钮不显示
- 检查showConditions条件函数是否正确
- 确认订单数据包含必要的状态字段
- 验证actionButtons数组配置

### Tab切换异常
- 检查Tab的value值是否唯一
- 确认Tab的params参数正确传递
- 验证API是否支持Tab对应的查询参数