/**
 * 自动生成的API接口实现
 * 生成时间: Mon Oct 27 10:52:24 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  IotDeviceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  IotDeviceResponse
} from 'sdkwork-sdk-api-typescript';

import { IotDeviceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { IotDeviceVO } from './types';
/**
 * IotDevice API接口实现
 */
export class IotDeviceService extends BaseService<IotDeviceManager, IotDeviceParam, IotDeviceVO> {

   constructor() {
      const manager = ManagerFactory.create(IotDeviceManager);
      super(manager);
   }
}
