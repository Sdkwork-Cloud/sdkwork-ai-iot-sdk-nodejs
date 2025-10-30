/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CollectionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CollectionResponse
} from 'sdkwork-sdk-api-typescript';

import { CollectionManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CollectionVO } from './types';
/**
 * Collection API接口实现
 */
export class CollectionService extends BaseService<CollectionManager, CollectionParam, CollectionVO> {

   constructor() {
      super(ManagerFactory.create(CollectionManager));
   }
}
