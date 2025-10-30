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
}
