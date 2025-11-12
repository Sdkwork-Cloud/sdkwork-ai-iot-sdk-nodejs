/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  OrderParam
} from '../../../types/trade';

import type {
  QueryListParam,
  QueryParam
} from '../../../types/common';

import type {
  OrderResponse
} from '../../../types/trade';

import type {
  OrderCancelResponse,
  OrderCompleteResponse,
  OrderCloseResponse,
  OrderShipResponse,
  OrderConfirmResponse
} from '../../../types/order';

import { ItemApi } from './item';
/**
 * Order API接口实现
 */
export class OrderApi extends BaseSdkApi {
  item: ItemApi = new ItemApi(this._client);

  /**
   * Create a new order
   */
  async create(data: OrderParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<OrderResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing order
   */
  async update(data: OrderParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/trade/order`;

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
    const response = await this._client.put<ApiResult<OrderResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get an order by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/trade/order/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<OrderResponse>>(
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
   * Delete an order
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/trade/order/${id}`;

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
   * Get all orders
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<OrderResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Cancel an order
   */
  async cancelOrder(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderCancelResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order/${id}/cancel`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order/${id}/cancel`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<OrderCancelResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('cancelOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('cancelOrder 请求发生错误');
  }
}

  /**
   * Confirm an order
   */
  async confirmOrder(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderConfirmResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order/${id}/confirm`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order/${id}/confirm`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<OrderConfirmResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('confirmOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('confirmOrder 请求发生错误');
  }
}

  /**
   * Complete an order
   */
  async completeOrder(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderCompleteResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order/${id}/complete`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order/${id}/complete`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<OrderCompleteResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('completeOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('completeOrder 请求发生错误');
  }
}

  /**
   * Get orders by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<OrderResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<OrderResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}

  /**
   * Close an order
   */
  async closeOrder(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderCloseResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order/${id}/close`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order/${id}/close`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<OrderCloseResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('closeOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('closeOrder 请求发生错误');
  }
}

  /**
   * Ship an order
   */
  async shipOrder(data: any, id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<OrderShipResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/order/${id}/ship`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/order/${id}/ship`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<OrderShipResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('shipOrder 请求失败:', error);
    throw error instanceof Error ? error : new Error('shipOrder 请求发生错误');
  }
}
}
