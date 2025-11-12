/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  ConversationOpenParam,
  ConversationParam,
  ConversationQueryListParam,
  MessageFeedbackParam
} from '../../types/conversation';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  ConversationResponse
} from '../../types/conversation';

/**
 * Conversation API接口实现
 */
export class ConversationApi extends BaseSdkApi {

  /**
   * Create a new conversation
   */
  async create(data: ConversationParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ConversationResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/conversation`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/conversation`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<ConversationResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing conversation
   */
  async update(data: ConversationParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ConversationResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/conversation`;

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
    const response = await this._client.put<ApiResult<ConversationResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a conversation by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ConversationResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/conversation/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<ConversationResponse>>(
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
   * Delete a conversation
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/conversation/${id}`;

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
   * Get all open conversations
   */
  async open(data: ConversationOpenParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ConversationResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/conversation/open`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/conversation/open`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<ConversationResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('open 请求失败:', error);
    throw error instanceof Error ? error : new Error('open 请求发生错误');
  }
}

  /**
   * Get all conversations
   */
  async listAllEntities(data: ConversationQueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ConversationResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/conversation/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/conversation/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<ConversationResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Update an existing conversation
   */
  async messageFeedback(data: MessageFeedbackParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/conversation/message_feedback`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/conversation/message_feedback`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Boolean>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('messageFeedback 请求失败:', error);
    throw error instanceof Error ? error : new Error('messageFeedback 请求发生错误');
  }
}

  /**
   * Pin/Unpin a conversation
   */
  async pinConversation(id: number|string, queryParams?: { pined: boolean }, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<ConversationResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/conversation/${id}/pin`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/conversation/${id}/pin`,
      method: 'POST',
      queryParams: queryParams,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<ConversationResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('pinConversation 请求失败:', error);
    throw error instanceof Error ? error : new Error('pinConversation 请求发生错误');
  }
}

  /**
   * Get conversations by page
   */
  async listByPage(data: ConversationQueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<ConversationResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/conversation/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/conversation/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<ConversationResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}
}
