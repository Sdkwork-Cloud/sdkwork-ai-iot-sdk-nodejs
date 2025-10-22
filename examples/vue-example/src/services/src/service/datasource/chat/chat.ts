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

import { DatasourceChatManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * DatasourceChat API接口实现
 */
export class DatasourceChatService {
   datasourceChatManager: DatasourceChatManager;
   constructor() {
      this.datasourceChatManager = ManagerFactory.create( DatasourceChatManager );
   }

  /**
   * Create a chat completion with Datasource
   */
  async create(data: ChatCompletionParam, queryParams?: { id?: number|string, conversationId?: string }, options?: SdkRequestOptions): Promise<ChatCompletion | SdkStream<ChatCompletionChunk>> {
    const response = await this.datasourceChatManager.create(data, queryParams, options);
    if ( data.stream ) {
        return response as ChatCompletion | SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion | SdkStream<ChatCompletionChunk>;
  }

}
