/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  RolePermissionParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  RolePermissionResponse
} from 'sdkwork-sdk-api-typescript';

import { RolePermissionManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { RolePermissionVO } from './types';
/**
 * RolePermission API接口实现
 */
export class RolePermissionService extends BaseService<RolePermissionManager, RolePermissionParam, RolePermissionVO> {

   constructor() {
      const manager = ManagerFactory.create(RolePermissionManager);
      super(manager);
   }
}
