/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
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

import { AccountHistoryManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AccountHistoryVO } from './types';
/**
 * AccountHistory API接口实现
 */
export class AccountHistoryService extends BaseService<AccountHistoryManager, AccountHistoryParam, AccountHistoryVO> {

   constructor() {
      super(ManagerFactory.create(AccountHistoryManager));
   }
}
