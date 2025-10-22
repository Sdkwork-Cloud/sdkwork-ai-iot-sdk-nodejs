/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  FeedsParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { FeedsManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FeedsVO } from './types';
/**
 * Feeds API接口实现
 */
export class FeedsService {
   feedsManager: FeedsManager;
   constructor() {
      this.feedsManager = ManagerFactory.create( FeedsManager );
   }

  /**
   * Create a new feeds entry
   */
  async create(data: FeedsParam, options?: SdkRequestOptions): Promise<FeedsVO> {
    const response = await this.feedsManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedsVO;
  }


  /**
   * Update an existing feeds entry
   */
  async update(data: FeedsParam, options?: SdkRequestOptions): Promise<FeedsVO> {
    const response = await this.feedsManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedsVO;
  }


  /**
   * Get a feeds entry by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<FeedsVO> {
    const response = await this.feedsManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedsVO;
  }


  /**
   * Delete a feeds entry
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.feedsManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get feeds entries by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<FeedsVO>> {
    const response = await this.feedsManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<FeedsVO>;
  }


  /**
   * Get all feeds entries
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<FeedsVO[]> {
    const response = await this.feedsManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FeedsVO[];
  }

}
