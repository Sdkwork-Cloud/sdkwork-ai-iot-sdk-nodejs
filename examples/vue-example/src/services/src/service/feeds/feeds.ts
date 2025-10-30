/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  FeedsParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  FeedsResponse
} from 'sdkwork-sdk-api-typescript';

import { FeedsManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FeedsVO } from './types';
/**
 * Feeds API接口实现
 */
export class FeedsService extends BaseService<FeedsManager, FeedsParam, FeedsVO> {

   constructor() {
      super(ManagerFactory.create(FeedsManager));
   }
}
