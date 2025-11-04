import { defineStore } from 'pinia'
import type {  
  UserState, 
  CreateUserParams, 
  UpdateUserParams, 
  UserQueryParams, 
  UserPaginationResponse 
} from './types'
import { UserRole, UserStatus } from './types'
import { UserVO } from '@/services'

/**
 * 用户管理 Store
 * 专注于用户增删改查和profile管理，认证功能由auth store处理
 */
export const useUserStore = defineStore('user', {
  // ==================== State ====================
  state: (): UserState => ({
    // 当前登录用户
    currentUser: null,
    
    // 用户列表
    userList: [],
    
    // 当前查看的用户详情
    currentUserDetail: null,
    
    // 加载状态
    loading: false,
    
    // 错误信息
    error: null,
    
    // 分页信息
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0
    }
  }),

  // ==================== Getters ====================
  getters: {
    

    /**
     * 获取用户显示名称
     */
    displayName: (state): string => {
      if (!state.currentUser) return '未登录用户'
      return state.currentUser.nickname || state.currentUser.username  || '匿名用户'
    }, 

    /**
     * 检查是否有错误
     */
    hasError: (state): boolean => {
      return state.error !== null
    },
   
  },

  // ==================== Actions ====================
  actions: {
    /**
     * 设置当前登录用户
     */
    setCurrentUser(user: UserVO | null): void {
      this.currentUser = user
    },
 
    /**
     * 清除当前用户
     */
    clearCurrentUser(): void {
      this.currentUser = null
    },
 
  
    /**
     * 重置用户详情
     */
    resetUserDetail(): void {
      this.currentUserDetail = null
    },
  

    /**
     * 获取角色名称
     */
    getRoleName(role: UserRole): string {
      const roleNames = {
        [UserRole.SUPER_ADMIN]: '超级管理员',
        [UserRole.ADMIN]: '管理员',
        [UserRole.USER]: '普通用户',
        [UserRole.GUEST]: '访客'
      }
      return roleNames[role] || '未知角色'
    },

    /**
     * 获取状态名称
     */
    getStatusName(status: UserStatus): string {
      const statusNames = {
        [UserStatus.ACTIVE]: '活跃',
        [UserStatus.INACTIVE]: '未激活',
        [UserStatus.SUSPENDED]: '已暂停',
        [UserStatus.DELETED]: '已删除'
      }
      return statusNames[status] || '未知状态'
    },
 

    /**
     * 清空错误信息
     */
    clearError(): void {
      this.error = null
    },

    /**
     * 重置状态
     */
    reset(): void {
      this.userList = []
      this.currentUserDetail = null
      this.loading = false
      this.error = null
      this.pagination = {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0
      }
    }
  }
})