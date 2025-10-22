/**
 * 自动生成的API接口实现
 * 生成时间: Wed Oct 15 17:59:53 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ChatMessageParam,
  ChatMessageQueryListParam
} from 'sdkwork-sdk-api-typescript';

import { ChatMessageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChatMessageVO } from './types';
/**
 * ChatMessage API接口实现
 */
export class ChatMessageService {
   chatMessageManager: ChatMessageManager;
   constructor() {
      this.chatMessageManager = ManagerFactory.create( ChatMessageManager );
   }

  /**
   * Create a new chat message
   */
  async create(data: ChatMessageParam, options?: SdkRequestOptions): Promise<ChatMessageVO> {
    const response = await this.chatMessageManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageVO;
  }


  /**
   * Update an existing chat message
   */
  async update(data: ChatMessageParam, options?: SdkRequestOptions): Promise<ChatMessageVO> {
    const response = await this.chatMessageManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageVO;
  }


  /**
   * Get a chat message by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ChatMessageVO> {
    const response = await this.chatMessageManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageVO;
  }


  /**
   * Delete a chat message
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.chatMessageManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get chat messages by page
   */
  async listByPage(data: ChatMessageQueryListParam, queryParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ChatMessageVO>> {
    const response = await this.chatMessageManager.listByPage(data, queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ChatMessageVO>;
  }


  /**
   * Get all chat messages
   */
  async listAllEntities(data: ChatMessageQueryListParam, options?: SdkRequestOptions): Promise<ChatMessageVO[]> {
    const response = await this.chatMessageManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageVO[];
  }

}
