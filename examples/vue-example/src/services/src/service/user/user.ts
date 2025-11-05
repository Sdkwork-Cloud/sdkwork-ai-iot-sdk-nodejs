/**
 * 自动生成的API接口实现
 * 生成时间: Wed Nov 05 14:48:10 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  UserParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  UserResponse,
  UserProfileResponse
} from 'sdkwork-sdk-api-typescript';

import { UserManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { UserVO, UserProfileVO } from './types';
/**
 * User API接口实现
 */
export class UserService extends BaseService<UserManager, UserParam, UserVO> {

   constructor() {
      const manager = ManagerFactory.create(UserManager);
      super(manager);
   }

  /**
   * Get current user profile
   */
  async getProfile(options?: SdkRequestOptions): Promise<UserProfileVO> {
    const response = await this.manager.getProfile(options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as UserProfileVO;
  }

}
