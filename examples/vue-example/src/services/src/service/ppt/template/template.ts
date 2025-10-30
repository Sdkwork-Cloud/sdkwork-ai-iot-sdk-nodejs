/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  PptTemplateParam,
  PptTemplateRenderParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  PptTemplateResponse,
  PptTemplateSlideResponse
} from 'sdkwork-sdk-api-typescript';

import type {
  PptProject
} from 'sdkwork-sdk-api-typescript';

import { PptTemplateManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { PptTemplateVO, PptTemplateSlideVO } from './types';
/**
 * PptTemplate API接口实现
 */
export class PptTemplateService extends BaseService<PptTemplateManager, PptTemplateParam, PptTemplateVO> {

   constructor() {
      super(ManagerFactory.create(PptTemplateManager));
   }

  /**
   * Render PPT template
   */
  async render(data: PptTemplateRenderParam, options?: SdkRequestOptions): Promise<PptProject> {
    const response = await this.manager.render(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as PptProject;
  }

}
