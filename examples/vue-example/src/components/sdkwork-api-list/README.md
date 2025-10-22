# SDKWork API List 组件

基于Vue 3、setup语法糖和TypeScript的通用列表查询组件，支持Spring Boot分页标准。

## 功能特性

- ✅ 支持Spring Boot Pageable分页标准
- ✅ 下拉刷新和上拉加载更多
- ✅ 搜索功能（300ms防抖）
- ✅ 行选择和删除功能
- ✅ 多种插槽自定义
- ✅ 响应式布局设计
- ✅ 完整的TypeScript类型支持

## 安装依赖

确保项目中已安装Vant 4.x：

```bash
npm install vant@^4.9.21
npm install lodash-es
```

## 基础用法

```vue
<template>
  <sdkwork-api-list
    :api="getUserList"
    :params="{ status: 'active' }"
    selectable
    searchable
    deletable
    @select="handleSelect"
    @delete="handleDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义列表项 -->
    <template #default="{ item, index }">
      <div class="custom-item">
        <div class="avatar">{{ item.avatar }}</div>
        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="email">{{ item.email }}</div>
        </div>
        <div class="actions">
          <van-button size="small" @click.stop="handleEdit(item)">编辑</van-button>
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <template #empty>
      <van-empty description="暂无用户数据" />
    </template>

    <!-- 加载状态 -->
    <template #loading>
      <van-loading size="24px" vertical>加载用户数据...</van-loading>
    </template>
  </sdkwork-api-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: string
}

// API方法
const getUserList = async (params: Pageable): Promise<Page<User>> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (user: User) => {
  console.log('选中用户:', user)
}

const handleDelete = (user: User) => {
  console.log('删除用户:', user)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: Page<User>) => {
  console.log('数据加载完成:', pageData)
}
</script>

<style scoped>
.custom-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.info {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.email {
  font-size: 14px;
  color: #666;
}

.actions {
  margin-left: 12px;
}
</style>
```

## API 接口规范

### 输入参数 (Pageable)

```typescript
interface Pageable {
  page?: number      // 页码（从0开始）
  size?: number      // 每页条数
  sort?: string[]    // 排序字段 ["field,asc", "field,desc"]
  keyword?: string   // 搜索关键词
  filters?: Record<string, any> // 自定义过滤参数
}
```

### 输出结果 (Page<T>)

```typescript
interface Page<T> {
  content: T[]                    // 数据列表
  empty: boolean                  // 是否为空
  first: boolean                 // 是否第一页
  last: boolean                  // 是否最后一页
  number: number                 // 当前页码
  numberOfElements: number       // 当前页元素数量
  size: number                   // 每页大小
  sort: Sort                     // 排序信息
  totalElements: number          // 总记录数
  totalPages: number             // 总页数
}
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | `(params: Pageable) => Promise<Page<T>>` | - | 必传，API请求方法 |
| params | `Record<string, any>` | `{}` | 请求参数对象 |
| selectable | `boolean` | `false` | 是否支持行选择 |
| deletable | `boolean` | `false` | 是否支持行删除 |
| searchable | `boolean` | `false` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示条数 |
| itemKey | `string` | `'id'` | 列表项唯一键字段名 |
| itemTitleField | `string` | `'name'` | 列表项标题字段名 |
| itemDescriptionField | `string` | `'description'` | 列表项描述字段名 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(item: T) => void` | 行选择事件 |
| delete | `(item: T) => void` | 行删除事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: Page<T>) => void` | 数据加载完成事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ item: T, index: number }` | 自定义列表项内容 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-api-list ref="listRef" :api="getData" />
  <van-button @click="handleRefresh">刷新</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const listRef = ref()

const handleRefresh = () => {
  listRef.value.refresh()
}

const getSelectedItems = () => {
  const selected = listRef.value.getSelectedItems()
  console.log('选中项:', selected)
}
</script>
```

### 可用方法

- `refresh()`: 刷新数据
- `loadMore()`: 加载更多数据
- `getData()`: 获取当前数据
- `getSelectedItems()`: 获取选中项
- `clearSelected()`: 清空选中项
- `setSelectedItems(items: T[])`: 设置选中项

## 样式定制

组件使用SCSS编写，支持CSS变量定制：

```css
.sdkwork-api-list {
  --list-bg-color: #fff;
  --item-border-color: #f0f0f0;
  --selected-bg-color: #e6f7ff;
  --primary-color: #1890ff;
}
```

## 响应式设计

组件自动适配移动端和PC端：
- 移动端：紧凑布局，适合触摸操作
- PC端：宽松布局，更好的可读性

## 注意事项

1. API方法必须返回符合Spring Boot Page结构的Promise
2. 搜索功能默认使用300ms防抖，避免频繁请求
3. 上拉加载基于IntersectionObserver，确保浏览器兼容性
4. 组件会自动处理分页逻辑，无需手动管理页码
5. 确保Vant组件已正确注册或使用自动导入

## 故障排除

### 数据不显示
- 检查API方法是否正确返回Page结构
- 确认网络请求是否成功
- 查看浏览器控制台错误信息

### 搜索不生效
- 确认searchable属性设置为true
- 检查API是否支持keyword参数
- 验证防抖函数是否正常工作

### 分页异常
- 确认pageSize设置合理
- 检查API返回的totalPages和number字段
- 验证hasMore逻辑是否正确