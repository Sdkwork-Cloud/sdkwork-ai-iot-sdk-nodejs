/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AccountParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { AccountManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AccountVO } from './types';
/**
 * Account API接口实现
 */
export class AccountService {
   accountManager: AccountManager;
   constructor() {
      this.accountManager = ManagerFactory.create( AccountManager );
   }

  /**
   * Create a new account
   */
  async create(data: AccountParam, options?: SdkRequestOptions): Promise<AccountVO> {
    const response = await this.accountManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountVO;
  }


  /**
   * Update an existing account
   */
  async update(data: AccountParam, options?: SdkRequestOptions): Promise<AccountVO> {
    const response = await this.accountManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountVO;
  }


  /**
   * Get an account by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AccountVO> {
    const response = await this.accountManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountVO;
  }


  /**
   * Delete an account
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.accountManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get accounts by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AccountVO>> {
    const response = await this.accountManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AccountVO>;
  }


  /**
   * Get all accounts
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AccountVO[]> {
    const response = await this.accountManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountVO[];
  }

}
