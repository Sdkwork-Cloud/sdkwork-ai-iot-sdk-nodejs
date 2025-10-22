/**
 * 用户状态接口 - 只定义state数据结构
 */
import type { UserVO } from "@/services/src/service/user/types";

export interface UserState {
  // 基础状态
  loading: boolean;
  error: Error | null;
  initialized: boolean;

  // 用户信息
  currentUser: UserVO | null;
  userProfile: {
    avatar?: string;
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: {
      github?: string;
      twitter?: string;
      linkedin?: string;
    };
  } | null;

  // 用户设置
  userSettings: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisible: boolean;
      emailVisible: boolean;
      phoneVisible: boolean;
    };
  };

  // 统计数据
  stats: {
    total_conversations: number;
    total_messages: number;
    total_devices: number;
    total_agents: number;
    online_time: number;
    last_active: string | null;
  };
}