/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  ConversationOpenParam,
  ConversationParam,
  ConversationQueryListParam,
  MessageFeedbackParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ConversationResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Conversation API接口实现
 */
export class ConversationManager extends BaseManager<SdkClient, ConversationParam, ConversationResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'conversation' || '';
      super(client, path);
   }

  /**
   * Get all open conversations
   */
  async open(data: ConversationOpenParam, options?: SdkRequestOptions): Promise<ApiResult<ConversationResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.conversation.open(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<ConversationResponse>;
  } catch (error) {
    // 错误处理
    console.error('open 请求失败:', error);
    throw error instanceof Error ? error : new Error('open 请求发生错误');
  }
}

  /**
   * Update an existing conversation
   */
  async messageFeedback(data: MessageFeedbackParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.conversation.messageFeedback(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('messageFeedback 请求失败:', error);
    throw error instanceof Error ? error : new Error('messageFeedback 请求发生错误');
  }
}

  /**
   * Pin/Unpin a conversation
   */
  async pinConversation(id: number|string, queryParams?: { pined: boolean }, options?: SdkRequestOptions): Promise<ApiResult<ConversationResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.conversation.pinConversation(id, queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<ConversationResponse>;
  } catch (error) {
    // 错误处理
    console.error('pinConversation 请求失败:', error);
    throw error instanceof Error ? error : new Error('pinConversation 请求发生错误');
  }
}
}
