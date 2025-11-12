/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:06:01 CST 2025
 */

import type {
  ChatMessageResponse
} from 'sdkwork-sdk-api-typescript';

export interface MessageState {
  isThinking: boolean;
  thinkStart: number;
  thinkEnd?: number;
}

export interface ChatMessageVO extends ChatMessageResponse {
  uuid: string;
  children: ChatMessageVO[];
  reasoning_content?: string;
  messageState?: MessageState
  actions?: string[];
  isOwn?: boolean;
  // 为了向后兼容，添加content属性，从body.payload.content获取
  content?: string;
  // 为了向后兼容，添加senderId属性
  senderId?: string;
  // 为了向后兼容，添加createdAt属性（从updatedAt获取）
  createdAt?: string;
}

// 消息发送者信息
export interface MessageSenderInfo {
  id: string;
  name: string;
  avatar?: string;
}
