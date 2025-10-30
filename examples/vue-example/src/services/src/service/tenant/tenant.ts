/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  GetAccessTokenParam,
  TenantParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  TenantResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  TokenResult
} from 'sdkwork-sdk-api-typescript';

import { TenantManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { TenantVO } from './types';
/**
 * Tenant API接口实现
 */
export class TenantService extends BaseService<TenantManager, TenantParam, TenantVO> {

   constructor() {
      super(ManagerFactory.create(TenantManager));
   }

  /**
   * Get access tokens
   */
  async getAccessTokens(data: GetAccessTokenParam, options?: SdkRequestOptions): Promise<TokenResult[]> {
    const response = await this.manager.getAccessTokens(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as TokenResult[];
  }

}
