/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  KnowledgeBaseParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Knowledge_baseManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { KnowledgeBaseVO } from './types';
/**
 * Knowledge_base API接口实现
 */
export class Knowledge_baseService {
   knowledge_baseManager: Knowledge_baseManager;
   constructor() {
      this.knowledge_baseManager = ManagerFactory.create( Knowledge_baseManager );
   }

  /**
   * Create a new knowledge base
   */
  async create(data: KnowledgeBaseParam, options?: SdkRequestOptions): Promise<KnowledgeBaseVO> {
    const response = await this.knowledge_baseManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as KnowledgeBaseVO;
  }


  /**
   * Update an existing knowledge base
   */
  async update(data: KnowledgeBaseParam, options?: SdkRequestOptions): Promise<KnowledgeBaseVO> {
    const response = await this.knowledge_baseManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as KnowledgeBaseVO;
  }


  /**
   * Get a knowledge base by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<KnowledgeBaseVO> {
    const response = await this.knowledge_baseManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as KnowledgeBaseVO;
  }


  /**
   * Delete a knowledge base
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.knowledge_baseManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get knowledge bases by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<KnowledgeBaseVO>> {
    const response = await this.knowledge_baseManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<KnowledgeBaseVO>;
  }


  /**
   * Get a knowledge base detail by ID
   */
  async getDetail(queryParams?: { id: number|string }, options?: SdkRequestOptions): Promise<KnowledgeBaseVO> {
    const response = await this.knowledge_baseManager.getDetail(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as KnowledgeBaseVO;
  }


  /**
   * Get all knowledge bases
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<KnowledgeBaseVO[]> {
    const response = await this.knowledge_baseManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as KnowledgeBaseVO[];
  }

}
