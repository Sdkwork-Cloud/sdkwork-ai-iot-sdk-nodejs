# SDKWork AIoT Browser Example - HTML页面应用架构设计方案

## 1. 项目概述

本项目是一个**纯HTML页面应用**，采用传统的多页面架构（MPA）而非Vue SPA（单页应用）模式。通过独立的HTML文件直接部署，集成Vue3作为前端增强框架，提供设备管理、语音控制、数据收发等功能。

**核心特点**：
- **移动端HTML页面应用**：专为移动端设计的HTML页面应用，只需要兼容移动端样式
- **非SPA架构**：页面间通过传统导航跳转，保持简单性
- **Vue3增强**：在HTML页面中使用Vue3提供响应式能力
- **渐进式增强**：基础功能使用原生JS，复杂交互使用Vue3

## 2. 目录结构优化方案

### 2.1 完整的模块化目录树形图

```
browser-example/
├── docs/                   # 文档目录
│   ├── api/               # API接口文档
│   ├── architecture/      # 架构设计文档
│   └── deployment/        # 部署文档
├── src/                   # 源代码目录
│   ├── assets/           # 静态资源
│   │   ├── images/       # 图片资源
│   │   └── styles/       # 样式文件
│   ├── components/        # Vue3组件库（HTML页面内嵌）
│   │   ├── common/       # 通用组件
│   │   ├── layout/       # 布局组件
│   │   └── business/     # 业务组件
│   ├── pages/            # HTML页面目录
│   │   ├── index.html    # 首页
│   │   ├── auth/         # 认证相关页面
│   │   │   ├── login.html    # 登录页
│   │   │   ├── register.html # 注册页
│   │   │   └── reset-password.html # 重置密码页
│   │   ├── user/         # 用户中心页面
│   │   │   ├── profile.html  # 用户资料页
│   │   │   ├── settings.html # 用户设置页
│   │   │   └── security.html  # 安全设置页
│   │   ├── device/       # 设备管理页面
│   │   │   ├── list.html     # 设备列表页
│   │   │   ├── detail.html   # 设备详情页
│   │   │   └── control.html  # 设备控制页
│   │   ├── trade/        # 交易相关页面
│   │   │   ├── order.html    # 订单管理页
│   │   │   ├── payment.html  # 支付页面
│   │   │   └── history.html  # 交易历史页
│   │   ├── chat/         # 聊天相关页面
│   │   │   ├── index.html    # 聊天主页
│   │   │   ├── session.html  # 会话页面
│   │   │   └── history.html  # 聊天历史页
│   │   └── dashboard.html    # 仪表盘页
│   ├── services/          # 业务逻辑服务层
│   │   ├── auth/         # 认证服务
│   │   ├── user/         # 用户服务
│   │   ├── payment/      # 支付服务
│   │   ├── trade/        # 交易服务
│   │   └── device/       # 设备服务
│   ├── stores/           # Pinia状态管理
│   │   ├── auth/         # 认证状态管理
│   │   ├── device/       # 设备状态管理
│   │   ├── user/         # 用户状态管理
│   │   └── app/          # 应用状态管理
│   ├── types/            # TypeScript类型定义
│   │   ├── common.ts     # 通用类型
│   │   ├── device.ts     # 设备相关类型 
│   ├── utils/            # 工具函数
│   │   └── validate.ts   # 验证工具
│   └── plugins/          # 插件系统
│       ├── core/         # 核心插件
│       └── extensions/   # 扩展插件
├── tests/                # 测试目录
│   ├── unit/            # 单元测试
│   ├── integration/      # 集成测试
│   └── e2e/             # 端到端测试
├── config/              # 配置文件
│   ├── env/             # 环境配置
│   ├── build/           # 构建配置
│   └── deploy/          # 部署配置
└── scripts/            # 脚本目录
    ├── build/           # 构建脚本
    ├── deploy/          # 部署脚本
    └── utils/           # 工具脚本
```

### 2.2 各目录职责划分标准

**pages目录**：
- 存放独立的HTML页面文件
- 每个页面包含完整的HTML结构
- 页面间通过传统导航跳转（非SPA路由）
- 支持多页面应用（MPA）架构

**components目录**：
- Vue3组件库，采用HTML页面内嵌格式
- 组件以`.html`或`.js`文件形式存在，在HTML页面中直接引用
- 支持组件复用和模块化开发

**services目录**：
- 业务逻辑服务层，按业务域拆分
- API接口封装和统一管理
- 数据请求和状态管理
- 服务分类：auth（认证）、user（用户）、payment（支付）、trade（交易）、device（设备）等
- **文件命名规范**：服务文件必须使用`{service_name}_service.ts`格式，例如：`auth_service.ts`、`user_service.ts`、`device_service.ts`

**stores目录**：
- Pinia状态管理模块
- 按业务域拆分store
- 支持跨页面状态共享

### 2.3 HTML页面应用架构设计图

```
┌─────────────────────────────────────────────────┐
│                HTML页面层 (独立页面)              │
│  - index.html (首页)                           │
│  - device.html (设备管理页)                     │
│  - settings.html (设置页)                      │
├─────────────────────────────────────────────────┤
│                Vue3组件层 (页面内嵌)             │
│  - 组件在HTML页面中直接使用                      │
│  - 支持<script setup>语法糖                     │
├─────────────────────────────────────────────────┤
│               业务逻辑层 (Services/Stores)      │
│  - 服务层封装业务逻辑                           │
│  - 状态管理支持跨页面数据共享                    │
├─────────────────────────────────────────────────┤
│               数据访问层 (API/WebSocket)        │
│  - RESTful API调用                             │
│  - WebSocket实时通信                           │
└─────────────────────────────────────────────────┘
```

### 1.4 插件加载机制设计

```javascript
// plugins/core/plugin-manager.js
class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.extensions = new Map();
  }
  
  // 注册插件
  registerPlugin(name, plugin) {
    this.plugins.set(name, plugin);
  }
  
  // 注册扩展点
  registerExtension(point, extension) {
    if (!this.extensions.has(point)) {
      this.extensions.set(point, []);
    }
    this.extensions.get(point).push(extension);
  }
  
  // 执行扩展点
  executeExtensions(point, context) {
    const extensions = this.extensions.get(point) || [];
    return Promise.all(extensions.map(ext => ext(context)));
  }
}
```

## 3. HTML页面应用技术规范

### 3.1 HTML页面结构规范（集成Vant UI框架）

**基础HTML页面模板（符合HTML页面应用标准）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>设备管理 - SDKWork AIoT</title>
    
    <!-- 外部资源引入（注意加载顺序） -->
    <!-- 1. 样式文件先加载 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://fastly.jsdelivr.net/npm/vant@4/lib/index.css">
    <link rel="stylesheet" href="../assets/styles/main.css">
</head>
<body>
    <!-- 页面布局 -->
    <div id="app">
        <header class="app-header">
            <h1>SDKWork AIoT 设备管理</h1>
            <nav class="main-nav">
                <a href="index.html">首页</a>
                <a href="device.html">设备管理</a>
                <a href="settings.html">设置</a>
            </nav>
        </header>
        
        <main class="app-main">
            <!-- Vue3组件内嵌使用 -->
            <device-manager></device-manager>
        </main>
        
        <footer class="app-footer">
            <p>&copy; 2025 SDKWork AIoT. All rights reserved.</p>
        </footer>
    </div>

    <!-- 脚本文件引入（严格按依赖顺序） -->
    <!-- 2. 基础库先加载 -->
    <script src="https://fastly.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
    <script src="https://fastly.jsdelivr.net/npm/vant@4/lib/vant.min.js"></script>
    <script src="https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/pinia/3.0.3/pinia.iife.prod.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    
    <!-- 3. 自定义组件（依赖基础库） -->
    <script src="../components/business/device-manager.js"></script>
    <script src="../stores/device-store.js"></script>
    <script src="../services/device-service.js"></script>

    <!-- 4. 页面初始化脚本（最后加载） -->
    <script>
        // 等待所有资源加载完成
        document.addEventListener('DOMContentLoaded', function() {
            // 检查依赖是否已加载
            if (typeof Vue === 'undefined' || typeof vant === 'undefined' || typeof Pinia === 'undefined') {
                console.error('依赖库未正确加载，请检查CDN链接');
                return;
            }
            
            // Vue3应用初始化
            const { createApp } = Vue;
            const { createPinia } = Pinia;
            
            // 检查自定义组件是否已注册
            if (typeof window.DeviceManager === 'undefined') {
                console.error('DeviceManager组件未正确加载');
                return;
            }
            
            const app = createApp({
                components: {
                    DeviceManager: window.DeviceManager
                },
                
                data() {
                    return {
                        pageTitle: '设备管理'
                    };
                },
                
                mounted() {
                    console.log('设备管理页面已加载');
                    // 页面加载完成后显示提示
                    vant.showToast('页面加载完成');
                }
            });
            
            // 使用Vant UI框架
            app.use(vant);
            
            // 使用Pinia状态管理
            const pinia = createPinia();
            app.use(pinia);
            
            // 挂载应用
            app.mount('#app');
            
            console.log('SDKWork AIoT应用初始化完成');
        });
    </script>
</body>
</html>
```

**依赖加载顺序说明**：
1. **样式文件**：CSS文件最先加载，避免页面闪烁
2. **基础库**：Vue、Vant、Pinia等基础库按依赖顺序加载
3. **自定义组件**：依赖基础库的自定义组件
4. **服务层**：业务逻辑服务
5. **页面脚本**：最后执行页面初始化逻辑

**错误处理机制**：
```javascript
// 全局错误处理
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
    // 可以显示友好的错误提示
    if (typeof vant !== 'undefined') {
        vant.showToast('页面加载异常，请刷新重试');
    }
});

// 资源加载失败处理
document.addEventListener('DOMContentLoaded', function() {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        script.addEventListener('error', function() {
            console.error('脚本加载失败:', script.src);
            // 可以尝试备用CDN或显示错误提示
        });
    });
});
```

**备用CDN策略**：
```html
<!-- 主CDN失败时使用备用CDN -->
<script>
function loadScript(src, fallbackSrc) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => {
            console.warn(`主CDN ${src} 加载失败，尝试备用CDN`);
            const fallbackScript = document.createElement('script');
            fallbackScript.src = fallbackSrc;
            fallbackScript.onload = () => resolve();
            fallbackScript.onerror = () => reject(new Error(`所有CDN都加载失败: ${src}`));
            document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(script);
    });
}

// 使用示例
Promise.all([
    loadScript('https://fastly.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js', 
               'https://unpkg.com/vue@3/dist/vue.global.prod.js'),
    loadScript('https://fastly.jsdelivr.net/npm/vant@4/lib/vant.min.js',
               'https://unpkg.com/vant@4/lib/vant.min.js')
]).then(() => {
    console.log('所有依赖加载完成');
    // 初始化应用
}).catch(error => {
    console.error('依赖加载失败:', error);
});
</script>
```

### 3.2 Vue3组件开发规范（HTML页面应用标准）

**组件定义规范（全局变量方式）**：
```javascript
// components/device-card.js
(function() {
  'use strict';
  
  // 使用全局Vue对象
  const { defineComponent, ref, computed } = Vue;
  
  // 定义DeviceCard组件（全局注册）
  const DeviceCard = defineComponent({
    name: 'DeviceCard',
    
    template: `
      <div class="device-card" :class="{ 'device-online': device.status === 'online' }">
        <div class="device-header">
          <h3>{{ device.name }}</h3>
          <span class="device-status" :class="device.status">
            {{ device.status === 'online' ? '在线' : '离线' }}
          </span>
        </div>
        <div class="device-info">
          <p><strong>设备ID:</strong> {{ device.id }}</p>
          <p><strong>类型:</strong> {{ device.type }}</p>
          <p><strong>最后活跃:</strong> {{ formatTime(device.lastActive) }}</p>
        </div>
        <div class="device-actions">
          <van-button 
            type="primary" 
            size="small"
            @click="handleControl('start')"
            :disabled="device.status !== 'online'"
          >
            启动
          </van-button>
          <van-button 
            type="warning" 
            size="small"
            @click="handleControl('stop')"
            :disabled="device.status !== 'online'"
          >
            停止
          </van-button>
        </div>
      </div>
    `,
    
    props: {
      device: {
        type: Object,
        required: true
      }
    },
    
    emits: ['control'],
    
    methods: {
      handleControl(action) {
        this.$emit('control', this.device.id, action);
      },
      
      formatTime(timestamp) {
        return new Date(timestamp).toLocaleString('zh-CN');
      }
    }
  });
  
  // 全局注册组件
  window.DeviceCard = DeviceCard;
  
})();
```

**组件使用示例**：
```html
<!-- device-list.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>设备列表</title>
    <!-- 引入样式文件 -->
    <link rel="stylesheet" href="https://fastly.jsdelivr.net/npm/vant@4/lib/index.css">
    <link rel="stylesheet" href="../css/device.css">
</head>
<body>
    <div id="app">
        <h2>设备列表</h2>
        <div class="device-list">
            <device-card 
                v-for="device in devices" 
                :key="device.id"
                :device="device"
                @control="handleDeviceControl"
            />
        </div>
    </div>

    <!-- 引入Vue、Vant、Pinia和自定义组件 -->
    <script src="https://fastly.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
    <script src="https://fastly.jsdelivr.net/npm/vant@4/lib/vant.min.js"></script>
    <script src="https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/pinia/3.0.3/pinia.iife.prod.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="../components/device-card.js"></script>
    <script src="../stores/device-store.js"></script>

    <script>
        // 创建Vue应用
        const { createApp } = Vue;
        
        const app = createApp({
            data() {
                return {
                    devices: []
                };
            },
            
            methods: {
                async handleDeviceControl(deviceId, action) {
                    try {
                        await window.deviceService.control(deviceId, action);
                        vant.showToast('操作成功');
                        this.fetchDevices();
                    } catch (error) {
                        vant.showToast('操作失败');
                        console.error('设备控制错误:', error);
                    }
                },
                
                async fetchDevices() {
                    const store = window.useDeviceStore();
                    await store.fetchDevices();
                    this.devices = store.devices;
                }
            },
            
            mounted() {
                this.fetchDevices();
            }
        });

        // 注册全局组件
        app.component('device-card', window.DeviceCard);
        
        // 使用Vant和Pinia
        app.use(vant);
        app.use(Pinia.createPinia());
        
        // 挂载应用
        app.mount('#app');
    </script>
</body>
</html>
```

**CSS样式文件（device.css）**：
```css
/* css/device.css */
.device-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    background: white;
}

.device-card.device-online {
    border-left: 4px solid #07c160;
}

.device-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.device-status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
}

.device-status.online {
    background: #e7f7ef;
    color: #07c160;
}

.device-status.offline {
    background: #f5f5f5;
    color: #999;
}

.device-info p {
    margin: 4px 0;
    font-size: 14px;
}

.device-actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
}

.device-list {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}
```

### 3.3 Vant UI框架集成指南

**Vant组件库特性**：
- **移动端专用**：专为移动端设计的UI组件库，仅需兼容移动端样式
- **轻量高效**：按需引入，体积小巧
- **主题定制**：支持主题定制和样式覆盖
- **TypeScript支持**：完整的TypeScript类型定义

**常用Vant组件示例**：
```html
<!-- 表单组件 -->
<van-form @submit="onSubmit">
  <van-field
    v-model="username"
    name="用户名"
    label="用户名"
    placeholder="请输入用户名"
    :rules="[{ required: true, message: '请填写用户名' }]"
  />
  <van-field
    v-model="password"
    type="password"
    name="密码"
    label="密码"
    placeholder="请输入密码"
    :rules="[{ required: true, message: '请填写密码' }]"
  />
  <div style="margin: 16px;">
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
  </div>
</van-form>

<!-- 导航组件 -->
<van-tabbar v-model="active">
  <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
  <van-tabbar-item name="device" icon="apps-o">设备</van-tabbar-item>
  <van-tabbar-item name="settings" icon="setting-o">设置</van-tabbar-item>
</van-tabbar>

<!-- 反馈组件 -->
<van-button @click="showNotify">显示通知</van-button>

<script>
const showNotify = () => {
  vant.Notify({ type: 'success', message: '操作成功' });
}
</script>
```

**主题定制配置**：
```css
/* assets/styles/vant-theme.css */
:root {
  --van-primary-color: #007bff;
  --van-success-color: #28a745;
  --van-danger-color: #dc3545;
  --van-warning-color: #ffc107;
}

/* 自定义组件样式 */
.van-button--primary {
  border-radius: 8px;
}

.van-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

**命名规则**：
- 组件名：大驼峰命名法（如`DeviceCard`）
- 文件命名：与组件名一致（如`DeviceCard.html`）
- Props命名：小驼峰命名法（如`deviceData`）
- 组合式函数：小驼峰命名法（如`useDeviceControl`）

**面向对象的组件设计示例（HTML页面应用标准）**：
```javascript
// components/business/device-card.js
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
      <div class="device-card bg-white rounded-lg shadow-sm p-4">
        <!-- 设备头部 -->
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ deviceData.name }}</h3>
          <span :class="['status-indicator', statusColor]">
            <i class="fas fa-circle mr-1"></i>
            {{ isOnline ? '在线' : '离线' }}
          </span>
        </div>
        
        <!-- 设备信息 -->
        <div class="device-info text-sm text-gray-600 mb-4">
          <p>ID: {{ deviceData.id }}</p>
          <p>类型: {{ deviceData.type }}</p>
          <p>最后活动: {{ deviceData.lastActive }}</p>
        </div>
        
        <!-- 操作按钮 -->
        <div v-if="showActions" class="flex space-x-2">
          <button 
            @click="deviceController.controlDevice('toggle')"
            :disabled="isLoading"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <i class="fas fa-power-off mr-2"></i>
            {{ isLoading ? '操作中...' : '开关控制' }}
          </button>
          
          <button 
            @click="deviceController.showDetail()"
            class="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            <i class="fas fa-info-circle mr-2"></i>
            详情
          </button>
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
      const isLoading = ref(false);
      const deviceStatus = ref(props.deviceData.status);

      // 计算属性
      const isOnline = computed(() => deviceStatus.value === 'online');
      const statusColor = computed(() => isOnline.value ? 'text-green-600' : 'text-red-600');

      // 创建控制器实例
      const deviceController = new DeviceController(props.deviceData.id, emit);

      // 生命周期
      onMounted(() => {
        console.log('DeviceCard组件已挂载');
      });

      return {
        isLoading,
        deviceStatus,
        isOnline,
        statusColor,
        deviceController
      };
    }
  });
  
  // 全局注册组件
  window.DeviceCard = DeviceCard;
  
})();
```

**HTML页面使用示例**：
```html
<!-- device-list.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>设备管理</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://fastly.jsdelivr.net/npm/vant@4/lib/index.css">
    <link rel="stylesheet" href="../css/device.css">
</head>
<body>
    <div id="app">
        <h2>设备列表</h2>
        <div class="device-list">
            <device-card 
                v-for="device in devices" 
                :key="device.id"
                :device-data="device"
                :show-actions="true"
                @control="handleDeviceControl"
                @detail="showDeviceDetail"
            />
        </div>
    </div>

    <!-- 引入依赖 -->
    <script src="https://fastly.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
    <script src="https://fastly.jsdelivr.net/npm/vant@4/lib/vant.min.js"></script>
    <script src="../components/business/device-card.js"></script>
    <script src="../stores/device-store.js"></script>

    <script>
        const { createApp } = Vue;
        
        const app = createApp({
            data() {
                return {
                    devices: []
                };
            },
            
            methods: {
                async handleDeviceControl({ deviceId, action }) {
                    try {
                        await window.deviceService.control(deviceId, action);
                        vant.showToast('操作成功');
                    } catch (error) {
                        vant.showToast('操作失败');
                    }
                },
                
                showDeviceDetail(deviceId) {
                    window.location.href = `device-detail.html?id=${deviceId}`;
                },
                
                async fetchDevices() {
                    const store = window.useDeviceStore();
                    await store.fetchDevices();
                    this.devices = store.devices;
                }
            },
            
            mounted() {
                this.fetchDevices();
            }
        });

        app.component('device-card', window.DeviceCard);
        app.use(vant);
        app.mount('#app');
    </script>
</body>
</html>
```

### 3.4 Unocss原子化CSS应用指南

**主题配置**：
```javascript
// assets/styles/theme.js
export const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem'
  }
};
```

**常用工具类示例**：
```html
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 class="text-xl font-semibold text-gray-900">设备管理</h2>
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
    添加设备
  </button>
</div>
```

### 3.5 Pinia模块化方案（HTML页面应用标准）

**Store拆分策略（全局变量方式）**：
```javascript
// stores/device-store.js
(function() {
  'use strict';
  
  // 使用全局Pinia和Vue对象
  const { defineStore } = Pinia;
  const { ref, computed } = Vue;
  
  // 服务层（全局定义）
  const deviceService = window.deviceService || {
    async getDevices() {
      const response = await fetch('/api/devices');
      return response.json();
    },
    async addDevice(deviceData) {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData)
      });
      return response.json();
    },
    async control(deviceId, action, params) {
      const response = await fetch(`/api/devices/${deviceId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...params })
      });
      return response.json();
    }
  };
  
  // 全局注册服务
  window.deviceService = deviceService;
  
  // 定义Store（全局注册）
  const useDeviceStore = defineStore('device', () => {
    // 状态定义
    const devices = ref([]);
    const selectedDevice = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // 计算属性
    const onlineDevices = computed(() => 
      devices.value.filter(device => device.status === 'online')
    );
    
    const deviceCount = computed(() => devices.value.length);
    const hasDevices = computed(() => deviceCount.value > 0);

    // 异步操作
    const fetchDevices = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await deviceService.getDevices();
        devices.value = response.data || [];
      } catch (err) {
        error.value = err.message;
        console.error('获取设备列表失败:', err);
      } finally {
        loading.value = false;
      }
    };

    const addDevice = async (deviceData) => {
      try {
        const newDevice = await deviceService.addDevice(deviceData);
        devices.value.push(newDevice);
        return newDevice;
      } catch (err) {
        error.value = err.message;
        console.error('添加设备失败:', err);
        throw err;
      }
    };

    // 同步操作
    const selectDevice = (device) => {
      selectedDevice.value = device;
    };

    const clearSelection = () => {
      selectedDevice.value = null;
    };

    const removeDevice = (deviceId) => {
      devices.value = devices.value.filter(device => device.id !== deviceId);
      if (selectedDevice.value?.id === deviceId) {
        clearSelection();
      }
    };

    return {
      // 状态
      devices,
      selectedDevice,
      loading,
      error,
      
      // 计算属性
      onlineDevices,
      deviceCount,
      hasDevices,
      
      // 方法
      fetchDevices,
      addDevice,
      selectDevice,
      clearSelection,
      removeDevice
    };
  });
  
  // 全局注册Store
  window.useDeviceStore = useDeviceStore;
  
})();
```

**HTML页面中的Store使用示例**：
```html
<!-- device.html -->
<script>
// 在HTML页面中直接使用全局Store
const deviceStore = useDeviceStore();

// 页面加载时获取设备列表
document.addEventListener('DOMContentLoaded', async () => {
  await deviceStore.fetchDevices();
  console.log('设备数量:', deviceStore.deviceCount);
});

// 设备控制函数
async function controlDevice(deviceId, action) {
  try {
    await deviceService.control(deviceId, action);
    vant.showToast('操作成功');
    // 刷新设备列表
    await deviceStore.fetchDevices();
  } catch (error) {
    vant.showToast('操作失败');
    console.error('设备控制错误:', error);
  }
}
</script>
```

### 3.6 图标管理方案（组合式API封装）

**Font Awesome集成**：
```html
<!-- 在HTML头部引入 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- 图标组件封装（组合式API） -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => {
      const validIcons = ['home', 'user', 'cog', 'power-off', 'info-circle']
      return validIcons.includes(value)
    }
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  spin: {
    type: Boolean,
    default: false
  },
  pulse: {
    type: Boolean,
    default: false
  }
})

// 图标类名计算
const iconClass = computed(() => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const animationClass = props.spin ? 'fa-spin' : props.pulse ? 'fa-pulse' : ''
  
  return `fas fa-${props.name} ${sizeClasses[props.size]} ${animationClass}`
})

// 样式计算
const iconStyle = computed(() => ({
  color: props.color
}))

// 图标工具类
class IconManager {
  static getIcon(name, options = {}) {
    const icons = {
      device: 'microchip',
      online: 'circle-check',
      offline: 'circle-xmark',
      warning: 'triangle-exclamation'
    }
    return icons[name] || 'question-circle'
  }
  
  static getStatusIcon(status) {
    const statusIcons = {
      online: { icon: 'circle-check', color: 'text-green-600' },
      offline: { icon: 'circle-xmark', color: 'text-red-600' },
      warning: { icon: 'triangle-exclamation', color: 'text-yellow-600' }
    }
    return statusIcons[status] || { icon: 'question-circle', color: 'text-gray-600' }
  }
}
</script>

<template>
  <i 
    :class="iconClass" 
    :style="iconStyle"
    aria-hidden="true"
  ></i>
</template>

<style scoped>
i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease-in-out;
}
</style>
```

## 4. 工程化实施方案

### 4.1 自动化构建流水线

**环境变量配置**：
```javascript
// config/env/production.js
export default {
  API_BASE_URL: 'https://api.sdkwork.com',
  WS_BASE_URL: 'wss://ws.sdkwork.com',
  CDN_BASE_URL: 'https://cdn.sdkwork.com'
};

// config/env/development.js  
export default {
  API_BASE_URL: 'http://localhost:3000',
  WS_BASE_URL: 'ws://localhost:3001',
  CDN_BASE_URL: 'http://localhost:8080'
};
```

### 4.2 静态资源管理规范

**版本控制策略**：
```html
<!-- 带版本号的资源引用 -->
<link rel="stylesheet" href="/assets/css/app.css?v=1.0.0">
<script src="/assets/js/app.js?v=1.0.0"></script>

<!-- CDN部署策略 -->
<script>
const CDN_BASE = window.APP_CONFIG.CDN_BASE_URL;
const assets = {
  css: `${CDN_BASE}/css/app.css`,
  js: `${CDN_BASE}/js/app.js`
};
</script>
```

### 4.3 ADR决策记录模板

```markdown
# ADR-001: 采用HTML多页面应用架构

## 状态
已采纳

## 背景
项目需要支持快速部署和SEO优化，同时保持组件化开发体验。

## 决策
采用HTML多页面应用架构，结合Vue3组件化开发。

## 后果
- 优点：部署简单、SEO友好、页面加载快
- 缺点：页面间状态共享需要额外处理
```

### 4.4 API接口文档标准格式

```markdown
# 设备管理API

## 获取设备列表
- **URL**: `/api/devices`
- **Method**: `GET`
- **Response**:
```json
{
  "code": 200,
  "data": [
    {
      "id": "device-001",
      "name": "智能灯",
      "status": "online"
    }
  ]
}
```
```

## 5. 可维护性增强设计

### 5.1 全局错误处理机制

```javascript
// utils/error-handler.js
class ErrorHandler {
  static handle(error, context = '') {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };
    
    // 分类处理
    if (error instanceof NetworkError) {
      this.handleNetworkError(errorInfo);
    } else if (error instanceof BusinessError) {
      this.handleBusinessError(errorInfo);
    } else {
      this.handleUnknownError(errorInfo);
    }
    
    // 上报到服务端
    this.reportError(errorInfo);
  }
}
```

### 5.2 日志规范

**分级标准**：
```javascript
// utils/logger.js
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  static debug(message, data) {
    this.log(LogLevel.DEBUG, message, data);
  }
  
  static error(message, error) {
    this.log(LogLevel.ERROR, message, { error });
  }
}
```

### 5.3 TypeScript类型定义规范

**通用类型库设计**：
```typescript
// types/common.ts
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
}
```

### 5.4 单元测试方案

**测试目录结构**：
```
tests/
├── unit/
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/
│   ├── api/
│   └── stores/
└── e2e/
    ├── pages/
    └── workflows/
```

**覆盖率要求**：
- 组件测试覆盖率：≥80%
- 工具函数覆盖率：≥90%
- 服务层覆盖率：≥85%

## 6. 交付物清单

本方案包含以下交付物：
1. ✅ 完整的HTML页面应用目录结构示意图
2. ✅ HTML页面应用技术规范文档模板（含代码示例）
3. ✅ 工程化配置示例文件
4. ⬜ 更新后的README文档

下一步将更新README文档，包含HTML页面应用项目结构说明和各模块职责解析。