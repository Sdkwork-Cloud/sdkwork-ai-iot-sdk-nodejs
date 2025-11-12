/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  UserParam
} from '../../types/user';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  UserResponse,
  UserProfileResponse
} from '../../types/user';

import { CardApi } from './card';
import { CouponApi } from './coupon';
import { OauthApi } from './oauth';
/**
 * User API接口实现
 */
export class UserApi extends BaseSdkApi {
  card: CardApi = new CardApi(this._client);
  coupon: CouponApi = new CouponApi(this._client);
  oauth: OauthApi = new OauthApi(this._client);

  /**
   * Create a new user
   */
  async create(data: UserParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<UserResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/user`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/user`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<UserResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing user
   */
  async update(data: UserParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<UserResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/user`;

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
    const response = await this._client.put<ApiResult<UserResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a user by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<UserResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/user/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<UserResponse>>(
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
   * Delete a user
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/user/${id}`;

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
   * Get all users
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<UserResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/user/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/user/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<UserResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get users by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<UserResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/user/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/user/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<UserResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}

  /**
   * Get current user profile
   */
  async getProfile(options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<UserProfileResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/user/profile`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<UserProfileResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getProfile 请求失败:', error);
    throw error instanceof Error ? error : new Error('getProfile 请求发生错误');
  }
}
}
