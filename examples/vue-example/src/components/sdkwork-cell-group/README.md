# SdkworkCellGroup 单元格分组组件

功能完整的单元格分组组件，兼容 Vant CellGroup 组件 API，支持多种分组样式和主题模式。

## 特性

- ✅ 完全兼容 Vant CellGroup 组件 API
- ✅ 支持 light/dark/auto 主题模式
- ✅ 多种分组样式：普通、卡片、内嵌
- ✅ 灵活的边框控制
- ✅ 标题和内容区域自定义
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 基础用法

```vue
<template>
  <!-- 普通分组 -->
  <SdkworkCellGroup title="基本信息">
    <SdkworkCell title="用户名" value="张三" />
    <SdkworkCell title="手机号" value="138****8888" />
    <SdkworkCell title="邮箱" value="example@email.com" />
  </SdkworkCellGroup>
  
  <!-- 卡片风格分组 -->
  <SdkworkCellGroup title="卡片风格" card>
    <SdkworkCell title="项目1" value="值1" />
    <SdkworkCell title="项目2" value="值2" />
  </SdkworkCellGroup>
  
  <!-- 内嵌风格分组 -->
  <SdkworkCellGroup title="内嵌风格" inset>
    <SdkworkCell title="设置1" value="设置值1" />
    <SdkworkCell title="设置2" value="设置值2" />
  </SdkworkCellGroup>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 分组标题 |
| `border` | `boolean` | `true` | 是否显示外边框 |
| `card` | `boolean` | `false` | 是否为圆角卡片风格 |
| `inset` | `boolean` | `false` | 是否为内嵌风格 |
| `customStyle` | `Record<string, string \| number>` | - | 自定义样式 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `title` | 自定义标题区域 |
| `default` | 分组内容，通常包含多个 SdkworkCell |

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkCellGroup title="自动主题" theme-mode="auto">
    <SdkworkCell title="单元格1" value="值1" />
  </SdkworkCellGroup>
  
  <!-- 浅色主题 -->
  <SdkworkCellGroup title="浅色主题" theme-mode="light">
    <SdkworkCell title="单元格2" value="值2" />
  </SdkworkCellGroup>
  
  <!-- 深色主题 -->
  <SdkworkCellGroup title="深色主题" theme-mode="dark">
    <SdkworkCell title="单元格3" value="值3" />
  </SdkworkCellGroup>
</template>
```

## 高级用法

### 自定义标题

```vue
<template>
  <SdkworkCellGroup>
    <template #title>
      <div class="custom-title">
        <SdkworkIcon icon="material-symbols:settings" />
        <span>自定义标题</span>
        <span class="title-badge">3项</span>
      </div>
    </template>
    
    <SdkworkCell title="设置项1" value="值1" />
    <SdkworkCell title="设置项2" value="值2" />
    <SdkworkCell title="设置项3" value="值3" />
  </SdkworkCellGroup>
</template>

<style scoped>
.custom-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 16px 8px;
  color: #969799;
  font-size: 14px;
}

.title-badge {
  background: #1989fa;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
}
</style>
```

### 无边框分组

```vue
<template>
  <SdkworkCellGroup title="无边框分组" :border="false">
    <SdkworkCell title="项目1" value="值1" />
    <SdkworkCell title="项目2" value="值2" />
    <SdkworkCell title="项目3" value="值3" />
  </SdkworkCellGroup>
</template>
```

### 动态内容分组

```vue
<template>
  <SdkworkCellGroup :title="groupTitle">
    <SdkworkCell 
      v-for="item in items" 
      :key="item.id"
      :title="item.title"
      :value="item.value"
      :is-link="item.link"
      @click="handleItemClick(item)"
    />
  </SdkworkCellGroup>
</template>

<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, title: '动态项1', value: '值1', link: true },
  { id: 2, title: '动态项2', value: '值2', link: false },
  { id: 3, title: '动态项3', value: '值3', link: true }
])

const groupTitle = computed(() => `分组标题 (${items.value.length}项)`)

const handleItemClick = (item) => {
  console.log('点击了:', item.title)
}
</script>
```

### 表单分组

```vue
<template>
  <SdkworkCellGroup title="个人信息" card>
    <SdkworkCell 
      title="姓名" 
      value="张三" 
      required 
    />
    <SdkworkCell 
      title="年龄" 
      value="25" 
    />
    <SdkworkCell 
      title="职业" 
      value="工程师" 
      is-link
    />
  </SdkworkCellGroup>
  
  <SdkworkCellGroup title="联系方式" inset>
    <SdkworkCell 
      title="手机" 
      value="138****8888" 
      icon="material-symbols:phone"
    />
    <SdkworkCell 
      title="邮箱" 
      value="example@email.com" 
      icon="material-symbols:email"
      is-link
    />
  </SdkworkCellGroup>
</template>
```

## CSS 变量

| 变量名 | 默认值（浅色） | 默认值（深色） | 说明 |
|--------|---------------|---------------|------|
| `--sdkwork-cell-group-background` | `transparent` | `transparent` | 分组背景色 |
| `--sdkwork-cell-group-title-color` | `#969799` | `#888888` | 标题颜色 |
| `--sdkwork-cell-group-content-background` | `#ffffff` | `#1a1a1a` | 内容区域背景色 |
| `--sdkwork-cell-group-border-color` | `#ebedf0` | `#3a3a3a` | 边框颜色 |

## 方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <SdkworkCellGroup ref="groupRef" title="可操作分组">
    <SdkworkCell title="单元格1" value="值1" />
  </SdkworkCellGroup>
  
  <button @click="getGroupInfo">获取分组信息</button>
</template>

<script setup>
import { ref } from 'vue'

const groupRef = ref()

const getGroupInfo = () => {
  if (groupRef.value) {
    console.log('标题:', groupRef.value.getTitle())
    console.log('是否有边框:', groupRef.value.hasBorder())
    console.log('是否为卡片风格:', groupRef.value.isCard())
  }
}
</script>
```

可用方法：
- `getTitle()`: 获取分组标题
- `hasBorder()`: 是否显示边框
- `isCard()`: 是否为卡片风格

## 分组样式

### 普通分组 (默认)
- 无外边距
- 直角边框
- 适合列表展示

### 卡片风格 (`card`)
- 16px 外边距
- 8px 圆角边框
- 适合独立内容区块

### 内嵌风格 (`inset`)
- 左右 16px 外边距
- 8px 圆角边框
- 适合页面内嵌内容

## 边框处理

组件智能处理内部单元格的边框显示：
- 最后一个单元格不显示底部边框
- 卡片和内嵌风格中调整边框位置
- 无边框模式下完全隐藏边框

## 注意事项

1. **嵌套使用**: 可以嵌套多个分组组件
2. **内容高度**: 分组内容会自动适应内部单元格高度
3. **主题一致性**: 分组内的单元格会自动继承分组主题
4. **性能优化**: 大量分组使用时注意渲染性能

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 相关链接

- [Vant CellGroup 组件](https://vant-ui.github.io/vant/#/zh-CN/cell)
- [Vue 3 插槽系统](https://v3.vuejs.org/guide/component-slots.html)
- [CSS 变量指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)