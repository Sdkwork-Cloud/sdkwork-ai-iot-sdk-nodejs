/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  ChannelAccountParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChannelAccountResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * ChannelAccount API接口实现
 */
export class ChannelAccountManager extends BaseManager<SdkClient, ChannelAccountParam, ChannelAccountResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'channel.account' || '';
      super(client, path);
   }
}
