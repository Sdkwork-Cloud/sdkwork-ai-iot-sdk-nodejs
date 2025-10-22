/**
 * 自动生成的API接口实现
 * 生成时间: Sat Oct 18 12:19:43 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import type {
  ProjectParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import { ProjectManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ProjectVO } from './types';
/**
 * Project API接口实现
 */
export class ProjectService {
   projectManager: ProjectManager;
   constructor() {
      this.projectManager = ManagerFactory.create( ProjectManager );
   }

  /**
   * Create a new project
   */
  async create(data: ProjectParam, options?: SdkRequestOptions): Promise<ProjectVO> {
    const response = await this.projectManager.create(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProjectVO;
  }


  /**
   * Update an existing project
   */
  async update(data: ProjectParam, options?: SdkRequestOptions): Promise<ProjectVO> {
    const response = await this.projectManager.update(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProjectVO;
  }


  /**
   * Get a project by ID
   */
  async retrieve(id: number|string, options?: SdkRequestOptions): Promise<ProjectVO> {
    const response = await this.projectManager.retrieve(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProjectVO;
  }


  /**
   * Delete a project
   */
  async delete(id: number|string, options?: SdkRequestOptions): Promise<Boolean> {
    const response = await this.projectManager.delete(id, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Boolean;
  }


  /**
   * Get projects by page
   */
  async listByPage(data: QueryListParam, pageableParams?: {  }&Pageable, options?: SdkRequestOptions): Promise<Page<ProjectVO>> {
    const response = await this.projectManager.listByPage(data, pageableParams, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as Page<ProjectVO>;
  }


  /**
   * Get all projects
   */
  async listAllEntities(data: QueryListParam, options?: SdkRequestOptions): Promise<ProjectVO[]> {
    const response = await this.projectManager.listAllEntities(data, options);
    if(response == null || response.data == null){
      return Promise.reject(new Error("data error!"));
    }
    return response.data as ProjectVO[];
  }

}
