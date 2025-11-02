<template>
  <div
    class="sdkwork-generation-waterfall-item"
    :class="[
      `theme-${themeMode}`,
      { 'is-selected': selected },
      { 'is-clickable': clickable }
    ]"
    @click="handleClick"
  >
    <!-- 图片/预览区域 -->
    <div class="item-preview">
      <slot name="image" :item="item" :index="index">
        <div class="preview-image">
          <img
            v-if="item.result?.thumbnail || item.result?.url"
            :src="item.result?.thumbnail || item.result?.url"
            :alt="item.title"
            @error="handleImageError"
          />
          <div v-else class="preview-placeholder">
            <van-icon :name="getTypeIcon(item.type)" size="32" />
          </div>
        </div>
      </slot>
      
      <!-- 状态标签 -->
      <div v-if="showStatus" class="status-badge">
        <van-tag :type="getStatusType(item.status)" >
          {{ getStatusText(item.status) }}
        </van-tag>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="item-content">
      <!-- 标题 -->
      <div class="item-title">
        <slot name="title" :item="item" :index="index">
          <h3>{{ item.title }}</h3>
        </slot>
      </div>

      <!-- 描述 -->
      <div v-if="item.description" class="item-description">
        <slot name="description" :item="item" :index="index">
          <p>{{ item.description }}</p>
        </slot>
      </div>

      <!-- 元信息 -->
      <div v-if="showMeta" class="item-meta">
        <slot name="meta" :item="item" :index="index">
          <div class="meta-info">
            <span class="meta-type">
              <van-icon :name="getTypeIcon(item.type)" size="12" />
              {{ getTypeText(item.type) }}
            </span>
            <span class="meta-time">
              {{ formatTime(item.createdAt) }}
            </span>
          </div>
        </slot>
      </div>

      <!-- 统计信息 -->
      <div v-if="showStats" class="item-stats">
        <slot name="stats" :item="item" :index="index">
          <div class="stats-info">
            <span class="stat">
              <van-icon name="eye-o" size="12" />
              {{ item.viewCount || 0 }}
            </span>
            <span class="stat">
              <van-icon name="good-job-o" size="12" />
              {{ item.likeCount || 0 }}
            </span>
          </div>
        </slot>
      </div>

      <!-- 操作区域 -->
      <div class="item-actions">
        <slot name="actions" :item="item" :index="index">
          <van-button
            v-if="clickable"
            size="mini"
            type="primary"
            plain
            @click.stop="handleAction"
          >
            查看详情
          </van-button>
        </slot>
      </div>
    </div>

    <!-- 选中状态指示器 -->
    <div v-if="selected" class="selected-indicator">
      <van-icon name="success" size="16" />
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
  /** 是否显示元信息 */
  showMeta?: boolean
  /** 是否显示状态标签 */
  showStatus?: boolean
  /** 是否可点击 */
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  themeMode: 'auto',
  showStats: true,
  showMeta: true,
  showStatus: true,
  clickable: true
})

// Emit 事件定义
interface Emits {
  (e: 'click', item: any, index: number): void
}

const emit = defineEmits<Emits>()

// 计算属性
const themeClass = computed(() => {
  return `theme-${props.themeMode}`
})

// 方法
const getTypeIcon = (type: string) => {
  const icons = {
    image: 'photo-o',
    video: 'video-o',
    music: 'music-o',
    voice: 'volume-o'
  }
  return icons[type as keyof typeof icons] || 'file-o'
}

const getTypeText = (type: string) => {
  const texts = {
    image: '图片',
    video: '视频',
    music: '音乐',
    voice: '语音'
  }
  return texts[type as keyof typeof texts] || '作品'
}

const getStatusType = (status: string):any => {
  const types = {
    pending: 'primary',
    processing: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return types[status as keyof typeof types] || 'default'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '等待中',
    processing: '生成中',
    completed: '已完成',
    failed: '失败'
  }
  return texts[status as keyof typeof texts] || status
}

const formatTime = (time: string) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  return date.toLocaleDateString()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.item, props.index)
  }
}

const handleAction = () => {
  // 默认操作：查看详情
  emit('click', props.item, props.index)
}
</script>

<style scoped lang="scss">
.sdkwork-generation-waterfall-item {
  position: relative;
  background: var(--generation-item-bg, #ffffff);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--generation-item-shadow, rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
  cursor: default;

  &.is-clickable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px var(--generation-item-shadow-hover, rgba(0, 0, 0, 0.15));
    }
  }

  &.is-selected {
    border: 2px solid var(--van-primary-color);
  }

  // 主题样式
  &.theme-light {
    --generation-item-bg: #ffffff;
    --generation-item-text: #323233;
    --generation-item-border: #ebedf0;
    --generation-item-shadow: rgba(0, 0, 0, 0.1);
    --generation-item-shadow-hover: rgba(0, 0, 0, 0.15);
  }

  &.theme-dark {
    --generation-item-bg: #1a1a1a;
    --generation-item-text: #ffffff;
    --generation-item-border: #2a2a2a;
    --generation-item-shadow: rgba(255, 255, 255, 0.1);
    --generation-item-shadow-hover: rgba(255, 255, 255, 0.15);
  }

  &.theme-auto {
    @media (prefers-color-scheme: light) {
      --generation-item-bg: #ffffff;
      --generation-item-text: #323233;
      --generation-item-border: #ebedf0;
      --generation-item-shadow: rgba(0, 0, 0, 0.1);
      --generation-item-shadow-hover: rgba(0, 0, 0, 0.15);
    }

    @media (prefers-color-scheme: dark) {
      --generation-item-bg: #1a1a1a;
      --generation-item-text: #ffffff;
      --generation-item-border: #2a2a2a;
      --generation-item-shadow: rgba(255, 255, 255, 0.1);
      --generation-item-shadow-hover: rgba(255, 255, 255, 0.15);
    }
  }

  .item-preview {
    position: relative;
    width: 100%;
    height: 160px;
    overflow: hidden;

    .preview-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--generation-item-border);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .preview-placeholder {
        color: var(--van-gray-5);
      }
    }

    .status-badge {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }

  .item-content {
    padding: 12px;

    .item-title {
      margin-bottom: 8px;

      h3 {
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

    .item-description {
      margin-bottom: 8px;

      p {
        margin: 0;
        font-size: 12px;
        color: var(--van-gray-6);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .item-meta {
      margin-bottom: 8px;

      .meta-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: var(--van-gray-5);

        .meta-type {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .item-stats {
      margin-bottom: 12px;

      .stats-info {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: var(--van-gray-5);

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }

    .item-actions {
      display: flex;
      justify-content: flex-end;
    }
  }

  .selected-indicator {
    position: absolute;
    top: 8px;
    left: 8px;
    color: var(--van-primary-color);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-generation-waterfall-item {
    .item-preview {
      height: 140px;
    }

    .item-content {
      padding: 10px;

      .item-title h3 {
        font-size: 13px;
      }
    }
  }
}
</style>