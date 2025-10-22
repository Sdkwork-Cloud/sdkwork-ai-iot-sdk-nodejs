/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  DatasourceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { DatasourceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DatasourceVO } from './types';
/**
 * Datasource API接口实现
 */
export class DatasourceService {
   datasourceManager: DatasourceManager;
   constructor() {
      this.datasourceManager = ManagerFactory.create( DatasourceManager );
   }

  /**
   * Create a new data source
   */
  async create(data: DatasourceParam, options?: SdkRequestOptions): Promise<DatasourceVO> {
    const response = await this.datasourceManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DatasourceVO;
  }


  /**
   * Update an existing data source
   */
  async update(data: DatasourceParam, options?: SdkRequestOptions): Promise<DatasourceVO> {
    const response = await this.datasourceManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DatasourceVO;
  }


  /**
   * Get a data source by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<DatasourceVO> {
    const response = await this.datasourceManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DatasourceVO;
  }


  /**
   * Delete a data source
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.datasourceManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get data sources by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<DatasourceVO>> {
    const response = await this.datasourceManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<DatasourceVO>;
  }


  /**
   * Get all data sources
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<DatasourceVO[]> {
    const response = await this.datasourceManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as DatasourceVO[];
  }

}
