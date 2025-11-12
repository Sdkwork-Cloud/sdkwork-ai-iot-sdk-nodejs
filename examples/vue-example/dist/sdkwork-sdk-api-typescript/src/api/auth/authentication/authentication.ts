/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  RegisterParam,
  RefreshTokenParam,
  PasswordResetParam,
  PasswordResetRequestParam,
  ChangePasswordParam,
  LoginParam
} from '../../../types/auth';

import type {
  AuthUserResponse,
  PasswordResetResultResponse,
  RegisterResultResponse,
  LoginResultResponse
} from '../../../types/auth';

/**
 * Authentication API接口实现
 */
export class AuthenticationApi extends BaseSdkApi {

  /**
   * 用户注册
   */
  async register(data: RegisterParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<RegisterResultResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authentication/register`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authentication/register`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<RegisterResultResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('register 请求失败:', error);
    throw error instanceof Error ? error : new Error('register 请求发生错误');
  }
}

  /**
   * 重置密码
   */
  async resetPassword(data: PasswordResetParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PasswordResetResultResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authentication/reset_password`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authentication/reset_password`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<PasswordResetResultResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('resetPassword 请求失败:', error);
    throw error instanceof Error ? error : new Error('resetPassword 请求发生错误');
  }
}

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AuthUserResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/auth/authentication/get_current_user`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<AuthUserResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getCurrentUser 请求失败:', error);
    throw error instanceof Error ? error : new Error('getCurrentUser 请求发生错误');
  }
}

  /**
   * 刷新访问令牌
   */
  async refreshToken(data: RefreshTokenParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<LoginResultResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authentication/refresh_token`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authentication/refresh_token`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<LoginResultResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('refreshToken 请求失败:', error);
    throw error instanceof Error ? error : new Error('refreshToken 请求发生错误');
  }
}

  /**
   * 修改密码
   */
  async changePassword(data: ChangePasswordParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authentication/change_password`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authentication/change_password`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Boolean>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('changePassword 请求失败:', error);
    throw error instanceof Error ? error : new Error('changePassword 请求发生错误');
  }
}

  /**
   * 请求密码重置
   */
  async requestPasswordReset(data: PasswordResetRequestParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PasswordResetResultResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authentication/request_password_reset`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authentication/request_password_reset`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<PasswordResetResultResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('requestPasswordReset 请求失败:', error);
    throw error instanceof Error ? error : new Error('requestPasswordReset 请求发生错误');
  }
}

  /**
   * 用户登录
   */
  async login(data: LoginParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<LoginResultResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authentication/login`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authentication/login`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<LoginResultResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('login 请求失败:', error);
    throw error instanceof Error ? error : new Error('login 请求发生错误');
  }
}

  /**
   * 退出登录
   */
  async logout(options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<any>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authentication/logout`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authentication/logout`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<any>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('logout 请求失败:', error);
    throw error instanceof Error ? error : new Error('logout 请求发生错误');
  }
}
}
