<template>
  <sdkwork-api-tab-list
    ref="tabListRef"
    :api="api"
    :tabs="appointmentTabs"
    :tabs-api="tabsApi"
    :params="mergedParams"
    :searchable="searchable"
    :selectable="selectable"
    :deletable="deletable"
    :page-size="pageSize"
    :default-active-tab="defaultActiveTab"
    @tab-change="handleTabChange"
    @select="handleSelect"
    @delete="handleDelete"
    @search="handleSearch"
    @load="handleLoad"
  >
    <!-- 自定义预约项 -->
    <template #default="{ item, index, selected }">
      <appointment-list-item
        :appointment="item"
        :index="index"
        :selected="selected"
        :selectable="selectable"
        :deletable="deletable"
        :show-actions="showActions"
        :action-buttons="actionButtons"
        @select="handleItemSelect"
        @delete="handleItemDelete"
        @action="handleItemAction"
        @click="handleItemClick"
      >
        <!-- 传递插槽 -->
        <template v-if="$slots['appointment-header']" #header>
          <slot name="appointment-header" :appointment="item" :index="index" />
        </template>
        
        <template v-if="$slots['appointment-content']" #content>
          <slot name="appointment-content" :appointment="item" :index="index" />
        </template>
        
        <template v-if="$slots['appointment-footer']" #footer>
          <slot name="appointment-footer" :appointment="item" :index="index" />
        </template>
        
        <template v-if="$slots['appointment-actions']" #actions>
          <slot name="appointment-actions" :appointment="item" :index="index" />
        </template>
      </appointment-list-item>
    </template>

    <!-- 传递其他插槽 -->
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>

    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>

    <template v-if="$slots.loading" #loading>
      <slot name="loading" />
    </template>

    <template v-if="$slots['tab-title']" #tab-title>
      <slot name="tab-title"/>
    </template>
  </sdkwork-api-tab-list>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { TabItem } from '../sdkwork-api-tab-list/types'

// 组件导入
import SdkworkApiTabList from '../sdkwork-api-tab-list/sdkwork-api-tab-list.vue'
import AppointmentListItem from './components/appointment-list-item.vue'

// 从types.ts导入类型定义和默认配置
import type { 
  Appointment, 
  AppointmentActionButton, 
  AppointmentStatusConfig 
} from './types'
import { 
  AppointmentStatus, 
  DEFAULT_STATUS_CONFIG, 
  DEFAULT_ACTION_BUTTONS, 
  DEFAULT_APPOINTMENT_TABS 
} from './types'

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<Appointment>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持搜索 */
  searchable?: boolean
  /** 是否支持选择 */
  selectable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 预约Tabs数据 */
  tabs?: TabItem[]
  /** 预约Tabs API方法 */
  tabsApi?: () => Promise<TabItem[]>
  /** 默认激活的Tab */
  defaultActiveTab?: string | number
  /** 是否显示操作按钮 */
  showActions?: boolean
  /** 自定义操作按钮 */
  actionButtons?: AppointmentActionButton[]
  /** 预约状态配置 */
  statusConfig?: AppointmentStatusConfig
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  searchable: true,
  selectable: false,
  deletable: false,
  pageSize: 10,
  tabs: () => DEFAULT_APPOINTMENT_TABS,
  defaultActiveTab: 'all',
  showActions: true,
  actionButtons: () => DEFAULT_ACTION_BUTTONS,
  statusConfig: () => DEFAULT_STATUS_CONFIG
})

// 事件定义
interface Emits {
  (e: 'select', appointment: Appointment): void
  (e: 'delete', appointment: Appointment): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<Appointment>): void
  (e: 'tab-change', tab: TabItem, params: Record<string, any>): void
  (e: 'action', appointment: Appointment, action: string): void
  (e: 'click', appointment: Appointment): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义预约项内容 */
  default?: (props: { appointment: Appointment; index: number; selected: boolean }) => any
  /** 头部插槽 */
  header?: () => any
  /** 底部插槽 */
  footer?: () => any
  /** 空状态插槽 */
  empty?: () => any
  /** 加载状态插槽 */
  loading?: () => any
  /** Tab标题自定义插槽 */
  'tab-title'?: () => any
  /** 预约头部自定义插槽 */
  'appointment-header'?: (props: { appointment: Appointment; index: number }) => any
  /** 预约内容自定义插槽 */
  'appointment-content'?: (props: { appointment: Appointment; index: number }) => any
  /** 预约底部自定义插槽 */
  'appointment-footer'?: (props: { appointment: Appointment; index: number }) => any
  /** 预约操作自定义插槽 */
  'appointment-actions'?: (props: { appointment: Appointment; index: number }) => any
}>()

// 响应式数据
const tabListRef = ref<InstanceType<typeof SdkworkApiTabList>>()

// 默认预约Tabs
const defaultAppointmentTabs = ref<TabItem[]>([
  { value: 'all', title: '全部预约', params: { status: '' } },
  { value: AppointmentStatus.PENDING, title: '待确认', params: { status: AppointmentStatus.PENDING } },
  { value: AppointmentStatus.CONFIRMED, title: '已确认', params: { status: AppointmentStatus.CONFIRMED } },
  { value: AppointmentStatus.IN_PROGRESS, title: '进行中', params: { status: AppointmentStatus.IN_PROGRESS } },
  { value: AppointmentStatus.COMPLETED, title: '已完成', params: { status: AppointmentStatus.COMPLETED } },
  { value: AppointmentStatus.CANCELLED, title: '已取消', params: { status: AppointmentStatus.CANCELLED } }
])

// 计算属性
const appointmentTabs = computed(() => {
  return props.tabs.length > 0 ? props.tabs : defaultAppointmentTabs.value
})

const mergedParams = computed(() => {
  return {
    ...props.params
  }
})

// 事件处理函数
const handleTabChange = (tab: TabItem, params: Record<string, any>) => {
  emit('tab-change', tab, params)
}

const handleSelect = (appointment: Appointment) => {
  emit('select', appointment)
}

const handleDelete = (appointment: Appointment) => {
  emit('delete', appointment)
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: Page<Appointment>) => {
  emit('load', pageData)
}

const handleItemSelect = (appointment: Appointment) => {
  emit('select', appointment)
}

const handleItemDelete = (appointment: Appointment) => {
  emit('delete', appointment)
}

const handleItemAction = (appointment: Appointment, action: string) => {
  emit('action', appointment, action)
}

const handleItemClick = (appointment: Appointment) => {
  emit('click', appointment)
}

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => tabListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => tabListRef.value?.loadMore(),
  /** 获取当前数据 */
  getData: () => tabListRef.value?.getData() || [],
  /** 获取选中项 */
  getSelectedItems: () => tabListRef.value?.getSelectedItems() || [],
  /** 清空选中项 */
  clearSelected: () => tabListRef.value?.clearSelected(),
  /** 设置选中项 */
  setSelectedItems: (items: Appointment[]) => tabListRef.value?.setSelectedItems(items),
  /** 获取当前激活的Tab */
  getActiveTab: () => tabListRef.value?.getActiveTab(),
  /** 设置激活的Tab */
  setActiveTab: (tabName: string | number) => tabListRef.value?.setActiveTab(tabName),
  /** 获取Tabs数据 */
  getTabsData: () => tabListRef.value?.getTabsData() || []
})
</script>

<style scoped lang="scss">
.sdkwork-appointment-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>