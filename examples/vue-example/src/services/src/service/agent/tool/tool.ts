/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiAgentToolParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiAgentToolResponse
} from 'sdkwork-sdk-api-typescript';

import { AgentToolManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiAgentToolVO } from './types';
/**
 * AgentTool API接口实现
 */
export class AgentToolService extends BaseService<AgentToolManager, AiAgentToolParam, AiAgentToolVO> {

   constructor() {
      super(ManagerFactory.create(AgentToolManager));
   }
}
