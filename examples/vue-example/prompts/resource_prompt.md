# SDKWork SDK API TypeScript 资源说明

## 目录结构概览

SDKWork SDK API TypeScript 是一个完整的TypeScript API客户端库，提供了丰富的功能接口。以下是该库的目录结构说明：

### 根目录文件

- `index.ts` - 库的主入口文件
- `package.json` - 项目依赖配置
- `package-lock.json` - 锁定依赖版本
- `README.md` - 项目说明文档
- `tsconfig.json` - TypeScript配置文件

### 源代码目录 (`src/`)

#### API接口目录 (`src/api/`)

API接口模块是整个库的核心，包含了各种业务功能的API接口：

**主要API模块：**
- `account/` - 账户相关API
  - `account.ts` - 账户基础操作
  - `history/` - 账户历史记录
- `agent/` - AI代理相关API
  - `agent.ts` - 代理基础操作
  - `chat/` - 代理聊天接口
  - `tool/` - 代理工具接口
- `auth/` - 认证授权相关API
  - `auth.ts` - 认证基础操作
  - `authentication/` - 身份认证
  - `authorization/` - 授权管理
  - `oauth/` - OAuth认证
  - `verification/` - 验证码等验证功能
- `card/` - 卡片相关API
  - `card.ts` - 卡片基础操作
  - `template/` - 卡片模板
- `channel/` - 渠道相关API
  - `channel.ts` - 渠道基础操作
  - `account/` - 渠道账户
  - `resource/` - 渠道资源
- `chat/` - 聊天相关API
  - `chat.ts` - 聊天基础操作
  - `message/` - 消息管理
- `file/` - 文件相关API
  - `file.ts` - 文件基础操作
  - `content/` - 文件内容
  - `part/` - 文件分片
- `generation/` - 生成相关API
  - `generation.ts` - 生成基础操作
  - `content/` - 内容生成
- `im/` - 即时通讯相关API
  - `im.ts` - IM基础操作
  - `group/` - 群组管理
  - `message/` - 消息处理
- `iot/` - 物联网相关API
  - `iot.ts` - IoT基础操作
  - `device/` - 设备管理
  - `event/` - 事件处理
  - `thing/` - 物管理
- `oss/` - 对象存储相关API
  - `oss.ts` - OSS基础操作
  - `bucket/` - 存储桶
  - `files/` - 文件存储
- `trade/` - 交易相关API
  - `trade.ts` - 交易基础操作
  - `order/` - 订单管理
  - `payment/` - 支付处理
  - `refund/` - 退款管理
  - `shopping/` - 购物车
- `user/` - 用户相关API
  - `user.ts` - 用户基础操作
  - `card/` - 用户卡片
  - `coupon/` - 用户优惠券
  - `oauth/` - 用户OAuth认证
- `vip/` - VIP相关API
  - `vip.ts` - VIP基础操作
  - `benefit/` - VIP权益
  - `level/` - VIP等级
  - `point/` - VIP积分
  - `recharge/` - VIP充值
  - `user/` - VIP用户

其他API模块包括：`apikey`, `app`, `article`, `attribute`, `character`, `collection`, `column`, `comments`, `conversation`, `coupon`, `datasource`, `detail`, `disk`, `feedback`, `feeds`, `image`, `invitation`, `knowledge_base`, `member`, `message`, `model`, `music`, `net`, `news`, `organization`, `participant`, `ppt`, `product`, `project`, `prompt`, `rbac`, `record`, `role`, `schema`, `search`, `sharding`, `short_url`, `sku`, `table`, `tenant`, `tool`, `usage`, `video`, `voice`, `vote`等。

**核心API文件：**
- `api.ts` - API客户端基础配置和通用方法
- `client.ts` - HTTP客户端实现
- `index.ts` - API模块导出

#### 枚举目录 (`src/enums/`)

包含系统中使用的所有枚举定义：

主要枚举模块包括：
- `account/` - 账户相关枚举
- `agent/` - AI代理相关枚举
- `ai/` - AI相关枚举
- `article/` - 文章相关枚举
- `audio/` - 音频相关枚举
- `auth/` - 认证相关枚举
- `card/` - 卡片相关枚举
- `chat/` - 聊天相关枚举
- `comments/` - 评论相关枚举
- `com.sdkwork.ai.iot.*` - 物联网相关枚举
- `content/` - 内容相关枚举
- `conversation/` - 对话相关枚举
- `core.type/` - 核心类型枚举
- `coupon/` - 优惠券相关枚举
- `datasource/` - 数据源相关枚举
- `files/` - 文件相关枚举
- `im.type/` - 即时通讯类型枚举
- `invitation/` - 邀请相关枚举
- `models/` - 模型相关枚举
- `organization/` - 组织相关枚举
- `platform/` - 平台相关枚举
- `ppt/` - PPT相关枚举
- `ppt.types.enums/` - PPT类型枚举
- `product/` - 产品相关枚举
- `rbac/` - 基于角色的访问控制枚举
- `resource/` - 资源相关枚举
- `trade/` - 交易相关枚举
- `user/` - 用户相关枚举
- `vectorstore/` - 向量存储相关枚举
- `video/` - 视频相关枚举
- `vip/` - VIP相关枚举
- `voice/` - 语音相关枚举

#### 类型定义目录 (`src/types/`)

包含系统中使用的所有TypeScript类型定义：

主要类型模块包括：
- `account/` - 账户相关类型
- `agent/` - AI代理相关类型
- `agent.config/` - 代理配置类型
- `app/` - 应用相关类型
- `article/` - 文章相关类型
- `audio/` - 音频相关类型
- `auth/` - 认证相关类型
- `base/` - 基础类型
- `card/` - 卡片相关类型
- `category/` - 分类相关类型
- `chat/` - 聊天相关类型
- `collection/` - 集合相关类型
- `com.sdkwork.ai.iot.*` - 物联网相关类型
- `common/` - 通用类型
- `config/` - 配置相关类型
- `config.resource/` - 配置资源类型
- `conversation/` - 对话相关类型
- `coupon/` - 优惠券相关类型
- `datasource/` - 数据源相关类型
- `datasource.config/` - 数据源配置类型
- `definition.tool/` - 工具定义类型
- `detail/` - 详情相关类型
- `event/` - 事件相关类型
- `files/` - 文件相关类型
- `generation/` - 生成相关类型
- `im/` - 即时通讯相关类型
- `im.payload.*` - 即时通讯载荷类型
- `image/` - 图像相关类型
- `invitation/` - 邀请相关类型
- `io/` - 输入输出相关类型
- `knowledge/` - 知识库相关类型
- `memory/` - 内存相关类型
- `message/` - 消息相关类型
- `model/` - 模型相关类型
- `models/` - 多模型相关类型
- `music/` - 音乐相关类型
- `net/` - 网络相关类型
- `net.objects/` - 网络对象类型
- `openai.api/` - OpenAI API相关类型
- `order/` - 订单相关类型
- `organization/` - 组织相关类型
- `payment/` - 支付相关类型
- `platform/` - 平台相关类型
- `ppt/` - PPT相关类型
- `ppt.data/` - PPT数据类型
- `ppt.types/` - PPT类型
- `product/` - 产品相关类型
- `project/` - 项目相关类型
- `prompt/` - 提示词相关类型
- `rbac/` - 基于角色的访问控制类型
- `record/` - 记录相关类型
- `resource/` - 资源相关类型
- `response/` - 响应相关类型
- `sharding/` - 分片相关类型
- `social/` - 社交相关类型
- `tags/` - 标签相关类型
- `tenant/` - 租户相关类型
- `thing/` - 物相关类型
- `token/` - 令牌相关类型
- `tool/` - 工具相关类型
- `trade/` - 交易相关类型
- `tree/` - 树结构相关类型
- `url/` - URL相关类型
- `usage/` - 使用情况相关类型
- `user/` - 用户相关类型
- `video/` - 视频相关类型
- `vip/` - VIP相关类型
- `voice/` - 语音相关类型
- `vote/` - 投票相关类型
- `web/` - Web相关类型

## 使用说明

### 安装和导入

```typescript
import { ApiClient } from 'sdkwork-sdk-api-typescript';
```

### 基本使用

```typescript
// 初始化客户端
const client = new ApiClient({
  baseURL: 'https://api.sdkwork.com',
  apiKey: 'your-api-key'
});

// 使用各种API
const account = await client.api.account.getAccountInfo();
const agents = await client.api.agent.listAgents();
```

### 特点

1. **模块化设计** - 各功能模块独立，按需引入
2. **完整类型定义** - 所有API请求和响应都有完整的TypeScript类型
3. **异步支持** - 基于Promise的异步API调用
4. **错误处理** - 统一的错误处理机制

## 注意事项

1. 使用前请确保已正确配置API密钥和服务端点
2. 部分API可能需要特定的权限才能访问
3. 请参考具体API文档了解参数和返回值详情