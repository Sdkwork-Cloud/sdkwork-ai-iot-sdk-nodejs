/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  OrganizationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  GetAccessTokenParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  OrganizationResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  TokenResult
} from 'sdkwork-sdk-api-typescript';

import { OrganizationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OrganizationVO } from './types';
/**
 * Organization API接口实现
 */
export class OrganizationService extends BaseService<OrganizationManager, OrganizationParam, OrganizationVO> {

   constructor() {
      super(ManagerFactory.create(OrganizationManager));
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
