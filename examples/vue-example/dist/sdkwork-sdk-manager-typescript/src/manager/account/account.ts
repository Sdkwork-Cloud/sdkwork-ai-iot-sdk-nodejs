/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  AccountParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AccountResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Account API接口实现
 */
export class AccountManager extends BaseManager<SdkClient, AccountParam, AccountResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'account' || '';
      super(client, path);
   }
}
