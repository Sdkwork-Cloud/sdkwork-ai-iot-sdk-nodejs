/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  VipPointChangeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipPointChangeResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * VipPointChange API接口实现
 */
export class VipPointChangeManager extends BaseManager<SdkClient, VipPointChangeParam, VipPointChangeResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'vip.point.change' || '';
      super(client, path);
   }
}
