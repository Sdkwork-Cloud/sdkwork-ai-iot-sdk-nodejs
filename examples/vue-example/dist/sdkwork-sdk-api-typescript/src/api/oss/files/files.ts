/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  UploadParam,
  GetPresignedUrlParam,
  GetTempSessionParam
} from '../../../types/files';

import type {
  MultipartFile
} from '../../../types/org.springframework.web.multipart';

import type {
  FileResponse,
  TempSessionResponse
} from '../../../types/files';

import type {
  GetUrlResult
} from '../../../types/files.result';

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
   * Upload file
   */
  async create(data: UploadParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<FileResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/oss/files/create`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/oss/files/create`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<FileResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Generate presigned URL
   */
  async getPresignedUrl(data: GetPresignedUrlParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<GetUrlResult>>> {
  try {
    const url = `${this.getBasePath(options)}/oss/files/get_presigned_url`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/oss/files/get_presigned_url`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<GetUrlResult>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('getPresignedUrl 请求失败:', error);
    throw error instanceof Error ? error : new Error('getPresignedUrl 请求发生错误');
  }
}

  /**
   * Get upload temporary session
   */
  async getTempSession(data: GetTempSessionParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<TempSessionResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/oss/files/temp_session`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/oss/files/temp_session`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<TempSessionResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('getTempSession 请求失败:', error);
    throw error instanceof Error ? error : new Error('getTempSession 请求发生错误');
  }
}

  /**
   * 获取单个文件信息
   */
  async getFile(fileId: string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<FileItemResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/oss/files/${fileId}`;

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
    const url = `${this.getBasePath(options)}/oss/files/${fileId}`;

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
    const url = `${this.getBasePath(options)}/oss/files`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/oss/files`,
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
    const url = `${this.getBasePath(options)}/oss/files`;

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
    const url = `${this.getBasePath(options)}/oss/files/${fileId}/content`;

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
