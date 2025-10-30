/**
 * SDKWork Markdown Content 组件类型定义
 */

/**
 * Markdown 渲染选项接口
 */
export interface MarkdownRenderOptions {
  /** 是否启用代码高亮 */
  highlight?: boolean
  /** 代码高亮主题 */
  highlightTheme?: string
  /** 是否启用数学公式渲染 */
  math?: boolean
  /** 是否启用表格渲染 */
  tables?: boolean
  /** 是否启用任务列表 */
  taskLists?: boolean
  /** 是否启用脚注 */
  footnotes?: boolean
  /** 是否启用删除线 */
  strikethrough?: boolean
  /** 是否启用自动链接 */
  autolink?: boolean
  /** 是否启用引用 */
  blockquote?: boolean
  /** 是否启用代码块 */
  code?: boolean
  /** 是否启用强调 */
  emphasis?: boolean
  /** 是否启用水平线 */
  hr?: boolean
  /** 是否启用图片 */
  image?: boolean
  /** 是否启用链接 */
  link?: boolean
  /** 是否启用列表 */
  list?: boolean
  /** 是否启用段落 */
  paragraph?: boolean
  /** 是否启用换行 */
  breaks?: boolean
  /** 是否启用内联代码 */
  inlineCode?: boolean
  /** 是否启用转义 */
  escape?: boolean
}

/**
 * 样式配置接口
 */
export interface MarkdownStyleConfig {
  /** 字体家族 */
  fontFamily?: string
  /** 字体大小 */
  fontSize?: string
  /** 行高 */
  lineHeight?: string
  /** 文字颜色 */
  color?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 代码块背景色 */
  codeBlockBackground?: string
  /** 代码块字体 */
  codeBlockFontFamily?: string
  /** 代码块字体大小 */
  codeBlockFontSize?: string
  /** 代码块边框颜色 */
  codeBlockBorderColor?: string
  /** 链接颜色 */
  linkColor?: string
  /** 链接悬停颜色 */
  linkHoverColor?: string
  /** 引用块背景色 */
  blockquoteBackground?: string
  /** 引用块边框颜色 */
  blockquoteBorderColor?: string
  /** 表格边框颜色 */
  tableBorderColor?: string
  /** 表格表头背景色 */
  tableHeaderBackground?: string
}

/**
 * 组件属性接口
 */
export interface SdkworkMarkdownContentProps {
  /** Markdown 内容 */
  content: string
  /** 是否启用安全渲染（XSS防护） */
  safe?: boolean
  /** 渲染选项 */
  renderOptions?: MarkdownRenderOptions
  /** 样式配置 */
  styleConfig?: MarkdownStyleConfig
  /** 自定义 CSS 类名 */
  className?: string
  /** 是否启用懒加载 */
  lazy?: boolean
  /** 懒加载阈值（像素） */
  lazyThreshold?: number
  /** 是否启用代码复制功能 */
  codeCopyable?: boolean
  /** 是否启用图片预览 */
  imagePreview?: boolean
  /** 是否启用锚点链接 */
  anchorLinks?: boolean
  /** 锚点链接偏移量 */
  anchorOffset?: number
  /** 是否启用目录 */
  toc?: boolean
  /** 目录最大深度 */
  tocMaxDepth?: number
  /** 是否启用响应式 */
  responsive?: boolean
  /** 响应式断点 */
  responsiveBreakpoints?: Record<string, string>
}

/**
 * 组件事件接口
 */
export interface SdkworkMarkdownContentEmits {
  /** 渲染完成事件 */
  (e: 'rendered', html: string): void
  /** 链接点击事件 */
  (e: 'link-click', url: string, event: Event): void
  /** 图片点击事件 */
  (e: 'image-click', src: string, alt: string, event: Event): void
  /** 代码复制事件 */
  (e: 'code-copy', code: string, language: string): void
  /** 锚点点击事件 */
  (e: 'anchor-click', anchor: string, event: Event): void
  /** 错误事件 */
  (e: 'error', error: Error): void
  /** 内容变化事件 */
  (e: 'content-change', content: string): void
}

/**
 * 组件插槽接口
 */
export interface SdkworkMarkdownContentSlots {
  /** 默认插槽 - 自定义渲染内容 */
  default?(props: { html: string; content: string }): any
  /** 加载中插槽 */
  loading?(): any
  /** 错误插槽 */
  error?(props: { error: Error }): any
  /** 代码块插槽 */
  'code-block'?(props: { code: string; language: string; meta: string }): any
  /** 图片插槽 */
  'image'?(props: { src: string; alt: string; title: string }): any
  /** 链接插槽 */
  'link'?(props: { href: string; text: string; title: string }): any
  /** 表格插槽 */
  'table'?(props: { headers: string[]; rows: string[][] }): any
  /** 目录插槽 */
  'toc'?(props: { headings: Array<{ level: number; text: string; anchor: string }> }): any
}

/**
 * 组件实例方法接口
 */
export interface SdkworkMarkdownContentInstance {
  /** 重新渲染内容 */
  rerender(): void
  /** 获取渲染后的 HTML */
  getHtml(): string
  /** 获取目录结构 */
  getToc(): Array<{ level: number; text: string; anchor: string }>
  /** 滚动到指定锚点 */
  scrollToAnchor(anchor: string): void
  /** 复制指定代码块内容 */
  copyCode(language: string, code: string): Promise<void>
  /** 更新内容 */
  updateContent(content: string): void
  /** 销毁组件 */
  destroy(): void
}

/**
 * 渲染器配置接口
 */
export interface MarkdownRendererConfig {
  /** marked 渲染器选项 */
  markedOptions?: any
  /** 自定义渲染器 */
  renderer?: any
  /** 自定义高亮函数 */
  highlight?: (code: string, language: string) => string
  /** 自定义解析器 */
  parse?: (markdown: string) => string
}

/**
 * 主题配置接口
 */
export interface MarkdownThemeConfig {
  /** 主题名称 */
  name: string
  /** 样式配置 */
  styles: MarkdownStyleConfig
  /** 渲染选项 */
  renderOptions: MarkdownRenderOptions
}

/**
 * 默认配置常量
 */
export const DEFAULT_RENDER_OPTIONS: MarkdownRenderOptions = {
  highlight: true,
  highlightTheme: 'github',
  math: false,
  tables: true,
  taskLists: true,
  footnotes: true,
  strikethrough: true,
  autolink: true,
  blockquote: true,
  code: true,
  emphasis: true,
  hr: true,
  image: true,
  link: true,
  list: true,
  paragraph: true,
  breaks: false,
  inlineCode: true,
  escape: true
}

/**
 * 默认样式配置
 */
export const DEFAULT_STYLE_CONFIG: MarkdownStyleConfig = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333',
  backgroundColor: 'transparent',
  codeBlockBackground: '#f6f8fa',
  codeBlockFontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
  codeBlockFontSize: '14px',
  codeBlockBorderColor: '#e1e4e8',
  linkColor: '#0366d6',
  linkHoverColor: '#0366d6',
  blockquoteBackground: '#f9f9f9',
  blockquoteBorderColor: '#ccc',
  tableBorderColor: '#dfe2e5',
  tableHeaderBackground: '#f6f8fa'
}

/**
 * 响应式断点配置
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
} as const

/**
 * 主题配置常量
 */
export const THEMES: Record<string, MarkdownThemeConfig> = {
  light: {
    name: 'light',
    styles: DEFAULT_STYLE_CONFIG,
    renderOptions: DEFAULT_RENDER_OPTIONS
  },
  dark: {
    name: 'dark',
    styles: {
      ...DEFAULT_STYLE_CONFIG,
      color: '#e8e8e8',
      backgroundColor: '#1e1e1e',
      codeBlockBackground: '#2d2d2d',
      codeBlockBorderColor: '#444',
      linkColor: '#58a6ff',
      linkHoverColor: '#58a6ff',
      blockquoteBackground: '#2a2a2a',
      blockquoteBorderColor: '#555',
      tableBorderColor: '#444',
      tableHeaderBackground: '#2a2a2a'
    },
    renderOptions: DEFAULT_RENDER_OPTIONS
  },
  github: {
    name: 'github',
    styles: {
      ...DEFAULT_STYLE_CONFIG,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      codeBlockBackground: '#f6f8fa',
      codeBlockBorderColor: '#e1e4e8',
      linkColor: '#0366d6',
      blockquoteBorderColor: '#dfe2e5'
    },
    renderOptions: DEFAULT_RENDER_OPTIONS
  }
}

/**
 * 工具函数类型定义
 */

/**
 * 安全渲染函数类型
 */
export type SanitizeFn = (html: string) => string

/**
 * 代码高亮函数类型
 */
export type HighlightFn = (code: string, language: string) => string

/**
 * 锚点生成函数类型
 */
export type AnchorGeneratorFn = (text: string) => string

/**
 * 目录生成函数类型
 */
export type TocGeneratorFn = (html: string) => Array<{ level: number; text: string; anchor: string }>