/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
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

import { MemberLevelManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { MemberLevelVO } from './types';
/**
 * MemberLevel API接口实现
 */
export class MemberLevelService extends BaseService<MemberLevelManager, MemberLevelParam, MemberLevelVO> {

   constructor() {
      const manager = ManagerFactory.create(MemberLevelManager);
      super(manager);
   }
}
