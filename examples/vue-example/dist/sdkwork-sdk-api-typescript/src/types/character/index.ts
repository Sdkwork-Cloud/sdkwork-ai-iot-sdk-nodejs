import { MediaResourceType } from '../../enums/resource';
import { CharacterType } from '../../enums/character';
import { CommonStatus } from '../../enums/enums';
import { BaseParam } from '../../types/base';
import { VideoMediaResource, ImageMediaResource } from '../../types/resource';
import { BaseResponse } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CharacterParam
 * 描述: 虚拟角色Form类，用于传递虚拟角色的业务参数
 */
export interface CharacterParam extends BaseParam {
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 角色名称
     */
    name?: string;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 角色描述（详细功能说明）
     */
    description?: string;
    /**
     * faceVideo字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResource
     * 描述: 角色头像视频（资源路径）
     */
    faceVideo?: VideoMediaResource;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.character.PlusCharacterType
     * 描述: 角色类型
     */
    type?: CharacterType;
    /**
     * interactionSettings字段
     * Java类型: java.lang.String
     * 描述: 交互设置（JSON格式，如{"语言":"中文","回复速度":"快"}）
     */
    interactionSettings?: string;
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: 角色版本（如v1.0.0）
     */
    version?: string;
    /**
     * faceImage字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 角色头像图片（资源路径）
     */
    faceImage?: ImageMediaResource;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 角色状态（启用/禁用/删除）
     */
    status?: CommonStatus;
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI智能体ID
     */
    agentId?: string|number;
    /**
     * personality字段
     * Java类型: java.lang.String
     * 描述: 角色个性特征（JSON格式，如{"性格":"开朗","爱好":"音乐"}）
     */
    personality?: string;
    /**
     * background字段
     * Java类型: java.lang.String
     * 描述: 角色背景故事（JSON格式，如{"出生地":"未来城市","经历":"AI工程师"}）
     */
    background?: string;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: CharacterResponse
 * 描述: 虚拟角色VO
 */
export interface CharacterResponse extends BaseResponse {
    /**
     * agentId字段
     * Java类型: java.lang.Long
     * 描述: 关联的AI智能体ID
     */
    agentId?: string|number;
    /**
     * description字段
     * Java类型: java.lang.String
     * 描述: 角色描述 (详细功能说明)
     */
    description?: string;
    /**
     * faceImage字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.ImageMediaResource
     * 描述: 角色头像图片
     */
    faceImage?: ImageMediaResource;
    /**
     * uuid字段
     * Java类型: java.lang.String
     * 描述: 通用唯一标识符UUID
     */
    uuid?: string;
    /**
     * version字段
     * Java类型: java.lang.String
     * 描述: 角色版本
     */
    version?: string;
    /**
     * type字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.character.PlusCharacterType
     * 描述: 角色类型
     */
    type?: CharacterType;
    /**
     * createdAt字段
     * Java类型: java.time.Instant
     * 描述: 创建时间
     */
    createdAt?: string;
    /**
     * background字段
     * Java类型: java.lang.String
     * 描述: 角色背景故事 (JSON格式存储)
     */
    background?: string;
    /**
     * personality字段
     * Java类型: java.lang.String
     * 描述: 角色个性特征 (JSON格式存储)
     */
    personality?: string;
    /**
     * id字段
     * Java类型: java.lang.Long
     * 描述: 角色ID
     */
    id?: string|number;
    /**
     * faceVideo字段
     * Java类型: com.sdkwork.spring.ai.plus.resource.VideoMediaResource
     * 描述: 角色头像视频
     */
    faceVideo?: VideoMediaResource;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 角色名称
     */
    name?: string;
    /**
     * status字段
     * Java类型: com.sdkwork.spring.ai.plus.enums.PlusCommonStatus
     * 描述: 角色状态
     */
    status?: CommonStatus;
    /**
     * updatedAt字段
     * Java类型: java.time.Instant
     * 描述: 最后更新时间
     */
    updatedAt?: string;
    /**
     * interactionSettings字段
     * Java类型: java.lang.String
     * 描述: 交互设置 (JSON格式存储)
     */
    interactionSettings?: string;
}
