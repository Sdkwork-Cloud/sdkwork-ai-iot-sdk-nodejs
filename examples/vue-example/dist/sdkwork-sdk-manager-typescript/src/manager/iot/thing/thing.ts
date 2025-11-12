/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  IotThingParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  IotThingResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * IotThing API接口实现
 */
export class IotThingManager extends BaseManager<SdkClient, IotThingParam, IotThingResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'iot.thing' || '';
      super(client, path);
   }
}
