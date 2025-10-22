/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiGenerationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { GenerationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiGenerationVO } from './types';
/**
 * Generation API接口实现
 */
export class GenerationService {
   generationManager: GenerationManager;
   constructor() {
      this.generationManager = ManagerFactory.create( GenerationManager );
   }

  /**
   * Create a new AI generation record
   */
  async create(data: AiGenerationParam, options?: SdkRequestOptions): Promise<AiGenerationVO> {
    const response = await this.generationManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationVO;
  }


  /**
   * Update an existing AI generation record
   */
  async update(data: AiGenerationParam, options?: SdkRequestOptions): Promise<AiGenerationVO> {
    const response = await this.generationManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationVO;
  }


  /**
   * Get an AI generation record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiGenerationVO> {
    const response = await this.generationManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationVO;
  }


  /**
   * Delete an AI generation record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.generationManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI generation records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiGenerationVO>> {
    const response = await this.generationManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiGenerationVO>;
  }


  /**
   * Get all AI generation records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiGenerationVO[]> {
    const response = await this.generationManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationVO[];
  }

}
