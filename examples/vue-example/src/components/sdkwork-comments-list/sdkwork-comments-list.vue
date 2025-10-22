<template>
  <div class="comments-container">
    <!-- 评论列表 -->
    <SdkworkApiList
      ref="apiListRef"
      :api="fetchComments"
      :params="queryParams"
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
      <template #default="{ item }">
        <CommentsListItem 
          :comment="item" 
          @like="handleLike"
          @reply="handleReply"
        />
      </template>
    </SdkworkApiList>

    <!-- 回复输入框 -->
    <div v-if="replyingTo" class="reply-input-container">
      <van-field
        v-model="replyContent"
        :placeholder="`回复 @${replyingTo.user.username}`"
        rows="1"
        autosize
        type="textarea"
      />
      <div class="reply-actions">
        <van-button size="small" @click="cancelReply">取消</van-button>
        <van-button 
          type="primary" 
          size="small" 
          :disabled="!replyContent.trim()"
          @click="submitReply"
        >
          发送
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { CommentsService } from '@/services/src/service/comments'
import CommentsListItem from './components/comments-list-item.vue'
import SdkworkApiList from '../sdkwork-api-list/sdkwork-api-list.vue'
import { Pageable } from 'sdkwork-sdk-api-typescript'

interface Props {
  /** 查询参数 */
  queryParams?: Record<string, any>
  /** 是否可选择 */
  selectable?: boolean
  /** 是否可删除 */
  deletable?: boolean
  /** 是否可搜索 */
  searchable?: boolean
  /** 列表项唯一键字段名 */
  itemKey?: string
  /** 列表项标题字段名 */
  itemTitleField?: string
  /** 列表项描述字段名 */
  itemDescriptionField?: string
}

const props = withDefaults(defineProps<Props>(), {
  queryParams: () => ({}),
  selectable: false,
  deletable: false,
  searchable: false,
  itemKey: 'id',
  itemTitleField: 'content',
  itemDescriptionField: 'user.username'
})

const emit = defineEmits<{
  /** 选择评论事件 */
  (e: 'select', comment: any): void
  /** 删除评论事件 */
  (e: 'delete', comment: any): void
  /** 搜索事件 */
  (e: 'search', keyword: string): void
  /** 点赞事件 */
  (e: 'like', comment: any): void
  /** 回复事件 */
  (e: 'reply', comment: any, content: string): void
}>()

const commentsService = new CommentsService()
const apiListRef = ref<any>(null)
const replyingTo = ref<any>(null)
const replyContent = ref('')
const searchKeyword = ref('')

// 构建查询参数
const queryParams = computed(() => ({
  ...props.queryParams,
  keyword: searchKeyword.value
}))

// 获取评论列表
const fetchComments = async (params: Pageable) => {
  try {
    const response = await commentsService.listByPage({}, params)
    return response
  } catch (error) {
    showToast('获取评论失败')
    throw error
  }
}

// 处理选择
const handleSelect = (comment: any) => {
  emit('select', comment)
}

// 处理删除
const handleDelete = async (comment: any) => {
  try {
    await commentsService.delete(comment.id)
    showToast('删除成功')
    apiListRef.value?.refresh()
  } catch (error) {
    showToast('删除失败')
  }
  emit('delete', comment)
}

// 处理搜索
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  emit('search', keyword)
}

// 处理点赞
const handleLike = async (comment: any) => {
  try {
    if (comment.liked) {
      await commentsService.unlike(comment.id)
      comment.likeCount--
    } else {
      await commentsService.like(comment.id)
      comment.likeCount++
    }
    comment.liked = !comment.liked
    emit('like', comment)
  } catch (error) {
    showToast('操作失败')
  }
}

// 处理回复
const handleReply = (comment: any) => {
  replyingTo.value = comment
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = async () => {
  if (!replyingTo.value || !replyContent.value.trim()) return

  try {
    await commentsService.reply(
      {
        userId:replyingTo.value.user.id, 
        content: replyContent.value.trim()
      },replyingTo.value.id
    )
    showToast('回复成功')
    emit('reply', replyingTo.value, replyContent.value.trim())
    apiListRef.value?.refresh()
    cancelReply()
  } catch (error) {
    showToast('回复失败')
  }
}
</script>

<style scoped lang="scss">
.comments-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reply-input-container {
  padding: 12px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  
  .reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }
}
</style>