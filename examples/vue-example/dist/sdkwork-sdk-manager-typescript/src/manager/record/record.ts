/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  InvokeRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  InvokeRecordResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Record API接口实现
 */
export class RecordManager extends BaseManager<SdkClient, InvokeRecordParam, InvokeRecordResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'record' || '';
      super(client, path);
   }
}
