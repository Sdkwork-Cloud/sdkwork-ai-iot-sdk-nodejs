/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  PptTemplateSlideParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { PptTemplateSlideManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { PptTemplateSlideVO } from './types';
/**
 * PptTemplateSlide API接口实现
 */
export class PptTemplateSlideService {
   pptTemplateSlideManager: PptTemplateSlideManager;
   constructor() {
      this.pptTemplateSlideManager = ManagerFactory.create( PptTemplateSlideManager );
   }

  /**
   * Create a new PPT template slide
   */
  async create(data: PptTemplateSlideParam, options?: SdkRequestOptions): Promise<PptTemplateSlideVO> {
    const response = await this.pptTemplateSlideManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateSlideVO;
  }


  /**
   * Update an existing PPT template slide
   */
  async update(data: PptTemplateSlideParam, options?: SdkRequestOptions): Promise<PptTemplateSlideVO> {
    const response = await this.pptTemplateSlideManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateSlideVO;
  }


  /**
   * Get a PPT template slide by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<PptTemplateSlideVO> {
    const response = await this.pptTemplateSlideManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateSlideVO;
  }


  /**
   * Delete a PPT template slide
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.pptTemplateSlideManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get PPT template slides by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<PptTemplateSlideVO>> {
    const response = await this.pptTemplateSlideManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<PptTemplateSlideVO>;
  }


  /**
   * Get all PPT template slides
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<PptTemplateSlideVO[]> {
    const response = await this.pptTemplateSlideManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptTemplateSlideVO[];
  }

}
