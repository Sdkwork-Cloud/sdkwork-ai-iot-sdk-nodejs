<template>
  <sdkwork-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: height, zIndex: 10000 }"
    round
    closeable
    :close-on-click-overlay="false"
  >
    <div class="comments-list-popup">
      <!-- 头部标题栏 -->
      <div class="popup-header">
        <div class="header-content">
          <h3 class="popup-title">{{ title }}</h3>
          <!-- 右上角关闭图标 -->
          <van-icon name="cross" class="close-icon" @click="handleClose" />
        </div>
      </div>

      <!-- 评论列表内容 -->
      <div class="popup-content">
        <SdkworkCommentsList
          :api="api"
          :params="params"
          :item-key="itemKey"
          :item-title-field="itemTitleField"
          :item-description-field="itemDescriptionField"
          :selectable="selectable"
          :deletable="deletable"
          :searchable="searchable"
          @select="handleSelect"
          @delete="handleDelete"
          @search="handleSearch"
        >
          <!-- 默认插槽，使用组件内部的 CommentsListItem -->
        </SdkworkCommentsList>
      </div>


    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import SdkworkCommentsList from '../sdkwork-comments-list/sdkwork-comments-list.vue'

// Props 定义
interface Props {
  modelValue?: boolean
  title?: string
  height?: string

  api?: (params: Pageable) => Promise<Page<any>>
  params?: Record<string, any>
  itemKey?: string
  itemTitleField?: string
  itemDescriptionField?: string
  selectable?: boolean
  deletable?: boolean
  searchable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '评论列表',
  height: '70vh',

  params: () => ({}),
  itemKey: 'id',
  itemTitleField: 'content',
  itemDescriptionField: 'user.username',
  selectable: false,
  deletable: false,
  searchable: false
})

// Emits 定义
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', comment: any): void
  (e: 'close'): void
  (e: 'select', comment: any): void
  (e: 'delete', comment: any): void
  (e: 'search', keyword: string): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const visible = ref(props.modelValue)
const selectedComment = ref<any | null>(null)

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听 visible 变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 处理确认选择

// 处理关闭
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 处理选择评论
const handleSelect = (comment: any) => {
  selectedComment.value = comment
  emit('select', comment)
}

// 处理删除评论
const handleDelete = (comment: any) => {
  emit('delete', comment)
}

// 处理搜索
const handleSearch = (keyword: string) => {
  emit('search', keyword)
}
</script>

<style scoped>
.comments-list-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

.popup-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.close-icon {
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-icon:hover {
  color: #666;
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  height: calc(100% - 120px); /* Account for header and footer */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .popup-header {
    padding: 12px;
  }
  
  .popup-title {
    font-size: 16px;
  }
}
</style>