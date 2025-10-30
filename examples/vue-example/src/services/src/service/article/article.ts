/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ArticleParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ArticleResponse
} from 'sdkwork-sdk-api-typescript';

import { ArticleManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ArticleVO } from './types';
/**
 * Article API接口实现
 */
export class ArticleService extends BaseService<ArticleManager, ArticleParam, ArticleVO> {

   constructor() {
      super(ManagerFactory.create(ArticleManager));
   }
}
