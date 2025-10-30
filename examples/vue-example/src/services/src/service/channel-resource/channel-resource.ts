/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ChannelResourceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChannelResourceResponse
} from 'sdkwork-sdk-api-typescript';

import { Channel_resourceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChannelResourceVO } from './types';
/**
 * Channel_resource API接口实现
 */
export class Channel_resourceService extends BaseService<Channel_resourceManager, ChannelResourceParam, ChannelResourceVO> {

   constructor() {
      super(ManagerFactory.create(Channel_resourceManager));
   }
}
