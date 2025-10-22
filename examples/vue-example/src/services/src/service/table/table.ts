/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  TableParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { TableManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { TableVO } from './types';
/**
 * Table API接口实现
 */
export class TableService {
   tableManager: TableManager;
   constructor() {
      this.tableManager = ManagerFactory.create( TableManager );
   }

  /**
   * Create a new database table
   */
  async create(data: TableParam, options?: SdkRequestOptions): Promise<TableVO> {
    const response = await this.tableManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TableVO;
  }


  /**
   * Update an existing database table
   */
  async update(data: TableParam, options?: SdkRequestOptions): Promise<TableVO> {
    const response = await this.tableManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TableVO;
  }


  /**
   * Get a database table by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<TableVO> {
    const response = await this.tableManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TableVO;
  }


  /**
   * Delete a database table
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.tableManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get database tables by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<TableVO>> {
    const response = await this.tableManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<TableVO>;
  }


  /**
   * Get all database tables
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<TableVO[]> {
    const response = await this.tableManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TableVO[];
  }

}
