/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  DiskMemberParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  DiskMemberResponse
} from 'sdkwork-sdk-api-typescript';

import { DiskMemberManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DiskMemberVO } from './types';
/**
 * DiskMember API接口实现
 */
export class DiskMemberService extends BaseService<DiskMemberManager, DiskMemberParam, DiskMemberVO> {

   constructor() {
      const manager = ManagerFactory.create(DiskMemberManager);
      super(manager);
   }
}
