/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  CommentsParam,
  CommentsReplyParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  CommentsResponse
} from 'sdkwork-sdk-api-typescript';

import { CommentsManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { CommentsVO } from './types';
/**
 * Comments API接口实现
 */
export class CommentsService extends BaseService<CommentsManager, CommentsParam, CommentsVO> {

   constructor() {
      super(ManagerFactory.create(CommentsManager));
   }

  /**
   * Reply to a comment
   */
  async reply(data: CommentsReplyParam, id: number|string, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.manager.reply(data, id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }


  /**
   * Like a comment
   */
  async like(id: number|string, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.manager.like(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }


  /**
   * Unlike a comment
   */
  async unlike(id: number|string, options?: SdkRequestOptions): Promise<CommentsVO> {
    const response = await this.manager.unlike(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as CommentsVO;
  }

}
