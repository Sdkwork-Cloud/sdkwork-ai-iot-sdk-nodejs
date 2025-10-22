# SdkworkImage 图片组件

功能完整的图片组件，兼容 Vant Image 组件 API，支持丰富的图片展示和加载状态功能。

## 特性

- ✅ 完全兼容 Vant Image 组件 API
- ✅ 支持 light/dark/auto 主题模式
- ✅ 多种图片填充模式
- ✅ 加载状态和错误状态处理
- ✅ 圆形图片和自定义圆角
- ✅ 懒加载支持
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 基础用法

```vue
<template>
  <!-- 基础用法 -->
  <SdkworkImage 
    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    width="100"
    height="100"
  />
  
  <!-- 圆形图片 -->
  <SdkworkImage 
    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    width="100"
    height="100"
    round
  />
  
  <!-- 填充模式 -->
  <SdkworkImage 
    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    width="100"
    height="100"
    fit="cover"
  />
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | - | 图片链接 |
| `alt` | `string` | - | 替代文本 |
| `fit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'fill'` | 图片填充模式 |
| `position` | `'center' \| 'top' \| 'right' \| 'bottom' \| 'left' \| string` | `'center'` | 图片位置 |
| `round` | `boolean` | `false` | 是否显示为圆形 |
| `block` | `boolean` | `false` | 是否将图片显示为块级元素 |
| `width` | `string \| number` | - | 宽度 |
| `height` | `string \| number` | - | 高度 |
| `radius` | `string \| number` | - | 圆角大小 |
| `lazy` | `boolean` | `false` | 是否开启懒加载 |
| `lazyOffset` | `string \| number` | `0` | 懒加载偏移量 |
| `showError` | `boolean` | `true` | 是否显示图片加载失败提示 |
| `showLoading` | `boolean` | `true` | 是否显示图片加载中提示 |
| `loadingIcon` | `string` | `'material-symbols:image-outline-rounded'` | 自定义加载图标 |
| `loadingIconSize` | `string \| number` | `32` | 自定义加载图标大小 |
| `loadingText` | `string` | `'加载中...'` | 自定义加载文字 |
| `errorIcon` | `string` | `'material-symbols:broken-image-rounded'` | 自定义失败图标 |
| `errorIconSize` | `string \| number` | `32` | 自定义失败图标大小 |
| `errorText` | `string` | `'加载失败'` | 自定义失败文字 |
| `customStyle` | `Record<string, string \| number>` | - | 自定义样式 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| `onClick` | `(event: Event) => void` | - | 点击事件回调 |
| `onLoad` | `(event: Event) => void` | - | 加载完成事件回调 |
| `onError` | `(event: Event) => void` | - | 加载失败事件回调 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `event: Event` | 点击事件 |
| `load` | `event: Event` | 加载完成事件 |
| `error` | `event: Event` | 加载失败事件 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `loading` | 自定义加载状态内容 |
| `error` | 自定义错误状态内容 |
| `default` | 默认插槽内容 |

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkImage 
    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    width="100"
    height="100"
    theme-mode="auto"
  />
  
  <!-- 浅色主题 -->
  <SdkworkImage 
    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    width="100"
    height="100"
    theme-mode="light"
  />
  
  <!-- 深色主题 -->
  <SdkworkImage 
    src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    width="100"
    height="100"
    theme-mode="dark"
  />
</template>
```

## 高级用法

### 自定义加载和错误状态

```vue
<template>
  <SdkworkImage 
    src="https://example.com/image.jpg"
    width="200"
    height="200"
  >
    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="custom-loading">
        <SdkworkIcon icon="material-symbols:hourglass-top" />
        <span>图片加载中...</span>
      </div>
    </template>
    
    <!-- 自定义错误状态 -->
    <template #error>
      <div class="custom-error">
        <SdkworkIcon icon="material-symbols:error-outline" />
        <span>图片加载失败</span>
        <button @click="reloadImage">重新加载</button>
      </div>
    </template>
  </SdkworkImage>
</template>

<script setup>
const reloadImage = () => {
  // 重新加载图片的逻辑
}
</script>

<style scoped>
.custom-loading,
.custom-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}
</style>
```

### 图片画廊

```vue
<template>
  <div class="image-gallery">
    <SdkworkImage 
      v-for="(image, index) in images"
      :key="index"
      :src="image.src"
      :alt="image.alt"
      width="100"
      height="100"
      round
      fit="cover"
      @click="openGallery(index)"
    />
  </div>
</template>

<script setup>
const images = [
  { src: 'image1.jpg', alt: '图片1' },
  { src: 'image2.jpg', alt: '图片2' },
  { src: 'image3.jpg', alt: '图片3' }
]

const openGallery = (index) => {
  // 打开图片画廊的逻辑
}
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 16px;
}
</style>
```

### 响应式图片

```vue
<template>
  <div class="responsive-container">
    <SdkworkImage 
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      :width="imageWidth"
      :height="imageHeight"
      :fit="imageFit"
      block
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const imageWidth = computed(() => {
  return window.innerWidth > 768 ? '300px' : '200px'
})

const imageHeight = computed(() => {
  return window.innerWidth > 768 ? '200px' : '150px'
})

const imageFit = computed(() => {
  return window.innerWidth > 768 ? 'cover' : 'contain'
})
</script>

<style scoped>
.responsive-container {
  max-width: 100%;
  overflow: hidden;
}
</style>
```

### 懒加载图片列表

```vue
<template>
  <div class="lazy-image-list">
    <SdkworkImage 
      v-for="(item, index) in lazyImages"
      :key="index"
      :src="item.src"
      :alt="item.alt"
      width="100%"
      height="200"
      lazy
      :lazy-offset="100"
      fit="cover"
    />
  </div>
</template>

<script setup>
const lazyImages = [
  { src: 'image1.jpg', alt: '图片1' },
  { src: 'image2.jpg', alt: '图片2' },
  { src: 'image3.jpg', alt: '图片3' },
  // ... 更多图片
]
</script>

<style scoped>
.lazy-image-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

## 方法

通过 ref 可以调用组件的方法：

```vue
<template>
  <SdkworkImage 
    ref="imageRef"
    src="https://example.com/image.jpg"
    width="200"
    height="200"
  />
  <button @click="reload">重新加载</button>
</template>

<script setup>
import { ref } from 'vue'

const imageRef = ref()

const reload = () => {
  if (imageRef.value) {
    imageRef.value.reload()
  }
}
</script>
```

## 主题变量

组件支持以下 CSS 自定义属性：

### 浅色主题
```css
--sdkwork-image-background: #f7f8fa;
--sdkwork-image-text-color: #969799;
--sdkwork-image-icon-color: #c8c9cc;
```

### 深色主题
```css
--sdkwork-image-background: #2a2a2a;
--sdkwork-image-text-color: #888;
--sdkwork-image-icon-color: #555;
```

## 兼容性说明

- 完全兼容 Vant Image 组件的所有 Props、Events 和 Slots
- 支持 Vue 3 Composition API
- 支持 TypeScript 类型检查
- 支持 SSR（服务端渲染）
- 支持移动端触摸事件
- 支持无障碍访问（ARIA）