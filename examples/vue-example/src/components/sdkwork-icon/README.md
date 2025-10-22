# SdkworkIcon 图标组件

基于 iconify/vue 的图标组件，提供统一的图标使用体验，完全兼容 Vant 图标组件标准。

## 特性

- ✅ 完全兼容 iconify/vue 图标库
- ✅ 支持 light/dark/auto 主题模式
- ✅ 灵活的尺寸、颜色、旋转控制
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 安装

```bash
npm install @iconify/vue
```

## 基础用法

```vue
<template>
  <SdkworkIcon icon="material-symbols:home-rounded" />
  <SdkworkIcon icon="material-symbols:search" width="24" height="24" />
  <SdkworkIcon icon="material-symbols:favorite" color="#ff6b6b" />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `icon` | `string` | - | 图标名称，格式：`collection:icon-name` |
| `width` | `string \| number` | `16` | 图标宽度 |
| `height` | `string \| number` | `16` | 图标高度 |
| `color` | `string` | `currentColor` | 图标颜色 |
| `rotate` | `number` | `0` | 旋转角度（0-360） |
| `flip` | `string` | - | 翻转方向：`horizontal`、`vertical` |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `event: Event` | 点击事件 |

## 插槽

无插槽支持，使用 `icon` prop 指定图标。

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkIcon icon="material-symbols:sunny" theme-mode="auto" />
  
  <!-- 强制浅色主题 -->
  <SdkworkIcon icon="material-symbols:sunny" theme-mode="light" />
  
  <!-- 强制深色主题 -->
  <SdkworkIcon icon="material-symbols:dark-mode" theme-mode="dark" />
</template>
```

## 图标集合

支持所有 iconify 图标集合：

- **Material Symbols**: `material-symbols:*`
- **Material Design Icons**: `mdi:*`
- **Feather Icons**: `fe:*`
- **Font Awesome**: `fa6-*`
- **Ant Design Icons**: `ant-design:*`

## 高级用法

### 动态图标

```vue
<template>
  <SdkworkIcon :icon="currentIcon" />
</template>

<script setup>
import { ref } from 'vue'

const currentIcon = ref('material-symbols:home-rounded')

// 动态切换图标
const toggleIcon = () => {
  currentIcon.value = currentIcon.value === 'material-symbols:home-rounded' 
    ? 'material-symbols:favorite' 
    : 'material-symbols:home-rounded'
}
</script>
```

### 旋转动画

```vue
<template>
  <SdkworkIcon 
    icon="material-symbols:refresh" 
    :rotate="rotation" 
    class="rotating-icon"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const rotation = ref(0)

onMounted(() => {
  setInterval(() => {
    rotation.value = (rotation.value + 45) % 360
  }, 1000)
})
</script>

<style scoped>
.rotating-icon {
  transition: transform 0.3s ease;
}
</style>
```

## CSS 变量

| 变量名 | 默认值（浅色） | 默认值（深色） | 说明 |
|--------|---------------|---------------|------|
| `--sdkwork-icon-color` | `currentColor` | `currentColor` | 图标颜色 |
| `--sdkwork-icon-size` | `16px` | `16px` | 图标尺寸 |

## 注意事项

1. **图标加载**: 首次使用图标时可能需要加载图标字体
2. **性能优化**: 大量图标使用时考虑预加载常用图标
3. **离线支持**: 生产环境建议将图标打包到本地

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 相关链接

- [Iconify 官方文档](https://iconify.design/docs/)
- [Vant Icon 组件](https://vant-ui.github.io/vant/#/zh-CN/icon)
- [Material Symbols](https://fonts.google.com/icons)