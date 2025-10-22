/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ChatMessageContentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { MessageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChatMessageContentVO } from './types';
/**
 * Message API接口实现
 */
export class MessageService {
   messageManager: MessageManager;
   constructor() {
      this.messageManager = ManagerFactory.create( MessageManager );
   }

  /**
   * Create a new chat message
   */
  async create(data: ChatMessageContentParam, options?: SdkRequestOptions): Promise<ChatMessageContentVO> {
    const response = await this.messageManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageContentVO;
  }


  /**
   * Update an existing chat message
   */
  async update(data: ChatMessageContentParam, options?: SdkRequestOptions): Promise<ChatMessageContentVO> {
    const response = await this.messageManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageContentVO;
  }


  /**
   * Get chat message by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ChatMessageContentVO> {
    const response = await this.messageManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageContentVO;
  }


  /**
   * Delete a chat message
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.messageManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get chat messages by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ChatMessageContentVO>> {
    const response = await this.messageManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ChatMessageContentVO>;
  }


  /**
   * Get all chat messages
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ChatMessageContentVO[]> {
    const response = await this.messageManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChatMessageContentVO[];
  }

}
