/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  TableParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  TableResponse
} from 'sdkwork-sdk-api-typescript';

import { TableManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { TableVO } from './types';
/**
 * Table API接口实现
 */
export class TableService extends BaseService<TableManager, TableParam, TableVO> {

   constructor() {
      super(ManagerFactory.create(TableManager));
   }
}
