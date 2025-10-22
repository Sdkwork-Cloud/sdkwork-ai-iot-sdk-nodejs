# SdkworkCell 单元格组件

功能完整的单元格组件，兼容 Vant Cell 组件 API，支持丰富的布局和交互功能。

## 特性

- ✅ 完全兼容 Vant Cell 组件 API
- ✅ 支持 light/dark/auto 主题模式
- ✅ 灵活的布局配置
- ✅ 图标、标题、值、链接支持
- ✅ 点击事件和路由跳转
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 基础用法

```vue
<template>
  <SdkworkCell 
    title="单元格标题"
    value="单元格值"
    is-link
  />
  
  <SdkworkCell 
    title="带图标的单元格"
    value="值"
    icon="material-symbols:home-rounded"
    is-link
  />
  
  <SdkworkCell 
    title="带描述的单元格"
    label="描述信息"
    value="值"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 标题 |
| `label` | `string` | - | 标题下方的描述信息 |
| `value` | `string` | - | 右侧内容 |
| `icon` | `string` | - | 左侧图标名称 |
| `rightIcon` | `string` | - | 右侧图标名称 |
| `iconSize` | `string \| number` | `16` | 图标尺寸 |
| `border` | `boolean` | `true` | 是否显示边框 |
| `isLink` | `boolean` | `false` | 是否显示右侧箭头 |
| `disabled` | `boolean` | `false` | 是否禁用单元格 |
| `center` | `boolean` | `false` | 是否将内容居中 |
| `required` | `boolean` | `false` | 是否必填 |
| `url` | `string` | - | 点击后跳转的链接地址 |
| `replace` | `boolean` | `false` | 点击后跳转方式 |
| `to` | `string \| object` | - | 点击后跳转的目标路由 |
| `size` | `'large'` | - | 单元格大小 |
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
| `icon` | 自定义左侧图标 |
| `title` | 自定义标题区域 |
| `value` | 自定义值区域 |
| `right-icon` | 自定义右侧图标 |
| `extra` | 自定义额外内容 |
| `default` | 默认插槽内容 |

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkCell title="自动主题" theme-mode="auto" />
  
  <!-- 浅色主题 -->
  <SdkworkCell title="浅色主题" theme-mode="light" />
  
  <!-- 深色主题 -->
  <SdkworkCell title="深色主题" theme-mode="dark" />
</template>
```

## 高级用法

### 自定义内容

```vue
<template>
  <SdkworkCell>
    <template #icon>
      <SdkworkIcon icon="material-symbols:star" color="gold" />
    </template>
    
    <template #title>
      <div class="custom-title">
        <span class="title-text">自定义标题</span>
        <span class="title-badge">NEW</span>
      </div>
    </template>
    
    <template #value>
      <div class="custom-value">
        <span>自定义值</span>
        <SdkworkIcon icon="material-symbols:chevron-right" />
      </div>
    </template>
  </SdkworkCell>
</template>

<style scoped>
.custom-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-badge {
  background: #ff6b6b;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
}

.custom-value {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #969799;
}
</style>
```

### 路由跳转

```vue
<template>
  <SdkworkCell 
    title="跳转到详情页"
    is-link
    to="/detail"
  />
  
  <SdkworkCell 
    title="替换当前页面"
    is-link
    to="/new-page"
    replace
  />
</template>
```

### 表单单元格

```vue
<template>
  <SdkworkCellGroup title="表单信息">
    <SdkworkCell 
      title="用户名"
      value="张三"
      required
    />
    
    <SdkworkCell 
      title="手机号"
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

### 列表项

```vue
<template>
  <SdkworkCellGroup>
    <SdkworkCell 
      v-for="item in list"
      :key="item.id"
      :title="item.title"
      :value="item.value"
      :is-link="item.link"
      @click="handleItemClick(item)"
    />
  </SdkworkCellGroup>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([
  { id: 1, title: '设置', value: '>', link: true },
  { id: 2, title: '关于', value: 'v1.0.0', link: false },
  { id: 3, title: '帮助', value: '', link: true }
])

const handleItemClick = (item) => {
  console.log('点击了:', item.title)
}
</script>
```

## CSS 变量

| 变量名 | 默认值（浅色） | 默认值（深色） | 说明 |
|--------|---------------|---------------|------|
| `--sdkwork-cell-background` | `#ffffff` | `#1a1a1a` | 背景色 |
| `--sdkwork-cell-text-color` | `#323233` | `#ffffff` | 文本颜色 |
| `--sdkwork-cell-label-color` | `#969799` | `#888888` | 描述文本颜色 |
| `--sdkwork-cell-value-color` | `#969799` | `#888888` | 值文本颜色 |
| `--sdkwork-cell-border-color` | `#ebedf0` | `#3a3a3a` | 边框颜色 |
| `--sdkwork-cell-icon-color` | `#969799` | `#888888` | 图标颜色 |
| `--sdkwork-cell-required-color` | `#ee0a24` | `#ff4d4f` | 必填标识颜色 |
| `--sdkwork-cell-disabled-color` | `#c8c9cc` | `#555555` | 禁用状态颜色 |

## 方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <SdkworkCell ref="cellRef" title="可操作的单元格" />
  <button @click="getCellInfo">获取单元格信息</button>
</template>

<script setup>
import { ref } from 'vue'

const cellRef = ref()

const getCellInfo = () => {
  if (cellRef.value) {
    console.log('标题:', cellRef.value.getTitle())
    console.log('值:', cellRef.value.getValue())
  }
}
</script>
```

可用方法：
- `getTitle()`: 获取单元格标题
- `getValue()`: 获取单元格值
- `isClickable()`: 是否可点击
- `isDisabled()`: 是否禁用

## 布局模式

### 默认布局
```vue
<template>
  <SdkworkCell 
    title="默认布局"
    value="值"
  />
</template>
```

### 居中布局
```vue
<template>
  <SdkworkCell 
    title="居中布局"
    value="值"
    center
  />
</template>
```

### 大尺寸
```vue
<template>
  <SdkworkCell 
    title="大尺寸单元格"
    value="值"
    size="large"
  />
</template>
```

## 注意事项

1. **路由集成**: 需要配合路由库使用 `to` 属性
2. **样式覆盖**: 使用 `customStyle` 进行自定义样式
3. **无障碍支持**: 提供适当的 ARIA 属性
4. **性能优化**: 大量单元格使用时注意渲染性能

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 相关链接

- [Vant Cell 组件](https://vant-ui.github.io/vant/#/zh-CN/cell)
- [Vue Router](https://router.vuejs.org/)
- [Iconify 图标](https://iconify.design/)