/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, SdkStream, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  ChatCompletionParam
} from '../../../../types/chat';

import type {
  ChatCompletion,
  ChatCompletionChunk
} from '../../../../types/chat';

/**
 * Chat API接口实现
 */
export class ChatApi extends BaseSdkApi {

  /**
   * Create a chat completion with PPT template
   */
  async create(data: ChatCompletionParam, queryParams?: { conversationId?: string }, options?: SdkRequestOptions): Promise<SdkResponse<ChatCompletion>|SdkStream<ChatCompletionChunk>> {
  try {
    const url = `${this.getBasePath(options)}/ppt/template/chat/completions`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/ppt/template/chat/completions`,
      method: 'POST',
      body: data,
      queryParams: queryParams,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ChatCompletion|ChatCompletionChunk>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}
}
