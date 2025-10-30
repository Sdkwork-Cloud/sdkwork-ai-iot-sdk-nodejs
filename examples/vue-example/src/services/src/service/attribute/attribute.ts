/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AttributeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AttributeResponse
} from 'sdkwork-sdk-api-typescript';

import { AttributeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AttributeVO } from './types';
/**
 * Attribute API接口实现
 */
export class AttributeService extends BaseService<AttributeManager, AttributeParam, AttributeVO> {

   constructor() {
      super(ManagerFactory.create(AttributeManager));
   }
}
