/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  OssBucketParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { Oss_bucketManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OssBucketVO } from './types';
/**
 * Oss_bucket API接口实现
 */
export class Oss_bucketService {
   oss_bucketManager: Oss_bucketManager;
   constructor() {
      this.oss_bucketManager = ManagerFactory.create( Oss_bucketManager );
   }

  /**
   * Create a new OSS bucket
   */
  async create(data: OssBucketParam, options?: SdkRequestOptions): Promise<OssBucketVO> {
    const response = await this.oss_bucketManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OssBucketVO;
  }


  /**
   * Update an existing OSS bucket
   */
  async update(data: OssBucketParam, options?: SdkRequestOptions): Promise<OssBucketVO> {
    const response = await this.oss_bucketManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OssBucketVO;
  }


  /**
   * Get an OSS bucket by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<OssBucketVO> {
    const response = await this.oss_bucketManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OssBucketVO;
  }


  /**
   * Delete an OSS bucket
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.oss_bucketManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get OSS buckets by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<OssBucketVO>> {
    const response = await this.oss_bucketManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<OssBucketVO>;
  }


  /**
   * Get all OSS buckets
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<OssBucketVO[]> {
    const response = await this.oss_bucketManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OssBucketVO[];
  }

}
