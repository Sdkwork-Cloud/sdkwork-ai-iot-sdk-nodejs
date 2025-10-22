(function() {
    'use strict';
    
    // 使用全局Pinia对象
    const { defineStore } = Pinia;
    
    // 用户状态管理Store
    const useUserStore = defineStore('user', {
        state: () => ({
            userInfo: {
                id: '',
                username: '',
                email: '',
                avatar: '',
                phone: '',
                nickname: '',
                bio: '',
                createTime: '',
                lastLoginTime: ''
            },
            userStats: {
                deviceCount: 0,
                onlineDeviceCount: 0,
                totalUsageTime: 0,
                messageCount: 0
            },
            loading: false,
            error: null
        }),
        
        getters: {
            // 用户是否已登录
            isAuthenticated: (state) => !!state.userInfo.id,
            
            // 用户显示名称
            displayName: (state) => state.userInfo.nickname || state.userInfo.username,
            
            // 用户注册时长
            registerDuration: (state) => {
                if (!state.userInfo.createTime) return '未知';
                const createTime = new Date(state.userInfo.createTime);
                const now = new Date();
                const diff = now - createTime;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                return `${days} 天`;
            }
        },
        
        actions: {
            /**
             * 获取用户信息
             */
            async fetchUserInfo() {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.userService.getUserInfo();
                    
                    if (result.success) {
                        this.userInfo = result.data || {};
                    } else {
                        throw new Error(result.message || '获取用户信息失败');
                    }
                } catch (error) {
                    console.error('获取用户信息失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 更新用户资料
             */
            async updateProfile(profileData) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.userService.updateProfile(profileData);
                    
                    if (result.success) {
                        // 更新本地用户信息
                        Object.assign(this.userInfo, profileData);
                        return result.data;
                    } else {
                        throw new Error(result.message || '更新用户资料失败');
                    }
                } catch (error) {
                    console.error('更新用户资料失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 修改密码
             */
            async changePassword(passwordData) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.userService.changePassword(passwordData);
                    
                    if (result.success) {
                        return result.data;
                    } else {
                        throw new Error(result.message || '修改密码失败');
                    }
                } catch (error) {
                    console.error('修改密码失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 上传头像
             */
            async uploadAvatar(file) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.userService.uploadAvatar(file);
                    
                    if (result.success) {
                        // 更新头像URL
                        if (result.data.avatarUrl) {
                            this.userInfo.avatar = result.data.avatarUrl;
                        }
                        return result.data;
                    } else {
                        throw new Error(result.message || '上传头像失败');
                    }
                } catch (error) {
                    console.error('上传头像失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 获取用户统计数据
             */
            async fetchUserStats() {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.userService.getUserStats();
                    
                    if (result.success) {
                        this.userStats = result.data || {};
                    } else {
                        throw new Error(result.message || '获取用户统计数据失败');
                    }
                } catch (error) {
                    console.error('获取用户统计数据失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 获取用户设备列表
             */
            async fetchUserDevices(params = {}) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.userService.getUserDevices(params);
                    
                    if (result.success) {
                        return result.data || [];
                    } else {
                        throw new Error(result.message || '获取用户设备列表失败');
                    }
                } catch (error) {
                    console.error('获取用户设备列表失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 清除用户信息（退出登录）
             */
            clearUserInfo() {
                this.userInfo = {
                    id: '',
                    username: '',
                    email: '',
                    avatar: '',
                    phone: '',
                    nickname: '',
                    bio: '',
                    createTime: '',
                    lastLoginTime: ''
                };
                this.userStats = {
                    deviceCount: 0,
                    onlineDeviceCount: 0,
                    totalUsageTime: 0,
                    messageCount: 0
                };
            },
            
            /**
             * 清除错误
             */
            clearError() {
                this.error = null;
            }
        }
    });
    
    // 全局注册Store
    window.useUserStore = useUserStore;
    
})();