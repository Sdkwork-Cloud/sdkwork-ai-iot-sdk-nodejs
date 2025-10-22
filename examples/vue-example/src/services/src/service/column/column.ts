/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ColumnParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ColumnManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ColumnVO } from './types';
/**
 * Column API接口实现
 */
export class ColumnService {
   columnManager: ColumnManager;
   constructor() {
      this.columnManager = ManagerFactory.create( ColumnManager );
   }

  /**
   * 创建数据库列
   */
  async create(data: ColumnParam, options?: SdkRequestOptions): Promise<ColumnVO> {
    const response = await this.columnManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ColumnVO;
  }


  /**
   * 更新数据库列
   */
  async update(data: ColumnParam, options?: SdkRequestOptions): Promise<ColumnVO> {
    const response = await this.columnManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ColumnVO;
  }


  /**
   * 获取数据库列详情
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ColumnVO> {
    const response = await this.columnManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ColumnVO;
  }


  /**
   * 删除数据库列
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.columnManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * 分页获取数据库列
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ColumnVO>> {
    const response = await this.columnManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ColumnVO>;
  }


  /**
   * 获取所有数据库列
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ColumnVO[]> {
    const response = await this.columnManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ColumnVO[];
  }

}
