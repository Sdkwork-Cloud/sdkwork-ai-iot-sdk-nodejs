/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  UserCardParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { UserCardManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserCardVO } from './types';
/**
 * UserCard API接口实现
 */
export class UserCardService {
   userCardManager: UserCardManager;
   constructor() {
      this.userCardManager = ManagerFactory.create( UserCardManager );
   }

  /**
   * Create user-card binding
   */
  async create(data: UserCardParam, options?: SdkRequestOptions): Promise<UserCardVO> {
    const response = await this.userCardManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCardVO;
  }


  /**
   * Update user-card binding
   */
  async update(data: UserCardParam, options?: SdkRequestOptions): Promise<UserCardVO> {
    const response = await this.userCardManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCardVO;
  }


  /**
   * Get user-card binding by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<UserCardVO> {
    const response = await this.userCardManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCardVO;
  }


  /**
   * Delete user-card binding
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.userCardManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get user-card bindings by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<UserCardVO>> {
    const response = await this.userCardManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<UserCardVO>;
  }


  /**
   * Get all user-card bindings
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<UserCardVO[]> {
    const response = await this.userCardManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserCardVO[];
  }

}
