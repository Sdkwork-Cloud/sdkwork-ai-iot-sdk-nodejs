# Vue Example 项目开发规范

## 1. VO (Value Object) 规范体系

### 1.1 VO定义标准
- 所有数据模型必须使用VO结尾的接口定义
- VO接口必须继承自对应的API Response类型
- VO接口可以扩展业务需要的额外属性
- 所有VO定义必须放在对应的service/types文件中

### 1.2 VO使用规范
- 组件中必须使用具体的VO类型导入路径
- 禁止使用`@/services`等模糊导入路径
- Store中必须使用VO类型定义状态数据
- Service层必须返回VO类型的数据

### 1.3 示例VO定义
```typescript
// ✅ 正确示例
export interface UserVO extends UserResponse {
  avatar?: string;
  name?: string;
}

// ❌ 错误示例
export interface User extends UserResponse {
  avatar?: string;
}
```

## 2. Service层规范

### 2.1 Service类命名
- 使用`Service`后缀命名Service类
- Service类必须对应具体的业务领域

### 2.2 Service方法规范
- 方法必须返回VO类型或Promise<VO>
- 方法参数必须使用对应的Param类型
- 必须包含完整的错误处理逻辑

### 2.3 示例Service实现
```typescript
export class AuthAuthenticationService {
  async login(data: LoginParam): Promise<LoginResult> {
    // 实现逻辑
  }
}
```

## 3. Store层规范

### 3.1 Store状态定义
- 状态必须使用VO类型定义
- 必须包含完整的类型注解
- 状态结构必须清晰分层

### 3.2 Store Actions规范
- Action必须调用Service层方法
- 必须包含完整的错误处理
- 必须更新对应的VO状态

### 3.3 Store Getters规范
- Getter必须返回计算后的VO数据
- 必须包含完整的类型注解

## 4. API调用规范

### 4.1 参数传递
- 必须使用对应的Param类型
- 必须包含完整的类型注解

### 4.2 响应处理
- 必须验证响应数据的完整性
- 必须处理错误情况
- 必须返回VO类型数据

## 5. 组件开发规范

### 5.1 数据模型使用
- 组件必须使用VO类型定义props
- 必须使用Store中的VO数据
- 必须遵循单向数据流原则

### 5.2 事件处理
- 事件必须传递VO类型数据
- 必须包含完整的类型注解

## 6. 目录结构规范

```
src/
├── services/
│   └── src/
│       └── service/
│           └── {domain}/
│               ├── {subdomain}/
│               │   ├── {subdomain}.ts      # Service实现
│               │   └── types.ts            # VO定义
│               └── index.ts               # 导出入口
├── stores/
│   └── modules/
│       └── {domain}/
│           ├── index.ts                    # Store实现
│           └── types.ts                    # Store状态定义
└── components/
    └── {component}/
        ├── {component}.vue                 # 主组件
        └── components/                    # 子组件目录
```

## 7. 错误处理规范

### 7.1 Service层错误处理
- 必须验证响应数据完整性
- 必须抛出明确的错误信息
- 必须包含错误类型定义

### 7.2 Store层错误处理
- 必须捕获Service层错误
- 必须更新错误状态
- 必须提供错误恢复机制

## 8. 类型安全规范

### 8.1 类型导入
- 必须使用具体的导入路径
- 禁止使用any类型
- 必须包含完整的类型注解

### 8.2 类型检查
- 必须通过TypeScript编译检查
- 必须修复所有类型错误
- 必须保持类型一致性

## 9. 代码质量规范

### 9.1 代码风格
- 必须遵循项目代码风格
- 必须包含必要的注释
- 必须保持代码简洁性

### 9.2 性能优化
- 必须避免不必要的重渲染
- 必须使用计算属性优化性能
- 必须合理使用缓存机制

## 10. 测试规范

### 10.1 单元测试
- 必须包含Service层单元测试
- 必须包含Store层单元测试
- 必须包含组件单元测试

### 10.2 集成测试
- 必须包含完整的业务流程测试
- 必须包含错误场景测试
- 必须包含性能测试

---

*本文档将持续更新，确保项目开发遵循统一规范*