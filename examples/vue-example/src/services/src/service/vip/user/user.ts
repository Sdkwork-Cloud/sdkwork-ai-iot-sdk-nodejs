/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  VipUserParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  VipUserResponse
} from 'sdkwork-sdk-api-typescript';

import { VipUserManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { VipUserVO } from './types';
/**
 * VipUser API接口实现
 */
export class VipUserService extends BaseService<VipUserManager, VipUserParam, VipUserVO> {

   constructor() {
      super(ManagerFactory.create(VipUserManager));
   }
}
