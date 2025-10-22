# Vue 示例项目架构文档

## 项目概述

SDKWork AIoT Vue3 示例项目，展示如何使用 SDK 构建现代化的移动端 AIoT 应用。

## 技术栈

- **框架**: Vue 3.5 + TypeScript
- **UI 组件**: Vant 4.x
- **状态管理**: Pinia
- **路由**: Vue Router + unplugin-vue-router
- **构建工具**: Vite 6.x
- **图标系统**: Iconify/Vue

## 图标使用规范

### 核心原则

项目统一使用 **Iconify/Vue** 作为图标解决方案，提供丰富的图标集和一致的视觉体验。

### 支持的图标集

#### 1. Material Design Icons (mdi)
- **用途**: 通用界面图标
- **示例**: `mdi:home`, `mdi:settings`, `mdi:account`
- **特点**: 设计规范，覆盖全面

#### 2. MingCute Icons (mingcute)
- **用途**: 业务相关图标
- **示例**: `mingcute:message-3-fill`, `mingcute:device-line`
- **特点**: 现代简约，适合移动端

### 基本用法

#### 导入组件
```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
```

#### 基础使用
```vue
<template>
  <Icon icon="mdi:home" width="24" height="24" />
</template>
```

### 状态切换模式

对于需要选中状态的图标，使用填充和轮廓版本：

```vue
<template>
  <Icon 
    :icon="isActive ? 'mingcute:message-3-fill' : 'mingcute:message-3-line'" 
    width="24" 
    height="24"
    :class="{ 'icon-active': isActive }"
  />
</template>
```

### 在组件中的使用

#### 底部导航栏
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

#### 按钮图标
```vue
<template>
  <van-button @click="handleAction">
    <Icon icon="mingcute:phone-fill" width="16" height="16" />
    通话
  </van-button>
</template>
```

### 推荐的图标映射

| 功能模块 | 选中状态 | 未选中状态 |
|---------|---------|-----------|
| 对话 | `mingcute:message-3-fill` | `mingcute:message-3-line` |
| 智能体 | `mingcute:robot-fill` | `mingcute:robot-line` |
| 硬件设备 | `mingcute:device-fill` | `mingcute:device-line` |
| 通知 | `mingcute:bell-fill` | `mingcute:bell-line` |
| 个人中心 | `mingcute:user-fill` | `mingcute:user-line` |
| 语音通话 | `mingcute:phone-fill` | `mingcute:phone-line` |

### 样式控制

#### 颜色管理
```scss
.icon-active {
  color: var(--van-primary-color);
}

.icon-default {
  color: #666;
}
```

#### 尺寸规范
- **小尺寸**: 16px × 16px（按钮、标签）
- **标准尺寸**: 24px × 24px（导航、列表）
- **大尺寸**: 32px × 32px（头像、重要操作）

### 最佳实践

1. **一致性**: 同一功能模块使用相同的图标集
2. **状态明确**: 选中状态使用填充版本，未选中使用轮廓版本
3. **尺寸统一**: 保持相同场景下的图标尺寸一致
4. **颜色语义**: 通过颜色传达图标的状态和重要性
5. **可访问性**: 为纯图标按钮添加文字说明或 aria-label

### 代码示例

#### 完整的底部导航栏实现
```vue
<template>
  <van-tabbar v-model="activeTab">
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
    
    <van-tabbar-item name="agents">
      <template #icon="props">
        <Icon 
          :icon="props.active ? 'mingcute:robot-fill' : 'mingcute:robot-line'" 
          width="24" 
          height="24"
        />
      </template>
      智能体
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>
```

#### 带状态的操作按钮
```vue
<template>
  <van-button 
    :type="isCalling ? 'danger' : 'primary'" 
    @click="toggleCall"
  >
    <Icon 
      :icon="isCalling ? 'mingcute:phone-off-fill' : 'mingcute:phone-fill'" 
      width="16" 
      height="16" 
    />
    {{ isCalling ? '挂断' : '通话' }}
  </van-button>
</template>
```

### 禁止行为

❌ **禁止使用 Vant 内置图标**
```vue
<!-- 错误用法 -->
<van-button icon="phone-o">通话</van-button>

<!-- 正确用法 -->
<van-button>
  <Icon icon="mingcute:phone-fill" width="16" height="16" />
  通话
</van-button>
```

❌ **禁止混用图标系统**
```vue
<!-- 错误用法 -->
<Icon icon="mdi:phone" />
<Icon icon="mingcute:message-3-fill" />

<!-- 正确用法：同一模块使用相同图标集 -->
<Icon icon="mingcute:phone-fill" />
<Icon icon="mingcute:message-3-fill" />
```

## 自定义下拉菜单组件

### 组件说明
项目使用自定义的 `DropdownMenu` 组件替代 Vant 的 dropdown-menu，提供更符合即时通信应用风格的菜单体验。

### 组件位置
```
src/components/layout/dropdown-menu/dropdown-menu.vue
```

### 基本用法
```vue
<template>
  <DropdownMenu 
    :items="menuItems"
    @item-click="handleMenuClick"
  >
    <template #trigger>
      <Icon icon="mingcute:more-2-fill" width="16" height="16" />
    </template>
  </DropdownMenu>
</template>

<script setup lang="ts">
import DropdownMenu from '@/components/layout/dropdown-menu/dropdown-menu.vue'

const menuItems = [
  { text: '清空对话', value: 'clear', icon: 'mingcute:delete-2-fill' },
  { text: '导出对话', value: 'export', icon: 'mingcute:download-2-fill' },
  { text: '举报对话', value: 'report', icon: 'mingcute:alert-fill' }
]

const handleMenuClick = (item: any) => {
  // 处理菜单项点击
}
</script>
```

### 组件特性
- **即时通信风格**: 参考主流即时通信应用的下拉菜单设计
- **动画效果**: 平滑的展开/收起动画
- **点击外部关闭**: 点击菜单外部区域自动关闭
- **图标支持**: 支持为每个菜单项配置图标
- **位置自适应**: 根据触发元素位置自动调整菜单位置

## 页面配置规范

### definePage 配置

所有页面必须同时包含 `definePage` 函数和 `<route>` 块来定义页面元数据，使用 `vite-plugin-vue-meta-layouts` 插件实现布局系统。

### 基本配置
```vue
<script setup lang="ts">
// 页面逻辑代码
definePage({
    meta: {
        title: '页面标题'      // 页面标题，显示在 header 中
    }
})
</script>

<route>
{
  meta: {
    layout: 'tabbar',      // 布局类型：tabbar 或 default
    title: '页面标题',      // 页面标题，显示在 header 中
    hideHeader: false      // 是否隐藏默认 header
  }
}
</route>
```

### definePage 函数说明

`definePage` 函数用于在脚本部分定义页面元数据，与 `<route>` 块配合使用：

```vue
<script setup lang="ts">
definePage({
    meta: {
        title: '页面标题',      // 页面标题
        hideHeader: false      // 是否隐藏默认 header
    }
})
</script>
```

**注意**: `definePage` 中的 `layout` 配置应在 `<route>` 块中定义。

### 布局类型说明

#### 1. tabbar 布局
- **用途**: 底部导航页面（首页、智能体、硬件、通知、我的）
- **特点**: 包含底部导航栏，自动显示页面标题
- **示例**:
```vue
<script setup lang="ts">
definePage({
    meta: {
        title: '对话'
    }
})
</script>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '对话'
  }
}
</route>
```

#### 2. default 布局
- **用途**: 普通页面（登录、注册、设备列表、聊天详情等）
- **特点**: 标准布局，包含头部和内容区域
- **示例**:
```vue
<script setup lang="ts">
definePage({
    meta: {
        title: '登录'
    }
})
</script>

<route>
{
  meta: {
    layout: 'default',
    title: '登录'
  }
}
</route>
```

### 自定义 Header 配置

对于需要自定义 header 的页面，设置 `hideHeader: true`：

```vue
<script setup lang="ts">
definePage({
    meta: {
        title: '自定义页面',
        hideHeader: true  // 隐藏默认 header，使用自定义 header
    }
})
</script>

<route>
{
  meta: {
    layout: 'default',
    title: '自定义页面',
    hideHeader: true  // 隐藏默认 header，使用自定义 header
  }
}
</route>
```

#### 右上角操作区域设计规范

#### 设计原则
1. **简洁专业**: 移除不必要的文字标签，使用纯图标
2. **用户体验**: 图标操作直观易懂，避免视觉干扰
3. **一致性**: 所有页面右上角操作区域保持统一风格

#### 实现方案
```vue
<template>
  <div class="custom-page">
    <!-- 自定义 header -->
    <div class="custom-header">
      <van-nav-bar
        title="自定义标题"
        left-arrow
        @click-left="$router.back()"
      >
        <template #right>
          <!-- 语音通话图标 -->
          <Icon 
            icon="mingcute:phone-fill" 
            width="20" 
            height="20" 
            class="action-icon"
            @click="handleVoiceCall"
          />
          
          <!-- 自定义下拉菜单 -->
          <DropdownMenu 
            :items="moreOptions"
            @item-click="handleMenuClick"
          >
            <template #trigger>
              <Icon icon="mingcute:more-2-fill" width="16" height="16" />
            </template>
          </DropdownMenu>
        </template>
      </van-nav-bar>
    </div>
    
    <!-- 页面内容 -->
    <div class="page-content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import DropdownMenu from '@/components/layout/dropdown-menu/dropdown-menu.vue'

const moreOptions = [
  { text: '清空对话', value: 'clear', icon: 'mingcute:delete-2-fill' },
  { text: '导出对话', value: 'export', icon: 'mingcute:download-2-fill' },
  { text: '举报对话', value: 'report', icon: 'mingcute:alert-fill' }
]

const handleMenuClick = (item: any) => {
  switch (item.value) {
    case 'clear':
      // 清空对话逻辑
      break
    case 'export':
      // 导出对话逻辑
      break
    case 'report':
      // 举报对话逻辑
      break
  }
}
</script>
```

#### 样式规范
```scss
.custom-header {
  .action-icon {
    margin-right: 12px;
    color: #1989fa;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: #0070e0;
    }
  }
  
  .dropdown-menu {
    .dropdown-trigger {
      color: #646566;
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: #1989fa;
      }
    }
  }
}
```

#### 操作图标映射表
| 功能 | 图标名称 | 尺寸 | 说明 |
|------|---------|------|------|
| 语音通话 | `mingcute:phone-fill` | 20px | 通话功能，无文字标签 |
| 更多操作 | `mingcute:more-2-fill` | 16px | 下拉菜单触发图标 |
| 设置 | `mingcute:settings-6-fill` | 20px | 设置相关操作 |
| 搜索 | `mingcute:search-fill` | 20px | 搜索功能 |
| 添加 | `mingcute:add-circle-fill` | 20px | 添加新项目 |

#### 最佳实践
1. **图标选择**: 优先使用 Vant 内置图标，保持视觉一致性
2. **尺寸统一**: 主要操作图标使用 20px，次要图标使用 16px
3. **间距合理**: 图标之间保持 12px 间距
4. **悬停反馈**: 所有可点击图标都需要有悬停状态变化
5. **无障碍性**: 为纯图标按钮添加适当的 aria-label

#### 禁止行为
❌ **禁止使用文字标签**
```vue
<!-- 错误用法 -->
<van-button size="small" type="primary">
  <Icon icon="mingcute:phone-fill" />
  通话
</van-button>

<!-- 正确用法 -->
<Icon icon="mingcute:phone-fill" width="20" height="20" @click="handleVoiceCall" />
```

❌ **禁止使用 Vant 的 dropdown-menu**
```vue
<!-- 错误用法 -->
<van-dropdown-menu>
  <van-dropdown-item title="" :options="moreOptions">
    <template #title>
      <Icon icon="mingcute:more-2-fill" />
    </template>
  </van-dropdown-item>
</van-dropdown-menu>

<!-- 正确用法：使用自定义下拉菜单组件 -->
<DropdownMenu :items="moreOptions" @item-click="handleMenuClick">
  <template #trigger>
    <Icon icon="mingcute:more-2-fill" width="16" height="16" />
  </template>
</DropdownMenu>
```

❌ **禁止混合使用不同图标系统**
```vue
<!-- 错误用法 -->
<Icon icon="mingcute:phone-fill" />
<van-icon name="ellipsis" />

<!-- 正确用法：统一使用 Iconify/Vue 图标 -->
<Icon icon="mingcute:phone-fill" width="20" height="20" />
<Icon icon="mingcute:more-2-fill" width="16" height="16" />
```

### 自定义 Header 实现示例
```vue
<template>
  <div class="custom-page">
    <!-- 自定义 header -->
    <div class="custom-header">
      <van-nav-bar
        title="自定义标题"
        left-arrow
        @click-left="$router.back()"
      >
        <template #right>
          <Icon icon="mingcute:phone-fill" width="20" height="20" class="action-icon" @click="handleVoiceCall" />
          <van-dropdown-menu>
            <van-dropdown-item title="" :options="moreOptions">
              <template #title>
                <Icon icon="mingcute:more-2-fill" width="16" height="16" />
              </template>
            </van-dropdown-item>
          </van-dropdown-menu>
        </template>
      </van-nav-bar>
    </div>
    
    <!-- 页面内容 -->
    <div class="page-content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>
```

### 页面标题动态更新

在页面组件中可以通过布局暴露的 `pageTitle` 来动态更新标题：

```vue
<script setup lang="ts">
// 在 tabbar 布局中，标题通过 definePage 配置自动设置
// 如果需要动态更新标题，可以通过路由参数等方式
</script>
```

### 最佳实践

1. **所有页面必须配置**: 每个页面文件都必须包含 `<route>` 配置块
2. **标题简洁明确**: 页面标题应该简洁明了，反映页面功能
3. **布局选择合理**: 根据页面功能选择合适的布局类型
4. **自定义 header 谨慎使用**: 只在确实需要自定义交互时才隐藏默认 header
5. **保持一致性**: 相同功能的页面使用相同的布局和标题风格

### 代码示例

#### 标准 tabbar 页面
```vue
<template>
  <div class="page-content">
    <!-- 页面内容 -->
  </div>
</template>

<script setup lang="ts">
// 页面逻辑
definePage({
    meta: {
        title: '页面标题'
    }
})
</script>

<style scoped lang="scss">
// 页面样式
</style>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '页面标题'
  }
}
</route>
```

#### 自定义 header 页面
```vue
<template>
  <div class="custom-page">
    <!-- 自定义 header 区域 -->
    <div class="custom-header">
      <van-nav-bar
        :title="pageTitle"
        left-arrow
        @click-left="$router.back()"
      >
        <template #right>
          <van-button size="small" type="primary" @click="handleAction">
            操作
          </van-button>
        </template>
      </van-nav-bar>
    </div>
    
    <!-- 页面内容 -->
    <div class="page-content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePage({
    meta: {
        title: '自定义页面',
        hideHeader: true  // 隐藏默认 header
    }
})

const pageTitle = ref('自定义页面标题')

const handleAction = () => {
  // 自定义操作逻辑
}
</script>

<style scoped lang="scss">
.custom-header {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style>

<route>
{
  meta: {
    layout: 'default',
    title: '自定义页面',
    hideHeader: true  // 隐藏默认 header
  }
}
</route>
```

## 布局系统

### 布局类型
- **default**: 标准布局，包含头部和内容区域
- **tabbar**: 底部导航布局，用于主要功能页面

### 布局文件位置
```
src/layouts/
├── default.vue    # 默认布局
└── tabbar.vue     # 底部导航布局
```

### 布局配置
布局通过页面文件的 `<route>` 块自动应用，无需手动导入。

## 聊天模式切换功能

### 功能概述
聊天页面支持两种模式：文字对话模式和语音通话模式，用户可以在两种模式之间自由切换。

### 模式说明

#### 1. 文字对话模式
- **用途**: 传统的文字聊天界面
- **组件**: `ChatTextMode`
- **特点**: 消息列表、输入框、发送功能
- **路由参数**: `mode=text`（默认）

#### 2. 语音通话模式
- **用途**: 语音通话界面
- **组件**: `ChatVoiceMode`
- **特点**: 高端科技蓝主题、通话控制、语音波形
- **路由参数**: `mode=voice`

### 组件位置
```
src/components/chat/
├── chat-text-mode/           # 文字对话模式组件
│   └── chat-text-mode.vue
└── chat-voice-mode/          # 语音通话模式组件
    └── chat-voice-mode.vue
```

### 使用方式

#### 通过路由参数指定默认模式
```javascript
// 默认文字模式
/chat/123

// 指定语音模式
/chat/123?mode=voice
```

#### 在页面中切换模式
```vue
<template>
  <div class="mode-switch">
    <Icon 
      v-if="currentMode === 'text'"
      icon="mingcute:phone-fill" 
      @click="switchToVoiceMode"
      title="切换到语音模式"
    />
    <Icon 
      v-else
      icon="mingcute:message-3-fill" 
      @click="switchToTextMode"
      title="切换到文字模式"
    />
  </div>
</template>

<script setup lang="ts">
const currentMode = ref<'text' | 'voice'>('text')

const switchToTextMode = () => {
  currentMode.value = 'text'
}

const switchToVoiceMode = () => {
  currentMode.value = 'voice'
}
</script>
```

### 语音通话界面设计规范

#### 设计原则
1. **高端大气**: 采用科技蓝渐变背景，体现人工智能应用的专业感
2. **扁平风格**: 简洁的界面设计，避免过多装饰元素
3. **直观操作**: 通话控制按钮布局合理，功能明确
4. **实时反馈**: 语音波形、网络质量等实时状态指示

#### 界面元素
- **对方信息**: 头像、姓名、通话状态、通话时长
- **控制按钮**: 麦克风、扬声器、挂断、摄像头、设置
- **状态指示**: 网络质量、语音波形动画
- **动画效果**: 平滑的过渡动画和交互反馈

#### 颜色方案
- **主色调**: 科技蓝渐变 (#007AFF → #0056CC)
- **辅助色**: 白色文字和图标
- **状态色**: 
  - 挂断按钮: #FF3B30
  - 网络质量: 绿色(#4CD964)、黄色(#FF9500)、红色(#FF3B30)

### 最佳实践

1. **模式一致性**: 确保两种模式的功能和体验一致
2. **状态同步**: 切换模式时保持对话状态的连续性
3. **性能优化**: 语音模式注意音频处理的性能
4. **错误处理**: 网络异常、设备权限等情况的友好提示

## 开发规范

### 文件结构
```
src/
├── components/
│   ├── layout/           # 布局组件
│   └── business/         # 业务组件
├── pages/                # 页面组件
├── layouts/              # 布局文件
├── stores/               # 状态管理
└── services/             # API 服务
```

### 命名规范
- 组件: `component-name/component-name.vue`
- 页面: 遵循 unplugin-vue-router 规范
- 图标: 使用 kebab-case 命名

## 性能优化

- 使用 Iconify/Vue 的按需加载
- 图标尺寸优化（避免过大图标）
- 适当的缓存策略

---

*文档版本: 1.2*
*最后更新: 2025-09-27 21:00*