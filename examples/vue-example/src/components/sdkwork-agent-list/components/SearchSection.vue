<template>
  <div class="search-section">
    <sdkwork-search-bar
      v-model="searchKeyword"
      placeholder="搜索智能体..."
      shape="round"
      background="#f7f8fa"
      @search="handleSearch"
      @clear="handleClear"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

// 属性定义
interface Props {
  searchable?: boolean
}

// 事件定义
interface Emits {
  (e: 'search', keyword: string): void
}

const props = withDefaults(defineProps<Props>(), {
  searchable: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const searchKeyword = ref('')

// 防抖搜索函数
let debounceTimer: any | null = null
const debouncedSearch = (keyword: string) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    emit('search', keyword)
  }, 300)
}

// 搜索处理
const handleSearch = (keyword: string) => {
  debouncedSearch(keyword)
}

// 清空搜索
const handleClear = () => {
  searchKeyword.value = ''
  debouncedSearch('')
}

// 输入处理
const handleInput = (value: string) => {
  if (value === '') {
    debouncedSearch('')
  }
}

// 监听搜索关键词变化
watch(searchKeyword, (newValue) => {
  if (newValue.trim() !== '') {
    debouncedSearch(newValue.trim())
  }
})

// 生命周期
onMounted(() => {
  // 组件挂载后初始化
})

// 暴露给父组件的方法
defineExpose({
  /** 获取搜索关键词 */
  getSearchKeyword: () => searchKeyword.value,
  /** 设置搜索关键词 */
  setSearchKeyword: (keyword: string) => {
    searchKeyword.value = keyword
  },
  /** 清空搜索 */
  clearSearch: () => {
    searchKeyword.value = ''
    debouncedSearch('')
  }
})
</script>

<style scoped lang="scss">
.search-section {
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;

  :deep(.sdkwork-search-bar) {
    padding: 0;
  }

  :deep(.sdkwork-search-bar__content) {
    background: #f7f8fa;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section {
    padding: 8px 12px;
  }
}

@media (min-width: 1024px) {
  .search-section {
    padding: 16px 24px;
  }
}
</style>