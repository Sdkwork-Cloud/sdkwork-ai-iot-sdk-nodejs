/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 10:05:24 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  DnsRecordParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  DnsRecordResponse
} from 'sdkwork-sdk-api-typescript';

import { NetDnsRecordManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { DnsRecordVO } from './types';
/**
 * NetDnsRecord API接口实现
 */
export class NetDnsRecordService extends BaseService<NetDnsRecordManager, DnsRecordParam, DnsRecordVO> {

   constructor() {
      const manager = ManagerFactory.create(NetDnsRecordManager);
      super(manager);
   }
}
