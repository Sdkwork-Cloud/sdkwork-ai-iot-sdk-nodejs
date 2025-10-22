# SdkworkCol 栅格列组件

功能完整的栅格列组件，兼容 Vant Col 组件 API，支持灵活的布局和主题系统。

## 特性

- ✅ 完全兼容 Vant Col 组件 API
- ✅ 支持 24 列栅格系统
- ✅ 支持偏移量、排序、flex 布局
- ✅ 支持响应式断点
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

### 偏移量

```vue
<template>
  <SdkworkRow>
    <SdkworkCol span="8">span: 8</SdkworkCol>
    <SdkworkCol span="8" offset="8">offset: 8</SdkworkCol>
  </SdkworkRow>
</template>
```

### Flex 布局

```vue
<template>
  <SdkworkRow type="flex">
    <SdkworkCol span="6" flex="1">flex: 1</SdkworkCol>
    <SdkworkCol span="6" flex="2">flex: 2</SdkworkCol>
  </SdkworkRow>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `span` | `string \| number` | `24` | 列元素宽度（共24等分），可选值为 0-24 的整数或 auto |
| `offset` | `string \| number` | `0` | 列元素偏移距离（共24等分），可选值为 0-24 的整数 |
| `order` | `string \| number` | `0` | 列元素顺序，用于 flex 布局下排序 |
| `flex` | `string \| number` | - | flex 布局属性 |
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
| `default` | 默认插槽内容 |

## 主题配置

```vue
<template>
  <SdkworkRow>
    <!-- 自动主题 -->
    <SdkworkCol span="12" theme-mode="auto">自动主题</SdkworkCol>
    
    <!-- 浅色主题 -->
    <SdkworkCol span="12" theme-mode="light">浅色主题</SdkworkCol>
    
    <!-- 深色主题 -->
    <SdkworkCol span="12" theme-mode="dark">深色主题</SdkworkCol>
  </SdkworkRow>
</template>
```

## 高级用法

### 响应式布局

```vue
<template>
  <SdkworkRow>
    <SdkworkCol :span="{ xs: 24, sm: 12, md: 8, lg: 6 }">
      响应式列
    </SdkworkCol>
    <SdkworkCol :span="{ xs: 24, sm: 12, md: 8, lg: 6 }">
      响应式列
    </SdkworkCol>
  </SdkworkRow>
</template>

<script setup lang="ts">
// 响应式配置对象
const responsiveConfig = {
  xs: 24,  // < 768px
  sm: 12,  // ≥ 768px
  md: 8,   // ≥ 992px
  lg: 6    // ≥ 1200px
}
</script>
```

### 排序和偏移

```vue
<template>
  <SdkworkRow type="flex">
    <SdkworkCol span="6" order="3">第三列</SdkworkCol>
    <SdkworkCol span="6" order="1">第一列</SdkworkCol>
    <SdkworkCol span="6" order="2">第二列</SdkworkCol>
  </SdkworkRow>
  
  <SdkworkRow>
    <SdkworkCol span="6" offset="6">偏移6列</SdkworkCol>
    <SdkworkCol span="6" offset="6">偏移6列</SdkworkCol>
  </SdkworkRow>
</template>
```

### Flex 布局高级用法

```vue
<template>
  <SdkworkRow type="flex">
    <!-- 固定宽度 -->
    <SdkworkCol flex="100px">固定100px</SdkworkCol>
    
    <!-- 比例分配 -->
    <SdkworkCol flex="1">1份</SdkworkCol>
    <SdkworkCol flex="2">2份</SdkworkCol>
    
    <!-- 自动填充 -->
    <SdkworkCol flex="auto">自动填充</SdkworkCol>
  </SdkworkRow>
</template>
```

### 复杂布局示例

```vue
<template>
  <!-- 三栏布局 -->
  <SdkworkRow gutter="20">
    <SdkworkCol span="4">左侧边栏</SdkworkCol>
    <SdkworkCol span="16">
      <!-- 嵌套栅格 -->
      <SdkworkRow gutter="10">
        <SdkworkCol span="12">内容区域1</SdkworkCol>
        <SdkworkCol span="12">内容区域2</SdkworkCol>
      </SdkworkRow>
    </SdkworkCol>
    <SdkworkCol span="4">右侧边栏</SdkworkCol>
  </SdkworkRow>
  
  <!-- 卡片布局 -->
  <SdkworkRow gutter="16">
    <SdkworkCol 
      v-for="item in 6" 
      :key="item" 
      :span="{ xs: 24, sm: 12, md: 8, lg: 6 }"
    >
      <div class="card">卡片 {{ item }}</div>
    </SdkworkCol>
  </SdkworkRow>
</template>

<style scoped>
.card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
```

### 表单布局

```vue
<template>
  <SdkworkRow gutter="16">
    <SdkworkCol span="24">
      <SdkworkField label="标题" placeholder="请输入标题" />
    </SdkworkCol>
    
    <SdkworkCol span="12">
      <SdkworkField label="姓名" placeholder="请输入姓名" />
    </SdkworkCol>
    
    <SdkworkCol span="12">
      <SdkworkField label="手机号" placeholder="请输入手机号" />
    </SdkworkCol>
    
    <SdkworkCol span="8">
      <SdkworkField label="省" placeholder="请选择省份" />
    </SdkworkCol>
    
    <SdkworkCol span="8">
      <SdkworkField label="市" placeholder="请选择城市" />
    </SdkworkCol>
    
    <SdkworkCol span="8">
      <SdkworkField label="区" placeholder="请选择区域" />
    </SdkworkCol>
  </SdkworkRow>
</template>
```

## 实例方法

```vue
<template>
  <SdkworkRow>
    <SdkworkCol ref="colRef" span="12">内容</SdkworkCol>
  </SdkworkRow>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const colRef = ref()

// 获取列配置
const getColConfig = () => {
  if (colRef.value) {
    const config = colRef.value.getConfig()
    console.log('列配置:', config)
  }
}
</script>
```

## CSS 变量

```css
/* 浅色主题 */
.sdkwork-col--light {
  --sdkwork-col-bg-color: transparent;
  --sdkwork-col-text-color: var(--sdkwork-text-color, #323233);
}

/* 深色主题 */
.sdkwork-col--dark {
  --sdkwork-col-bg-color: var(--sdkwork-dark-bg-color, #1a1a1a);
  --sdkwork-col-text-color: var(--sdkwork-dark-text-color, #ffffff);
}
```

## 栅格系统

### 24列栅格宽度

| 类名 | 宽度 | 说明 |
|------|------|------|
| `.sdkwork-col--1` | 4.16666667% | 1/24 |
| `.sdkwork-col--2` | 8.33333333% | 2/24 |
| `.sdkwork-col--3` | 12.5% | 3/24 |
| `.sdkwork-col--4` | 16.66666667% | 4/24 |
| `.sdkwork-col--5` | 20.83333333% | 5/24 |
| `.sdkwork-col--6` | 25% | 6/24 |
| `.sdkwork-col--8` | 33.33333333% | 8/24 |
| `.sdkwork-col--12` | 50% | 12/24 |
| `.sdkwork-col--16` | 66.66666667% | 16/24 |
| `.sdkwork-col--24` | 100% | 24/24 |

### 响应式断点

| 断点 | 尺寸 | 说明 |
|------|------|------|
| `xs` | < 768px | 超小屏幕 |
| `sm` | ≥ 768px | 小屏幕 |
| `md` | ≥ 992px | 中等屏幕 |
| `lg` | ≥ 1200px | 大屏幕 |
| `xl` | ≥ 1920px | 超大屏幕 |

## 兼容性说明

### 与 Vant Col 组件对比

| 特性 | SdkworkCol | Vant Col | 说明 |
|------|------------|----------|------|
| API 兼容性 | ✅ 完全兼容 | - | 所有 Props、Events、Slots 完全一致 |
| 主题系统 | ✅ 支持 | ❌ 不支持 | 支持 light/dark/auto 主题模式 |
| TypeScript | ✅ 完整支持 | ✅ 支持 | 提供完整的类型定义 |
| 栅格系统 | ✅ 24列 | ✅ 24列 | 相同的栅格系统实现 |
| 响应式 | ✅ 支持 | ✅ 支持 | 相同的响应式断点 |

### 迁移指南

从 Vant Col 迁移到 SdkworkCol：

```vue
<!-- Vant -->
<van-col span="8" offset="4" order="2">内容</van-col>

<!-- SdkworkCol -->
<SdkworkCol span="8" offset="4" order="2">内容</SdkworkCol>
```

## 注意事项

1. **栅格间隔**：Col 组件会自动从父级 Row 组件获取 `gutter` 值
2. **Flex 布局**：需要父级 Row 设置 `type="flex"` 才能生效
3. **响应式**：支持对象形式的响应式配置
4. **主题模式**：支持独立设置主题，优先级高于父级 Row
5. **偏移量**：`offset` 属性基于 24 列栅格系统计算

## 相关组件

- [SdkworkRow](../sdkwork-row/README.md) - 栅格行组件
- [SdkworkGrid](../sdkwork-grid/README.md) - 栅格系统组件（可选）