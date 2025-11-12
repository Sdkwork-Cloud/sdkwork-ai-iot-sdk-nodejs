/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  MultipartFile
} from '../../../types/org.springframework.web.multipart';

import type {
  FileListResponse,
  FileItemResponse
} from '../../../types/files';

import type {
  Resource
} from '../../../types/org.springframework.core.io';

/**
 * Files API接口实现
 */
export class FilesApi extends BaseSdkApi {

  /**
   * 获取单个文件信息
   */
  async getFile(fileId: string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<FileItemResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/knowledge_base/files/${fileId}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<FileItemResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getFile 请求失败:', error);
    throw error instanceof Error ? error : new Error('getFile 请求发生错误');
  }
}

  /**
   * 删除文件
   */
  async deleteFile(fileId: string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<FileItemResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/knowledge_base/files/${fileId}`;

    // 发送DELETE请求
    const response = await this._client.delete<ApiResult<FileItemResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('deleteFile 请求失败:', error);
    throw error instanceof Error ? error : new Error('deleteFile 请求发生错误');
  }
}

  /**
   * 上传文件
   */
  async uploadFile(queryParams?: { file: any, purpose: string }, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<FileItemResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/knowledge_base/files`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/knowledge_base/files`,
      method: 'POST',
      queryParams: queryParams,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<FileItemResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('uploadFile 请求失败:', error);
    throw error instanceof Error ? error : new Error('uploadFile 请求发生错误');
  }
}

  /**
   * 获取文件列表
   */
  async listFiles(queryParams?: { arg1?: string, arg2?: number|string, arg3?: string, arg4?: string }, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<FileListResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/knowledge_base/files`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<FileListResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('listFiles 请求失败:', error);
    throw error instanceof Error ? error : new Error('listFiles 请求发生错误');
  }
}

  /**
   * 获取文件内容
   */
  async getFileContent(fileId: string, options?: SdkRequestOptions): Promise<SdkResponse<Resource>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/knowledge_base/files/${fileId}/content`;

    // 发送GET请求
    const response = await this._client.get<Resource>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getFileContent 请求失败:', error);
    throw error instanceof Error ? error : new Error('getFileContent 请求发生错误');
  }
}
}
