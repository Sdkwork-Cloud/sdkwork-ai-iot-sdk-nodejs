<template>
  <div class="sdkwork-feeds-list">
    <SdkworkApiList
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
      :top-spacing="topSpacing"
      :left-spacing="leftSpacing"
      :right-spacing="rightSpacing"
      @select="handleSelect"
      @delete="handleDelete"
      @refresh="handleRefresh"
      @load-more="handleLoadMore"
      @search="handleSearch"
      @item-click="handleItemClick"
      @error="handleError"
    >
      <!-- 默认feeds项模板 -->
      <template #default="{ item, index, selected }">
        <FeedItem
          :feed="item"
          :selected="selected"
          @like="handleLike(item)"
          @comment="handleComment(item)"
          @share="handleShare(item)"
          @user-click="handleUserClick(item)"
          v-if="!customItem"
        />
        <slot name="item" :item="item" :index="index" :selected="selected" v-else />
      </template>
      
      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <div class="empty-state">
            <Icon icon="ri:article-line" width="48" height="48" />
            <div class="empty-text">暂无动态</div>
            <div class="empty-description">还没有任何动态，快去发布第一条吧！</div>
          </div>
        </slot>
      </template>
      
      <!-- 头部插槽 -->
      <template #header>
        <slot name="header">
          <div class="feeds-header" v-if="showHeader">
            <div class="header-title">{{ title }}</div>
            <div class="header-actions">
              <button class="post-button" @click="handlePost">
                <Icon icon="ri:add-line" width="18" height="18" />
                <span>发布动态</span>
              </button>
            </div>
          </div>
        </slot>
      </template>
      
      <!-- 底部插槽 -->
      <template #footer>
        <slot name="footer" />
      </template>
    </SdkworkApiList>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue'
import FeedItem from '../sdkwork-feeds-item/sdkwork-feeds-item.vue'
import type { Feed } from './types'

// 组件属性定义
interface Props {
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
  topSpacing?: string | number
  leftSpacing?: string | number
  rightSpacing?: string | number
  
  // Feeds特定配置
  showHeader?: boolean
  title?: string
  customItem?: boolean
}

const props = withDefaults(defineProps<Props>(), {
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
  topSpacing: 0,
  leftSpacing: 0,
  rightSpacing: 0,
  showHeader: true,
  title: '动态列表',
  customItem: false
})

// 事件定义
interface Emits {
  // 列表事件
  select: [items: Feed[]]
  delete: [item: Feed]
  refresh: []
  loadMore: []
  search: [query: string]
  itemClick: [item: Feed]
  error: [error: Error]
  
  // Feeds特定事件
  like: [item: Feed]
  comment: [item: Feed]
  share: [item: Feed]
  userClick: [item: Feed]
  post: []
}

const emit = defineEmits<Emits>()

// 处理列表事件
const handleSelect = (items: Feed[]) => {
  emit('select', items)
}

const handleDelete = (item: Feed) => {
  emit('delete', item)
}

const handleRefresh = () => {
  emit('refresh')
}

const handleLoadMore = () => {
  emit('loadMore')
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

// 处理Feeds特定事件
const handleLike = (item: Feed) => {
  emit('like', item)
}

const handleComment = (item: Feed) => {
  emit('comment', item)
}

const handleShare = (item: Feed) => {
  emit('share', item)
}

const handleUserClick = (item: Feed) => {
  emit('userClick', item)
}

const handlePost = () => {
  emit('post')
}
</script>

<style scoped>
.sdkwork-feeds-list {
  width: 100%;
  height: 100%;
}

.feeds-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color, #ebedf0);
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #323233);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.post-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-primary, #1989fa);
  color: white;
  border: none;
  border-radius: var(--radius, 8px);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-button:hover {
  background: var(--color-primary-dark, #1378d0);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.2);
}

.post-button:active {
  transform: translateY(0);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-state .iconify {
  color: var(--text-secondary, #969799);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary, #323233);
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: var(--text-secondary, #969799);
  line-height: 1.4;
}

/* 主题变量 */
:root {
  --color-primary: #1989fa;
  --color-primary-dark: #1378d0;
  --text-primary: #323233;
  --text-secondary: #969799;
  --border-color: #ebedf0;
  --radius: 8px;
}

/* 深色主题适配 */
.dark-mode {
  --color-primary: #1989fa;
  --color-primary-dark: #2988e8;
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --border-color: #3a3a3a;
}
</style>