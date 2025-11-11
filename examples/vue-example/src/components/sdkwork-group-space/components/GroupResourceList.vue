<template>
  <div class="group-resource-list" :class="themeClass">
    <!-- 筛选和排序 -->
    <div class="filter-container">
      <div class="filter-left">
        <van-dropdown-menu>
          <van-dropdown-item 
            v-model="typeFilter" 
            :options="typeOptions" 
            title="类型"
            @change="handleTypeFilterChange"
          />
          <van-dropdown-item 
            v-model="sortBy" 
            :options="sortOptions" 
            title="排序"
            @change="handleSortChange"
          />
        </van-dropdown-menu>
      </div>
      <van-button
        type="primary"
        size="small"
        round
        @click="handleUpload"
        class="upload-button"
      >
        <van-icon name="plus" size="14" class="button-icon" />
        上传资源
      </van-button>
    </div>

    <!-- 资源列表 -->
    <div class="resources-container">
      <!-- 空状态 -->
      <div v-if="resources.length === 0" class="empty-resources">
        <van-empty
          image="default"
          description="暂无群资源"
        >
          <van-button
            type="primary"
            size="small"
            round
            @click="handleUpload"
          >
            上传第一个资源
          </van-button>
        </van-empty>
      </div>

      <!-- 资源列表 -->
      <div v-else class="resources-list">
        <div 
          v-for="resource in resources" 
          :key="resource.id"
          class="resource-item"
          @click="handleResourceClick(resource)"
        >
          <!-- 资源类型图标 -->
          <div class="resource-icon">
            <van-icon 
              :name="getResourceIcon(resource.type)" 
              size="36" 
              :color="getResourceIconColor(resource.type)"
            />
          </div>

          <!-- 资源信息 -->
          <div class="resource-info">
            <div class="resource-title">{{ resource.title }}</div>
            <div class="resource-description">{{ resource.description }}</div>
            <div class="resource-meta">
              <span class="resource-size">{{ formatFileSize(resource.size) }}</span>
              <span class="resource-date">{{ formatDate(resource.createdAt) }}</span>
              <span class="resource-author">by {{ resource.authorName }}</span>
            </div>
            <div v-if="resource.tags && resource.tags.length" class="resource-tags">
              <van-tag
                v-for="tag in resource.tags.slice(0, 3)"
                :key="tag"
                plain
                size="medium"
                class="resource-tag"
              >
                {{ tag }}
              </van-tag>
              <span
                v-if="resource.tags.length > 3"
                class="more-tags"
              >
                +{{ resource.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="resource-actions">
            <van-button
              type="primary"
              size="small"
              round
              @click.stop="handleDownload(resource)"
              class="download-button"
            >
              <van-icon name="down" size="14" />
              下载
            </van-button>
            <van-button
              v-if="isGroupAdmin || resource.isMine"
              type="default"
              size="small"
              round
              @click.stop="handleMoreActions(resource)"
              class="more-button"
            >
              <van-icon name="ellipsis" size="14" />
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <van-button
        type="default"
        size="small"
        round
        :loading="loading"
        @click="handleLoadMore"
      >
        {{ loading ? '加载中...' : '加载更多' }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'

// 资源类型定义
interface Resource {
  id: string
  title: string
  description: string
  type: 'image' | 'video' | 'doc' | 'audio' | 'other'
  size: number
  url: string
  thumbnailUrl?: string
  authorId: string
  authorName: string
  tags: string[]
  isMine: boolean
  downloadCount: number
  createdAt: string
}

// Props定义
interface Props {
  resources?: Resource[]
  loading?: boolean
  hasMore?: boolean
  isGroupAdmin?: boolean
}

withDefaults(defineProps<Props>(), {
  resources: () => [],
  loading: false,
  hasMore: true,
  isGroupAdmin: false
})

// 事件定义
interface Emits {
  (e: 'upload'): void
  (e: 'download', resource: Resource): void
  (e: 'view', resource: Resource): void
  (e: 'delete', resource: Resource): void
  (e: 'edit', resource: Resource): void
  (e: 'load-more'): void
  (e: 'filter-change', filters: { type: string, sort: string }): void
}

const emit = defineEmits<Emits>()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 筛选和排序状态
const typeFilter = ref('all')
const sortBy = ref('newest')

// 筛选选项
const typeOptions = [
  { text: '全部', value: 'all' },
  { text: '图片', value: 'image' },
  { text: '视频', value: 'video' },
  { text: '文档', value: 'doc' },
  { text: '音频', value: 'audio' },
  { text: '其他', value: 'other' },
]

// 排序选项
const sortOptions = [
  { text: '最新', value: 'newest' },
  { text: '最热', value: 'hottest' },
  { text: '名称', value: 'name' },
  { text: '大小', value: 'size' },
]

// 处理上传资源
const handleUpload = () => {
  emit('upload')
}

// 处理下载资源
const handleDownload = (resource: Resource) => {
  emit('download', resource)
}

// 处理查看资源
const handleResourceClick = (resource: Resource) => {
  emit('view', resource)
}

// 处理更多操作
const handleMoreActions = (_resource: Resource) => {
  // 由于 Vant 版本兼容性问题，使用 showToast 替代 showActionSheet
  // 实际项目中应该根据项目使用的 Vant 版本调整
  showToast('更多操作功能开发中')
  
  // 原代码:
  // const actions = [
  //   { name: '编辑', value: 'edit' },
  //   { name: '删除', value: 'delete', color: '#ee0a24' },
  // ]
  // 
  // showActionSheet({
  //   actions,
  //   onSelect: (action: any) => {
  //     if (action.value === 'edit') {
  //       emit('edit', resource)
  //     } else if (action.value === 'delete') {
  //       emit('delete', resource)
  //     }
  //   },
  // })
}

// 处理加载更多
const handleLoadMore = () => {
  emit('load-more')
}

// 处理类型筛选变化
const handleTypeFilterChange = () => {
  emit('filter-change', {
    type: typeFilter.value,
    sort: sortBy.value
  })
}

// 处理排序变化
const handleSortChange = () => {
  emit('filter-change', {
    type: typeFilter.value,
    sort: sortBy.value
  })
}

// 获取资源图标
const getResourceIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    image: 'photo-o',
    video: 'play-circle-o',
    doc: 'description',
    audio: 'music-o',
    other: 'folder-o'
  }
  return iconMap[type] || 'folder-o'
}

// 获取资源图标颜色
const getResourceIconColor = (type: string) => {
  const colorMap: Record<string, string> = {
    image: '#1989fa',
    video: '#ff6b35',
    doc: '#07c160',
    audio: '#7232dd',
    other: '#969799'
  }
  return colorMap[type] || '#969799'
}

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 24 * 60 * 60 * 1000) {
    return '今天'
  } else if (diff < 2 * 24 * 60 * 60 * 1000) {
    return '昨天'
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.group-resource-list {
  padding: 16px;
  background: var(--bg-page, #f7f8fa);
  min-height: calc(100vh - 200px);
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background: var(--bg-card, #ffffff);
  padding: 12px 16px;
  border-radius: var(--radius-large, 12px);
  box-shadow: var(--shadow-light);
}

.filter-left {
  flex: 1;
  max-width: 220px;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  border-radius: var(--radius-large, 12px);
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-light);
}

.upload-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(25, 137, 250, 0.2);
}

.button-icon {
  margin-right: 6px;
  transition: transform 0.2s ease;
}

.upload-button:active .button-icon {
  transform: scale(0.9);
}

.resources-container {
  min-height: 200px;
}

.empty-resources {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resource-item {
  display: flex;
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-large, 12px);
  padding: 16px;
  box-shadow: var(--shadow-light);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color, #ebedf0);
}

.resource-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.resource-item:active {
  transform: translateY(0);
  box-shadow: var(--shadow-light);
}

.resource-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--bg-gray, #f5f5f5);
  border-radius: var(--radius, 10px);
  margin-right: 12px;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color, #ebedf0);
}

.resource-item:hover .resource-icon {
  background: var(--bg-secondary, #f0f0f0);
  transform: scale(1.05);
}

.resource-info {
  flex: 1;
  min-width: 0;
}

.resource-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary, #323233);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.resource-item:hover .resource-title {
  color: var(--color-primary, #1989fa);
}

.resource-description {
  font-size: 13px;
  color: var(--text-secondary, #969799);
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.resource-item:hover .resource-description {
  color: var(--text-primary, #323233);
}

.resource-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--text-light, #999999);
  margin-bottom: 8px;
}

.resource-size, .resource-date, .resource-author {
  margin-right: 8px;
  transition: color 0.2s ease;
}

.resource-item:hover .resource-size,
.resource-item:hover .resource-date,
.resource-item:hover .resource-author {
  color: var(--text-secondary, #969799);
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.resource-tag {
  font-size: 11px;
  transition: all 0.2s ease;
}

.resource-tag:hover {
  background: var(--color-primary-light, #ecf5ff);
  border-color: var(--color-primary, #1989fa);
  color: var(--color-primary, #1989fa);
}

.more-tags {
  font-size: 11px;
  color: var(--text-secondary, #969799);
  align-self: center;
  transition: color 0.2s ease;
}

.more-tags:hover {
  color: var(--color-primary, #1989fa);
}

.resource-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.download-button, .more-button {
  min-width: 70px;
  height: 32px;
  padding: 0 8px;
  border-radius: var(--radius-small, 6px);
  font-size: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.download-button {
  background: var(--color-primary, #1989fa);
  border-color: var(--color-primary, #1989fa);
  color: white;
  box-shadow: var(--shadow-light);
}

.download-button:hover {
  background: var(--color-primary-light, #1784e3);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(25, 137, 250, 0.2);
}

.download-button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-light);
}

.more-button {
  background: transparent;
  border-color: var(--border-color, #ebedf0);
  color: var(--text-secondary, #969799);
}

.more-button:hover {
  background: var(--bg-gray, #f5f5f5);
  color: var(--text-primary, #323233);
  transform: translateY(-1px);
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.load-more .van-button {
  height: 36px;
  border-radius: var(--radius-large, 12px);
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color, #ebedf0);
  background: var(--bg-card, #ffffff);
  color: var(--text-primary, #323233);
}

.load-more .van-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-light);
  background: var(--bg-secondary, #f7f8fa);
}

/* 统一主题样式 */
.theme-light {
  --bg-page: #f7f8fa;
  --bg-card: #ffffff;
  --bg-gray: #f5f5f5;
  --bg-secondary: #fafafa;
  --text-primary: #323233;
  --text-secondary: #969799;
  --text-light: #999999;
  --color-primary: #1989fa;
  --color-primary-light: #ecf5ff;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #ebedf0;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

.theme-dark {
  --bg-page: #0a0a0a;
  --bg-card: #1a1a1a;
  --bg-gray: #2a2a2a;
  --bg-secondary: #222222;
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --text-light: #969799;
  --color-primary: #1989fa;
  --color-primary-light: #1a3c5c;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #3a3a3a;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

/* 暗色主题适配 */
.theme-dark .filter-container {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .resource-icon {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .resource-item {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .download-button {
  box-shadow: 0 2px 6px rgba(25, 137, 250, 0.15);
}

.theme-dark .download-button:hover {
  box-shadow: 0 3px 8px rgba(25, 137, 250, 0.25);
}

.theme-dark .more-button {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .more-button:hover {
  background: var(--bg-gray, #2a2a2a);
}

.theme-dark .load-more .van-button {
  border-color: var(--border-color, #3a3a3a);
  background: var(--bg-card, #1a1a1a);
}

.theme-dark .load-more .van-button:hover {
  background: var(--bg-secondary, #222222);
}
</style>