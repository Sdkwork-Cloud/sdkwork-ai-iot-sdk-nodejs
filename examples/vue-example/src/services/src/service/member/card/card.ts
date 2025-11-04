/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
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

import { MemberCardManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { MemberCardVO } from './types';
/**
 * MemberCard API接口实现
 */
export class MemberCardService extends BaseService<MemberCardManager, MemberCardParam, MemberCardVO> {

   constructor() {
      const manager = ManagerFactory.create(MemberCardManager);
      super(manager);
   }
}
