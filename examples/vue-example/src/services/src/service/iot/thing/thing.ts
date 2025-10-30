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
  IotThingParam
} from 'sdkwork-sdk-api-typescript';

import type {
  IotThingResponse
} from 'sdkwork-sdk-api-typescript';

import { IotThingManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { IotThingVO } from './types';
/**
 * IotThing API接口实现
 */
export class IotThingService extends BaseService<IotThingManager, IotThingParam, IotThingVO> {

   constructor() {
      const manager = ManagerFactory.create(IotThingManager);
      super(manager);
   }
}
