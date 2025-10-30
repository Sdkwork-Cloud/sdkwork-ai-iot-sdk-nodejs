/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ApiKeyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ApiKeyResponse
} from 'sdkwork-sdk-api-typescript';

import { ApikeyManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ApiKeyVO } from './types';
/**
 * Apikey API接口实现
 */
export class ApikeyService extends BaseService<ApikeyManager, ApiKeyParam, ApiKeyVO> {

   constructor() {
      super(ManagerFactory.create(ApikeyManager));
   }
}
