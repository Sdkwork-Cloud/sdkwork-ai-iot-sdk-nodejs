/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { SdkStream, Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
import type {
  ChatCompletionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChatCompletion,
  ChatCompletionChunk
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * PptTemplateChat API接口实现
 */
export class PptTemplateChatManager extends BaseSdkManager<SdkClient> {

  /**
   * Create a chat completion with PPT template
   */
  async create(data: ChatCompletionParam, queryParams?: { conversationId?: string }, options?: SdkRequestOptions): Promise<ChatCompletion|SdkStream<ChatCompletionChunk>> {
  try {
    options = this._client.buildRequestOptions(options);
    if ( data.stream && options ) {
        options.stream = true;
    }
    const response = await this._client.ppt.template.chat.create(data, queryParams, options);
    if ( data.stream ) {
        return response as SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}
}
