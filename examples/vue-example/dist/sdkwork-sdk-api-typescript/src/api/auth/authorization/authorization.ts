/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  PermissionCheckParam,
  RoleCheckParam
} from '../../../types/auth';

/**
 * Authorization API接口实现
 */
export class AuthorizationApi extends BaseSdkApi {

  /**
   * 获取用户权限列表
   */
  async getPermissions(options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<String[]>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/auth/authorization/permissions`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<String[]>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getPermissions 请求失败:', error);
    throw error instanceof Error ? error : new Error('getPermissions 请求发生错误');
  }
}

  /**
   * 检查用户权限
   */
  async hasPermission(data: PermissionCheckParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authorization/has_permission`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authorization/has_permission`,
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
    console.error('hasPermission 请求失败:', error);
    throw error instanceof Error ? error : new Error('hasPermission 请求发生错误');
  }
}

  /**
   * 检查用户角色
   */
  async hasRole(data: RoleCheckParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/auth/authorization/has_role`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/auth/authorization/has_role`,
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
    console.error('hasRole 请求失败:', error);
    throw error instanceof Error ? error : new Error('hasRole 请求发生错误');
  }
}

  /**
   * 获取用户角色列表
   */
  async getRoles(options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<String[]>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/auth/authorization/roles`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<String[]>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('getRoles 请求失败:', error);
    throw error instanceof Error ? error : new Error('getRoles 请求发生错误');
  }
}
}
