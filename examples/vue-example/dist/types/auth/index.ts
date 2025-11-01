import { LoginType, RegisterType } from '../../enums/auth';
import { PlatformOwner } from '../../enums/enums';
import { OAuthProvider } from '../../enums/core.type';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: EmailVerificationParam
 * 描述: 邮箱验证请求表单
 */
export interface EmailVerificationParam extends BaseParam {
    /**
     * type字段
     * Java类型: java.lang.String
     * 描述: 验证类型
     * 示例: registration
     */
    type?: string;
    /**
     * email字段
     * Java类型: java.lang.String
     * 描述: 邮箱地址
     * 示例: user@example.com
     */
    email?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 验证码
     * 示例: 123456
     */
    code?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RefreshTokenParam
 * 描述: 刷新令牌请求表单
 */
export interface RefreshTokenParam extends BaseParam {
    /**
     * refreshToken字段
     * Java类型: java.lang.String
     * 描述: 刷新令牌
     * 示例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     */
    refreshToken?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RoleCheckParam
 * 描述: 角色检查请求表单
 */
export interface RoleCheckParam extends BaseParam {
    /**
     * role字段
     * Java类型: java.lang.String
     * 描述: 角色标识
     * 示例: ROLE_ADMIN
     */
    role?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ChangePasswordParam
 * 描述: 修改密码表单
 */
export interface ChangePasswordParam extends BaseParam {
    /**
     * oldPassword字段
     * Java类型: java.lang.String
     * 描述: 旧密码
     * 示例: OldPassword123
     */
    oldPassword?: string;
    /**
     * userId字段
     * Java类型: java.lang.String
     * 描述: 用户ID
     * 示例: 1
     */
    userId?: string;
    /**
     * newPassword字段
     * Java类型: java.lang.String
     * 描述: 新密码
     * 示例: NewPassword123
     */
    newPassword?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: LoginParam
 * 描述: 登录请求表单
 */
export interface LoginParam extends BaseParam {
    /**
     * captchaId字段
     * Java类型: java.lang.String
     * 描述: 验证码ID
     * 示例: abc123
     */
    captchaId?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.dto.auth.LoginType
     * 描述: 登录类型
     * 示例: USERNAME
     */
    type?: LoginType;
    /**
     * username字段
     * Java类型: java.lang.String
     * 描述: 用户名
     * 示例: user123
     */
    username?: string;
    /**
     * verificationCode字段
     * Java类型: java.lang.String
     * 描述: 验证码
     * 示例: 1234
     */
    verificationCode?: string;
    /**
     * email字段
     * Java类型: java.lang.String
     * 描述: 邮箱
     * 示例: user@example.com
     */
    email?: string;
    /**
     * invitationCode字段
     * Java类型: java.lang.String
     * 描述: 邀请码
     * 示例: 1234
     */
    invitationCode?: string;
    /**
     * rememberMe字段
     * Java类型: java.lang.Boolean
     * 描述: 记住我
     * 示例: true
     */
    rememberMe?: boolean;
    /**
     * phone字段
     * Java类型: java.lang.String
     * 描述: 手机号
     * 示例: 13812345678
     */
    phone?: string;
    /**
     * captcha字段
     * Java类型: java.lang.String
     * 描述: 验证码
     * 示例: 1234
     */
    captcha?: string;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatformOwner
     * 描述: 平台
     * 示例: TENANT
     */
    owner?: PlatformOwner;
    /**
     * password字段
     * Java类型: java.lang.String
     * 描述: 密码
     * 示例: password123
     */
    password?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RegisterParam
 * 描述: 用户注册请求表单
 */
export interface RegisterParam extends BaseParam {
    /**
     * password字段
     * Java类型: java.lang.String
     * 描述: 密码
     * 示例: password123
     */
    password?: string;
    /**
     * phone字段
     * Java类型: java.lang.String
     * 描述: 手机号
     * 示例: 13800138000
     */
    phone?: string;
    /**
     * captcha字段
     * Java类型: java.lang.String
     * 描述: 验证码
     * 示例: 1234
     */
    captcha?: string;
    /**
     * confirmPassword字段
     * Java类型: java.lang.String
     * 描述: 确认密码
     * 示例: password123
     */
    confirmPassword?: string;
    /**
     * email字段
     * Java类型: java.lang.String
     * 描述: 邮箱
     * 示例: user@example.com
     */
    email?: string;
    /**
     * invitationCode字段
     * Java类型: java.lang.String
     * 描述: 邀请码
     * 示例: 3209s232
     */
    invitationCode?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     * 描述: 用户名
     * 示例: user123
     */
    username?: string;
    /**
     * verificationCode字段
     * Java类型: java.lang.String
     * 描述: 验证码
     * 示例: 1234
     */
    verificationCode?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.auth.RegisterType
     * 描述: 注册类型
     * 示例: EMAIL
     */
    type?: RegisterType;
    /**
     * captchaId字段
     * Java类型: java.lang.String
     * 描述: 验证码ID
     * 示例: abc123
     */
    captchaId?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OAuthCallbackParam
 * 描述: OAuth第三方登录回调表单
 */
export interface OAuthCallbackParam extends BaseParam {
    /**
     * state字段
     * Java类型: java.lang.String
     * 描述: 状态参数，用于验证请求一致性
     * 示例: xyz123
     */
    state?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 授权码
     * 示例: authorization_code
     */
    code?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OAuthProvider
     * 描述: OAuth提供商类型
     * 示例: WECHAT
     */
    provider?: OAuthProvider;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OAuthLoginRequestParam
 * 描述: OAuth第三方登录请求表单
 */
export interface OAuthLoginRequestParam extends BaseParam {
    /**
     * redirectUri字段
     * Java类型: java.lang.String
     * 描述: 回调URL
     * 示例: https://yourdomain.com/oauth/callback
     */
    redirectUri?: string;
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OAuthProvider
     * 描述: OAuth提供商类型
     * 示例: WECHAT
     */
    provider?: OAuthProvider;
    /**
     * scope字段
     * Java类型: java.lang.String
     * 描述: 授权范围
     * 示例: snsapi_userinfo
     */
    scope?: string;
    /**
     * state字段
     * Java类型: java.lang.String
     * 描述: 状态参数，用于防止CSRF攻击
     * 示例: xyz123
     */
    state?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PhoneVerificationParam
 * 描述: 手机验证请求表单
 */
export interface PhoneVerificationParam extends BaseParam {
    /**
     * type字段
     * Java类型: java.lang.String
     * 描述: 验证类型
     * 示例: registration
     */
    type?: string;
    /**
     * phone字段
     * Java类型: java.lang.String
     * 描述: 手机号
     * 示例: 13800138000
     */
    phone?: string;
    /**
     * code字段
     * Java类型: java.lang.String
     * 描述: 验证码
     * 示例: 123456
     */
    code?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PermissionCheckParam
 * 描述: 权限检查请求表单
 */
export interface PermissionCheckParam extends BaseParam {
    /**
     * permission字段
     * Java类型: java.lang.String
     * 描述: 权限标识
     * 示例: user:read
     */
    permission?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PasswordResetRequestParam
 * 描述: 密码重置请求表单
 */
export interface PasswordResetRequestParam extends BaseParam {
    /**
     * email字段
     * Java类型: java.lang.String
     * 描述: 用户邮箱
     * 示例: user@example.com
     */
    email?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PasswordResetParam
 * 描述: 密码重置表单
 */
export interface PasswordResetParam extends BaseParam {
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: 密码重置令牌
     * 示例: 8f7e6d5c4b3a2109
     */
    token?: string;
    /**
     * newPassword字段
     * Java类型: java.lang.String
     * 描述: 新密码
     * 示例: Password123
     */
    newPassword?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SendVerificationCodeParam
 * 描述: 发送验证码请求表单
 */
export interface SendVerificationCodeParam extends BaseParam {
    /**
     * type字段
     * Java类型: java.lang.String
     * 描述: 验证类型
     * 示例: registration
     */
    type?: string;
    /**
     * identifier字段
     * Java类型: java.lang.String
     * 描述: 标识符（邮箱或手机号）
     * 示例: user@example.com
     */
    identifier?: string;
    /**
     * method字段
     * Java类型: java.lang.String
     * 描述: 验证方式
     * 示例: email
     */
    method?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: RegisterResultResponse
 * 描述: 注册结果
 */
export interface RegisterResultResponse extends BaseResponse {
    /**
     * user字段
     * Java类型: com.sdkwork.spring.ai.plus.vo.auth.AuthUserVO
     */
    user?: AuthUserResponse;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: LoginResultResponse
 * 描述: 认证令牌信息
 */
export interface LoginResultResponse extends BaseResponse {
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: 访问令牌
     * 示例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     */
    token?: string;
    /**
     * refreshToken字段
     * Java类型: java.lang.String
     * 描述: 刷新令牌
     * 示例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     */
    refreshToken?: string;
    /**
     * refreshExpiresIn字段
     * Java类型: java.lang.Long
     * 描述: 刷新令牌过期时间(秒)
     * 示例: 86400
     */
    refreshExpiresIn?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户id
     * 示例: 1
     */
    userId?: string|number;
    /**
     * user字段
     * Java类型: com.sdkwork.spring.ai.plus.vo.auth.AuthUserVO
     * 描述: 用户信息
     * 示例: 1
     */
    user?: AuthUserResponse;
    /**
     * expiresIn字段
     * Java类型: java.lang.Long
     * 描述: 访问令牌过期时间(秒)
     * 示例: 3600
     */
    expiresIn?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: VerificationResponse
 * 描述: 验证响应视图对象
 */
export interface VerificationResponse extends BaseResponse {
    /**
     * message字段
     * Java类型: java.lang.String
     * 描述: 消息
     * 示例: 验证成功
     */
    message?: string;
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: 验证令牌
     * 示例: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     */
    token?: string;
    /**
     * success字段
     * Java类型: boolean
     * 描述: 是否验证成功
     * 示例: true
     */
    success?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: OAuthLoginResponse
 */
export interface OAuthLoginResponse {
    /**
     * provider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OAuthProvider
     */
    provider?: OAuthProvider;
    /**
     * authUrl字段
     * Java类型: java.lang.String
     */
    authUrl?: string;
    /**
     * expiresIn字段
     * Java类型: java.lang.Integer
     */
    expiresIn?: number;
    /**
     * state字段
     * Java类型: java.lang.String
     */
    state?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TokenDTO
 */
export interface TokenDTO {
    /**
     * token字段
     * Java类型: java.lang.String
     */
    token?: string;
    /**
     * refreshToken字段
     * Java类型: java.lang.String
     */
    refreshToken?: string;
    /**
     * refreshExpiresIn字段
     * Java类型: java.lang.Long
     */
    refreshExpiresIn?: string|number;
    /**
     * userId字段
     * Java类型: java.lang.Long
     */
    userId?: string|number;
    /**
     * im字段
     * Java类型: java.util.Map
     */
    im?: Map<string, Object>;
    /**
     * expiresIn字段
     * Java类型: java.lang.Long
     */
    expiresIn?: string|number;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: AuthUserResponse
 * 描述: 用户信息视图对象
 */
export interface AuthUserResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     * 示例: 10001
     */
    id?: string|number;
    /**
     * username字段
     * Java类型: java.lang.String
     * 描述: 用户名
     * 示例: zhangSan
     */
    username?: string;
    /**
     * email字段
     * Java类型: java.lang.String
     * 描述: 电子邮箱
     * 示例: zhangsan@example.com
     */
    email?: string;
    /**
     * phone字段
     * Java类型: java.lang.String
     * 描述: 手机号码
     * 示例: 13800138000
     */
    phone?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: PasswordResetResultResponse
 * 描述: 密码重置响应视图对象
 */
export interface PasswordResetResultResponse extends BaseResponse {
    /**
     * success字段
     * Java类型: boolean
     * 描述: 是否成功
     * 示例: true
     */
    success?: boolean;
    /**
     * expiresIn字段
     * Java类型: java.lang.Long
     * 描述: 过期时间（秒）
     * 示例: 3600
     */
    expiresIn?: string|number;
    /**
     * token字段
     * Java类型: java.lang.String
     * 描述: 重置令牌
     * 示例: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     */
    token?: string;
    /**
     * message字段
     * Java类型: java.lang.String
     * 描述: 消息
     * 示例: 密码重置邮件已发送，请查收
     */
    message?: string;
}
