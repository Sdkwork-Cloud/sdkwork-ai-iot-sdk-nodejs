# SDKWork QR Code Component 使用指南

## 组件概述

`sdkwork-qr-code` 是一个功能强大且高度可定制的二维码组件，支持多种二维码模式、自定义样式、保存和分享功能。

## 基本使用

```vue
<template>
  <sdkwork-qr-code 
    value="https://example.com" 
    title="示例二维码" 
    description="扫描此二维码访问示例网站"
  />
</template>

<script setup>
import { SdkworkQrCode } from '@/components'
</script>
```

## 高级使用

### 1. 使用自定义头部

```vue
<template>
  <sdkwork-qr-code 
    value="https://example.com" 
    tipText="扫描二维码了解更多"
    :showInfo="false"
    :showAvatar="false"
  >
    <template #header>
      <div class="custom-header">
        <img src="/logo.png" alt="Logo" class="logo" />
        <h2>自定义标题</h2>
        <p>自定义描述信息</p>
      </div>
    </template>
  </sdkwork-qr-code>
</template>

<style scoped>
.custom-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
}
</style>
```

## 主题适配

组件会自动适应不同的主题背景色，确保保存和分享的二维码图片与展示的一致：

- **亮色主题**: 使用白色背景（#ffffff）
- **暗色主题**: 使用深色背景（#1a1a1a）
- **自定义主题**: 自动读取CSS变量 `--bg-card` 的值

组件通过以下方式实现主题适配：
1. 生成二维码时，会根据当前主题设置二维码背景色
2. 保存和分享时，会获取当前主题的背景色，确保保存的图片与展示的一致
3. 如果找不到主题变量，则使用默认的白色背景

### 主题样式变量示例

```css
.theme-light {
    --bg-page: #f7f8fa;
    --bg-card: #ffffff;
    --text-primary: #323233;
    --text-secondary: #969799;
    --color-primary: #1989fa;
    --border-color: #ebedf0;
    --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
    --radius: 8px;
    --radius-large: 12px;
}

.theme-dark {
    --bg-page: #0a0a0a;
    --bg-card: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #c8c9cc;
    --color-primary: #1989fa;
    --border-color: #3a3a3a;
    --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
    --radius: 8px;
    --radius-large: 12px;
}
```

### 自定义主题适配

如果您的应用使用自定义主题，可以通过设置CSS变量来实现主题适配：

```css
:root {
    --bg-card: #your-custom-bg-color;
    /* 其他主题变量 */
}
```

或者直接在组件上通过 `customClass` 属性应用自定义样式：

```vue
<sdkwork-qr-code
  value="https://example.com"
  customClass="custom-qr-theme"
/>
```

```css
.custom-qr-theme {
    --bg-card: #your-custom-bg-color;
    /* 其他自定义样式 */
}
```

### 2. 自定义操作按钮

```vue
<template>
  <sdkwork-qr-code 
    value="https://example.com" 
    title="示例二维码"
    :showActions="false"
    @save="handleSave"
    @share="handleShare"
  >
    <template #actions>
      <div class="custom-actions">
        <button @click="customAction1">自定义操作1</button>
        <button @click="customAction2">自定义操作2</button>
      </div>
    </template>
  </sdkwork-qr-code>
</template>

<script setup>
const handleSave = (qrCodeUrl) => {
  console.log('保存二维码:', qrCodeUrl)
}

const handleShare = (qrCodeUrl) => {
  console.log('分享二维码:', qrCodeUrl)
}

const customAction1 = () => {
  console.log('自定义操作1')
}

const customAction2 = () => {
  console.log('自定义操作2')
}
</script>
```

### 3. 使用图片模式二维码

```vue
<template>
  <sdkwork-qr-code 
    value="/path/to/qr-code-image.png" 
    qrMode="image"
    title="图片二维码"
  />
</template>
```

### 4. 添加中心Logo

```vue
<template>
  <sdkwork-qr-code 
    value="https://example.com" 
    title="带Logo的二维码"
    logo="/path/to/logo.png"
  />
</template>
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | string | '' | 二维码内容 |
| title | string | '' | 标题 |
| description | string | '' | 描述信息 |
| avatar | string | '' | 头像URL |
| logo | string | '' | 二维码中心的logo URL |
| qrSize | number | 200 | 二维码尺寸(px) |
| qrMode | 'image' \| 'generate' | 'generate' | 二维码模式 |
| tipText | string | '' | 提示文本 |
| showAvatar | boolean | true | 是否显示头像 |
| showInfo | boolean | true | 是否显示信息 |
| showTip | boolean | true | 是否显示提示 |
| showActions | boolean | true | 是否显示操作按钮 |
| showAvatarBorder | boolean | true | 是否显示头像边框 |
| allowSave | boolean | true | 是否允许保存二维码 |
| allowShare | boolean | true | 是否允许分享 |
| allowRefresh | boolean | false | 是否允许刷新 |
| avatarIcon | string | 'user-circle-o' | 头像占位图标 |
| customClass | string | '' | 自定义CSS类 |
| qrColor | string | '#000000' | 二维码前景色 |
| qrBgColor | string | '#FFFFFF' | 二维码背景色 |
| qrErrorLevel | string | 'M' | 二维码容错级别 |
| qrMargin | number | 0 | 二维码边距 |
| blur | boolean | false | 是否显示模糊效果 |

## 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| save | qrCodeUrl: string | 保存二维码时触发 |
| share | qrCodeUrl: string | 分享二维码时触发 |
| refresh | - | 刷新二维码时触发 |
| load | qrCodeUrl: string | 二维码加载完成时触发 |
| error | error: Error | 二维码生成错误时触发 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| header | 头部区域，用于自定义头部内容 |
| info | 信息区域，用于在默认信息后添加自定义内容 |
| qrOverlay | 二维码上方覆盖层 |
| tip | 提示区域，用于在默认提示后添加自定义内容 |
| actions | 操作按钮区域，用于自定义操作按钮 |
| footer | 底部区域，用于添加底部内容 |
| qr-footer | 二维码底部区域，用于添加二维码底部内容 |

## 组件结构

```
qr-wrapper-container (最外层容器，100%高度，垂直居中)
├── qr-header-section (头部区域，使用header slot)
│   └── slot[name="header"] (用户自定义头部)
├── qr-default-header (默认头部，当没有header slot时显示)
│   ├── avatar-section (头像区域)
│   └── info-section (信息区域)
├── sdkwork-qr-code (二维码主容器)
│   ├── qr-section (二维码区域)
│   │   └── qr-container (二维码容器)
│   └── tip-section (提示区域)
└── footer-section (底部区域，默认显示)
    ├── actions-section (操作按钮区域，通过showActions属性控制)
    │   └── actions-row (操作按钮行)
    └── slot[name="footer"] (用户自定义底部内容)
```

## 布局特点

1. **外部容器**: `qr-wrapper-container` 设置为 100% 高度，使用 flex 布局垂直居中
2. **头部区域**: 使用 slot 方式支持自定义头部内容
3. **二维码容器**: 独立的容器，负责显示二维码和提示信息
4. **底部区域**: 默认显示，包含操作按钮区域和自定义footer slot
5. **操作按钮**: 位于底部区域内部，通过 `showActions` 属性控制是否显示
6. **最大宽度**: 组件和底部区域都设置了最大宽度为 340px，确保在大屏幕上不会过宽

## 示例：完整使用

```vue
<template>
  <div class="qr-page">
    <sdkwork-qr-code
      :value="qrValue"
      title="群组二维码"
      description="扫描二维码加入群组"
      tipText="扫描二维码加入群组"
      :showInfo="false"
      :showAvatar="false"
      @save="handleSaveQRCode"
      @share="handleShareQRCode"
    >
      <!-- 自定义头部 -->
      <template #header>
        <div class="group-header">
          <img :src="groupData.avatar" :alt="groupData.name" class="group-avatar" />
          <h2 class="group-name">{{ groupData.name }}</h2>
          <p class="group-description">{{ groupData.description }}</p>
        </div>
      </template>
    </sdkwork-qr-code>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SdkworkQrCode } from '@/components'

const groupData = {
  id: '123',
  name: '示例群组',
  avatar: 'https://picsum.photos/seed/group/200/200.jpg',
  description: '这是一个示例群组，用于展示二维码功能。'
}

const qrValue = computed(() => {
  return `https://example.com/group/invite/${groupData.id}`
})

const handleSaveQRCode = (qrCodeUrl) => {
  console.log('保存二维码:', qrCodeUrl)
}

const handleShareQRCode = (qrCodeUrl) => {
  console.log('分享二维码:', qrCodeUrl)
}
</script>

<style scoped>
.qr-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.group-header {
  text-align: center;
  margin-bottom: 24px;
}

.group-avatar {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.group-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #323233;
}

.group-description {
  font-size: 14px;
  color: #969799;
  margin: 0;
  line-height: 1.5;
}
</style>
```

## 主题适配

组件会自动适应不同的主题背景色，确保保存和分享的二维码图片与展示的一致：

- **亮色主题**: 使用白色背景（#ffffff）
- **暗色主题**: 使用深色背景（#1a1a1a）
- **自定义主题**: 自动读取CSS变量 `--bg-card` 的值

组件通过以下方式实现主题适配：
1. 生成二维码时，会根据当前主题设置二维码背景色
2. 保存和分享时，会获取当前主题的背景色，确保保存的图片与展示的一致
3. 如果找不到主题变量，则使用默认的白色背景

### 主题样式变量示例

```css
.theme-light {
    --bg-page: #f7f8fa;
    --bg-card: #ffffff;
    --text-primary: #323233;
    --text-secondary: #969799;
    --color-primary: #1989fa;
    --border-color: #ebedf0;
    --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
    --radius: 8px;
    --radius-large: 12px;
}

.theme-dark {
    --bg-page: #0a0a0a;
    --bg-card: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #c8c9cc;
    --color-primary: #1989fa;
    --border-color: #3a3a3a;
    --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
    --radius: 8px;
    --radius-large: 12px;
}
```

### 自定义主题适配

如果您的应用使用自定义主题，可以通过设置CSS变量来实现主题适配：

```css
:root {
    --bg-card: #your-custom-bg-color;
    /* 其他主题变量 */
}
```

或者直接在组件上通过 `customClass` 属性应用自定义样式：

```vue
<sdkwork-qr-code
  value="https://example.com"
  customClass="custom-qr-theme"
/>
```

```css
.custom-qr-theme {
    --bg-card: #your-custom-bg-color;
    /* 其他自定义样式 */
}
```