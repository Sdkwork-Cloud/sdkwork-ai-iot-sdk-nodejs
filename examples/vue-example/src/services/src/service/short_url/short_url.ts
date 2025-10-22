/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ShortUrlParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Short_urlManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShortUrlVO } from './types';
/**
 * Short_url API接口实现
 */
export class Short_urlService {
   short_urlManager: Short_urlManager;
   constructor() {
      this.short_urlManager = ManagerFactory.create( Short_urlManager );
   }

  /**
   * Create short URL
   */
  async create(data: ShortUrlParam, options?: SdkRequestOptions): Promise<ShortUrlVO> {
    const response = await this.short_urlManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShortUrlVO;
  }


  /**
   * Update short URL
   */
  async update(data: ShortUrlParam, options?: SdkRequestOptions): Promise<ShortUrlVO> {
    const response = await this.short_urlManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShortUrlVO;
  }


  /**
   * Get short URL details
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ShortUrlVO> {
    const response = await this.short_urlManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShortUrlVO;
  }


  /**
   * Delete short URL
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.short_urlManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get short URLs by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ShortUrlVO>> {
    const response = await this.short_urlManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ShortUrlVO>;
  }


  /**
   * Get all short URLs
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ShortUrlVO[]> {
    const response = await this.short_urlManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShortUrlVO[];
  }

}
