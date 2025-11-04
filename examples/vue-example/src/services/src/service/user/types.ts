/**
 * 自动生成的API接口实现
 * 生成时间: Thu Oct 23 01:01:22 CST 2025
 */

import type {
  UserResponse
} from 'sdkwork-sdk-api-typescript';

/**
 * 用户视图对象 - 扩展SDK的UserResponse，添加前端特定字段
 * 注意：UserResponse已包含roleNames、status等字段，避免重复定义
 */
export interface UserVO extends UserResponse { 
  
  // 前端显示字段（单个角色名称，用于简化显示）
  displayName?: string  
}
