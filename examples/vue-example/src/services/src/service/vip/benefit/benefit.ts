/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VipBenefitParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipBenefitResponse
} from 'sdkwork-sdk-api-typescript';

import { VipBenefitManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipBenefitVO } from './types';
/**
 * VipBenefit API接口实现
 */
export class VipBenefitService extends BaseService<VipBenefitManager, VipBenefitParam, VipBenefitVO> {

   constructor() {
      super(ManagerFactory.create(VipBenefitManager));
   }
}
