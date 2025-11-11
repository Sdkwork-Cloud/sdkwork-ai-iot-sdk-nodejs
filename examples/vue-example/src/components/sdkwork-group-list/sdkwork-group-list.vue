<template>
  <sdkwork-api-list
    ref="apiListRef"
    :api="api"
    :service="service"
    :params="computedParams"
    :pageable-params="pageableParams"
    :selectable="selectable"
    :deletable="deletable"
    :searchable="false"
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
    @load="handleLoad"
  >
    <!-- 头部插槽：筛选和排序 -->
    <template #header>
      <slot name="header">
        <div v-if="showFilter || showSort" class="group-filter-section">
          <!-- 搜索框 -->
          <div v-if="searchable" class="search-box">
            <van-search
              v-model="searchKeyword"
              placeholder="搜索群组名称或描述"
              @search="handleSearchSubmit"
              @clear="handleSearchClear"
              shape="round"
              background="transparent"
            />
          </div>

          <!-- 筛选标签 -->
          <div v-if="showFilter" class="filter-tags">
            <van-tag
              v-for="tag in filterTypes"
              :key="tag.value"
              :type="activeFilter === tag.value ? 'primary' : 'default'"
              plain
              round
              size="medium"
              @click="handleFilterChange(tag.value)"
            >
              {{ tag.label }}
            </van-tag>
          </div>

          <!-- 排序选项 -->
          <div v-if="showSort" class="sort-section">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="sortType"
                :options="sortOptions"
                @change="handleSortChange"
              />
            </van-dropdown-menu>
          </div>
        </div>
      </slot>
    </template>

    <!-- 默认插槽：自定义群组项渲染 -->
    <template #default="{ item, index, selected }">
      <slot name="item" :item="item" :index="index" :selected="selected">
        <div class="group-item-wrapper">
          <sdkwork-group-item
            :group="item"
            :show-join-button="showJoinButton"
            @click="handleGroupClick"
            @join="handleJoinGroup"
          />
        </div>
      </slot>
    </template>

    <!-- 底部插槽 -->
    <template #footer>
      <slot name="footer" />
    </template>

    <!-- 空状态插槽 -->
    <template #empty="{ empty }">
      <slot name="empty" :empty="empty">
        <van-empty
          image="search"
          :description="searchKeyword ? '没有找到相关群组' : '暂无群组'"
        />
      </slot>
    </template>
  </sdkwork-api-list>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue'
import SdkworkGroupItem from '../sdkwork-group-item/sdkwork-group-item.vue'
import type { Group } from '../sdkwork-group-item/types'

// 组件引用
const apiListRef = ref()

// Props定义
interface Props {
  // API和分页相关
  api?: (params: Record<string, any>, pageableParams?: any) => Promise<any>
  service?: any
  params?: Record<string, any>
  pageableParams?: Record<string, any>
  
  // 基础配置
  selectable?: boolean
  deletable?: boolean
  searchable?: boolean
  pageSize?: number
  itemKey?: string
  itemTitleField?: string
  itemDescriptionField?: string
  themeMode?: 'light' | 'dark' | 'auto'
  showBorderBottom?: boolean
  borderBottomLeftOffset?: number
  showNoMoreData?: boolean
  topSpacing?: string | number
  leftSpacing?: string | number
  rightSpacing?: string | number
  
  // 群组特有配置
  showFilter?: boolean
  showSort?: boolean
  showJoinButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({}),
  pageableParams: () => ({}),
  selectable: false,
  deletable: false,
  searchable: true,
  pageSize: 20,
  itemKey: 'id',
  itemTitleField: 'name',
  itemDescriptionField: 'description',
  themeMode: 'auto',
  showBorderBottom: true,
  borderBottomLeftOffset: 0,
  showNoMoreData: true,
  topSpacing: 0,
  leftSpacing: 0,
  rightSpacing: 0,
  showFilter: true,
  showSort: true,
  showJoinButton: true,
})

// 事件定义
interface Emits {
  (e: 'select', item: Group): void
  (e: 'delete', item: Group): void
  (e: 'search', keyword: string): void
  (e: 'load', data: any): void
  (e: 'filter', value: string): void
  (e: 'sort', value: string): void
  (e: 'group-click', group: Group): void
  (e: 'join', group: Group): void
}

const emit = defineEmits<Emits>()

// 插槽定义
defineSlots<{
  header(): any
  item(props: { item: Group; index: number; selected: boolean }): any
  footer(): any
  empty(props: { empty: boolean }): any
}>()

// 响应式数据
const searchKeyword = ref('')
const activeFilter = ref('all')
const sortType = ref('hot')

// 筛选选项
const filterTypes = [
  { label: '全部', value: 'all' },
  { label: '免费', value: 'free' },
  { label: '付费', value: 'paid' },
  { label: '官方', value: 'official' },
  { label: '热门', value: 'hot' },
  { label: '已加入', value: 'joined' },
]

// 排序选项
const sortOptions = [
  { text: '热门排序', value: 'hot' },
  { text: '最新创建', value: 'newest' },
  { text: '成员最多', value: 'members' },
  { text: '价格最低', value: 'priceLow' },
  { text: '价格最高', value: 'priceHigh' },
]

// 计算属性，用于传递给sdkwork-api-list的参数
const computedParams = computed(() => {
  // 如果有筛选条件，将筛选条件合并到params中
  if (activeFilter.value !== 'all') {
    return {
      ...props.params,
      filter: activeFilter.value,
      keyword: searchKeyword.value,
      sort: sortType.value
    }
  }
  
  // 如果只有搜索关键词
  if (searchKeyword.value) {
    return {
      ...props.params,
      keyword: searchKeyword.value,
      sort: sortType.value
    }
  }
  
  // 如果只有排序条件
  if (sortType.value !== 'hot') {
    return {
      ...props.params,
      sort: sortType.value
    }
  }
  
  // 默认返回原始params
  return props.params
})

// 事件处理函数
const handleSelect = (item: Group) => {
  emit('select', item)
}

const handleDelete = (item: Group) => {
  emit('delete', item)
}

const handleSearchSubmit = (keyword: string) => {
  searchKeyword.value = keyword
  emit('search', keyword)
}

const handleSearchClear = () => {
  searchKeyword.value = ''
  emit('search', '')
}

const handleLoad = (data: any) => {
  emit('load', data)
}

const handleFilterChange = (value: string) => {
  activeFilter.value = value
  emit('filter', value)
}

const handleSortChange = (value: string) => {
  sortType.value = value
  emit('sort', value)
}

const handleGroupClick = (group: Group) => {
  emit('group-click', group)
}

const handleJoinGroup = (group: Group) => {
  emit('join', group)
}

// 暴露给父组件的方法
defineExpose({
  refresh: () => apiListRef.value?.refresh(),
  loadMore: () => apiListRef.value?.loadMore(),
  getData: () => apiListRef.value?.getData(),
  getSelectedItems: () => apiListRef.value?.getSelectedItems(),
  clearSelected: () => apiListRef.value?.clearSelected(),
})
</script>

<style scoped>
.group-filter-section {
  padding: 16px;
  background: var(--bg-card, #ffffff);
  margin-bottom: 8px;
}

.search-box {
  margin-bottom: 12px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.sort-section {
  margin-top: 8px;
}

.group-item-wrapper {
  margin-bottom: 0;
}
</style>