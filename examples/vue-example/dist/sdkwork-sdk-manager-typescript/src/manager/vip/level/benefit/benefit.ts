/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
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

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * VipLevelBenefit API接口实现
 */
export class VipLevelBenefitManager extends BaseManager<SdkClient, VipLevelBenefitParam, VipLevelBenefitResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'vip.level.benefit' || '';
      super(client, path);
   }
}
