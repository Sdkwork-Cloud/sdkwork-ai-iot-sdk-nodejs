/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  UserCouponParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserCouponResponse
} from 'sdkwork-sdk-api-typescript';

import { UserCouponManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserCouponVO } from './types';
/**
 * UserCoupon API接口实现
 */
export class UserCouponService extends BaseService<UserCouponManager, UserCouponParam, UserCouponVO> {

   constructor() {
      super(ManagerFactory.create(UserCouponManager));
   }
}
