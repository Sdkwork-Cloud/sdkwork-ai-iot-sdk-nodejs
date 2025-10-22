# SdkworkPullRefresh 下拉刷新组件

功能完整的下拉刷新组件，兼容 Vant PullRefresh 组件 API，支持流畅的触摸手势和动画效果。

## 特性

- ✅ 完全兼容 Vant PullRefresh 组件 API
- ✅ 支持 light/dark/auto 主题模式
- ✅ 流畅的触摸手势识别
- ✅ 完整的刷新状态管理
- ✅ 自定义刷新提示内容
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 基础用法

```vue
<template>
  <SdkworkPullRefresh 
    v-model:status="refreshStatus"
    @refresh="onRefresh"
  >
    <div class="content">
      <!-- 页面内容 -->
      <p>下拉刷新内容区域</p>
    </div>
  </SdkworkPullRefresh>
</template>

<script setup>
import { ref } from 'vue'

const refreshStatus = ref('normal')

const onRefresh = () => {
  // 模拟异步刷新操作
  setTimeout(() => {
    refreshStatus.value = 'success'
  }, 1000)
}
</script>

<style scoped>
.content {
  padding: 20px;
  min-height: 200px;
}
</style>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `v-model:status` | `'normal' \| 'pulling' \| 'loosing' \| 'loading' \| 'success'` | `'normal'` | 刷新状态 |
| `disabled` | `boolean` | `false` | 是否禁用下拉刷新 |
| `pullDistance` | `number` | `50` | 触发刷新的下拉距离阈值 |
| `headHeight` | `number` | `50` | 头部高度 |
| `animationDuration` | `number` | `300` | 动画时长（毫秒） |
| `successDuration` | `number` | `500` | 成功提示展示时长（毫秒） |
| `pullingText` | `string` | `'下拉即可刷新...'` | 下拉时提示文字 |
| `loosingText` | `string` | `'释放即可刷新...'` | 释放时提示文字 |
| `loadingText` | `string` | `'加载中...'` | 加载时提示文字 |
| `successText` | `string` | `'刷新成功'` | 成功提示文字 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| `onRefresh` | `() => void` | - | 刷新回调函数 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `refresh` | - | 刷新事件，下拉达到阈值后释放时触发 |
| `update:status` | `status: string` | 状态变化事件 |

## 插槽

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| `pulling` | 下拉状态内容 | - |
| `loosing` | 释放状态内容 | - |
| `loading` | 加载状态内容 | - |
| `success` | 成功状态内容 | - |
| `default` | 页面内容 | - |

## 状态说明

- **normal**: 正常状态，未触发下拉
- **pulling**: 下拉中，未达到阈值
- **loosing**: 下拉达到阈值，可释放刷新
- **loading**: 刷新中
- **success**: 刷新成功

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkPullRefresh theme-mode="auto" />
  
  <!-- 浅色主题 -->
  <SdkworkPullRefresh theme-mode="light" />
  
  <!-- 深色主题 -->
  <SdkworkPullRefresh theme-mode="dark" />
</template>
```

## 高级用法

### 自定义刷新提示

```vue
<template>
  <SdkworkPullRefresh @refresh="onRefresh">
    <!-- 自定义下拉提示 -->
    <template #pulling>
      <div class="custom-pulling">
        <SdkworkIcon icon="material-symbols:arrow-downward" />
        <span>继续下拉刷新</span>
      </div>
    </template>
    
    <!-- 自定义加载提示 -->
    <template #loading>
      <div class="custom-loading">
        <SdkworkIcon icon="material-symbols:refresh" :rotate="180" />
        <span>正在刷新...</span>
      </div>
    </template>
    
    <!-- 页面内容 -->
    <div class="content">页面内容</div>
  </SdkworkPullRefresh>
</template>

<style scoped>
.custom-pulling,
.custom-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
}
</style>
```

### 结合列表使用

```vue
<template>
  <SdkworkPullRefresh @refresh="refreshList">
    <SdkworkCellGroup>
      <SdkworkCell 
        v-for="item in list" 
        :key="item.id"
        :title="item.title"
        :value="item.value"
      />
    </SdkworkCellGroup>
  </SdkworkPullRefresh>
</template>

<script setup>
import { ref } from 'vue'

const list = ref([
  { id: 1, title: '项目1', value: '值1' },
  { id: 2, title: '项目2', value: '值2' }
])

const refreshList = () => {
  // 模拟刷新数据
  setTimeout(() => {
    list.value = [
      { id: 3, title: '新项目1', value: '新值1' },
      { id: 4, title: '新项目2', value: '新值2' }
    ]
  }, 1000)
}
</script>
```

### 手动控制刷新状态

```vue
<template>
  <SdkworkPullRefresh 
    v-model:status="refreshStatus"
    @refresh="onRefresh"
  >
    <div class="content">
      <button @click="startRefresh">手动刷新</button>
    </div>
  </SdkworkPullRefresh>
</template>

<script setup>
import { ref } from 'vue'

const refreshStatus = ref('normal')

const onRefresh = () => {
  // 异步操作
  setTimeout(() => {
    refreshStatus.value = 'success'
  }, 1000)
}

const startRefresh = () => {
  refreshStatus.value = 'loading'
  onRefresh()
}
</script>
```

## CSS 变量

| 变量名 | 默认值（浅色） | 默认值（深色） | 说明 |
|--------|---------------|---------------|------|
| `--sdkwork-pull-refresh-background` | `#f5f5f5` | `#1a1a1a` | 背景色 |
| `--sdkwork-pull-refresh-text-color` | `#969799` | `#888888` | 文本颜色 |
| `--sdkwork-pull-refresh-icon-color` | `#969799` | `#888888` | 图标颜色 |
| `--sdkwork-pull-refresh-loading-color` | `#1989fa` | `#4a9eff` | 加载中颜色 |
| `--sdkwork-pull-refresh-success-color` | `#07c160` | `#0ad168` | 成功颜色 |

## 方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <SdkworkPullRefresh ref="pullRefreshRef" />
  <button @click="triggerRefresh">触发刷新</button>
</template>

<script setup>
import { ref } from 'vue'

const pullRefreshRef = ref()

const triggerRefresh = () => {
  pullRefreshRef.value?.setStatus('loading')
}
</script>
```

可用方法：
- `setStatus(status)`: 设置刷新状态
- `getStatus()`: 获取当前状态
- `reset()`: 重置为初始状态

## 触摸手势

组件支持以下触摸手势：
- **垂直下拉**: 识别垂直方向的下拉动作
- **手势过滤**: 过滤水平滑动，避免误触发
- **距离限制**: 限制最大下拉距离
- **动画过渡**: 流畅的状态切换动画

## 注意事项

1. **内容高度**: 确保内容区域有足够的高度以便下拉
2. **嵌套滚动**: 避免在可滚动容器内嵌套使用
3. **性能优化**: 大量数据刷新时注意性能
4. **移动端适配**: 已针对移动端触摸优化

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 相关链接

- [Vant PullRefresh 组件](https://vant-ui.github.io/vant/#/zh-CN/pull-refresh)
- [Vue 3 触摸事件](https://v3.vuejs.org/guide/events.html#event-handling)