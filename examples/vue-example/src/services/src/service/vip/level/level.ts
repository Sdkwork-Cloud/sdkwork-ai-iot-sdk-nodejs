/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VipLevelParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipLevelResponse
} from 'sdkwork-sdk-api-typescript';

import { VipLevelManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipLevelVO } from './types';
/**
 * VipLevel API接口实现
 */
export class VipLevelService extends BaseService<VipLevelManager, VipLevelParam, VipLevelVO> {

   constructor() {
      super(ManagerFactory.create(VipLevelManager));
   }
}
