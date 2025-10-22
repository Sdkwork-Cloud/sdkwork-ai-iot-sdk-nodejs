/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ChannelAccountParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Channel_accountManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChannelAccountVO } from './types';
/**
 * Channel_account API接口实现
 */
export class Channel_accountService {
   channel_accountManager: Channel_accountManager;
   constructor() {
      this.channel_accountManager = ManagerFactory.create( Channel_accountManager );
   }

  /**
   * Create channel account
   */
  async create(data: ChannelAccountParam, options?: SdkRequestOptions): Promise<ChannelAccountVO> {
    const response = await this.channel_accountManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelAccountVO;
  }


  /**
   * Update channel account
   */
  async update(data: ChannelAccountParam, options?: SdkRequestOptions): Promise<ChannelAccountVO> {
    const response = await this.channel_accountManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelAccountVO;
  }


  /**
   * Get channel account by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ChannelAccountVO> {
    const response = await this.channel_accountManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelAccountVO;
  }


  /**
   * Delete channel account
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.channel_accountManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get channel accounts by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ChannelAccountVO>> {
    const response = await this.channel_accountManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ChannelAccountVO>;
  }


  /**
   * Get all channel accounts
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ChannelAccountVO[]> {
    const response = await this.channel_accountManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelAccountVO[];
  }

}
