/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  PaymentStatusQueryParam,
  PaymentCancelParam,
  PaymentParam,
  RefundParam
} from '../../../types/trade';

import type {
  QueryListParam,
  QueryParam
} from '../../../types/common';

import type {
  PaymentResponse
} from '../../../types/trade';

/**
 * Payment API接口实现
 */
export class PaymentApi extends BaseSdkApi {

  /**
   * Create a new payment record
   */
  async create(data: PaymentParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PaymentResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/payment`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/payment`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<PaymentResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update an existing payment record
   */
  async update(data: PaymentParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PaymentResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/trade/payment`;

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
    const response = await this._client.put<ApiResult<PaymentResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get a payment record by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PaymentResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/trade/payment/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<PaymentResponse>>(
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
   * Delete a payment record
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/trade/payment/${id}`;

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
   * Get all payment records
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<PaymentResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/payment/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/payment/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<PaymentResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * Cancel payment
   */
  async cancelPayment(data: PaymentCancelParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/payment/cancel`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/payment/cancel`,
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
    console.error('cancelPayment 请求失败:', error);
    throw error instanceof Error ? error : new Error('cancelPayment 请求发生错误');
  }
}

  /**
   * Check payment status
   */
  async checkPaymentStatus(data: PaymentStatusQueryParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/payment/status`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/payment/status`,
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
    console.error('checkPaymentStatus 请求失败:', error);
    throw error instanceof Error ? error : new Error('checkPaymentStatus 请求发生错误');
  }
}

  /**
   * Refund payment
   */
  async refundPayment(data: RefundParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/payment/refund`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/payment/refund`,
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
    console.error('refundPayment 请求失败:', error);
    throw error instanceof Error ? error : new Error('refundPayment 请求发生错误');
  }
}

  /**
   * Get payment records by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<PaymentResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/trade/payment/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/trade/payment/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<PaymentResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}
}
