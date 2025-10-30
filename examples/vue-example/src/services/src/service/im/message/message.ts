/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  QueryListParam
} from 'sdkwork-sdk-api-typescript';

import type {
  Message
} from 'sdkwork-sdk-api-typescript';

import { ImMessageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * ImMessage API接口实现
 */
export class ImMessageService {
   imMessageManager: ImMessageManager;
   constructor() {
      this.imMessageManager = ManagerFactory.create( ImMessageManager );
   }

  /**
   * Get messages by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<Message>> {
    const response = await this.imMessageManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<Message>;
  }

}
