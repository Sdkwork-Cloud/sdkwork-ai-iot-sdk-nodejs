/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  ApiKeyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ApiKeyResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Apikey API接口实现
 */
export class ApikeyManager extends BaseManager<SdkClient, ApiKeyParam, ApiKeyResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'apikey' || '';
      super(client, path);
   }
}
