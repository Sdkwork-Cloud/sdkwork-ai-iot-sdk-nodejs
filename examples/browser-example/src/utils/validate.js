(function() {
    'use strict';
    
    // 验证工具类
    class ValidateUtils {
        /**
         * 验证邮箱格式
         * @param {string} email - 邮箱地址
         * @returns {boolean} 是否有效
         */
        static validateEmail(email) {
            if (!email) return false;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        /**
         * 验证手机号格式
         * @param {string} phone - 手机号
         * @returns {boolean} 是否有效
         */
        static validatePhone(phone) {
            if (!phone) return false;
            const phoneRegex = /^1[3-9]\d{9}$/;
            return phoneRegex.test(phone);
        }
        
        /**
         * 验证密码强度
         * @param {string} password - 密码
         * @returns {Object} 验证结果
         */
        static validatePassword(password) {
            if (!password) {
                return {
                    valid: false,
                    message: '密码不能为空',
                    strength: 0
                };
            }
            
            if (password.length < 6) {
                return {
                    valid: false,
                    message: '密码至少6位',
                    strength: 0
                };
            }
            
            // 计算密码强度
            let strength = 0;
            if (password.length >= 8) strength += 1;
            if (/[a-z]/.test(password)) strength += 1;
            if (/[A-Z]/.test(password)) strength += 1;
            if (/[0-9]/.test(password)) strength += 1;
            if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
            
            const messages = {
                1: '密码强度：弱',
                2: '密码强度：一般',
                3: '密码强度：中等',
                4: '密码强度：强',
                5: '密码强度：非常强'
            };
            
            return {
                valid: true,
                message: messages[strength] || '密码强度未知',
                strength: strength
            };
        }
        
        /**
         * 验证用户名格式
         * @param {string} username - 用户名
         * @returns {Object} 验证结果
         */
        static validateUsername(username) {
            if (!username) {
                return {
                    valid: false,
                    message: '用户名不能为空'
                };
            }
            
            if (username.length < 3 || username.length > 20) {
                return {
                    valid: false,
                    message: '用户名长度应为3-20个字符'
                };
            }
            
            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
                return {
                    valid: false,
                    message: '用户名只能包含字母、数字、下划线和中文字符'
                };
            }
            
            return {
                valid: true,
                message: '用户名格式正确'
            };
        }
        
        /**
         * 验证设备名称格式
         * @param {string} deviceName - 设备名称
         * @returns {Object} 验证结果
         */
        static validateDeviceName(deviceName) {
            if (!deviceName) {
                return {
                    valid: false,
                    message: '设备名称不能为空'
                };
            }
            
            if (deviceName.length < 2 || deviceName.length > 50) {
                return {
                    valid: false,
                    message: '设备名称长度应为2-50个字符'
                };
            }
            
            return {
                valid: true,
                message: '设备名称格式正确'
            };
        }
        
        /**
         * 验证设备ID格式
         * @param {string} deviceId - 设备ID
         * @returns {Object} 验证结果
         */
        static validateDeviceId(deviceId) {
            if (!deviceId) {
                return {
                    valid: false,
                    message: '设备ID不能为空'
                };
            }
            
            if (!/^[a-zA-Z0-9_-]+$/.test(deviceId)) {
                return {
                    valid: false,
                    message: '设备ID只能包含字母、数字、下划线和连字符'
                };
            }
            
            return {
                valid: true,
                message: '设备ID格式正确'
            };
        }
        
        /**
         * 验证URL格式
         * @param {string} url - URL地址
         * @returns {boolean} 是否有效
         */
        static validateUrl(url) {
            if (!url) return false;
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }
        
        /**
         * 验证IP地址格式
         * @param {string} ip - IP地址
         * @returns {boolean} 是否有效
         */
        static validateIp(ip) {
            if (!ip) return false;
            const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            return ipRegex.test(ip);
        }
        
        /**
         * 验证端口号格式
         * @param {string|number} port - 端口号
         * @returns {boolean} 是否有效
         */
        static validatePort(port) {
            const portNum = parseInt(port);
            return !isNaN(portNum) && portNum >= 1 && portNum <= 65535;
        }
        
        /**
         * 验证数字范围
         * @param {string|number} value - 数值
         * @param {number} min - 最小值
         * @param {number} max - 最大值
         * @returns {boolean} 是否在范围内
         */
        static validateNumberRange(value, min, max) {
            const num = parseFloat(value);
            return !isNaN(num) && num >= min && num <= max;
        }
        
        /**
         * 验证必填字段
         * @param {*} value - 字段值
         * @returns {boolean} 是否已填写
         */
        static validateRequired(value) {
            if (value === null || value === undefined) return false;
            if (typeof value === 'string') return value.trim().length > 0;
            if (Array.isArray(value)) return value.length > 0;
            return true;
        }
        
        /**
         * 验证字符串长度
         * @param {string} value - 字符串
         * @param {number} min - 最小长度
         * @param {number} max - 最大长度
         * @returns {boolean} 长度是否在范围内
         */
        static validateLength(value, min, max) {
            if (!value) return min === 0;
            return value.length >= min && value.length <= max;
        }
        
        /**
         * 批量验证表单数据
         * @param {Object} formData - 表单数据
         * @param {Object} rules - 验证规则
         * @returns {Object} 验证结果
         */
        static validateForm(formData, rules) {
            const errors = {};
            let isValid = true;
            
            for (const [field, fieldRules] of Object.entries(rules)) {
                const value = formData[field];
                
                for (const rule of fieldRules) {
                    let result;
                    
                    if (typeof rule === 'function') {
                        result = rule(value);
                    } else if (rule.validator) {
                        result = rule.validator(value);
                    } else if (rule.required) {
                        result = this.validateRequired(value);
                        if (!result) {
                            errors[field] = rule.message || `${field}不能为空`;
                            isValid = false;
                            break;
                        }
                    }
                    
                    if (result && typeof result === 'object' && !result.valid) {
                        errors[field] = result.message || rule.message;
                        isValid = false;
                        break;
                    }
                }
            }
            
            return {
                isValid,
                errors
            };
        }
    }
    
    // 全局注册验证工具
    window.validateUtils = ValidateUtils;
    
})();