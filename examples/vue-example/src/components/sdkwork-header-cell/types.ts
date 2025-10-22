/**
 * SdkworkHeaderCell 组件类型定义
 */

export interface HeaderCellUserInfo {
  /** 用户ID */
  id?: string
  /** 用户名 */
  name?: string
  /** 用户描述 */
  description?: string
  /** 用户头像URL */
  avatar?: string
  /** 在线状态 */
  online?: boolean
  /** 用户等级/标签 */
  level?: string
  /** 额外信息 */
  extra?: string
  /** 注册时间 */
  registerTime?: string
}

export interface HeaderCellTag {
  /** 标签文本 */
  text: string
  /** 标签类型 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  /** 标签大小 */
  size?: 'small' | 'medium' | 'large'
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
}

export interface SdkworkHeaderCellProps {
  /** 用户信息 */
  userInfo?: HeaderCellUserInfo
  /** 头像尺寸 */
  avatarSize?: string | number
  /** 头像圆角 */
  avatarRadius?: string
  /** 头像适配方式 */
  avatarFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /** 是否显示在线状态 */
  showOnlineStatus?: boolean
  /** 是否显示用户ID */
  showUserId?: boolean
  /** 是否显示注册时间 */
  showRegisterTime?: boolean
  /** 标签列表 */
  tags?: HeaderCellTag[]
  /** 自定义标签渲染 */
  customTags?: boolean
  /** 布局方向 */
  layout?: 'horizontal' | 'vertical'
  /** 内容对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示阴影 */
  shadow?: boolean
  /** 圆角大小，对应 border-radius 的值 */
  round?: string | number
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 点击事件 */
  onClick?: (event: Event) => void
  /** 头像点击事件 */
  onAvatarClick?: (event: Event) => void
  /** 名称点击事件 */
  onNameClick?: (event: Event) => void
}

export interface SdkworkHeaderCellEmits {
  /** 点击事件 */
  (e: 'click', event: Event): void
  /** 头像点击事件 */
  (e: 'avatar-click', event: Event): void
  /** 名称点击事件 */
  (e: 'name-click', event: Event): void
}

export interface SdkworkHeaderCellSlots {
  /** 默认插槽 - 自定义内容 */
  default?: () => any
  /** 头像插槽 */
  avatar?: () => any
  /** 名称插槽 */
  name?: () => any
  /** 描述插槽 */
  description?: () => any
  /** 标签插槽 */
  tags?: () => any
  /** 额外信息插槽 */
  extra?: () => any
  /** 操作区域插槽 */
  actions?: () => any
}

export interface SdkworkHeaderCellExpose {
  /** 获取用户信息 */
  getUserInfo: () => HeaderCellUserInfo | undefined
  /** 获取组件配置 */
  getConfig: () => SdkworkHeaderCellProps
}

/** 主题配置类型 */
export interface HeaderCellThemeConfig {
  /** 背景颜色 */
  bgColor: string
  /** 边框颜色 */
  borderColor: string
  /** 标题颜色 */
  titleColor: string
  /** 描述颜色 */
  descriptionColor: string
  /** 标签背景色 */
  tagBgColor: string
  /** 标签文字色 */
  tagTextColor: string
  /** 在线状态颜色 */
  onlineColor: string
  /** 离线状态颜色 */
  offlineColor: string
  /** 操作按钮颜色 */
  actionColor: string
}

/** 组件配置选项 */
export interface SdkworkHeaderCellOptions {
  /** 主题配置 */
  theme?: {
    light?: Partial<HeaderCellThemeConfig>
    dark?: Partial<HeaderCellThemeConfig>
  }
  /** 默认属性 */
  defaults?: Partial<SdkworkHeaderCellProps>
}