/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  CouponParam
} from '../../types/coupon';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  CouponResponse
} from '../../types/coupon';

import { TemplateApi } from './template';
/**
 * Coupon API接口实现
 */
export class CouponApi extends BaseSdkApi {
  template: TemplateApi = new TemplateApi(this._client);

  /**
   * Create a new coupon template
   */
  async create(data: CouponParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CouponResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/coupon`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/coupon`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<CouponResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing coupon template
   */
  async update(data: CouponParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CouponResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/coupon`;

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
    const response = await this._client.put<ApiResult<CouponResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a coupon template by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CouponResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/coupon/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<CouponResponse>>(
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
   * Delete a coupon template
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/coupon/${id}`;

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
   * Get all coupon templates
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CouponResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/coupon/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/coupon/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<CouponResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get coupon templates by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<CouponResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/coupon/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/coupon/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<CouponResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}
}
