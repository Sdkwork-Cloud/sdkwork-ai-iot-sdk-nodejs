/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AiAgentToolParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { AgentToolManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiAgentToolVO } from './types';
/**
 * AgentTool API接口实现
 */
export class AgentToolService {
   agentToolManager: AgentToolManager;
   constructor() {
      this.agentToolManager = ManagerFactory.create( AgentToolManager );
   }

  /**
   * Create a new agent-tool relationship
   */
  async create(data: AiAgentToolParam, options?: SdkRequestOptions): Promise<AiAgentToolVO> {
    const response = await this.agentToolManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentToolVO;
  }


  /**
   * Update an existing agent-tool relationship
   */
  async update(data: AiAgentToolParam, options?: SdkRequestOptions): Promise<AiAgentToolVO> {
    const response = await this.agentToolManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentToolVO;
  }


  /**
   * Get an agent-tool relationship by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AiAgentToolVO> {
    const response = await this.agentToolManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentToolVO;
  }


  /**
   * Delete an agent-tool relationship
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.agentToolManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get agent-tool relationships by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AiAgentToolVO>> {
    const response = await this.agentToolManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AiAgentToolVO>;
  }


  /**
   * Get all agent-tool relationships
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AiAgentToolVO[]> {
    const response = await this.agentToolManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AiAgentToolVO[];
  }

}
