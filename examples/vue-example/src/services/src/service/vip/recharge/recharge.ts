/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VipRechargeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipRechargeResponse
} from 'sdkwork-sdk-api-typescript';

import { VipRechargeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipRechargeVO } from './types';
/**
 * VipRecharge API接口实现
 */
export class VipRechargeService extends BaseService<VipRechargeManager, VipRechargeParam, VipRechargeVO> {

   constructor() {
      super(ManagerFactory.create(VipRechargeManager));
   }
}
