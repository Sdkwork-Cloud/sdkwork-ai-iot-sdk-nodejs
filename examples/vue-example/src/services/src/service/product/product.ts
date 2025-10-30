/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ProductParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ProductResponse
} from 'sdkwork-sdk-api-typescript';

import { ProductManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ProductVO } from './types';
/**
 * Product API接口实现
 */
export class ProductService extends BaseService<ProductManager, ProductParam, ProductVO> {

   constructor() {
      super(ManagerFactory.create(ProductManager));
   }
}
