import { Platform, PlatformOwner } from '../../enums/enums';
import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: ShardingContext
 */
export interface ShardingContext extends BaseObject {
    /**
     * tenant_id字段
     * Java类型: java.lang.Long
     */
    tenant_id?: string|number;
    /**
     * user_id字段
     * Java类型: java.lang.Long
     */
    user_id?: string|number;
    /**
     * platform字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatform
     */
    platform?: Platform;
    /**
     * organization_id字段
     * Java类型: java.lang.Long
     */
    organization_id?: string|number;
    /**
     * owner字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusPlatformOwner
     */
    owner?: PlatformOwner;
}
