# SDKWork API Category List 组件

基于Vue 3、setup语法糖和TypeScript的通用分类列表查询组件，支持左侧分类栏和右侧内容列表的双栏布局。

## 功能特性

### 基础功能
- ✅ 集成Spring Boot分页标准（Pageable/Page<T>）
- ✅ 左侧分类栏 + 右侧内容列表双栏布局
- ✅ 支持通过API获取分类数据或直接传入分类列表
- ✅ 分类切换时自动刷新右侧内容列表
- ✅ 下拉刷新、上拉加载更多
- ✅ 搜索功能（300ms防抖）
- ✅ 行选择、行删除功能
- ✅ 完整的加载状态管理

### 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| api | `() => Promise<Page<any>>` | - | 必传的内容列表API请求方法 |
| params | `Record<string, any>` | `{}` | 请求参数对象 |
| selectable | `boolean` | `false` | 是否支持行选择 |
| deletable | `boolean` | `false` | 是否支持行删除 |
| searchable | `boolean` | `false` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示条数 |
| categoryApi | `() => Promise<Category[]>` | - | 分类数据API方法 |
| categories | `Category[]` | `[]` | 分类数据列表 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(item: any)` | 行选择事件 |
| delete | `(item: any)` | 行删除事件 |
| search | `(keyword: string)` | 搜索事件 |
| load | `(page: Page<any>)` | 数据加载完成事件 |
| select-category | `(category: Category)` | 分类选择事件 |

### 插槽

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ item: any, index: number }` | 内容列表项自定义渲染 |
| category | `{ category: Category, index: number }` | 分类项自定义渲染 |
| header | - | 列表顶部区域 |
| footer | - | 列表底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 基础用法

```vue
<template>
  <SdkworkApiCategoryList
    :api="getDeviceList"
    :category-api="getDeviceCategories"
    :params="queryParams"
    selectable
    searchable
    @select="handleSelect"
    @select-category="handleCategorySelect"
  >
    <!-- 自定义内容列表项 -->
    <template #default="{ item }">
      <div class="device-item">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </template>

    <!-- 自定义分类项 -->
    <template #category="{ category }">
      <div class="category-item">
        <van-icon :name="category.icon" />
        <span>{{ category.name }}</span>
        <span class="count">{{ category.count }}</span>
      </div>
    </template>
  </SdkworkApiCategoryList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkApiCategoryList from './sdkwork-api-category-list.vue'

const queryParams = ref({
  status: 'active',
  type: 'device'
})

// 获取设备列表API
const getDeviceList = async () => {
  const response = await fetch('/api/devices', {
    method: 'POST',
    body: JSON.stringify({
      page: 0,
      size: 10,
      ...queryParams.value
    })
  })
  return response.json()
}

// 获取设备分类API
const getDeviceCategories = async () => {
  const response = await fetch('/api/device-categories')
  return response.json()
}

const handleSelect = (item: any) => {
  console.log('选中设备:', item)
}

const handleCategorySelect = (category: any) => {
  console.log('选中分类:', category)
  queryParams.value.categoryId = category.id
}
</script>
```

## API接口规范

### 输入参数（Spring Boot Pageable）
```typescript
interface Pageable {
  page: number  // 当前页码（从0开始）
  size: number  // 每页条数
  sort?: string // 排序字段（格式："field,direction"）
}
```

### 输出结果（Spring Boot Page<T>）
```typescript
interface Page<T> {
  content: T[]           // 数据列表
  totalElements: number  // 总记录数
  totalPages: number     // 总页数
  number: number         // 当前页码
  size: number           // 每页条数
  first: boolean         // 是否第一页
  last: boolean          // 是否最后一页
  empty: boolean         // 是否为空
}
```

### 分类数据结构
```typescript
interface Category {
  id: string | number    // 分类ID
  name: string          // 分类名称
  description?: string  // 分类描述
  icon?: string         // 分类图标
  color?: string        // 分类颜色
  count?: number        // 分类项数量
}
```

## 响应式布局

组件采用响应式设计，适配移动端和PC端：

- **移动端**：分类栏和内容列表垂直排列
- **PC端**：分类栏和内容列表水平排列（双栏布局）

## 技术栈

- Vue 3 Composition API + setup语法糖
- TypeScript严格模式
- Vant 4.x UI组件库
- Spring Boot分页标准集成
- IntersectionObserver API（上拉加载）
- 防抖搜索（300ms）

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+