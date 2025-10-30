# SDKWork Chat 组件库

基于 Vue 3 + TypeScript 开发的**移动端即时通讯聊天组件库**，专门为移动端应用设计的专业级聊天窗口界面。

## 📁 目录结构

```
sdkwork-chat/
├── 📄 README.md                          # 组件库主文档
├── 📄 TECHNICAL_STANDARDS.md            # 技术标准规范
├── 📄 ARCHITECTURE.md                   # 架构设计文档
├── 📄 USAGE_EXAMPLES.md                 # 使用示例文档
├── 📄 IMPLEMENTATION_SUMMARY.md        # 实现总结文档
├── 📄 DIRECTORY_STRUCTURE.md            # 目录结构说明文档
├── 📄 COMPONENT_FUNCTIONS.md            # 组件功能详细说明
├── 📄 FINAL_SUMMARY.md                  # 最终总结文档
├── 📄 sdkwork-chat.vue                   # 主组件入口
├── 📄 types.ts                           # 类型定义文件
└── 📁 components/                        # 子组件目录
    ├── 📁 chat-input/                    # 消息输入组件
    │   ├── 📄 chat-input.vue             # 消息输入主组件
    │   └── 📁 chat-input-tool-panel/     # 输入工具面板组件
    │       ├── 📄 chat-input-tool-panel.vue          # 工具面板主组件
    │       └── 📁 components/                         # 工具面板子组件
    │           ├── 📄 index.ts                        # 组件导出入口
    │           ├── 📄 chat-input-tool-camera.vue       # 相机工具组件
    │           ├── 📄 chat-input-tool-file.vue         # 文件工具组件
    │           ├── 📄 chat-input-tool-image.vue       # 图片工具组件
    │           └── 📄 chat-input-tool-video.vue       # 视频工具组件
    ├── 📁 chat-message-item/             # 消息项组件
    │   ├── 📄 chat-message-item.vue      # 消息项主组件
    │   ├── 📄 chat-message-bubble.vue    # 消息气泡组件
    │   └── 📁 components/                # 消息内容子组件
    │       ├── 📄 index.ts               # 消息内容组件导出入口
    │       ├── 📁 message-content-text/   # 文本消息内容组件
    │       │   └── 📄 message-content-text.vue
    │       ├── 📁 message-content-image/  # 图片消息内容组件
    │       │   └── 📄 message-content-image.vue
    │       ├── 📁 message-content-audio/ # 音频消息内容组件
    │       │   └── 📄 message-content-audio.vue
    │       ├── 📁 message-content-video/ # 视频消息内容组件
    │       │   └── 📄 message-content-video.vue
    │       └── 📁 message-content-file/  # 文件消息内容组件
    │           └── 📄 message-content-file.vue
    └── 📁 chat-message-list/             # 消息列表组件
        └── 📄 chat-message-list.vue      # 消息列表主组件
```

## 🏗️ 组件功能说明

### 1. 主组件 (sdkwork-chat.vue)
- **功能**: **移动端聊天窗口应用界面**容器组件，整合所有子组件
- **移动端特性**: 
  - 专为移动端触摸交互优化设计
  - 支持手势操作（滑动、长按等）
  - 适配移动端屏幕尺寸和分辨率
  - 优化移动端性能和电池续航
- **职责**: 
  - 管理聊天会话状态
  - 协调子组件间通信
  - 提供统一的API接口
  - 处理消息发送、接收、撤回等核心逻辑

### 2. 消息列表组件 (chat-message-list)
- **功能**: **移动端消息展示容器**，支持触摸滚动和手势操作
- **移动端优化特性**:
  - 专为移动端触摸滚动优化
  - 支持下拉刷新和上拉加载更多
  - 适配移动端手势操作（滑动删除、长按菜单）
  - 优化移动端电池续航和性能
- **特性**:
  - 支持多种消息类型展示
  - 实现消息时间戳分组
  - 支持消息状态指示（发送中、已发送、已读等）
  - 实现消息撤回功能
  - 支持消息搜索高亮

### 3. 消息项组件 (chat-message-item.vue)
- **功能**: **移动端单条消息展示组件**，负责消息的整体布局和状态管理
- **移动端交互特性**:
  - 优化移动端触摸交互体验
  - 支持长按弹出操作菜单
  - 适配移动端手势操作（滑动回复、双击点赞）
  - 移动端友好的消息布局和间距
- **组件关系**: 作为chat-message-bubble.vue的父组件，负责消息的整体布局
- **核心职责**:
  - 消息发送者信息展示（头像、昵称）
  - 消息时间戳格式化显示
  - 消息状态指示（发送中、已发送、已读、撤回等）
  - 消息操作菜单（撤回、复制、转发等）
  - 消息类型路由分发到对应的内容组件
- **属性配置**:
  - **是否显示头像**: 支持配置是否显示发送者头像
  - **头像大小**: 可配置头像显示尺寸
  - **头像形状**: 支持圆形、方形等不同形状
  - **头像位置**: 根据消息方向自动调整头像位置
- **技术特性**:
  - 支持左右布局（自己发送在右侧，对方发送在左侧）
  - 响应式设计，适配不同屏幕尺寸
  - 支持消息长按操作菜单
  - 实现消息状态动画效果

### 4. 消息气泡组件 (chat-message-bubble.vue)
- **功能**: **移动端消息内容容器组件**，提供统一的消息气泡样式和交互
- **移动端设计特性**:
  - 专为移动端设计的消息气泡样式
  - 优化移动端触摸目标大小（符合WCAG标准）
  - 适配移动端不同屏幕密度的显示效果
  - 移动端友好的气泡圆角和间距设计
- **组件关系**: 作为消息内容子组件的父组件，支持slot自定义子组件
- **核心职责**:
  - 消息气泡样式渲染（圆角、阴影、颜色等）
  - 消息内容安全区域控制
  - 消息状态指示器集成
  - 消息操作触发区域定义
  - 提供slot插槽支持自定义消息内容组件
- **技术特性**:
  - 支持不同消息类型的颜色主题
  - 实现消息气泡的箭头指示
  - 支持消息气泡的最大宽度限制
  - 提供消息气泡的悬停效果
  - 支持slot插槽，允许自定义消息内容渲染

### 5. 消息内容子组件
- **文本消息 (message-content-text)**: 纯文本消息展示，支持富文本渲染和链接识别
- **图片消息 (message-content-image)**: 图片预览和缩放，支持懒加载和错误处理
- **文件消息 (message-content-file)**: 文件信息展示和下载，支持文件类型图标和进度显示
- **音频消息 (message-content-audio)**: 音频播放控制，支持波形图和播放进度
- **视频消息 (message-content-video)**: 视频播放器，支持封面图和播放控制

### 6. 消息输入组件 (chat-input)
- **功能**: **移动端消息输入和发送功能**，提供完整的消息创作体验
- **移动端输入优化**:
  - 专为移动端虚拟键盘优化设计，自动调整输入框高度 
  - 适配移动端屏幕键盘弹出时的布局调整，避免内容遮挡
  - 移动端友好的输入框高度和触摸目标，符合WCAG无障碍标准
- **核心功能特性**:
  - **文本输入**: 支持多行文本输入、富文本格式化和实时预览
  - **语音输入**: 支持实时语音录制、波形可视化
  - **表情选择**: 集成表情面板，支持表情搜索和分类浏览
  - **文件上传**: 支持图片、文件拖拽上传和进度显示
  - **@提及功能**: 智能@用户提及，支持用户列表筛选
  - **快捷操作**: 支持常用短语、快捷回复和模板消息
  - **操作面板**: 集成多功能操作面板，支持快速切换输入模式
- **语音输入增强**:
  - **实时录制**: 支持高质量语音录制，自动降噪处理
  - **波形可视化**: 实时显示语音波形，提供视觉反馈
  - **语音转文字**: 自动将语音转换为文字内容
  - **播放控制**: 支持语音播放、暂停、进度控制
  - **时长限制**: 可配置语音消息最大时长
  - **取消重录**: 支持取消当前录制并重新开始

## 🛠️ 技术标准

### 开发规范
- **框架**: Vue 3.0+
- **语言**: TypeScript 4.0+
- **API风格**: 组合式API (Composition API)
- **语法糖**: `<script setup lang="ts">`
- **样式**: SCSS + CSS Modules

### 类型系统
- 完整的TypeScript类型定义
- 严格的接口约束
- 自动类型推断
- 编译时类型检查

### 响应式设计
- 基于Vue 3响应式系统
- 优化的渲染性能
- 虚拟滚动支持
- 懒加载机制

### 组件通信
- **Props**: 严格的类型约束
- **Emits**: 完整的事件定义
- **Provide/Inject**: 跨层级状态共享
- **自定义事件**: 组件间解耦通信

### 代码质量
- **模块化设计**: 单一职责原则
- **可复用性**: 高度可配置的组件
- **可维护性**: 清晰的代码结构
- **可测试性**: 独立的单元测试

## 📋 功能特性

### 消息展示区
- ✅ 多种消息类型支持（文本、图片、文件、音频、视频）
- ✅ 消息时间戳显示和分组
- ✅ 消息状态指示（发送中、已发送、已读）
- ✅ 消息撤回和重新编辑
- ✅ 消息引用和回复

### 消息输入区
- ✅ 富文本编辑器
- ✅ 表情选择面板
- ✅ 文件/图片上传
- ✅ 语音消息录制
- ✅ @提及功能
- ✅ 消息预览

### 功能操作区
- ✅ 消息发送控制
- ✅ 快捷操作菜单
- ✅ 消息搜索功能
- ✅ 消息批量操作
- ✅ 聊天设置管理

### 状态管理
- ✅ 完整的消息状态管理
- ✅ 已读/未读状态跟踪
- ✅ 消息撤回功能
- ✅ 离线消息同步
- ✅ 消息历史记录

## 🔧 使用示例

```vue
<template>
  <sdkwork-chat
    :current-user="currentUser"
    :messages="messages"
    :config="chatConfig"
    @send-message="handleSendMessage"
    @revoke-message="handleRevokeMessage"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { User, Message, ChatConfig } from './types'

const currentUser = ref<User>({
  id: 'user-1',
  name: '当前用户',
  avatar: '/avatar.jpg'
})

const messages = ref<Message[]>([])

const chatConfig: ChatConfig = {
  showTimestamp: true,
  showReadStatus: true,
  enableRevoke: true,
  enableFileUpload: true,
  maxFileSize: 10
}

const handleSendMessage = (message: Omit<Message, 'id' | 'status' | 'timestamp'>) => {
  // 处理消息发送逻辑
}

const handleRevokeMessage = (messageId: string) => {
  // 处理消息撤回逻辑
}
</script>
```

## 🚀 开发指南

### 环境要求
- Node.js 16.0+
- Vue 3.0+
- TypeScript 4.0+

### 安装依赖
```bash
npm install
```

### 开发调试
```bash
npm run dev
```

### 构建发布
```bash
npm run build
```

## 📝 版本历史

### v1.0.0 (2025-09-29)
- ✅ 基础聊天功能实现
- ✅ 多种消息类型支持
- ✅ 完整的类型定义
- ✅ 响应式设计
- ✅ 模块化组件架构

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个组件库。

## 📄 许可证

MIT License