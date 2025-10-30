/**
 * SDKWork Chat 组件类型定义
 * 使用服务层统一的数据类型
 */

import { ChatMessageVO, ConversationVO, UserVO } from '@/services'

// 重新导出服务层类型
export type { 
  ChatMessageVO, 
  ConversationVO, 
  UserVO 
} from '@/services'

// 使用SDK中的消息类型
export { MessageType, MessageStatus } from 'sdkwork-sdk-api-typescript'
 
/**
 * 会话类型枚举（兼容组件原有逻辑）
 */
export enum ConversationType {
  PRIVATE = 'private',
  GROUP = 'group',
  CHANNEL = 'channel'
}

/**
 * 消息事件回调类型
 */
export type MessageCallback = (message: ChatMessageVO) => void

/**
 * 消息操作类型
 */
export interface MessageAction {
  type: 'send' | 'recall' | 'edit' | 'reply'
  message: ChatMessageVO
}

/**
 * 组件事件定义
 */
export interface SDKWorkChatEvents {
  'send-message': Omit<ChatMessageVO, 'id' | 'timestamp' | 'status'>
  'recall-message': string
  'edit-message': { id: string; content: string }
  'reply-message': string
  'message-click': ChatMessageVO
  'message-long-press': ChatMessageVO
}

/**
 * 组件属性定义
 */
export interface SDKWorkChatProps {
  conversation: ConversationVO
  messages: ChatMessageVO[]
  currentUser: UserVO
  showHeader?: boolean
  showInput?: boolean
  maxMessageLength?: number
  placeholder?: string
  [key: string]: any
}