/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipPointChangeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipPointChangeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipPointChangeVO } from './types';
/**
 * VipPointChange API接口实现
 */
export class VipPointChangeService {
   vipPointChangeManager: VipPointChangeManager;
   constructor() {
      this.vipPointChangeManager = ManagerFactory.create( VipPointChangeManager );
   }

  /**
   * Create a new VIP point change record
   */
  async create(data: VipPointChangeParam, options?: SdkRequestOptions): Promise<VipPointChangeVO> {
    const response = await this.vipPointChangeManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipPointChangeVO;
  }


  /**
   * Update an existing VIP point change record
   */
  async update(data: VipPointChangeParam, options?: SdkRequestOptions): Promise<VipPointChangeVO> {
    const response = await this.vipPointChangeManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipPointChangeVO;
  }


  /**
   * Get a VIP point change record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipPointChangeVO> {
    const response = await this.vipPointChangeManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipPointChangeVO;
  }


  /**
   * Delete a VIP point change record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipPointChangeManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP point change records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipPointChangeVO>> {
    const response = await this.vipPointChangeManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipPointChangeVO>;
  }


  /**
   * Get all VIP point change records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipPointChangeVO[]> {
    const response = await this.vipPointChangeManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipPointChangeVO[];
  }

}
