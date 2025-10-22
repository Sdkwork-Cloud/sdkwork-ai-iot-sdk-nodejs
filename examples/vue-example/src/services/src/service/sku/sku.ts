/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  SkuParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { SkuManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { SkuVO } from './types';
/**
 * Sku API接口实现
 */
export class SkuService {
   skuManager: SkuManager;
   constructor() {
      this.skuManager = ManagerFactory.create( SkuManager );
   }

  /**
   * Create a new SKU
   */
  async create(data: SkuParam, options?: SdkRequestOptions): Promise<SkuVO> {
    const response = await this.skuManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SkuVO;
  }


  /**
   * Update an existing SKU
   */
  async update(data: SkuParam, options?: SdkRequestOptions): Promise<SkuVO> {
    const response = await this.skuManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SkuVO;
  }


  /**
   * Get an SKU by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SkuVO> {
    const response = await this.skuManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SkuVO;
  }


  /**
   * Delete an SKU
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.skuManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get SKUs by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<SkuVO>> {
    const response = await this.skuManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<SkuVO>;
  }


  /**
   * Get all SKUs
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SkuVO[]> {
    const response = await this.skuManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SkuVO[];
  }

}
