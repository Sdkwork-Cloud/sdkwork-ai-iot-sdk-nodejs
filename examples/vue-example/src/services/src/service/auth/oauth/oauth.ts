/**
 * 自动生成的API接口实现
 * 生成时间: Wed Oct 22 13:01:34 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  OAuthCallbackParam,
  OAuthLoginRequestParam,
  OAuthLoginResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  TokenDTO
} from 'sdkwork-sdk-api-typescript';

import { AuthOauthManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory"; 
/**
 * AuthOauth API接口实现
 */
export class AuthOauthService {
   authOauthManager: AuthOauthManager;
   constructor() {
      this.authOauthManager = ManagerFactory.create( AuthOauthManager );
   }

  /**
   * 处理OAuth回调
   */
  async handleCallback(data: OAuthCallbackParam, options?: SdkRequestOptions): Promise<TokenDTO> {
    const response = await this.authOauthManager.handleCallback(data, options);
    return response as TokenDTO;
  }


  /**
   * 获取OAuth授权URL
   */
  async getAuthUrl(data: OAuthLoginRequestParam, options?: SdkRequestOptions): Promise<OAuthLoginResponse> {
    const response = await this.authOauthManager.getAuthUrl(data, options);
    return response as OAuthLoginResponse;
  }

}
