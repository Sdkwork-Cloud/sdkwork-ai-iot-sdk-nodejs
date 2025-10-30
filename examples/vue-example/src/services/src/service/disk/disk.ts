/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  DiskParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  DiskResponse
} from 'sdkwork-sdk-api-typescript';

import { DiskManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DiskVO } from './types';
/**
 * Disk API接口实现
 */
export class DiskService extends BaseService<DiskManager, DiskParam, DiskVO> {

   constructor() {
      super(ManagerFactory.create(DiskManager));
   }
}
