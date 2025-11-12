import { BaseMsgContent } from '../../types/im.payload';
import { GeoPoint } from '../../types/data.pojo.entity';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: MsgLocationContent
 * 描述: IM位置消息内容类
 */
export interface MsgLocationContent extends BaseMsgContent {
    /**
     * address字段
     * Java类型: java.lang.String
     * 描述: 位置的地址信息
     * 示例: 北京市朝阳区某某街道
     */
    address?: string;
    /**
     * name字段
     * Java类型: java.lang.String
     * 描述: 位置或地点名称
     * 示例: 某某大厦
     */
    name?: string;
    /**
     * location字段
     * Java类型: com.sdkwork.spring.ai.plus.data.pojo.entity.GeoPoint
     * 描述: 地理位置坐标
     * 示例: {"longitude":116.3974,"latitude":39.9087}
     */
    location?: GeoPoint;
    /**
     * radius字段
     * Java类型: java.lang.Double
     * 描述: 位置精度半径(米)
     * 示例: 50.0
     */
    radius?: string|number;
}
