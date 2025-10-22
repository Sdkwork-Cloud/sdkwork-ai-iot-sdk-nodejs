(function() {
    'use strict';
    
    // 使用全局Vue对象
    const { defineComponent, ref, computed, onMounted } = Vue;
    
    // 设备控制器类（面向对象设计）
    class DeviceController {
        constructor(deviceId, emit) {
            this.deviceId = deviceId;
            this.emit = emit;
        }

        async controlDevice(action, params = {}) {
            try {
                const result = await window.deviceService.control(this.deviceId, action, params);
                this.emit('control', { deviceId: this.deviceId, action, result });
                return result;
            } catch (error) {
                console.error('设备控制失败:', error);
                throw error;
            }
        }

        showDetail() {
            this.emit('detail', this.deviceId);
        }

        updateStatus(newStatus) {
            this.emit('update:status', newStatus);
        }
    }
    
    // 定义DeviceCard组件（全局注册）
    const DeviceCard = defineComponent({
        name: 'DeviceCard',
        
        template: `
            <div class="device-card" :class="deviceData.status">
                <!-- 设备头部 -->
                <div class="device-header">
                    <div class="device-info-main">
                        <h3 class="device-name">{{ deviceData.name }}</h3>
                        <span :class="['status-indicator', statusColor]">
                            <i class="fas fa-circle"></i>
                            {{ statusText }}
                        </span>
                    </div>
                    <div class="device-actions">
                        <van-button 
                            size="small" 
                            type="primary"
                            @click="deviceController.showDetail()"
                        >
                            详情
                        </van-button>
                    </div>
                </div>
                
                <!-- 设备信息 -->
                <div class="device-info">
                    <div class="info-item">
                        <span class="info-label">设备ID:</span>
                        <span class="info-value">{{ deviceData.id }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">类型:</span>
                        <span class="info-value">{{ deviceData.type }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">最后活动:</span>
                        <span class="info-value">{{ formatTime(deviceData.lastActive) }}</span>
                    </div>
                </div>
                
                <!-- 操作按钮 -->
                <div v-if="showActions" class="device-controls">
                    <van-button 
                        type="success" 
                        size="small"
                        @click="handleControl('start')"
                        :disabled="!isOnline"
                        :loading="controlLoading.start"
                    >
                        <i class="fas fa-play"></i>
                        启动
                    </van-button>
                    <van-button 
                        type="warning" 
                        size="small"
                        @click="handleControl('stop')"
                        :disabled="!isOnline"
                        :loading="controlLoading.stop"
                    >
                        <i class="fas fa-stop"></i>
                        停止
                    </van-button>
                    <van-button 
                        type="primary" 
                        size="small"
                        @click="handleControl('toggle')"
                        :disabled="!isOnline"
                        :loading="controlLoading.toggle"
                    >
                        <i class="fas fa-power-off"></i>
                        开关
                    </van-button>
                </div>
            </div>
        `,
        
        props: {
            deviceData: {
                type: Object,
                required: true,
                default: () => ({})
            },
            showActions: {
                type: Boolean,
                default: true
            }
        },
        
        emits: ['control', 'detail', 'update:status'],
        
        setup(props, { emit }) {
            // 响应式状态
            const controlLoading = ref({
                start: false,
                stop: false,
                toggle: false
            });
            const deviceStatus = ref(props.deviceData.status);

            // 计算属性
            const isOnline = computed(() => deviceStatus.value === 'online');
            const statusText = computed(() => isOnline.value ? '在线' : '离线');
            const statusColor = computed(() => isOnline.value ? 'online' : 'offline');

            // 创建控制器实例
            const deviceController = new DeviceController(props.deviceData.id, emit);

            // 方法
            const handleControl = async (action) => {
                controlLoading.value[action] = true;
                
                try {
                    await deviceController.controlDevice(action);
                } catch (error) {
                    console.error(`设备${action}操作失败:`, error);
                } finally {
                    controlLoading.value[action] = false;
                }
            };

            const formatTime = (timestamp) => {
                if (!timestamp) return '未知';
                return new Date(timestamp).toLocaleString('zh-CN');
            };

            // 生命周期
            onMounted(() => {
                console.log('DeviceCard组件已挂载');
            });

            return {
                controlLoading,
                deviceStatus,
                isOnline,
                statusText,
                statusColor,
                deviceController,
                handleControl,
                formatTime
            };
        }
    });
    
    // 全局注册组件
    window.DeviceCard = DeviceCard;
    
})();