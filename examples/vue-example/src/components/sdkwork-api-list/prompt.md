开发一个基于Vue 3、setup语法糖和TypeScript的通用列表查询组件${sdkwork-api-list}，具体要求如下：

功能特性：
1. 组件属性配置：
   - 使用withDefaults定义props默认值：
     - api：必传的API请求方法（类型：() => Promise<Page<T>>）
     - params：请求参数对象（类型：Record<string, any>），需符合Spring Boot分页查询标准
     - selectable：是否支持行选择（默认false，类型：boolean）
     - deletable：是否支持行删除（默认false，类型：boolean）
     - searchable：是否支持顶部搜索（默认false，类型：boolean）
     - pageSize：默认每页显示条数（类型：number）

2. 事件处理：
   - @select：行选择事件（返回选中行数据，类型：T）
   - @delete：行删除事件（返回删除行数据，类型：T）
   - @search：搜索事件（返回搜索关键词，类型：string）
   - @load：数据加载完成事件（返回当前页数据，类型：Page<T>）

3. 交互功能实现：
   - 集成Vant 4.x的下拉刷新组件（sdkwork-pull-refresh）
   - 实现上拉加载更多功能（基于IntersectionObserver API）
   - 搜索功能需实现300ms防抖处理
   - 分页参数需符合Spring Boot Pageable标准（page/size/sort等）
   - 内置加载状态管理（loading/error/empty状态）

4. 组件封装规范：
   - 基于Vant 4.x UI组件库实现
   - 提供默认的列表项渲染模板
   - 支持通过插槽自定义内容：
     - #default：自定义列表项内容（作用域参数：{item: T, index: number}）
     - #header：列表顶部区域
     - #footer：列表底部区域
     - #empty：空状态显示内容
     - #loading：加载状态显示内容
   - 严格定义泛型类型T表示列表项数据类型

5. 开发要求：
   - 使用TypeScript严格模式（strict: true）
   - 完整类型定义：
     - Props类型（包含泛型参数T）
     - Emits类型定义
     - Slots类型定义
     - Spring Boot分页结构Page<T>类型定义
   - 组件文档包含：
     - 属性说明表（含默认值和类型）
     - 事件说明表（含参数类型）
     - 插槽使用示例（含作用域参数说明）
     - 基础用法示例代码（含API接口示例）
   - 实现响应式布局，适配移动端和PC端显示

6. API规范：
   - 输入参数需符合Spring Boot Pageable标准：
     - page：当前页码（从0开始）
     - size：每页条数
     - sort：排序字段（格式："field,direction"）
   - 输出结果需符合Spring Boot Page<T>结构：
     - content：T[] 数据列表
     - totalElements：number 总记录数
     - totalPages：number 总页数
     - number：number 当前页码
     - size：number 每页条数