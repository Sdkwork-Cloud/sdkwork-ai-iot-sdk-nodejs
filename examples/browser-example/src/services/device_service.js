(function() {
    'use strict';
    
    // 设备服务类
    class DeviceService {
        constructor() {
            this.baseUrl = '/api/devices';
        }
        
        /**
         * 获取设备列表
         * @param {Object} params - 查询参数
         * @returns {Promise<Object>} 设备列表
         */
        async getDevices(params = {}) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取设备列表失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接',
                    data: []
                };
            }
        }
        
        /**
         * 获取设备详情
         * @param {string} deviceId - 设备ID
         * @returns {Promise<Object>} 设备详情
         */
        async getDevice(deviceId) {
            try {
                const response = await fetch(`${this.baseUrl}/${deviceId}`, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取设备详情失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 添加设备
         * @param {Object} deviceData - 设备数据
         * @returns {Promise<Object>} 添加结果
         */
        async addDevice(deviceData) {
            try {
                const response = await fetch(this.baseUrl, {
                    method: 'POST',
                    headers: this._getHeaders(),
                    body: JSON.stringify(deviceData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('添加设备失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 更新设备信息
         * @param {string} deviceId - 设备ID
         * @param {Object} deviceData - 设备数据
         * @returns {Promise<Object>} 更新结果
         */
        async updateDevice(deviceId, deviceData) {
            try {
                const response = await fetch(`${this.baseUrl}/${deviceId}`, {
                    method: 'PUT',
                    headers: this._getHeaders(),
                    body: JSON.stringify(deviceData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('更新设备失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 删除设备
         * @param {string} deviceId - 设备ID
         * @returns {Promise<Object>} 删除结果
         */
        async deleteDevice(deviceId) {
            try {
                const response = await fetch(`${this.baseUrl}/${deviceId}`, {
                    method: 'DELETE',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('删除设备失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 控制设备
         * @param {string} deviceId - 设备ID
         * @param {string} action - 控制动作
         * @param {Object} params - 控制参数
         * @returns {Promise<Object>} 控制结果
         */
        async control(deviceId, action, params = {}) {
            try {
                const response = await fetch(`${this.baseUrl}/${deviceId}/control`, {
                    method: 'POST',
                    headers: this._getHeaders(),
                    body: JSON.stringify({ action, ...params })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('设备控制失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 获取设备状态
         * @param {string} deviceId - 设备ID
         * @returns {Promise<Object>} 设备状态
         */
        async getDeviceStatus(deviceId) {
            try {
                const response = await fetch(`${this.baseUrl}/${deviceId}/status`, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取设备状态失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 获取设备统计数据
         * @param {string} deviceId - 设备ID
         * @param {string} period - 统计周期
         * @returns {Promise<Object>} 统计数据
         */
        async getDeviceStats(deviceId, period = 'day') {
            try {
                const response = await fetch(`${this.baseUrl}/${deviceId}/stats?period=${period}`, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取设备统计失败:', error);
                return {
                    success: false,
                    message: '网络错误，请检查连接'
                };
            }
        }
        
        /**
         * 获取设备历史数据
         * @param {string} deviceId - 设备ID
         * @param {Object} params - 查询参数
         * @returns {Promise<Object>} 历史数据
         */
        async getDeviceHistory(deviceId, params = {}) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const url = `${this.baseUrl}/${deviceId}/history?${queryString}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取设备历史数据失败:', error);
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
    }
    
    // 全局注册设备服务
    window.deviceService = new DeviceService();
    
})();