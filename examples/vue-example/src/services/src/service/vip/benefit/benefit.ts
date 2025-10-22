/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipBenefitParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipBenefitManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipBenefitVO } from './types';
/**
 * VipBenefit API接口实现
 */
export class VipBenefitService {
   vipBenefitManager: VipBenefitManager;
   constructor() {
      this.vipBenefitManager = ManagerFactory.create( VipBenefitManager );
   }

  /**
   * Create a new VIP benefit
   */
  async create(data: VipBenefitParam, options?: SdkRequestOptions): Promise<VipBenefitVO> {
    const response = await this.vipBenefitManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitVO;
  }


  /**
   * Update an existing VIP benefit
   */
  async update(data: VipBenefitParam, options?: SdkRequestOptions): Promise<VipBenefitVO> {
    const response = await this.vipBenefitManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitVO;
  }


  /**
   * Get a VIP benefit by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipBenefitVO> {
    const response = await this.vipBenefitManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitVO;
  }


  /**
   * Delete a VIP benefit
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipBenefitManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP benefits by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipBenefitVO>> {
    const response = await this.vipBenefitManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipBenefitVO>;
  }


  /**
   * Get all VIP benefits
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipBenefitVO[]> {
    const response = await this.vipBenefitManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipBenefitVO[];
  }

}
