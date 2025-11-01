import { BaseObject } from '../../types/base';
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TreeParentMetadata
 */
export interface TreeParentMetadata extends BaseObject {
    /**
     * parentIds字段
     * Java类型: java.util.List
     */
    parentIds?: Array<string|number>;
}
/**
 * 自动生成的TypeScript接口定义
 * 对应Java类: TreeNode
 */
export interface TreeNode<T> {
    /**
     * children字段
     * Java类型: java.util.List
     */
    children?: Array<TreeNode<any>>;
    /**
     * data字段
     * Java类型: com.sdkwork.spring.ai.plus.tree.PlusTreeSupport
     */
    data?: any;
    /**
     * parent字段
     * Java类型: com.sdkwork.spring.ai.plus.tree.PlusTreeNode
     */
    parent?: TreeNode<any>;
}
