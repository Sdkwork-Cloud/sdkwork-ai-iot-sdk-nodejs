/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  VisitHistoryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VisitHistoryResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Visit_history API接口实现
 */
export class Visit_historyManager extends BaseManager<SdkClient, VisitHistoryParam, VisitHistoryResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'visit_history' || '';
      super(client, path);
   }
}
