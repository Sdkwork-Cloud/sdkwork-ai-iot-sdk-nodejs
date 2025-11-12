/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
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

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * RbacUserRole API接口实现
 */
export class RbacUserRoleManager extends BaseManager<SdkClient, UserRoleParam, UserRoleResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'rbac.user.role' || '';
      super(client, path);
   }
}
