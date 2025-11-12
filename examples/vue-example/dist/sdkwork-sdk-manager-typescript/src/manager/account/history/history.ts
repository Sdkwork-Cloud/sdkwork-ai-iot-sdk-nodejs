/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  AccountHistoryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AccountHistoryResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * AccountHistory API接口实现
 */
export class AccountHistoryManager extends BaseManager<SdkClient, AccountHistoryParam, AccountHistoryResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'account.history' || '';
      super(client, path);
   }
}
