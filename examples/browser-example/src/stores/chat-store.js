(function() {
    'use strict';
    
    // 使用全局Pinia对象
    const { defineStore } = Pinia;
    
    // 聊天状态管理Store
    const useChatStore = defineStore('chat', {
        state: () => ({
            // 聊天会话
            currentSession: null,
            sessions: [],
            
            // 消息列表
            messages: [],
            
            // 聊天设置
            settings: {
                autoReply: true,
                voiceOutput: false,
                typingIndicator: true,
                messageSound: true,
                theme: 'light'
            },
            
            // 状态
            loading: false,
            connected: false,
            typing: false,
            error: null,
            
            // 分页信息
            pagination: {
                page: 1,
                pageSize: 50,
                total: 0,
                hasMore: false
            }
        }),
        
        getters: {
            // 当前会话消息
            currentMessages: (state) => {
                if (!state.currentSession) return [];
                return state.messages.filter(msg => msg.sessionId === state.currentSession.id);
            },
            
            // 未读消息数量
            unreadCount: (state) => {
                return state.messages.filter(msg => !msg.read && msg.sender !== 'user').length;
            },
            
            // 最后一条消息
            lastMessage: (state) => {
                if (state.messages.length === 0) return null;
                return state.messages[state.messages.length - 1];
            },
            
            // 是否有更多消息可加载
            canLoadMore: (state) => state.pagination.hasMore,
            
            // 是否正在连接
            isConnecting: (state) => state.loading && !state.connected,
            
            // 是否正在输入
            isTyping: (state) => state.typing
        },
        
        actions: {
            /**
             * 初始化聊天服务
             */
            async initialize() {
                this.loading = true;
                this.error = null;
                
                try {
                    // 初始化WebSocket连接
                    await window.chatService.initWebSocket();
                    this.connected = true;
                    
                    // 加载聊天设置
                    await this.loadSettings();
                    
                    // 加载会话列表
                    await this.loadSessions();
                    
                } catch (error) {
                    console.error('初始化聊天服务失败:', error);
                    this.error = error.message;
                    this.connected = false;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 发送消息
             */
            async sendMessage(content, type = 'text') {
                this.loading = true;
                this.error = null;
                
                try {
                    let result;
                    
                    if (type === 'text') {
                        result = await window.chatService.sendMessage(content);
                    } else {
                        throw new Error('暂不支持该消息类型');
                    }
                    
                    if (result.success) {
                        // 添加用户消息到本地
                        const userMessage = {
                            id: this._generateMessageId(),
                            sessionId: this.currentSession?.id || 'default',
                            content: content,
                            type: type,
                            sender: 'user',
                            timestamp: new Date().toISOString(),
                            read: true
                        };
                        
                        this.messages.push(userMessage);
                        
                        // 如果是AI回复，添加AI消息
                        if (result.data && result.data.reply) {
                            const aiMessage = {
                                id: this._generateMessageId(),
                                sessionId: this.currentSession?.id || 'default',
                                content: result.data.reply,
                                type: 'text',
                                sender: 'bot',
                                timestamp: new Date().toISOString(),
                                read: false
                            };
                            
                            this.messages.push(aiMessage);
                        }
                        
                        return result;
                    } else {
                        throw new Error(result.message || '发送消息失败');
                    }
                } catch (error) {
                    console.error('发送消息失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 接收消息
             */
            receiveMessage(messageData) {
                const message = {
                    id: messageData.id || this._generateMessageId(),
                    sessionId: this.currentSession?.id || 'default',
                    content: messageData.content,
                    type: messageData.type || 'text',
                    sender: messageData.sender || 'bot',
                    timestamp: messageData.timestamp || new Date().toISOString(),
                    read: false
                };
                
                this.messages.push(message);
            },
            
            /**
             * 上传图片
             */
            async uploadImage(file) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.chatService.uploadImage(file);
                    
                    if (result.success) {
                        // 添加图片消息
                        const imageMessage = {
                            id: this._generateMessageId(),
                            sessionId: this.currentSession?.id || 'default',
                            content: result.data.url,
                            type: 'image',
                            sender: 'user',
                            timestamp: new Date().toISOString(),
                            read: true
                        };
                        
                        this.messages.push(imageMessage);
                        return result;
                    } else {
                        throw new Error(result.message || '上传图片失败');
                    }
                } catch (error) {
                    console.error('上传图片失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 加载聊天历史
             */
            async loadHistory(params = {}) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.chatService.getChatHistory(params);
                    
                    if (result.success) {
                        this.messages = result.data || [];
                        this.pagination = {
                            page: params.page || 1,
                            pageSize: params.pageSize || 50,
                            total: result.total || 0,
                            hasMore: (params.page || 1) < Math.ceil((result.total || 0) / (params.pageSize || 50))
                        };
                    } else {
                        throw new Error(result.message || '加载聊天历史失败');
                    }
                } catch (error) {
                    console.error('加载聊天历史失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 加载更多消息
             */
            async loadMore() {
                if (!this.canLoadMore || this.loading) return;
                
                const nextPage = this.pagination.page + 1;
                
                try {
                    const result = await window.chatService.getChatHistory({
                        page: nextPage,
                        pageSize: this.pagination.pageSize
                    });
                    
                    if (result.success) {
                        this.messages = [...(result.data || []), ...this.messages];
                        this.pagination.page = nextPage;
                        this.pagination.hasMore = nextPage < Math.ceil((result.total || 0) / this.pagination.pageSize);
                    }
                } catch (error) {
                    console.error('加载更多消息失败:', error);
                    this.error = error.message;
                }
            },
            
            /**
             * 加载会话列表
             */
            async loadSessions() {
                try {
                    // 这里可以从本地存储或API加载会话列表
                    const savedSessions = localStorage.getItem('chat_sessions');
                    if (savedSessions) {
                        this.sessions = JSON.parse(savedSessions);
                    }
                    
                    // 如果没有当前会话，设置默认会话
                    if (!this.currentSession && this.sessions.length > 0) {
                        this.currentSession = this.sessions[0];
                    } else if (this.sessions.length === 0) {
                        // 创建默认会话
                        const defaultSession = {
                            id: 'default',
                            name: '默认会话',
                            createTime: new Date().toISOString(),
                            lastMessageTime: new Date().toISOString(),
                            unreadCount: 0
                        };
                        
                        this.sessions.push(defaultSession);
                        this.currentSession = defaultSession;
                    }
                } catch (error) {
                    console.error('加载会话列表失败:', error);
                }
            },
            
            /**
             * 创建新会话
             */
            createSession(name = '新会话') {
                const newSession = {
                    id: this._generateSessionId(),
                    name: name,
                    createTime: new Date().toISOString(),
                    lastMessageTime: new Date().toISOString(),
                    unreadCount: 0
                };
                
                this.sessions.push(newSession);
                this.currentSession = newSession;
                this.messages = [];
                
                this._saveSessionsToStorage();
            },
            
            /**
             * 切换会话
             */
            switchSession(sessionId) {
                const session = this.sessions.find(s => s.id === sessionId);
                if (session) {
                    this.currentSession = session;
                    // 加载该会话的消息
                    this.loadHistory({ sessionId: sessionId });
                }
            },
            
            /**
             * 删除会话
             */
            deleteSession(sessionId) {
                this.sessions = this.sessions.filter(s => s.id !== sessionId);
                
                // 如果删除的是当前会话，切换到第一个会话
                if (this.currentSession && this.currentSession.id === sessionId) {
                    this.currentSession = this.sessions.length > 0 ? this.sessions[0] : null;
                }
                
                this._saveSessionsToStorage();
            },
            
            /**
             * 加载聊天设置
             */
            async loadSettings() {
                try {
                    const result = await window.chatService.getChatSettings();
                    
                    if (result.success) {
                        this.settings = { ...this.settings, ...result.data };
                    }
                } catch (error) {
                    console.error('加载聊天设置失败:', error);
                    // 使用默认设置
                }
            },
            
            /**
             * 更新聊天设置
             */
            async updateSettings(newSettings) {
                try {
                    const result = await window.chatService.updateChatSettings(newSettings);
                    
                    if (result.success) {
                        this.settings = { ...this.settings, ...newSettings };
                        return result;
                    } else {
                        throw new Error(result.message || '更新设置失败');
                    }
                } catch (error) {
                    console.error('更新聊天设置失败:', error);
                    throw error;
                }
            },
            
            /**
             * 标记消息为已读
             */
            markAsRead(messageId) {
                const message = this.messages.find(msg => msg.id === messageId);
                if (message && !message.read) {
                    message.read = true;
                    
                    // 更新会话未读计数
                    if (this.currentSession) {
                        this.currentSession.unreadCount = Math.max(0, this.currentSession.unreadCount - 1);
                    }
                }
            },
            
            /**
             * 标记所有消息为已读
             */
            markAllAsRead() {
                this.messages.forEach(msg => {
                    if (!msg.read && msg.sender !== 'user') {
                        msg.read = true;
                    }
                });
                
                // 重置会话未读计数
                if (this.currentSession) {
                    this.currentSession.unreadCount = 0;
                }
            },
            
            /**
             * 清除聊天记录
             */
            async clearHistory() {
                try {
                    const result = await window.chatService.clearChatHistory();
                    
                    if (result.success) {
                        this.messages = [];
                        this.pagination = {
                            page: 1,
                            pageSize: 50,
                            total: 0,
                            hasMore: false
                        };
                    } else {
                        throw new Error(result.message || '清除记录失败');
                    }
                } catch (error) {
                    console.error('清除聊天记录失败:', error);
                    throw error;
                }
            },
            
            /**
             * 设置输入状态
             */
            setTyping(typing) {
                this.typing = typing;
            },
            
            /**
             * 获取所有消息
             */
            getMessages() {
                return this.currentMessages;
            },
            
            /**
             * 生成消息ID
             */
            _generateMessageId() {
                return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            },
            
            /**
             * 生成会话ID
             */
            _generateSessionId() {
                return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            },
            
            /**
             * 保存会话列表到本地存储
             */
            _saveSessionsToStorage() {
                try {
                    localStorage.setItem('chat_sessions', JSON.stringify(this.sessions));
                } catch (error) {
                    console.error('保存会话列表失败:', error);
                }
            },
            
            /**
             * 清除错误
             */
            clearError() {
                this.error = null;
            },
            
            /**
             * 重置状态
             */
            reset() {
                this.messages = [];
                this.loading = false;
                this.error = null;
                this.typing = false;
                this.pagination = {
                    page: 1,
                    pageSize: 50,
                    total: 0,
                    hasMore: false
                };
            }
        }
    });
    
    // 全局注册Store
    window.useChatStore = useChatStore;
    
})();