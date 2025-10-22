# SDKWork Notification List 组件

基于Vue 3、setup语法糖和TypeScript的通用通知消息列表组件，支持Spring Boot分页标准。

## 功能特性

- ✅ 支持Spring Boot Pageable分页标准
- ✅ 下拉刷新和上拉加载更多
- ✅ 搜索功能（300ms防抖）
- ✅ 行选择和删除功能
- ✅ 通知类型标识（信息、成功、警告、错误、系统）
- ✅ 未读状态标识
- ✅ 优先级显示
- ✅ 操作按钮支持
- ✅ 多种插槽自定义
- ✅ 响应式布局设计
- ✅ 完整的TypeScript类型支持

## 安装依赖

确保项目中已安装Vant 4.x：

```bash
npm install vant@^4.9.21
```

## 基础用法

```vue
<template>
  <sdkwork-notification-list
    :api="getNotificationList"
    :params="{ status: 'unread' }"
    selectable
    searchable
    deletable
    @select="handleSelect"
    @delete="handleDelete"
    @read="handleRead"
    @action="handleAction"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 空状态 -->
    <template #empty>
      <van-empty description="暂无通知消息" />
    </template>

    <!-- 加载状态 -->
    <template #loading>
      <van-loading size="24px" vertical>加载通知数据...</van-loading>
    </template>
  </sdkwork-notification-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Notification, NotificationPage, NotificationPageable } from './types'

// API方法
const getNotificationList = async (params: NotificationPageable): Promise<NotificationPage> => {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (notification: Notification) => {
  console.log('选中通知:', notification)
}

const handleDelete = (notification: Notification) => {
  console.log('删除通知:', notification)
}

const handleRead = (notification: Notification) => {
  console.log('标记已读:', notification)
}

const handleAction = (notification: Notification) => {
  console.log('执行操作:', notification)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: NotificationPage) => {
  console.log('数据加载完成:', pageData)
}
</script>
```

## API 接口规范

### 输入参数 (NotificationPageable)

```typescript
interface NotificationPageable extends Pageable {
  filters?: {
    type?: NotificationType        // 通知类型
    status?: NotificationStatus    // 通知状态
    keyword?: string              // 搜索关键词
    category?: string             // 分类筛选
    priority?: string            // 优先级筛选
    unreadOnly?: boolean         // 仅显示未读
    startTime?: string           // 开始时间
    endTime?: string             // 结束时间
  }
}
```

### 输出结果 (NotificationPage)

```typescript
type NotificationPage = Page<Notification>
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | `(params: NotificationPageable) => Promise<NotificationPage>` | - | 必传，API请求方法 |
| params | `NotificationQueryParams` | `{}` | 请求参数对象 |
| selectable | `boolean` | `false` | 是否支持行选择 |
| deletable | `boolean` | `false` | 是否支持行删除 |
| searchable | `boolean` | `false` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示条数 |
| itemKey | `string` | `'id'` | 列表项唯一键字段名 |
| itemTitleField | `string` | `'title'` | 列表项标题字段名 |
| itemDescriptionField | `string` | `'content'` | 列表项描述字段名 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(notification: Notification) => void` | 行选择事件 |
| delete | `(notification: Notification) => void` | 行删除事件 |
| read | `(notification: Notification) => void` | 标记已读事件 |
| action | `(notification: Notification) => void` | 操作按钮点击事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: NotificationPage) => void` | 数据加载完成事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ notification: Notification, index: number }` | 自定义列表项内容 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-notification-list ref="notificationListRef" :api="getNotificationList" />
  <van-button @click="handleRefresh">刷新</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notificationListRef = ref()

const handleRefresh = () => {
  notificationListRef.value.refresh()
}

const getUnreadCount = () => {
  const data = notificationListRef.value.getData()
  const unreadCount = data.filter(item => item.status === 'unread').length
  console.log('未读通知数量:', unreadCount)
}
</script>
```

### 可用方法

- `refresh()`: 刷新数据
- `loadMore()`: 加载更多数据
- `getData()`: 获取当前数据
- `getSelectedItems()`: 获取选中项
- `clearSelected()`: 清空选中项
- `setSelectedItems(items: Notification[])`: 设置选中项

## 通知类型说明

| 类型 | 图标 | 颜色 | 说明 |
|------|------|------|------|
| info | info-o | 蓝色 | 普通信息通知 |
| success | success | 绿色 | 成功操作通知 |
| warning | warning-o | 橙色 | 警告信息通知 |
| error | cross | 红色 | 错误信息通知 |
| system | bell-o | 灰色 | 系统通知 |

## 样式定制

组件使用SCSS编写，支持CSS变量定制：

```css
.sdkwork-notification-list {
  --notification-bg-color: #fff;
  --notification-border-radius: 8px;
  --unread-indicator-color: #ff4d4f;
  --info-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --system-color: #666;
}
```

## 响应式设计

组件自动适配移动端和PC端：
- 移动端：紧凑布局，适合触摸操作
- PC端：宽松布局，更好的可读性

## 注意事项

1. API方法必须返回符合Spring Boot Page结构的Promise
2. 通知点击时会自动触发read事件（仅限未读状态）
3. 操作按钮需要配置actionText和actionUrl属性
4. 优先级标签会自动显示重要/中等标识
5. 确保Vant组件已正确注册或使用自动导入