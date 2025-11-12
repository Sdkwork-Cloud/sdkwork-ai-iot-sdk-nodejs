import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TwitterInfo
 */
export interface TwitterInfo extends BaseObject {
    /**
     * bio字段
     * Java类型: java.lang.String
     */
    bio?: string;
    /**
     * location字段
     * Java类型: java.lang.String
     */
    location?: string;
    /**
     * userId字段
     * Java类型: java.lang.String
     */
    userId?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * website字段
     * Java类型: java.lang.String
     */
    website?: string;
    /**
     * avatarUrl字段
     * Java类型: java.lang.String
     */
    avatarUrl?: string;
    /**
     * displayName字段
     * Java类型: java.lang.String
     */
    displayName?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: WhatsAppInfo
 */
export interface WhatsAppInfo extends BaseObject {
    /**
     * profilePictureUrl字段
     * Java类型: java.lang.String
     */
    profilePictureUrl?: string;
    /**
     * phoneNumber字段
     * Java类型: java.lang.String
     */
    phoneNumber?: string;
    /**
     * displayName字段
     * Java类型: java.lang.String
     */
    displayName?: string;
    /**
     * userId字段
     * Java类型: java.lang.String
     */
    userId?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: SocialInfoList
 */
export interface SocialInfoList extends BaseObject {
    /**
     * whatsapp字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.WhatsAppInfo
     */
    whatsapp?: WhatsAppInfo;
    /**
     * twitter字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.TwitterInfo
     */
    twitter?: TwitterInfo;
    /**
     * tiktok字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.TikTokInfo
     */
    tiktok?: TikTokInfo;
    /**
     * facebook字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.FacebookInfo
     */
    facebook?: FacebookInfo;
    /**
     * wechat字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.WechatInfo
     */
    wechat?: WechatInfo;
    /**
     * telegram字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.TelegramInfo
     */
    telegram?: TelegramInfo;
    /**
     * instagram字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.InstagramInfo
     */
    instagram?: InstagramInfo;
    /**
     * linkedin字段
     * Java类型: com.sdkwork.spring.ai.plus.objects.social.LinkedInInfo
     */
    linkedin?: LinkedInInfo;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: InstagramInfo
 */
export interface InstagramInfo extends BaseObject {
    /**
     * website字段
     * Java类型: java.lang.String
     */
    website?: string;
    /**
     * profilePictureUrl字段
     * Java类型: java.lang.String
     */
    profilePictureUrl?: string;
    /**
     * isBusinessAccount字段
     * Java类型: java.lang.Boolean
     */
    isBusinessAccount?: boolean;
    /**
     * fullName字段
     * Java类型: java.lang.String
     */
    fullName?: string;
    /**
     * bio字段
     * Java类型: java.lang.String
     */
    bio?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * userId字段
     * Java类型: java.lang.String
     */
    userId?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: FacebookInfo
 */
export interface FacebookInfo extends BaseObject {
    /**
     * avatarUrl字段
     * Java类型: java.lang.String
     */
    avatarUrl?: string;
    /**
     * city字段
     * Java类型: java.lang.String
     */
    city?: string;
    /**
     * gender字段
     * Java类型: java.lang.String
     */
    gender?: string;
    /**
     * country字段
     * Java类型: java.lang.String
     */
    country?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * email字段
     * Java类型: java.lang.String
     */
    email?: string;
    /**
     * userId字段
     * Java类型: java.lang.String
     */
    userId?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     */
    name?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: WechatInfo
 */
export interface WechatInfo extends BaseObject {
    /**
     * nickname字段
     * Java类型: java.lang.String
     */
    nickname?: string;
    /**
     * openId字段
     * Java类型: java.lang.String
     */
    openId?: string;
    /**
     * avatarUrl字段
     * Java类型: java.lang.String
     */
    avatarUrl?: string;
    /**
     * city字段
     * Java类型: java.lang.String
     */
    city?: string;
    /**
     * gender字段
     * Java类型: java.lang.Integer
     */
    gender?: number;
    /**
     * province字段
     * Java类型: java.lang.String
     */
    province?: string;
    /**
     * unionId字段
     * Java类型: java.lang.String
     */
    unionId?: string;
    /**
     * country字段
     * Java类型: java.lang.String
     */
    country?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TelegramInfo
 */
export interface TelegramInfo extends BaseObject {
    /**
     * userId字段
     * Java类型: java.lang.Long
     */
    userId?: string|number;
    /**
     * languageCode字段
     * Java类型: java.lang.String
     */
    languageCode?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * fullName字段
     * Java类型: java.lang.String
     */
    fullName?: string;
    /**
     * phoneNumber字段
     * Java类型: java.lang.String
     */
    phoneNumber?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TikTokInfo
 */
export interface TikTokInfo extends BaseObject {
    /**
     * likeCount字段
     * Java类型: java.lang.Long
     */
    likeCount?: string|number;
    /**
     * bio字段
     * Java类型: java.lang.String
     */
    bio?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * userId字段
     * Java类型: java.lang.String
     */
    userId?: string;
    /**
     * followerCount字段
     * Java类型: java.lang.Long
     */
    followerCount?: string|number;
    /**
     * followingCount字段
     * Java类型: java.lang.Long
     */
    followingCount?: string|number;
    /**
     * displayName字段
     * Java类型: java.lang.String
     */
    displayName?: string;
    /**
     * avatarUrl字段
     * Java类型: java.lang.String
     */
    avatarUrl?: string;
    /**
     * isVerified字段
     * Java类型: java.lang.Boolean
     */
    isVerified?: boolean;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: LinkedInInfo
 */
export interface LinkedInInfo extends BaseObject {
    /**
     * company字段
     * Java类型: java.lang.String
     */
    company?: string;
    /**
     * industry字段
     * Java类型: java.lang.String
     */
    industry?: string;
    /**
     * location字段
     * Java类型: java.lang.String
     */
    location?: string;
    /**
     * position字段
     * Java类型: java.lang.String
     */
    position?: string;
    /**
     * fullName字段
     * Java类型: java.lang.String
     */
    fullName?: string;
    /**
     * username字段
     * Java类型: java.lang.String
     */
    username?: string;
    /**
     * userId字段
     * Java类型: java.lang.String
     */
    userId?: string;
    /**
     * headline字段
     * Java类型: java.lang.String
     */
    headline?: string;
    /**
     * education字段
     * Java类型: java.lang.String
     */
    education?: string;
    /**
     * profilePictureUrl字段
     * Java类型: java.lang.String
     */
    profilePictureUrl?: string;
}
