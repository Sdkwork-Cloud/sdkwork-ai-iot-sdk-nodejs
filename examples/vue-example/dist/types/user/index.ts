import { UserStatus } from '../../enums/user';
import { OAuthProvider } from '../../enums/core.type';
import { GenderType, Platform } from '../../enums/enums';
import { MediaResourceType } from '../../enums/resource';
import { PermissionStatus, RoleStatus } from '../../enums/rbac';
import { BaseParam } from '../../types/base';
import { BaseResponse } from '../../types/base';
import { SocialInfoList } from '../../types/social';
import { ImageMediaResource, VideoMediaResource } from '../../types/resource';
import { Permission, Role } from '../../types/rbac';
import { UserMetadata } from '../../types/data.meta';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserParam
 * 描述: System User Form
 */
export interface UserParam extends BaseParam {
    /**
     * phone字段
     * Java类型: java.lang.String
     * 描述: 手机号码
     */
    phone?: string;
    /**
     * password字段
     * Java类型: java.lang.String
     * 描述: 密码(加密存储)
     */
    password?: string;
    /**
     * salt字段
     * Java类型: java.lang.String
     * 描述: 密码盐值(用于加密)
     */
    salt?: string;
    /**
     * roleIds字段
     * Java类型: java.util.Set
     * 描述: 用户角色ID集合
     */
    roleIds?: Array<string|number>;
    /**
     * email字段
     * Java类型: java.lang.String
     * 描述: 电子邮箱
     */
    email?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     * 描述: 用户名(唯一)
     */
    username?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.user.UserStatus
     * 描述: 用户状态(ACTIVE:活跃,INACTIVE:未激活,LOCKED:锁定,DELETED:已删除)
     */
    status?: UserStatus;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserOAuthAccountParam
 * 描述: 用户OAuth账号Form
 */
export interface UserOAuthAccountParam extends BaseParam {
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * accessToken字段
     * Java类型: java.lang.String
     * 描述: 访问令牌
     */
    accessToken?: string;
    /**
     * oauthProvider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OAuthProvider
     * 描述: OAuth平台类型
     */
    oauthProvider?: OAuthProvider;
    /**
     * unionId字段
     * Java类型: java.lang.String
     * 描述: 统一ID
     */
    unionId?: string;
    /**
     * openId字段
     * Java类型: java.lang.String
     * 描述: 开放平台ID
     */
    openId?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserResponse
 * 描述: System User Value Object
 */
export interface UserResponse extends BaseResponse {
    /**
     * gender字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusGenderType
     * 描述: 性别
     */
    gender?: GenderType;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 用户UUID
     */
    uuid?: string;
    /**
     * socialInfoList字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.SocialInfoList
     * 描述: 社交信息
     */
    socialInfoList?: SocialInfoList;
    /**
     * faceImage字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 用户头像
     */
    faceImage?: ImageMediaResource;
    /**
     * phone字段
     * Java类型: java.lang.String
     * 描述: 手机号码
     */
    phone?: string;
    /**
     * roleIds字段
     * Java类型: java.util.Set
     * 描述: 用户角色ID集合
     */
    roleIds?: Array<string|number>;
    /**
     * roleNames字段
     * Java类型: java.util.Set
     * 描述: 用户角色名称集合
     */
    roleNames?: Array<string>;
    /**
     * username字段
     * Java类型: java.lang.String
     * 描述: 用户名(唯一)
     */
    username?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.user.UserStatus
     * 描述: 用户状态(ACTIVE:活跃,INACTIVE:未激活,LOCKED:锁定,DELETED:已删除)
     */
    status?: UserStatus;
    /**
     * email字段
     * Java类型: java.lang.String
     * 描述: 电子邮箱
     */
    email?: string;
    /**
     * nickname字段
     * Java类型: java.lang.String
     * 描述: 昵称
     */
    nickname?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    id?: string|number;
    /**
     * faceVideo字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 用户视频介绍
     */
    faceVideo?: ImageMediaResource;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: User
 */
export interface User {
    /**
     * uuid字段
     * Java类型: java.lang.String
     */
    uuid?: string;
    /**
     * countryCode字段
     * Java类型: java.lang.String
     */
    countryCode?: string;
    /**
     * password字段
     * Java类型: java.lang.String
     */
    password?: string;
    /**
     * email字段
     * Java类型: java.lang.String
     */
    email?: string;
    /**
     * nickname字段
     * Java类型: java.lang.String
     */
    nickname?: string;
    /**
     * roles字段
     * Java类型: java.util.Set
     */
    roles?: Array<Role>;
    /**
     * cityCode字段
     * Java类型: java.lang.String
     */
    cityCode?: string;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     */
    updatedAt?: string;
    /**
     * gender字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusGenderType
     */
    gender?: GenderType;
    /**
     * districtCode字段
     * Java类型: java.lang.String
     */
    districtCode?: string;
    /**
     * metadata字段
     * Java类型: com.sdkwork.spring.ai.plus.data.meta.UserMetadata
     */
    metadata?: UserMetadata;
    /**
     * id字段
     * Java类型: java.lang.Long
     */
    id?: string|number;
    /**
     * scene字段
     * Java类型: java.lang.String
     */
    scene?: string;
    /**
     * platform字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatform
     */
    platform?: Platform;
    /**
     * faceImage字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     */
    faceImage?: ImageMediaResource;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     */
    createdAt?: string;
    /**
     * phone字段
     * Java类型: java.lang.String
     */
    phone?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.user.UserStatus
     */
    status?: UserStatus;
    /**
     * faceVideo字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResource
     */
    faceVideo?: VideoMediaResource;
    /**
     * provinceCode字段
     * Java类型: java.lang.String
     */
    provinceCode?: string;
    /**
     * salt字段
     * Java类型: java.lang.String
     */
    salt?: string;
    /**
     * socialInfoList字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.SocialInfoList
     */
    socialInfoList?: SocialInfoList;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: UserOAuthAccountResponse
 * 描述: 用户OAuth账户值对象
 */
export interface UserOAuthAccountResponse extends BaseResponse {
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 主键ID
     */
    id?: string|number;
    /**
     * accessToken字段
     * Java类型: java.lang.String
     * 描述: 访问令牌
     */
    accessToken?: string;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符
     */
    uuid?: string;
    /**
     * userId字段
     * Java类型: java.lang.Long
     * 描述: 用户ID
     */
    userId?: string|number;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * oauthProvider字段
     * Java类型: com.sdkwork.spring.ai.plus.core.type.OAuthProvider
     * 描述: OAuth平台类型
     */
    oauthProvider?: OAuthProvider;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * unionId字段
     * Java类型: java.lang.String
     * 描述: 统一ID
     */
    unionId?: string;
    /**
     * openId字段
     * Java类型: java.lang.String
     * 描述: 开放平台ID
     */
    openId?: string;
}
