(function() {
    'use strict';
    
    // 类型定义工具类
    class TypeUtils {
        /**
         * 设备状态枚举
         */
        static get DeviceStatus() {
            return {
                ONLINE: 'online',
                OFFLINE: 'offline',
                CONNECTING: 'connecting',
                ERROR: 'error'
            };
        }
        
        /**
         * 设备类型枚举
         */
        static get DeviceType() {
            return {
                SENSOR: 'sensor',
                ACTUATOR: 'actuator',
                CAMERA: 'camera',
                GATEWAY: 'gateway',
                CONTROLLER: 'controller',
                DISPLAY: 'display'
            };
        }
        
        /**
         * 用户角色枚举
         */
        static get UserRole() {
            return {
                ADMIN: 'admin',
                USER: 'user',
                GUEST: 'guest'
            };
        }
        
        /**
         * 消息类型枚举
         */
        static get MessageType() {
            return {
                TEXT: 'text',
                IMAGE: 'image',
                VOICE: 'voice',
                VIDEO: 'video',
                FILE: 'file',
                SYSTEM: 'system'
            };
        }
        
        /**
         * 认证类型枚举
         */
        static get AuthType() {
            return {
                API_KEY: 'apiKey',
                AUTHORIZATION: 'authorization'
            };
        }
        
        /**
         * 设备控制动作枚举
         */
        static get DeviceAction() {
            return {
                START: 'start',
                STOP: 'stop',
                TOGGLE: 'toggle',
                RESTART: 'restart',
                RESET: 'reset',
                UPDATE: 'update'
            };
        }
        
        /**
         * 设备数据结构
         */
        static get DeviceData() {
            return {
                id: '',
                name: '',
                type: '',
                status: '',
                description: '',
                ipAddress: '',
                port: 0,
                lastActive: '',
                createTime: '',
                updateTime: '',
                metadata: {}
            };
        }
        
        /**
         * 用户数据结构
         */
        static getUserData() {
            return {
                id: '',
                username: '',
                email: '',
                phone: '',
                avatar: '',
                nickname: '',
                bio: '',
                role: '',
                createTime: '',
                lastLoginTime: '',
                settings: {}
            };
        }
        
        /**
         * 认证数据结构
         */
        static getAuthData() {
            return {
                token: '',
                refreshToken: '',
                expiresIn: 0,
                user: this.getUserData()
            };
        }
        
        /**
         * 消息数据结构
         */
        static getMessageData() {
            return {
                id: '',
                type: '',
                content: '',
                sender: '',
                receiver: '',
                timestamp: '',
                status: '',
                metadata: {}
            };
        }
        
        /**
         * API响应数据结构
         */
        static getApiResponse() {
            return {
                success: false,
                message: '',
                data: null,
                code: 0,
                timestamp: ''
            };
        }
        
        /**
         * 分页参数结构
         */
        static getPaginationParams() {
            return {
                page: 1,
                pageSize: 20,
                total: 0,
                totalPages: 0
            };
        }
        
        /**
         * 搜索参数结构
         */
        static getSearchParams() {
            return {
                keyword: '',
                filters: {},
                sortBy: '',
                sortOrder: 'asc'
            };
        }
        
        /**
         * 验证类型是否为设备状态
         */
        static isDeviceStatus(status) {
            return Object.values(this.DeviceStatus).includes(status);
        }
        
        /**
         * 验证类型是否为设备类型
         */
        static isDeviceType(type) {
            return Object.values(this.DeviceType).includes(type);
        }
        
        /**
         * 验证类型是否为用户角色
         */
        static isUserRole(role) {
            return Object.values(this.UserRole).includes(role);
        }
        
        /**
         * 验证类型是否为消息类型
         */
        static isMessageType(type) {
            return Object.values(this.MessageType).includes(type);
        }
        
        /**
         * 验证类型是否为认证类型
         */
        static isAuthType(type) {
            return Object.values(this.AuthType).includes(type);
        }
        
        /**
         * 验证类型是否为设备动作
         */
        static isDeviceAction(action) {
            return Object.values(this.DeviceAction).includes(action);
        }
        
        /**
         * 创建设备数据对象
         */
        static createDeviceData(data = {}) {
            return {
                ...this.DeviceData,
                ...data,
                createTime: data.createTime || new Date().toISOString(),
                updateTime: new Date().toISOString()
            };
        }
        
        /**
         * 创建用户数据对象
         */
        static createUserData(data = {}) {
            return {
                ...this.getUserData(),
                ...data,
                createTime: data.createTime || new Date().toISOString()
            };
        }
        
        /**
         * 创建消息数据对象
         */
        static createMessageData(data = {}) {
            return {
                ...this.getMessageData(),
                ...data,
                timestamp: data.timestamp || new Date().toISOString(),
                status: data.status || 'sent'
            };
        }
        
        /**
         * 创建API响应对象
         */
        static createApiResponse(data = {}) {
            return {
                ...this.getApiResponse(),
                ...data,
                timestamp: new Date().toISOString(),
                success: data.success !== undefined ? data.success : true
            };
        }
        
        /**
         * 深度克隆对象
         */
        static deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
        
        /**
         * 合并对象（深度合并）
         */
        static deepMerge(target, source) {
            const output = this.deepClone(target);
            
            if (this.isObject(target) && this.isObject(source)) {
                for (const key in source) {
                    if (source.hasOwnProperty(key)) {
                        if (this.isObject(source[key])) {
                            if (!(key in target)) {
                                Object.assign(output, { [key]: source[key] });
                            } else {
                                output[key] = this.deepMerge(target[key], source[key]);
                            }
                        } else {
                            Object.assign(output, { [key]: source[key] });
                        }
                    }
                }
            }
            
            return output;
        }
        
        /**
         * 判断是否为对象
         */
        static isObject(item) {
            return item && typeof item === 'object' && !Array.isArray(item);
        }
        
        /**
         * 获取枚举值的显示文本
         */
        static getEnumDisplayText(enumType, value) {
            const displayTexts = {
                DeviceStatus: {
                    online: '在线',
                    offline: '离线',
                    connecting: '连接中',
                    error: '错误'
                },
                DeviceType: {
                    sensor: '传感器',
                    actuator: '执行器',
                    camera: '摄像头',
                    gateway: '网关',
                    controller: '控制器',
                    display: '显示器'
                },
                UserRole: {
                    admin: '管理员',
                    user: '用户',
                    guest: '访客'
                },
                MessageType: {
                    text: '文本',
                    image: '图片',
                    voice: '语音',
                    video: '视频',
                    file: '文件',
                    system: '系统'
                },
                AuthType: {
                    apiKey: 'API密钥',
                    authorization: '授权令牌'
                },
                DeviceAction: {
                    start: '启动',
                    stop: '停止',
                    toggle: '切换',
                    restart: '重启',
                    reset: '重置',
                    update: '更新'
                }
            };
            
            return displayTexts[enumType]?.[value] || value;
        }
    }
    
    // 全局注册类型工具
    window.typeUtils = TypeUtils;
    
})();