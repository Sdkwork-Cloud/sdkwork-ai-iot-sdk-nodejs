/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 09:54:51 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  FavoriteParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  FavoriteResponse
} from 'sdkwork-sdk-api-typescript';

import { FavoriteManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FavoriteVO } from './types';
/**
 * Favorite API接口实现
 */
export class FavoriteService extends BaseService<FavoriteManager, FavoriteParam, FavoriteVO> {

   constructor() {
      const manager = ManagerFactory.create(FavoriteManager);
      super(manager);
   }
}
