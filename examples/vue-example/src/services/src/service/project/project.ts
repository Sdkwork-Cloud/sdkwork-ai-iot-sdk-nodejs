/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  ProjectParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  ProjectResponse
} from 'sdkwork-sdk-api-typescript';

import { ProjectManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { ProjectVO } from './types';
/**
 * Project API接口实现
 */
export class ProjectService extends BaseService<ProjectManager, ProjectParam, ProjectVO> {

   constructor() {
      super(ManagerFactory.create(ProjectManager));
   }
}
