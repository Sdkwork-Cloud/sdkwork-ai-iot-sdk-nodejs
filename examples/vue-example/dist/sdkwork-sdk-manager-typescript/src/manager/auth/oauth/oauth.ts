/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
import type {
  OAuthCallbackParam,
  OAuthLoginRequestParam
} from 'sdkwork-sdk-api-typescript';

import type {
  TokenDTO,
  OAuthLoginResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * AuthOauth API接口实现
 */
export class AuthOauthManager extends BaseSdkManager<SdkClient> {

  /**
   * 处理OAuth回调
   */
  async handleCallback(data: OAuthCallbackParam, options?: SdkRequestOptions): Promise<TokenDTO> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.oauth.handleCallback(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TokenDTO;
  } catch (error) {
    // 错误处理
    console.error('handleCallback 请求失败:', error);
    throw error instanceof Error ? error : new Error('handleCallback 请求发生错误');
  }
}

  /**
   * 获取OAuth授权URL
   */
  async getAuthUrl(data: OAuthLoginRequestParam, options?: SdkRequestOptions): Promise<OAuthLoginResponse> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.oauth.getAuthUrl(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as OAuthLoginResponse;
  } catch (error) {
    // 错误处理
    console.error('getAuthUrl 请求失败:', error);
    throw error instanceof Error ? error : new Error('getAuthUrl 请求发生错误');
  }
}
}
