/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  MusicParam
} from '../../types/music';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  MusicResponse
} from '../../types/music';

/**
 * Music API接口实现
 */
export class MusicApi extends BaseSdkApi {

  /**
   * Create new music
   */
  async create(data: MusicParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<MusicResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/music`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/music`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<MusicResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update music
   */
  async update(data: MusicParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<MusicResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/music`;

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
    const response = await this._client.put<ApiResult<MusicResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get music by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<MusicResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/music/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<MusicResponse>>(
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
   * Delete music
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/music/${id}`;

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
   * Get all music records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<MusicResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/music/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/music/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<MusicResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get music records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<MusicResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/music/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/music/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<MusicResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}
}
