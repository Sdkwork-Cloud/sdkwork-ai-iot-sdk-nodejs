/**
 * 自动生成的API接口实现
 * 生成时间: Wed Oct 15 17:49:07 CST 2025
 */

import type {
  ChatMessageResponse
} from 'sdkwork-sdk-api-typescript'; 
export interface MessageState {
  isThinking: boolean;
  thinkStart: number;
  thinkEnd: number;

}
export interface ChatMessageVO extends ChatMessageResponse {
  uuid: string;
  children: ChatMessageVO[];
  reasoning_content?: string;
  messageState?: MessageState
  actions?: string[];
}
