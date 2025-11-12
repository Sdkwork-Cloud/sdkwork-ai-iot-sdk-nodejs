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
 * AgentChat API接口实现
 */
export class AgentChatManager extends BaseSdkManager<SdkClient> {

  /**
   * Stop a chat completion stream
   */
  async stop(queryParams?: { conversationId: string }, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.agent.chat.stop(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('stop 请求失败:', error);
    throw error instanceof Error ? error : new Error('stop 请求发生错误');
  }
}

  /**
   * Create a chat completion with agent
   */
  async create(data: ChatCompletionParam, queryParams?: { conversationId?: string, id?: string, bizType?: string }, options?: SdkRequestOptions): Promise<ChatCompletion|SdkStream<ChatCompletionChunk>> {
  try {
    options = this._client.buildRequestOptions(options);
    if ( data.stream && options ) {
        options.stream = true;
    }
    const response = await this._client.agent.chat.create(data, queryParams, options);
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

  /**
   * Create a chat completion with agent
   */
  async resumeStream(data: ChatCompletionParam, queryParams?: { conversationId?: string, id?: string, bizType?: string }, options?: SdkRequestOptions): Promise<ChatCompletion|SdkStream<ChatCompletionChunk>> {
  try {
    options = this._client.buildRequestOptions(options);
    if ( data.stream && options ) {
        options.stream = true;
    }
    const response = await this._client.agent.chat.resumeStream(data, queryParams, options);
    if ( data.stream ) {
        return response as SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion;
  } catch (error) {
    // 错误处理
    console.error('resumeStream 请求失败:', error);
    throw error instanceof Error ? error : new Error('resumeStream 请求发生错误');
  }
}

  /**
   * Create a chat completion with agent
   */
  async withContext(data: ChatCompletionParam, queryParams?: { bizType?: string }, options?: SdkRequestOptions): Promise<ChatCompletion|SdkStream<ChatCompletionChunk>> {
  try {
    options = this._client.buildRequestOptions(options);
    if ( data.stream && options ) {
        options.stream = true;
    }
    const response = await this._client.agent.chat.withContext(data, queryParams, options);
    if ( data.stream ) {
        return response as SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion;
  } catch (error) {
    // 错误处理
    console.error('withContext 请求失败:', error);
    throw error instanceof Error ? error : new Error('withContext 请求发生错误');
  }
}
}
