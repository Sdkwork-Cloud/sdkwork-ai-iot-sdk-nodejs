/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  CardParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { CardManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CardVO } from './types';
/**
 * Card API接口实现
 */
export class CardService {
   cardManager: CardManager;
   constructor() {
      this.cardManager = ManagerFactory.create( CardManager );
   }

  /**
   * Create a new membership card
   */
  async create(data: CardParam, options?: SdkRequestOptions): Promise<CardVO> {
    const response = await this.cardManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardVO;
  }


  /**
   * Update an existing membership card
   */
  async update(data: CardParam, options?: SdkRequestOptions): Promise<CardVO> {
    const response = await this.cardManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardVO;
  }


  /**
   * Get a membership card by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<CardVO> {
    const response = await this.cardManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardVO;
  }


  /**
   * Delete a membership card
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.cardManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get membership cards by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<CardVO>> {
    const response = await this.cardManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<CardVO>;
  }


  /**
   * Get all membership cards
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<CardVO[]> {
    const response = await this.cardManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CardVO[];
  }

}
