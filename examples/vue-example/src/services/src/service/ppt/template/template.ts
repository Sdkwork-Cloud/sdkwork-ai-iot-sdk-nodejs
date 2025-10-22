/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  PptTemplateParam,
  PptTemplateRenderParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  PptProject
} from 'sdkwork-sdk-api-typescript';

import { PptTemplateManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { PptTemplateVO, PptTemplateSlideVO } from './types';
/**
 * PptTemplate API接口实现
 */
export class PptTemplateService {
   pptTemplateManager: PptTemplateManager;
   constructor() {
      this.pptTemplateManager = ManagerFactory.create( PptTemplateManager );
   }

  /**
   * Create a new PPT template
   */
  async create(data: PptTemplateParam, options?: SdkRequestOptions): Promise<PptTemplateVO> {
    const response = await this.pptTemplateManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateVO;
  }


  /**
   * Update an existing PPT template
   */
  async update(data: PptTemplateParam, options?: SdkRequestOptions): Promise<PptTemplateVO> {
    const response = await this.pptTemplateManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateVO;
  }


  /**
   * Get a PPT template by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<PptTemplateVO> {
    const response = await this.pptTemplateManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateVO;
  }


  /**
   * Delete a PPT template
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.pptTemplateManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get PPT templates by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<PptTemplateVO>> {
    const response = await this.pptTemplateManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<PptTemplateVO>;
  }


  /**
   * Get all PPT templates
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<PptTemplateVO[]> {
    const response = await this.pptTemplateManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateVO[];
  }


  /**
   * Render PPT template
   */
  async render(data: PptTemplateRenderParam, options?: SdkRequestOptions): Promise<PptProject> {
    const response = await this.pptTemplateManager.render(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptProject;
  }

}
