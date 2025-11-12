<template>
  <div class="group-feeds-list">
    <!-- 发布动态按钮 - 放在顶部 -->
    <div class="publish-container" :class="themeClass">
      <van-button
        type="primary"
        size="large"
        round
        @click="handlePublish"
        class="publish-button"
      >
        <van-icon name="plus" size="16" class="button-icon" />
        发布动态
      </van-button>
    </div>

    <!-- 使用sdkwork-feeds-list组件 -->
    <SdkworkFeedsList
      :api="api"
      :service="service"
      :params="params"
      :pageable-params="pageableParams"
      :selectable="selectable"
      :deletable="deletable"
      :searchable="searchable"
      :page-size="pageSize"
      :item-key="itemKey"
      :item-title-field="itemTitleField"
      :item-description-field="itemDescriptionField"
      :theme-mode="themeMode"
      :show-border-bottom="showBorderBottom"
      :border-bottom-left-offset="borderBottomLeftOffset"
      :show-no-more-data="showNoMoreData"
      :top-spacing="0"
      :left-spacing="0"
      :right-spacing="0"
      :show-header="false"
      :custom-item="false"
      :title="title"
      @select="handleSelect"
      @delete="handleDelete"
      @refresh="handleRefresh"
      @load-more="handleLoadMore"
      @search="handleSearch"
      @item-click="handleItemClick"
      @error="handleError"
      @like="handleLike"
      @comment="handleComment"
      @share="handleShare"
      @user-click="handleUserClick"
      @post="handlePost"
    >
      <!-- 自定义空状态，添加发布按钮 -->
      <template #empty>
        <div class="custom-empty-state" :class="themeClass">
          <van-empty
            image="default"
            description="暂无群动态"
          >
            <van-button
              type="primary"
              size="small"
              round
              @click="handlePublish"
            >
              发布第一条动态
            </van-button>
          </van-empty>
        </div>
      </template>
    </SdkworkFeedsList>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/hooks/theme/useTheme'
import SdkworkFeedsList from '@/components/sdkwork-feeds-list/sdkwork-feeds-list.vue'
import type { Feed } from '@/components/sdkwork-feeds-list/types/feeds'

// Props定义 - 兼容原有接口并添加sdkwork-feeds-list的配置
interface Props {
  // 原有属性 - 兼容旧版本
  loading?: boolean
  hasMore?: boolean
  feeds?: Feed[]
  
  // API配置
  api?: (params: Record<string, any>, pageableParams?: any) => Promise<any>
  service?: any
  params?: Record<string, any>
  pageableParams?: Record<string, any>
  
  // 列表配置
  selectable?: boolean
  deletable?: boolean
  searchable?: boolean
  pageSize?: number
  
  // 字段配置
  itemKey?: string
  itemTitleField?: string
  itemDescriptionField?: string
  
  // 显示配置
  themeMode?: 'light' | 'dark' | 'auto'
  showBorderBottom?: boolean
  borderBottomLeftOffset?: number
  showNoMoreData?: boolean
  
  // 自定义配置
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: true,
  feeds: () => [],
  params: () => ({}),
  pageableParams: () => ({}),
  selectable: false,
  deletable: false,
  searchable: true,
  pageSize: 10,
  itemKey: 'id',
  itemTitleField: 'content',
  itemDescriptionField: '',
  themeMode: 'auto',
  showBorderBottom: true,
  borderBottomLeftOffset: 16,
  showNoMoreData: true,
  title: '群动态'
})

// 事件定义 - 兼容原有事件并添加sdkwork-feeds-list的事件
interface Emits {
  // 原有事件
  (e: 'publish'): void
  (e: 'like', feed: Feed): void
  (e: 'comment', feed: Feed): void
  (e: 'share', feed: Feed): void
  (e: 'user-click', feed: Feed): void
  (e: 'load-more'): void
  
  // sdkwork-feeds-list的额外事件
  (e: 'select', items: Feed[]): void
  (e: 'delete', item: Feed): void
  (e: 'refresh'): void
  (e: 'search', query: string): void
  (e: 'itemClick', item: Feed): void
  (e: 'error', error: Error): void
  (e: 'post'): void
}

const emit = defineEmits<Emits>()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 处理原有事件
const handlePublish = () => {
  emit('publish')
}

const handleLike = (feed: Feed) => {
  emit('like', feed)
}

const handleComment = (feed: Feed) => {
  emit('comment', feed)
}

const handleShare = (feed: Feed) => {
  emit('share', feed)
}

const handleUserClick = (feed: Feed) => {
  emit('user-click', feed)
}

const handleLoadMore = () => {
  emit('load-more')
}

// 处理sdkwork-feeds-list的事件
const handleSelect = (items: Feed[]) => {
  emit('select', items)
}

const handleDelete = (item: Feed) => {
  emit('delete', item)
}

const handleRefresh = () => {
  emit('refresh')
}

const handleSearch = (query: string) => {
  emit('search', query)
}

const handleItemClick = (item: Feed) => {
  emit('itemClick', item)
}

const handleError = (error: Error) => {
  emit('error', error)
}

const handlePost = () => {
  emit('post')
}
</script>

<style scoped>
.group-feeds-list {
  padding: 16px;
  background: var(--bg-page, #f7f8fa);
  min-height: calc(100vh - 200px);
}

.publish-container {
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  z-index: 5;
  padding-bottom: 8px;
  background: var(--bg-page, #f7f8fa);
}

.publish-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border-radius: var(--radius-large, 12px);
  font-weight: 500;
  box-shadow: var(--shadow-light);
  transition: all 0.2s ease;
}

.publish-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(25, 137, 250, 0.2);
}

.button-icon {
  margin-right: 6px;
  transition: transform 0.2s ease;
}

.publish-button:active .button-icon {
  transform: scale(0.9);
}

.feeds-container {
  min-height: 200px;
}

.empty-feeds {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.feeds-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feed-item {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-large, 12px);
  padding: 16px;
  box-shadow: var(--shadow-light);
  transition: all 0.2s ease;
  border: 1px solid var(--border-color, #f0f0f0);
}

.feed-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.feed-user {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  border: 1px solid var(--border-color, #ebedf0);
  box-shadow: var(--shadow-light);
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary, #323233);
  line-height: 1.2;
  transition: color 0.2s ease;
}

.user-name:hover {
  color: var(--color-primary, #1989fa);
}

.feed-time {
  font-size: 12px;
  color: var(--text-secondary, #969799);
  margin-top: 2px;
}

.pin-badge {
  display: flex;
  align-items: center;
  color: var(--color-warning, #ff976a);
  font-size: 12px;
  padding: 2px 6px;
  background: rgba(255, 151, 106, 0.1);
  border-radius: var(--radius-small, 6px);
  transition: all 0.2s ease;
}

.pin-badge:hover {
  background: rgba(255, 151, 106, 0.2);
}

.pin-badge .van-icon {
  margin-right: 2px;
}

.feed-content {
  margin-bottom: 12px;
}

.feed-text {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary, #323233);
  margin-bottom: 12px;
  word-wrap: break-word;
  transition: color 0.2s ease;
}

.feed-images {
  margin-bottom: 12px;
}

.image-grid {
  display: grid;
  gap: 8px;
  border-radius: var(--radius, 8px);
  overflow: hidden;
  position: relative;
}

/* 根据图片数量调整网格布局 */
.image-grid:has(.feed-image:nth-child(1):nth-last-child(1)) {
  grid-template-columns: 1fr;
  max-width: 200px;
}

.image-grid:has(.feed-image:nth-child(1):nth-last-child(2)),
.image-grid:has(.feed-image:nth-child(2):nth-last-child(1)) {
  grid-template-columns: 1fr 1fr;
  max-width: 280px;
}

.image-grid:has(.feed-image:nth-child(1):nth-last-child(3)),
.image-grid:has(.feed-image:nth-child(2):nth-last-child(2)),
.image-grid:has(.feed-image:nth-child(3):nth-last-child(1)) {
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 360px;
}

.feed-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-small, 6px);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.feed-image:hover {
  transform: scale(1.02);
}

.more-images {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-small, 6px);
  backdrop-filter: blur(5px);
  transition: background 0.2s ease;
}

.more-images:hover {
  background: rgba(0, 0, 0, 0.8);
}

.feed-actions {
  display: flex;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  color: var(--text-secondary, #969799);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.2s ease;
  border-radius: var(--radius-small, 6px);
}

.action-item:hover {
  color: var(--color-primary, #1989fa);
  background: var(--color-primary-light, rgba(25, 137, 250, 0.1));
  padding: 4px 8px;
}

.action-item.liked {
  color: var(--color-danger, #ee0a24);
}

.action-item.liked:hover {
  color: #d60a1f;
  background: rgba(238, 10, 36, 0.1);
}

.action-count {
  margin-left: 4px;
  font-weight: 500;
  transition: color 0.2s ease;
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
.theme-dark .user-avatar {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .feed-item {
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .pin-badge {
  background: rgba(255, 151, 106, 0.15);
  color: var(--color-warning, #ff976a);
}

.theme-dark .pin-badge:hover {
  background: rgba(255, 151, 106, 0.25);
}

.theme-dark .load-more .van-button {
  border-color: var(--border-color, #3a3a3a);
  background: var(--bg-card, #1a1a1a);
}

.theme-dark .load-more .van-button:hover {
  background: var(--bg-secondary, #222222);
}
</style>