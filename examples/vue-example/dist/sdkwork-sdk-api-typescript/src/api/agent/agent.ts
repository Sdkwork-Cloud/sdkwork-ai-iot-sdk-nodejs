/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  AiAgentParam,
  AiAgentQueryListParam
} from '../../types/agent';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  AiAgentResponse
} from '../../types/agent';

import { ChatApi } from './chat';
import { ToolApi } from './tool';
/**
 * Agent API接口实现
 */
export class AgentApi extends BaseSdkApi {
  chat: ChatApi = new ChatApi(this._client);
  tool: ToolApi = new ToolApi(this._client);

  /**
   * Create a new AI agent
   */
  async create(data: AiAgentParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AiAgentResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/agent`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/agent`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<AiAgentResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing AI agent
   */
  async update(data: AiAgentParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AiAgentResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/agent`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: url,
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送PUT请求
    const response = await this._client.put<ApiResult<AiAgentResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get an AI agent by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AiAgentResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/agent/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<AiAgentResponse>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('retrieve 请求失败:', error);
    throw error instanceof Error ? error : new Error('retrieve 请求发生错误');
  }
}

  /**
   * Delete an AI agent
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/agent/${id}`;

    // 发送DELETE请求
    const response = await this._client.delete<ApiResult<Boolean>>(
      url, options
    );

    return response;
  } catch (error) {
    // 错误处理
    console.error('delete 请求失败:', error);
    throw error instanceof Error ? error : new Error('delete 请求发生错误');
  }
}

  /**
   * Get all AI agents
   */
  async listAllEntities(data: AiAgentQueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<AiAgentResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/agent/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/agent/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<AiAgentResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get AI agents by page
   */
  async listByPage(data: AiAgentQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<AiAgentResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/agent/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/agent/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<AiAgentResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}

  /**
   * Get public AI agents by page
   */
  async listPublic(data: AiAgentQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<AiAgentResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/agent/list_public`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/agent/list_public`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<AiAgentResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listPublic 请求失败:', error);
    throw error instanceof Error ? error : new Error('listPublic 请求发生错误');
  }
}
}
