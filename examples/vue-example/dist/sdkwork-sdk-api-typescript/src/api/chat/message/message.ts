/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  ChatMessageParam,
  ChatMessageQueryListParam
} from '../../../types/message';

import type {
  QueryListParam,
  QueryParam
} from '../../../types/common';

import type {
  ChatMessageResponse
} from '../../../types/message';

/**
 * Message API接口实现
 */
export class MessageApi extends BaseSdkApi {

  /**
   * Create a new chat message
   */
  async create(data: ChatMessageParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ChatMessageResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/chat/message`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/chat/message`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<ChatMessageResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing chat message
   */
  async update(data: ChatMessageParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ChatMessageResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/chat/message`;

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
    const response = await this._client.put<ApiResult<ChatMessageResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a chat message by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ChatMessageResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/chat/message/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<ChatMessageResponse>>(
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
   * Delete a chat message
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/chat/message/${id}`;

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
   * Get all chat messages
   */
  async listAllEntities(data: ChatMessageQueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ChatMessageResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/chat/message/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/chat/message/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<ChatMessageResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get chat messages by page
   */
  async listByPage(data: ChatMessageQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<ChatMessageResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/chat/message/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/chat/message/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<ChatMessageResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}

  /**
   * Get chat messages by page
   */
  async loadMore(data: ChatMessageQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<ChatMessageResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/chat/message/load_more`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/chat/message/load_more`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<ChatMessageResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('loadMore 请求失败:', error);
    throw error instanceof Error ? error : new Error('loadMore 请求发生错误');
  }
}
}
