<template>
  <div class="sdkwork-cameos-list">
    <!-- 使用API List组件 -->
    <sdkwork-api-list 
      :api="api" 
      :params="buildParams" 
      :selectable="selectable" 
      :deletable="deletable"
      :searchable="searchable" 
      :page-size="pageSize" 
      :item-key="itemKey" 
      :item-title-field="itemTitleField"
      :item-description-field="itemDescriptionField" 
      :left-spacing="0" 
      :right-spacing="0" 
      @select="handleSelect"
      @delete="handleDelete" 
      @search="handleSearch" 
      @load="handleLoad" 
      ref="apiListRef" 
      showBorderBottom 
      :borderBottomLeftOffset="70">
      
      <!-- 自定义角色列表项 -->
      <template #default="{ item, index, selected }">
        <sdkwork-cameos-list-item 
          :cameo="item" 
          :is-selected="selected" 
          :show-border-bottom="true"
          @click="handleItemClick" 
          @select="handleItemSelect" 
          @play="handleItemPlay"
          @favorite="handleItemFavorite" 
          @remix="handleItemRemix" 
          @share="handleItemShare" />
      </template>

      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <van-empty description="暂无角色" image="search">
            <template #description>
              <div class="empty-description">
                <p>暂时没有角色</p>
                <p class="empty-tip">您可以创建新角色或调整搜索条件</p>
              </div>
            </template>
          </van-empty>
        </slot>
      </template>

      <!-- 加载状态插槽 -->
      <template #loading>
        <slot name="loading">
          <van-loading size="24px" vertical>加载角色数据...</van-loading>
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
import SdkworkCameosListItem from '../sdkwork-cameos-list-item/sdkwork-cameos-list-item.vue'
import type { Cameo, CameoPage, CameoEvents } from './types'
import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 组件属性定义
interface Props {
  /** API请求方法 */
  api: (params: Pageable) => Promise<Page<Cameo>>|any;
  /** 查询参数 */
  params?: any
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
  itemTitleField: 'name',
  itemDescriptionField: 'description'
})

// 事件定义
const emit = defineEmits<CameoEvents>()

// 插槽定义
defineSlots<{
  /** 默认插槽 - 自定义列表项内容 */
  default?: (props: { cameo: Cameo; index: number; selected: boolean }) => any
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

// 事件处理
const handleSelect = (cameo: Cameo) => {
  emit('select', cameo)
}

const handleDelete = (cameo: Cameo) => {
  emit('delete', cameo)
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleLoad = (pageData: CameoPage) => {
  emit('load', pageData)
}

const handleItemSelect = (cameo: Cameo) => {
  emit('select', cameo)
}

const handleItemDelete = (cameo: Cameo) => {
  emit('delete', cameo)
}

const handleItemClick = (cameo: Cameo) => {
  emit('click', cameo)
}

const handleItemPlay = (cameo: Cameo) => {
  emit('play', cameo)
}

const handleItemFavorite = (cameo: Cameo, isFavorite: boolean) => {
  emit('favorite', cameo, isFavorite)
}

const handleItemRemix = (cameo: Cameo) => {
  emit('remix', cameo)
}

const handleItemShare = (cameo: Cameo) => {
  emit('share', cameo)
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
  setSelectedItems: (items: Cameo[]) => apiListRef.value?.setSelectedItems(items)
})
</script>

<style scoped lang="scss">
.sdkwork-cameos-list {
  height: 100%;
  min-height: 100%;
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

  /* 确保列表内容区域使用最大高度 */
  :deep(.list-content) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    /* 移动端平滑滚动 */
  }
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

/* 移动端高度自适应优化 */
@media (max-width: 768px) {
  .sdkwork-cameos-list {
    /* 移动端使用视口高度 */
    height: 100dvh;
    min-height: 100dvh;

    /* 考虑安全区域 */
    height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
    min-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));

    /* 确保在移动端容器中正确显示 */
    :deep(.sdkwork-api-list) {
      height: 100%;
      min-height: 100%;
    }

    :deep(.sdkwork-pull-refresh) {
      height: 100%;
      min-height: 100%;
    }

    :deep(.list-content) {
      height: 100%;
      min-height: 100%;
    }
  }
}

/* 平板端适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .sdkwork-cameos-list {
    height: 100%;
    min-height: 100%;
  }
}

/* 响应式设计 - 确保在不同容器中都能正确显示 */
@media (max-height: 600px) {
  .sdkwork-cameos-list {
    min-height: 400px;
  }
}

@media (max-height: 400px) {
  .sdkwork-cameos-list {
    min-height: 300px;
  }
}

/* 确保在页面容器中正确显示 */
:global(.sdkwork-page-container__content) .sdkwork-cameos-list {
  height: 100%;
  min-height: 100%;
}

/* 修复移动端滚动问题 */
.sdkwork-cameos-list {
  /* 防止移动端滚动穿透 */
  overscroll-behavior: contain;

  /* 移动端触摸优化 */
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>