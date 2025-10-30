/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  MemberCardParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  MemberCardResponse
} from 'sdkwork-sdk-api-typescript';

import { Member_cardManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { MemberCardVO } from './types';
/**
 * Member_card API接口实现
 */
export class Member_cardService extends BaseService<Member_cardManager, MemberCardParam, MemberCardVO> {

   constructor() {
      super(ManagerFactory.create(Member_cardManager));
   }
}
