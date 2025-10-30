/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiModelInfoParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiModelInfoResponse
} from 'sdkwork-sdk-api-typescript';

import { ModelManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiModelInfoVO } from './types';
/**
 * Model API接口实现
 */
export class ModelService extends BaseService<ModelManager, AiModelInfoParam, AiModelInfoVO> {

   constructor() {
      super(ManagerFactory.create(ModelManager));
   }
}
