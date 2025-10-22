(function() {
    'use strict';
    
    // 使用全局Pinia和Vue对象
    const { defineStore } = Pinia;
    const { ref, computed } = Vue;
    
    // 定义认证状态管理Store
    const useAuthStore = defineStore('auth', () => {
        // 状态定义
        const user = ref(null);
        const token = ref(null);
        const isAuthenticated = ref(false);
        const loading = ref(false);
        const error = ref(null);
        
        // 计算属性
        const userInfo = computed(() => user.value);
        const isAdmin = computed(() => user.value?.role === 'admin');
        const isUser = computed(() => user.value?.role === 'user');
        
        // 从localStorage初始化状态
        const initializeFromStorage = () => {
            const storedToken = localStorage.getItem('sdkwork_auth_token');
            const storedUser = localStorage.getItem('sdkwork_user_info');
            
            if (storedToken) {
                token.value = storedToken;
                isAuthenticated.value = true;
            }
            
            if (storedUser) {
                user.value = JSON.parse(storedUser);
            }
        };
        
        // 异步操作
        const login = async (username, password) => {
            loading.value = true;
            error.value = null;
            
            try {
                const result = await window.authService.login(username, password);
                
                if (result.success) {
                    user.value = result.data.user;
                    token.value = result.data.token;
                    isAuthenticated.value = true;
                    
                    // 保存到localStorage
                    localStorage.setItem('sdkwork_auth_token', result.data.token);
                    localStorage.setItem('sdkwork_user_info', JSON.stringify(result.data.user));
                    
                    return { success: true };
                } else {
                    error.value = result.message;
                    return { success: false, message: result.message };
                }
            } catch (err) {
                error.value = err.message;
                return { success: false, message: err.message };
            } finally {
                loading.value = false;
            }
        };
        
        const register = async (userData) => {
            loading.value = true;
            error.value = null;
            
            try {
                const result = await window.authService.register(userData);
                
                if (result.success) {
                    return { success: true, message: '注册成功' };
                } else {
                    error.value = result.message;
                    return { success: false, message: result.message };
                }
            } catch (err) {
                error.value = err.message;
                return { success: false, message: err.message };
            } finally {
                loading.value = false;
            }
        };
        
        const logout = () => {
            user.value = null;
            token.value = null;
            isAuthenticated.value = false;
            error.value = null;
            
            // 清除localStorage
            localStorage.removeItem('sdkwork_auth_token');
            localStorage.removeItem('sdkwork_user_info');
            
            window.authService.logout();
        };
        
        const refreshToken = async () => {
            try {
                const result = await window.authService.refreshToken();
                
                if (result.success) {
                    token.value = result.data.token;
                    localStorage.setItem('sdkwork_auth_token', result.data.token);
                    return true;
                }
                return false;
            } catch (err) {
                console.error('刷新token失败:', err);
                return false;
            }
        };
        
        const validateToken = async () => {
            return await window.authService.validateToken();
        };
        
        const clearError = () => {
            error.value = null;
        };
        
        // 初始化
        initializeFromStorage();
        
        return {
            // 状态
            user,
            token,
            isAuthenticated,
            loading,
            error,
            
            // 计算属性
            userInfo,
            isAdmin,
            isUser,
            
            // 方法
            login,
            register,
            logout,
            refreshToken,
            validateToken,
            clearError,
            initializeFromStorage
        };
    });
    
    // 全局注册Store
    window.useAuthStore = useAuthStore;
    
})();