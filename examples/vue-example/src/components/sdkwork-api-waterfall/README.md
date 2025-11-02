# SDKWork API Waterfall 组件

基于 `vue3-waterfall-plugin` 重构的瀑布流组件，严格遵循 `sdkwork-api-list` 的数据加载标准。

## 特性

- ✅ 基于 `vue3-waterfall-plugin` 的瀑布流布局
- ✅ 严格遵循 `sdkwork-api-list` 的数据加载标准
- ✅ 支持响应式断点配置
- ✅ 内置图片懒加载功能
- ✅ 支持动画效果（Animate.css）
- ✅ 支持主题模式（暗色/亮色）
- ✅ 支持项选择和删除
- ✅ 支持搜索功能
- ✅ 支持分页加载
- ✅ 支持自定义插槽

## 安装依赖

```bash
npm install vue-waterfall-plugin-next
```

## 基本用法

```vue
<template>
  <SdkworkApiWaterfall
    :api="fetchData"
    :page-size="20"
    :searchable="true"
    :selectable="true"
    :deletable="true"
    :width="200"
    :breakpoints="breakpoints"
    :gutter="10"
    :animation-effect="'fadeIn'"
  >
    <template #default="{ item, index, selected }">
      <div class="waterfall-card" :class="{ selected }">
        <img :src="item.image" :alt="item.title" />
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </SdkworkApiWaterfall>
</template>

<script setup>
import { ref } from 'vue'

// 响应式断点配置
const breakpoints = ref({
  1200: { rowPerView: 4 },
  800: { rowPerView: 3 },
  500: { rowPerView: 2 },
  320: { rowPerView: 1 }
})

// API 数据获取方法
const fetchData = async (params, pageable) => {
  // 实现数据获取逻辑
  return {
    content: [], // 数据列表
    total: 0,    // 总条数
    pageable: {  // 分页信息
      pageNumber: pageable.page,
      pageSize: pageable.size
    },
    last: false  // 是否最后一页
  }
}
</script>
```

## Props 参数

### 基础属性

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `api` | `Function` | - | API请求方法 |
| `service` | `CURDService` | - | CRUD服务实例 |
| `params` | `Object` | `{}` | 查询参数 |
| `pageableParams` | `Pageable` | `{}` | 分页排序参数 |
| `selectable` | `Boolean` | `false` | 是否支持项选择 |
| `deletable` | `Boolean` | `false` | 是否支持项删除 |
| `searchable` | `Boolean` | `false` | 是否支持搜索 |
| `pageSize` | `Number` | `10` | 每页显示条数 |
| `itemKey` | `String` | `'id'` | 项唯一键字段名 |

### 瀑布流特定属性

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `waterfallRowKey` | `String` | `'id'` | 瀑布流数据唯一键字段名 |
| `imgSelector` | `String` | `'src'` | 图片字段选择器 |
| `width` | `Number` | `200` | 卡片在 PC 上的宽度 |
| `breakpoints` | `Object` | `{1200:{rowPerView:3},800:{rowPerView:2},500:{rowPerView:1}}` | 响应式断点配置 |
| `gutter` | `Number` | `10` | 卡片之间的间隙 |
| `space` | `Number` | `10` | 行间隙 |
| `hasAroundGutter` | `Boolean` | `true` | 容器四周是否有 gutter 边距 |
| `posDuration` | `Number` | `300` | 卡片移动动画时间 |
| `animationEffect` | `String` | `'fadeIn'` | 卡片入场动画效果 |
| `animationDuration` | `Number` | `1000` | 动画执行时间 |
| `animationDelay` | `Number` | `300` | 动画延迟 |
| `lazyload` | `Boolean` | `true` | 是否开启懒加载 |
| `align` | `String` | `'center'` | 卡片对齐方式 |

### 主题和样式属性

| 参数名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `themeMode` | `String` | `'auto'` | 主题模式（dark/light/auto） |
| `topSpacing` | `String\|Number` | `'6px'` | 顶部间距 |
| `leftSpacing` | `String\|Number` | `'8px'` | 左侧间距 |
| `rightSpacing` | `String\|Number` | `'8px'` | 右侧间距 |

## 事件

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `select` | `item` | 项选择事件 |
| `delete` | `item` | 项删除事件 |
| `search` | `keyword` | 搜索事件 |
| `load` | `pageData` | 数据加载完成事件 |
| `after-render` | - | 瀑布流渲染完成事件 |

## 插槽

| 插槽名 | 作用域参数 | 描述 |
|--------|------------|------|
| `default` | `{ item, index, selected }` | 瀑布流项内容插槽 |
| `header` | - | 顶部区域插槽 |
| `footer` | - | 底部区域插槽 |
| `empty` | `{ empty }` | 空状态插槽 |
| `loading` | `{ loading }` | 加载状态插槽 |

## 方法

通过 `ref` 调用组件实例方法：

```vue
<template>
  <SdkworkApiWaterfall ref="waterfallRef" />
</template>

<script setup>
import { ref } from 'vue'

const waterfallRef = ref()

// 刷新数据
waterfallRef.value.refresh()

// 加载更多数据
waterfallRef.value.loadMore()

// 手动触发布局刷新
waterfallRef.value.renderer()

// 获取选中项
const selectedItems = waterfallRef.value.getSelectedItems()

// 清空选中项
waterfallRef.value.clearSelected()
</script>
```

## 响应式断点配置

```javascript
const breakpoints = {
  1200: { rowPerView: 4 },  // 宽度 ≥ 1200px 时显示 4 列
  800:  { rowPerView: 3 },  // 宽度 ≥ 800px 时显示 3 列
  500:  { rowPerView: 2 },  // 宽度 ≥ 500px 时显示 2 列
  320:  { rowPerView: 1 }   // 宽度 ≥ 320px 时显示 1 列
}
```

## 动画效果

组件支持 Animate.css 的所有动画效果：

```bash
npm install animate.css
```

```javascript
import 'animate.css'

// 在组件中使用
<SdkworkApiWaterfall :animation-effect="'bounceIn'" />
```

## 主题模式

组件支持三种主题模式：

- `'dark'` - 强制暗色主题
- `'light'` - 强制亮色主题  
- `'auto'` - 自动跟随系统主题

## 注意事项

1. **图片懒加载**：确保图片数据包含正确的 `src` 字段，或通过 `imgSelector` 指定字段路径
2. **唯一键**：如果支持删除功能，必须设置正确的 `waterfallRowKey`
3. **动画性能**：在大量数据时考虑关闭动画效果以提升性能
4. **响应式设计**：合理配置断点以适应不同屏幕尺寸

## 与 sdkwork-api-list 的兼容性

本组件严格遵循 `sdkwork-api-list` 的数据加载标准，包括：

- 相同的 API 接口规范
- 相同的分页参数处理
- 相同的加载状态管理
- 相同的事件触发机制
- 相同的插槽设计模式

这使得在两个组件之间切换变得非常简单。