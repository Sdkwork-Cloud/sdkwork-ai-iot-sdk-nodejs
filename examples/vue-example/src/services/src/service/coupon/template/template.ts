/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  CouponTemplateParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { CouponTemplateManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CouponTemplateVO } from './types';
/**
 * CouponTemplate API接口实现
 */
export class CouponTemplateService {
   couponTemplateManager: CouponTemplateManager;
   constructor() {
      this.couponTemplateManager = ManagerFactory.create( CouponTemplateManager );
   }

  /**
   * Create a new coupon template
   */
  async create(data: CouponTemplateParam, options?: SdkRequestOptions): Promise<CouponTemplateVO> {
    const response = await this.couponTemplateManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponTemplateVO;
  }


  /**
   * Update an existing coupon template
   */
  async update(data: CouponTemplateParam, options?: SdkRequestOptions): Promise<CouponTemplateVO> {
    const response = await this.couponTemplateManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponTemplateVO;
  }


  /**
   * Get a coupon template by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<CouponTemplateVO> {
    const response = await this.couponTemplateManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponTemplateVO;
  }


  /**
   * Delete a coupon template
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.couponTemplateManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get coupon templates by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<CouponTemplateVO>> {
    const response = await this.couponTemplateManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<CouponTemplateVO>;
  }


  /**
   * Get all coupon templates
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<CouponTemplateVO[]> {
    const response = await this.couponTemplateManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CouponTemplateVO[];
  }

}
