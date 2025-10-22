# SdkworkSection 组件

一个功能完整的区域容器组件，支持标题、边框、阴影、折叠等功能，并内置暗黑主题自适应支持。

## 特性

- ✅ 完整的标题支持（文本和插槽）
- ✅ 边框、阴影、圆角样式
- ✅ 可折叠内容区域
- ✅ 多种插槽支持（标题、操作、底部等）
- ✅ 暗黑主题自适应
- ✅ 响应式设计
- ✅ TypeScript 完整类型支持

## 安装

```bash
# 通过 npm
npm install @sdkwork/sdkwork-section

# 通过 yarn
yarn add @sdkwork/sdkwork-section

# 通过 pnpm
pnpm add @sdkwork/sdkwork-section
```

## 快速开始

```vue
<template>
  <SdkworkSection 
    title="基础用法" 
    bordered 
    round
  >
    <p>这是内容区域</p>
  </SdkworkSection>
</template>

<script setup>
import { SdkworkSection } from '@sdkwork/sdkwork-section'
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '' | 标题文本 |
| titleExtra | string | '' | 标题右侧额外内容 |
| bordered | boolean | true | 是否显示边框 |
| shadow | boolean | false | 是否显示阴影 |
| round | boolean | false | 是否显示圆角 |
| fullWidth | boolean | false | 是否占满父容器宽度 |
| collapsible | boolean | false | 是否可折叠 |
| defaultCollapsed | boolean | false | 是否默认折叠 |
| contentPadded | boolean | true | 内容区域是否有内边距 |
| customStyle | Record<string, string \| number> | {} | 自定义样式 |
| themeMode | 'light' \| 'dark' \| 'auto' | 'auto' | 主题模式 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | event: Event | 点击事件 |
| collapse | collapsed: boolean | 折叠/展开事件 |

## Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 内容区域 | - |
| title | 标题区域 | - |
| title-extra | 标题右侧额外内容 | - |
| actions | 操作区域 | - |
| footer | 底部区域 | - |

## 方法

通过 `ref` 可以调用组件实例的方法：

```vue
<template>
  <SdkworkSection ref="sectionRef" title="可折叠区域" collapsible>
    <p>这是内容区域</p>
  </SdkworkSection>
  
  <button @click="expandSection">展开</button>
  <button @click="collapseSection">折叠</button>
</template>

<script setup>
import { ref } from 'vue'
import { SdkworkSection } from '@sdkwork/sdkwork-section'

const sectionRef = ref()

const expandSection = () => {
  sectionRef.value?.expand()
}

const collapseSection = () => {
  sectionRef.value?.collapse()
}
</script>
```

可用方法：

- `expand()`: 展开内容
- `collapse()`: 折叠内容
- `toggle()`: 切换折叠状态
- `getState()`: 获取当前状态

## 主题配置

组件支持三种主题模式：

- `light`: 浅色主题
- `dark`: 深色主题
- `auto`: 自动检测系统主题

### 自定义主题变量

```css
/* 浅色主题变量 */
.sdkwork-section--light {
  --sdkwork-section-bg-color: #ffffff;
  --sdkwork-section-border-color: #ebedf0;
  --sdkwork-section-title-color: #323233;
  --sdkwork-section-extra-color: #969799;
  --sdkwork-section-action-color: #969799;
  --sdkwork-section-action-hover-bg: #f2f3f5;
  --sdkwork-section-action-hover-color: #323233;
  --sdkwork-section-footer-bg: #fafafa;
}

/* 深色主题变量 */
.sdkwork-section--dark {
  --sdkwork-section-bg-color: #1a1a1a;
  --sdkwork-section-border-color: #2d2d2d;
  --sdkwork-section-title-color: #e0e0e0;
  --sdkwork-section-extra-color: #8c8c8c;
  --sdkwork-section-action-color: #8c8c8c;
  --sdkwork-section-action-hover-bg: #2d2d2d;
  --sdkwork-section-action-hover-color: #e0e0e0;
  --sdkwork-section-footer-bg: #2d2d2d;
}
```

## 示例

### 基础用法

```vue
<template>
  <SdkworkSection title="基础区域" bordered>
    <p>这是基础内容区域</p>
  </SdkworkSection>
</template>
```

### 带阴影和圆角

```vue
<template>
  <SdkworkSection title="美化区域" bordered shadow round>
    <p>带阴影和圆角的区域</p>
  </SdkworkSection>
</template>
```

### 可折叠区域

```vue
<template>
  <SdkworkSection 
    title="可折叠区域" 
    collapsible 
    :default-collapsed="true"
    @collapse="handleCollapse"
  >
    <p>点击标题可以折叠/展开这个区域</p>
  </SdkworkSection>
</template>

<script setup>
const handleCollapse = (collapsed) => {
  console.log('区域状态:', collapsed ? '已折叠' : '已展开')
}
</script>
```

### 自定义标题和操作

```vue
<template>
  <SdkworkSection title="自定义区域">
    <template #title>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>📁</span>
        <span>自定义标题</span>
      </div>
    </template>
    
    <template #title-extra>
      <span style="color: #1989fa;">额外信息</span>
    </template>
    
    <template #actions>
      <button @click="handleAction">操作按钮</button>
    </template>
    
    <p>内容区域</p>
    
    <template #footer>
      <div style="text-align: center;">
        <span>底部信息</span>
      </div>
    </template>
  </SdkworkSection>
</template>

<script setup>
const handleAction = () => {
  console.log('操作按钮被点击')
}
</script>
```

### 响应式设计

组件内置了响应式设计，在不同屏幕尺寸下会自动调整内边距和字体大小。

## 类型定义

完整的 TypeScript 类型定义：

```typescript
import type { 
  SdkworkSectionProps, 
  SdkworkSectionEmits, 
  SdkworkSectionSlots,
  SdkworkSectionExpose 
} from '@sdkwork/sdkwork-section'
```

## 浏览器支持

- Chrome ≥ 60
- Firefox ≥ 60
- Safari ≥ 12
- Edge ≥ 79

## 许可证

MIT License