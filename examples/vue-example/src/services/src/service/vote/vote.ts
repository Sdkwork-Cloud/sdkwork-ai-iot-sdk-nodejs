/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ContentVoteParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ContentVoteResponse
} from 'sdkwork-sdk-api-typescript';

import { VoteManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ContentVoteVO } from './types';
/**
 * Vote API接口实现
 */
export class VoteService extends BaseService<VoteManager, ContentVoteParam, ContentVoteVO> {

   constructor() {
      super(ManagerFactory.create(VoteManager));
   }
}
