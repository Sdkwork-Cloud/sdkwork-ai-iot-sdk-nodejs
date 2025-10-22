/**
 * Col 组件 Props 类型定义
 */
export interface SdkworkColProps {
  /** 列元素宽度（共24等分），可选值为 0-24 的整数或 auto */
  span?: string | number
  /** 列元素偏移距离（共24等分），可选值为 0-24 的整数 */
  offset?: string | number
  /** 列元素顺序，用于 flex 布局下排序 */
  order?: string | number
  /** flex 布局属性 */
  flex?: string | number
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
}

/**
 * Col 组件事件类型定义
 */
export interface SdkworkColEmits {
  /** 点击事件 */
  click: [event: Event]
}

/**
 * Col 组件插槽类型定义
 */
export interface SdkworkColSlots {
  /** 默认插槽 */
  default?: () => any
}

/**
 * Col 组件实例方法
 */
export interface SdkworkColInstance {
  /** 获取列配置 */
  getConfig: () => {
    span: string | number
    offset: string | number
    order: string | number
    flex: string | number
  }
}

/**
 * 栅格系统配置
 */
export interface SdkworkGridConfig {
  /** 栅格间隔 */
  gutter?: number
}