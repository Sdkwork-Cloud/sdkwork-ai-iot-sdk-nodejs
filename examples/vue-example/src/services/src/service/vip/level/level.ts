/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipLevelParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipLevelManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipLevelVO } from './types';
/**
 * VipLevel API接口实现
 */
export class VipLevelService {
   vipLevelManager: VipLevelManager;
   constructor() {
      this.vipLevelManager = ManagerFactory.create( VipLevelManager );
   }

  /**
   * Create a new VIP level
   */
  async create(data: VipLevelParam, options?: SdkRequestOptions): Promise<VipLevelVO> {
    const response = await this.vipLevelManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelVO;
  }


  /**
   * Update an existing VIP level
   */
  async update(data: VipLevelParam, options?: SdkRequestOptions): Promise<VipLevelVO> {
    const response = await this.vipLevelManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelVO;
  }


  /**
   * Get a VIP level by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipLevelVO> {
    const response = await this.vipLevelManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelVO;
  }


  /**
   * Delete a VIP level
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipLevelManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP levels by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipLevelVO>> {
    const response = await this.vipLevelManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipLevelVO>;
  }


  /**
   * Get all VIP levels
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipLevelVO[]> {
    const response = await this.vipLevelManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelVO[];
  }

}
