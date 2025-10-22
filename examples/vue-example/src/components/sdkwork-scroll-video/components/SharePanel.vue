<template>
  <div class="share-panel">
    <!-- 头部 -->
    <div class="share-header">
      <span class="share-title">分享到</span>
      <van-icon name="cross" size="20" @click="$emit('close')" />
    </div>
    
    <!-- 分享平台 -->
    <div class="share-platforms">
      <div class="platform-item" @click="shareToWechat">
        <div class="platform-icon wechat">
          <van-icon name="wechat" size="32" color="#fff" />
        </div>
        <span class="platform-name">微信</span>
      </div>
      
      <div class="platform-item" @click="shareToMoment">
        <div class="platform-icon moment">
          <van-icon name="friends-o" size="32" color="#fff" />
        </div>
        <span class="platform-name">朋友圈</span>
      </div>
      
      <div class="platform-item" @click="shareToQQ">
        <div class="platform-icon qq">
          <van-icon name="qq" size="32" color="#fff" />
        </div>
        <span class="platform-name">QQ</span>
      </div>
      
      <div class="platform-item" @click="shareToWeibo">
        <div class="platform-icon weibo">
          <van-icon name="weibo" size="32" color="#fff" />
        </div>
        <span class="platform-name">微博</span>
      </div>
      
      <div class="platform-item" @click="copyLink">
        <div class="platform-icon link">
          <van-icon name="link-o" size="32" color="#fff" />
        </div>
        <span class="platform-name">复制链接</span>
      </div>
      
      <div class="platform-item" @click="saveVideo">
        <div class="platform-icon download">
          <van-icon name="down" size="32" color="#fff" />
        </div>
        <span class="platform-name">保存视频</span>
      </div>
    </div>
    
    <!-- 分享统计 -->
    <div class="share-stats">
      <div class="stat-item">
        <span class="stat-label">分享数</span>
        <span class="stat-value">{{ video.shareCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast, showDialog } from 'vant'

interface Props {
  video: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 分享方法
const shareToWechat = () => {
  showToast('分享到微信')
  // 实际实现中调用微信分享API
  setTimeout(() => emit('close'), 1000)
}

const shareToMoment = () => {
  showToast('分享到朋友圈')
  // 实际实现中调用朋友圈分享API
  setTimeout(() => emit('close'), 1000)
}

const shareToQQ = () => {
  showToast('分享到QQ')
  // 实际实现中调用QQ分享API
  setTimeout(() => emit('close'), 1000)
}

const shareToWeibo = () => {
  showToast('分享到微博')
  // 实际实现中调用微博分享API
  setTimeout(() => emit('close'), 1000)
}

const copyLink = async () => {
  try {
    const videoLink = `https://example.com/video/${props.video.id}`
    await navigator.clipboard.writeText(videoLink)
    showToast('链接已复制')
    setTimeout(() => emit('close'), 1000)
  } catch (error) {
    showToast('复制失败')
  }
}

const saveVideo = () => {
  showDialog({
    title: '保存视频',
    message: '是否保存视频到相册？',
    showCancelButton: true
  }).then(() => {
    showToast('视频保存成功')
    // 实际实现中调用下载API
    setTimeout(() => emit('close'), 1000)
  })
}
</script>

<style scoped lang="scss">
.share-panel {
  padding: 20px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  
  .share-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    
    .share-title {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }
    
    .van-icon {
      color: #999;
      cursor: pointer;
    }
  }
  
  .share-platforms {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 24px;
    
    .platform-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      .platform-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.wechat {
          background: #07c160;
        }
        
        &.moment {
          background: #07c160;
        }
        
        &.qq {
          background: #12b7f5;
        }
        
        &.weibo {
          background: #e6162d;
        }
        
        &.link {
          background: #666;
        }
        
        &.download {
          background: #ff6b35;
        }
      }
      
      .platform-name {
        font-size: 14px;
        color: #333;
      }
    }
  }
  
  .share-stats {
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    
    .stat-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      .stat-label {
        font-size: 14px;
        color: #666;
      }
      
      .stat-value {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
    }
  }
}
</style>