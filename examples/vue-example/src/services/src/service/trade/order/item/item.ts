/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  OrderItemParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  OrderItemResponse
} from 'sdkwork-sdk-api-typescript';

import { TradeOrderItemManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { OrderItemVO } from './types';
/**
 * TradeOrderItem API接口实现
 */
export class TradeOrderItemService extends BaseService<TradeOrderItemManager, OrderItemParam, OrderItemVO> {

   constructor() {
      super(ManagerFactory.create(TradeOrderItemManager));
   }
}
