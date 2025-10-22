# SDKWork AIoT Browser Example

基于SDKWork AIoT SDK的移动端HTML页面应用示例。

## 项目概述

这是一个专为移动端设计的HTML页面应用，采用多页面架构（MPA），支持完整的AIoT设备管理和聊天功能。

## 技术栈

- **前端框架**: Vue 3 (CDN引入)
- **UI组件库**: Vant 4 (移动端UI组件)
- **状态管理**: Pinia (Vue状态管理)
- **样式**: 纯CSS (移动端适配)
- **构建方式**: 纯HTML应用，无需构建工具

## 项目结构

```
src/
├── index.html                 # 首页
├── assets/                   # 静态资源
│   ├── styles/              # 样式文件
│   └── images/              # 图片资源
├── components/              # 组件目录
│   ├── layout/              # 布局组件
│   └── business/            # 业务组件
├── pages/                   # 页面目录
│   ├── auth/                # 认证相关页面
│   ├── device/              # 设备管理页面
│   ├── user/                # 用户中心页面
│   ├── chat/                # 聊天页面
│   └── trade/               # 交易页面
├── services/                # 服务层
│   ├── auth_service.js      # 认证服务
│   ├── device_service.js    # 设备服务
│   ├── user_service.js      # 用户服务
│   └── chat_service.js      # 聊天服务
├── stores/                  # 状态管理
│   ├── auth-store.js        # 认证状态
│   ├── device-store.js      # 设备状态
│   ├── user-store.js        # 用户状态
│   ├── chat-store.js        # 聊天状态
│   └── app-store.js         # 应用状态
├── types/                   # 类型定义
│   └── index.js             # 类型工具
└── utils/                   # 工具函数
    └── validate.js          # 验证工具
```

## 功能特性

### 认证系统
- 用户登录/注册
- Token认证管理
- 自动登录支持
- 安全退出

### 设备管理
- 设备列表展示
- 设备状态监控
- 设备控制操作
- 设备添加/删除

### 聊天功能
- 实时消息通信
- 多会话管理
- 图片/语音消息
- AI助手集成

### 用户中心
- 个人信息管理
- 头像上传
- 密码修改
- 设置配置

## 快速开始

### 环境要求
- 现代浏览器 (Chrome 80+, Firefox 75+, Safari 13+)
- 支持ES6+语法
- 支持WebSocket

### 启动方式

#### 方式一：使用Python内置服务器
```bash
cd examples/browser-example
python -m http.server 8080
```

#### 方式二：使用Node.js http-server
```bash
cd examples/browser-example
npx http-server src -p 8080 -c-1
```

#### 方式三：直接打开文件
直接在浏览器中打开 `src/index.html` 文件（部分功能可能受限）

### 访问地址
- 首页: http://localhost:8080
- 登录页: http://localhost:8080/pages/auth/login.html
- 设备管理: http://localhost:8080/pages/device/list.html
- 聊天页面: http://localhost:8080/pages/chat/index.html

## 开发指南

### 页面开发规范
1. 每个页面使用独立的HTML文件
2. 遵循移动端设计规范
3. 使用Vant UI组件库
4. 集成Pinia状态管理

### 服务开发规范
1. 服务文件命名: `{service_name}_service.js`
2. 使用面向对象设计
3. 统一错误处理机制
4. 支持HTTP和WebSocket两种通信方式

### 状态管理规范
1. 使用Pinia进行状态管理
2. 按业务域划分Store
3. 支持持久化存储
4. 统一的加载和错误状态

## API集成

### 认证API
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户退出
- `POST /api/auth/refresh` - Token刷新

### 设备API
- `GET /api/devices` - 获取设备列表
- `GET /api/devices/{id}` - 获取设备详情
- `POST /api/devices` - 添加设备
- `PUT /api/devices/{id}` - 更新设备
- `DELETE /api/devices/{id}` - 删除设备
- `POST /api/devices/{id}/control` - 控制设备

### 用户API
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `PUT /api/users/password` - 修改密码
- `POST /api/users/avatar` - 上传头像

### 聊天API
- `POST /api/chat/message` - 发送消息
- `GET /api/chat/history` - 获取聊天历史
- `POST /api/chat/upload/image` - 上传图片
- `POST /api/chat/upload/voice` - 上传语音

## 移动端适配

### 响应式设计
- 使用Viewport meta标签
- 相对单位布局
- 触摸友好的交互设计

### 性能优化
- 图片懒加载
- 代码分割
- 缓存策略

### 用户体验
- 加载状态提示
- 错误处理机制
- 离线支持

## 部署说明

### 静态部署
将整个 `src` 目录部署到Web服务器即可。

### CDN配置
确保以下CDN资源可访问：
- Vue 3: https://fastly.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js
- Vant 4: https://fastly.jsdelivr.net/npm/vant@4/lib/vant.min.js
- Pinia: https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/pinia/3.0.3/pinia.iife.prod.min.js

### 安全配置
- 启用HTTPS
- 配置CORS策略
- 设置安全头信息

## 常见问题

### Q: 页面无法正常加载？
A: 检查CDN资源是否可访问，确保网络连接正常。

### Q: 登录后页面跳转异常？
A: 检查认证状态管理，确保Token正确存储。

### Q: 设备控制无响应？
A: 检查WebSocket连接状态，确认设备服务正常运行。

### Q: 移动端样式异常？
A: 检查Viewport配置，确保使用移动端适配的CSS。

## 技术支持

如有问题请提交Issue或联系开发团队。

## 许可证

MIT License