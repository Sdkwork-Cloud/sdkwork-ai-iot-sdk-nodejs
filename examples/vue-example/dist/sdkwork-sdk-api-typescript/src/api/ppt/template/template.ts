/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  PptTemplateParam,
  PptTemplateRenderParam
} from '../../../types/ppt';

import type {
  QueryListParam,
  QueryParam
} from '../../../types/common';

import type {
  PptTemplateResponse,
  PptTemplateSlideResponse
} from '../../../types/ppt';

import type {
  PptProject
} from '../../../types/ppt';

import { ChatApi } from './chat';
import { SlideApi } from './slide';
/**
 * Template API接口实现
 */
export class TemplateApi extends BaseSdkApi {
  chat: ChatApi = new ChatApi(this._client);
  slide: SlideApi = new SlideApi(this._client);

  /**
   * Create a new PPT template
   */
  async create(data: PptTemplateParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PptTemplateResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/ppt/template`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/ppt/template`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<PptTemplateResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing PPT template
   */
  async update(data: PptTemplateParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PptTemplateResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/ppt/template`;

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
    const response = await this._client.put<ApiResult<PptTemplateResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a PPT template by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PptTemplateResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/ppt/template/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<PptTemplateResponse>>(
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
   * Delete a PPT template
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/ppt/template/${id}`;

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
   * Get all PPT templates
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PptTemplateResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/ppt/template/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/ppt/template/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<PptTemplateResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Get PPT templates by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<PptTemplateResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/ppt/template/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/ppt/template/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<PptTemplateResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}

  /**
   * Render PPT template
   */
  async render(data: PptTemplateRenderParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PptProject>>> {
  try {
    const url = `${this.getBasePath(options)}/ppt/template/render`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/ppt/template/render`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<PptProject>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('render 请求失败:', error);
    throw error instanceof Error ? error : new Error('render 请求发生错误');
  }
}
}
