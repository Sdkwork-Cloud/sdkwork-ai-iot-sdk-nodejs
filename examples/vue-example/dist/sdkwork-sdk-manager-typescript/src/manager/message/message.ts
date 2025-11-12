/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { Page, Pageable, ApiResult, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseManager } from 'sdkwork-commons-typescript';
import type {
  ChatMessageContentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ChatMessageContentResponse
} from 'sdkwork-sdk-api-typescript';

import type { SdkClient } from 'sdkwork-sdk-api-typescript';

/**
 * Message API接口实现
 */
export class MessageManager extends BaseManager<SdkClient, ChatMessageContentParam, ChatMessageContentResponse> {

   constructor(client: SdkClient | any, path?: string) {
      path= 'message' || '';
      super(client, path);
   }
}
