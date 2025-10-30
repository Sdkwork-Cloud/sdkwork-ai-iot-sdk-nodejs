/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  UserRoleParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserRoleKeyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserRoleResponse
} from 'sdkwork-sdk-api-typescript';

import { RbacUserRoleManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserRoleVO } from './types';
/**
 * RbacUserRole API接口实现
 */
export class RbacUserRoleService extends BaseService<RbacUserRoleManager, UserRoleParam, UserRoleVO> {

   constructor() {
      super(ManagerFactory.create(RbacUserRoleManager));
   }
}
