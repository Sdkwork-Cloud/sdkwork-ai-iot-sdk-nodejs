/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
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

import { AuthAuthenticationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AuthUserVO, LoginResultVO, RegisterResultVO, PasswordResetResultVO } from './types';
/**
 * AuthAuthentication API接口实现
 */
export class AuthAuthenticationService {
   authAuthenticationManager: AuthAuthenticationManager;
   constructor() {
      this.authAuthenticationManager = ManagerFactory.create( AuthAuthenticationManager );
   }

  /**
   * 用户注册
   */
  async register(data: RegisterParam, options?: SdkRequestOptions): Promise<RegisterResultVO> {
    const response = await this.authAuthenticationManager.register(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as RegisterResultVO;
  }


  /**
   * 刷新访问令牌
   */
  async refreshToken(data: RefreshTokenParam, options?: SdkRequestOptions): Promise<LoginResultVO> {
    const response = await this.authAuthenticationManager.refreshToken(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as LoginResultVO;
  }


  /**
   * 获取当前用户信息
   */
  async getCurrentUser(options?: SdkRequestOptions): Promise<AuthUserVO> {
    const response = await this.authAuthenticationManager.getCurrentUser(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AuthUserVO;
  }


  /**
   * 修改密码
   */
  async changePassword(data: ChangePasswordParam, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.authAuthenticationManager.changePassword(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * 重置密码
   */
  async resetPassword(data: PasswordResetParam, options?: SdkRequestOptions): Promise<PasswordResetResultVO> {
    const response = await this.authAuthenticationManager.resetPassword(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PasswordResetResultVO;
  }


  /**
   * 请求密码重置
   */
  async requestPasswordReset(data: PasswordResetRequestParam, options?: SdkRequestOptions): Promise<PasswordResetResultVO> {
    const response = await this.authAuthenticationManager.requestPasswordReset(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PasswordResetResultVO;
  }


  /**
   * 用户登录
   */
  async login(data: LoginParam, options?: SdkRequestOptions): Promise<LoginResultVO> {
    const response = await this.authAuthenticationManager.login(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as LoginResultVO;
  }


  /**
   * 退出登录
   */
  async logout(options?: SdkRequestOptions): Promise<any> {
    const response = await this.authAuthenticationManager.logout(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as any;
  }

}
