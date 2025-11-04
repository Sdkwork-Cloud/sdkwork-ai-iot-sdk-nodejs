/**
 * 自动生成的API接口实现
 * 生成时间: Tue Nov 04 20:47:33 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ShoppingCartParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ShoppingCartResponse
} from 'sdkwork-sdk-api-typescript';

import { TradeShoppingCartManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ShoppingCartVO } from './types';
/**
 * TradeShoppingCart API接口实现
 */
export class TradeShoppingCartService extends BaseService<TradeShoppingCartManager, ShoppingCartParam, ShoppingCartVO> {

   constructor() {
      const manager = ManagerFactory.create(TradeShoppingCartManager);
      super(manager);
   }
}
