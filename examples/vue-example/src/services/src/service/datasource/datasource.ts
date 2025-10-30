/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  DatasourceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  DatasourceResponse
} from 'sdkwork-sdk-api-typescript';

import { DatasourceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DatasourceVO } from './types';
/**
 * Datasource API接口实现
 */
export class DatasourceService extends BaseService<DatasourceManager, DatasourceParam, DatasourceVO> {

   constructor() {
      super(ManagerFactory.create(DatasourceManager));
   }
}
