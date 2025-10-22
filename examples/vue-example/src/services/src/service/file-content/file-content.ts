/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  FileContentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { File_contentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileContentVO } from './types';
/**
 * File_content API接口实现
 */
export class File_contentService {
   file_contentManager: File_contentManager;
   constructor() {
      this.file_contentManager = ManagerFactory.create( File_contentManager );
   }

  /**
   * Create file content
   */
  async create(data: FileContentParam, options?: SdkRequestOptions): Promise<FileContentVO> {
    const response = await this.file_contentManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileContentVO;
  }


  /**
   * Update file content
   */
  async update(data: FileContentParam, options?: SdkRequestOptions): Promise<FileContentVO> {
    const response = await this.file_contentManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileContentVO;
  }


  /**
   * Get file content by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<FileContentVO> {
    const response = await this.file_contentManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileContentVO;
  }


  /**
   * Delete file content
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.file_contentManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get file contents by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<FileContentVO>> {
    const response = await this.file_contentManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<FileContentVO>;
  }


  /**
   * Get all file contents
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<FileContentVO[]> {
    const response = await this.file_contentManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileContentVO[];
  }

}
