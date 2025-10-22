# SDKWork Auth Login Component

## 组件概述

完全重构的登录组件，采用科技蓝(#2B6CB0)主色系，具备完善的深浅主题切换、响应式布局和表单验证功能。

## 主要特性

### 🎨 视觉设计
- **科技蓝配色方案**: 基于 #2B6CB0 构建的专业配色系统
- **WCAG AA级对比度**: 确保所有文本在深浅模式下均保持可读性
- **精致细节处理**: 通过微交互和动画传递高端产品质感

### 🌙 主题系统
- **自动检测系统主题**: 自动适配用户系统偏好
- **强制主题模式**: 支持通过 props 强制指定主题
- **平滑过渡动画**: 所有主题切换均带有平滑过渡效果

### 📱 响应式布局
- **移动端优先**: 完美适配各种屏幕尺寸
- **紧凑模式**: 支持紧凑布局选项
- **触摸友好**: 优化移动端交互体验

### 🔒 表单验证
- **实时验证**: 输入时实时验证表单数据
- **错误提示**: 清晰的错误信息展示
- **防重复提交**: 登录过程中禁用重复提交

## 使用方法

### 基础使用

```vue
<template>
  <SdkworkAuthLogin 
    @login-success="handleLoginSuccess"
    @login-failed="handleLoginFailed"
  />
</template>

<script setup>
import SdkworkAuthLogin from '@/components/sdkwork-auth-login/sdkwork-auth-login.vue'

const handleLoginSuccess = (user) => {
  console.log('登录成功:', user)
  // 处理登录成功逻辑
}

const handleLoginFailed = (error) => {
  console.error('登录失败:', error)
  // 处理登录失败逻辑
}
</script>
```

### 高级配置

```vue
<template>
  <SdkworkAuthLogin 
    :redirect-url="/dashboard"
    :auto-redirect="true"
    :force-dark-mode="isDarkMode"
    :compact-mode="isMobile"
    @theme-change="handleThemeChange"
    @forgot-password="handleForgotPassword"
    @register-click="handleRegister"
  />
</template>

<script setup>
import { ref } from 'vue'

const isDarkMode = ref(false)
const isMobile = ref(window.innerWidth < 768)

const handleThemeChange = (isDark) => {
  console.log('主题切换:', isDark ? '暗色' : '亮色')
}

const handleForgotPassword = () => {
  // 处理忘记密码逻辑
}

const handleRegister = () => {
  // 处理注册逻辑
}
</script>
```

## Props 配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| redirect-url | string | '/' | 登录成功后重定向的URL |
| auto-redirect | boolean | true | 是否自动重定向 |
| force-dark-mode | boolean | false | 强制暗色模式 |
| compact-mode | boolean | false | 紧凑模式布局 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| login-success | user: any | 登录成功时触发 |
| login-failed | error: Error | 登录失败时触发 |
| theme-change | isDark: boolean | 主题切换时触发 |
| forgot-password | - | 点击忘记密码时触发 |
| register-click | - | 点击注册链接时触发 |

## 方法暴露

组件通过 `defineExpose` 暴露以下方法：

```javascript
// 获取组件实例
const loginRef = ref()

// 调用暴露的方法
loginRef.value.focus() // 聚焦到用户名输入框
loginRef.value.clear() // 清空表单
loginRef.value.toggleDarkMode(true) // 切换到暗色模式
loginRef.value.validate() // 手动验证表单
```

## 样式定制

### CSS 变量

组件使用 CSS 变量系统，支持深度定制：

```css
/* 覆盖主色调 */
.sdkwork-auth-login {
  --tech-blue-500: #your-color;
}

/* 暗色模式定制 */
.sdkwork-auth-login.dark-mode {
  --tech-bg-primary: #your-dark-bg;
}
```

### 响应式断点

- `768px`: 平板设备适配
- `480px`: 手机设备适配

## 技术实现

### 依赖库
- **Vue 3**: 组合式 API
- **TypeScript**: 类型安全
- **Iconify/Vue**: 矢量图标库
- **Vant**: UI 组件库（部分功能）

### 性能优化
- **按需加载**: 图标和组件按需引入
- **CSS 压缩**: 优化的样式代码
- **懒加载**: 背景效果延迟加载

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 无障碍支持

- **键盘导航**: 支持 Tab 键导航
- **屏幕阅读器**: 完整的 ARIA 标签
- **高对比度**: 满足 WCAG AA 标准

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建生产

```bash
# 构建生产版本
npm run build
```

## 更新日志

### v2.0.0 (2024-01-19)
- 完全重构设计
- 新增科技蓝配色方案
- 完善深浅主题切换
- 优化响应式布局
- 增强表单验证功能

## 许可证

MIT License