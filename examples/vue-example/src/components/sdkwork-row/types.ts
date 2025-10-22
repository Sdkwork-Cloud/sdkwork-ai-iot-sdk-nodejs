/**
 * Row 组件 Props 类型定义
 */
export interface SdkworkRowProps {
  /** 布局方式，可选值为 flex */
  type?: string
  /** Flex 主轴对齐方式，可选值为 end center space-around space-between */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
  /** Flex 交叉轴对齐方式，可选值为 top center bottom */
  align?: 'top' | 'center' | 'bottom'
  /** 是否自动换行 */
  wrap?: boolean
  /** 栅格间隔，默认单位为 px */
  gutter?: string | number
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
}

/**
 * Row 组件事件类型定义
 */
export interface SdkworkRowEmits {
  /** 点击事件 */
  click: [event: Event]
}

/**
 * Row 组件插槽类型定义
 */
export interface SdkworkRowSlots {
  /** 默认插槽 */
  default?: () => any
}

/**
 * Row 组件实例方法
 */
export interface SdkworkRowInstance {
  /** 获取行配置 */
  getConfig: () => {
    gutter: string | number
    type: string
    justify: 'start' | 'end' | 'center' | 'space-around' | 'space-between'
    align: 'top' | 'center' | 'bottom'
    wrap: boolean
  }
}