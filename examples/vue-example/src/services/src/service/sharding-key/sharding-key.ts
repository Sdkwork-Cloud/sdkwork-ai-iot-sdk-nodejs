/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ShardingKeyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ShardingKeyResponse
} from 'sdkwork-sdk-api-typescript';

import { Sharding_keyManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShardingKeyVO } from './types';
/**
 * Sharding_key API接口实现
 */
export class Sharding_keyService extends BaseService<Sharding_keyManager, ShardingKeyParam, ShardingKeyVO> {

   constructor() {
      super(ManagerFactory.create(Sharding_keyManager));
   }
}
