/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 16 15:39:57 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  PermissionCheckParam,
  RoleCheckParam
} from 'sdkwork-sdk-api-typescript';

import { AuthAuthorizationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * AuthAuthorization API接口实现
 */
export class AuthAuthorizationService {
   authAuthorizationManager: AuthAuthorizationManager;
   constructor() {
      this.authAuthorizationManager = ManagerFactory.create( AuthAuthorizationManager );
   }

  /**
   * 获取用户权限列表
   */
  async getPermissions(options?: SdkRequestOptions): Promise<String[]> {
    const response = await this.authAuthorizationManager.getPermissions(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as String[];
  }


  /**
   * 获取用户角色列表
   */
  async getRoles(options?: SdkRequestOptions): Promise<String[]> {
    const response = await this.authAuthorizationManager.getRoles(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as String[];
  }


  /**
   * 检查用户角色
   */
  async hasRole(data: RoleCheckParam, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.authAuthorizationManager.hasRole(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * 检查用户权限
   */
  async hasPermission(data: PermissionCheckParam, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.authAuthorizationManager.hasPermission(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }

}
