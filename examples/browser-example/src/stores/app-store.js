(function() {
    'use strict';
    
    // 使用全局Pinia对象
    const { defineStore } = Pinia;
    
    // 应用状态管理Store
    const useAppStore = defineStore('app', {
        state: () => ({
            // 应用配置
            config: {
                theme: 'light',
                language: 'zh-CN',
                fontSize: 'normal',
                notification: true,
                autoLogin: false
            },
            
            // 全局状态
            loading: false,
            error: null,
            online: navigator.onLine,
            
            // 路由状态
            currentRoute: '/',
            previousRoute: '',
            
            // 页面状态
            pageTitle: 'SDKWork AIoT',
            showTabBar: true,
            showNavBar: true,
            
            // 全局数据
            unreadCount: 0,
            notificationCount: 0,
            lastUpdateTime: null
        }),
        
        getters: {
            // 应用是否就绪
            isReady: (state) => !state.loading && state.online,
            
            // 是否有未读消息
            hasUnread: (state) => state.unreadCount > 0,
            
            // 是否有通知
            hasNotification: (state) => state.notificationCount > 0,
            
            // 获取页面标题
            getPageTitle: (state) => state.pageTitle,
            
            // 获取当前路由
            getCurrentRoute: (state) => state.currentRoute
        },
        
        actions: {
            /**
             * 设置应用配置
             */
            setConfig(config) {
                this.config = { ...this.config, ...config };
                this._saveConfigToStorage();
            },
            
            /**
             * 设置加载状态
             */
            setLoading(loading) {
                this.loading = loading;
            },
            
            /**
             * 设置错误信息
             */
            setError(error) {
                this.error = error;
                // 错误信息自动清除
                if (error) {
                    setTimeout(() => {
                        this.clearError();
                    }, 5000);
                }
            },
            
            /**
             * 清除错误信息
             */
            clearError() {
                this.error = null;
            },
            
            /**
             * 设置网络状态
             */
            setOnlineStatus(online) {
                this.online = online;
                if (!online) {
                    this.setError('网络连接已断开');
                }
            },
            
            /**
             * 设置路由状态
             */
            setRoute(route) {
                this.previousRoute = this.currentRoute;
                this.currentRoute = route;
            },
            
            /**
             * 设置页面标题
             */
            setPageTitle(title) {
                this.pageTitle = title;
                document.title = title;
            },
            
            /**
             * 设置标签栏显示状态
             */
            setTabBarVisible(visible) {
                this.showTabBar = visible;
            },
            
            /**
             * 设置导航栏显示状态
             */
            setNavBarVisible(visible) {
                this.showNavBar = visible;
            },
            
            /**
             * 更新未读消息数量
             */
            updateUnreadCount(count) {
                this.unreadCount = count;
            },
            
            /**
             * 更新通知数量
             */
            updateNotificationCount(count) {
                this.notificationCount = count;
            },
            
            /**
             * 增加未读消息
             */
            incrementUnreadCount() {
                this.unreadCount += 1;
            },
            
            /**
             * 减少未读消息
             */
            decrementUnreadCount() {
                if (this.unreadCount > 0) {
                    this.unreadCount -= 1;
                }
            },
            
            /**
             * 增加通知数量
             */
            incrementNotificationCount() {
                this.notificationCount += 1;
            },
            
            /**
             * 减少通知数量
             */
            decrementNotificationCount() {
                if (this.notificationCount > 0) {
                    this.notificationCount -= 1;
                }
            },
            
            /**
             * 清除所有未读
             */
            clearAllUnread() {
                this.unreadCount = 0;
                this.notificationCount = 0;
            },
            
            /**
             * 更新最后更新时间
             */
            updateLastUpdateTime() {
                this.lastUpdateTime = new Date().toISOString();
            },
            
            /**
             * 切换主题
             */
            toggleTheme() {
                this.config.theme = this.config.theme === 'light' ? 'dark' : 'light';
                this._applyTheme();
                this._saveConfigToStorage();
            },
            
            /**
             * 切换语言
             */
            toggleLanguage() {
                this.config.language = this.config.language === 'zh-CN' ? 'en-US' : 'zh-CN';
                this._applyLanguage();
                this._saveConfigToStorage();
            },
            
            /**
             * 切换通知设置
             */
            toggleNotification() {
                this.config.notification = !this.config.notification;
                this._saveConfigToStorage();
            },
            
            /**
             * 切换自动登录
             */
            toggleAutoLogin() {
                this.config.autoLogin = !this.config.autoLogin;
                this._saveConfigToStorage();
            },
            
            /**
             * 显示加载提示
             */
            showLoading(message = '加载中...') {
                this.setLoading(true);
                // 这里可以集成Vant的加载提示
                if (window.vant && window.vant.showLoading) {
                    window.vant.showLoading({
                        message: message,
                        forbidClick: true
                    });
                }
            },
            
            /**
             * 隐藏加载提示
             */
            hideLoading() {
                this.setLoading(false);
                if (window.vant && window.vant.hideLoading) {
                    window.vant.hideLoading();
                }
            },
            
            /**
             * 显示成功提示
             */
            showSuccess(message) {
                if (window.vant && window.vant.showToast) {
                    window.vant.showToast({
                        message: message,
                        type: 'success'
                    });
                }
            },
            
            /**
             * 显示错误提示
             */
            showError(message) {
                this.setError(message);
                if (window.vant && window.vant.showToast) {
                    window.vant.showToast({
                        message: message,
                        type: 'fail'
                    });
                }
            },
            
            /**
             * 显示警告提示
             */
            showWarning(message) {
                if (window.vant && window.vant.showToast) {
                    window.vant.showToast({
                        message: message,
                        type: 'warning'
                    });
                }
            },
            
            /**
             * 应用主题
             */
            _applyTheme() {
                const root = document.documentElement;
                if (this.config.theme === 'dark') {
                    root.classList.add('dark-theme');
                } else {
                    root.classList.remove('dark-theme');
                }
            },
            
            /**
             * 应用语言
             */
            _applyLanguage() {
                document.documentElement.lang = this.config.language;
            },
            
            /**
             * 保存配置到本地存储
             */
            _saveConfigToStorage() {
                try {
                    localStorage.setItem('app_config', JSON.stringify(this.config));
                } catch (error) {
                    console.error('保存配置到本地存储失败:', error);
                }
            },
            
            /**
             * 从本地存储加载配置
             */
            loadConfigFromStorage() {
                try {
                    const configStr = localStorage.getItem('app_config');
                    if (configStr) {
                        const savedConfig = JSON.parse(configStr);
                        this.config = { ...this.config, ...savedConfig };
                        this._applyTheme();
                        this._applyLanguage();
                    }
                } catch (error) {
                    console.error('从本地存储加载配置失败:', error);
                }
            },
            
            /**
             * 初始化应用
             */
            async initialize() {
                this.showLoading('应用初始化中...');
                
                try {
                    // 加载配置
                    this.loadConfigFromStorage();
                    
                    // 监听网络状态
                    window.addEventListener('online', () => this.setOnlineStatus(true));
                    window.addEventListener('offline', () => this.setOnlineStatus(false));
                    
                    // 更新最后更新时间
                    this.updateLastUpdateTime();
                    
                    this.showSuccess('应用初始化成功');
                } catch (error) {
                    this.showError('应用初始化失败');
                    console.error('应用初始化失败:', error);
                } finally {
                    this.hideLoading();
                }
            },
            
            /**
             * 重置应用状态
             */
            reset() {
                this.loading = false;
                this.error = null;
                this.unreadCount = 0;
                this.notificationCount = 0;
                this.lastUpdateTime = null;
            }
        }
    });
    
    // 全局注册Store
    window.useAppStore = useAppStore;
    
})();