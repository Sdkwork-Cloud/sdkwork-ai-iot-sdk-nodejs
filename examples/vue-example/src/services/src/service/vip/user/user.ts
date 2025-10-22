/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  VipUserParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { VipUserManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipUserVO } from './types';
/**
 * VipUser API接口实现
 */
export class VipUserService {
   vipUserManager: VipUserManager;
   constructor() {
      this.vipUserManager = ManagerFactory.create( VipUserManager );
   }

  /**
   * Create a new VIP user
   */
  async create(data: VipUserParam, options?: SdkRequestOptions): Promise<VipUserVO> {
    const response = await this.vipUserManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipUserVO;
  }


  /**
   * Update an existing VIP user
   */
  async update(data: VipUserParam, options?: SdkRequestOptions): Promise<VipUserVO> {
    const response = await this.vipUserManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipUserVO;
  }


  /**
   * Get a VIP user by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<VipUserVO> {
    const response = await this.vipUserManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipUserVO;
  }


  /**
   * Delete a VIP user
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.vipUserManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get VIP users by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<VipUserVO>> {
    const response = await this.vipUserManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<VipUserVO>;
  }


  /**
   * Get all VIP users
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<VipUserVO[]> {
    const response = await this.vipUserManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VipUserVO[];
  }

}
