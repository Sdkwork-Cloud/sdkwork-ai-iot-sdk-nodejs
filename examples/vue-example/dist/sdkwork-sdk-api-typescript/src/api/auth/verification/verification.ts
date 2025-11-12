/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  EmailVerificationParam,
  SendVerificationCodeParam,
  PhoneVerificationParam
} from '../../../types/auth';

import type {
  VerificationResponse
} from '../../../types/auth';

/**
 * Verification API接口实现
 */
export class VerificationApi extends BaseSdkApi {

  /**
   * 验证邮箱
   */
  async verifyEmail(data: EmailVerificationParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<VerificationResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/verification/verify_email`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/verification/verify_email`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<VerificationResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('verifyEmail 请求失败:', error);
    throw error instanceof Error ? error : new Error('verifyEmail 请求发生错误');
  }
}

  /**
   * 验证手机
   */
  async verifyPhone(data: PhoneVerificationParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<VerificationResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/verification/verify_phone`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/verification/verify_phone`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<VerificationResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('verifyPhone 请求失败:', error);
    throw error instanceof Error ? error : new Error('verifyPhone 请求发生错误');
  }
}

  /**
   * 发送验证码
   */
  async sendVerificationCode(data: SendVerificationCodeParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/verification/send_code`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/verification/send_code`,
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
    console.error('sendVerificationCode 请求失败:', error);
    throw error instanceof Error ? error : new Error('sendVerificationCode 请求发生错误');
  }
}
}
