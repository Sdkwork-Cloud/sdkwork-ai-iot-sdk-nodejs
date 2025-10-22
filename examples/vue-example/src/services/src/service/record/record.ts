/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  InvokeRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { RecordManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { InvokeRecordVO } from './types';
/**
 * Record API接口实现
 */
export class RecordService {
   recordManager: RecordManager;
   constructor() {
      this.recordManager = ManagerFactory.create( RecordManager );
   }

  /**
   * Create a new invocation record
   */
  async create(data: InvokeRecordParam, options?: SdkRequestOptions): Promise<InvokeRecordVO> {
    const response = await this.recordManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvokeRecordVO;
  }


  /**
   * Update an existing invocation record
   */
  async update(data: InvokeRecordParam, options?: SdkRequestOptions): Promise<InvokeRecordVO> {
    const response = await this.recordManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvokeRecordVO;
  }


  /**
   * Get an invocation record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<InvokeRecordVO> {
    const response = await this.recordManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvokeRecordVO;
  }


  /**
   * Delete an invocation record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.recordManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get invocation records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<InvokeRecordVO>> {
    const response = await this.recordManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<InvokeRecordVO>;
  }


  /**
   * Get all invocation records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<InvokeRecordVO[]> {
    const response = await this.recordManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as InvokeRecordVO[];
  }

}
