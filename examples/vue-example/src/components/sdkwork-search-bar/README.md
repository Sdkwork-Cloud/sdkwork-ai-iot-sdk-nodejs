# SdkworkSearchBar 搜索框组件

功能完整的搜索框组件，兼容 Vant Search 组件 API，支持暗黑模式和丰富的交互功能。

## 特性

- ✅ 完全兼容 Vant Search 组件 API
- ✅ 支持 light/dark/auto 主题模式
- ✅ 清除按钮、取消按钮、搜索图标
- ✅ 输入框焦点控制
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 基础用法

```vue
<template>
  <SdkworkSearchBar 
    v-model="searchValue"
    placeholder="搜索内容"
    @search="onSearch"
  />
</template>

<script setup>
import { ref } from 'vue'

const searchValue = ref('')

const onSearch = (value: string) => {
  console.log('搜索:', value)
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `v-model` | `string` | `''` | 绑定值 |
| `placeholder` | `string` | `'请输入搜索关键词'` | 占位符文本 |
| `shape` | `'square' \| 'round'` | `'square'` | 搜索框形状 |
| `background` | `string` | `'#f2f2f2'` | 搜索框背景色 |
| `maxlength` | `number` | - | 最大输入长度 |
| `clearable` | `boolean` | `true` | 是否显示清除按钮 |
| `clearTrigger` | `'focus' \| 'always'` | `'focus'` | 清除按钮显示时机 |
| `autofocus` | `boolean` | `false` | 是否自动聚焦 |
| `showAction` | `boolean` | `false` | 是否显示取消按钮 |
| `actionText` | `string` | `'取消'` | 取消按钮文字 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `leftIcon` | `string` | `'material-symbols:search'` | 左侧图标 |
| `rightIcon` | `string` | - | 右侧图标 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `search` | `value: string` | 点击搜索按钮或按回车键时触发 |
| `change` | `value: string` | 输入框内容变化时触发 |
| `focus` | `event: Event` | 输入框聚焦时触发 |
| `blur` | `event: Event` | 输入框失焦时触发 |
| `clear` | - | 点击清除按钮时触发 |
| `cancel` | - | 点击取消按钮时触发 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `left` | 自定义左侧内容 |
| `action` | 自定义右侧操作区域 |
| `right-icon` | 自定义右侧图标 |

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkSearchBar theme-mode="auto" />
  
  <!-- 浅色主题 -->
  <SdkworkSearchBar theme-mode="light" />
  
  <!-- 深色主题 -->
  <SdkworkSearchBar theme-mode="dark" />
</template>
```

## 高级用法

### 带取消按钮的搜索

```vue
<template>
  <SdkworkSearchBar 
    v-model="searchValue"
    show-action
    action-text="取消"
    @search="onSearch"
    @cancel="onCancel"
  />
</template>

<script setup>
import { ref } from 'vue'

const searchValue = ref('')

const onSearch = (value: string) => {
  console.log('搜索:', value)
}

const onCancel = () => {
  searchValue.value = ''
  console.log('取消搜索')
}
</script>
```

### 自定义搜索按钮

```vue
<template>
  <SdkworkSearchBar v-model="searchValue">
    <template #action>
      <button @click="onCustomSearch" class="custom-search-btn">
        搜索
      </button>
    </template>
  </SdkworkSearchBar>
</template>

<script setup>
import { ref } from 'vue'

const searchValue = ref('')

const onCustomSearch = () => {
  console.log('自定义搜索:', searchValue.value)
}
</script>

<style scoped>
.custom-search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 防抖搜索

```vue
<template>
  <SdkworkSearchBar 
    v-model="searchValue"
    @change="onSearchChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash-es'

const searchValue = ref('')

// 防抖搜索函数
const debouncedSearch = debounce((value: string) => {
  console.log('防抖搜索:', value)
}, 500)

const onSearchChange = (value: string) => {
  debouncedSearch(value)
}
</script>
```

## CSS 变量

| 变量名 | 默认值（浅色） | 默认值（深色） | 说明 |
|--------|---------------|---------------|------|
| `--sdkwork-search-background` | `#f2f2f2` | `#2a2a2a` | 搜索框背景色 |
| `--sdkwork-search-text-color` | `#323233` | `#ffffff` | 文本颜色 |
| `--sdkwork-search-placeholder-color` | `#969799` | `#888888` | 占位符颜色 |
| `--sdkwork-search-border-color` | `#ebedf0` | `#3a3a3a` | 边框颜色 |
| `--sdkwork-search-action-color` | `#1989fa` | `#4a9eff` | 操作按钮颜色 |

## 方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <SdkworkSearchBar ref="searchRef" />
  <button @click="focusSearch">聚焦搜索框</button>
</template>

<script setup>
import { ref } from 'vue'

const searchRef = ref()

const focusSearch = () => {
  searchRef.value?.focus()
}
</script>
```

可用方法：
- `focus()`: 聚焦输入框
- `blur()`: 失焦输入框
- `clear()`: 清空输入框

## 注意事项

1. **移动端适配**: 组件已针对移动端进行优化
2. **键盘事件**: 支持回车键触发搜索
3. **无障碍支持**: 提供适当的 ARIA 属性
4. **性能优化**: 大量搜索框使用时注意防抖处理

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 相关链接

- [Vant Search 组件](https://vant-ui.github.io/vant/#/zh-CN/search)
- [Vue 3 组合式 API](https://v3.vuejs.org/api/composition-api.html)