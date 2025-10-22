/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiPromptParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { PromptManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiPromptVO } from './types';
/**
 * Prompt API接口实现
 */
export class PromptService {
   promptManager: PromptManager;
   constructor() {
      this.promptManager = ManagerFactory.create( PromptManager );
   }

  /**
   * Create a new AI prompt
   */
  async create(data: AiPromptParam, options?: SdkRequestOptions): Promise<AiPromptVO> {
    const response = await this.promptManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiPromptVO;
  }


  /**
   * Update an existing AI prompt
   */
  async update(data: AiPromptParam, options?: SdkRequestOptions): Promise<AiPromptVO> {
    const response = await this.promptManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiPromptVO;
  }


  /**
   * Get an AI prompt by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiPromptVO> {
    const response = await this.promptManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiPromptVO;
  }


  /**
   * Delete an AI prompt
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.promptManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI prompts by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiPromptVO>> {
    const response = await this.promptManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiPromptVO>;
  }


  /**
   * Get all AI prompts
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiPromptVO[]> {
    const response = await this.promptManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiPromptVO[];
  }

}
