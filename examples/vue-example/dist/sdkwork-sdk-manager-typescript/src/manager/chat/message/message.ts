/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  ChatMessageParam,
  ChatMessageQueryListParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChatMessageResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * ChatMessage API接口实现
 */
export class ChatMessageManager extends BaseManager<SdkClient, ChatMessageParam, ChatMessageResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'chat.message' || '';
      super(client, path);
   }

  /**
   * Get chat messages by page
   */
  async loadMore(data: ChatMessageQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<ApiResult<Page<ChatMessageResponse>>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.chat.message.loadMore(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Page<ChatMessageResponse>>;
  } catch (error) {
    // 错误处理
    console.error('loadMore 请求失败:', error);
    throw error instanceof Error ? error : new Error('loadMore 请求发生错误');
  }
}
}
