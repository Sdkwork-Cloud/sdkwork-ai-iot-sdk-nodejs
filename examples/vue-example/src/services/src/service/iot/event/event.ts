/**
 * 自动生成的API接口实现
 * 生成时间: Mon Oct 27 11:00:04 CST 2025
 */

import type { SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  SendEventParam
} from 'sdkwork-sdk-api-typescript';

import type {
  IotEvent
} from 'sdkwork-sdk-api-typescript';

import { IotEventManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
/**
 * IotEvent API接口实现
 */
export class IotEventService {
   iotEventManager: IotEventManager;
   constructor() {
      this.iotEventManager = ManagerFactory.create( IotEventManager );
   }

  /**
   * Send an IoT event
   */
  async send(data: SendEventParam, options?: SdkRequestOptions): Promise<IotEvent> {
    const response = await this.iotEventManager.send(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as IotEvent;
  }

}
