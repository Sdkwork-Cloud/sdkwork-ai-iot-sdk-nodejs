/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 09:54:51 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VisitHistoryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VisitHistoryResponse
} from 'sdkwork-sdk-api-typescript';

import { Visit_historyManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VisitHistoryVO } from './types';
/**
 * Visit_history API接口实现
 */
export class Visit_historyService extends BaseService<Visit_historyManager, VisitHistoryParam, VisitHistoryVO> {

   constructor() {
      const manager = ManagerFactory.create(Visit_historyManager);
      super(manager);
   }
}
