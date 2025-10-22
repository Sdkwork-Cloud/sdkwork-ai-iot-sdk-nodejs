<template>
  <div class="sdkwork-notification-list">
    <!-- 使用API List组件 -->
    <sdkwork-api-list :api="api" :params="buildParams" :selectable="selectable" :deletable="deletable"
      :searchable="searchable" :page-size="pageSize" :item-key="itemKey" :item-title-field="itemTitleField"
      :item-description-field="itemDescriptionField" @select="handleApiListSelect" @delete="handleApiListDelete"
      @search="handleApiListSearch" @load="handleApiListLoad" ref="apiListRef" left-spacing="0" right-spacing="0">
      <!-- 自定义通知列表项 -->
      <template #default="{ item, index, selected }">
        <sdkwork-notification-item :notification="item" :selectable="selectable" :deletable="deletable"
          :is-selected="selected" :show-border-bottom="true" @select="handleItemSelect" @delete="handleItemDelete"
          @read="handleItemRead" @action="handleItemAction" @click="handleItemClick" />
      </template>

      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <van-empty description="暂无通知消息" image="search">
            <template #description>
              <div class="empty-description">
                <p>暂时没有通知消息</p>
                <p class="empty-tip">您已查看所有通知</p>
              </div>
            </template>
          </van-empty>
        </slot>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <slot name="loading">
          <van-loading size="24px" vertical>加载通知数据...</van-loading>
        </slot>
      </template>

      <!-- 头部插槽 -->
      <template #header>
        <slot name="header" />
      </template>

      <!-- 底部插槽 -->
      <template #footer>
        <slot name="footer" />
      </template>
    </sdkwork-api-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue'
import SdkworkNotificationItem from '../sdkwork-notification-item/sdkwork-notification-item.vue'
import type { Notification, NotificationPage, NotificationPageable, NotificationQueryParams } from './types'
import type { Pageable } from 'sdkwork-commons-typescript'

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: NotificationPageable) => Promise<NotificationPage>
  /** 查询参数 */
  params?: NotificationQueryParams
  /** 是否支持行选择 */
  selectable?: boolean
  /** 是否支持行删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 列表项唯一键字段名 */
  itemKey?: string
  /** 列表项标题字段名 */
  itemTitleField?: string
  /** 列表项描述字段名 */
  itemDescriptionField?: string
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  selectable: false,
  deletable: false,
  searchable: false,
  pageSize: 10,
  itemKey: 'id',
  itemTitleField: 'title',
  itemDescriptionField: 'content'
})

// 事件定义
const emit = defineEmits({
  select: (notification: Notification) => true,
  delete: (notification: Notification) => true,
  read: (notification: Notification) => true,
  action: (notification: Notification) => true,
  search: (keyword: string) => true,
  load: (pageData: NotificationPage) => true,
  click: (notification: Notification) => true
})

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义列表项内容 */
  default?: (props: { notification: Notification; index: number; selected: boolean }) => any
  /** 头部插槽 - 列表顶部区域 */
  header?: () => any
  /** 底部插槽 - 列表底部区域 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
}>()

// DOM引用
const apiListRef = ref<InstanceType<typeof SdkworkApiList>>()

// 计算属性
const buildParams = computed(() => {
  const baseParams: Pageable = {
    page: 0,
    size: props.pageSize,
    filters: props.params
  }
  return baseParams
})

// API List事件处理
const handleApiListSelect = (notification: Notification) => {
  emit('select', notification)
}

const handleApiListDelete = (notification: Notification) => {
  emit('delete', notification)
}

const handleApiListSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleApiListLoad = (pageData: NotificationPage) => {
  emit('load', pageData)
}

// 列表项事件处理
const handleItemSelect = (notification: Notification) => {
  emit('select', notification)
}

const handleItemDelete = (notification: Notification) => {
  emit('delete', notification)
}

const handleItemRead = (notification: Notification) => {
  emit('read', notification)
}

const handleItemAction = (notification: Notification) => {
  emit('action', notification)
}

const handleItemClick = (notification: Notification) => {
  emit('click', notification)
}

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => apiListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => apiListRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => apiListRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => apiListRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => apiListRef.value?.clearSelected(),
  /** 设置选中项 */
  setSelectedItems: (items: Notification[]) => apiListRef.value?.setSelectedItems(items)
})
</script>

<style scoped lang="scss">
.sdkwork-notification-list {
  height: 100%;
  /* 考虑安全区域 */
  height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  min-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
}

.empty-description {
  text-align: center;

  p {
    margin: 4px 0;
    color: #969799;
    font-size: 14px;
  }

  .empty-tip {
    font-size: 12px;
    color: #c8c9cc;
  }
}
</style>