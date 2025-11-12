/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
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

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * VipBenefit API接口实现
 */
export class VipBenefitManager extends BaseManager<SdkClient, VipBenefitParam, VipBenefitResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'vip.benefit' || '';
      super(client, path);
   }
}
