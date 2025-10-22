import type { Page, Pageable } from 'sdkwork-commons-typescript'

/**
 * 聊天会话状态
 */
export type ConversationStatus = 'active' | 'archived' | 'deleted'

/**
 * 聊天会话类型
 */
export type ConversationType = 'text' | 'voice' | 'video'

/**
 * 聊天会话消息
 */
export interface ConversationMessage {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: string
  type: 'text' | 'image' | 'audio' | 'video' | 'file'
  read: boolean
}

/**
 * 聊天会话参与者
 */
export interface ConversationParticipant {
  id: string
  name: string
  avatar?: string
  type: 'user' | 'agent'
  online: boolean
}

/**
 * 聊天会话实体
 */
export interface Conversation {
  id: string
  title: string
  description?: string
  type: ConversationType
  status: ConversationStatus
  participants: ConversationParticipant[]
  lastMessage?: ConversationMessage
  unreadCount: number
  createdAt: string
  updatedAt: string
  agentId?: string
  agentName?: string
  tags?: string[]
  pinned: boolean
  muted: boolean
}

/**
 * 聊天会话列表查询参数
 */
export interface ConversationQueryParams {
  status?: ConversationStatus
  type?: ConversationType
  keyword?: string
  agentId?: string
  pinned?: boolean
  muted?: boolean
  startTime?: string
  endTime?: string
}

/**
 * 聊天会话分页响应
 */
export type ConversationPage = Page<Conversation>

/**
 * 聊天会话分页请求
 */
export interface ConversationPageable extends Pageable {
  filters?: ConversationQueryParams
}

/**
 * 聊天会话事件类型
 */
export interface ConversationEvents {
  (e: 'select', conversation: Conversation): void
  (e: 'delete', conversation: Conversation): void
  (e: 'archive', conversation: Conversation): void
  (e: 'pin', conversation: Conversation): void
  (e: 'mute', conversation: Conversation): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: ConversationPage): void
  (e: 'click', conversation: Conversation): void
  (e: 'context-menu', conversation: Conversation, event: MouseEvent): void
}