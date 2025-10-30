/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VipBenefitUsageParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipBenefitUsageResponse
} from 'sdkwork-sdk-api-typescript';

import { VipBenefitUsageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipBenefitUsageVO } from './types';
/**
 * VipBenefitUsage API接口实现
 */
export class VipBenefitUsageService extends BaseService<VipBenefitUsageManager, VipBenefitUsageParam, VipBenefitUsageVO> {

   constructor() {
      super(ManagerFactory.create(VipBenefitUsageManager));
   }
}
