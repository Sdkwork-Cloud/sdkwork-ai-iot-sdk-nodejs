/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  OAuthCallbackParam,
  OAuthLoginRequestParam
} from '../../../types/auth';

import type {
  TokenDTO,
  OAuthLoginResponse
} from '../../../types/auth';

/**
 * Oauth API接口实现
 */
export class OauthApi extends BaseSdkApi {

  /**
   * 处理OAuth回调
   */
  async handleCallback(data: OAuthCallbackParam, options?: SdkRequestOptions): Promise<SdkResponse<TokenDTO>> {
  try {
    const url = `${this.getBasePath(options)}/auth/oauth/callback`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/oauth/callback`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<TokenDTO>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('handleCallback 请求失败:', error);
    throw error instanceof Error ? error : new Error('handleCallback 请求发生错误');
  }
}

  /**
   * 获取OAuth授权URL
   */
  async getAuthUrl(data: OAuthLoginRequestParam, options?: SdkRequestOptions): Promise<SdkResponse<OAuthLoginResponse>> {
  try {
    const url = `${this.getBasePath(options)}/auth/oauth/authorize`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/oauth/authorize`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<OAuthLoginResponse>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('getAuthUrl 请求失败:', error);
    throw error instanceof Error ? error : new Error('getAuthUrl 请求发生错误');
  }
}
}
