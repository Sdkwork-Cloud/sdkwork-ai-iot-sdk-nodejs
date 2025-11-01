import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { ConversationVO } from '@/services/src/service/conversation/types'
import type { ConversationStatus, ConversationType } from 'sdkwork-sdk-api-typescript'

/**
 * 聊天会话实体 - 使用VO模式
 */
export type Conversation = ConversationVO

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