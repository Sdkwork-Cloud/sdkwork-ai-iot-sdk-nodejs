/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  OssBucketParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  OssBucketResponse
} from 'sdkwork-sdk-api-typescript';

import { OssBucketManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OssBucketVO } from './types';
/**
 * OssBucket API接口实现
 */
export class OssBucketService extends BaseService<OssBucketManager, OssBucketParam, OssBucketVO> {

   constructor() {
      const manager = ManagerFactory.create(OssBucketManager);
      super(manager);
   }
}
