/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  AttributeParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { AttributeManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AttributeVO } from './types';
/**
 * Attribute API接口实现
 */
export class AttributeService {
   attributeManager: AttributeManager;
   constructor() {
      this.attributeManager = ManagerFactory.create( AttributeManager );
   }

  /**
   * 创建商品分类属性
   */
  async create(data: AttributeParam, options?: SdkRequestOptions): Promise<AttributeVO> {
    const response = await this.attributeManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AttributeVO;
  }


  /**
   * 更新商品分类属性
   */
  async update(data: AttributeParam, options?: SdkRequestOptions): Promise<AttributeVO> {
    const response = await this.attributeManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AttributeVO;
  }


  /**
   * 通过ID获取商品分类属性
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<AttributeVO> {
    const response = await this.attributeManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AttributeVO;
  }


  /**
   * 删除商品分类属性
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.attributeManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * 分页获取商品分类属性
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<AttributeVO>> {
    const response = await this.attributeManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<AttributeVO>;
  }


  /**
   * 获取所有商品分类属性
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<AttributeVO[]> {
    const response = await this.attributeManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as AttributeVO[];
  }

}
