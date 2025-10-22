/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  UserCouponParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { UserCouponManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserCouponVO } from './types';
/**
 * UserCoupon API接口实现
 */
export class UserCouponService {
   userCouponManager: UserCouponManager;
   constructor() {
      this.userCouponManager = ManagerFactory.create( UserCouponManager );
   }

  /**
   * Create a new user coupon
   */
  async create(data: UserCouponParam, options?: SdkRequestOptions): Promise<UserCouponVO> {
    const response = await this.userCouponManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCouponVO;
  }


  /**
   * Update an existing user coupon
   */
  async update(data: UserCouponParam, options?: SdkRequestOptions): Promise<UserCouponVO> {
    const response = await this.userCouponManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCouponVO;
  }


  /**
   * Get a user coupon by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<UserCouponVO> {
    const response = await this.userCouponManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCouponVO;
  }


  /**
   * Delete a user coupon
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.userCouponManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get user coupons by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<UserCouponVO>> {
    const response = await this.userCouponManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<UserCouponVO>;
  }


  /**
   * Get all user coupons
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<UserCouponVO[]> {
    const response = await this.userCouponManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCouponVO[];
  }

}
