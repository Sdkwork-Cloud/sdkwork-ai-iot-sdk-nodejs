/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CardTemplateParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CardTemplateResponse
} from 'sdkwork-sdk-api-typescript';

import { CardTemplateManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CardTemplateVO } from './types';
/**
 * CardTemplate API接口实现
 */
export class CardTemplateService extends BaseService<CardTemplateManager, CardTemplateParam, CardTemplateVO> {

   constructor() {
      super(ManagerFactory.create(CardTemplateManager));
   }
}
