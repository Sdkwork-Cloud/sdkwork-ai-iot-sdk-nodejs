/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ColumnParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ColumnResponse
} from 'sdkwork-sdk-api-typescript';

import { ColumnManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ColumnVO } from './types';
/**
 * Column API接口实现
 */
export class ColumnService extends BaseService<ColumnManager, ColumnParam, ColumnVO> {

   constructor() {
      super(ManagerFactory.create(ColumnManager));
   }
}
