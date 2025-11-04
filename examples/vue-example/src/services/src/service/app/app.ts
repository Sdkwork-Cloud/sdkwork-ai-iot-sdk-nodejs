/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:20:26 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CreateJsapiSignatureParam,
  AppParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AppSdkConfigResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  AppResponse,
  AppInfoResponse
} from 'sdkwork-sdk-api-typescript';

import { AppManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AppVO, AppInfoVO, AppSdkConfigVO } from './types';
/**
 * App API接口实现
 */
export class AppService extends BaseService<AppManager, AppParam, AppVO> {

   constructor() {
      const manager = ManagerFactory.create(AppManager);
      super(manager);
   }

  /**
   * 获取应用SDK配置
   */
  async getSdkConfig(data: CreateJsapiSignatureParam, options?: SdkRequestOptions): Promise<AppSdkConfigVO> {
    const response = await this.manager.getSdkConfig(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AppSdkConfigVO;
  }


  /**
   * 获取应用信息
   */
  async getAppInfo(options?: SdkRequestOptions): Promise<AppInfoVO> {
    const response = await this.manager.getAppInfo(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AppInfoVO;
  }

}
