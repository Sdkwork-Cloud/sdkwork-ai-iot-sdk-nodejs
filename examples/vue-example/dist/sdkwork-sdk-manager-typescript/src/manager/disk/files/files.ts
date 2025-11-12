/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
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

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * DiskFiles API接口实现
 */
export class DiskFilesManager extends BaseSdkManager<SdkClient> {

  /**
   * 获取单个文件信息
   */
  async getFile(fileId: string, options?: SdkRequestOptions):  Promise<ApiResult<FileItemResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.disk.files.getFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<FileItemResponse>;
  } catch (error) {
    // 错误处理
    console.error('getFile 请求失败:', error);
    throw error instanceof Error ? error : new Error('getFile 请求发生错误');
  }
}

  /**
   * 删除文件
   */
  async deleteFile(fileId: string, options?: SdkRequestOptions): Promise<ApiResult<FileItemResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.disk.files.deleteFile(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<FileItemResponse>;
  } catch (error) {
    // 错误处理
    console.error('deleteFile 请求失败:', error);
    throw error instanceof Error ? error : new Error('deleteFile 请求发生错误');
  }
}

  /**
   * 上传文件
   */
  async uploadFile(queryParams?: { file: any, purpose: string }, options?: SdkRequestOptions): Promise<ApiResult<FileItemResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.disk.files.uploadFile(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<FileItemResponse>;
  } catch (error) {
    // 错误处理
    console.error('uploadFile 请求失败:', error);
    throw error instanceof Error ? error : new Error('uploadFile 请求发生错误');
  }
}

  /**
   * 获取文件列表
   */
  async listFiles(queryParams?: { arg1?: string, arg2?: number|string, arg3?: string, arg4?: string }, options?: SdkRequestOptions):  Promise<ApiResult<FileListResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.disk.files.listFiles(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<FileListResponse>;
  } catch (error) {
    // 错误处理
    console.error('listFiles 请求失败:', error);
    throw error instanceof Error ? error : new Error('listFiles 请求发生错误');
  }
}

  /**
   * 获取文件内容
   */
  async getFileContent(fileId: string, options?: SdkRequestOptions):  Promise<Resource> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.disk.files.getFileContent(fileId, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Resource;
  } catch (error) {
    // 错误处理
    console.error('getFileContent 请求失败:', error);
    throw error instanceof Error ? error : new Error('getFileContent 请求发生错误');
  }
}
}
