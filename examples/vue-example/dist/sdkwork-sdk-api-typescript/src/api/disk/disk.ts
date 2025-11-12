/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  DiskParam
} from '../../types/files';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  DiskResponse
} from '../../types/files';

import { FilesApi } from './files';
import { MemberApi } from './member';
/**
 * Disk API接口实现
 */
export class DiskApi extends BaseSdkApi {
  files: FilesApi = new FilesApi(this._client);
  member: MemberApi = new MemberApi(this._client);

  /**
   * Create a new file disk
   */
  async create(data: DiskParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<DiskResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/disk`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/disk`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<DiskResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing file disk
   */
  async update(data: DiskParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<DiskResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/disk`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: url,
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送PUT请求
    const response = await this._client.put<ApiResult<DiskResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a file disk by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<DiskResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/disk/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<DiskResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('retrieve 请求失败:', error);
    throw error instanceof Error ? error : new Error('retrieve 请求发生错误');
  }
}

  /**
   * Delete a file disk
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/disk/${id}`;

    // 发送DELETE请求
    const response = await this._client.delete<ApiResult<Boolean>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('delete 请求失败:', error);
    throw error instanceof Error ? error : new Error('delete 请求发生错误');
  }
}

  /**
   * Get all file disks
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<DiskResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/disk/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/disk/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<DiskResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get file disks by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<DiskResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/disk/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/disk/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<DiskResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}
}
