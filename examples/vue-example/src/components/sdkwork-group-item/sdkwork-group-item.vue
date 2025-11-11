<template>
  <div class="sdkwork-group-item-content" :class="themeClass" @click="handleClick">
    <!-- 群组头像 -->
    <div class="group-avatar">
      <img
        v-if="group.avatar"
        :src="group.avatar"
        :alt="group.name"
        class="avatar-image"
      />
      <van-icon
        v-else
        name="friends-o"
        size="24"
        class="avatar-placeholder"
      />
      <div
        v-if="group.isVerified"
        class="verified-badge"
      >
        <van-icon name="success" size="12" />
      </div>
    </div>

    <!-- 群组信息 -->
    <div class="group-info">
      <!-- 群组名称 -->
      <div class="group-name-row">
        <h3 class="group-name">{{ group.name }}</h3>
        <van-tag
          v-if="group.type === 'official'"
          type="primary"
          size="medium"
          round
        >
          官方
        </van-tag>
      </div>

      <!-- 群组描述 -->
      <p class="group-description">{{ group.description }}</p>

      <!-- 群组标签 -->
      <div v-if="group.tags && group.tags.length" class="group-tags">
        <van-tag
          v-for="tag in group.tags.slice(0, 3)"
          :key="tag"
          plain
          size="medium"
          class="tag-item"
        >
          {{ tag }}
        </van-tag>
        <span
          v-if="group.tags.length > 3"
          class="more-tags"
        >
          +{{ group.tags.length - 3 }}
        </span>
      </div>

      <!-- 群组统计信息 -->
      <div class="group-stats">
        <div class="stat-item">
          <van-icon name="friends" size="14" />
          <span>{{ formatNumber(group.memberCount) }}人</span>
        </div>
        <div v-if="group.maxMembers" class="stat-item">
          <span>/{{ group.maxMembers }}</span>
        </div>
        <div class="stat-item">
          <van-icon name="chat-o" size="14" />
          <span>{{ formatNumber(group.messageCount) }}</span>
        </div>
        <div v-if="group.isHot" class="stat-item hot">
          <van-icon name="fire-o" size="14" />
          <span>热门</span>
        </div>
      </div>
    </div>

    <!-- 价格区域 -->
    <div class="price-section">
      <div v-if="group.price === 0" class="price free">
        <van-tag type="success"   round>
          免费
        </van-tag>
      </div>
      <div v-else class="price paid">
        <div class="price-amount">
          <span class="currency">¥</span>
          <span class="value">{{ group.price }}</span>
        </div>
        <div v-if="group.originalPrice && group.originalPrice > group.price" class="original-price">
          <span class="currency">¥</span>
          <span class="value">{{ group.originalPrice }}</span>
        </div>
      </div>

      <!-- 加入按钮 -->
      <van-button
        v-if="showJoinButton"
        :type="group.isJoined ? 'default' : 'primary'"
        size="small"
        round
        :loading="group.joining"
        @click.stop="handleJoinGroup"
        class="join-button"
      >
        {{ group.isJoined ? '已加入' : (group.price > 0 ? '付费加入' : '免费加入') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/hooks/theme/useTheme'
import type { Group } from '../sdkwork-group-list/types'

// Props定义
interface Props {
  group: Group
  showJoinButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showJoinButton: true,
})

// 事件定义
interface Emits {
  (e: 'click', group: Group): void
  (e: 'join', group: Group): void
}

const emit = defineEmits<Emits>()

// 主题hook
const { currentTheme } = useTheme()

// 计算主题类
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 处理点击事件
const handleClick = () => {
  emit('click', props.group)
}

// 处理加入群组
const handleJoinGroup = () => {
  emit('join', props.group)
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<style scoped>
.sdkwork-group-item-content {
  display: flex;
  padding: 16px;
  margin-bottom: 8px;
  background: var(--bg-card, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  align-items: flex-start;
  min-height: 112px;
}

/* 主题样式 */
.theme-light {
  --bg-card: #ffffff;
  --bg-gray: #f5f5f5;
  --text-primary: #323233;
  --text-secondary: #969799;
  --text-light: #999999;
  --color-primary: #1989fa;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --border-color: #ebedf0;
}

.theme-dark {
  --bg-card: #1a1a1a;
  --bg-gray: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --text-light: #969799;
  --color-primary: #1989fa;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --border-color: #3a3a3a;
}

.sdkwork-group-item-content:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 群组头像 */
.group-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  margin-right: 12px;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gray, #f5f5f5);
  color: var(--text-light, #999);
  border-radius: 8px;
}

.verified-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: var(--color-primary, #1989fa);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid var(--bg-card, #ffffff);
}

/* 群组信息 */
.group-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.group-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.group-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #323233);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-description {
  margin: 0 0 6px;
  font-size: 13px;
  color: var(--text-secondary, #969799);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tag-item {
  font-size: 12px;
}

.more-tags {
  font-size: 12px;
  color: var(--text-light, #999);
  align-self: center;
}

.group-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-secondary, #969799);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.stat-item.hot {
  color: var(--color-danger, #ee0a24);
}

/* 价格区域 */
.price-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  flex-shrink: 0;
  width: 100px;
  text-align: center;
}

.price.free,
.price.paid {
  margin-bottom: 6px;
  width: 100%;
  text-align: center;
}

.price-amount {
  display: flex;
  align-items: baseline;
  color: var(--color-danger, #ee0a24);
  font-weight: 600;
  justify-content: center;
}

.currency {
  font-size: 12px;
  margin-right: 1px;
}

.value {
  font-size: 16px;
}

.original-price {
  display: flex;
  align-items: baseline;
  color: var(--text-light, #999);
  text-decoration: line-through;
  font-size: 12px;
  margin-top: 2px;
  justify-content: center;
}

.original-price .value {
  font-size: 12px;
}

.join-button {
  min-width: 70px;
  font-size: 12px;
  padding: 4px 8px;
  height: auto;
}
</style>