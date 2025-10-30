/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
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

import { UserOauthAccountManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserOAuthAccountVO } from './types';
/**
 * UserOauthAccount API接口实现
 */
export class UserOauthAccountService extends BaseService<UserOauthAccountManager, UserOAuthAccountParam, UserOAuthAccountVO> {

   constructor() {
      super(ManagerFactory.create(UserOauthAccountManager));
   }
}
