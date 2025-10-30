/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  NewsParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  NewsResponse
} from 'sdkwork-sdk-api-typescript';

import { NewsManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { NewsVO } from './types';
/**
 * News API接口实现
 */
export class NewsService extends BaseService<NewsManager, NewsParam, NewsVO> {

   constructor() {
      super(ManagerFactory.create(NewsManager));
   }
}
