/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  UserParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserResponse
} from 'sdkwork-sdk-api-typescript';

import { UserManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserVO } from './types';
/**
 * User API接口实现
 */
export class UserService extends BaseService<UserManager, UserParam, UserVO> {

   constructor() {
      super(ManagerFactory.create(UserManager));
   }
}
