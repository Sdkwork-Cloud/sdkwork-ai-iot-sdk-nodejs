import type { ConversationVO,ChatMessageVO } from "@/services"; 
import type { ChatOptions } from "sdkwork-sdk-api-typescript";
import type { MessageHandler } from "@/services/message/types";
import type { MessageHandlerType } from "@/services/message/types";

/**
 * 聊天存储状态定义
 */
export interface ChatStoreState {
  // 基础状态
  loading: boolean;
  error: Error | null;
  initialized: boolean;

  // 会话状态
  /** 所有会话列表，按updatedTime降序排列 */
  conversations: ConversationVO[];
  /** 当前活动会话ID */
  currentConversationId: string | null;
  /** 搜索结果 */
  searchResults: any | null;

  // 消息状态
  /** 当前会话的消息列表 */
  messages: ChatMessageVO[];

  // 流式响应状态
  streaming: boolean;
  currentStream: AsyncGenerator<any> | any | null;

  // 工具调用状态
  toolCalls: any[];
  toolResults: any[];

  // 聊天配置
  options: Partial<ChatOptions>;

  // 消息处理器相关状态
  /** 当前消息处理器类型 */
  currentHandlerType: MessageHandlerType;
  /** 当前消息处理器实例 */
  messageHandler: MessageHandler | null;
  /** 处理器连接状态 */
  handlerConnected: boolean;
}