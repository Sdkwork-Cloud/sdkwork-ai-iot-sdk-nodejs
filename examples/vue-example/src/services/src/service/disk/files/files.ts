/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  MultipartFile
} from 'sdkwork-sdk-api-typescript';

import type {
  FileListResponse,
  FileItemResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  Resource
} from 'sdkwork-sdk-api-typescript';

import { DiskFilesManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileItemVO, FileListVO } from './types';
/**
 * DiskFiles API接口实现
 */
export class DiskFilesService {
   diskFilesManager: DiskFilesManager;
   constructor() {
      this.diskFilesManager = ManagerFactory.create( DiskFilesManager );
   }

  /**
   * 获取单个文件信息
   */
  async getFile(fileId: string, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.diskFilesManager.getFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 删除文件
   */
  async deleteFile(fileId: string, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.diskFilesManager.deleteFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 上传文件
   */
  async uploadFile(queryParams?: { file: any, purpose: string }, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.diskFilesManager.uploadFile(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 获取文件列表
   */
  async listFiles(queryParams?: { arg1?: string, arg2?: number|string, arg3?: string, arg4?: string }, options?: SdkRequestOptions): Promise<FileListVO> {
    const response = await this.diskFilesManager.listFiles(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileListVO;
  }


  /**
   * 获取文件内容
   */
  async getFileContent(fileId: string, options?: SdkRequestOptions): Promise<Resource> {
    const response = await this.diskFilesManager.getFileContent(fileId, options);
    return response as Resource;
  }

}
