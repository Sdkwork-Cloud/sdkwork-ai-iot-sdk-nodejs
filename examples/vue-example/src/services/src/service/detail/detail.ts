/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  DetailParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { DetailManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DetailVO } from './types';
/**
 * Detail API接口实现
 */
export class DetailService {
   detailManager: DetailManager;
   constructor() {
      this.detailManager = ManagerFactory.create( DetailManager );
   }

  /**
   * Create new detail content
   */
  async create(data: DetailParam, options?: SdkRequestOptions): Promise<DetailVO> {
    const response = await this.detailManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DetailVO;
  }


  /**
   * Update existing detail content
   */
  async update(data: DetailParam, options?: SdkRequestOptions): Promise<DetailVO> {
    const response = await this.detailManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DetailVO;
  }


  /**
   * Get detail content by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<DetailVO> {
    const response = await this.detailManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DetailVO;
  }


  /**
   * Delete detail content
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.detailManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get detail contents by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<DetailVO>> {
    const response = await this.detailManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<DetailVO>;
  }


  /**
   * Get all detail contents
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<DetailVO[]> {
    const response = await this.detailManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DetailVO[];
  }

}
