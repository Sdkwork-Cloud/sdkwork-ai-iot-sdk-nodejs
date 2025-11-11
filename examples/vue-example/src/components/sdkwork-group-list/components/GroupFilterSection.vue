<template>
  <div class="group-filter-section">
    <!-- 搜索框 -->
    <div v-if="searchable" class="search-box">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索群组名称或描述"
        @search="handleSearch"
        @clear="handleClear"
        shape="round"
        background="transparent"
      />
    </div>

    <!-- 筛选标签 -->
    <div v-if="showFilter && filterTypes && filterTypes.length" class="filter-tags">
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
    <div v-if="showSort && sortOptions && sortOptions.length" class="sort-section">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="currentSort"
          :options="sortOptions"
          @change="handleSortChange"
        />
      </van-dropdown-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Group } from '../types/group'

// Props定义
interface Props {
  searchable?: boolean
  showFilter?: boolean
  showSort?: boolean
  filterTypes?: Array<{ label: string; value: string }>
  sortOptions?: Array<{ text: string; value: string }>
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  showFilter: true,
  showSort: true,
  filterTypes: () => [
    { label: '全部', value: 'all' },
    { label: '免费', value: 'free' },
    { label: '付费', value: 'paid' },
    { label: '官方', value: 'official' },
    { label: '热门', value: 'hot' },
    { label: '已加入', value: 'joined' },
  ],
  sortOptions: () => [
    { text: '热门排序', value: 'hot' },
    { text: '最新创建', value: 'newest' },
    { text: '成员最多', value: 'members' },
    { text: '价格最低', value: 'priceLow' },
    { text: '价格最高', value: 'priceHigh' },
  ],
})

// 事件定义
interface Emits {
  (e: 'search', keyword: string): void
  (e: 'filter', value: string): void
  (e: 'sort', value: string): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const searchKeyword = ref('')
const activeFilter = ref('all')
const currentSort = ref('hot')

// 处理搜索
const handleSearch = (value: string) => {
  emit('search', value)
}

// 处理清空搜索
const handleClear = () => {
  searchKeyword.value = ''
  emit('search', '')
}

// 处理筛选变化
const handleFilterChange = (value: string) => {
  activeFilter.value = value
  emit('filter', value)
}

// 处理排序变化
const handleSortChange = (value: string) => {
  currentSort.value = value
  emit('sort', value)
}

// 暴露方法给父组件
defineExpose({
  clearSearch: () => {
    searchKeyword.value = ''
  },
  resetFilter: () => {
    activeFilter.value = 'all'
  },
  resetSort: () => {
    currentSort.value = 'hot'
  },
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
  background: var(--bg-card, #ffffff);
}
</style>