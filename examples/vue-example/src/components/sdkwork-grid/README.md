# SdkworkGrid 网格布局组件

功能完整的网格布局组件，兼容 Vant Grid 组件 API，支持丰富的布局和交互功能。

## 特性

- ✅ 完全兼容 Vant Grid 组件 API
- ✅ 支持 light/dark/auto 主题模式
- ✅ 灵活的网格布局配置
- ✅ 响应式设计支持
- ✅ 卡片模式、边框模式、悬停效果
- ✅ 加载状态和空状态支持
- ✅ TypeScript 完整支持
- ✅ 移动端优化

## 基础用法

```vue
<template>
  <SdkworkGrid :column="4" :gutter="16">
    <SdkworkGridItem
      v-for="item in 8"
      :key="item"
      :text="`功能 ${item}`"
      :icon="'material-symbols:apps'"
    />
  </SdkworkGrid>
</template>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | - | 网格标题 |
| `description` | `string` | - | 网格描述 |
| `type` | `string` | - | 布局方式，可选值为 flex |
| `justify` | `string` | `'start'` | Flex 主轴对齐方式 |
| `align` | `string` | `'top'` | Flex 交叉轴对齐方式 |
| `wrap` | `boolean` | `true` | 是否自动换行 |
| `gutter` | `string \| number` | `0` | 栅格间隔 |
| `column` | `number` | `4` | 列数 |
| `bordered` | `boolean` | `false` | 是否显示边框 |
| `clickable` | `boolean` | `false` | 是否可点击 |
| `center` | `boolean` | `false` | 是否居中显示 |
| `square` | `boolean` | `false` | 是否将格子固定为正方形 |
| `reverse` | `boolean` | `false` | 是否将格子内容顺序反转 |
| `card` | `boolean` | `false` | 是否卡片模式 |
| `hoverable` | `boolean` | `false` | 是否显示悬停效果 |
| `loading` | `boolean` | `false` | 是否显示加载状态 |
| `empty` | `boolean` | `false` | 是否为空状态 |
| `emptyText` | `string` | `'您可以尝试刷新页面或调整筛选条件'` | 空状态提示文字 |
| `customStyle` | `Record<string, string \| number>` | - | 自定义样式 |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| `onClick` | `(event: Event) => void` | - | 点击事件回调 |

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `click` | `event: Event` | 点击事件 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| `default` | 网格项内容 |
| `header` | 网格顶部区域 |
| `footer` | 网格底部区域 |
| `loading` | 加载状态内容 |
| `empty` | 空状态内容 |

## 主题配置

```vue
<template>
  <!-- 自动主题 -->
  <SdkworkGrid theme-mode="auto">
    <SdkworkGridItem text="自动主题" />
  </SdkworkGrid>
  
  <!-- 浅色主题 -->
  <SdkworkGrid theme-mode="light">
    <SdkworkGridItem text="浅色主题" />
  </SdkworkGrid>
  
  <!-- 深色主题 -->
  <SdkworkGrid theme-mode="dark">
    <SdkworkGridItem text="深色主题" />
  </SdkworkGrid>
</template>
```

## 高级用法

### 卡片模式网格

```vue
<template>
  <SdkworkGrid 
    :column="3" 
    :gutter="16" 
    card 
    hoverable
    title="功能菜单"
    description="选择您需要的功能"
  >
    <SdkworkGridItem
      v-for="item in menuItems"
      :key="item.id"
      :text="item.text"
      :icon="item.icon"
      :label="item.label"
      clickable
      @click="handleMenuClick(item)"
    />
  </SdkworkGrid>
</template>
```

### 带角标的网格项

```vue
<template>
  <SdkworkGrid :column="4">
    <SdkworkGridItem
      text="消息"
      icon="material-symbols:chat"
      :badge="5"
      clickable
    />
    <SdkworkGridItem
      text="通知"
      icon="material-symbols:notifications"
      dot
      clickable
    />
  </SdkworkGrid>
</template>
```

### 加载状态和空状态

```vue
<template>
  <SdkworkGrid 
    :loading="loading" 
    :empty="!loading && items.length === 0"
    :empty-text="emptyText"
  >
    <SdkworkGridItem
      v-for="item in items"
      :key="item.id"
      :text="item.name"
      :icon="item.icon"
    />
  </SdkworkGrid>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const items = ref([])
const emptyText = ref('暂无数据，请稍后重试')

onMounted(async () => {
  try {
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 2000))
    items.value = [] // 模拟空数据
  } finally {
    loading.value = false
  }
})
</script>
```

### 自定义内容

使用默认插槽可以完全自定义网格项的内容和布局：

```vue
<template>
  <SdkworkGrid :columns="3" :gutter="16">
    <!-- 完全自定义的网格项 -->
    <SdkworkGridItem clickable @click="handleClick(1)">
      <div class="custom-item">
        <img src="/images/item1.jpg" alt="自定义图片" class="custom-image" />
        <h3 class="custom-title">自定义标题</h3>
        <p class="custom-desc">自定义描述文本</p>
        <button class="custom-button">点击操作</button>
      </div>
    </SdkworkGridItem>
    
    <!-- 另一个自定义项 -->
    <SdkworkGridItem clickable @click="handleClick(2)">
      <div class="custom-card">
        <Icon icon="material-symbols:star" class="custom-icon" />
        <div class="custom-content">
          <h4>星标项目</h4>
          <span>这是一个使用默认插槽完全自定义的网格项</span>
        </div>
      </div>
    </SdkworkGridItem>
  </SdkworkGrid>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const handleClick = (id) => {
  console.log('点击了项目:', id)
}
</script>

<style scoped>
.custom-item {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.custom-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.custom-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.custom-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
  flex-grow: 1;
}

.custom-button {
  padding: 8px 16px;
  background-color: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.custom-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  background-color: var(--bg-secondary);
  border-radius: 8px;
}

.custom-icon {
  font-size: 48px;
  color: var(--accent-blue);
  margin-bottom: 12px;
}

.custom-content {
  text-align: center;
}

.custom-content h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.custom-content span {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
```

当使用默认插槽时，网格项将完全由插槽内容决定，不会显示默认的图标和文本布局。这允许开发者创建完全自定义的网格项内容。

### 响应式网格

```vue
<template>
  <SdkworkGrid :column="responsiveColumns" :gutter="16">
    <SdkworkGridItem
      v-for="item in 12"
      :key="item"
      :text="`项目 ${item}`"
      :icon="'material-symbols:widgets'"
    />
  </SdkworkGrid>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const responsiveColumns = ref(4)

const updateColumns = () => {
  const width = window.innerWidth
  if (width < 768) {
    responsiveColumns.value = 2
  } else if (width < 1024) {
    responsiveColumns.value = 3
  } else {
    responsiveColumns.value = 4
  }
}

onMounted(() => {
  updateColumns()
  window.addEventListener('resize', updateColumns)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateColumns)
})
</script>
```

### 自定义插槽内容

```vue
<template>
  <SdkworkGrid :column="3">
    <template #header>
      <div class="custom-header">
        <h3>自定义头部</h3>
        <p>这里是自定义的头部内容</p>
      </div>
    </template>
    
    <SdkworkGridItem>
      <template #icon>
        <div class="custom-icon">🎯</div>
      </template>
      <template #text>
        <div class="custom-text">
          <span class="text-primary">自定义文本</span>
          <span class="text-secondary">副标题</span>
        </div>
      </template>
    </SdkworkGridItem>
    
    <template #footer>
      <div class="custom-footer">
        <van-button type="primary" size="small">查看更多</van-button>
      </div>
    </template>
  </SdkworkGrid>
</template>

<style scoped>
.custom-header {
  text-align: center;
  padding: 16px;
}

.custom-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.custom-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-primary {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.text-secondary {
  font-size: 12px;
  color: #969799;
  margin-top: 2px;
}

.custom-footer {
  text-align: center;
  padding: 16px;
}
</style>
```