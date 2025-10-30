/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { SdkStream, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ChatCompletionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChatCompletion,
  ChatCompletionChunk
} from 'sdkwork-sdk-api-typescript';

import { SearchChatManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * SearchChat API接口实现
 */
export class SearchChatService {
   searchChatManager: SearchChatManager;
   constructor() {
      this.searchChatManager = ManagerFactory.create( SearchChatManager );
   }

  /**
   * Create a chat completion with Search
   */
  async create(data: ChatCompletionParam, queryParams?: { id?: string, bizType?: string }, options?: SdkRequestOptions): Promise<ChatCompletion | SdkStream<ChatCompletionChunk>> {
    const response = await this.searchChatManager.create(data, queryParams, options);
    if ( data.stream ) {
        return response as ChatCompletion | SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion | SdkStream<ChatCompletionChunk>;
  }

}
