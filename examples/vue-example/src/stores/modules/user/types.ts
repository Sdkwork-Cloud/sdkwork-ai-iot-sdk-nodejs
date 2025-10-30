// ==================== 用户 Store 类型定义 ====================

import type { UserVO } from "@/services/src/service/user/types";
import type { QueryListParam, SdkRequestOptions } from 'sdkwork-commons-typescript';

// ==================== 基础类型定义 ====================

/**
 * 用户状态枚举
 */
export enum UserStateEnum {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * 用户设置接口
 */
export interface UserSettings {
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
}

/**
 * 用户统计数据接口
 */
export interface UserStats {
  total_conversations: number;
  total_messages: number;
  total_devices: number;
  total_agents: number;
  online_time: number;
  last_active: string | null;
}

/**
 * 用户操作参数接口
 */
export interface UserOperationParams {
  userId?: string | number;
  userData?: any;
  queryParams?: QueryListParam;
  pageableParams?: any;
  options?: SdkRequestOptions;
}

// ==================== Store 类型定义 ====================

/**
 * 用户 Store 状态接口
 */
export interface UserStoreState {
  // 基础状态
  state: UserStateEnum;
  errorMessage: string;
  initialized: boolean;

  // 用户信息
  currentUser: UserVO | null;

  // 用户设置
  userSettings: UserSettings;

  // 统计数据
  stats: UserStats;

  // UI 状态
  profileDialogVisible: boolean;
  settingsDialogVisible: boolean;
  editDialogVisible: boolean;

  // 私有状态（不会被响应式监听）
  _userService: any;
}

/**
 * 用户 Store 操作接口
 */
export interface UserStoreActions {
  // 用户基础操作
  createUser: (params: UserOperationParams) => Promise<UserVO | null>;
  updateUser: (params: UserOperationParams) => Promise<UserVO | null>;
  getUserDetail: (params: UserOperationParams) => Promise<UserVO | null>;
  deleteUser: (params: UserOperationParams) => Promise<boolean>;
  getUserList: (params: UserOperationParams) => Promise<any>;
  getAllUsers: (params: UserOperationParams) => Promise<UserVO[]>;

  // 用户状态操作
  setCurrentUser: (user: UserVO | null) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;

  // UI 操作
  toggleProfileDialog: (show?: boolean) => void;
  toggleSettingsDialog: (show?: boolean) => void;
  toggleEditDialog: (show?: boolean) => void;

  // 错误处理
  setError: (message: string) => void;
  clearError: () => void;
  clearState: () => void;
}

/**
 * 用户 Store Getters 接口
 */
export interface UserStoreGetters {
  // 状态检查
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;

  // 用户信息相关
  hasCurrentUser: boolean;
  userDisplayName: string;
  userInitials: string;

  // 设置相关
  isDarkTheme: boolean;
  isLightTheme: boolean;
  isAutoTheme: boolean;

  // 统计相关
  hasStats: boolean;
  formattedOnlineTime: string;
}

/**
 * 用户 Store 完整接口
 */
export interface UserStore extends UserStoreState, UserStoreActions, UserStoreGetters {}

/**
 * 用户 Store 创建选项
 */
export interface UserStoreOptions {
  // 初始配置
  initialSettings?: Partial<UserSettings>;
  
  // 持久化选项
  persist?: boolean;
  persistKey?: string;
  
  // 事件回调
  onStateChange?: (state: UserStateEnum) => void;
  onUserChange?: (user: UserVO | null) => void;
  onError?: (error: Error) => void;
}