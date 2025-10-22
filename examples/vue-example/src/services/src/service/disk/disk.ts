/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  DiskParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { DiskManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DiskVO } from './types';
/**
 * Disk API接口实现
 */
export class DiskService {
   diskManager: DiskManager;
   constructor() {
      this.diskManager = ManagerFactory.create( DiskManager );
   }

  /**
   * Create a new file disk
   */
  async create(data: DiskParam, options?: SdkRequestOptions): Promise<DiskVO> {
    const response = await this.diskManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskVO;
  }


  /**
   * Update an existing file disk
   */
  async update(data: DiskParam, options?: SdkRequestOptions): Promise<DiskVO> {
    const response = await this.diskManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskVO;
  }


  /**
   * Get a file disk by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<DiskVO> {
    const response = await this.diskManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskVO;
  }


  /**
   * Delete a file disk
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.diskManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get file disks by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<DiskVO>> {
    const response = await this.diskManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<DiskVO>;
  }


  /**
   * Get all file disks
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<DiskVO[]> {
    const response = await this.diskManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DiskVO[];
  }

}
