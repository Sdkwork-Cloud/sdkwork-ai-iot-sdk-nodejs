/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ConversationOpenParam,
  ConversationParam,
  MessageFeedbackParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ConversationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ConversationVO } from './types';
/**
 * Conversation API接口实现
 */
export class ConversationService {
   conversationManager: ConversationManager;
   constructor() {
      this.conversationManager = ManagerFactory.create( ConversationManager );
   }

  /**
   * Create a new conversation
   */
  async create(data: ConversationParam, options?: SdkRequestOptions): Promise<ConversationVO> {
    const response = await this.conversationManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ConversationVO;
  }


  /**
   * Update an existing conversation
   */
  async update(data: ConversationParam, options?: SdkRequestOptions): Promise<ConversationVO> {
    const response = await this.conversationManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ConversationVO;
  }


  /**
   * Get a conversation by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ConversationVO> {
    const response = await this.conversationManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ConversationVO;
  }


  /**
   * Delete a conversation
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.conversationManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get all open conversations
   */
  async open(data: ConversationOpenParam, options?: SdkRequestOptions): Promise<ConversationVO> {
    const response = await this.conversationManager.open(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ConversationVO;
  }


  /**
   * Get conversations by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ConversationVO>> {
    const response = await this.conversationManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ConversationVO>;
  }


  /**
   * Get all conversations
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ConversationVO[]> {
    const response = await this.conversationManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ConversationVO[];
  }


  /**
   * Update an existing conversation
   */
  async messageFeedback(data: MessageFeedbackParam, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.conversationManager.messageFeedback(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }

}
