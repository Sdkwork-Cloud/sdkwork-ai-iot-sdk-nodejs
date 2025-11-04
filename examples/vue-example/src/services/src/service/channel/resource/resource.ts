/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:12:34 CST 2025
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

import { ChannelResourceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChannelResourceVO } from './types';
/**
 * ChannelResource API接口实现
 */
export class ChannelResourceService extends BaseService<ChannelResourceManager, ChannelResourceParam, ChannelResourceVO> {

   constructor() {
      const manager = ManagerFactory.create(ChannelResourceManager);
      super(manager);
   }
}
