(function() {
    'use strict';
    
    // 用户服务类
    class UserService {
        constructor() {
            this.baseUrl = '/api/users';
        }
        
        /**
         * 获取用户信息
         * @returns {Promise<Object>} 用户信息
         */
        async getUserInfo() {
            try {
                const response = await fetch(`${this.baseUrl}/profile`, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取用户信息失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 更新用户资料
         * @param {Object} userData - 用户数据
         * @returns {Promise<Object>} 更新结果
         */
        async updateProfile(userData) {
            try {
                const response = await fetch(`${this.baseUrl}/profile`, {
                    method: 'PUT',
                    headers: this._getHeaders(),
                    body: JSON.stringify(userData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('更新用户资料失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 修改密码
         * @param {Object} passwordData - 密码数据
         * @returns {Promise<Object>} 修改结果
         */
        async changePassword(passwordData) {
            try {
                const response = await fetch(`${this.baseUrl}/password`, {
                    method: 'PUT',
                    headers: this._getHeaders(),
                    body: JSON.stringify(passwordData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('修改密码失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 上传头像
         * @param {File} file - 头像文件
         * @returns {Promise<Object>} 上传结果
         */
        async uploadAvatar(file) {
            try {
                const formData = new FormData();
                formData.append('avatar', file);
                
                const response = await fetch(`${this.baseUrl}/avatar`, {
                    method: 'POST',
                    headers: {
                        'Authorization': this._getAuthHeader()
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('上传头像失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 获取用户设备列表
         * @param {Object} params - 查询参数
         * @returns {Promise<Object>} 设备列表
         */
        async getUserDevices(params = {}) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const url = `${this.baseUrl}/devices?${queryString}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取用户设备列表失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 获取用户统计数据
         * @returns {Promise<Object>} 统计数据
         */
        async getUserStats() {
            try {
                const response = await fetch(`${this.baseUrl}/stats`, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取用户统计数据失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 获取请求头
         * @returns {Object} 请求头
         */
        _getHeaders() {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // 添加认证token
            const token = window.authService?.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            return headers;
        }
        
        /**
         * 获取认证头
         * @returns {string} 认证头
         */
        _getAuthHeader() {
            const token = window.authService?.getToken();
            return token ? `Bearer ${token}` : '';
        }
    }
    
    // 全局注册用户服务
    window.userService = new UserService();
    
})();