/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  GetAccessTokenParam,
  TenantParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  TenantResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  TokenResult
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Tenant API接口实现
 */
export class TenantManager extends BaseManager<SdkClient, TenantParam, TenantResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'tenant' || '';
      super(client, path);
   }

  /**
   * Get access tokens
   */
  async getAccessTokens(data: GetAccessTokenParam, options?: SdkRequestOptions): Promise<ApiResult<TokenResult[]>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.tenant.getAccessTokens(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<TokenResult[]>;
  } catch (error) {
    // 错误处理
    console.error('getAccessTokens 请求失败:', error);
    throw error instanceof Error ? error : new Error('getAccessTokens 请求发生错误');
  }
}
}
