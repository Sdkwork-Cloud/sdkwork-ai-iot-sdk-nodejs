# SDKWork Product Category List 组件

基于Vue 3 + TypeScript的商品分类列表组件，专为电商场景设计，支持左侧商品分类导航和右侧商品列表展示。

## 功能特性

### 核心功能
- ✅ **双栏布局**: 左侧分类导航 + 右侧商品列表
- ✅ **商品展示**: 支持图片、价格、评价、销量等信息展示
- ✅ **分类切换**: 切换分类自动刷新商品列表
- ✅ **搜索功能**: 支持关键词搜索商品
- ✅ **选择功能**: 支持商品单选/多选
- ✅ **删除功能**: 支持商品删除操作
- ✅ **状态管理**: 支持售罄、库存预警等状态显示
- ✅ **响应式设计**: 适配移动端和PC端

### 商品特性
- 商品图片展示和占位图
- 价格显示（现价/原价）
- 商品标签（热销、新品、限时等）
- 评价星级和销量显示
- 库存状态和预警
- 售罄状态遮罩
- 加入购物车功能

## 快速开始

### 安装使用
```bash
npm install @sdkwork/product-category-list
```

### 基础用法
```vue
<template>
  <SdkworkProductCategoryList
    :selectable="true"
    :searchable="true"
    @select="handleProductSelect"
    @select-category="handleCategorySelect"
  />
</template>

<script setup lang="ts">
import SdkworkProductCategoryList from '@sdkwork/product-category-list'

const handleProductSelect = (product) => {
  console.log('选中商品:', product)
}

const handleCategorySelect = (category) => {
  console.log('选中分类:', category)
}
</script>
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| selectable | `boolean` | `false` | 是否支持商品选择 |
| deletable | `boolean` | `false` | 是否支持商品删除 |
| searchable | `boolean` | `true` | 是否支持搜索 |
| pageSize | `number` | `10` | 每页显示商品数量 |
| itemKey | `string` | `'id'` | 商品唯一键字段名 |
| itemTitleField | `string` | `'name'` | 商品标题字段名 |
| itemDescriptionField | `string` | `'description'` | 商品描述字段名 |
| categoryKey | `string` | `'id'` | 分类唯一键字段名 |
| categoryNameField | `string` | `'name'` | 分类名称字段名 |
| categoryCountField | `string` | `'count'` | 分类商品数量字段名 |
| defaultCategoryId | `string \| number` | - | 默认选中分类ID |
| params | `Record<string, any>` | `{}` | 查询参数 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| select | `(product: Product)` | 商品选择事件 |
| delete | `(product: Product)` | 商品删除事件 |
| search | `(keyword: string)` | 搜索事件 |
| load | `(pageData: Page<Product>)` | 数据加载完成事件 |
| select-category | `(category: ProductCategory)` | 分类选择事件 |

## 插槽

### 默认插槽
自定义商品项内容：
```vue
<template #default="{ product, index, selected }">
  <div class="custom-product">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p class="price">¥{{ product.price }}</p>
  </div>
</template>
```

### 分类插槽
自定义分类项内容：
```vue
<template #category="{ category, index }">
  <div class="custom-category">
    <van-icon :name="category.icon" />
    <span>{{ category.name }}</span>
    <badge :count="category.count" />
  </div>
</template>
```

### 其他插槽
- `#header` - 列表顶部区域
- `#footer` - 列表底部区域  
- `#empty` - 空状态显示
- `#loading` - 加载状态显示

## 数据类型

### 商品数据 (Product)
```typescript
interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  categoryId: string | number
  stock: number
  status: 'active' | 'inactive' | 'soldout'
  tags?: string[]
  rating?: number
  sales?: number
}
```

### 商品分类 (ProductCategory)
```typescript
interface ProductCategory {
  id: string | number
  name: string
  description?: string
  icon?: string
  count?: number
  sort?: number
  parentId?: string | number
  children?: ProductCategory[]
}
```

## Mock数据

组件内置了完整的Mock数据，包含：
- 10个商品分类（数码电子、家居生活、服饰鞋包等）
- 多个商品示例（iPhone、小米电视、懒人沙发等）
- 完整的商品信息（价格、图片、评价、销量等）

## 自定义样式

### CSS变量
```css
:root {
  --product-item-bg: #fff;
  --product-item-border: #f0f0f0;
  --product-price-color: #ff4444;
  --product-tag-bg: #ff4444;
  --category-active-bg: #f0f8ff;
}
```

### 自定义类名
- `.product-item` - 商品项容器
- `.product-image` - 商品图片区域
- `.product-info` - 商品信息区域
- `.product-category-item` - 分类项

## 高级用法

### 集成真实API
```vue
<script setup lang="ts">
import { ref } from 'vue'

const queryParams = ref({
  status: 'active',
  sortBy: 'sales'
})

// 替换Mock API为真实API
const getProductList = async (params) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(params)
  })
  return response.json()
}

const getProductCategories = async () => {
  const response = await fetch('/api/categories')
  return response.json()
}
</script>
```

### 商品项组件单独使用
```vue
<template>
  <ProductItem
    :product="product"
    :selectable="true"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { ProductItem } from '@sdkwork/product-category-list'

const product = ref({
  id: 1,
  name: '示例商品',
  price: 99.9,
  image: 'https://example.com/product.jpg'
})
</script>
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 技术栈

- Vue 3 Composition API
- TypeScript
- Vant 4.x UI组件库
- Spring Boot分页标准
- 响应式设计