/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiModelPriceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ModelPriceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiModelPriceVO } from './types';
/**
 * ModelPrice API接口实现
 */
export class ModelPriceService {
   modelPriceManager: ModelPriceManager;
   constructor() {
      this.modelPriceManager = ManagerFactory.create( ModelPriceManager );
   }

  /**
   * Create a new AI model price
   */
  async create(data: AiModelPriceParam, options?: SdkRequestOptions): Promise<AiModelPriceVO> {
    const response = await this.modelPriceManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelPriceVO;
  }


  /**
   * Update an existing AI model price
   */
  async update(data: AiModelPriceParam, options?: SdkRequestOptions): Promise<AiModelPriceVO> {
    const response = await this.modelPriceManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelPriceVO;
  }


  /**
   * Get an AI model price by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiModelPriceVO> {
    const response = await this.modelPriceManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelPriceVO;
  }


  /**
   * Delete an AI model price
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.modelPriceManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI model prices by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiModelPriceVO>> {
    const response = await this.modelPriceManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiModelPriceVO>;
  }


  /**
   * Get all AI model prices
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiModelPriceVO[]> {
    const response = await this.modelPriceManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiModelPriceVO[];
  }

}
