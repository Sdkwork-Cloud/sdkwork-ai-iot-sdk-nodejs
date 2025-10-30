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

import { AgentChatManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * AgentChat API接口实现
 */
export class AgentChatService {
   agentChatManager: AgentChatManager;
   constructor() {
      this.agentChatManager = ManagerFactory.create( AgentChatManager );
   }

  /**
   * Stop a chat completion stream
   */
  async stop(queryParams?: { conversationId: string }, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.agentChatManager.stop(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Create a chat completion with agent
   */
  async create(data: ChatCompletionParam, queryParams?: { conversationId?: string, id?: string, bizType?: string }, options?: SdkRequestOptions): Promise<ChatCompletion | SdkStream<ChatCompletionChunk>> {
    const response = await this.agentChatManager.create(data, queryParams, options);
    if ( data.stream ) {
        return response as ChatCompletion | SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion | SdkStream<ChatCompletionChunk>;
  }


  /**
   * Create a chat completion with agent
   */
  async resumeStream(data: ChatCompletionParam, queryParams?: { conversationId?: string, id?: string, bizType?: string }, options?: SdkRequestOptions): Promise<ChatCompletion | SdkStream<ChatCompletionChunk>> {
    const response = await this.agentChatManager.resumeStream(data, queryParams, options);
    if ( data.stream ) {
        return response as ChatCompletion | SdkStream<ChatCompletionChunk>;
    }
    const result:any = response;
    return result.data as ChatCompletion | SdkStream<ChatCompletionChunk>;
  }

}
