/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  CouponParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { CouponManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CouponVO } from './types';
/**
 * Coupon API接口实现
 */
export class CouponService {
   couponManager: CouponManager;
   constructor() {
      this.couponManager = ManagerFactory.create( CouponManager );
   }

  /**
   * Create a new coupon template
   */
  async create(data: CouponParam, options?: SdkRequestOptions): Promise<CouponVO> {
    const response = await this.couponManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponVO;
  }


  /**
   * Update an existing coupon template
   */
  async update(data: CouponParam, options?: SdkRequestOptions): Promise<CouponVO> {
    const response = await this.couponManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponVO;
  }


  /**
   * Get a coupon template by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<CouponVO> {
    const response = await this.couponManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponVO;
  }


  /**
   * Delete a coupon template
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.couponManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get coupon templates by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<CouponVO>> {
    const response = await this.couponManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<CouponVO>;
  }


  /**
   * Get all coupon templates
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<CouponVO[]> {
    const response = await this.couponManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponVO[];
  }

}
