/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiGenerationContentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { GenerationContentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiGenerationContentVO } from './types';
/**
 * GenerationContent API接口实现
 */
export class GenerationContentService {
   generationContentManager: GenerationContentManager;
   constructor() {
      this.generationContentManager = ManagerFactory.create( GenerationContentManager );
   }

  /**
   * Create new AI generated content
   */
  async create(data: AiGenerationContentParam, options?: SdkRequestOptions): Promise<AiGenerationContentVO> {
    const response = await this.generationContentManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationContentVO;
  }


  /**
   * Update AI generated content
   */
  async update(data: AiGenerationContentParam, options?: SdkRequestOptions): Promise<AiGenerationContentVO> {
    const response = await this.generationContentManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationContentVO;
  }


  /**
   * Get AI generated content by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiGenerationContentVO> {
    const response = await this.generationContentManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationContentVO;
  }


  /**
   * Delete AI generated content
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.generationContentManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI generated content by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiGenerationContentVO>> {
    const response = await this.generationContentManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiGenerationContentVO>;
  }


  /**
   * Get all AI generated content
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiGenerationContentVO[]> {
    const response = await this.generationContentManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiGenerationContentVO[];
  }

}
