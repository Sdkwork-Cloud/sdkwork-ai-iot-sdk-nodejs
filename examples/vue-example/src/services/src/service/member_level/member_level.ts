/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  MemberLevelParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  MemberLevelResponse
} from 'sdkwork-sdk-api-typescript';

import { Member_levelManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { MemberLevelVO } from './types';
/**
 * Member_level API接口实现
 */
export class Member_levelService extends BaseService<Member_levelManager, MemberLevelParam, MemberLevelVO> {

   constructor() {
      super(ManagerFactory.create(Member_levelManager));
   }
}
