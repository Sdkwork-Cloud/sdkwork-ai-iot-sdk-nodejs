/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiGenerationContentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiGenerationContentResponse
} from 'sdkwork-sdk-api-typescript';

import { GenerationContentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiGenerationContentVO } from './types';
/**
 * GenerationContent API接口实现
 */
export class GenerationContentService extends BaseService<GenerationContentManager, AiGenerationContentParam, AiGenerationContentVO> {

   constructor() {
      super(ManagerFactory.create(GenerationContentManager));
   }
}
