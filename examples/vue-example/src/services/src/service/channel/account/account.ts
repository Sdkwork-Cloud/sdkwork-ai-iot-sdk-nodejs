/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ChannelAccountParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChannelAccountResponse
} from 'sdkwork-sdk-api-typescript';

import { ChannelAccountManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChannelAccountVO } from './types';
/**
 * ChannelAccount API接口实现
 */
export class ChannelAccountService extends BaseService<ChannelAccountManager, ChannelAccountParam, ChannelAccountVO> {

   constructor() {
      const manager = ManagerFactory.create(ChannelAccountManager);
      super(manager);
   }
}
