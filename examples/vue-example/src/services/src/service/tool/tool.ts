/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiToolParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ToolManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiToolVO } from './types';
/**
 * Tool API接口实现
 */
export class ToolService {
   toolManager: ToolManager;
   constructor() {
      this.toolManager = ManagerFactory.create( ToolManager );
   }

  /**
   * Create a new AI tool
   */
  async create(data: AiToolParam, options?: SdkRequestOptions): Promise<AiToolVO> {
    const response = await this.toolManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiToolVO;
  }


  /**
   * Update an existing AI tool
   */
  async update(data: AiToolParam, options?: SdkRequestOptions): Promise<AiToolVO> {
    const response = await this.toolManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiToolVO;
  }


  /**
   * Get an AI tool by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiToolVO> {
    const response = await this.toolManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiToolVO;
  }


  /**
   * Delete an AI tool
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.toolManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI tools by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiToolVO>> {
    const response = await this.toolManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiToolVO>;
  }


  /**
   * Get all AI tools
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiToolVO[]> {
    const response = await this.toolManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiToolVO[];
  }

}
