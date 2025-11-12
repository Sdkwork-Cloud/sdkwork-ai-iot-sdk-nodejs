/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  CommentsParam,
  CommentsReplyParam
} from '../../types/comments';

import type {
  QueryListParam,
  QueryParam
} from '../../types/common';

import type {
  CommentsResponse
} from '../../types/comments';

/**
 * Comments API接口实现
 */
export class CommentsApi extends BaseSdkApi {

  /**
   * Create a new comment
   */
  async create(data: CommentsParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CommentsResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/comments`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/comments`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<CommentsResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing comment
   */
  async update(data: CommentsParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CommentsResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/comments`;

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
    const response = await this._client.put<ApiResult<CommentsResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a comment by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CommentsResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/comments/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<CommentsResponse>>(
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
   * Delete a comment
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/comments/${id}`;

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
   * Get all comments
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CommentsResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/comments/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/comments/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<CommentsResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get comments by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<CommentsResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/comments/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/comments/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<CommentsResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}

  /**
   * Reply to a comment
   */
  async reply(data: CommentsReplyParam, id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CommentsResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/comments/${id}/reply`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/comments/${id}/reply`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<CommentsResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('reply 请求失败:', error);
    throw error instanceof Error ? error : new Error('reply 请求发生错误');
  }
}

  /**
   * Unlike a comment
   */
  async unlike(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CommentsResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/comments/${id}/unlike`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/comments/${id}/unlike`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<CommentsResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('unlike 请求失败:', error);
    throw error instanceof Error ? error : new Error('unlike 请求发生错误');
  }
}

  /**
   * Like a comment
   */
  async like(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<CommentsResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/comments/${id}/like`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/comments/${id}/like`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<CommentsResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('like 请求失败:', error);
    throw error instanceof Error ? error : new Error('like 请求发生错误');
  }
}
}
