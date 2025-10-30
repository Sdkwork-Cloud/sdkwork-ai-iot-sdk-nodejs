/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  OrderParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  OrderResponse
} from 'sdkwork-sdk-api-typescript';

import { TradeOrderManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OrderVO } from './types';
/**
 * TradeOrder API接口实现
 */
export class TradeOrderService extends BaseService<TradeOrderManager, OrderParam, OrderVO> {

   constructor() {
      super(ManagerFactory.create(TradeOrderManager));
   }
}
