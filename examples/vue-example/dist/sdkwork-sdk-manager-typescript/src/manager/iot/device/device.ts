/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  IotDeviceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  IotDeviceResponse,
  IotDeviceActivateResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * IotDevice API接口实现
 */
export class IotDeviceManager extends BaseManager<SdkClient, IotDeviceParam, IotDeviceResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'iot.device' || '';
      super(client, path);
   }

  /**
   * 激活IoT设备
   */
  async activateByCode(queryParams?: { code: string }, options?: SdkRequestOptions): Promise<ApiResult<IotDeviceActivateResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.iot.device.activateByCode(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<IotDeviceActivateResponse>;
  } catch (error) {
    // 错误处理
    console.error('activateByCode 请求失败:', error);
    throw error instanceof Error ? error : new Error('activateByCode 请求发生错误');
  }
}

  /**
   * 激活IoT设备
   */
  async activate(id: string, queryParams?: { code: string }, options?: SdkRequestOptions): Promise<ApiResult<IotDeviceActivateResponse>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.iot.device.activate(id, queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<IotDeviceActivateResponse>;
  } catch (error) {
    // 错误处理
    console.error('activate 请求失败:', error);
    throw error instanceof Error ? error : new Error('activate 请求发生错误');
  }
}
}
