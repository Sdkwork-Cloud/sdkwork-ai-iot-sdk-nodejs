/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipRechargeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipRechargeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipRechargeVO } from './types';
/**
 * VipRecharge API接口实现
 */
export class VipRechargeService {
   vipRechargeManager: VipRechargeManager;
   constructor() {
      this.vipRechargeManager = ManagerFactory.create( VipRechargeManager );
   }

  /**
   * Create a new VIP recharge record
   */
  async create(data: VipRechargeParam, options?: SdkRequestOptions): Promise<VipRechargeVO> {
    const response = await this.vipRechargeManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargeVO;
  }


  /**
   * Update an existing VIP recharge record
   */
  async update(data: VipRechargeParam, options?: SdkRequestOptions): Promise<VipRechargeVO> {
    const response = await this.vipRechargeManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargeVO;
  }


  /**
   * Get a VIP recharge record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipRechargeVO> {
    const response = await this.vipRechargeManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargeVO;
  }


  /**
   * Delete a VIP recharge record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipRechargeManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP recharge records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipRechargeVO>> {
    const response = await this.vipRechargeManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipRechargeVO>;
  }


  /**
   * Get all VIP recharge records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipRechargeVO[]> {
    const response = await this.vipRechargeManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargeVO[];
  }

}
