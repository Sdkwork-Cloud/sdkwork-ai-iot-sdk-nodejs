/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  SchemaParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  SchemaResponse
} from 'sdkwork-sdk-api-typescript';

import { SchemaManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { SchemaVO } from './types';
/**
 * Schema API接口实现
 */
export class SchemaService extends BaseService<SchemaManager, SchemaParam, SchemaVO> {

   constructor() {
      super(ManagerFactory.create(SchemaManager));
   }
}
