/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  FeedbackParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  FeedbackResponse
} from 'sdkwork-sdk-api-typescript';

import { FeedbackManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { FeedbackVO } from './types';
/**
 * Feedback API接口实现
 */
export class FeedbackService extends BaseService<FeedbackManager, FeedbackParam, FeedbackVO> {

   constructor() {
      super(ManagerFactory.create(FeedbackManager));
   }
}
