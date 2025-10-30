/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
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

import { PptTemplateSlideManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { PptTemplateSlideVO } from './types';
/**
 * PptTemplateSlide API接口实现
 */
export class PptTemplateSlideService extends BaseService<PptTemplateSlideManager, PptTemplateSlideParam, PptTemplateSlideVO> {

   constructor() {
      super(ManagerFactory.create(PptTemplateSlideManager));
   }
}
