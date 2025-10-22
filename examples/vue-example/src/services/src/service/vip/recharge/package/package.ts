/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipRechargePackageParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipRechargePackageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipRechargePackageVO } from './types';
/**
 * VipRechargePackage API接口实现
 */
export class VipRechargePackageService {
   vipRechargePackageManager: VipRechargePackageManager;
   constructor() {
      this.vipRechargePackageManager = ManagerFactory.create( VipRechargePackageManager );
   }

  /**
   * Create a new VIP recharge package
   */
  async create(data: VipRechargePackageParam, options?: SdkRequestOptions): Promise<VipRechargePackageVO> {
    const response = await this.vipRechargePackageManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargePackageVO;
  }


  /**
   * Update an existing VIP recharge package
   */
  async update(data: VipRechargePackageParam, options?: SdkRequestOptions): Promise<VipRechargePackageVO> {
    const response = await this.vipRechargePackageManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargePackageVO;
  }


  /**
   * Get a VIP recharge package by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipRechargePackageVO> {
    const response = await this.vipRechargePackageManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargePackageVO;
  }


  /**
   * Delete a VIP recharge package
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipRechargePackageManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP recharge packages by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipRechargePackageVO>> {
    const response = await this.vipRechargePackageManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipRechargePackageVO>;
  }


  /**
   * Get all VIP recharge packages
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipRechargePackageVO[]> {
    const response = await this.vipRechargePackageManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipRechargePackageVO[];
  }

}
