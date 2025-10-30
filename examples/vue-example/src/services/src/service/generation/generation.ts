/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiGenerationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiGenerationResponse
} from 'sdkwork-sdk-api-typescript';

import { GenerationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiGenerationVO } from './types';
/**
 * Generation API接口实现
 */
export class GenerationService extends BaseService<GenerationManager, AiGenerationParam, AiGenerationVO> {

   constructor() {
      super(ManagerFactory.create(GenerationManager));
   }
}
