/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CouponParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CouponResponse
} from 'sdkwork-sdk-api-typescript';

import { CouponManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CouponVO } from './types';
/**
 * Coupon API接口实现
 */
export class CouponService extends BaseService<CouponManager, CouponParam, CouponVO> {

   constructor() {
      super(ManagerFactory.create(CouponManager));
   }
}
