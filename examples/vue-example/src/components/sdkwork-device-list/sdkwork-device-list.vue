<template>
  <div class="sdkwork-device-list">
    <!-- 使用API List组件 -->
    <sdkwork-api-list :api="api" :params="buildParams" :selectable="selectable" :deletable="deletable"
      :searchable="searchable" :page-size="pageSize" :item-key="deviceKey" :item-title-field="deviceNameField"
      :item-description-field="deviceDescriptionField" :left-spacing="0" :right-spacing="0" @select="handleSelect"
      @delete="handleDelete" @search="handleSearch" @load="handleLoad" ref="apiListRef" showBorderBottom
      :borderBottomLeftOffset="70">
      <!-- 自定义设备列表项 -->
      <template #default="{ item, index, selected }">
        <sdkwork-device-item :device="item" :is-selected="selected" :show-border-bottom="true" @click-item="(device: any) => {
          handleItemClick(device)
        }" @select-item="(device: any) => {
            handleItemSelect(device)
          }" />
      </template>

      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <van-empty description="暂无设备" image="search">
            <template #description>
              <div class="empty-description">
                <p>暂时没有设备</p>
                <p class="empty-tip">您可以添加新设备或调整搜索条件</p>
              </div>
            </template>
          </van-empty>
        </slot>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <slot name="loading">
          <van-loading size="24px" vertical>加载设备数据...</van-loading>
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
import SdkworkDeviceItem from '../sdkwork-device-item/sdkwork-device-item.vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 设备接口定义
export interface Device {
  id: string
  name: string
  description: string
  avatar: string
  status: 'online' | 'offline' | 'error'
  type: string
  location?: string
  temperature?: number
  humidity?: number
  lastUpdate: string
  tags: string[]
  createdTime: string
  updatedTime: string
  isActive: boolean
  owner: string
}

// 设备事件定义
export interface DeviceEvents {
  (e: 'select', device: Device): void
  (e: 'delete', device: Device): void
  (e: 'click', device: Device): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<Device>): void
}

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<Device>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持设备选择 */
  selectable?: boolean
  /** 是否支持设备删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 设备唯一键字段名 */
  deviceKey?: string
  /** 设备名称字段名 */
  deviceNameField?: string
  /** 设备描述字段名 */
  deviceDescriptionField?: string
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  selectable: false,
  deletable: false,
  searchable: false,
  pageSize: 10,
  deviceKey: 'id',
  deviceNameField: 'name',
  deviceDescriptionField: 'description',
  themeMode: 'auto'
})

// 事件定义
const emit = defineEmits<DeviceEvents>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义设备列表项内容 */
  default?: (props: { device: Device; index: number; selected: boolean }) => any
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
    pageNumber: 0,
    pageSize: props.pageSize,
    filters: props.params
  }
  return baseParams
})

// 事件处理
const handleSelect = (device: Device) => {
  emit('select', device)
}

const handleDelete = (device: Device) => {
  emit('delete', device)
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: Page<Device>) => {
  emit('load', pageData)
}

const handleItemSelect = (device: Device) => {
  emit('select', device)
}

const handleItemClick = (device: Device) => {
  emit('click', device)
}

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => apiListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => apiListRef.value?.loadMore(),
  /** 获取当前设备数据 */
  getDevices: () => apiListRef.value?.getData() || [],
  /** 获取选中设备 */
  getSelectedDevices: () => apiListRef.value?.getSelectedItems() || [],
  /** 清空选中设备 */
  clearSelected: () => apiListRef.value?.clearSelected(),
  /** 设置选中设备 */
  setSelectedDevices: (devices: Device[]) => apiListRef.value?.setSelectedItems(devices)
})
</script>

<style scoped lang="scss">
.sdkwork-device-list {
  height: 100%;
  min-height: 100%;
  /* 考虑安全区域 */
  height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  min-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;

  /* 确保API列表组件使用最大高度 */
  :deep(.sdkwork-api-list) {
    height: 100%;
    min-height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* 确保下拉刷新组件使用最大高度 */
  :deep(.sdkwork-pull-refresh) {
    height: 100%;
    min-height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .list-content {
    flex: 1;
    overflow-y: auto;
  }
}

// 主题适配
.sdkwork-device-list {

  // 浅色主题
  &--light {
    --sdkwork-device-list-bg: #fff;
    --sdkwork-device-list-border: #ebedf0;
    background-color: var(--sdkwork-device-list-bg);
  }

  // 深色主题
  &--dark {
    --sdkwork-device-list-bg: #1a1a1a;
    --sdkwork-device-list-border: #3a3a3a;
    background-color: var(--sdkwork-device-list-bg);
  }
}
</style>