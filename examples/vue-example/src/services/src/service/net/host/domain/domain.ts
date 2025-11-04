/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:03:58 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  HostDomainParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  HostDomainResponse
} from 'sdkwork-sdk-api-typescript';

import { NetHostDomainManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { HostDomainVO } from './types';
/**
 * NetHostDomain API接口实现
 */
export class NetHostDomainService extends BaseService<NetHostDomainManager, HostDomainParam, HostDomainVO> {

   constructor() {
      const manager = ManagerFactory.create(NetHostDomainManager);
      super(manager);
   }
}
