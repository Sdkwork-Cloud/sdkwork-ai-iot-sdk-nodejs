# SDKWork AIoT Vue3 项目架构文档

## 项目概述

本项目是基于 Vue3 + TypeScript + Vant 的移动端 AIoT 应用，采用现代化的前端技术栈和最佳实践。

## 技术栈

- **前端框架**: Vue 3.5+
- **开发语言**: TypeScript
- **UI 组件库**: Vant 4.x
- **状态管理**: Pinia
- **路由管理**: Vue Router 4.x
- **构建工具**: Vite 6.x
- **样式预处理器**: Sass
- **图标系统**: Iconify/Vue

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── layout/           # 布局组件
│   └── business/         # 业务组件
├── pages/               # 页面组件
├── layouts/             # 布局文件
├── stores/              # 状态管理
├── services/            # API 服务
├── types/               # 类型定义
└── utils/               # 工具函数
```

## 图标使用规范

### 图标系统选择

项目统一使用 **Iconify/Vue** 作为图标解决方案，支持多种图标集：

- **Material Design Icons (mdi)**: 用于通用界面图标
- **MingCute Icons (mingcute)**: 用于业务相关图标
- **其他图标集**: 根据需要选择

### 图标使用原则

#### 1. 导入方式
```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
```

#### 2. 基本用法
```vue
<template>
  <Icon icon="mdi:home" width="24" height="24" />
</template>
```

#### 3. 选中/未选中状态
对于需要切换状态的图标，使用填充和轮廓版本：
```vue
<template>
  <Icon 
    :icon="isActive ? 'mingcute:device-fill' : 'mingcute:device-line'" 
    width="24" 
    height="24"
  />
</template>
```

#### 4. 颜色控制
通过 CSS 控制图标颜色：
```css
.icon-active {
  color: var(--van-primary-color);
}
```

### 推荐的图标集

#### 通用界面图标 (mdi)
- 首页: `mdi:home`
- 设置: `mdi:cog`
- 用户: `mdi:account`
- 通知: `mdi:bell`
- 搜索: `mdi:magnify`

#### 业务相关图标 (mingcute)
- 对话: `mingcute:message-3-fill` / `mingcute:message-3-line`
- 智能体: `mingcute:robot-fill` / `mingcute:robot-line`
- 硬件设备: `mingcute:device-fill` / `mingcute:device-line`
- 语音通话: `mingcute:phone-fill` / `mingcute:phone-line`
- 文件: `mingcute:file-fill` / `mingcute:file-line`

### 组件中的图标使用

#### 底部导航栏图标
```vue
<template>
  <van-tabbar-item name="home">
    <template #icon="props">
      <Icon 
        :icon="props.active ? 'mingcute:message-3-fill' : 'mingcute:message-3-line'" 
        width="24" 
        height="24"
      />
    </template>
    对话
  </van-tabbar-item>
</template>
```

#### 按钮中的图标
```vue
<template>
  <van-button @click="handleCall">
    <Icon icon="mingcute:phone-fill" width="16" height="16" />
    通话
  </van-button>
</template>
```

### 最佳实践

1. **尺寸一致性**: 保持图标尺寸一致（通常 16px、24px）
2. **状态切换**: 使用填充/轮廓版本实现选中状态
3. **颜色管理**: 通过 CSS 变量控制图标颜色
4. **性能优化**: 按需导入图标组件
5. **可访问性**: 为图标添加适当的 aria-label

### 禁止使用的图标方案

- ❌ 禁止使用 Vant 内置图标（已弃用）
- ❌ 禁止使用图片作为图标
- ❌ 禁止使用 SVG 内联图标

## 布局系统

### 布局类型
- **default**: 默认布局，包含 header 和主要内容区域
- **tabbar**: 底部导航栏布局，用于主要功能页面

### 布局配置
通过 `definePage` 配置页面布局：
```vue
<route>
{
  meta: {
    layout: 'tabbar',
    title: '页面标题',
    hideHeader: false
  }
}
</route>
```

## 状态管理规范

使用 Pinia 进行状态管理，按模块划分 store：
- `authStore`: 认证相关状态
- `userStore`: 用户信息状态
- `chatStore`: 聊天相关状态
- `deviceStore`: 设备管理状态

## 路由规范

### 路由结构
- `/`: 首页（对话列表）
- `/agents`: 智能体页面
- `/devices`: 硬件设备页面
- `/notifications`: 通知页面
- `/profile`: 个人中心
- `/chat/[id]`: 聊天详情页

### 动态路由
使用文件系统路由自动生成：
```bash
src/pages/chat/[id].vue  # 对应路由 /chat/:id
```

## 样式规范

### CSS 架构
- 使用 Sass 预处理器
- 采用 BEM 命名规范
- 使用 CSS 变量统一主题色
- 移动端优先的响应式设计

### 组件样式
```scss
.component-name {
  &__element {
    // 元素样式
  }
  
  &--modifier {
    // 修饰符样式
  }
}
```

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API
- 使用 ESLint + Prettier 代码格式化
- 组件命名采用 kebab-case

### 文件命名
- 组件: `component-name/component-name.vue`
- 页面: 使用路由路径命名
- 工具函数: 使用 camelCase 命名

## 构建部署

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 环境变量
使用 Vite 环境变量：
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 性能优化

- 组件懒加载
- 图片懒加载
- 代码分割
- 缓存策略优化

---

*最后更新: 2025-09-27*