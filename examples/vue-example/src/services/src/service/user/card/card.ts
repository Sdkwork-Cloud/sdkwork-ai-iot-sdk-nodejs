/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  UserCardParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserCardResponse
} from 'sdkwork-sdk-api-typescript';

import { UserCardManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserCardVO } from './types';
/**
 * UserCard API接口实现
 */
export class UserCardService extends BaseService<UserCardManager, UserCardParam, UserCardVO> {

   constructor() {
      super(ManagerFactory.create(UserCardManager));
   }
}
