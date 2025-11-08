/**
 * 自动生成的API接口实现
 * 生成时间: Sat Nov 08 20:16:13 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
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

import { IotDeviceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { IotDeviceActivateVO, IotDeviceVO } from './types';
/**
 * IotDevice API接口实现
 */
export class IotDeviceService extends BaseService<IotDeviceManager, IotDeviceParam, IotDeviceVO> {

   constructor() {
      const manager = ManagerFactory.create(IotDeviceManager);
      super(manager);
   }

  /**
   * 激活IoT设备
   */
  async activateByCode(queryParams?: { code: string }, options?: SdkRequestOptions): Promise<IotDeviceActivateVO> {
    const response = await this.manager.activateByCode(queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as IotDeviceActivateVO;
  }


  /**
   * 激活IoT设备
   */
  async activate(id: string, queryParams?: { code: string }, options?: SdkRequestOptions): Promise<IotDeviceActivateVO> {
    const response = await this.manager.activate(id, queryParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as IotDeviceActivateVO;
  }

}
