<template>
  <!-- 使用API List组件 -->
  <sdkwork-api-list :api="api" :params="buildParams" :selectable="selectable"
    :deletable="deletable" :searchable="searchable" :page-size="pageSize" :item-key="agentKey"
    :item-title-field="agentNameField" :item-description-field="agentDescriptionField" :left-spacing="0"
    :right-spacing="0" @select="handleSelect" @delete="handleDelete" @search="handleSearch" @load="handleLoad"
    ref="apiListRef" showBorderBottom :borderBottomLeftOffset="70">
    <!-- 自定义智能体列表项 -->
    <template #default="{ item, index, selected }">
      <sdkwork-agents-list-item :agent="item" :is-selected="selected" :show-border-bottom="true"
        @click="handleItemClick" @select="handleItemSelect" />
    </template>

    <!-- 空状态插槽 -->
    <template #empty>
      <slot name="empty">
        <van-empty description="暂无智能体" image="search">
          <template #description>
            <div class="empty-description">
              <p>暂时没有智能体</p>
              <p class="empty-tip">您可以创建新的智能体或调整搜索条件</p>
            </div>
          </template>
        </van-empty>
      </slot>
    </template>

    <!-- 加载状态插槽 -->
    <template #loading>
      <slot name="loading">
        <van-loading size="24px" vertical>加载智能体数据...</van-loading>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue'
import SdkworkAgentsListItem from '../sdkwork-agents-list-item/sdkwork-agents-list-item.vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import { AiAgentVO } from '@/services'


// 智能体事件定义
export interface AgentEvents {
  (e: 'select', agent: AiAgentVO): void
  (e: 'delete', agent: AiAgentVO): void
  (e: 'click', agent: AiAgentVO): void
  (e: 'search', keyword: string): void
  (e: 'load', pageData: Page<AiAgentVO>): void
}

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<AiAgentVO>>
  /** 请求参数 */
  params?: Record<string, any>
  /** 是否支持智能体选择 */
  selectable?: boolean
  /** 是否支持智能体删除 */
  deletable?: boolean
  /** 是否支持搜索 */
  searchable?: boolean
  /** 每页显示条数 */
  pageSize?: number
  /** 智能体唯一键字段名 */
  agentKey?: string
  /** 智能体名称字段名 */
  agentNameField?: string
  /** 智能体描述字段名 */
  agentDescriptionField?: string
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  selectable: false,
  deletable: false,
  searchable: false,
  pageSize: 10,
  agentKey: 'id',
  agentNameField: 'name',
  agentDescriptionField: 'description'
})

// 事件定义
const emit = defineEmits<AgentEvents>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义智能体列表项内容 */
  default?: (props: { agent: AiAgentVO; index: number; selected: boolean }) => any
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

// 微信浏览器检测
const isWeChatBrowser = ref(false)

// 检测微信浏览器
const detectWeChatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()
  isWeChatBrowser.value = /micromessenger/.test(ua)
}

onMounted(() => {
  detectWeChatBrowser()
})


// 计算属性
const buildParams = computed(() => {
  const baseParams: Pageable = {
    page: 0,
    size: props.pageSize,
    filters: props.params
  }
  return baseParams
})

// 事件处理
const handleSelect = (agent: AiAgentVO) => {
  emit('select', agent)
}

const handleDelete = (agent: AiAgentVO) => {
  emit('delete', agent)
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: Page<AiAgentVO>) => {
  emit('load', pageData)
}

const handleItemSelect = (agent: AiAgentVO) => {
  emit('select', agent)
}

const handleItemClick = (agent: AiAgentVO) => {
  emit('click', agent)
}

// 暴露给父组件的方法
defineExpose({
  /** 刷新数据 */
  refresh: () => apiListRef.value?.refresh(),
  /** 加载更多数据 */
  loadMore: () => apiListRef.value?.loadMore(),
  /** 获取当前智能体数据 */
  getAgents: () => apiListRef.value?.getData() || [],
  /** 获取选中智能体 */
  getSelectedAgents: () => apiListRef.value?.getSelectedItems() || [],
  /** 清空选中智能体 */
  clearSelected: () => apiListRef.value?.clearSelected(),
  /** 设置选中智能体 */
  setSelectedAgents: (agents: AiAgentVO[]) => apiListRef.value?.setSelectedItems(agents)
})
</script>

<style scoped lang="scss">
.sdkwork-agent-list {
  height: 90dvh;
  min-height: 90dvh;
  display: flex;
  flex-direction: column;


  /* 微信浏览器特殊处理 */
  &.wechat-browser {
    /* 微信浏览器中安全区域计算可能有问题，使用更保守的高度 */
    height: 100%;
    min-height: 100%;
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
</style>