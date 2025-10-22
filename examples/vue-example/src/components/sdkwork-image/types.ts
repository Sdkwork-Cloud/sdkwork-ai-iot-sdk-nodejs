/**
 * SdkworkImage 组件类型定义
 * 完全兼容 Vant Image 组件 API
 */

export interface SdkworkImageProps {
  /** 图片链接 */
  src?: string
  /** 替代文本 */
  alt?: string
  /** 图片填充模式 */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /** 图片位置，仅当 fit 为 contain 或 cover 时有效 */
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left' | string
  /** 是否显示为圆形 */
  round?: boolean
  /** 是否将图片显示为块级元素 */
  block?: boolean
  /** 宽度，默认单位为 px */
  width?: string | number
  /** 高度，默认单位为 px */
  height?: string | number
  /** 预设尺寸 */
  size?: 'small' | 'medium' | 'large' | number
  /** 圆角大小，默认单位为 px */
  radius?: string | number
  /** 是否开启懒加载 */
  lazy?: boolean
  /** 懒加载偏移量 */
  lazyOffset?: string | number
  /** 是否显示图片加载失败提示 */
  showError?: boolean
  /** 是否显示图片加载中提示 */
  showLoading?: boolean
  /** 自定义加载图标 */
  loadingIcon?: string
  /** 自定义加载图标大小 */
  loadingIconSize?: string | number
  /** 自定义加载文字 */
  loadingText?: string
  /** 自定义失败图标 */
  errorIcon?: string
  /** 自定义失败图标大小 */
  errorIconSize?: string | number
  /** 自定义失败文字 */
  errorText?: string
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
  /** 加载完成事件 */
  onLoad?: (event: Event) => void
  /** 加载失败事件 */
  onError?: (event: Event) => void
  /** 是否显示图片加载失败时的占位图 */
  errorPlaceholder?: boolean
  /** 是否显示图片加载中的占位图 */
  loadingPlaceholder?: boolean
}

export interface SdkworkImageSlots {
  /** 加载状态插槽 */
  loading?: () => any
  /** 错误状态插槽 */
  error?: () => any
  /** 默认插槽 */
  default?: () => any
}

export interface SdkworkImageEmits {
  /** 点击事件 */
  click: [event: Event]
  /** 加载完成事件 */
  load: [event: Event]
  /** 加载失败事件 */
  error: [event: Event]
}

export interface SdkworkImageExposed {
  /** 获取图片是否已加载 */
  isLoaded: () => boolean
  /** 获取图片是否加载失败 */
  isErrored: () => boolean
  /** 重新加载图片 */
  reload: () => void
}