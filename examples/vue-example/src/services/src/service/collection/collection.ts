/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  CollectionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { CollectionManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CollectionVO } from './types';
/**
 * Collection API接口实现
 */
export class CollectionService {
   collectionManager: CollectionManager;
   constructor() {
      this.collectionManager = ManagerFactory.create( CollectionManager );
   }

  /**
   * Create a new collection
   */
  async create(data: CollectionParam, options?: SdkRequestOptions): Promise<CollectionVO> {
    const response = await this.collectionManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CollectionVO;
  }


  /**
   * Update an existing collection
   */
  async update(data: CollectionParam, options?: SdkRequestOptions): Promise<CollectionVO> {
    const response = await this.collectionManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CollectionVO;
  }


  /**
   * Get a collection by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<CollectionVO> {
    const response = await this.collectionManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CollectionVO;
  }


  /**
   * Delete a collection
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.collectionManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get collections by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<CollectionVO>> {
    const response = await this.collectionManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<CollectionVO>;
  }


  /**
   * Get all collections
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<CollectionVO[]> {
    const response = await this.collectionManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CollectionVO[];
  }

}
