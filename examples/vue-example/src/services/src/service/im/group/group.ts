/**
 * 自动生成的API接口实现
 * 生成时间: Sat Nov 01 17:03:44 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ImGroupParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ImGroupResponse
} from 'sdkwork-sdk-api-typescript';

import { ImGroupManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ImGroupVO } from './types';
/**
 * ImGroup API接口实现
 */
export class ImGroupService extends BaseService<ImGroupManager, ImGroupParam, ImGroupVO> {

   constructor() {
      const manager = ManagerFactory.create(ImGroupManager);
      super(manager);
   }
}
