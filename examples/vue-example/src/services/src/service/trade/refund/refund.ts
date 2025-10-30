/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  RefundParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  RefundResponse
} from 'sdkwork-sdk-api-typescript';

import { TradeRefundManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { RefundVO } from './types';
/**
 * TradeRefund API接口实现
 */
export class TradeRefundService extends BaseService<TradeRefundManager, RefundParam, RefundVO> {

   constructor() {
      super(ManagerFactory.create(TradeRefundManager));
   }
}
