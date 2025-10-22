<template>
  <div class="comment-item">
    <!-- 用户头像 -->
    <div class="user-avatar">
      <van-image
        :src="comment.user?.avatar || defaultAvatar"
        width="40"
        height="40"
        radius="20"
        fit="cover"
      />
    </div>
    
    <!-- 评论内容 -->
    <div class="comment-content">
      <div class="user-info">
        <span class="username">{{ comment.user?.username || '匿名用户' }}</span>
        <span class="create-time">{{ formatTime(comment.createTime) }}</span>
      </div>
      
      <div class="comment-text">{{ comment.content }}</div>
      
      <div class="comment-actions">
        <div class="like-action" @click.stop="handleLike">
          <van-icon
            :name="comment.liked ? 'like' : 'like-o'"
            :color="comment.liked ? '#ff2442' : '#999'"
            size="14"
          />
          <span class="like-count">{{ comment.likeCount }}</span>
        </div>
        
        <span class="reply-btn" @click.stop="handleReply">回复</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'

const props = defineProps<{
  comment: any
}>()

const emit = defineEmits<{
  (e: 'like', comment: any): void
  (e: 'reply', comment: any): void
}>()

const defaultAvatar = 'https://via.placeholder.com/40'

const handleLike = () => {
  emit('like', props.comment)
}

const handleReply = () => {
  emit('reply', props.comment)
}

const formatTime = (timeStr: string): string => {
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  } else if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  } else if (diff < 2592000000) {
    return Math.floor(diff / 86400000) + '天前'
  } else {
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
  }
}
</script>

<style scoped lang="scss">
.comment-item {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f8f8f8;
  
  .user-avatar {
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .comment-content {
    flex: 1;
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      
      .username {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
      
      .create-time {
        font-size: 12px;
        color: #999;
      }
    }
    
    .comment-text {
      font-size: 14px;
      line-height: 1.4;
      color: #333;
      margin-bottom: 8px;
    }
    
    .comment-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .like-action {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        
        .like-count {
          font-size: 12px;
          color: #999;
        }
      }
      
      .reply-btn {
        font-size: 12px;
        color: #999;
        cursor: pointer;
      }
    }
  }
}
</style>