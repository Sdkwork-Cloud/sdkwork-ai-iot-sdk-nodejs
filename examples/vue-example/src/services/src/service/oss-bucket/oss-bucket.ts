/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
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

import { Oss_bucketManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OssBucketVO } from './types';
/**
 * Oss_bucket API接口实现
 */
export class Oss_bucketService extends BaseService<Oss_bucketManager, OssBucketParam, OssBucketVO> {

   constructor() {
      super(ManagerFactory.create(Oss_bucketManager));
   }
}
