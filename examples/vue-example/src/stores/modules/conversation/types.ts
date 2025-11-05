import type { ConversationVO } from "@/services"; 
import { ChatContext } from "sdkwork-sdk-api-typescript";

/**
 * 会话存储状态定义
 */
export interface ConversationStoreState {
  // 基础状态
  loading: boolean;
  error: Error | null;
  initialized: boolean;

  // 会话状态
  /** 所有会话列表，按updatedTime降序排列 */
  conversations: ConversationVO[];
  /** 当前活动会话ID */
  currentConversationId: string | null;
  /** 当前活动会话对象 */
  _currentConversation: ConversationVO | null;
  /** 搜索结果 */
  searchResults: any | null;

  // 聊天上下文状态
  /** 当前聊天上下文 */
  chatContext: ChatContext | null;
}

/**
 * 会话创建选项
 */
export interface CreateConversationOptions {
  title?: string;
  metadata?: Record<string, any>;
  context?: Partial<ChatContext>;
}

/**
 * 会话更新选项
 */
export interface UpdateConversationOptions {
  title?: string;
  metadata?: Record<string, any>;
  updatedAt?: string;
}