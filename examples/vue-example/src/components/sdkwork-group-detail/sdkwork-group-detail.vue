<template>
  <div class="sdkwork-group-detail" :class="themeClass">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    
    <!-- 群组详情内容 -->
    <div v-else-if="group" class="detail-container">
      <!-- 头部信息 -->
      <div class="header-section">
        <div class="avatar-container">
          <img
            :src="group.avatar || defaultAvatar"
            :alt="group.name"
            class="group-avatar"
            @error="handleImageError"
          />
          <div v-if="group.isOfficial" class="official-badge">官方</div>
          <div v-if="group.isVerified" class="verified-badge">
            <van-icon name="success" />
          </div>
        </div>
        
        <div class="basic-info">
          <h1 class="group-name">{{ group.name }}</h1>
          
          <div class="group-tags">
            <van-tag
              v-for="tag in group.tags"
              :key="tag"
              type="primary"
              plain 
              class="group-tag"
            >
              {{ tag }}
            </van-tag>
          </div>
          
          <div class="stats-info">
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(group.memberCount) }}</span>
              <span class="stat-label">成员</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-value">{{ formatNumber(group.messageCount) }}</span>
              <span class="stat-label">消息</span>
            </div>
            <div v-if="group.maxMembers" class="stat-divider"></div>
            <div v-if="group.maxMembers" class="stat-item">
              <span class="stat-value">{{ group.maxMembers }}</span>
              <span class="stat-label">上限</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 描述信息 -->
      <div v-if="group.description" class="description-section">
        <h3 class="section-title">群组简介</h3>
        <p class="description-text">{{ group.description }}</p>
      </div>
      
      <!-- 群组信息 -->
      <van-cell-group class="info-section" inset>
        <van-cell title="群组类型" :value="getGroupTypeText(group.type)" />
        <van-cell title="创建时间" :value="formatDate(group.createdAt)" />
        <van-cell v-if="(group.price ?? 0) > 0" title="入群价格">
          <template #value>
            <div class="price-info">
              <span v-if="group.originalPrice && group.originalPrice > group.price" class="original-price">
                ¥{{ group.originalPrice }}
              </span>
              <span class="current-price">¥{{ group.price }}</span>
            </div>
          </template>
        </van-cell>
        <van-cell v-else title="入群价格" value="免费" />
        <van-cell v-if="group.isHot" title="群组状态">
          <template #value>
            <van-tag type="danger">热门</van-tag>
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 底部操作区 -->
      <div class="action-section">
        <van-button
          v-if="!group.isJoined"
          type="primary"
          size="large"
          round
          :loading="joining"
          @click="handleJoinGroup"
          class="join-button"
        >
          {{ (group.price ?? 0) > 0 ? `付费加入 (¥${group.price})` : '免费加入' }}
        </van-button>
        <van-button
          v-else
          size="large"
          round
          @click="handleEnterGroup"
          class="join-button"
        >
          进入群组
        </van-button>
      </div>
      
      <!-- 额外插槽 -->
      <slot name="extra" :group="group" />
    </div>
    
    <!-- 错误状态 -->
    <div v-else class="error-container">
      <van-empty
        image="error"
        description="群组信息加载失败"
      >
        <van-button type="primary" size="small" @click="handleRetry">
          重试
        </van-button>
      </van-empty>
    </div>
    
    <!-- 二维码弹窗 -->
    <van-popup
      v-model:show="showQRPopup"
      position="center"
      :style="{ width: '90%', maxWidth: '380px' }"
      round
      safe-area-inset-bottom
    >
      <div class="qr-popup-content">
        <div v-if="showJoinSuccess" class="join-success-animation">
          <van-icon name="success" size="48" color="#07c160" />
          <h3 class="success-title">{{ joinSuccessTitle }}</h3>
          <p class="success-subtitle">{{ joinSuccessSubtitle }}</p>
        </div>
        
        <h3 v-else class="qr-title">扫码加入群组</h3>
        
        <div class="qr-section">
          <sdkwork-qr-code
            :title="group?.name"
            :description="group?.description"
            :avatar="group?.avatar"
            :value="generateQRContent()"
            :tip-text="qrTipText"
            :show-actions="true"
            :allow-save="true"
            :allow-share="true"
            :allow-copy-link="true"
            :blur="!group?.isJoined && (group?.price ?? 0) > 0"
            @save="handleSaveQR"
            @share="handleShareQR"
            @copy-link="handleCopyLink"
          />
        </div>
        
        <div v-if="!group?.isJoined && (group?.price ?? 0) > 0" class="qr-blur-tip">
          <van-notice-bar
            type="warning"
            text="付费群组需先加入后才能查看完整二维码"
            background="#fff7e8"
            color="#ed6a0c"
          />
          <van-button
            type="primary"
            size="large"
            round
            block
            @click="handleJoinGroup"
            class="blur-join-button"
          >
            {{ (group?.price ?? 0) > 0 ? `付费加入 (¥${group?.price ?? 0})` : '免费加入' }}
          </van-button>
        </div>
        
        <div class="qr-popup-actions">
          <van-button v-if="!showJoinSuccess" type="default" size="small" @click="showQRPopup = false">关闭</van-button>
          <van-button v-else type="primary" size="small" @click="handleQRComplete">完成</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import SdkworkQrCode from '../sdkwork-qr-code/sdkwork-qr-code.vue'
import type { Group } from '../sdkwork-group-item/types'

// Props定义
interface Props {
  groupId?: string | number
  group?: Group
  loading?: boolean
  error?: boolean
  showJoinButton?: boolean
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: false,
  showJoinButton: true,
  themeMode: 'auto'
})

// 事件定义
interface Emits {
  (e: 'join', group: Group): void
  (e: 'enter', group: Group): void
  (e: 'retry'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const joining = ref(false)
const showQRPopup = ref(false)
const showJoinSuccess = ref(false)
const defaultAvatar = 'https://picsum.photos/seed/group-default/200/200.jpg'

// 计算属性
const themeClass = computed(() => {
  return `theme-${props.themeMode}`
})

const qrTipText = computed(() => {
  if (!props.group) return '扫描二维码加入群组'
  if (props.group.isJoined) return '扫描二维码进入群聊'
  if ((props.group.price ?? 0) > 0) return '扫码付费加入群组'
  return '扫码免费加入群组'
})

const joinSuccessTitle = computed(() => {
  if (!props.group) return '加入成功'
  return (props.group.price ?? 0) > 0 ? '支付成功，已加入群组' : '已加入群组'
})

const joinSuccessSubtitle = computed(() => {
  if (!props.group) return '扫码进入群聊'
  return `扫描下方二维码加入「${props.group.name}」`
})

// 格式化数字显示
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (date?: string | Date): string => {
  if (!date) return '未知'
  
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取群组类型文本
const getGroupTypeText = (type?: string): string => {
  const typeMap: Record<string, string> = {
    public: '公开群',
    private: '私密群',
    official: '官方群',
  }
  return typeMap[type || 'public'] || '公开群'
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar
}

// 处理加入群组
const handleJoinGroup = async () => {
  if (!props.group) return
  
  if (props.group.isJoined) {
    showToast('您已加入该群组')
    return
  }
  
  // 如果是付费群组，显示确认对话框
  if ((props.group.price ?? 0) > 0) {
    try {
      await showConfirmDialog({
        title: '付费入群',
        message: `加入"${props.group.name}"需要支付 ¥${props.group.price}，是否确认？`,
      })
      
      // 确认后执行支付逻辑
      executeJoinGroup()
    } catch {
      // 用户取消支付
    }
  } else {
    // 免费群组直接加入
    executeJoinGroup()
  }
}

// 执行加入群组逻辑
const executeJoinGroup = () => {
  if (!props.group) return
  
  joining.value = true
  
  // 模拟支付/加入过程
  setTimeout(() => {
    joining.value = false
    
    // 显示成功动画和二维码
    showJoinSuccess.value = true
    showQRPopup.value = true
    
    // 更新群组状态为已加入
    const updatedGroup = { ...props.group, isJoined: true } as Group
    emit('join', updatedGroup)
    
    // 1.5秒后隐藏成功动画，显示二维码
    setTimeout(() => {
      showJoinSuccess.value = false
    }, 1500)
  }, 1500)
}

// 处理进入群组
const handleEnterGroup = () => {
  if (!props.group) return
  emit('enter', props.group)
}

// 处理重试
const handleRetry = () => {
  emit('retry')
}

// 显示二维码
const showQRCode = () => {
  showQRPopup.value = true
}

// 生成二维码内容
const generateQRContent = () => {
  if (!props.group) return ''
  
  // 这里可以根据实际需求生成二维码内容
  // 例如：群组链接、邀请码等
  return `https://example.com/group/invite/${props.group.id}?source=qr`
}

// 保存二维码
const handleSaveQR = (qrCodeUrl: string) => {
  showToast('二维码已保存')
}

// 分享二维码
const handleShareQR = (qrCodeUrl: string) => {
  showToast('分享功能待实现')
}

// 复制群组链接
const handleCopyLink = () => {
  if (!props.group) return
  
  const groupLink = `https://example.com/group/${props.group.id}`
  navigator.clipboard.writeText(groupLink).then(() => {
    showToast('群组链接已复制')
  }).catch(() => {
    showToast('复制失败，请手动复制')
  })
}

// 处理二维码弹窗完成
const handleQRComplete = () => {
  showQRPopup.value = false
  showToast('欢迎加入群组')
}

// 暴露给父组件的方法
defineExpose({
  retry: handleRetry
})
</script>

<style scoped>
.sdkwork-group-detail {
  padding-bottom: 80px; /* 为底部按钮预留空间 */
  min-height: 100vh;
  background-color: var(--bg-page, #f7f8fa);
}

/* 主题样式 */
.theme-light {
  --text-primary: #323233;
  --text-secondary: #969799;
  --bg-card: #ffffff;
  --bg-page: #f7f8fa;
  --border-color: #ebedf0;
}

.theme-dark {
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --bg-card: #1a1a1a;
  --bg-page: #0a0a0a;
  --border-color: #3a3a3a;
}

.theme-auto {
  --text-primary: #323233;
  --text-secondary: #969799;
  --bg-card: #ffffff;
  --bg-page: #f7f8fa;
  --border-color: #ebedf0;
}

@media (prefers-color-scheme: dark) {
  .theme-auto {
    --text-primary: #ffffff;
    --text-secondary: #c8c9cc;
    --bg-card: #1a1a1a;
    --bg-page: #0a0a0a;
    --border-color: #3a3a3a;
  }
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

/* 错误状态 */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

/* 详情容器 */
.detail-container {
  padding-bottom: 20px;
}

/* 头部信息 */
.header-section {
  position: relative;
  padding: 24px 16px;
  background: var(--bg-card);
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.group-avatar {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  background-color: var(--border-color);
}

.official-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #ff6034, #ee0a24);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  transform: scale(0.8);
}

.verified-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--color-success, #07c160);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--bg-card);
}

.basic-info {
  color: var(--text-primary);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.group-name {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
  justify-content: center;
}

.group-tag {
  margin: 0;
}

.stats-info {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-color);
  margin: 0 16px;
}

/* 描述信息 */
.description-section {
  background: var(--bg-card);
  padding: 16px;
  margin-bottom: 8px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.description-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 信息区域 */
.info-section {
  margin-bottom: 8px;
}

/* 价格信息 */
.price-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.original-price {
  font-size: 12px;
  color: var(--text-secondary);
  text-decoration: line-through;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-danger, #ee0a24);
}

/* 操作区域 */
.action-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.join-button {
  width: 80%;
  max-width: 300px;
}

/* 二维码弹窗样式 */
.qr-popup-content {
  padding: 20px;
  text-align: center;
}

.qr-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.qr-section {
  margin: 16px 0;
}

.qr-blur-tip {
  margin-top: 16px;
}

.blur-join-button {
  margin-top: 12px;
}

.qr-popup-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

/* 加入成功动画样式 */
.join-success-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  animation: fadeInScale 0.6s ease-out;
}

.success-title {
  margin: 16px 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.success-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.5;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>