# SdkworkRow 栅格行组件

功能完整的栅格行组件，兼容 Vant Row 组件 API，支持灵活的布局和主题系统。

## 特性

- ✅ 完全兼容 Vant Row 组件 API
- ✅ 支持 24 列栅格系统
- ✅ 支持 flex 布局
- ✅ 支持主轴和交叉轴对齐
- ✅ 支持栅格间隔
- ✅ 支持 light/dark/auto 主题模式
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 基础用法

### 基本栅格布局

```vue
<template>
  <SdkworkRow>
    <SdkworkCol span="8">span: 8</SdkworkCol>
    <SdkworkCol span="8">span: 8</SdkworkCol>
    <SdkworkCol span="8">span: 8</SdkworkCol>
  </SdkworkRow>
</template>
```

### 栅格间隔

```vue
<template>
  <SdkworkRow gutter="20">
    <SdkworkCol span="8">span: 8</SdkworkCol>
    <SdkworkCol span="8">span: 8</SdkworkCol>
    <SdkworkCol span="8">span: 8</SdkworkCol>
  </SdkworkRow>
</template>
```

### Flex 布局

```vue
<template>
  <SdkworkRow type="flex">
    <SdkworkCol span="6">span: 6</SdkworkCol>
    <SdkworkCol span="6">span: 6</SdkworkCol>
    <SdkworkCol span="6">span: 6</SdkworkCol>
  </SdkworkRow>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `type` | `string` | - | 布局方式，可选值为 `flex` |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between'` | `'start'` | Flex 主轴对齐方式 |
| `align` | `'top' \| 'center' \| 'bottom'` | `'top'` | Flex 交叉轴对齐方式 |
| `wrap` | `boolean` | `true` | 是否自动换行 |
| `gutter` | `string \| number` | `0` | 栅格间隔，默认单位为 px |
| `customStyle` | `Record<string, string \| number>` | - | 自定义样式 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| `onClick` | `(event: Event) => void` | - | 点击事件回调 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `event: Event` | 点击事件 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `default` | 默认插槽内容，通常放置 SdkworkCol 组件 |

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkRow theme-mode="auto">
    <SdkworkCol span="12">自动主题</SdkworkCol>
  </SdkworkRow>
  
  <!-- 浅色主题 -->
  <SdkworkRow theme-mode="light">
    <SdkworkCol span="12">浅色主题</SdkworkCol>
  </SdkworkRow>
  
  <!-- 深色主题 -->
  <SdkworkRow theme-mode="dark">
    <SdkworkCol span="12">深色主题</SdkworkCol>
  </SdkworkRow>
</template>
```

## 高级用法

### 对齐方式

```vue
<template>
  <!-- 主轴居中对齐 -->
  <SdkworkRow type="flex" justify="center">
    <SdkworkCol span="6">居中</SdkworkCol>
    <SdkworkCol span="6">居中</SdkworkCol>
  </SdkworkRow>
  
  <!-- 两端对齐 -->
  <SdkworkRow type="flex" justify="space-between">
    <SdkworkCol span="6">左</SdkworkCol>
    <SdkworkCol span="6">右</SdkworkCol>
  </SdkworkRow>
  
  <!-- 交叉轴居中对齐 -->
  <SdkworkRow type="flex" align="center">
    <SdkworkCol span="12">垂直居中</SdkworkCol>
  </SdkworkRow>
</template>
```

### 响应式布局

```vue
<template>
  <SdkworkRow gutter="16">
    <SdkworkCol :span="{ xs: 24, sm: 12, md: 8, lg: 6 }">
      响应式列
    </SdkworkCol>
    <SdkworkCol :span="{ xs: 24, sm: 12, md: 8, lg: 6 }">
      响应式列
    </SdkworkCol>
    <SdkworkCol :span="{ xs: 24, sm: 12, md: 8, lg: 6 }">
      响应式列
    </SdkworkCol>
  </SdkworkRow>
</template>
```

### 混合布局

```vue
<template>
  <SdkworkRow gutter="20">
    <SdkworkCol span="16">
      <SdkworkRow gutter="10">
        <SdkworkCol span="12">嵌套列1</SdkworkCol>
        <SdkworkCol span="12">嵌套列2</SdkworkCol>
      </SdkworkRow>
    </SdkworkCol>
    <SdkworkCol span="8">侧边栏</SdkworkCol>
  </SdkworkRow>
</template>
```

### 表单布局

```vue
<template>
  <SdkworkRow gutter="16">
    <SdkworkCol span="12">
      <SdkworkField label="姓名" placeholder="请输入姓名" />
    </SdkworkCol>
    <SdkworkCol span="12">
      <SdkworkField label="手机号" placeholder="请输入手机号" />
    </SdkworkCol>
    <SdkworkCol span="24">
      <SdkworkField label="地址" placeholder="请输入地址" />
    </SdkworkCol>
  </SdkworkRow>
</template>
```

## 实例方法

```vue
<template>
  <SdkworkRow ref="rowRef">
    <SdkworkCol span="12">内容</SdkworkCol>
  </SdkworkRow>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rowRef = ref()

// 获取行配置
const getRowConfig = () => {
  if (rowRef.value) {
    const config = rowRef.value.getConfig()
    console.log('行配置:', config)
  }
}
</script>
```

## CSS 变量

```css
/* 浅色主题 */
.sdkwork-row--light {
  --sdkwork-row-bg-color: transparent;
}

/* 深色主题 */
.sdkwork-row--dark {
  --sdkwork-row-bg-color: var(--sdkwork-dark-bg-color, #1a1a1a);
}
```

## 兼容性说明

### 与 Vant Row 组件对比

| 特性 | SdkworkRow | Vant Row | 说明 |
|------|------------|----------|------|
| API 兼容性 | ✅ 完全兼容 | - | 所有 Props、Events、Slots 完全一致 |
| 主题系统 | ✅ 支持 | ❌ 不支持 | 支持 light/dark/auto 主题模式 |
| TypeScript | ✅ 完整支持 | ✅ 支持 | 提供完整的类型定义 |
| 栅格系统 | ✅ 24列 | ✅ 24列 | 相同的栅格系统实现 |
| Flex 布局 | ✅ 支持 | ✅ 支持 | 相同的 flex 布局功能 |

### 迁移指南

从 Vant Row 迁移到 SdkworkRow：

```vue
<!-- Vant -->
<van-row gutter="20" type="flex" justify="center">
  <van-col span="8">内容</van-col>
</van-row>

<!-- SdkworkRow -->
<SdkworkRow gutter="20" type="flex" justify="center">
  <SdkworkCol span="8">内容</SdkworkCol>
</SdkworkRow>
```

## 注意事项

1. **栅格间隔**：设置 `gutter` 属性时，Row 组件会自动添加负边距，Col 组件会自动添加内边距
2. **Flex 布局**：使用 `type="flex"` 时，Row 组件会转换为 flex 容器
3. **主题模式**：`theme-mode="auto"` 会根据系统主题自动切换
4. **响应式**：支持响应式断点配置，与 Vant 保持一致

## 相关组件

- [SdkworkCol](./sdkwork-col/README.md) - 栅格列组件
- [SdkworkGrid](./sdkwork-grid/README.md) - 栅格系统组件（可选）