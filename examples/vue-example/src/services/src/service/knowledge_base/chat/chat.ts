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

import { Knowledge_baseChatManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * Knowledge_baseChat API接口实现
 */
export class Knowledge_baseChatService {
   knowledge_baseChatManager: Knowledge_baseChatManager;
   constructor() {
      this.knowledge_baseChatManager = ManagerFactory.create( Knowledge_baseChatManager );
   }

  /**
   * Create a chat completion with Knowledge base
   */
  async create(data: ChatCompletionParam, queryParams?: { id?: number|string, conversationId?: string }, options?: SdkRequestOptions): Promise<ChatCompletion | SdkStream<ChatCompletionChunk>> {
    const response = await this.knowledge_baseChatManager.create(data, queryParams, options);
    if ( data.stream ) {
        return response as ChatCompletion | SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion | SdkStream<ChatCompletionChunk>;
  }

}
