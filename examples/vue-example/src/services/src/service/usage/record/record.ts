/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  UsageRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UsageRecordResponse
} from 'sdkwork-sdk-api-typescript';

import { UsageRecordManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UsageRecordVO } from './types';
/**
 * UsageRecord API接口实现
 */
export class UsageRecordService extends BaseService<UsageRecordManager, UsageRecordParam, UsageRecordVO> {

   constructor() {
      super(ManagerFactory.create(UsageRecordManager));
   }
}
