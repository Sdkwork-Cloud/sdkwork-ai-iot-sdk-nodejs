/**
 * 自动生成的API接口实现
 * 生成时间: Sun Oct 26 11:59:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ConversationOpenParam,
  ConversationParam,
  ConversationQueryListParam,
  MessageFeedbackParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ConversationResponse
} from 'sdkwork-sdk-api-typescript';

import { ConversationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ConversationVO } from './types';
/**
 * Conversation API接口实现
 */
export class ConversationService extends BaseService<ConversationManager, ConversationParam, ConversationVO> {

   constructor() {
      const manager = ManagerFactory.create(ConversationManager);
      super(manager);
   }

  /**
   * Get all open conversations
   */
  async open(data: ConversationOpenParam, options?: SdkRequestOptions): Promise<ConversationVO> {
    const response = await this.manager.open(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ConversationVO;
  }


  /**
   * Pin/Unpin a conversation
   */
  async pinConversation(id: number|string, queryParams?: { pined: boolean }, options?: SdkRequestOptions): Promise<ConversationVO> {
    const response = await this.manager.pinConversation(id, queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ConversationVO;
  }


  /**
   * Update an existing conversation
   */
  async messageFeedback(data: MessageFeedbackParam, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.manager.messageFeedback(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }

}
