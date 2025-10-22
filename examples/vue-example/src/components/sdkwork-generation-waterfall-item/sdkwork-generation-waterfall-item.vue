<template>
  <div
    class="sdkwork-generation-waterfall-item"
    :class="[
      themeClass,
      {
        'sdkwork-generation-waterfall-item--selected': selected,
        'sdkwork-generation-waterfall-item--clickable': clickable,
        'sdkwork-generation-waterfall-item--disabled': disabled
      }
    ]"
    :style="computedStyle"
    @click="handleClick"
  >
    <!-- 图片区域 -->
    <div class="generation-item__image">
      <slot name="image" :item="item" :index="index">
        <img 
          :src="itemImage" 
          :alt="itemTitle" 
          class="generation-item__image-content"
          @error="handleImageError"
        />
        <!-- 遮罩层 -->
        <div v-if="showStats" class="generation-item__overlay">
          <div class="generation-item__stats">
            <span v-if="itemViews !== undefined" class="generation-item__stat">
              <van-icon name="eye-o" />
              {{ formatNumber(itemViews) }}
            </span>
            <span v-if="itemLikes !== undefined" class="generation-item__stat">
              <van-icon name="good-job-o" />
              {{ formatNumber(itemLikes) }}
            </span>
          </div>
        </div>
      </slot>
    </div>

    <!-- 内容区域 -->
    <div class="generation-item__content">
      <!-- 标题 -->
      <div v-if="showTitle" class="generation-item__title">
        <slot name="title" :item="item" :index="index">
          <h4 class="generation-item__title-text">{{ itemTitle }}</h4>
        </slot>
      </div>

      <!-- 描述 -->
      <div v-if="showDescription" class="generation-item__description">
        <slot name="description" :item="item" :index="index">
          <p class="generation-item__description-text">{{ itemDescription }}</p>
        </slot>
      </div>

      <!-- 元信息 -->
      <div v-if="showMeta" class="generation-item__meta">
        <slot name="meta" :item="item" :index="index">
          <span v-if="showTime" class="generation-item__time">{{ formattedTime }}</span>
          <van-tag 
            v-if="showStatus && itemStatus" 
            :type="statusTagType"  
            class="generation-item__status"
          >
            {{ statusText }}
          </van-tag>
        </slot>
      </div>

      <!-- 操作区域 -->
      <div v-if="showActions" class="generation-item__actions">
        <slot name="actions" :item="item" :index="index" />
      </div>
    </div>

    <!-- 选中状态指示器 -->
    <div v-if="selected && selectable" class="generation-item__selection">
      <van-icon name="success" class="generation-item__selection-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props 定义
interface Props {
  /** 数据项 */
  item: any
  /** 索引 */
  index: number
  /** 是否选中 */
  selected?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否显示统计信息 */
  showStats?: boolean
  /** 是否显示标题 */
  showTitle?: boolean
  /** 是否显示描述 */
  showDescription?: boolean
  /** 是否显示元信息 */
  showMeta?: boolean
  /** 是否显示时间 */
  showTime?: boolean
  /** 是否显示状态 */
  showStatus?: boolean
  /** 是否显示操作区域 */
  showActions?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 图片字段名 */
  imageField?: string
  /** 标题字段名 */
  titleField?: string
  /** 描述字段名 */
  descriptionField?: string
  /** 浏览量字段名 */
  viewsField?: string
  /** 点赞数字段名 */
  likesField?: string
  /** 状态字段名 */
  statusField?: string
  /** 时间字段名 */
  timeField?: string
  /** 自定义样式 */
  customStyle?: Record<string, string | number>
  /** 点击事件处理器 */
  onClick?: (item: any, index: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  themeMode: 'auto',
  showStats: true,
  showTitle: true,
  showDescription: true,
  showMeta: true,
  showTime: true,
  showStatus: true,
  showActions: false,
  clickable: true,
  disabled: false,
  selectable: false,
  imageField: 'image',
  titleField: 'title',
  descriptionField: 'description',
  viewsField: 'views',
  likesField: 'likes',
  statusField: 'status',
  timeField: 'createdTime'
})

// Emit 事件定义
interface Emits {
  (e: 'click', item: any, index: number): void
}

const emit = defineEmits<Emits>()

// 插槽定义 - 使用更兼容的语法
interface Slots {
  /** 图片插槽 */
  image?: (props: { item: any; index: number }) => any
  /** 标题插槽 */
  title?: (props: { item: any; index: number }) => any
  /** 描述插槽 */
  description?: (props: { item: any; index: number }) => any
  /** 元信息插槽 */
  meta?: (props: { item: any; index: number }) => any
  /** 操作插槽 */
  actions?: (props: { item: any; index: number }) => any
}

const slots = defineSlots<Slots>()

// 主题处理
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-generation-waterfall-item--dark' : 'sdkwork-generation-waterfall-item--light'
})

// 计算属性 - 数据字段提取
const itemImage = computed(() => props.item[props.imageField])
const itemTitle = computed(() => props.item[props.titleField] || `作品 ${props.index + 1}`)
const itemDescription = computed(() => props.item[props.descriptionField] || '')
const itemViews = computed(() => props.item[props.viewsField])
const itemLikes = computed(() => props.item[props.likesField])
const itemStatus = computed(() => props.item[props.statusField])
const itemTime = computed(() => props.item[props.timeField])

// 计算属性 - 显示控制
const showTitle = computed(() => props.showTitle && itemTitle.value)
const showDescription = computed(() => props.showDescription && itemDescription.value)
const showTime = computed(() => props.showTime && itemTime.value)

// 状态相关计算
const statusText = computed(() => {
  const statusMap: Record<string, string> = {
    'published': '已发布',
    'draft': '草稿',
    'pending': '审核中',
    'rejected': '已拒绝'
  }
  return statusMap[itemStatus.value] || itemStatus.value
})

const statusTagType = computed(() => {
  const typeMap: Record<string, 'success' | 'warning' | 'danger' | 'primary'> = {
    'published': 'success',
    'draft': 'warning',
    'pending': 'primary',
    'rejected': 'danger'
  }
  return typeMap[itemStatus.value] || 'primary'
})

// 格式化时间
const formattedTime = computed(() => {
  if (!itemTime.value) return ''
  
  const date = new Date(itemTime.value)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60 * 1000) {
    return '刚刚'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  } else {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  }
})

// 计算样式
const computedStyle = computed(() => ({
  ...props.customStyle,
  cursor: props.clickable && !props.disabled ? 'pointer' : 'default'
}))

// 事件处理
const handleClick = () => {
  if (props.disabled) return
  
  emit('click', props.item, props.index)
  props.onClick?.(props.item, props.index)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0xMjUgODBDMTM5LjM2MyA4MCAxNTAgOTAuNjM2NyAxNTAgMTA1QzE1MCAxMTkuMzYzIDEzOS4zNjMgMTMwIDEyNSAxMzBDMTEwLjYzNyAxMzAgMTAwIDExOS4zNjMgMTAwIDEwNUMxMDAgOTAuNjM2NyAxMTAuNjM3IDgwIDEyNSA4MFoiIGZpbGw9IiNEOEQ4RDgiLz4KPHRleHQgeD0iMTUwIiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+5Zu+54KHR0lGPC90ZXh0Pgo8L3N2Zz4K'
}

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 暴露方法
defineExpose({
  /** 获取项数据 */
  getItem: () => props.item,
  /** 获取项索引 */
  getIndex: () => props.index,
  /** 获取项标题 */
  getTitle: () => itemTitle.value,
  /** 获取项描述 */
  getDescription: () => itemDescription.value,
  /** 获取项图片 */
  getImage: () => itemImage.value,
  /** 获取项状态 */
  getStatus: () => itemStatus.value,
  /** 获取项时间 */
  getTime: () => itemTime.value
})
</script>

<style scoped lang="scss">
.sdkwork-generation-waterfall-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &.sdkwork-generation-waterfall-item--light {
    --generation-item-bg: #ffffff;
    --generation-item-text: #323233;
    --generation-item-border: #ebedf0;
    --generation-item-shadow: rgba(0, 0, 0, 0.1);
    --generation-item-overlay: rgba(0, 0, 0, 0.5);
    --generation-item-stats-text: #ffffff;
  }
  
  &.sdkwork-generation-waterfall-item--dark {
    --generation-item-bg: #2a2a2a;
    --generation-item-text: #ffffff;
    --generation-item-border: #3a3a3a;
    --generation-item-shadow: rgba(255, 255, 255, 0.1);
    --generation-item-overlay: rgba(0, 0, 0, 0.7);
    --generation-item-stats-text: #ffffff;
  }
  
  background: var(--generation-item-bg);
  border: 1px solid var(--generation-item-border);
  box-shadow: 0 2px 8px var(--generation-item-shadow);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--generation-item-shadow);
  }
  
  &.sdkwork-generation-waterfall-item--clickable:hover {
    cursor: pointer;
  }
  
  &.sdkwork-generation-waterfall-item--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &.sdkwork-generation-waterfall-item--selected {
    border-color: var(--van-primary-color);
    box-shadow: 0 0 0 2px var(--van-primary-color);
  }
  
  .generation-item__image {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 66.67%; /* 3:2 比例 */
    overflow: hidden;
    
    .generation-item__image-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .generation-item__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--generation-item-overlay);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      padding: 8px;
    }
    
    &:hover .generation-item__overlay {
      opacity: 1;
    }
    
    .generation-item__stats {
      display: flex;
      gap: 12px;
      
      .generation-item__stat {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--generation-item-stats-text);
        font-size: 12px;
        
        .van-icon {
          font-size: 14px;
        }
      }
    }
  }
  
  .generation-item__content {
    padding: 12px;
    
    .generation-item__title {
      margin-bottom: 8px;
      
      .generation-item__title-text {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--generation-item-text);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    
    .generation-item__description {
      margin-bottom: 12px;
      
      .generation-item__description-text {
        margin: 0;
        font-size: 12px;
        color: var(--van-gray-6);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    
    .generation-item__meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .generation-item__time {
        font-size: 11px;
        color: var(--van-gray-5);
      }
      
      .generation-item__status {
        flex-shrink: 0;
      }
    }
    
    .generation-item__actions {
      margin-top: 12px;
    }
  }
  
  .generation-item__selection {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--van-primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .generation-item__selection-icon {
      color: white;
      font-size: 14px;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-generation-waterfall-item {
    .generation-item__content {
      padding: 10px;
      
      .generation-item__title .generation-item__title-text {
        font-size: 13px;
      }
      
      .generation-item__description .generation-item__description-text {
        font-size: 11px;
      }
    }
  }
}

@media (min-width: 1024px) {
  .sdkwork-generation-waterfall-item {
    .generation-item__content {
      padding: 16px;
      
      .generation-item__title .generation-item__title-text {
        font-size: 15px;
      }
      
      .generation-item__description .generation-item__description-text {
        font-size: 13px;
      }
    }
  }
}
</style>