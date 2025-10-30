/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  InvokeRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  InvokeRecordResponse
} from 'sdkwork-sdk-api-typescript';

import { RecordManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { InvokeRecordVO } from './types';
/**
 * Record API接口实现
 */
export class RecordService extends BaseService<RecordManager, InvokeRecordParam, InvokeRecordVO> {

   constructor() {
      super(ManagerFactory.create(RecordManager));
   }
}
