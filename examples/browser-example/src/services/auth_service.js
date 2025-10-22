(function() {
    'use strict';
    
    // 认证服务类
    class AuthService {
        constructor() {
            this.baseUrl = '/api/auth';
            this.tokenKey = 'sdkwork_auth_token';
        }
        
        /**
         * 用户登录
         * @param {string} username - 用户名
         * @param {string} password - 密码
         * @returns {Promise<Object>} 登录结果
         */
        async login(username, password) {
            try {
                const response = await fetch(`${this.baseUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success && result.data?.token) {
                    // 保存token到localStorage
                    localStorage.setItem(this.tokenKey, result.data.token);
                    // 保存用户信息
                    localStorage.setItem('sdkwork_user_info', JSON.stringify(result.data.user));
                }
                
                return result;
            } catch (error) {
                console.error('登录请求失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 用户注册
         * @param {Object} userData - 用户注册数据
         * @returns {Promise<Object>} 注册结果
         */
        async register(userData) {
            try {
                const response = await fetch(`${this.baseUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('注册请求失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 用户登出
         */
        logout() {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem('sdkwork_user_info');
            window.location.href = '../../pages/auth/login.html';
        }
        
        /**
         * 获取当前用户token
         * @returns {string|null} token
         */
        getToken() {
            return localStorage.getItem(this.tokenKey);
        }
        
        /**
         * 检查用户是否已登录
         * @returns {boolean} 是否已登录
         */
        isLoggedIn() {
            const token = this.getToken();
            return !!token;
        }
        
        /**
         * 获取当前用户信息
         * @returns {Object|null} 用户信息
         */
        getCurrentUser() {
            const userInfo = localStorage.getItem('sdkwork_user_info');
            return userInfo ? JSON.parse(userInfo) : null;
        }
        
        /**
         * 刷新token
         * @returns {Promise<Object>} 刷新结果
         */
        async refreshToken() {
            try {
                const token = this.getToken();
                if (!token) {
                    return { success: false, message: '未登录' };
                }
                
                const response = await fetch(`${this.baseUrl}/refresh`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.success && result.data?.token) {
                    localStorage.setItem(this.tokenKey, result.data.token);
                }
                
                return result;
            } catch (error) {
                console.error('刷新token失败:', error);
                return {
                    success: false,
                    message: 'token刷新失败'
                };
            }
        }
        
        /**
         * 重置密码
         * @param {string} email - 邮箱
         * @returns {Promise<Object>} 重置结果
         */
        async resetPassword(email) {
            try {
                const response = await fetch(`${this.baseUrl}/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                    },
                    body: JSON.stringify({ email })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('重置密码请求失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 验证token有效性
         * @returns {Promise<boolean>} 是否有效
         */
        async validateToken() {
            try {
                const token = this.getToken();
                if (!token) return false;
                
                const response = await fetch(`${this.baseUrl}/validate`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                return response.ok;
            } catch (error) {
                console.error('验证token失败:', error);
                return false;
            }
        }
    }
    
    // 全局注册认证服务
    window.authService = new AuthService();
    
})();