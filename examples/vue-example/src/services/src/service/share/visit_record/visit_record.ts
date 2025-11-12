/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 09:54:51 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ShareVisitRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ShareVisitRecordResponse
} from 'sdkwork-sdk-api-typescript';

import { ShareVisit_recordManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShareVisitRecordVO } from './types';
/**
 * ShareVisit_record API接口实现
 */
export class ShareVisit_recordService extends BaseService<ShareVisit_recordManager, ShareVisitRecordParam, ShareVisitRecordVO> {

   constructor() {
      const manager = ManagerFactory.create(ShareVisit_recordManager);
      super(manager);
   }
}
