/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiAgentParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { AgentManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiAgentVO } from './types';
/**
 * Agent API接口实现
 */
export class AgentService {
   agentManager: AgentManager;
   constructor() {
      this.agentManager = ManagerFactory.create( AgentManager );
   }

  /**
   * Create a new AI agent
   */
  async create(data: AiAgentParam, options?: SdkRequestOptions): Promise<AiAgentVO> {
    const response = await this.agentManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentVO;
  }


  /**
   * Update an existing AI agent
   */
  async update(data: AiAgentParam, options?: SdkRequestOptions): Promise<AiAgentVO> {
    const response = await this.agentManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentVO;
  }


  /**
   * Get an AI agent by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiAgentVO> {
    const response = await this.agentManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentVO;
  }


  /**
   * Delete an AI agent
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.agentManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get AI agents by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiAgentVO>> {
    const response = await this.agentManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiAgentVO>;
  }


  /**
   * Get all AI agents
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiAgentVO[]> {
    const response = await this.agentManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentVO[];
  }

}
