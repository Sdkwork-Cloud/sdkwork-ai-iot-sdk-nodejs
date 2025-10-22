<template>
  <div class="right-actions">
    <!-- 用户头像 -->
    <div class="user-avatar" @click="handleUserClick(video.author)">
      <van-image
        :src="video.author.avatar"
        width="48"
        height="48"
        radius="24"
        fit="cover"
      />
      <div class="follow-btn" @click.stop="handleFollow(video.author)">
        <van-icon 
          :name="video.author.followed ? 'friends-o' : 'add-o'" 
          :color="video.author.followed ? '#ff2442' : '#fff'"
        />
      </div>
    </div>
    
    <!-- 点赞 -->
    <div class="action-item" @click="handleLike(video)">
      <van-icon 
        :name="video.liked ? 'like' : 'like-o'" 
        :color="video.liked ? '#ff2442' : '#fff'" 
        size="32"
      />
      <span class="action-count">{{ formatCount(video.likeCount) }}</span>
    </div>
    
    <!-- 评论 -->
    <div class="action-item" @click="handleComment(video)">
      <van-icon name="chat-o" color="#fff" size="32" />
      <span class="action-count">{{ formatCount(video.commentCount) }}</span>
    </div>
    
    <!-- 做同款 -->
    <div class="action-item" @click="handleMakeSame(video)">
      <van-icon name="star-o" color="#fff" size="32" />
      <span class="action-count">{{ formatCount(video.makeSameCount) }}</span>
    </div>
    
    <!-- 分享 -->
    <div class="action-item" @click="handleShare(video)">
      <van-icon name="share-o" color="#fff" size="32" />
      <span class="action-count">{{ formatCount(video.shareCount) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { showToast } from 'vant'
import type { ScrollVideoItem, VideoAuthor } from '../types'

interface Props {
  video: ScrollVideoItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  like: [video: ScrollVideoItem]
  comment: [video: ScrollVideoItem]
  share: [video: ScrollVideoItem]
  follow: [author: VideoAuthor]
  userClick: [author: VideoAuthor]
}>()

const handleLike = async (video: ScrollVideoItem) => {
  try {
    video.liked = !video.liked
    video.likeCount += video.liked ? 1 : -1
    emit('like', video)
    showToast(video.liked ? '已点赞' : '已取消点赞')
  } catch (error) {
    video.liked = !video.liked
    video.likeCount += video.liked ? -1 : 1
    showToast('操作失败')
  }
}

const handleComment = (video: ScrollVideoItem) => {
  emit('comment', video)
}

const handleShare = (video: ScrollVideoItem) => {
  emit('share', video)
}

const handleFollow = async (author: VideoAuthor) => {
  try {
    author.followed = !author.followed
    emit('follow', author)
    showToast(author.followed ? '已关注' : '已取消关注')
  } catch (error) {
    author.followed = !author.followed
    showToast('操作失败')
  }
}

const handleMakeSame = (video: ScrollVideoItem) => {
  showToast('开始制作同款视频')
}

const handleUserClick = (author: VideoAuthor) => {
  emit('userClick', author)
}

const formatCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}
</script>

<style scoped lang="scss">
.right-actions {
  position: absolute;
  right: 16px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 60;
  
  /* 安全区域适配 */
  @supports(padding: max(0px)) {
    right: calc(16px + env(safe-area-inset-right, 0px));
    bottom: calc(120px + env(safe-area-inset-bottom, 0px));
  }
  
  .user-avatar {
    position: relative;
    
    .follow-btn {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      background: #ff2442;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .van-icon {
        font-size: 12px;
      }
    }
  }
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    
    .action-count {
      font-size: 12px;
      color: #fff;
      font-weight: 500;
    }
  }
}

@media (max-width: 768px) {
  .right-actions {
    right: 12px;
    bottom: 100px;
    gap: 20px;
    z-index: 2147483647 !important; /* iOS 最大z-index */
    transform: translateZ(0);
    
    /* 移动端安全区域适配 */
    @supports(padding: max(0px)) {
      right: calc(12px + env(safe-area-inset-right, 0px));
      bottom: calc(100px + env(safe-area-inset-bottom, 0px));
    }
    
    .action-item .van-icon {
      font-size: 28px;
    }
  }
}

/* iOS Safari 特殊修复 */
@supports (-webkit-touch-callout: none) {
  .right-actions {
    z-index: 2147483647 !important;
    -webkit-transform: translateZ(0);
  }
}

/* Android Chrome 特殊修复 */
@supports (-webkit-overflow-scrolling: touch) {
  .right-actions {
    z-index: 999999 !important;
    -webkit-transform: translateZ(0);
  }
}
</style>