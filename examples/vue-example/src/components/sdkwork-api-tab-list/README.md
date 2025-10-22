# SDKWork API Tab List 组件

基于Vue 3、setup语法糖和TypeScript的带Tab切换的通用列表查询组件，支持Spring Boot分页标准。

## 功能特性

- ✅ 支持顶部Tabs切换
- ✅ 支持传入Tabs数据或Tabs API动态加载
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

### 使用静态Tabs数据

```vue
<template>
  <sdkwork-api-tab-list
    :api="getUserList"
    :tabs="tabsData"
    :default-active-tab="'all'"
    searchable
    @tab-change="handleTabChange"
    @select="handleSelect"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义列表项 -->
    <template #default="{ item, index }">
      <div class="user-item">
        <div class="avatar">{{ item.avatar }}</div>
        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="email">{{ item.email }}</div>
          <div class="status">{{ item.status }}</div>
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
  </sdkwork-api-tab-list>
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

// Tabs数据
const tabsData = ref([
  { value: 'all', title: '全部用户', params: { status: '' } },
  { value: 'active', title: '活跃用户', params: { status: 'active' } },
  { value: 'inactive', title: '非活跃用户', params: { status: 'inactive' } },
  { value: 'banned', title: '禁用用户', params: { status: 'banned' } }
])

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
const handleTabChange = (tab: any, params: Record<string, any>) => {
  console.log('Tab切换:', tab.title, '参数:', params)
}

const handleSelect = (user: User) => {
  console.log('选中用户:', user)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: Page<User>) => {
  console.log('数据加载完成:', pageData)
}
</script>
```

### 使用动态Tabs API

```vue
<template>
  <sdkwork-api-tab-list
    :api="getProductList"
    :tabs-api="getCategoryTabs"
    searchable
    @tab-change="handleCategoryChange"
  >
    <!-- 自定义列表项 -->
    <template #default="{ item }">
      <div class="product-item">
        <img :src="item.image" class="product-image" />
        <div class="product-info">
          <div class="product-name">{{ item.name }}</div>
          <div class="product-price">¥{{ item.price }}</div>
          <div class="product-category">{{ item.categoryName }}</div>
        </div>
      </div>
    </template>
  </sdkwork-api-tab-list>
</template>

<script setup lang="ts">
import type { Page, Pageable, TabItem } from 'sdkwork-api-tab-list'

interface Product {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  categoryName: string
}

// 获取分类Tabs数据
const getCategoryTabs = async (): Promise<TabItem[]> => {
  const response = await fetch('/api/categories')
  const categories = await response.json()
  
  return [
    { value: 'all', title: '全部商品' },
    ...categories.map((cat: any) => ({
      value: cat.id,
      title: cat.name,
      params: { categoryId: cat.id }
    }))
  ]
}

// 获取商品列表
const getProductList = async (params: Pageable): Promise<Page<Product>> => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

const handleCategoryChange = (tab: TabItem, params: Record<string, any>) => {
  console.log('分类切换:', tab.title, '筛选参数:', params)
}
</script>
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

### Tab项数据结构

```typescript
interface TabItem {
  value: string | number     // Tab的唯一标识
  title: string             // Tab显示标题
  params?: Record<string, any> // Tab对应的查询参数
  [key: string]: any        // 其他自定义属性
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
| tabs | `TabItem[]` | `[]` | Tabs数据数组 |
| tabsApi | `() => Promise<TabItem[]>` | - | Tabs API方法 |
| tabsFieldMap | `Object` | - | Tabs字段映射配置 |
| tabsSticky | `boolean` | `true` | Tabs是否粘性定位 |
| tabsSwipeable | `boolean` | `true` | Tabs是否支持滑动切换 |
| defaultActiveTab | `string \| number` | `''` | 默认激活的Tab |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(item: T) => void` | 行选择事件 |
| delete | `(item: T) => void` | 行删除事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: Page<T>) => void` | 数据加载完成事件 |
| tab-change | `(tab: TabItem, params: Record<string, any>) => void` | Tab切换事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ item: T, index: number, selected: boolean }` | 自定义列表项内容 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |
| tab-title | `{ tab: TabItem }` | Tab标题自定义内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-api-tab-list ref="tabListRef" :api="getData" :tabs="tabs" />
  <van-button @click="handleRefresh">刷新</van-button>
  <van-button @click="switchToActiveTab">切换到活跃Tab</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabListRef = ref()

const handleRefresh = () => {
  tabListRef.value.refresh()
}

const switchToActiveTab = () => {
  tabListRef.value.setActiveTab('active')
  
  // 获取当前激活的Tab
  const activeTab = tabListRef.value.getActiveTab()
  console.log('当前激活Tab:', activeTab)
  
  // 获取Tabs数据
  const tabs = tabListRef.value.getTabsData()
  console.log('Tabs数据:', tabs)
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
- `getActiveTab()`: 获取当前激活的Tab
- `setActiveTab(tabName: string | number)`: 设置激活的Tab
- `getTabsData()`: 获取Tabs数据

## 高级用法

### 自定义Tab标题

```vue
<template>
  <sdkwork-api-tab-list :api="getData" :tabs="tabs">
    <template #tab-title="{ tab }">
      <div class="custom-tab-title">
        <van-icon :name="tab.icon" />
        <span>{{ tab.title }}</span>
        <van-badge v-if="tab.count" :content="tab.count" />
      </div>
    </template>
  </sdkwork-api-tab-list>
</template>
```

### 动态更新Tabs数据

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tabsData = ref([
  { value: 'all', title: '全部', count: 0 },
  { value: 'pending', title: '待处理', count: 0 }
])

const tabListRef = ref()

// 动态更新Tab数据
const updateTabsData = (newTabs: TabItem[]) => {
  tabsData.value = newTabs
}

// 动态更新单个Tab
const updateTabCount = (tabValue: string, count: number) => {
  const tab = tabsData.value.find(t => t.value === tabValue)
  if (tab) {
    tab.count = count
  }
}
</script>
```

## 样式定制

组件使用SCSS编写，支持CSS变量定制：

```css
.sdkwork-api-tab-list {
  --tab-bg-color: #fff;
  --tab-active-color: #1890ff;
  --tab-inactive-color: #666;
  --list-bg-color: #f7f8fa;
  --item-border-color: #f0f0f0;
}
```

## 响应式设计

组件自动适配移动端和PC端：
- 移动端：Tabs支持滑动切换，紧凑布局
- PC端：Tabs固定显示，宽松布局

## 注意事项

1. Tabs数据和API数据是独立的，可以分别配置
2. Tab切换时会自动合并Tab的params和组件的params
3. 搜索功能对所有Tab生效，搜索关键词会传递给每个Tab
4. 组件会自动处理分页逻辑，无需手动管理页码
5. 确保Vant组件已正确注册或使用自动导入

## 故障排除

### Tabs不显示
- 检查tabs数组是否为空
- 确认tabs-api是否返回有效数据
- 查看浏览器控制台错误信息

### Tab切换不生效
- 检查Tab的value值是否唯一
- 确认Tab的params是否正确合并
- 验证API是否支持Tab对应的参数

### 数据不显示
- 检查API方法是否正确返回Page结构
- 确认网络请求是否成功
- 查看Tab对应的参数是否正确传递