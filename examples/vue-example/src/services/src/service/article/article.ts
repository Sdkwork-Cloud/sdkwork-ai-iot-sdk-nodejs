/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ArticleParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ArticleManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ArticleVO } from './types';
/**
 * Article API接口实现
 */
export class ArticleService {
   articleManager: ArticleManager;
   constructor() {
      this.articleManager = ManagerFactory.create( ArticleManager );
   }

  /**
   * Create a new AI article
   */
  async create(data: ArticleParam, options?: SdkRequestOptions): Promise<ArticleVO> {
    const response = await this.articleManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ArticleVO;
  }


  /**
   * Update an existing AI article
   */
  async update(data: ArticleParam, options?: SdkRequestOptions): Promise<ArticleVO> {
    const response = await this.articleManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ArticleVO;
  }


  /**
   * Get an AI article by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ArticleVO> {
    const response = await this.articleManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ArticleVO;
  }


  /**
   * Delete an AI article
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.articleManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI articles by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ArticleVO>> {
    const response = await this.articleManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ArticleVO>;
  }


  /**
   * Get all AI articles
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ArticleVO[]> {
    const response = await this.articleManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ArticleVO[];
  }

}
