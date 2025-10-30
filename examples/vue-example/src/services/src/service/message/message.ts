/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
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

import { MessageManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ChatMessageContentVO } from './types';
/**
 * Message API接口实现
 */
export class MessageService extends BaseService<MessageManager, ChatMessageContentParam, ChatMessageContentVO> {

   constructor() {
      super(ManagerFactory.create(MessageManager));
   }
}
