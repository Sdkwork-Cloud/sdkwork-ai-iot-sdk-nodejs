/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  SendEventParam
} from '../../../types/event';

import type {
  IotEvent
} from '../../../types/com.sdkwork.ai.iot.event';

/**
 * Event API接口实现
 */
export class EventApi extends BaseSdkApi {

  /**
   * Send an IoT event
   */
  async send(data: SendEventParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<IotEvent>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/iot/event/send`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<IotEvent>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('send 请求失败:', error);
    throw error instanceof Error ? error : new Error('send 请求发生错误');
  }
}
}
