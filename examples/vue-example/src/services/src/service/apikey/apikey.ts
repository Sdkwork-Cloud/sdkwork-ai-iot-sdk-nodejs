/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ApiKeyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ApikeyManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ApiKeyVO } from './types';
/**
 * Apikey API接口实现
 */
export class ApikeyService {
   apikeyManager: ApikeyManager;
   constructor() {
      this.apikeyManager = ManagerFactory.create( ApikeyManager );
   }

  /**
   * Create a new API key
   */
  async create(data: ApiKeyParam, options?: SdkRequestOptions): Promise<ApiKeyVO> {
    const response = await this.apikeyManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiKeyVO;
  }


  /**
   * Update an existing API key
   */
  async update(data: ApiKeyParam, options?: SdkRequestOptions): Promise<ApiKeyVO> {
    const response = await this.apikeyManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiKeyVO;
  }


  /**
   * Get an API key by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ApiKeyVO> {
    const response = await this.apikeyManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiKeyVO;
  }


  /**
   * Delete an API key
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.apikeyManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get API keys by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ApiKeyVO>> {
    const response = await this.apikeyManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ApiKeyVO>;
  }


  /**
   * Get all API keys
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ApiKeyVO[]> {
    const response = await this.apikeyManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiKeyVO[];
  }

}
