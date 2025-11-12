/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
import type {
  EmailVerificationParam,
  SendVerificationCodeParam,
  PhoneVerificationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VerificationResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * AuthVerification API接口实现
 */
export class AuthVerificationManager extends BaseSdkManager<SdkClient> {

  /**
   * 验证邮箱
   */
  async verifyEmail(data: EmailVerificationParam, options?: SdkRequestOptions): Promise<ApiResult<VerificationResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.verification.verifyEmail(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<VerificationResponse>;
  } catch (error) {
    // 错误处理
    console.error('verifyEmail 请求失败:', error);
    throw error instanceof Error ? error : new Error('verifyEmail 请求发生错误');
  }
}

  /**
   * 验证手机
   */
  async verifyPhone(data: PhoneVerificationParam, options?: SdkRequestOptions): Promise<ApiResult<VerificationResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.verification.verifyPhone(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<VerificationResponse>;
  } catch (error) {
    // 错误处理
    console.error('verifyPhone 请求失败:', error);
    throw error instanceof Error ? error : new Error('verifyPhone 请求发生错误');
  }
}

  /**
   * 发送验证码
   */
  async sendVerificationCode(data: SendVerificationCodeParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.verification.sendVerificationCode(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('sendVerificationCode 请求失败:', error);
    throw error instanceof Error ? error : new Error('sendVerificationCode 请求发生错误');
  }
}
}
