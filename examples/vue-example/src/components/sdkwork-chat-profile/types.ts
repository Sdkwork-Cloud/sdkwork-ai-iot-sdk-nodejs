// 基础详情信息接口
export interface BaseProfileInfo {
  id: string
  name: string
  avatar?: string
  description?: string
  phone?: string
  email?: string
  location?: string
  gender?: string
  birthday?: string
  company?: string
  position?: string
  isOnline?: boolean
}

// 群组信息接口
export interface GroupInfo {
  memberCount: number
  owner?: {
    id: string
    name: string
    avatar?: string
  }
  createTime?: string
  notice?: string
  qrCode?: string
}

// 智能体信息接口
export interface AgentInfo {
  model?: string
  version?: string
  category?: string
  usageCount?: number
  rating?: number
  description?: string
}

// 客服信息接口
export interface CustomerServiceInfo {
  workTime?: string
  department?: string
  skill?: string
  responseTime?: string
  satisfaction?: number
}

// 详情类型
export type ProfileType = 'user' | 'group' | 'agent' | 'customer-service'

// 主组件 Props 定义
export interface SdkworkChatProfileProps {
  /** 详情类型 */
  profileType: ProfileType
  /** 基本信息 */
  profileInfo?: BaseProfileInfo
  /** 群组信息（仅当 profileType 为 'group' 时使用） */
  groupInfo?: GroupInfo
  /** 智能体信息（仅当 profileType 为 'agent' 时使用） */
  agentInfo?: AgentInfo
  /** 客服信息（仅当 profileType 为 'customer-service' 时使用） */
  customerServiceInfo?: CustomerServiceInfo
  /** 是否显示在线状态 */
  showOnlineStatus?: boolean
  /** 是否显示用户ID */
  showUserId?: boolean
  /** 是否被拉黑 */
  isBlocked?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

// 主组件 Emit 事件定义
export interface SdkworkChatProfileEmits {
  /** 头部点击事件 */
  (e: 'header-click', event: Event): void
  /** 头像点击事件 */
  (e: 'avatar-click', event: Event): void
  /** 名称点击事件 */
  (e: 'name-click', event: Event): void
  /** 发送消息事件 */
  (e: 'send-message'): void
  /** 进入群聊事件 */
  (e: 'enter-group'): void
  /** 与智能体对话事件 */
  (e: 'chat-with-agent'): void
  /** 手机号点击事件 */
  (e: 'phone-click'): void
  /** 邮箱点击事件 */
  (e: 'email-click'): void
  /** 查看群成员事件 */
  (e: 'view-members'): void
  /** 查看群主事件 */
  (e: 'view-owner'): void
  /** 查看群公告事件 */
  (e: 'view-notice'): void
  /** 查看群二维码事件 */
  (e: 'view-qrcode'): void
  /** 设置备注事件 */
  (e: 'set-remark'): void
  /** 查找聊天记录事件 */
  (e: 'search-chat'): void
  /** 发送名片事件 */
  (e: 'send-contact'): void
  /** 添加到通讯录事件 */
  (e: 'add-to-contacts'): void
  /** 群管理事件 */
  (e: 'group-manage'): void
  /** 投诉事件 */
  (e: 'complaint'): void
  /** 加入黑名单事件 */
  (e: 'block'): void
  /** 移出黑名单事件 */
  (e: 'unblock'): void
  /** 智能体评分事件 */
  (e: 'rate-agent'): void
  /** 自定义操作事件 */
  (e: 'custom-action', action: string, data?: any): void
}

// 用户详情组件 Props
export interface SdkworkChatUserProfileProps {
  profileInfo?: BaseProfileInfo
  showOnlineStatus?: boolean
  showUserId?: boolean
  isBlocked?: boolean
  themeMode?: 'light' | 'dark' | 'auto'
}

// 群组详情组件 Props
export interface SdkworkChatGroupProfileProps {
  profileInfo?: BaseProfileInfo
  groupInfo?: GroupInfo
  showOnlineStatus?: boolean
  showUserId?: boolean
  isBlocked?: boolean
  themeMode?: 'light' | 'dark' | 'auto'
}

// 智能体详情组件 Props
export interface SdkworkChatAgentProfileProps {
  profileInfo?: BaseProfileInfo
  agentInfo?: AgentInfo
  showOnlineStatus?: boolean
  showUserId?: boolean
  isBlocked?: boolean
  themeMode?: 'light' | 'dark' | 'auto'
}

// 客服详情组件 Props
export interface SdkworkChatServiceProfileProps {
  profileInfo?: BaseProfileInfo
  serviceInfo?: CustomerServiceInfo
  showOnlineStatus?: boolean
  showUserId?: boolean
  isBlocked?: boolean
  themeMode?: 'light' | 'dark' | 'auto'
}

// 所有详情组件的通用 Emit 事件
export interface BaseProfileEmits {
  /** 头部点击事件 */
  (e: 'header-click', event: Event): void
  /** 头像点击事件 */
  (e: 'avatar-click', event: Event): void
  /** 名称点击事件 */
  (e: 'name-click', event: Event): void
  /** 发送消息事件 */
  (e: 'send-message'): void
  /** 手机号点击事件 */
  (e: 'phone-click', phone: string): void
  /** 邮箱点击事件 */
  (e: 'email-click', email: string): void
  /** 设置备注事件 */
  (e: 'set-remark'): void
  /** 查找聊天记录事件 */
  (e: 'search-chat'): void
  /** 投诉事件 */
  (e: 'complaint'): void
  /** 加入黑名单事件 */
  (e: 'block'): void
  /** 移出黑名单事件 */
  (e: 'unblock'): void
  /** 自定义操作事件 */
  (e: 'custom-action', action: string, data?: any): void
}

// 用户详情组件特定 Emit 事件
export interface SdkworkChatUserProfileEmits extends BaseProfileEmits {
  /** 发送名片事件 */
  (e: 'send-contact'): void
  /** 添加到通讯录事件 */
  (e: 'add-to-contacts'): void
}

// 群组详情组件特定 Emit 事件
export interface SdkworkChatGroupProfileEmits extends BaseProfileEmits {
  /** 进入群聊事件 */
  (e: 'enter-group'): void
  /** 查看群成员事件 */
  (e: 'view-members'): void
  /** 查看群主事件 */
  (e: 'view-owner', owner: { id: string; name: string; avatar?: string }): void
  /** 查看群公告事件 */
  (e: 'view-notice', notice: string): void
  /** 查看群二维码事件 */
  (e: 'view-qrcode', qrCode: string): void
  /** 发送名片事件 */
  (e: 'send-contact'): void
  /** 群管理事件 */
  (e: 'group-manage'): void
}

// 智能体详情组件特定 Emit 事件
export interface SdkworkChatAgentProfileEmits extends BaseProfileEmits {
  /** 与智能体对话事件 */
  (e: 'chat-with-agent'): void
}

// 客服详情组件特定 Emit 事件
export interface SdkworkChatServiceProfileEmits extends BaseProfileEmits {
  /** 发送消息事件 */
  (e: 'send-message'): void
}

// 组件引用类型
export interface ComponentRefs {
  /** 获取基本信息 */
  getProfileInfo: () => BaseProfileInfo | undefined
  /** 获取群组信息 */
  getGroupInfo: () => GroupInfo | undefined
  /** 获取智能体信息 */
  getAgentInfo: () => AgentInfo | undefined
  /** 获取客服信息 */
  getServiceInfo: () => CustomerServiceInfo | undefined
  /** 是否在线 */
  isOnline: () => boolean
  /** 是否在黑名单中 */
  isBlocked: () => boolean
}

// 主题配置类型
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto'
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
}