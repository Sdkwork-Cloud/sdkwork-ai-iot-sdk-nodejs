/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  NewsParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { NewsManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { NewsVO } from './types';
/**
 * News API接口实现
 */
export class NewsService {
   newsManager: NewsManager;
   constructor() {
      this.newsManager = ManagerFactory.create( NewsManager );
   }

  /**
   * Create a new news
   */
  async create(data: NewsParam, options?: SdkRequestOptions): Promise<NewsVO> {
    const response = await this.newsManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as NewsVO;
  }


  /**
   * Update an existing news
   */
  async update(data: NewsParam, options?: SdkRequestOptions): Promise<NewsVO> {
    const response = await this.newsManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as NewsVO;
  }


  /**
   * Get a news by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<NewsVO> {
    const response = await this.newsManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as NewsVO;
  }


  /**
   * Delete a news
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.newsManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get news by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<NewsVO>> {
    const response = await this.newsManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<NewsVO>;
  }


  /**
   * Get all news
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<NewsVO[]> {
    const response = await this.newsManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as NewsVO[];
  }

}
