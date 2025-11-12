/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  CreateJsapiSignatureParam,
  AppParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AppSdkConfigResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  AppResponse,
  AppInfoResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * App API接口实现
 */
export class AppManager extends BaseManager<SdkClient, AppParam, AppResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'app' || '';
      super(client, path);
   }

  /**
   * 获取应用SDK配置
   */
  async getSdkConfig(data: CreateJsapiSignatureParam, options?: SdkRequestOptions):  Promise<ApiResult<AppSdkConfigResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.app.getSdkConfig(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<AppSdkConfigResponse>;
  } catch (error) {
    // 错误处理
    console.error('getSdkConfig 请求失败:', error);
    throw error instanceof Error ? error : new Error('getSdkConfig 请求发生错误');
  }
}

  /**
   * 获取应用信息
   */
  async getAppInfo(options?: SdkRequestOptions):  Promise<ApiResult<AppInfoResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.app.getAppInfo(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<AppInfoResponse>;
  } catch (error) {
    // 错误处理
    console.error('getAppInfo 请求失败:', error);
    throw error instanceof Error ? error : new Error('getAppInfo 请求发生错误');
  }
}
}
