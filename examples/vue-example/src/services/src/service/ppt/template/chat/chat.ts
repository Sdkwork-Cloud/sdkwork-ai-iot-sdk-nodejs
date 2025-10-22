/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { SdkStream, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ChatCompletionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChatCompletion,
  ChatCompletionChunk
} from 'sdkwork-sdk-api-typescript';

import { PptTemplateChatManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * PptTemplateChat API接口实现
 */
export class PptTemplateChatService {
   pptTemplateChatManager: PptTemplateChatManager;
   constructor() {
      this.pptTemplateChatManager = ManagerFactory.create( PptTemplateChatManager );
   }

  /**
   * Create a chat completion with PPT template
   */
  async create(data: ChatCompletionParam, queryParams?: { conversationId?: string }, options?: SdkRequestOptions): Promise<ChatCompletion | SdkStream<ChatCompletionChunk>> {
    const response = await this.pptTemplateChatManager.create(data, queryParams, options);
    if ( data.stream ) {
        return response as ChatCompletion | SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion | SdkStream<ChatCompletionChunk>;
  }

}
