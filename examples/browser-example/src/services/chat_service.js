(function() {
    'use strict';
    
    // 聊天服务类
    class ChatService {
        constructor() {
            this.baseUrl = '/api/chat';
            this.wsUrl = 'ws://localhost:8080/chat';
            this.ws = null;
            this.messageCallbacks = new Map();
        }
        
        /**
         * 初始化WebSocket连接
         */
        initWebSocket() {
            return new Promise((resolve, reject) => {
                try {
                    this.ws = new WebSocket(this.wsUrl);
                    
                    this.ws.onopen = () => {
                        console.log('WebSocket连接已建立');
                        resolve();
                    };
                    
                    this.ws.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            this._handleMessage(data);
                        } catch (error) {
                            console.error('解析WebSocket消息失败:', error);
                        }
                    };
                    
                    this.ws.onclose = () => {
                        console.log('WebSocket连接已关闭');
                    };
                    
                    this.ws.onerror = (error) => {
                        console.error('WebSocket连接错误:', error);
                        reject(error);
                    };
                    
                } catch (error) {
                    console.error('初始化WebSocket失败:', error);
                    reject(error);
                }
            });
        }
        
        /**
         * 发送消息
         */
        async sendMessage(message) {
            try {
                // 如果WebSocket已连接，优先使用WebSocket
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    return this._sendViaWebSocket(message);
                } else {
                    // 否则使用HTTP API
                    return this._sendViaHttp(message);
                }
            } catch (error) {
                console.error('发送消息失败:', error);
                return {
                    success: false,
                    message: '发送消息失败'
                };
            }
        }
        
        /**
         * 通过WebSocket发送消息
         */
        _sendViaWebSocket(message) {
            return new Promise((resolve, reject) => {
                const messageId = this._generateMessageId();
                
                const messageData = {
                    id: messageId,
                    type: 'text',
                    content: message,
                    timestamp: new Date().toISOString()
                };
                
                // 注册回调
                this.messageCallbacks.set(messageId, { resolve, reject });
                
                // 设置超时
                const timeout = setTimeout(() => {
                    this.messageCallbacks.delete(messageId);
                    reject(new Error('消息发送超时'));
                }, 10000);
                
                // 发送消息
                this.ws.send(JSON.stringify(messageData));
                
                // 保存超时ID以便清理
                this.messageCallbacks.get(messageId).timeout = timeout;
            });
        }
        
        /**
         * 通过HTTP发送消息
         */
        async _sendViaHttp(message) {
            try {
                const response = await fetch(`${this.baseUrl}/message`, {
                    method: 'POST',
                    headers: this._getHeaders(),
                    body: JSON.stringify({
                        message: message,
                        type: 'text'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('HTTP发送消息失败:', error);
                throw error;
            }
        }
        
        /**
         * 上传图片
         */
        async uploadImage(file) {
            try {
                const formData = new FormData();
                formData.append('image', file);
                
                const response = await fetch(`${this.baseUrl}/upload/image`, {
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
                console.error('上传图片失败:', error);
                return {
                    success: false,
                    message: '上传图片失败'
                };
            }
        }
        
        /**
         * 上传语音
         */
        async uploadVoice(file) {
            try {
                const formData = new FormData();
                formData.append('voice', file);
                
                const response = await fetch(`${this.baseUrl}/upload/voice`, {
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
                console.error('上传语音失败:', error);
                return {
                    success: false,
                    message: '上传语音失败'
                };
            }
        }
        
        /**
         * 获取聊天历史
         */
        async getChatHistory(params = {}) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const url = `${this.baseUrl}/history?${queryString}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取聊天历史失败:', error);
                return {
                    success: false,
                    message: '获取聊天历史失败',
                    data: []
                };
            }
        }
        
        /**
         * 清除聊天记录
         */
        async clearChatHistory() {
            try {
                const response = await fetch(`${this.baseUrl}/history`, {
                    method: 'DELETE',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('清除聊天记录失败:', error);
                return {
                    success: false,
                    message: '清除聊天记录失败'
                };
            }
        }
        
        /**
         * 获取聊天设置
         */
        async getChatSettings() {
            try {
                const response = await fetch(`${this.baseUrl}/settings`, {
                    method: 'GET',
                    headers: this._getHeaders()
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('获取聊天设置失败:', error);
                return {
                    success: false,
                    message: '获取聊天设置失败'
                };
            }
        }
        
        /**
         * 更新聊天设置
         */
        async updateChatSettings(settings) {
            try {
                const response = await fetch(`${this.baseUrl}/settings`, {
                    method: 'PUT',
                    headers: this._getHeaders(),
                    body: JSON.stringify(settings)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('更新聊天设置失败:', error);
                return {
                    success: false,
                    message: '更新聊天设置失败'
                };
            }
        }
        
        /**
         * 处理WebSocket消息
         */
        _handleMessage(data) {
            const { id, type, content } = data;
            
            // 处理AI回复
            if (type === 'ai_reply') {
                const callback = this.messageCallbacks.get(id);
                if (callback) {
                    clearTimeout(callback.timeout);
                    callback.resolve({
                        success: true,
                        data: { reply: content }
                    });
                    this.messageCallbacks.delete(id);
                }
            }
            
            // 处理错误消息
            if (type === 'error') {
                const callback = this.messageCallbacks.get(id);
                if (callback) {
                    clearTimeout(callback.timeout);
                    callback.reject(new Error(content));
                    this.messageCallbacks.delete(id);
                }
            }
        }
        
        /**
         * 生成消息ID
         */
        _generateMessageId() {
            return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        /**
         * 获取请求头
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
         */
        _getAuthHeader() {
            const token = window.authService?.getToken();
            return token ? `Bearer ${token}` : '';
        }
        
        /**
         * 关闭WebSocket连接
         */
        close() {
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
            
            // 清理所有回调
            this.messageCallbacks.forEach((callback, id) => {
                clearTimeout(callback.timeout);
                callback.reject(new Error('连接已关闭'));
            });
            this.messageCallbacks.clear();
        }
    }
    
    // 全局注册聊天服务
    window.chatService = new ChatService();
    
})();