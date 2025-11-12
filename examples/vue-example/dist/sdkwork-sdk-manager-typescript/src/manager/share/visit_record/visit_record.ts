/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  ShareVisitRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ShareVisitRecordResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * ShareVisit_record API接口实现
 */
export class ShareVisit_recordManager extends BaseManager<SdkClient, ShareVisitRecordParam, ShareVisitRecordResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'share.visit_record' || '';
      super(client, path);
   }
}
