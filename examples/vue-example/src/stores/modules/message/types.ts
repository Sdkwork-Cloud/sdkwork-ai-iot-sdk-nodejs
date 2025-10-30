import type { ChatMessageVO } from "@/services";
import type { ChatContext } from "sdkwork-ai-iot-sdk";

/**
 * 消息存储状态定义
 */
export interface MessageStoreState {
  // 基础状态
  loading: boolean;
  error: Error | null;
  initialized: boolean;

  // 消息状态
  /** 当前会话的消息列表 */
  messages: ChatMessageVO[];

  // 分页状态
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;

  // 流式响应状态
  streaming: boolean;
  currentStream: AsyncGenerator<any> | any | null;

  // 工具调用状态
  toolCalls: any[];
  toolResults: any[];
}

/**
 * 消息发送选项
 */
export interface SendMessageOptions {
  conversationId: string;
  userId: string;
  timestamp?: number;
  metadata?: Map<string, any>;
  chatContext?: ChatContext;
}

/**
 * 消息加载选项
 */
export interface LoadMessagesOptions {
  conversationId: string;
  page?: number;
  size?: number;
  /** 基于最后同步消息ID进行查询，用于更好的索引利用 */
  lastSyncMessageId?: string;
}

/**
 * 消息发送状态
 */
export enum MessageSendStatus {
  SENDING = 'sending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered'
}

/**
 * 消息类型
 */
export enum MessageType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  SYSTEM = 'system'
}