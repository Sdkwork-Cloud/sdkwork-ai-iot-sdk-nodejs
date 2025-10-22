# SDKWork API Grid List 组件

基于Vue 3、setup语法糖和TypeScript的通用网格列表查询组件，支持Spring Boot分页标准。

## 功能特性

- ✅ 支持Spring Boot Pageable分页标准
- ✅ 网格布局，支持自定义列数
- ✅ 下拉刷新和上拉加载更多
- ✅ 搜索功能（300ms防抖）
- ✅ 项选择和删除功能
- ✅ 多种插槽自定义
- ✅ 响应式布局设计
- ✅ 完整的TypeScript类型支持

## 基础用法

```vue
<template>
  <sdkwork-api-grid-list
    :api="getProductList"
    :params="{ category: 'electronics' }"
    :columns="3"
    selectable
    searchable
    deletable
    @select="handleSelect"
    @delete="handleDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义网格项 -->
    <template #default="{ item, index }">
      <div class="product-card">
        <van-image
          :src="item.image"
          width="100%"
          height="120"
          fit="cover"
        />
        <div class="product-info">
          <div class="product-name">{{ item.name }}</div>
          <div class="product-price">¥{{ item.price }}</div>
          <div class="product-rating">
            <van-rate v-model="item.rating" readonly size="12" />
            <span>({{ item.sales }})</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 空状态 -->
    <template #empty>
      <van-empty description="暂无商品数据" />
    </template>

    <!-- 加载状态 -->
    <template #loading>
      <van-loading size="24px" vertical>加载商品数据...</van-loading>
    </template>
  </sdkwork-api-grid-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  sales: number
}

// API方法
const getProductList = async (params: Pageable): Promise<Page<Product>> => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  })
  return response.json()
}

// 事件处理
const handleSelect = (product: Product) => {
  console.log('选中商品:', product)
}

const handleDelete = (product: Product) => {
  console.log('删除商品:', product)
}

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
}

const handleLoad = (pageData: Page<Product>) => {
  console.log('数据加载完成:', pageData)
}
</script>

<style scoped>
.product-card {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #ee0a24;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #969799;
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
| selectable | `boolean` | `false` | 是否支持项选择 |
| deletable | `boolean` | `false` | 是否支持项删除 |
| searchable | `boolean` | `false` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示条数 |
| itemKey | `string` | `'id'` | 网格项唯一键字段名 |
| itemTitleField | `string` | `'name'` | 网格项标题字段名 |
| itemDescriptionField | `string` | `'description'` | 网格项描述字段名 |
| columns | `number` | `2` | 网格列数 |
| gap | `number` | `16` | 网格间距（px） |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(item: T) => void` | 项选择事件 |
| delete | `(item: T) => void` | 项删除事件 |
| search | `(keyword: string) => void` | 搜索事件 |
| load | `(pageData: Page<T>) => void` | 数据加载完成事件 |

## 插槽说明

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | `{ item: T, index: number }` | 自定义网格项内容 |
| header | - | 网格顶部区域 |
| footer | - | 网格底部区域 |
| empty | - | 空状态显示内容 |
| loading | - | 加载状态显示内容 |

## 组件方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <sdkwork-api-grid-list ref="gridRef" :api="getData" :columns="3" />
  <van-button @click="handleRefresh">刷新</van-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const gridRef = ref()

const handleRefresh = () => {
  gridRef.value.refresh()
}

const getSelectedItems = () => {
  const selected = gridRef.value.getSelectedItems()
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

## 响应式设计

组件自动适配不同屏幕尺寸：

### 移动端 (≤768px)
- 默认1-2列布局
- 紧凑间距设计
- 触摸友好的交互

### 平板端 (769px-1024px)
- 2-3列布局
- 中等间距设计
- 平衡的可读性和空间利用

### 桌面端 (≥1025px)
- 3-4列布局
- 宽松间距设计
- 最佳的可读性和用户体验

## 样式定制

组件使用SCSS编写，支持CSS变量定制：

```css
.sdkwork-api-grid-list {
  --grid-bg-color: #fff;
  --item-border-radius: 8px;
  --item-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --selected-bg-color: #e6f7ff;
  --primary-color: #1890ff;
}

/* 自定义网格布局 */
.custom-grid {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
}
```

## 最佳实践

### 1. 网格项设计
- 保持网格项宽高比例一致
- 使用高质量的图片和清晰的文字
- 确保触摸目标大小合适（≥44px）

### 2. 列数设置
```vue
<!-- 响应式列数设置 -->
<sdkwork-api-grid-list :columns="responsiveColumns" />

<script setup>
import { computed } from 'vue'

const responsiveColumns = computed(() => {
  if (window.innerWidth < 768) return 2
  if (window.innerWidth < 1024) return 3
  return 4
})
</script>
```

### 3. 性能优化
- 使用懒加载图片
- 合理设置pageSize避免过多数据
- 使用虚拟滚动处理大数据量

## 注意事项

1. **API兼容性**: 确保API方法返回符合Spring Boot Page结构
2. **网格布局**: 列数设置应考虑屏幕尺寸和内容复杂度
3. **图片优化**: 网格项中的图片应进行压缩和懒加载
4. **触摸交互**: 确保网格项在移动设备上有良好的触摸体验

## 故障排除

### 网格布局异常
- 检查columns设置是否合理
- 确认网格项内容没有破坏布局
- 验证CSS Grid兼容性

### 数据加载问题
- 检查API方法是否正确返回Page结构
- 确认网络请求是否成功
- 查看浏览器控制台错误信息

### 响应式问题
- 测试不同屏幕尺寸下的显示效果
- 检查媒体查询是否正确应用
- 验证CSS变量覆盖是否生效

## 示例应用场景

1. **商品展示**: 电商平台商品网格展示
2. **图片墙**: 社交媒体图片网格布局
3. **卡片列表**: 新闻、博客等内容卡片
4. **产品目录**: 企业产品展示网格
5. **作品集**: 设计师作品网格展示