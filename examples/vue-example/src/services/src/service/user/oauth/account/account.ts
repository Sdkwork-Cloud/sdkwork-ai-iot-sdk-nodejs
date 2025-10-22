/**
 * 自动生成的API接口实现
 * 生成时间: Wed Oct 22 13:06:46 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  UserOAuthAccountParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { UserOauthAccountManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserOAuthAccountVO } from './types';
/**
 * UserOauthAccount API接口实现
 */
export class UserOauthAccountService {
   userOauthAccountManager: UserOauthAccountManager;
   constructor() {
      this.userOauthAccountManager = ManagerFactory.create( UserOauthAccountManager );
   }

  /**
   * Create user OAuth account
   */
  async create(data: UserOAuthAccountParam, options?: SdkRequestOptions): Promise<UserOAuthAccountVO> {
    const response = await this.userOauthAccountManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserOAuthAccountVO;
  }


  /**
   * Update user OAuth account
   */
  async update(data: UserOAuthAccountParam, options?: SdkRequestOptions): Promise<UserOAuthAccountVO> {
    const response = await this.userOauthAccountManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserOAuthAccountVO;
  }


  /**
   * Get user OAuth account by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<UserOAuthAccountVO> {
    const response = await this.userOauthAccountManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserOAuthAccountVO;
  }


  /**
   * Delete user OAuth account
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.userOauthAccountManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get user OAuth accounts by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<UserOAuthAccountVO>> {
    const response = await this.userOauthAccountManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<UserOAuthAccountVO>;
  }


  /**
   * Get all user OAuth accounts
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<UserOAuthAccountVO[]> {
    const response = await this.userOauthAccountManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserOAuthAccountVO[];
  }

}
