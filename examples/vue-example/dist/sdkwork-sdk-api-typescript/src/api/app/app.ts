/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  CreateJsapiSignatureParam,
  AppParam
} from '../../types/app';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  AppSdkConfigResponse
} from '../../types/app';

import type {
  AppResponse,
  AppInfoResponse
} from '../../types/app';

/**
 * App API接口实现
 */
export class AppApi extends BaseSdkApi {

  /**
   * 获取应用SDK配置
   */
  async getSdkConfig(data: CreateJsapiSignatureParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AppSdkConfigResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/app/get_sdk_config`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<AppSdkConfigResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getSdkConfig 请求失败:', error);
    throw error instanceof Error ? error : new Error('getSdkConfig 请求发生错误');
  }
}

  /**
   * 获取应用信息
   */
  async getAppInfo(options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AppInfoResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/app/info`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<AppInfoResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getAppInfo 请求失败:', error);
    throw error instanceof Error ? error : new Error('getAppInfo 请求发生错误');
  }
}

  /**
   * Create application
   */
  async create(data: AppParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AppResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/app`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/app`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<AppResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update application
   */
  async update(data: AppParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AppResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/app`;

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
    const response = await this._client.put<ApiResult<AppResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get application by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AppResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/app/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<AppResponse>>(
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
   * Delete application
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/app/${id}`;

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
   * Get all applications
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AppResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/app/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/app/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<AppResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get applications by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<AppResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/app/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/app/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<AppResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}
}
