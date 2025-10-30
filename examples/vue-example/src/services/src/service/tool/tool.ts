/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiToolParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiToolResponse
} from 'sdkwork-sdk-api-typescript';

import { ToolManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiToolVO } from './types';
/**
 * Tool API接口实现
 */
export class ToolService extends BaseService<ToolManager, AiToolParam, AiToolVO> {

   constructor() {
      super(ManagerFactory.create(ToolManager));
   }
}
