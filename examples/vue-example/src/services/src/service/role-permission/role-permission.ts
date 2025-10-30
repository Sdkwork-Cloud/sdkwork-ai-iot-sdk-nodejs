/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
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

import { Role_permissionManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { RolePermissionVO } from './types';
/**
 * Role_permission API接口实现
 */
export class Role_permissionService extends BaseService<Role_permissionManager, RolePermissionParam, RolePermissionVO> {

   constructor() {
      super(ManagerFactory.create(Role_permissionManager));
   }
}
