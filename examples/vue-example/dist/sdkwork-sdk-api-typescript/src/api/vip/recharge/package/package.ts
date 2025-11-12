/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  VipRechargePackageParam
} from '../../../../types/vip';

import type {
  QueryListParam,
  QueryParam
} from '../../../../types/common';

import type {
  VipRechargePackageResponse
} from '../../../../types/vip';

/**
 * Package API接口实现
 */
export class PackageApi extends BaseSdkApi {

  /**
   * Create a new VIP recharge package
   */
  async create(data: VipRechargePackageParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<VipRechargePackageResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/vip/recharge/package`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/vip/recharge/package`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<VipRechargePackageResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing VIP recharge package
   */
  async update(data: VipRechargePackageParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<VipRechargePackageResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/vip/recharge/package`;

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
    const response = await this._client.put<ApiResult<VipRechargePackageResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a VIP recharge package by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<VipRechargePackageResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/vip/recharge/package/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<VipRechargePackageResponse>>(
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
   * Delete a VIP recharge package
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/vip/recharge/package/${id}`;

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
   * Get all VIP recharge packages
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<VipRechargePackageResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/vip/recharge/package/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/vip/recharge/package/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<VipRechargePackageResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get VIP recharge packages by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<VipRechargePackageResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/vip/recharge/package/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/vip/recharge/package/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<VipRechargePackageResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}
}
