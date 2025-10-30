/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  RoleParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  RoleResponse
} from 'sdkwork-sdk-api-typescript';

import { RoleManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { RoleVO } from './types';
/**
 * Role API接口实现
 */
export class RoleService extends BaseService<RoleManager, RoleParam, RoleVO> {

   constructor() {
      super(ManagerFactory.create(RoleManager));
   }
}
