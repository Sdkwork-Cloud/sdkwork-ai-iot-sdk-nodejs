/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiModelInfoParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ModelManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiModelInfoVO } from './types';
/**
 * Model API接口实现
 */
export class ModelService {
   modelManager: ModelManager;
   constructor() {
      this.modelManager = ManagerFactory.create( ModelManager );
   }

  /**
   * Create a new AI model information
   */
  async create(data: AiModelInfoParam, options?: SdkRequestOptions): Promise<AiModelInfoVO> {
    const response = await this.modelManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelInfoVO;
  }


  /**
   * Update existing AI model information
   */
  async update(data: AiModelInfoParam, options?: SdkRequestOptions): Promise<AiModelInfoVO> {
    const response = await this.modelManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelInfoVO;
  }


  /**
   * Get AI model information by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiModelInfoVO> {
    const response = await this.modelManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelInfoVO;
  }


  /**
   * Delete AI model information
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.modelManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI model information by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiModelInfoVO>> {
    const response = await this.modelManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiModelInfoVO>;
  }


  /**
   * Get all AI model information
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiModelInfoVO[]> {
    const response = await this.modelManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelInfoVO[];
  }

}
