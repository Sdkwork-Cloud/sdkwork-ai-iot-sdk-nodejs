/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CouponTemplateParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CouponTemplateResponse
} from 'sdkwork-sdk-api-typescript';

import { CouponTemplateManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CouponTemplateVO } from './types';
/**
 * CouponTemplate API接口实现
 */
export class CouponTemplateService extends BaseService<CouponTemplateManager, CouponTemplateParam, CouponTemplateVO> {

   constructor() {
      super(ManagerFactory.create(CouponTemplateManager));
   }
}
