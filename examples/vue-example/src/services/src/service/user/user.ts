/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  UserParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { UserManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserVO } from './types';
/**
 * User API接口实现
 */
export class UserService {
   userManager: UserManager;
   constructor() {
      this.userManager = ManagerFactory.create( UserManager );
   }

  /**
   * Create a new user
   */
  async create(data: UserParam, options?: SdkRequestOptions): Promise<UserVO> {
    const response = await this.userManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserVO;
  }


  /**
   * Update an existing user
   */
  async update(data: UserParam, options?: SdkRequestOptions): Promise<UserVO> {
    const response = await this.userManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserVO;
  }


  /**
   * Get a user by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<UserVO> {
    const response = await this.userManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserVO;
  }


  /**
   * Delete a user
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.userManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get users by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<UserVO>> {
    const response = await this.userManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<UserVO>;
  }


  /**
   * Get all users
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<UserVO[]> {
    const response = await this.userManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserVO[];
  }

}
