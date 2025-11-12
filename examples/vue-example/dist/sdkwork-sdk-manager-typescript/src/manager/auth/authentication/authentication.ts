/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
import type {
  RegisterParam,
  RefreshTokenParam,
  PasswordResetParam,
  PasswordResetRequestParam,
  ChangePasswordParam,
  LoginParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AuthUserResponse,
  PasswordResetResultResponse,
  RegisterResultResponse,
  LoginResultResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * AuthAuthentication API接口实现
 */
export class AuthAuthenticationManager extends BaseSdkManager<SdkClient> {

  /**
   * 用户注册
   */
  async register(data: RegisterParam, options?: SdkRequestOptions): Promise<ApiResult<RegisterResultResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.register(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<RegisterResultResponse>;
  } catch (error) {
    // 错误处理
    console.error('register 请求失败:', error);
    throw error instanceof Error ? error : new Error('register 请求发生错误');
  }
}

  /**
   * 重置密码
   */
  async resetPassword(data: PasswordResetParam, options?: SdkRequestOptions): Promise<ApiResult<PasswordResetResultResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.resetPassword(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<PasswordResetResultResponse>;
  } catch (error) {
    // 错误处理
    console.error('resetPassword 请求失败:', error);
    throw error instanceof Error ? error : new Error('resetPassword 请求发生错误');
  }
}

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(options?: SdkRequestOptions):  Promise<ApiResult<AuthUserResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.getCurrentUser(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<AuthUserResponse>;
  } catch (error) {
    // 错误处理
    console.error('getCurrentUser 请求失败:', error);
    throw error instanceof Error ? error : new Error('getCurrentUser 请求发生错误');
  }
}

  /**
   * 刷新访问令牌
   */
  async refreshToken(data: RefreshTokenParam, options?: SdkRequestOptions): Promise<ApiResult<LoginResultResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.refreshToken(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<LoginResultResponse>;
  } catch (error) {
    // 错误处理
    console.error('refreshToken 请求失败:', error);
    throw error instanceof Error ? error : new Error('refreshToken 请求发生错误');
  }
}

  /**
   * 修改密码
   */
  async changePassword(data: ChangePasswordParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.changePassword(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('changePassword 请求失败:', error);
    throw error instanceof Error ? error : new Error('changePassword 请求发生错误');
  }
}

  /**
   * 请求密码重置
   */
  async requestPasswordReset(data: PasswordResetRequestParam, options?: SdkRequestOptions): Promise<ApiResult<PasswordResetResultResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.requestPasswordReset(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<PasswordResetResultResponse>;
  } catch (error) {
    // 错误处理
    console.error('requestPasswordReset 请求失败:', error);
    throw error instanceof Error ? error : new Error('requestPasswordReset 请求发生错误');
  }
}

  /**
   * 用户登录
   */
  async login(data: LoginParam, options?: SdkRequestOptions): Promise<ApiResult<LoginResultResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.login(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<LoginResultResponse>;
  } catch (error) {
    // 错误处理
    console.error('login 请求失败:', error);
    throw error instanceof Error ? error : new Error('login 请求发生错误');
  }
}

  /**
   * 退出登录
   */
  async logout(options?: SdkRequestOptions): Promise<ApiResult<any>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authentication.logout(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<any>;
  } catch (error) {
    // 错误处理
    console.error('logout 请求失败:', error);
    throw error instanceof Error ? error : new Error('logout 请求发生错误');
  }
}
}
