/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  PptTemplateSlideParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  PptTemplateSlideResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * PptTemplateSlide API接口实现
 */
export class PptTemplateSlideManager extends BaseManager<SdkClient, PptTemplateSlideParam, PptTemplateSlideResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'ppt.template.slide' || '';
      super(client, path);
   }
}
