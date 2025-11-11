# SdkworkGroupItem 群组项组件

一个单独的群组项组件，用于在群组列表中展示单个群组的信息和操作。

## 功能特性

- ✅ 群组基本信息展示（名称、描述、头像）
- ✅ 群组标签显示
- ✅ 入群价格显示（免费/付费）
- ✅ 群组成员数量和活跃度统计
- ✅ 官方认证和热门标识
- ✅ 加入群组功能
- ✅ 点击事件支持
- ✅ 响应式设计

## 安装和使用

### 基本用法

```vue
<template>
  <div>
    <sdkwork-group-item
      :group="group"
      :show-join-button="true"
      @click="handleClick"
      @join="handleJoin"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SdkworkGroupItem from '@/components/sdkwork-group-item/sdkwork-group-item.vue'
import type { Group } from '@/components/sdkwork-group-item/types'

// 群组数据
const group = ref({
  id: '1',
  name: '前端技术交流群',
  description: '分享前端技术、讨论最新前端框架、解决技术难题、共同进步的技术交流群组。',
  avatar: 'https://picsum.photos/seed/frontend/200/200.jpg',
  tags: ['前端', '技术', '交流'],
  memberCount: 3586,
  messageCount: 128560,
  price: 0,
  isOfficial: true,
  isVerified: true,
  isHot: true,
  type: 'official',
  createdAt: '2022-01-15',
})

// 事件处理
const handleClick = (group) => {
  console.log('点击群组:', group)
}

const handleJoin = (group) => {
  console.log('加入群组:', group)
}
</script>
```

### 在群组列表中使用

```vue
<template>
  <div class="group-list">
    <sdkwork-group-item
      v-for="group in groups"
      :key="group.id"
      :group="group"
      @click="handleGroupClick"
      @join="handleJoinGroup"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SdkworkGroupItem from '@/components/sdkwork-group-item/sdkwork-group-item.vue'
import type { Group } from '@/components/sdkwork-group-item/types'

const groups = ref([
  // 群组数据...
])

const handleGroupClick = (group) => {
  console.log('点击群组:', group)
}

const handleJoinGroup = (group) => {
  console.log('加入群组:', group)
}
</script>
```

## API 文档

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| group | 群组数据对象 | `Group` | 必填 |
| showJoinButton | 是否显示加入按钮 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|---------|
| click | 点击群组项时触发 | `(group: Group) => void` |
| join | 点击加入按钮时触发 | `(group: Group) => void` |

### Group 数据结构

```typescript
interface Group {
  id: string | number                    // 群组ID
  name: string                          // 群组名称
  description: string                    // 群组描述
  avatar?: string                       // 群组头像URL
  tags?: string[]                      // 群组标签
  memberCount: number                  // 成员数量
  maxMembers?: number                  // 最大成员数
  messageCount: number                 // 消息数量
  price: number                        // 入群价格
  originalPrice?: number               // 原价（用于折扣显示）
  isOfficial?: boolean                 // 是否为官方群组
  isVerified?: boolean                 // 是否已认证
  isHot?: boolean                     // 是否为热门群组
  isJoined?: boolean                  // 是否已加入
  joining?: boolean                   // 是否正在加入
  type?: 'public' | 'private' | 'official'  // 群组类型
  createdAt?: string | Date           // 创建时间
}
```

## 自定义样式

组件提供了以下CSS变量，可以通过覆盖这些变量来自定义样式：

```css
:root {
  --bg-card: #ffffff;          /* 卡片背景色 */
  --bg-gray: #f5f5f5;          /* 灰色背景 */
  --text-primary: #323233;     /* 主要文字颜色 */
  --text-secondary: #969799;   /* 次要文字颜色 */
  --text-light: #999999;       /* 浅色文字 */
  --color-primary: #1989fa;    /* 主题色 */
  --color-success: #07c160;    /* 成功色 */
  --color-danger: #ee0a24;     /* 危险色 */
  --border-color: #ebedf0;     /* 边框色 */
}
```

## 注意事项

1. 群组头像建议使用正方形图片，比例 1:1
2. 价格为0时会显示"免费"标签，大于0时会显示价格
3. 群组标签最多显示3个，多余的会显示"+n"的数量提示
4. 成员数量超过10000会显示为"x.xw"，超过1000会显示为"x.xk"
5. 组件依赖Vant组件库，使用前请确保已正确安装和引入