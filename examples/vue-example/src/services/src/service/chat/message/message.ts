/**
 * 自动生成的API接口实现
 * 生成时间: Fri Oct 24 15:35:10 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ChatMessageParam,
  ChatMessageQueryListParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChatMessageResponse
} from 'sdkwork-sdk-api-typescript';

import { ChatMessageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChatMessageVO } from './types';
/**
 * ChatMessage API接口实现
 */
export class ChatMessageService extends BaseService<ChatMessageManager, ChatMessageParam, ChatMessageVO> {

   constructor() {
      const manager = ManagerFactory.create(ChatMessageManager);
      super(manager);
   }

  /**
   * Get chat messages by page
   */
  async loadMore(data: ChatMessageQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ChatMessageVO>> {
    const response = await this.manager.loadMore(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ChatMessageVO>;
  }

}
