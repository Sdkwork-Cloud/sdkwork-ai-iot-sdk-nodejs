/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
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

import { Channel_accountManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChannelAccountVO } from './types';
/**
 * Channel_account API接口实现
 */
export class Channel_accountService extends BaseService<Channel_accountManager, ChannelAccountParam, ChannelAccountVO> {

   constructor() {
      super(ManagerFactory.create(Channel_accountManager));
   }
}
