/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
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

import { ShardingKeyManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShardingKeyVO } from './types';
/**
 * ShardingKey API接口实现
 */
export class ShardingKeyService extends BaseService<ShardingKeyManager, ShardingKeyParam, ShardingKeyVO> {

   constructor() {
      const manager = ManagerFactory.create(ShardingKeyManager);
      super(manager);
   }
}
