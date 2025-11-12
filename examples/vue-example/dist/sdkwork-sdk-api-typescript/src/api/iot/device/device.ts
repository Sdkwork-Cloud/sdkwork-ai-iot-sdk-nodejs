/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 12 10:08:22 CST 2025
 */

import type { ApiResult, SdkRequestOptions, SdkResponse, Page, Pageable } from 'sdkwork-commons-typescript';
import { BaseSdkApi } from 'sdkwork-commons-typescript';
import type {
  IotDeviceParam
} from '../../../types/thing';

import type {
  QueryListParam,
  QueryParam
} from '../../../types/common';

import type {
  IotDeviceResponse,
  IotDeviceActivateResponse
} from '../../../types/thing';

/**
 * Device API接口实现
 */
export class DeviceApi extends BaseSdkApi {

  /**
   * Create IoT Device
   */
  async create(data: IotDeviceParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<IotDeviceResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/iot/device`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/iot/device`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<IotDeviceResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('create 请求失败:', error);
    throw error instanceof Error ? error : new Error('create 请求发生错误');
  }
}

  /**
   * Update IoT Device
   */
  async update(data: IotDeviceParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<IotDeviceResponse>>>  {
  try {
    const url = `${this.getBasePath(options)}/iot/device`;

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
    const response = await this._client.put<ApiResult<IotDeviceResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('update 请求失败:', error);
    throw error instanceof Error ? error : new Error('update 请求发生错误');
  }
}

  /**
   * Get IoT Device by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<IotDeviceResponse>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/iot/device/${id}`;

    // 发送GET请求
    const response = await this._client.get<ApiResult<IotDeviceResponse>>(
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
   * Delete IoT Device
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Boolean>>> {
  try {
    // 构建请求URL
    const url = `${this.getBasePath(options)}/iot/device/${id}`;

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
   * List All IoT Devices
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<IotDeviceResponse[]>>> {
  try {
    const url = `${this.getBasePath(options)}/iot/device/list/all`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/iot/device/list/all`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<IotDeviceResponse[]>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listAllEntities 请求失败:', error);
    throw error instanceof Error ? error : new Error('listAllEntities 请求发生错误');
  }
}

  /**
   * 激活IoT设备
   */
  async activateByCode(queryParams?: { code: string }, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<IotDeviceActivateResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/iot/device/activate_by_code`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/iot/device/activate_by_code`,
      method: 'POST',
      queryParams: queryParams,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<IotDeviceActivateResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('activateByCode 请求失败:', error);
    throw error instanceof Error ? error : new Error('activateByCode 请求发生错误');
  }
}

  /**
   * List IoT Devices by Page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<Page<IotDeviceResponse>>>> {
  try {
    const url = `${this.getBasePath(options)}/iot/device/list`;

    pageableParams = this.getQueryParams(pageableParams, options);

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/iot/device/list`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      queryParams: pageableParams,
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<Page<IotDeviceResponse>>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('listByPage 请求失败:', error);
    throw error instanceof Error ? error : new Error('listByPage 请求发生错误');
  }
}

  /**
   * 激活IoT设备
   */
  async activate(id: string, queryParams?: { code: string }, options?: SdkRequestOptions): Promise<SdkResponse<ApiResult<IotDeviceActivateResponse>>> {
  try {
    const url = `${this.getBasePath(options)}/iot/device/${id}/activate`;

    // 构建请求参数
    const requestOptions: SdkRequestOptions = {
      ...options,
      url: `${this.getBasePath(options)}/iot/device/${id}/activate`,
      method: 'POST',
      queryParams: queryParams,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    };

    // 发送POST请求
    const response = await this._client.post<ApiResult<IotDeviceActivateResponse>>(url, requestOptions);

    return response;
  } catch (error) {
    // 错误处理
    console.error('activate 请求失败:', error);
    throw error instanceof Error ? error : new Error('activate 请求发生错误');
  }
}
}
