/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiModelPriceParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiModelPriceResponse
} from 'sdkwork-sdk-api-typescript';

import { ModelPriceManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiModelPriceVO } from './types';
/**
 * ModelPrice API接口实现
 */
export class ModelPriceService extends BaseService<ModelPriceManager, AiModelPriceParam, AiModelPriceVO> {

   constructor() {
      super(ManagerFactory.create(ModelPriceManager));
   }
}
