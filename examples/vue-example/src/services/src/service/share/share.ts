/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 09:54:51 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ShareParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ShareResponse
} from 'sdkwork-sdk-api-typescript';

import { ShareManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShareVO } from './types';
/**
 * Share API接口实现
 */
export class ShareService extends BaseService<ShareManager, ShareParam, ShareVO> {

   constructor() {
      const manager = ManagerFactory.create(ShareManager);
      super(manager);
   }
}
