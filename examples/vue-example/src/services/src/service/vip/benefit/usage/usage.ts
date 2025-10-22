/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipBenefitUsageParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipBenefitUsageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipBenefitUsageVO } from './types';
/**
 * VipBenefitUsage API接口实现
 */
export class VipBenefitUsageService {
   vipBenefitUsageManager: VipBenefitUsageManager;
   constructor() {
      this.vipBenefitUsageManager = ManagerFactory.create( VipBenefitUsageManager );
   }

  /**
   * Create a new VIP benefit usage record
   */
  async create(data: VipBenefitUsageParam, options?: SdkRequestOptions): Promise<VipBenefitUsageVO> {
    const response = await this.vipBenefitUsageManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitUsageVO;
  }


  /**
   * Update an existing VIP benefit usage record
   */
  async update(data: VipBenefitUsageParam, options?: SdkRequestOptions): Promise<VipBenefitUsageVO> {
    const response = await this.vipBenefitUsageManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitUsageVO;
  }


  /**
   * Get a VIP benefit usage record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipBenefitUsageVO> {
    const response = await this.vipBenefitUsageManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitUsageVO;
  }


  /**
   * Delete a VIP benefit usage record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipBenefitUsageManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP benefit usage records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipBenefitUsageVO>> {
    const response = await this.vipBenefitUsageManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipBenefitUsageVO>;
  }


  /**
   * Get all VIP benefit usage records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipBenefitUsageVO[]> {
    const response = await this.vipBenefitUsageManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitUsageVO[];
  }

}
