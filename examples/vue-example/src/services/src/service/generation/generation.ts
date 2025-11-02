/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:28:23 CST 2025
 */

import type { Page, Pageable, SdkRequestOptions } from 'sdkwork-commons-typescript';
import { BaseService } from 'sdkwork-commons-typescript';
import type {
  AiGenerationParam
} from 'sdkwork-sdk-api-typescript';

import type {
  QueryListParam,
  QueryParam
} from 'sdkwork-sdk-api-typescript';

import type {
  AiGenerationResponse
} from 'sdkwork-sdk-api-typescript';

import { GenerationManager } from 'sdkwork-sdk-manager-typescript';
import { ManagerFactory } from "@/services/src/factory";
import type { AiGenerationVO } from './types';
import { getMockGenerations, getMockGenerationById } from '@/stores/modules/generation/mock-data';

/**
 * Generation API接口实现
 */
export class GenerationService extends BaseService<GenerationManager, AiGenerationParam, AiGenerationVO> {

   private useMockData = true; // 设置为true使用mock数据，false使用真实API

   constructor() {
      super(ManagerFactory.create(GenerationManager));
   }

   /**
    * 获取生成记录列表（支持mock模式）
    */
   async list(data: any, pageableParams?: Pageable): Promise<Page<any>> {
      if (this.useMockData) {
         const pageNumber = pageableParams?.pageNumber || 0;
         const pageSize = pageableParams?.pageSize || 10;
         const type = data?.type || 'all';
         
         // 获取所有mock数据
         const allGenerations = getMockGenerations(pageNumber, pageSize) as any;
         
         // 根据类型过滤数据
         if (type !== 'all') {
            const filteredContent = allGenerations.content.filter((item: any) => {
               // 处理类型映射
               if (type === 'promotion' && item.type === 'promotion') return true;
               if (type === 'shortVideo' && item.type === 'shortVideo') return true;
               if (type === 'portrait' && item.type === 'portrait') return true;
               if (type === 'image' && item.type === 'image') return true;
               if (type === 'video' && item.type === 'video') return true;
               if (type === 'music' && item.type === 'music') return true;
               if (type === 'voice' && item.type === 'voice') return true;
               return false;
            });
            
            return {
               ...allGenerations,
               content: filteredContent,
               totalElements: filteredContent.length,
               numberOfElements: filteredContent.length
            };
         }
         
         return allGenerations;
      }
      
      return super.listByPage(data, pageableParams);
   }

   /**
    * 获取生成记录详情（支持mock模式）
    */
   async get(id: string): Promise<any> {
      if (this.useMockData) {
         const generation = getMockGenerationById(id);
         if (!generation) {
            throw new Error(`生成记录 ${id} 不存在`);
         }
         return generation;
      }
      
      return super.retrieve(id);
   }

   /**
    * 创建生成记录（支持mock模式）
    */
   async create(data: any): Promise<any> {
      if (this.useMockData) {
         // 模拟创建成功，返回一个mock数据
         const mockGeneration = {
            id: `gen-${Date.now()}`,
            type: data.type || 'image',
            title: data.title || '新生成记录',
            description: data.description || '',
            status: 'completed',
            createdAt: new Date().toISOString(),
            result: {
               url: this.getMockResultUrl(data.type),
               thumbnail: this.getMockThumbnailUrl(data.type),
               prompt: data.prompt || '默认提示词',
               model: data.model || 'default-model',
               ...data
            }
         };
         
         // 模拟异步延迟
         await new Promise(resolve => setTimeout(resolve, 1000));
         
         return mockGeneration;
      }
      
      return super.create(data);
   }

   /**
    * 删除生成记录（支持mock模式）
    */
   async delete(id: string): Promise<any> {
      if (this.useMockData) {
         // 模拟删除成功
         await new Promise(resolve => setTimeout(resolve, 500));
         return true;
      }
      
      return super.delete(id);
   }

   /**
    * 设置是否使用mock数据
    */
   setMockMode(useMock: boolean) {
      this.useMockData = useMock;
   }

   /**
    * 获取mock结果URL
    */
   private getMockResultUrl(type: string): string {
      const randomId = Math.floor(Math.random() * 1000);
      switch (type) {
         case 'image':
            return `https://picsum.photos/400/300?random=${randomId}`;
         case 'video':
            return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
         case 'music':
         case 'voice':
            return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
         default:
            return `https://picsum.photos/400/300?random=${randomId}`;
      }
   }

   /**
    * 获取mock缩略图URL
    */
   private getMockThumbnailUrl(type: string): string {
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/200/150?random=${randomId}`;
   }
}
