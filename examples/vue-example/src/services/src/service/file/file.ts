/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  FileParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  TreeNode
} from 'sdkwork-sdk-api-typescript';

import { FileManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileVO } from './types';
/**
 * File API接口实现
 */
export class FileService {
   fileManager: FileManager;
   constructor() {
      this.fileManager = ManagerFactory.create( FileManager );
   }

  /**
   * Create a new file metadata
   */
  async create(data: FileParam, options?: SdkRequestOptions): Promise<FileVO> {
    const response = await this.fileManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileVO;
  }


  /**
   * Update existing file metadata
   */
  async update(data: FileParam, options?: SdkRequestOptions): Promise<FileVO> {
    const response = await this.fileManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileVO;
  }


  /**
   * Get file metadata by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<FileVO> {
    const response = await this.fileManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileVO;
  }


  /**
   * Delete file metadata
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.fileManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get Tree
   */
  async getTree(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<TreeNode<FileVO>[]> {
    const response = await this.fileManager.getTree(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TreeNode<FileVO>[];
  }


  /**
   * Get file metadata by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<FileVO>> {
    const response = await this.fileManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<FileVO>;
  }


  /**
   * Get all file metadata
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<FileVO[]> {
    const response = await this.fileManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileVO[];
  }

}
