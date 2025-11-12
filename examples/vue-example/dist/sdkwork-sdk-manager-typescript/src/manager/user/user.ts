/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  UserParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserResponse,
  UserProfileResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * User API接口实现
 */
export class UserManager extends BaseManager<SdkClient, UserParam, UserResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'user' || '';
      super(client, path);
   }

  /**
   * Get current user profile
   */
  async getProfile(options?: SdkRequestOptions):  Promise<ApiResult<UserProfileResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.user.getProfile(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<UserProfileResponse>;
  } catch (error) {
    // 错误处理
    console.error('getProfile 请求失败:', error);
    throw error instanceof Error ? error : new Error('getProfile 请求发生错误');
  }
}
}
