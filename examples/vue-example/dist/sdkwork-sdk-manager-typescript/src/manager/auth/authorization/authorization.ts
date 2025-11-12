/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
import type {
  PermissionCheckParam,
  RoleCheckParam
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * AuthAuthorization API接口实现
 */
export class AuthAuthorizationManager extends BaseSdkManager<SdkClient> {

  /**
   * 获取用户权限列表
   */
  async getPermissions(options?: SdkRequestOptions):  Promise<ApiResult<String[]>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authorization.getPermissions(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<String[]>;
  } catch (error) {
    // 错误处理
    console.error('getPermissions 请求失败:', error);
    throw error instanceof Error ? error : new Error('getPermissions 请求发生错误');
  }
}

  /**
   * 检查用户权限
   */
  async hasPermission(data: PermissionCheckParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authorization.hasPermission(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('hasPermission 请求失败:', error);
    throw error instanceof Error ? error : new Error('hasPermission 请求发生错误');
  }
}

  /**
   * 检查用户角色
   */
  async hasRole(data: RoleCheckParam, options?: SdkRequestOptions): Promise<ApiResult<Boolean>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authorization.hasRole(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<Boolean>;
  } catch (error) {
    // 错误处理
    console.error('hasRole 请求失败:', error);
    throw error instanceof Error ? error : new Error('hasRole 请求发生错误');
  }
}

  /**
   * 获取用户角色列表
   */
  async getRoles(options?: SdkRequestOptions):  Promise<ApiResult<String[]>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.auth.authorization.getRoles(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<String[]>;
  } catch (error) {
    // 错误处理
    console.error('getRoles 请求失败:', error);
    throw error instanceof Error ? error : new Error('getRoles 请求发生错误');
  }
}
}
