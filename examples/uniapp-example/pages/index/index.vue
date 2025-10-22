<template>
  <view class="container">
    <view class="header">
      <text class="title">UniApp AIoT SDK 示例</text>
    </view>

    <view class="section">
      <text :class="[isConnected ? 'connected' : 'disconnected']">
        连接状态: {{ isConnected ? '已连接' : '未连接' }}
      </text>
      <button @tap="toggleConnection" class="btn">
        {{ isConnected ? '断开连接' : '连接' }}
      </button>
    </view>

    <view class="section">
      <text class="section-title">设备列表</text>
      <button @tap="fetchDevices" class="btn">获取设备</button>
      
      <view v-if="devices.length > 0">
        <view v-for="device in devices" :key="device.id" class="device-card">
          <text class="device-name">{{ device.name }}</text>
          <text>设备ID: {{ device.id }}</text>
          <text>类型: {{ device.type }}</text>
          <text>状态: {{ device.status.online ? '在线' : '离线' }}</text>
          <text>电量: {{ device.status.batteryLevel }}%</text>
          
          <button 
            v-if="device.type === 'controller'" 
            @tap="sendControlCommand(device.id)"
            :disabled="!device.status.online"
            class="btn"
          >
            发送控制命令
          </button>
        </view>
      </view>
      <text v-else>暂无设备数据</text>
    </view>

    <view class="section">
      <text class="section-title">实时数据</text>
      <view v-if="sensorData.length > 0">
        <view v-for="(data, index) in sensorData" :key="index" class="data-item">
          <text>时间: {{ formatTime(data.timestamp) }}</text>
          <text>数值: {{ data.value }} {{ data.unit }}</text>
          <text>类型: {{ data.sensorType }}</text>
        </view>
      </view>
      <text v-else>等待传感器数据...</text>
    </view>

    <view class="section">
      <text class="section-title">事件日志</text>
      <view class="events-list">
        <view v-for="(event, index) in events" :key="index" class="event-item">
          <text>[{{ formatTime(event.timestamp) }}] {{ event.type }} - {{ event.deviceId }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { AIoTClient } from '../../../../src';

export default {
  data() {
    return {
      aiotClient: null,
      isConnected: false,
      devices: [],
      sensorData: [],
      events: []
    };
  },

  onLoad() {
    this.initAIoTClient();
  },

  onUnload() {
    if (this.aiotClient) {
      this.aiotClient.disconnect();
    }
  },

  methods: {
    initAIoTClient() {
      this.aiotClient = new AIoTClient({
        apiKey: 'demo-api-key-uniapp',
        debug: true
      });

      // 注册事件监听器
      this.aiotClient.on('command_completed', this.handleCommandCompleted);
      this.aiotClient.on('device_online', this.handleDeviceOnline);
      this.aiotClient.on('device_offline', this.handleDeviceOffline);

      // 订阅数据回调
      this.aiotClient.subscribeToDevice('device-001', this.handleSensorData);

      // 错误处理
      this.aiotClient.onError(this.handleError);

      // 启动模拟数据
      this.aiotClient.startMockData();
    },

    async toggleConnection() {
      try {
        if (this.isConnected) {
          await this.aiotClient.disconnect();
          this.isConnected = false;
        } else {
          await this.aiotClient.connect();
          this.isConnected = true;
        }
      } catch (error) {
        console.error('连接操作失败:', error);
        uni.showToast({
          title: '连接失败',
          icon: 'none'
        });
      }
    },

    async fetchDevices() {
      try {
        if (this.aiotClient) {
          const deviceList = await this.aiotClient.getDevices();
          this.devices = deviceList;
        }
      } catch (error) {
        console.error('获取设备失败:', error);
        uni.showToast({
          title: '获取设备失败',
          icon: 'none'
        });
      }
    },

    async sendControlCommand(deviceId) {
      try {
        if (this.aiotClient) {
          await this.aiotClient.sendCommand({
            deviceId,
            command: 'toggle',
            parameters: { state: 'on' },
            timestamp: new Date()
          });
          uni.showToast({
            title: '命令发送成功',
            icon: 'success'
          });
        }
      } catch (error) {
        console.error('发送命令失败:', error);
        uni.showToast({
          title: '发送命令失败',
          icon: 'none'
        });
      }
    },

    handleSensorData(data) {
      this.sensorData.unshift(data);
      if (this.sensorData.length > 5) {
        this.sensorData.pop();
      }
    },

    handleCommandCompleted(event) {
      this.events.unshift(event);
      if (this.events.length > 10) {
        this.events.pop();
      }
    },

    handleDeviceOnline(event) {
      this.events.unshift(event);
    },

    handleDeviceOffline(event) {
      this.events.unshift(event);
    },

    handleError(error) {
      console.error('AIoT SDK错误:', error);
      this.events.unshift({
        type: 'error',
        deviceId: 'system',
        data: { message: error.message },
        timestamp: new Date()
      });
      
      uni.showToast({
        title: '发生错误',
        icon: 'none'
      });
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString('zh-CN');
    }
  }
};
</script>

<style>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
}

.section {
  background-color: white;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.connected {
  color: #07C160;
  margin-bottom: 20rpx;
  display: block;
}

.disconnected {
  color: #FA5151;
  margin-bottom: 20rpx;
  display: block;
}

.btn {
  background-color: #007AFF;
  color: white;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  margin: 10rpx 0;
  border: none;
}

.btn:disabled {
  background-color: #CCCCCC;
}

.device-card {
  border: 2rpx solid #EEEEEE;
  padding: 30rpx;
  margin: 20rpx 0;
  border-radius: 12rpx;
}

.device-name {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  display: block;
}

.data-item, .event-item {
  padding: 20rpx;
  margin: 10rpx 0;
  border-bottom: 2rpx solid #F0F0F0;
}

events-list {
  max-height: 400rpx;
  overflow-y: auto;
}
</style>