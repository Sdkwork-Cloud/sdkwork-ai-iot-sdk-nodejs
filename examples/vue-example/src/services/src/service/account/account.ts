/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 19:56:34 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
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

import { AccountManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AccountVO } from './types';
/**
 * Account API接口实现
 */
export class AccountService extends BaseService<AccountManager, AccountParam, AccountVO> {

   constructor() {
      const manager = ManagerFactory.create(AccountManager);
      super(manager);
   }
}
