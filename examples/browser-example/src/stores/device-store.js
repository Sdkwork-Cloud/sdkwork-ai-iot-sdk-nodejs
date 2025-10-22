(function() {
    'use strict';
    
    // 使用全局Pinia对象
    const { defineStore } = Pinia;
    
    // 设备状态管理Store
    const useDeviceStore = defineStore('device', {
        state: () => ({
            devices: [],
            currentDevice: null,
            loading: false,
            error: null,
            searchKeyword: '',
            filterStatus: 'all'
        }),
        
        getters: {
            // 过滤后的设备列表
            filteredDevices: (state) => {
                let devices = state.devices;
                
                // 状态筛选
                if (state.filterStatus !== 'all') {
                    devices = devices.filter(device => device.status === state.filterStatus);
                }
                
                // 关键词搜索
                if (state.searchKeyword) {
                    const keyword = state.searchKeyword.toLowerCase();
                    devices = devices.filter(device => 
                        device.name.toLowerCase().includes(keyword) ||
                        device.id.toLowerCase().includes(keyword)
                    );
                }
                
                return devices;
            },
            
            // 在线设备数量
            onlineCount: (state) => state.devices.filter(device => device.status === 'online').length,
            
            // 离线设备数量
            offlineCount: (state) => state.devices.filter(device => device.status === 'offline').length,
            
            // 设备总数
            totalCount: (state) => state.devices.length
        },
        
        actions: {
            /**
             * 获取设备列表
             */
            async fetchDevices() {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.deviceService.getDevices();
                    
                    if (result.success) {
                        this.devices = result.data || [];
                    } else {
                        throw new Error(result.message || '获取设备列表失败');
                    }
                } catch (error) {
                    console.error('获取设备列表失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 获取设备详情
             */
            async fetchDevice(deviceId) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.deviceService.getDevice(deviceId);
                    
                    if (result.success) {
                        this.currentDevice = result.data;
                        return result.data;
                    } else {
                        throw new Error(result.message || '获取设备详情失败');
                    }
                } catch (error) {
                    console.error('获取设备详情失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 添加设备
             */
            async addDevice(deviceData) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.deviceService.addDevice(deviceData);
                    
                    if (result.success) {
                        // 添加成功后刷新设备列表
                        await this.fetchDevices();
                        return result.data;
                    } else {
                        throw new Error(result.message || '添加设备失败');
                    }
                } catch (error) {
                    console.error('添加设备失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 更新设备
             */
            async updateDevice(deviceId, deviceData) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.deviceService.updateDevice(deviceId, deviceData);
                    
                    if (result.success) {
                        // 更新成功后刷新设备列表
                        await this.fetchDevices();
                        return result.data;
                    } else {
                        throw new Error(result.message || '更新设备失败');
                    }
                } catch (error) {
                    console.error('更新设备失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 删除设备
             */
            async deleteDevice(deviceId) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.deviceService.deleteDevice(deviceId);
                    
                    if (result.success) {
                        // 删除成功后刷新设备列表
                        await this.fetchDevices();
                        return result.data;
                    } else {
                        throw new Error(result.message || '删除设备失败');
                    }
                } catch (error) {
                    console.error('删除设备失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 控制设备
             */
            async controlDevice(deviceId, action, params = {}) {
                this.loading = true;
                this.error = null;
                
                try {
                    const result = await window.deviceService.control(deviceId, action, params);
                    
                    if (result.success) {
                        // 控制成功后刷新设备列表
                        await this.fetchDevices();
                        return result.data;
                    } else {
                        throw new Error(result.message || '设备控制失败');
                    }
                } catch (error) {
                    console.error('设备控制失败:', error);
                    this.error = error.message;
                    throw error;
                } finally {
                    this.loading = false;
                }
            },
            
            /**
             * 设置搜索关键词
             */
            setSearchKeyword(keyword) {
                this.searchKeyword = keyword;
            },
            
            /**
             * 设置筛选状态
             */
            setFilterStatus(status) {
                this.filterStatus = status;
            },
            
            /**
             * 清除错误
             */
            clearError() {
                this.error = null;
            },
            
            /**
             * 清除当前设备
             */
            clearCurrentDevice() {
                this.currentDevice = null;
            }
        }
    });
    
    // 全局注册Store
    window.useDeviceStore = useDeviceStore;
    
})();