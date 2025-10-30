/**
 * 自动生成的API接口实现
 * 生成时间: Sun Oct 26 18:28:40 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiAgentParam,
  AiAgentQueryListParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiAgentResponse
} from 'sdkwork-sdk-api-typescript';

import { AgentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiAgentVO } from './types';
/**
 * Agent API接口实现
 */
export class AgentService extends BaseService<AgentManager, AiAgentParam, AiAgentVO> {

   constructor() {
      const manager = ManagerFactory.create(AgentManager);
      super(manager); 
   }

  /**
   * Get public AI agents by page
   */
  async listPublic(data: AiAgentQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiAgentVO>> {
    const response = await this.manager.listPublic(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiAgentVO>;
  }

}
