/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  FilePartParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { FilePartManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FilePartVO } from './types';
/**
 * FilePart API接口实现
 */
export class FilePartService {
   filePartManager: FilePartManager;
   constructor() {
      this.filePartManager = ManagerFactory.create( FilePartManager );
   }

  /**
   * Create a new file part
   */
  async create(data: FilePartParam, options?: SdkRequestOptions): Promise<FilePartVO> {
    const response = await this.filePartManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FilePartVO;
  }


  /**
   * Update an existing file part
   */
  async update(data: FilePartParam, options?: SdkRequestOptions): Promise<FilePartVO> {
    const response = await this.filePartManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FilePartVO;
  }


  /**
   * Get a file part by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<FilePartVO> {
    const response = await this.filePartManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FilePartVO;
  }


  /**
   * Delete a file part
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.filePartManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get file parts by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<FilePartVO>> {
    const response = await this.filePartManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<FilePartVO>;
  }


  /**
   * Get all file parts
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<FilePartVO[]> {
    const response = await this.filePartManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FilePartVO[];
  }

}
