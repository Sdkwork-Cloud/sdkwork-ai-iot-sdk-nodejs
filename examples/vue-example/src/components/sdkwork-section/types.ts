/**
 * SdkworkSection 组件类型定义
 */

export interface SdkworkSectionProps {
  /** 标题文本 */
  title?: string
  /** 标题右侧额外内容 */
  titleExtra?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示阴影 */
  shadow?: boolean
  /** 是否显示圆角 */
  round?: boolean
  /** 是否占满父容器宽度 */
  fullWidth?: boolean
  /** 是否居中显示 */
  center?: boolean
  /** 是否可折叠 */
  collapsible?: boolean
  /** 是否默认折叠 */
  defaultCollapsed?: boolean
  /** 内容区域是否有内边距 */
  contentPadded?: boolean
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
  /** 折叠/展开事件 */
  onCollapse?: (collapsed: boolean) => void
}

export interface SdkworkSectionEmits {
  /** 点击事件 */
  (e: 'click', event: Event): void
  /** 折叠/展开事件 */
  (e: 'collapse', collapsed: boolean): void
}

export interface SdkworkSectionSlots {
  /** 默认插槽 - 内容区域 */
  default?: () => any
  /** 标题插槽 */
  title?: () => any
  /** 标题右侧额外内容插槽 */
  'title-extra'?: () => any
  /** 操作区域插槽 */
  actions?: () => any
  /** 底部区域插槽 */
  footer?: () => any
}

export interface SdkworkSectionExpose {
  /** 展开内容 */
  expand: () => void
  /** 折叠内容 */
  collapse: () => void
  /** 切换折叠状态 */
  toggle: () => void
  /** 获取当前状态 */
  getState: () => {
    collapsed: boolean
    title?: string
    collapsible: boolean
  }
}

/** 主题配置类型 */
export interface SectionThemeConfig {
  /** 背景颜色 */
  bgColor: string
  /** 边框颜色 */
  borderColor: string
  /** 标题颜色 */
  titleColor: string
  /** 额外内容颜色 */
  extraColor: string
  /** 操作按钮颜色 */
  actionColor: string
  /** 操作按钮悬停背景色 */
  actionHoverBg: string
  /** 操作按钮悬停颜色 */
  actionHoverColor: string
  /** 底部背景色 */
  footerBg: string
}

/** 响应式断点配置 */
export interface SectionBreakpointConfig {
  /** 移动端小屏幕 */
  mobile?: Partial<SdkworkSectionProps>
  /** 平板端 */
  tablet?: Partial<SdkworkSectionProps>
  /** 桌面端 */
  desktop?: Partial<SdkworkSectionProps>
}

/** 组件配置选项 */
export interface SdkworkSectionOptions {
  /** 主题配置 */
  theme?: {
    light?: Partial<SectionThemeConfig>
    dark?: Partial<SectionThemeConfig>
  }
  /** 响应式配置 */
  breakpoints?: SectionBreakpointConfig
  /** 默认属性 */
  defaults?: Partial<SdkworkSectionProps>
}