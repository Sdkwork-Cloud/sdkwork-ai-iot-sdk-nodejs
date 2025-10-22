# SDKWork AIoT Vue Example - Vue3 SPA应用

基于SDKWork AIoT SDK的Vue3单页应用示例，采用现代化的Vue3技术栈和最佳实践。

## 🚀 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5.x
- **路由管理**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **UI组件库**: Vant 4.x (移动端优先)
- **HTTP客户端**: Axios
- **样式预处理器**: SCSS
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
src/
├── components/          # 组件层
│   ├── layout/         # 布局组件
│   └── business/       # 业务组件
├── views/              # 页面组件
│   ├── auth/           # 认证页面
│   ├── device/         # 设备管理页面
│   ├── trade/          # 交易页面
│   └── user/           # 用户中心页面
├── stores/             # 状态管理
│   └── modules/        # 模块化Store
├── services/           # 服务层
│   ├── api/            # API接口服务
│   └── http/           # HTTP客户端
├── router/             # 路由配置
│   ├── routes/         # 路由定义
│   └── guards/         # 路由守卫
├── composables/        # 组合式函数
├── types/              # 类型定义
├── assets/             # 静态资源
│   ├── styles/         # 样式文件
│   └── images/         # 图片资源
└── utils/              # 工具函数
```

## 🎯 核心特性

### 1. 认证系统
- 用户登录/注册
- JWT Token管理
- 路由权限控制
- 自动刷新Token

### 2. 设备管理
- 设备列表展示
- 设备状态监控
- 实时控制指令
- 设备分组管理

### 3. 实时通信
- WebSocket连接管理
- 设备状态实时更新
- 消息推送通知
- 断线重连机制

### 4. 交易系统
- 设备购买流程
- 订单管理
- 支付集成
- 交易历史

### 5. 用户中心
- 个人信息管理
- 安全设置
- 使用统计
- 消息通知

## 🛠️ 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 🔧 配置说明

### 环境变量
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

### API配置
在环境变量中配置API基础地址：
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=ws://localhost:8080/ws
```

## 📋 开发规范

### 组件命名
- 使用PascalCase命名组件文件
- 业务组件放置在`components/business/`目录
- 布局组件放置在`components/layout/`目录

### 状态管理
- 使用Pinia进行状态管理
- Store按业务模块拆分
- 使用TypeScript进行类型定义

### 样式规范
- 使用SCSS预处理器
- 采用BEM命名规范
- 移动端优先的响应式设计

### 代码提交
- 遵循Conventional Commits规范
- 提交前运行代码检查
- 确保测试覆盖率

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交代码变更
4. 发起Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: support@sdkwork.com
- 文档: https://docs.sdkwork.com
- GitHub: https://github.com/sdkwork/aiot-sdk