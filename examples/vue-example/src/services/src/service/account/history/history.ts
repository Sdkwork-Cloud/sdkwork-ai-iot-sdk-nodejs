/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AccountHistoryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { AccountHistoryManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AccountHistoryVO } from './types';
/**
 * AccountHistory API接口实现
 */
export class AccountHistoryService {
   accountHistoryManager: AccountHistoryManager;
   constructor() {
      this.accountHistoryManager = ManagerFactory.create( AccountHistoryManager );
   }

  /**
   * Create a new account history record
   */
  async create(data: AccountHistoryParam, options?: SdkRequestOptions): Promise<AccountHistoryVO> {
    const response = await this.accountHistoryManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountHistoryVO;
  }


  /**
   * Update an existing account history record
   */
  async update(data: AccountHistoryParam, options?: SdkRequestOptions): Promise<AccountHistoryVO> {
    const response = await this.accountHistoryManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountHistoryVO;
  }


  /**
   * Get an account history record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AccountHistoryVO> {
    const response = await this.accountHistoryManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountHistoryVO;
  }


  /**
   * Delete an account history record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.accountHistoryManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get account history records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AccountHistoryVO>> {
    const response = await this.accountHistoryManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AccountHistoryVO>;
  }


  /**
   * Get all account history records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AccountHistoryVO[]> {
    const response = await this.accountHistoryManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AccountHistoryVO[];
  }

}
