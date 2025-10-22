/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ChannelResourceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Channel_resourceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChannelResourceVO } from './types';
/**
 * Channel_resource API接口实现
 */
export class Channel_resourceService {
   channel_resourceManager: Channel_resourceManager;
   constructor() {
      this.channel_resourceManager = ManagerFactory.create( Channel_resourceManager );
   }

  /**
   * Create a new channel resource
   */
  async create(data: ChannelResourceParam, options?: SdkRequestOptions): Promise<ChannelResourceVO> {
    const response = await this.channel_resourceManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelResourceVO;
  }


  /**
   * Update an existing channel resource
   */
  async update(data: ChannelResourceParam, options?: SdkRequestOptions): Promise<ChannelResourceVO> {
    const response = await this.channel_resourceManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelResourceVO;
  }


  /**
   * Get a channel resource by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ChannelResourceVO> {
    const response = await this.channel_resourceManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelResourceVO;
  }


  /**
   * Delete a channel resource
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.channel_resourceManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get channel resources by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ChannelResourceVO>> {
    const response = await this.channel_resourceManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ChannelResourceVO>;
  }


  /**
   * Get all channel resources
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ChannelResourceVO[]> {
    const response = await this.channel_resourceManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ChannelResourceVO[];
  }

}
