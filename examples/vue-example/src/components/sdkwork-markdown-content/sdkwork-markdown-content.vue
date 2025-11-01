<template>
  <div
    ref="containerRef"
    class="sdkwork-markdown-content"
    :class="[className, themeClass, responsiveClass]"
    :style="computedStyles"
  >
    <!-- 加载状态 -->
    <div v-if="loading && lazy" class="markdown-loading">
      <slot name="loading">
        <div class="default-loading">
          <div class="loading-spinner"></div>
          <span>加载中...</span>
        </div>
      </slot>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="markdown-error">
      <slot name="error" :error="error">
        <div class="default-error">
          <div class="error-icon">⚠️</div>
          <div class="error-message">渲染失败: {{ error.message }}</div>
        </div>
      </slot>
    </div>

    <!-- 目录区域 -->
    <div v-if="toc && headings.length > 0" class="markdown-toc">
      <slot name="toc" :headings="headings">
        <div class="toc-container">
          <div class="toc-title">目录</div>
          <ul class="toc-list">
            <li
              v-for="heading in headings"
              :key="heading.anchor"
              :class="['toc-item', `toc-level-${heading.level}`]"
            >
              <a
                :href="`#${heading.anchor}`"
                class="toc-link"
                @click.prevent="handleAnchorClick(heading.anchor, $event)"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </div>
      </slot>
    </div>

    <!-- 主要内容区域 -->
    <div
      v-if="!loading && !error"
      class="markdown-body"
      v-html="renderedHtml"
      @click="handleContentClick"
    ></div>

    <!-- 自定义渲染插槽 -->
    <slot v-if="!loading && !error" :html="renderedHtml" :content="content" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import type {
  SdkworkMarkdownContentProps,
  SdkworkMarkdownContentEmits,
  SdkworkMarkdownContentSlots,
  SdkworkMarkdownContentInstance,
  MarkdownRenderOptions,
  MarkdownStyleConfig
} from './types'

// 组件属性定义
const props = withDefaults(defineProps<SdkworkMarkdownContentProps>(), {
  content: '',
  safe: true,
  renderOptions: () => ({}),
  styleConfig: () => ({}),
  className: '',
  lazy: false,
  lazyThreshold: 100,
  codeCopyable: true,
  imagePreview: true,
  anchorLinks: true,
  anchorOffset: 0,
  toc: false,
  tocMaxDepth: 3,
  responsive: true,
  responsiveBreakpoints: () => ({})
})

// 组件事件定义
const emit = defineEmits<SdkworkMarkdownContentEmits>()

// 组件插槽定义
defineSlots<SdkworkMarkdownContentSlots>()

// 响应式数据
const containerRef = ref<HTMLElement>()
const renderedHtml = ref('')
const loading = ref(false)
const error = ref<Error | null>(null)
const headings = ref<Array<{ level: number; text: string; anchor: string }>>([])
const isInViewport = ref(!props.lazy)

// 合并配置
const mergedRenderOptions = computed(() => ({
  ...props.renderOptions,
  highlight: props.renderOptions.highlight ?? true
}))

const mergedStyleConfig = computed(() => ({
  ...props.styleConfig
}))

const mergedBreakpoints = computed(() => ({
  ...props.responsiveBreakpoints
}))

// 计算样式
const computedStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (mergedStyleConfig.value.fontFamily) {
    styles.fontFamily = mergedStyleConfig.value.fontFamily
  }
  if (mergedStyleConfig.value.fontSize) {
    styles.fontSize = mergedStyleConfig.value.fontSize
  }
  if (mergedStyleConfig.value.lineHeight) {
    styles.lineHeight = mergedStyleConfig.value.lineHeight
  }
  
  // 文字颜色处理：使用主题变量或配置的颜色
  if (mergedStyleConfig.value.color) {
    styles.color = mergedStyleConfig.value.color
  } else {
    // 默认使用主题变量
    styles.color = 'var(--theme-text-color, #323233)'
  }
  
  if (mergedStyleConfig.value.backgroundColor) {
    styles.backgroundColor = mergedStyleConfig.value.backgroundColor
  } else {
    // 默认使用主题变量
    styles.backgroundColor = 'var(--theme-background-color, transparent)'
  }
  
  return styles
})

// 主题类名
const themeClass = computed(() => {
  // 使用主题变量检测当前主题
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                 window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = isDark ? 'dark' : 'light'
  return `markdown-theme-${theme}`
})

// 响应式类名
const responsiveClass = computed(() => {
  if (!props.responsive) return ''
  return 'markdown-responsive'
})

// HTML转义函数
const escape = (html: string): string => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 代码高亮函数
const highlightCode = (code: string, language: string): string => {
  if (!mergedRenderOptions.value.highlight) return code
  
  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value
    } else {
      return hljs.highlightAuto(code).value
    }
  } catch (err) {
    console.warn('代码高亮失败:', err)
    return code
  }
}

// 锚点生成函数
const generateAnchor = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 提取标题
const extractHeadings = (html: string): Array<{ level: number; text: string; anchor: string }> => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const headings: Array<{ level: number; text: string; anchor: string }> = []
  
  headingElements.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1))
    if (level > (props.tocMaxDepth || 3)) return
    
    const text = heading.textContent || ''
    const anchor = heading.id || generateAnchor(text)
    
    // 设置锚点ID
    if (!heading.id) {
      heading.id = anchor
    }
    
    headings.push({ level, text, anchor })
  })
  
  return headings
}

// 添加锚点链接
const addAnchorLinks = (html: string): string => {
  if (!props.anchorLinks) return html
  
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
  
  headingElements.forEach((heading) => {
    const text = heading.textContent || ''
    const anchor = heading.id || generateAnchor(text)
    
    if (!heading.id) {
      heading.id = anchor
    }
    
    const link = document.createElement('a')
    link.href = `#${anchor}`
    link.className = 'anchor-link'
    link.innerHTML = '#'
    link.addEventListener('click', (event) => {
      event.preventDefault()
      handleAnchorClick(anchor, event)
    })
    
    heading.appendChild(link)
  })
  
  return tempDiv.innerHTML
}

// 添加代码复制功能
const addCodeCopyButtons = (html: string): string => {
  if (!props.codeCopyable) return html
  
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  const codeBlocks = tempDiv.querySelectorAll('pre code')
  
  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement
    if (!pre) return
    
    const language = codeBlock.className.replace('language-', '') || 'text'
    const code = codeBlock.textContent || ''
    
    const copyButton = document.createElement('button')
    copyButton.className = 'code-copy-button'
    copyButton.innerHTML = '复制'
    copyButton.addEventListener('click', () => handleCodeCopy(code, language))
    
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'code-copy-container'
    buttonContainer.appendChild(copyButton)
    
    pre.appendChild(buttonContainer)
  })
  
  return tempDiv.innerHTML
}

// 安全渲染
const sanitizeHtml = (html: string): string => {
  if (!props.safe) return html
  
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'del', 'code', 'pre',
        'ul', 'ol', 'li',
        'blockquote',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'img',
        'div', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id',
        'colspan', 'rowspan', 'align', 'width', 'height'
      ]
    })
  } catch (err) {
    console.warn('HTML净化失败:', err)
    return html
  }
}

// 渲染markdown
const renderMarkdown = async (markdown: string): Promise<string> => {
  if (!markdown.trim()) return ''
  
  try {
    loading.value = true
    error.value = null
    
    // 配置marked - 使用marked.js 16.x版本的配置方式
    const { highlight: _, ...restOptions } = mergedRenderOptions.value
    
    // 创建自定义渲染器来处理代码高亮 - 适配marked.js 16.x
    const renderer = new marked.Renderer()
    
    // 重写代码块渲染方法 - 适配marked.js 16.x版本
    const originalCode = renderer.code
    renderer.code = function({ text, lang, escaped }: { text: string; lang?: string; escaped?: boolean }) {
      // 如果需要代码高亮且有语言指定
      if (mergedRenderOptions.value.highlight && lang) {
        const highlighted = highlightCode(text, lang)
        const codeClass = `hljs language-${lang}`
        return `<pre><code class="${codeClass}">${highlighted}</code></pre>`
      }
      
      // 如果没有高亮或没有语言，使用原始渲染方法
      return originalCode.call(this, { text, lang, escaped, type: 'code', raw: text })
    }
    
    // 设置marked选项 - 使用marked.js 16.x的配置方式
    marked.setOptions({
      breaks: restOptions.breaks ?? false,
      gfm: true,
      tables: restOptions.tables ?? true,
      renderer,
      ...restOptions
    })
    
    // 渲染markdown - 使用marked.js 16.x的API，添加错误处理避免t.at错误
    let html: string
    try {
      html = await marked.parse(markdown)
    } catch (parseError) {
      // 如果marked.parse失败，尝试使用更安全的解析方式
      console.warn('marked.parse失败，尝试使用备用解析方式:', parseError)
      
      // 使用更简单的解析方式，避免复杂的Markdown语法
      html = markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
        .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\`(.*)\`/gim, '<code>$1</code>')
        .replace(/\\r\\n/gim, '<br />')
    }
    
    // 后处理
    html = addAnchorLinks(html)
    html = addCodeCopyButtons(html)
    html = sanitizeHtml(html)
    
    // 提取标题
    headings.value = extractHeadings(html)
    
    return html
  } catch (err) {
    const error = err instanceof Error ? err : new Error('渲染失败') 
    emit('error', error)
    return ''
  } finally {
    loading.value = false
  }
}

// 事件处理函数
const handleContentClick = (event: Event) => {
  const target = event.target as HTMLElement
  
  // 链接点击
  if (target.tagName === 'A') {
    const href = target.getAttribute('href')
    if (href && !href.startsWith('#')) {
      emit('link-click', href, event)
      event.preventDefault()
    }
  }
  
  // 图片点击
  if (target.tagName === 'IMG') {
    const src = target.getAttribute('src') || ''
    const alt = target.getAttribute('alt') || ''
    if (props.imagePreview) {
      emit('image-click', src, alt, event)
    }
  }
}

const handleAnchorClick = (anchor: string, event: Event) => {
  emit('anchor-click', anchor, event)
  
  // 滚动到锚点
  const targetElement = document.getElementById(anchor)
  if (targetElement) {
    const offsetTop = targetElement.offsetTop - (props.anchorOffset || 0)
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }
}

const handleCodeCopy = async (code: string, language: string) => {
  try {
    await navigator.clipboard.writeText(code)
    emit('code-copy', code, language)
    
    // 可以添加复制成功的反馈
    console.log('代码复制成功')
  } catch (err) {
    console.error('代码复制失败:', err)
  }
}

// 懒加载检查
const checkViewport = () => {
  if (!containerRef.value || !props.lazy) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const threshold = props.lazyThreshold || 100
  
  isInViewport.value = 
    rect.top <= window.innerHeight + threshold &&
    rect.bottom >= -threshold
}

// 监听内容变化
watch(() => props.content, async (newContent) => {
  if (!isInViewport.value && props.lazy) return
  
  const html = await renderMarkdown(newContent)
  renderedHtml.value = html
  emit('rendered', html)
  emit('content-change', newContent)
  
  // 等待DOM更新后重新检查标题
  await nextTick()
  headings.value = extractHeadings(html)
}, { immediate: true })

// 生命周期
onMounted(() => {
  if (props.lazy) {
    checkViewport()
    window.addEventListener('scroll', checkViewport)
    window.addEventListener('resize', checkViewport)
  }
})

onUnmounted(() => {
  if (props.lazy) {
    window.removeEventListener('scroll', checkViewport)
    window.removeEventListener('resize', checkViewport)
  }
})

// 组件实例方法
const rerender = async () => {
  const html = await renderMarkdown(props.content)
  renderedHtml.value = html
  emit('rendered', html)
}

const getHtml = (): string => renderedHtml.value

const getToc = (): Array<{ level: number; text: string; anchor: string }> => headings.value

const scrollToAnchor = (anchor: string) => {
  handleAnchorClick(anchor, new Event('click'))
}

const copyCode = async (language: string, code: string) => {
  await handleCodeCopy(code, language)
}

const updateContent = (newContent: string) => {
  // 通过emit触发内容更新
  emit('content-change', newContent)
}

const destroy = () => {
  // 清理事件监听器
  if (props.lazy) {
    window.removeEventListener('scroll', checkViewport)
    window.removeEventListener('resize', checkViewport)
  }
}

// 暴露组件实例方法
defineExpose<SdkworkMarkdownContentInstance>({
  rerender,
  getHtml,
  getToc,
  scrollToAnchor,
  copyCode,
  updateContent,
  destroy
})
</script>

<style scoped>
.sdkwork-markdown-content {
  position: relative;
  width: 100%;
  min-height: 1px;
}

.markdown-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.markdown-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: var(--markdown-text-color, #666);
}

.default-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--markdown-primary-color, #1890ff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.markdown-error {
  padding: 40px;
  text-align: center;
  color: var(--markdown-error-color, #ff4d4f);
}

.default-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.error-icon {
  font-size: 48px;
}

.markdown-toc {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--markdown-toc-bg, #f8f9fa);
  border-radius: 6px;
  border-left: 4px solid var(--markdown-primary-color, #1890ff);
}

.toc-container {
  max-height: 300px;
  overflow-y: auto;
}

.toc-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--markdown-text-color, #333);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 4px 0;
}

.toc-level-1 { padding-left: 0; }
.toc-level-2 { padding-left: 16px; }
.toc-level-3 { padding-left: 32px; }
.toc-level-4 { padding-left: 48px; }
.toc-level-5 { padding-left: 64px; }
.toc-level-6 { padding-left: 80px; }

.toc-link {
  color: var(--markdown-link-color, #0366d6);
  text-decoration: none;
  font-size: 14px;
  line-height: 1.4;
}

.toc-link:hover {
  color: var(--markdown-link-hover-color, #0366d6);
  text-decoration: underline;
}

.markdown-body {
  word-wrap: break-word;
  word-break: break-word;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .markdown-responsive .markdown-body {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .markdown-toc {
    margin-bottom: 6px;
    padding: 2px;
  }
}
</style>

<style>
/* 全局markdown样式 */
.sdkwork-markdown-content .markdown-body {
  font-family: var(--markdown-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
  font-size: var(--markdown-font-size, 16px);
  line-height: var(--markdown-line-height, 1.6);
  color: var(--theme-text-color, var(--markdown-text-color, #323233));
  background-color: var(--theme-background-color, var(--markdown-bg-color, transparent));
}

/* 优化单行文本的间距 */
.sdkwork-markdown-content .markdown-body:has(> p:only-child) p {
  margin-bottom: 0;
}

/* 当只有一个段落时，移除底部间距 */
.sdkwork-markdown-content .markdown-body:has(> p:first-child:last-child) p {
  margin-bottom: 0;
}

/* 优化聊天消息场景的段落间距 */
.sdkwork-markdown-content.is-chat-message .markdown-body p {
  margin-top: 0;
  margin-bottom: 8px;
}

.sdkwork-markdown-content.is-chat-message .markdown-body p:first-child {
  margin-top: 0;
}

.sdkwork-markdown-content.is-chat-message .markdown-body p:last-child {
  margin-bottom: 0;
}

/* 单行文本优化 - 确保顶部和底部间距都为0 */
.sdkwork-markdown-content.is-chat-message .markdown-body:has(> p:only-child) p {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.sdkwork-markdown-content .markdown-body h1,
.sdkwork-markdown-content .markdown-body h2,
.sdkwork-markdown-content .markdown-body h3,
.sdkwork-markdown-content .markdown-body h4,
.sdkwork-markdown-content .markdown-body h5,
.sdkwork-markdown-content .markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--theme-text-color, var(--markdown-heading-color, #323233));
}

.sdkwork-markdown-content .markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--markdown-border-color, #eaecef);
  padding-bottom: 0.3em;
}

.sdkwork-markdown-content .markdown-body h2 {
  font-size: 1.5em;
}

.sdkwork-markdown-content .markdown-body h3 {
  font-size: 1.25em;
}

.sdkwork-markdown-content .markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.sdkwork-markdown-content .markdown-body blockquote {
  margin: 16px 0;
  padding: 0 16px;
  border-left: 4px solid var(--markdown-blockquote-border-color, #dfe2e5);
  background-color: var(--markdown-blockquote-bg, #f6f8fa);
  color: var(--markdown-blockquote-text, #6a737d);
}

.sdkwork-markdown-content .markdown-body code {
  padding: 2px 4px;
  background-color: var(--markdown-code-bg, rgba(175, 184, 193, 0.2));
  border-radius: 3px;
  font-family: var(--markdown-code-font, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace);
  font-size: 0.9em;
}

.sdkwork-markdown-content .markdown-body pre {
  position: relative;
  margin: 16px 0;
  padding: 16px;
  background-color: var(--markdown-code-block-bg, #f6f8fa);
  border-radius: 6px;
  border: 1px solid var(--markdown-code-block-border, #e1e4e8);
  overflow: auto;
}

.sdkwork-markdown-content .markdown-body pre code {
  padding: 0;
  background: none;
  border: none;
  font-size: var(--markdown-code-block-font-size, 14px);
}

.sdkwork-markdown-content .markdown-body .code-copy-container {
  position: absolute;
  top: 8px;
  right: 8px;
}

.sdkwork-markdown-content .markdown-body .code-copy-button {
  padding: 4px 8px;
  background: var(--markdown-code-copy-bg, #fff);
  border: 1px solid var(--markdown-code-copy-border, #d0d7de);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: var(--markdown-code-copy-text, #656d76);
}

.sdkwork-markdown-content .markdown-body .code-copy-button:hover {
  background: var(--markdown-code-copy-hover-bg, #f6f8fa);
}

.sdkwork-markdown-content .markdown-body .anchor-link {
  margin-left: 8px;
  opacity: 0;
  text-decoration: none;
  color: var(--markdown-anchor-color, #ccc);
  font-size: 0.8em;
}

.sdkwork-markdown-content .markdown-body h1:hover .anchor-link,
.sdkwork-markdown-content .markdown-body h2:hover .anchor-link,
.sdkwork-markdown-content .markdown-body h3:hover .anchor-link,
.sdkwork-markdown-content .markdown-body h4:hover .anchor-link,
.sdkwork-markdown-content .markdown-body h5:hover .anchor-link,
.sdkwork-markdown-content .markdown-body h6:hover .anchor-link {
  opacity: 1;
}

.sdkwork-markdown-content .markdown-body a {
  color: var(--theme-primary-color, var(--markdown-link-color, #0366d6));
  text-decoration: none;
}

.sdkwork-markdown-content .markdown-body a:hover {
  color: var(--theme-primary-color, var(--markdown-link-hover-color, #0366d6));
  text-decoration: underline;
}

.sdkwork-markdown-content .markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.sdkwork-markdown-content .markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.sdkwork-markdown-content .markdown-body table th,
.sdkwork-markdown-content .markdown-body table td {
  padding: 8px 12px;
  border: 1px solid var(--markdown-table-border, #dfe2e5);
}

.sdkwork-markdown-content .markdown-body table th {
  background-color: var(--markdown-table-header-bg, #f6f8fa);
  font-weight: 600;
}

.sdkwork-markdown-content .markdown-body ul,
.sdkwork-markdown-content .markdown-body ol {
  padding-left: 2em;
  margin: 16px 0;
}

.sdkwork-markdown-content .markdown-body li {
  margin: 4px 0;
}

/* 暗色主题 */
.sdkwork-markdown-content.markdown-theme-dark .markdown-body {
  color: var(--markdown-dark-text, #e8e8e8);
  background-color: var(--markdown-dark-bg, transparent);
}

.sdkwork-markdown-content.markdown-theme-dark .markdown-body h1,
.sdkwork-markdown-content.markdown-theme-dark .markdown-body h2,
.sdkwork-markdown-content.markdown-theme-dark .markdown-body h3,
.sdkwork-markdown-content.markdown-theme-dark .markdown-body h4,
.sdkwork-markdown-content.markdown-theme-dark .markdown-body h5,
.sdkwork-markdown-content.markdown-theme-dark .markdown-body h6 {
  color: var(--markdown-dark-heading, #e8e8e8);
}

.sdkwork-markdown-content.markdown-theme-dark .markdown-body blockquote {
  background-color: var(--markdown-dark-blockquote-bg, #2a2a2a);
  border-left-color: var(--markdown-dark-blockquote-border, #555);
  color: var(--markdown-dark-blockquote-text, #b0b0b0);
}

.sdkwork-markdown-content.markdown-theme-dark .markdown-body pre {
  background-color: var(--markdown-dark-code-block-bg, #2d2d2d);
  border-color: var(--markdown-dark-code-block-border, #444);
}

.sdkwork-markdown-content.markdown-theme-dark .markdown-body table th {
  background-color: var(--markdown-dark-table-header-bg, #2a2a2a);
}

/* 响应式表格 */
@media (max-width: 768px) {
  .sdkwork-markdown-content .markdown-body table {
    display: block;
    overflow-x: auto;
  }
}
</style>