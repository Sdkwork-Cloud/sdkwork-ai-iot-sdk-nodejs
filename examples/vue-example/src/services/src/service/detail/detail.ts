/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  DetailParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  DetailResponse
} from 'sdkwork-sdk-api-typescript';

import { DetailManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DetailVO } from './types';
/**
 * Detail API接口实现
 */
export class DetailService extends BaseService<DetailManager, DetailParam, DetailVO> {

   constructor() {
      super(ManagerFactory.create(DetailManager));
   }
}
