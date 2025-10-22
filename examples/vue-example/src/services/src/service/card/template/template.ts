/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  CardTemplateParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { CardTemplateManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CardTemplateVO } from './types';
/**
 * CardTemplate API接口实现
 */
export class CardTemplateService {
   cardTemplateManager: CardTemplateManager;
   constructor() {
      this.cardTemplateManager = ManagerFactory.create( CardTemplateManager );
   }

  /**
   * Create a new card template
   */
  async create(data: CardTemplateParam, options?: SdkRequestOptions): Promise<CardTemplateVO> {
    const response = await this.cardTemplateManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardTemplateVO;
  }


  /**
   * Update an existing card template
   */
  async update(data: CardTemplateParam, options?: SdkRequestOptions): Promise<CardTemplateVO> {
    const response = await this.cardTemplateManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardTemplateVO;
  }


  /**
   * Get a card template by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<CardTemplateVO> {
    const response = await this.cardTemplateManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardTemplateVO;
  }


  /**
   * Delete a card template
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.cardTemplateManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get card templates by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<CardTemplateVO>> {
    const response = await this.cardTemplateManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<CardTemplateVO>;
  }


  /**
   * Get all card templates
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<CardTemplateVO[]> {
    const response = await this.cardTemplateManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardTemplateVO[];
  }

}
