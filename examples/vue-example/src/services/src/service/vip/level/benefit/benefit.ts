/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipLevelBenefitParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipLevelBenefitManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipLevelBenefitVO } from './types';
/**
 * VipLevelBenefit API接口实现
 */
export class VipLevelBenefitService {
   vipLevelBenefitManager: VipLevelBenefitManager;
   constructor() {
      this.vipLevelBenefitManager = ManagerFactory.create( VipLevelBenefitManager );
   }

  /**
   * Create a new VIP level benefit
   */
  async create(data: VipLevelBenefitParam, options?: SdkRequestOptions): Promise<VipLevelBenefitVO> {
    const response = await this.vipLevelBenefitManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelBenefitVO;
  }


  /**
   * Update an existing VIP level benefit
   */
  async update(data: VipLevelBenefitParam, options?: SdkRequestOptions): Promise<VipLevelBenefitVO> {
    const response = await this.vipLevelBenefitManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelBenefitVO;
  }


  /**
   * Get a VIP level benefit by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipLevelBenefitVO> {
    const response = await this.vipLevelBenefitManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelBenefitVO;
  }


  /**
   * Delete a VIP level benefit
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipLevelBenefitManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP level benefits by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipLevelBenefitVO>> {
    const response = await this.vipLevelBenefitManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipLevelBenefitVO>;
  }


  /**
   * Get all VIP level benefits
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipLevelBenefitVO[]> {
    const response = await this.vipLevelBenefitManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipLevelBenefitVO[];
  }

}
