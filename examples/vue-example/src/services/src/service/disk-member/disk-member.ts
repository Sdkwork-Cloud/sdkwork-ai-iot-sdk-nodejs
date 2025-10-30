/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
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

import { Disk_memberManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DiskMemberVO } from './types';
/**
 * Disk_member API接口实现
 */
export class Disk_memberService extends BaseService<Disk_memberManager, DiskMemberParam, DiskMemberVO> {

   constructor() {
      super(ManagerFactory.create(Disk_memberManager));
   }
}
