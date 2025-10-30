/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VipPointChangeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipPointChangeResponse
} from 'sdkwork-sdk-api-typescript';

import { VipPointChangeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipPointChangeVO } from './types';
/**
 * VipPointChange API接口实现
 */
export class VipPointChangeService extends BaseService<VipPointChangeManager, VipPointChangeParam, VipPointChangeVO> {

   constructor() {
      super(ManagerFactory.create(VipPointChangeManager));
   }
}
