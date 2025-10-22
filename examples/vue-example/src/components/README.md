# SDKWork Vue 组件库开发标准

本文档定义了 SDKWork Vue 组件库的开发标准和规范，确保所有组件具有一致的 API 设计、主题系统和用户体验。

## 设计原则

### 1. Vant 兼容性
- 所有组件 API 设计保持与 Vant UI 库完全兼容
- 支持相同的 props、events、slots 和 methods
- 确保现有 Vant 项目可以无缝迁移

### 2. 主题系统
- 支持 `light`、`dark`、`auto` 三种主题模式
- 自动检测系统暗黑模式偏好
- 使用 CSS 变量实现主题切换

### 3. TypeScript 支持
- 完整的 TypeScript 类型定义
- 严格的类型检查和自动补全
- 与 Vue 3 Composition API 完美集成

## 组件开发标准

### 文件结构
```
src/components/
├── sdkwork-component-name/
│   ├── sdkwork-component-name.vue      # 组件主文件
│   └── index.ts                         # 组件导出文件
└── README.md                            # 开发标准文档
```

### Props 定义规范
```typescript
interface Props {
  /** 属性描述 */
  propName?: type
  // ... 其他属性
}

const props = withDefaults(defineProps<Props>(), {
  propName: defaultValue,
  // ... 其他默认值
})
```

### 事件定义规范
```typescript
const emit = defineEmits<{
  /** 事件描述 */
  eventName: [param1: type, param2: type]
  // ... 其他事件
}>()
```

### 插槽定义规范
```typescript
defineSlots<{
  /** 插槽描述 */
  slotName?: () => any
  // ... 其他插槽
}>()
```

### 主题系统实现
```typescript
// Dark mode support
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-component--dark' : 'sdkwork-component--light'
})
```

### CSS 变量命名规范
```scss
// 组件前缀 + 用途描述
--sdkwork-component-property: value;

// 示例
--sdkwork-button-background: #007bff;
--sdkwork-button-text-color: #fff;
```

## 已实现组件

### 1. SdkworkIcon
- **功能**: 图标组件，兼容 iconify/vue
- **API**: 完全兼容 iconify/vue 标准
- **特性**: 支持尺寸、颜色、旋转、翻转等属性

### 2. SdkworkSearchBar
- **功能**: 搜索框组件
- **API**: 兼容 Vant Search 组件
- **特性**: 支持清除按钮、取消按钮、暗黑模式

### 3. SdkworkPullRefresh
- **功能**: 下拉刷新组件
- **API**: 兼容 Vant PullRefresh 组件
- **特性**: 完整的状态管理、触摸手势、动画效果

### 4. SdkworkCell
- **功能**: 单元格组件
- **API**: 兼容 Vant Cell 组件
- **特性**: 支持图标、标题、值、链接、边框等

### 5. SdkworkCellGroup
- **功能**: 单元格分组组件
- **API**: 兼容 Vant CellGroup 组件
- **特性**: 支持标题、卡片风格、内嵌风格

## 组件使用示例

### 基本使用
```vue
<template>
  <SdkworkCellGroup title="基本信息">
    <SdkworkCell 
      title="用户名" 
      value="张三" 
      is-link 
    />
    <SdkworkCell 
      title="手机号" 
      value="138****8888" 
      icon="material-symbols:phone-rounded"
    />
  </SdkworkCellGroup>
</template>
```

### 主题配置
```vue
<template>
  <SdkworkSearchBar 
    v-model="searchValue"
    theme-mode="dark"
    placeholder="搜索内容"
  />
</template>
```

### 事件处理
```vue
<template>
  <SdkworkPullRefresh 
    v-model:status="refreshStatus"
    @refresh="onRefresh"
  >
    <!-- 内容 -->
  </SdkworkPullRefresh>
</template>

<script setup>
const refreshStatus = ref('normal')

const onRefresh = () => {
  // 执行刷新操作
  setTimeout(() => {
    refreshStatus.value = 'success'
  }, 1000)
}
</script>
```

## 开发指南

### 1. 创建新组件
1. 在 `src/components/` 下创建组件目录
2. 按照标准模板编写组件代码
3. 添加完整的 TypeScript 类型定义
4. 实现主题系统支持
5. 编写单元测试

### 2. 组件测试
- 测试所有 props 的功能
- 验证事件触发的正确性
- 检查主题切换的效果
- 确保移动端触摸交互正常

### 3. 文档编写
- 提供完整的使用示例
- 说明所有可用的 props、events、slots
- 包含主题配置说明
- 添加常见问题解答

## 最佳实践

### 1. 性能优化
- 使用 `v-show` 替代 `v-if` 当需要频繁切换显示时
- 合理使用计算属性和侦听器
- 避免不必要的重新渲染

### 2. 可访问性
- 提供适当的 ARIA 属性
- 支持键盘导航
- 确保颜色对比度符合 WCAG 标准

### 3. 移动端适配
- 使用触摸事件而非鼠标事件
- 考虑移动端手势交互
- 优化移动端性能

## 故障排除

### 常见问题
1. **主题不生效**: 检查 CSS 变量是否正确定义
2. **TypeScript 错误**: 验证类型定义是否完整
3. **事件不触发**: 确认事件名称和参数类型正确

### 调试技巧
- 使用 Vue Devtools 检查组件状态
- 在关键方法添加 console.log 调试
- 测试不同主题模式下的表现

## 贡献指南

欢迎贡献代码！请确保：
1. 遵循本文档的开发标准
2. 为新功能添加相应的测试
3. 更新相关文档
4. 通过所有现有测试

---

*最后更新: 2024-01-20*