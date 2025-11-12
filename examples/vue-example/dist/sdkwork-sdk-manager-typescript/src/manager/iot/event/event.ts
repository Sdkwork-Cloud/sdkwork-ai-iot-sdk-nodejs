/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseSdkManager } from 'sdkwork-commons-typescript';
import type {
  SendEventParam
} from 'sdkwork-sdk-api-typescript';

import type {
  IotEvent
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * IotEvent API接口实现
 */
export class IotEventManager extends BaseSdkManager<SdkClient> {

  /**
   * Send an IoT event
   */
  async send(data: SendEventParam, options?: SdkRequestOptions):  Promise<ApiResult<IotEvent>> {
  try {
    options = this._client.buildRequestOptions(options);
    const response = await this._client.iot.event.send(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ApiResult<IotEvent>;
  } catch (error) {
    // 错误处理
    console.error('send 请求失败:', error);
    throw error instanceof Error ? error : new Error('send 请求发生错误');
  }
}
}
