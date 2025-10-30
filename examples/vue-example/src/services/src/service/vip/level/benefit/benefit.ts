/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VipLevelBenefitParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipLevelBenefitResponse
} from 'sdkwork-sdk-api-typescript';

import { VipLevelBenefitManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipLevelBenefitVO } from './types';
/**
 * VipLevelBenefit API接口实现
 */
export class VipLevelBenefitService extends BaseService<VipLevelBenefitManager, VipLevelBenefitParam, VipLevelBenefitVO> {

   constructor() {
      super(ManagerFactory.create(VipLevelBenefitManager));
   }
}
