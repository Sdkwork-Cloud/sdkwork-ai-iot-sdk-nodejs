# SDKWork Markdown Content 组件

一个基于 marked 实现的通用 Markdown 渲染组件，支持灵活的配置和自定义功能。

## 功能特性

- ✅ **完整的 Markdown 支持** - 基于 marked 库，支持所有标准 Markdown 语法
- ✅ **代码高亮** - 集成 highlight.js，支持多种编程语言
- ✅ **安全渲染** - 内置 DOMPurify，防止 XSS 攻击
- ✅ **自定义样式** - 支持字体、颜色、大小等样式配置
- ✅ **响应式设计** - 支持移动端适配
- ✅ **目录生成** - 自动提取标题生成目录
- ✅ **锚点链接** - 支持标题锚点和平滑滚动
- ✅ **代码复制** - 一键复制代码块内容
- ✅ **图片预览** - 支持图片点击预览
- ✅ **懒加载** - 支持视口懒加载优化性能
- ✅ **主题支持** - 内置亮色/暗色主题
- ✅ **事件系统** - 完整的 Vue 事件系统
- ✅ **TypeScript 支持** - 完整的类型定义

## 安装依赖

确保项目中已安装以下依赖：

```bash
npm install marked dompurify highlight.js
# 或
pnpm add marked dompurify highlight.js
```

## 基本使用

```vue
<template>
  <div>
    <sdkwork-markdown-content 
      :content="markdownContent"
      @rendered="handleRendered"
      @link-click="handleLinkClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const markdownContent = ref(`
# 标题

这是一个 Markdown 示例

## 二级标题

- 列表项 1
- 列表项 2

\`\`\`javascript
// 代码示例
function hello() {
  console.log('Hello, World!')
}
\`\`\`
`)

const handleRendered = (html: string) => {
  console.log('渲染完成:', html)
}

const handleLinkClick = (url: string, event: Event) => {
  console.log('链接点击:', url)
  event.preventDefault()
}
</script>
```

## Props 配置

### 基础配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | '' | Markdown 内容 |
| safe | boolean | true | 是否启用安全渲染 |
| className | string | '' | 自定义 CSS 类名 |

### 功能配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| lazy | boolean | false | 是否启用懒加载 |
| lazyThreshold | number | 100 | 懒加载阈值（像素） |
| codeCopyable | boolean | true | 是否启用代码复制 |
| imagePreview | boolean | true | 是否启用图片预览 |
| anchorLinks | boolean | true | 是否启用锚点链接 |
| anchorOffset | number | 0 | 锚点滚动偏移量 |
| toc | boolean | false | 是否显示目录 |
| tocMaxDepth | number | 3 | 目录最大深度 |
| responsive | boolean | true | 是否启用响应式 |

### 样式配置

```vue
<template>
  <sdkwork-markdown-content
    :content="content"
    :style-config="{
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      lineHeight: '1.8',
      color: '#333',
      backgroundColor: '#f9f9f9',
      codeBlockBackground: '#f5f5f5'
    }"
    :render-options="{
      highlight: true,
      highlightTheme: 'github',
      math: false,
      tables: true
    }"
  />
</template>
```

## 事件系统

### 可用事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| rendered | (html: string) | 渲染完成时触发 |
| link-click | (url: string, event: Event) | 链接点击时触发 |
| image-click | (src: string, alt: string, event: Event) | 图片点击时触发 |
| code-copy | (code: string, language: string) | 代码复制时触发 |
| anchor-click | (anchor: string, event: Event) | 锚点点击时触发 |
| error | (error: Error) | 渲染错误时触发 |
| content-change | (content: string) | 内容变化时触发 |

### 事件使用示例

```vue
<template>
  <sdkwork-markdown-content
    :content="content"
    @rendered="handleRendered"
    @link-click="handleLinkClick"
    @image-click="handleImageClick"
    @code-copy="handleCodeCopy"
    @anchor-click="handleAnchorClick"
    @error="handleError"
    @content-change="handleContentChange"
  />
</template>

<script setup lang="ts">
const handleRendered = (html: string) => {
  console.log('HTML 渲染完成:', html)
}

const handleLinkClick = (url: string, event: Event) => {
  console.log('外部链接:', url)
  // 可以在这里处理外部链接跳转
  event.preventDefault()
}

const handleImageClick = (src: string, alt: string, event: Event) => {
  console.log('图片点击:', src, alt)
  // 可以在这里实现图片预览功能
}

const handleCodeCopy = (code: string, language: string) => {
  console.log('代码复制:', language, code)
}

const handleAnchorClick = (anchor: string, event: Event) => {
  console.log('锚点点击:', anchor)
}

const handleError = (error: Error) => {
  console.error('渲染错误:', error)
}

const handleContentChange = (content: string) => {
  console.log('内容变化:', content)
}
</script>
```

## 插槽系统

### 可用插槽

| 插槽名 | 作用域参数 | 说明 |
|--------|------------|------|
| default | { html: string, content: string } | 自定义渲染内容 |
| loading | - | 加载状态内容 |
| error | { error: Error } | 错误状态内容 |
| code-block | { code: string, language: string, meta: string } | 自定义代码块渲染 |
| image | { src: string, alt: string, title: string } | 自定义图片渲染 |
| link | { href: string, text: string, title: string } | 自定义链接渲染 |
| table | { headers: string[], rows: string[][] } | 自定义表格渲染 |
| toc | { headings: Array<{ level: number, text: string, anchor: string }> } | 自定义目录渲染 |

### 插槽使用示例

```vue
<template>
  <sdkwork-markdown-content :content="content">
    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="custom-loading">
        <span>正在加载 Markdown 内容...</span>
      </div>
    </template>

    <!-- 自定义错误状态 -->
    <template #error="{ error }">
      <div class="custom-error">
        <h3>渲染失败</h3>
        <p>{{ error.message }}</p>
      </div>
    </template>

    <!-- 自定义代码块 -->
    <template #code-block="{ code, language, meta }">
      <div class="custom-code-block">
        <div class="code-header">
          <span class="language">{{ language }}</span>
          <button @click="copyCode(code)">复制</button>
        </div>
        <pre><code>{{ code }}</code></pre>
      </div>
    </template>

    <!-- 自定义目录 -->
    <template #toc="{ headings }">
      <nav class="custom-toc">
        <h4>文章目录</h4>
        <ul>
          <li v-for="heading in headings" :key="heading.anchor">
            <a :href="`#${heading.anchor}`">{{ heading.text }}</a>
          </li>
        </ul>
      </nav>
    </template>
  </sdkwork-markdown-content>
</template>
```

## 实例方法

通过 ref 可以调用组件实例的方法：

```vue
<template>
  <sdkwork-markdown-content ref="markdownRef" :content="content" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { SdkworkMarkdownContentInstance } from './types'

const markdownRef = ref<SdkworkMarkdownContentInstance>()

onMounted(() => {
  if (markdownRef.value) {
    // 重新渲染
    markdownRef.value.rerender()
    
    // 获取渲染后的 HTML
    const html = markdownRef.value.getHtml()
    console.log('HTML:', html)
    
    // 获取目录
    const toc = markdownRef.value.getToc()
    console.log('目录:', toc)
    
    // 滚动到锚点
    markdownRef.value.scrollToAnchor('section-1')
    
    // 复制代码
    markdownRef.value.copyCode('javascript', 'console.log("hello")')
    
    // 更新内容
    markdownRef.value.updateContent('# 新内容')
  }
})
</script>
```

## 主题配置

### 内置主题

组件内置了三种主题：

1. **light** - 亮色主题（默认）
2. **dark** - 暗色主题
3. **github** - GitHub 风格主题

### 自定义主题

```vue
<template>
  <sdkwork-markdown-content
    :content="content"
    :style-config="customTheme"
  />
</template>

<script setup lang="ts">
import type { MarkdownStyleConfig } from './types'

const customTheme: MarkdownStyleConfig = {
  fontFamily: 'Georgia, serif',
  fontSize: '18px',
  lineHeight: '1.8',
  color: '#2c3e50',
  backgroundColor: '#f8f9fa',
  codeBlockBackground: '#e9ecef',
  codeBlockFontFamily: 'Courier New, monospace',
  codeBlockFontSize: '15px',
  linkColor: '#2980b9',
  linkHoverColor: '#3498db',
  blockquoteBackground: '#f1f3f4',
  blockquoteBorderColor: '#bdc3c7'
}
</script>
```

## 高级用法

### 动态内容更新

```vue
<template>
  <div>
    <button @click="updateContent">更新内容</button>
    <sdkwork-markdown-content 
      ref="markdownRef" 
      :content="dynamicContent" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dynamicContent = ref('# 初始内容')
const markdownRef = ref()

const updateContent = () => {
  dynamicContent.value = `# 更新后的内容\n\n更新时间: ${new Date().toLocaleString()}`
  
  // 或者使用实例方法
  markdownRef.value?.updateContent('# 通过实例方法更新内容')
}
</script>
```

### 性能优化（懒加载）

```vue
<template>
  <sdkwork-markdown-content
    :content="largeContent"
    :lazy="true"
    :lazy-threshold="200"
  />
</template>
```

### 自定义渲染器

```vue
<script setup lang="ts">
import { marked } from 'marked'

// 自定义渲染器
const renderer = new marked.Renderer()

// 自定义链接渲染
renderer.link = (href, title, text) => {
  const isExternal = href.startsWith('http')
  const target = isExternal ? ' target="_blank"' : ''
  const rel = isExternal ? ' rel="noopener noreferrer"' : ''
  return `<a href="${href}"${target}${rel}>${text}</a>`
}

// 自定义代码块渲染
renderer.code = (code, language) => {
  const validLanguage = language || 'text'
  return `
    <div class="custom-code-block">
      <pre><code class="language-${validLanguage}">${code}</code></pre>
    </div>
  `
}

// 使用自定义渲染器
const renderOptions = {
  renderer: renderer
}
</script>

<template>
  <sdkwork-markdown-content
    :content="content"
    :render-options="renderOptions"
  />
</template>
```

## 样式定制

组件使用 CSS 变量进行样式定制，可以覆盖以下变量：

```css
/* 在你的样式文件中覆盖这些变量 */
.sdkwork-markdown-content {
  --markdown-font-family: 'Your Font Family';
  --markdown-font-size: 16px;
  --markdown-line-height: 1.6;
  --markdown-text-color: #333;
  --markdown-bg-color: transparent;
  --markdown-primary-color: #1890ff;
  --markdown-error-color: #ff4d4f;
  --markdown-heading-color: #333;
  --markdown-link-color: #0366d6;
  --markdown-link-hover-color: #0366d6;
  --markdown-code-bg: rgba(175, 184, 193, 0.2);
  --markdown-code-block-bg: #f6f8fa;
  --markdown-code-block-border: #e1e4e8;
  --markdown-blockquote-bg: #f6f8fa;
  --markdown-blockquote-border: #dfe2e5;
  --markdown-table-border: #dfe2e5;
  --markdown-table-header-bg: #f6f8fa;
}

/* 暗色主题变量 */
.sdkwork-markdown-content.markdown-theme-dark {
  --markdown-text-color: #e8e8e8;
  --markdown-bg-color: #1e1e1e;
  --markdown-heading-color: #e8e8e8;
  --markdown-code-block-bg: #2d2d2d;
  --markdown-code-block-border: #444;
  --markdown-blockquote-bg: #2a2a2a;
  --markdown-blockquote-border: #555;
  --markdown-table-header-bg: #2a2a2a;
}
```

## 注意事项

1. **安全渲染**：默认启用安全渲染，防止 XSS 攻击
2. **性能优化**：对于大文档建议启用懒加载
3. **代码高亮**：需要引入 highlight.js 的 CSS 样式文件
4. **自定义渲染**：可以通过 renderer 选项完全自定义渲染逻辑
5. **响应式**：默认启用响应式，移动端会自动调整样式

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License