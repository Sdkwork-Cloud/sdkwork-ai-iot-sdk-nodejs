/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 16 15:36:21 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  EmailVerificationParam,
  SendVerificationCodeParam,
  PhoneVerificationParam
} from 'sdkwork-sdk-api-typescript';

import { AuthVerificationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VerificationVO } from './types';
/**
 * AuthVerification API接口实现
 */
export class AuthVerificationService {
   authVerificationManager: AuthVerificationManager;
   constructor() {
      this.authVerificationManager = ManagerFactory.create( AuthVerificationManager );
   }

  /**
   * 发送验证码
   */
  async sendVerificationCode(data: SendVerificationCodeParam, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.authVerificationManager.sendVerificationCode(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * 验证邮箱
   */
  async verifyEmail(data: EmailVerificationParam, options?: SdkRequestOptions): Promise<VerificationVO> {
    const response = await this.authVerificationManager.verifyEmail(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VerificationVO;
  }


  /**
   * 验证手机
   */
  async verifyPhone(data: PhoneVerificationParam, options?: SdkRequestOptions): Promise<VerificationVO> {
    const response = await this.authVerificationManager.verifyPhone(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as VerificationVO;
  }

}
