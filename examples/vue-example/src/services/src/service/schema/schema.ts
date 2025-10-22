/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  SchemaParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { SchemaManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { SchemaVO } from './types';
/**
 * Schema API接口实现
 */
export class SchemaService {
   schemaManager: SchemaManager;
   constructor() {
      this.schemaManager = ManagerFactory.create( SchemaManager );
   }

  /**
   * Create a new database schema
   */
  async create(data: SchemaParam, options?: SdkRequestOptions): Promise<SchemaVO> {
    const response = await this.schemaManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SchemaVO;
  }


  /**
   * Update an existing database schema
   */
  async update(data: SchemaParam, options?: SdkRequestOptions): Promise<SchemaVO> {
    const response = await this.schemaManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SchemaVO;
  }


  /**
   * Get a database schema by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SchemaVO> {
    const response = await this.schemaManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SchemaVO;
  }


  /**
   * Delete a database schema
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.schemaManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get database schemas by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<SchemaVO>> {
    const response = await this.schemaManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<SchemaVO>;
  }


  /**
   * Get all database schemas
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SchemaVO[]> {
    const response = await this.schemaManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as SchemaVO[];
  }

}
