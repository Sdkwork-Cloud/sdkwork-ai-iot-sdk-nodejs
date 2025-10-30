// ==================== 用户 Store 实现 ====================

import { defineStore } from 'pinia'
import { UserService } from '@/services/src/service/user/user'
import {
    UserStoreState,
    UserStoreActions,
    UserStoreGetters,
    UserStateEnum,
    UserSettings,
    UserStats,
    UserOperationParams
} from './types'
import type { UserVO } from '@/services/src/service/user/types'

// 默认设置
const DEFAULT_SETTINGS: UserSettings = {
    theme: 'auto',
    language: 'zh-CN',
    notifications: {
        email: true,
        push: true,
        sms: false
    },
    privacy: {
        profileVisible: true,
        emailVisible: false,
        phoneVisible: false
    }
}

// 默认统计
const DEFAULT_STATS: UserStats = {
    total_conversations: 0,
    total_messages: 0,
    total_devices: 0,
    total_agents: 0,
    online_time: 0,
    last_active: null
}
 

export const useUserStore = defineStore('user', {
    // ==================== State ====================
    state: (): UserStoreState|any => ({
        state: UserStateEnum.IDLE,
        errorMessage: '',
        initialized: false,
        currentUser: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            email: '<EMAIL>',
            phone: '13800138000',
            uuid: window.$uuid()
        },
        userSettings: { ...DEFAULT_SETTINGS },
        stats: { ...DEFAULT_STATS },
        profileDialogVisible: false,
        settingsDialogVisible: false,
        editDialogVisible: false,

        // 私有状态
        _userService: new UserService()
    }),

    // ==================== Getters ====================
    getters: {
        // 状态检查
        isLoading: (state) => state.state === UserStateEnum.LOADING,
        isSuccess: (state) => state.state === UserStateEnum.SUCCESS,
        isError: (state) => state.state === UserStateEnum.ERROR,
        isIdle: (state) => state.state === UserStateEnum.IDLE,

        // 用户信息相关
        hasCurrentUser: (state) => state.currentUser !== null,

        userDisplayName: (state) => {
            if (!state.currentUser) return '未登录用户'
            return state.currentUser.nickname || state.currentUser.username || '匿名用户'
        },

        userInitials: (state) => {
            if (!state.currentUser) return '?'
            const name = state.currentUser.nickname || state.currentUser.username || ''
            return name.slice(0, 2).toUpperCase()
        },

        // 设置相关
        isDarkTheme: (state) => state.userSettings.theme === 'dark',
        isLightTheme: (state) => state.userSettings.theme === 'light',
        isAutoTheme: (state) => state.userSettings.theme === 'auto',

        // 统计相关
        hasStats: (state) => {
            return state.stats.total_conversations > 0 ||
                state.stats.total_messages > 0 ||
                state.stats.total_devices > 0 ||
                state.stats.total_agents > 0
        },

        formattedOnlineTime: (state) => {
            const hours = Math.floor(state.stats.online_time / 3600)
            const minutes = Math.floor((state.stats.online_time % 3600) / 60)
            return `${hours}小时${minutes}分钟`
        }
    },

    // ==================== Actions ====================
    actions: {
        // 用户基础操作
        async createUser(params: UserOperationParams) {
            this.state = UserStateEnum.LOADING
            this.errorMessage = ''

            try {
                const result = await this._userService.create(params.userData!, params.options)

                // 如果创建的是当前用户，更新状态
                if (this.currentUser?.id === result.id) {
                    this.currentUser = result
                }

                this.state = UserStateEnum.SUCCESS
                return result
            } catch (error) {
                this.state = UserStateEnum.ERROR
                this.errorMessage = error instanceof Error ? error.message : '创建用户失败'
                console.error('Create user failed:', error)
                return null
            }
        },

        async updateUser(params: UserOperationParams) {
            this.state = UserStateEnum.LOADING
            this.errorMessage = ''

            try {
                const result = await this._userService.update(params.userData!, params.options)

                // 更新当前用户信息
                if (this.currentUser?.id === result.id) {
                    this.currentUser = result
                }

                this.state = UserStateEnum.SUCCESS
                return result
            } catch (error) {
                this.state = UserStateEnum.ERROR
                this.errorMessage = error instanceof Error ? error.message : '更新用户失败'
                console.error('Update user failed:', error)
                return null
            }
        },

        async getUserDetail(params: UserOperationParams) {
            this.state = UserStateEnum.LOADING
            this.errorMessage = ''

            try {
                const result = await this._userService.retrieve(params.userId!, params.options)

                // 如果是当前用户，更新状态
                if (this.currentUser?.id === result.id) {
                    this.currentUser = result
                }

                this.state = UserStateEnum.SUCCESS
                return result
            } catch (error) {
                this.state = UserStateEnum.ERROR
                this.errorMessage = error instanceof Error ? error.message : '获取用户详情失败'
                console.error('Get user detail failed:', error)
                return null
            }
        },

        async deleteUser(params: UserOperationParams) {
            this.state = UserStateEnum.LOADING
            this.errorMessage = ''

            try {
                const result = await this._userService.delete(params.userId!, params.options)

                // 如果删除的是当前用户，清空状态
                if (this.currentUser?.id === params.userId) {
                    this.currentUser = null
                }

                this.state = UserStateEnum.SUCCESS
                return result
            } catch (error) {
                this.state = UserStateEnum.ERROR
                this.errorMessage = error instanceof Error ? error.message : '删除用户失败'
                console.error('Delete user failed:', error)
                return false
            }
        },

        async getUserList(params: UserOperationParams) {
            this.state = UserStateEnum.LOADING
            this.errorMessage = ''

            try {
                const result = await this._userService.listByPage(
                    params.queryParams!,
                    params.pageableParams,
                    params.options
                )

                this.state = UserStateEnum.SUCCESS
                return result
            } catch (error) {
                this.state = UserStateEnum.ERROR
                this.errorMessage = error instanceof Error ? error.message : '获取用户列表失败'
                console.error('Get user list failed:', error)
                return null
            }
        },

        // 用户状态操作
        setCurrentUser(user: UserVO | null) {
            this.currentUser = user

            // 标记为已初始化
            if (user) {
                this.initialized = true
            }
        },

        updateUserSettings(settings: Partial<UserSettings>) {
            this.userSettings = {
                ...this.userSettings,
                ...settings
            }
        },

        updateUserStats(stats: Partial<UserStats>) {
            this.stats = {
                ...this.stats,
                ...stats
            }
        },

        // UI 操作
        toggleProfileDialog(show?: boolean) {
            this.profileDialogVisible = show !== undefined ? show : !this.profileDialogVisible
        },

        toggleSettingsDialog(show?: boolean) {
            this.settingsDialogVisible = show !== undefined ? show : !this.settingsDialogVisible
        },

        toggleEditDialog(show?: boolean) {
            this.editDialogVisible = show !== undefined ? show : !this.editDialogVisible
        },

        // 错误处理
        setError(message: string) {
            this.errorMessage = message
            this.state = UserStateEnum.ERROR
        },

        clearError() {
            this.errorMessage = ''
            if (this.state === UserStateEnum.ERROR) {
                this.state = UserStateEnum.IDLE
            }
        },

        clearState() {
            this.state = UserStateEnum.IDLE
            this.errorMessage = ''
            this.initialized = false
            this.currentUser = null
            this.userSettings = { ...DEFAULT_SETTINGS }
            this.stats = { ...DEFAULT_STATS }
            this.profileDialogVisible = false
            this.settingsDialogVisible = false
            this.editDialogVisible = false
        }
    }
})

// 导出类型
export type { UserStore } from './types'