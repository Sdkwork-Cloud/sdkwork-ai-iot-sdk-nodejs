# SDKWork Generation Video Dialogue Component

这是一个基于聊天窗口的视频对话生成组件，采用传统聊天软件的界面设计，用于创建、编辑和预览角色对话场景，生成视频内容。该组件提供了完整的角色管理、对话编辑和预览功能，使用户能够创建多角色对话场景并生成视频内容。

## 功能特性

- 💬 **聊天式界面**：采用传统聊天软件的对话展示方式，更加直观
- 👥 **角色选择条**：底部输入框上方提供水平横向的角色列表
- 📝 **大输入框**：提供更大的文本输入区域，方便输入长对话内容
- 🎬 **视频生成**：基于对话内容一键生成视频
- ✨ **响应式设计**：适配不同屏幕尺寸
- 🌙 **主题支持**：支持亮色/暗色/自动主题切换

## 组件结构

```
sdkwork-generation-video-dialogue/
├── sdkwork-generation-video-dialogue.vue  # 主组件（聊天式界面）
├── types.ts                               # 类型定义
├── index.ts                               # 导出文件
└── README.md                              # 说明文档
```

## 使用方法

### 基本用法

```vue
<template>
  <div>
    <sdkwork-generation-video-dialogue
      :disabled="false"
      :points-coefficient="1.0"
      :show-history="true"
      theme-mode="auto"
      @generation-start="handleGenerationStart"
      @generation-success="handleGenerationSuccess"
      @generation-error="handleGenerationError"
      @validation-change="handleValidationChange"
      @project-save="handleProjectSave"
    />
  </div>
</template>

<script setup>
import SdkworkGenerationVideoDialogue from '@/components/sdkwork-generation-video-dialogue/sdkwork-generation-video-dialogue.vue'

const handleGenerationStart = (params) => {
  console.log('Generation started with params:', params)
}

const handleGenerationSuccess = (result) => {
  console.log('Generation succeeded with result:', result)
}

const handleGenerationError = (error) => {
  console.error('Generation failed with error:', error)
}

const handleValidationChange = (isValid) => {
  console.log('Form validation changed:', isValid)
}

const handleProjectSave = (project) => {
  console.log('Project saved:', project)
}
</script>
```

### Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| disabled | boolean | false | 是否禁用组件 |
| pointsCoefficient | number | 1.0 | 积分系数 |
| showHistory | boolean | true | 是否显示历史记录 |
| themeMode | 'light' \| 'dark' \| 'auto' | 'auto' | 主题模式 |

### Events 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| generation-start | params | 生成开始时触发 |
| generation-success | result | 生成成功时触发 |
| generation-error | error | 生成失败时触发 |
| validation-change | isValid | 验证状态变更时触发 |
| project-save | project | 项目保存时触发 |

## 类型定义

### 对话角色接口 (DialogueCharacter)

```typescript
interface DialogueCharacter {
  id: string
  name: string
  avatar?: string // 头像URL
  description?: string // 角色描述
  appearance: {
    gender: 'male' | 'female' | 'other'
    age: string
    style: string // 如：商务、休闲、正式等
    description: string // 外观描述
  }
  voice: {
    voiceId: string // 语音ID
    pitch: number // 音调
    speed: number // 语速
    emotion: string // 情感风格
  }
}
```

### 对话项目接口 (DialogueProject)

```typescript
interface DialogueProject {
  id: string
  title: string
  description: string
  characters: DialogueCharacter[] // 所有角色
  scenes: DialogueScene[] // 所有场景
  createdAt: string
  updatedAt: string
  status: 'draft' | 'generating' | 'completed' | 'failed'
}
```

## 开发说明

### 依赖要求

- Vue 3 (Composition API)
- TypeScript
- Vant UI (移动端组件库)
- Node.js 14+
- 现代浏览器支持

### 开发指南

1. 组件采用模块化设计，每个功能模块都是独立的子组件
2. 所有数据交互使用TypeScript类型约束
3. 遵循单一职责原则，保持组件简洁
4. 支持插槽(Slots)以增强可扩展性
5. 使用响应式设计，适配不同屏幕尺寸

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

### 添加新角色

1. 点击角色选择条右侧的"添加"按钮
2. 填写角色名称、描述和头像URL
3. 点击"添加"按钮完成角色创建
4. 新角色会出现在角色选择条中

## 视频生成配置

支持以下视频生成配置选项：

- 视频标题和描述
- 分辨率（480p/720p/1080p/4K）
- 视频格式（MP4/MOV/AVI/WebM）
- 背景音乐（轻快/温馨/励志/浪漫）
- 字幕和过渡效果

### 自定义扩展

组件支持通过插槽和事件进行扩展：

```vue
<sdkwork-generation-video-dialogue
  @project-save="handleProjectSave"
>
  <!-- 自定义插槽内容 -->
</sdkwork-generation-video-dialogue>
```

## 示例场景

### 创建多人对话视频

1. 在角色选择条中选择"小明"和"小红"
2. 在输入框中输入："小明和小红讨论周末计划"
3. 点击"生成对话"按钮
4. 查看生成的多轮对话内容
5. 点击"生成视频"按钮，配置视频参数
6. 等待视频生成完成

## 许可证

MIT License

## 更新日志

### v1.0.0 (2025-11-12)

- ✅ 初始版本发布
- ✅ 实现角色管理功能
- ✅ 实现对话编辑功能
- ✅ 实现视频生成功能
- ✅ 添加响应式设计和主题支持