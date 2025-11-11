<template>
  <div class="search-section">
    <sdkwork-search-bar
      v-model="searchKeyword"
      placeholder="请输入搜索关键词"
      @search="handleSearch"
      @clear="handleClearSearch"
      @input="handleSearchInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  searchable: boolean
}

interface Emits {
  (e: 'search', keyword: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchKeyword = ref('')

// 防抖搜索函数
const debouncedSearch = (() => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (keyword: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      handleSearch(keyword)
    }, 300)
  }
})()

// 搜索处理
const handleSearch = (keyword?: string) => {
  const searchValue = keyword !== undefined ? keyword : searchKeyword.value
  emit('search', searchValue)
}

// 搜索输入处理
const handleSearchInput = () => {
  debouncedSearch(searchKeyword.value)
}

// 清空搜索
const handleClearSearch = () => {
  searchKeyword.value = ''
  handleSearch('')
}
</script>

<style scoped lang="scss">
.search-section {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

/* Darkmode 支持 */
.search-section.dark-mode {
  background: #1a1a1a;
  border-bottom: 1px solid #333;
}

/* 自动检测系统深色模式 */
@media (prefers-color-scheme: dark) {
  .search-section:not(.light-mode) {
    background: #1a1a1a;
    border-bottom: 1px solid #333;
  }
}
</style>