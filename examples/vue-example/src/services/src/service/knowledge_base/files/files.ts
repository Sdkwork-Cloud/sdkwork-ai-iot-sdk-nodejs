/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  MultipartFile
} from 'sdkwork-sdk-api-typescript';

import type {
  Resource
} from 'sdkwork-sdk-api-typescript';

import { Knowledge_baseFilesManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileItemVO, FileListVO } from './types';
/**
 * Knowledge_baseFiles API接口实现
 */
export class Knowledge_baseFilesService {
   knowledge_baseFilesManager: Knowledge_baseFilesManager;
   constructor() {
      this.knowledge_baseFilesManager = ManagerFactory.create( Knowledge_baseFilesManager );
   }

  /**
   * 获取单个文件信息
   */
  async getFile(fileId: string, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.knowledge_baseFilesManager.getFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 删除文件
   */
  async deleteFile(fileId: string, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.knowledge_baseFilesManager.deleteFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 上传文件
   */
  async uploadFile(queryParams?: { file: any, purpose: string }, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.knowledge_baseFilesManager.uploadFile(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 获取文件列表
   */
  async listFiles(queryParams?: { arg1?: string, arg2?: number|string, arg3?: string, arg4?: string }, options?: SdkRequestOptions): Promise<FileListVO> {
    const response = await this.knowledge_baseFilesManager.listFiles(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileListVO;
  }


  /**
   * 获取文件内容
   */
  async getFileContent(fileId: string, options?: SdkRequestOptions): Promise<Resource> {
    const response = await this.knowledge_baseFilesManager.getFileContent(fileId, options);
    return response as Resource;
  }

}
