/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ShortUrlParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ShortUrlResponse
} from 'sdkwork-sdk-api-typescript';

import { Short_urlManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShortUrlVO } from './types';
/**
 * Short_url API接口实现
 */
export class Short_urlService extends BaseService<Short_urlManager, ShortUrlParam, ShortUrlVO> {

   constructor() {
      super(ManagerFactory.create(Short_urlManager));
   }
}
