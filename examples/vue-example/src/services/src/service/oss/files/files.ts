/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  UploadParam,
  GetPresignedUrlParam,
  GetTempSessionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  MultipartFile
} from 'sdkwork-sdk-api-typescript';

import type {
  FileResponse,
  TempSessionResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  GetUrlResult
} from 'sdkwork-sdk-api-typescript';

import type {
  FileListResponse,
  FileItemResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  Resource
} from 'sdkwork-sdk-api-typescript';

import { OssFilesManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FileItemVO, TempSessionVO, FileListVO } from './types';
import { FileVO } from '../../file';
/**
 * OssFiles API接口实现
 */
export class OssFilesService {
   ossFilesManager: OssFilesManager;
   constructor() {
      this.ossFilesManager = ManagerFactory.create( OssFilesManager );
   }

  /**
   * Upload file
   */
  async create(data: UploadParam, options?: SdkRequestOptions): Promise<FileVO> {
    const response = await this.ossFilesManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileVO;
  }


  /**
   * Get upload temporary session
   */
  async getTempSession(data: GetTempSessionParam, options?: SdkRequestOptions): Promise<TempSessionVO> {
    const response = await this.ossFilesManager.getTempSession(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TempSessionVO;
  }


  /**
   * Generate presigned URL
   */
  async getPresignedUrl(data: GetPresignedUrlParam, options?: SdkRequestOptions): Promise<GetUrlResult> {
    const response = await this.ossFilesManager.getPresignedUrl(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as GetUrlResult;
  }


  /**
   * 获取单个文件信息
   */
  async getFile(fileId: string, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.ossFilesManager.getFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 删除文件
   */
  async deleteFile(fileId: string, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.ossFilesManager.deleteFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 上传文件
   */
  async uploadFile(queryParams?: { file: any, purpose: string }, options?: SdkRequestOptions): Promise<FileItemVO> {
    const response = await this.ossFilesManager.uploadFile(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileItemVO;
  }


  /**
   * 获取文件列表
   */
  async listFiles(queryParams?: { arg1?: string, arg2?: number|string, arg3?: string, arg4?: string }, options?: SdkRequestOptions): Promise<FileListVO> {
    const response = await this.ossFilesManager.listFiles(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as FileListVO;
  }


  /**
   * 获取文件内容
   */
  async getFileContent(fileId: string, options?: SdkRequestOptions): Promise<Resource> {
    const response = await this.ossFilesManager.getFileContent(fileId, options);
    return response as Resource;
  }

}
