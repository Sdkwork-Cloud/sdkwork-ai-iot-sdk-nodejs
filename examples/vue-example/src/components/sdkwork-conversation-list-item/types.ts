import type { Conversation } from '../sdkwork-conversation-list/types'

/**
 * 会话列表项组件属性 - 简化版本，参考微信聊天会话列表
 */
export interface ConversationListItemProps {
  /** 会话数据 */
  conversation: Conversation
  /** 是否禁用 */
  disabled?: boolean
  /** 是否选中 */
  isSelected?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

/**
 * 会话列表项组件事件 - 简化版本
 */
export interface ConversationListItemEmits {
  /** 点击事件 */
  (e: 'click', conversation: Conversation): void
  /** 选中事件 */
  (e: 'select', conversation: Conversation): void
}