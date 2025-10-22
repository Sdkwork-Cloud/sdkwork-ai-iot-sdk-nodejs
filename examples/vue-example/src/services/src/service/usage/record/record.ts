/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  UsageRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { UsageRecordManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UsageRecordVO } from './types';
/**
 * UsageRecord API接口实现
 */
export class UsageRecordService {
   usageRecordManager: UsageRecordManager;
   constructor() {
      this.usageRecordManager = ManagerFactory.create( UsageRecordManager );
   }

  /**
   * Create a new usage record
   */
  async create(data: UsageRecordParam, options?: SdkRequestOptions): Promise<UsageRecordVO> {
    const response = await this.usageRecordManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UsageRecordVO;
  }


  /**
   * Update an existing usage record
   */
  async update(data: UsageRecordParam, options?: SdkRequestOptions): Promise<UsageRecordVO> {
    const response = await this.usageRecordManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UsageRecordVO;
  }


  /**
   * Get a usage record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<UsageRecordVO> {
    const response = await this.usageRecordManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UsageRecordVO;
  }


  /**
   * Delete a usage record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.usageRecordManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get usage records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<UsageRecordVO>> {
    const response = await this.usageRecordManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<UsageRecordVO>;
  }


  /**
   * Get all usage records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<UsageRecordVO[]> {
    const response = await this.usageRecordManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UsageRecordVO[];
  }

}
