/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ShardingKeyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Sharding_keyManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShardingKeyVO } from './types';
/**
 * Sharding_key API接口实现
 */
export class Sharding_keyService {
   sharding_keyManager: Sharding_keyManager;
   constructor() {
      this.sharding_keyManager = ManagerFactory.create( Sharding_keyManager );
   }

  /**
   * Create Sharding Key
   */
  async create(data: ShardingKeyParam, options?: SdkRequestOptions): Promise<ShardingKeyVO> {
    const response = await this.sharding_keyManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShardingKeyVO;
  }


  /**
   * Update Sharding Key
   */
  async update(data: ShardingKeyParam, options?: SdkRequestOptions): Promise<ShardingKeyVO> {
    const response = await this.sharding_keyManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShardingKeyVO;
  }


  /**
   * Get Sharding Key by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ShardingKeyVO> {
    const response = await this.sharding_keyManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShardingKeyVO;
  }


  /**
   * Delete Sharding Key
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.sharding_keyManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * List Sharding Keys by Page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ShardingKeyVO>> {
    const response = await this.sharding_keyManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ShardingKeyVO>;
  }


  /**
   * List All Sharding Keys
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ShardingKeyVO[]> {
    const response = await this.sharding_keyManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ShardingKeyVO[];
  }

}
