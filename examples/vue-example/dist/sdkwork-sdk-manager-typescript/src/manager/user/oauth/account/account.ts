/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  UserOAuthAccountParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserOAuthAccountResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * UserOauthAccount API接口实现
 */
export class UserOauthAccountManager extends BaseManager<SdkClient, UserOAuthAccountParam, UserOAuthAccountResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'user.oauth.account' || '';
      super(client, path);
   }
}
