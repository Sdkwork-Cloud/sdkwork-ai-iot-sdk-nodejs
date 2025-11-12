# Sdkwork Video Chat Input Component

这是一个基于聊天窗口的视频对话生成组件，参考了传统的聊天软件界面设计，用户可以通过角色列表和大输入框创建多角色对话并生成视频内容。

## 功能特性

- 🗣️ **聊天式界面**：采用传统聊天软件的对话展示方式
- 👥 **角色选择**：底部输入框上方提供水平横向的角色列表
- 📝 **大输入框**：提供更大的文本输入区域，方便输入长对话内容
- 🎬 **视频生成**：基于对话内容一键生成视频
- 🎨 **响应式设计**：适配不同屏幕尺寸
- 🌙 **主题支持**：支持亮色/暗色/自动主题切换

## 组件结构

```
sdkwork-video-chat-input/
├── sdkwork-video-chat-input.vue  # 主组件
├── index.ts                       # 导出文件
├── README.md                      # 说明文档
└── components/
    └── VideoGenerator.vue         # 视频生成子组件
```

## 使用方法

### 基本用法

```vue
<template>
  <div>
    <sdkwork-video-chat-input
      :current-user-id="currentUserId"
      :loading="loading"
      :theme-mode="themeMode"
      @generation-start="handleGenerationStart"
      @generation-success="handleGenerationSuccess"
      @generation-error="handleGenerationError"
      @character-added="handleCharacterAdded"
      @dialogue-generated="handleDialogueGenerated"
    />
  </div>
</template>

<script setup>
import SdkworkVideoChatInput from '@/components/sdkwork-video-chat-input/sdkwork-video-chat-input.vue'

const currentUserId = ref('user_123')
const loading = ref(false)
const themeMode = ref('auto')

const handleGenerationStart = (params) => {
  console.log('Generation started with params:', params)
}

const handleGenerationSuccess = (result) => {
  console.log('Generation succeeded with result:', result)
}

const handleGenerationError = (error) => {
  console.error('Generation failed with error:', error)
}

const handleCharacterAdded = (character) => {
  console.log('Character added:', character)
}

const handleDialogueGenerated = (messages) => {
  console.log('Dialogue generated:', messages)
}
</script>
```

### Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| currentUserId | string | '' | 当前用户ID |
| loading | boolean | false | 是否正在加载 |
| themeMode | 'light' \| 'dark' \| 'auto' | 'auto' | 主题模式 |
| showAvatar | boolean | true | 是否显示头像 |
| showTimeDivider | boolean | true | 是否显示时间分隔线 |
| hasMore | boolean | false | 是否还有更多消息 |
| showNoMoreData | boolean | true | 是否显示没有更多数据提示 |

### Events 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| generation-start | params | 生成开始时触发 |
| generation-success | result | 生成成功时触发 |
| generation-error | error | 生成失败时触发 |
| character-added | character | 角色添加时触发 |
| dialogue-generated | messages | 对话生成时触发 |

## 界面说明

### 聊天消息区域
- 采用传统聊天软件的消息展示方式
- 显示角色头像、名称和消息内容
- 支持消息点击和长按事件

### 角色选择条
- 位于底部输入区域上方
- 水平横向排列的角色列表
- 支持角色选择和添加新角色
- 点击角色头像即可选择当前发言角色

### 大输入框
- 提供更大的文本输入区域（默认高度80px）
- 支持多行文本输入
- 包含"生成对话"和"生成视频"两个按钮
- 支持回车键快速生成对话

## 工作流程

1. **选择角色**：从角色选择条中选择一个或多个角色
2. **输入内容**：在底部大输入框中输入对话主题或内容
3. **生成对话**：点击"生成对话"按钮，系统会自动生成多轮对话
4. **预览对话**：在聊天消息区域查看生成的对话内容
5. **生成视频**：点击"生成视频"按钮，配置视频参数并生成视频文件

## 视频生成配置

支持以下视频生成配置选项：

- 视频标题和描述
- 分辨率（480p/720p/1080p/4K）
- 视频格式（MP4/MOV/AVI/WebM）
- 背景音乐（轻快/温馨/励志/浪漫）
- 字幕和过渡效果

## 自定义样式

组件使用 SCSS 编写样式，支持主题切换。可以通过覆盖以下 CSS 变量来自定义样式：

```scss
.sdkwork-video-chat-input {
  --van-primary-color: #1989fa;  // 主色调
  --van-background-color: #f7f8fa;  // 背景色
  --van-text-color: #323233;  // 文字色
  // ...其他变量
}
```

## 开发说明

### 技术栈
- Vue 3 (Composition API)
- TypeScript
- Vant UI (移动端组件库)
- SCSS

### 设计原则
- 保持与传统聊天软件一致的交互体验
- 简化操作流程，减少用户学习成本
- 提供视觉反馈，增强用户体验

## 示例场景

### 创建多人对话视频

1. 在角色选择条中选择"小明"和"小红"
2. 在输入框中输入："小明和小红讨论周末计划"
3. 点击"生成对话"按钮
4. 查看生成的多轮对话内容
5. 点击"生成视频"按钮，配置视频参数
6. 等待视频生成完成

### 添加新角色

1. 点击角色选择条右侧的"添加"按钮
2. 填写角色名称、描述和头像URL
3. 点击"添加"按钮完成角色创建
4. 新角色会出现在角色选择条中

## 更新日志

### v1.0.0 (2025-11-12)

- ✅ 初始版本发布
- ✅ 实现聊天式界面设计
- ✅ 实现角色列表水平展示
- ✅ 实现大输入框和对话生成
- ✅ 实现视频生成功能
- ✅ 添加响应式设计和主题支持