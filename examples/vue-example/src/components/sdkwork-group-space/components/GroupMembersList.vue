<template>
  <div class="group-members-list" :class="themeClass">
    <!-- 搜索栏 -->
    <div class="search-container">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索成员"
        @search="handleSearch"
        @clear="handleClearSearch"
        shape="round"
        background="transparent"
      />
    </div>

    <!-- 成员角色标签 -->
    <div class="role-tabs">
      <van-tabs
        v-model:active="activeRole"
        @change="handleRoleChange"
        shrink
        background="transparent"
        color="var(--color-primary, #1989fa)"
        line-height="3px"
      >
        <van-tab title="全部" name="all" />
        <van-tab title="管理员" name="admin" />
        <van-tab title="活跃成员" name="active" />
        <van-tab title="新成员" name="new" />
      </van-tabs>
    </div>

    <!-- 成员列表 -->
    <div class="members-container">
      <!-- 空状态 -->
      <div v-if="filteredMembers.length === 0" class="empty-members">
        <van-empty
          image="default"
          :description="searchKeyword ? '未找到相关成员' : '暂无成员'"
        />
      </div>

      <!-- 成员列表 -->
      <div v-else class="members-list">
        <div 
          v-for="member in filteredMembers" 
          :key="member.id"
          class="member-item"
          @click="handleMemberClick(member)"
        >
          <!-- 成员头像 -->
          <img 
            :src="member.avatar || defaultAvatar" 
            :alt="member.name"
            class="member-avatar"
          />

          <!-- 成员信息 -->
          <div class="member-info">
            <div class="member-basic">
              <div class="member-name">{{ member.name }}</div>
              <div v-if="member.role === 'owner'" class="member-role owner">群主</div>
              <div v-else-if="member.role === 'admin'" class="member-role admin">管理员</div>
              <div v-else-if="member.isActive" class="member-role active">活跃</div>
            </div>
            <div v-if="member.signature" class="member-signature">{{ member.signature }}</div>
            <div class="member-meta">
              <span class="join-time">加入时间: {{ formatDate(member.joinTime) }}</span>
              <span v-if="member.messageCount" class="message-count">发言 {{ member.messageCount }} 条</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="member-actions">
            <van-button
              v-if="member.isFriend"
              type="default"
              size="small"
              round
              plain
              @click.stop="handleSendMessage(member)"
              class="action-button"
            >
              发消息
            </van-button>
            <van-button
              v-else
              type="primary"
              size="small"
              round
              plain
              @click.stop="handleAddFriend(member)"
              class="action-button"
            >
              加好友
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <van-button
        type="default"
        size="small"
        round
        :loading="loading"
        @click="handleLoadMore"
      >
        {{ loading ? '加载中...' : '加载更多' }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { showToast } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'

// 成员类型定义
interface Member {
  id: string
  name: string
  avatar: string
  signature?: string
  role: 'owner' | 'admin' | 'member'
  isActive: boolean
  isFriend: boolean
  joinTime: string
  messageCount: number
}

// Props定义
interface Props {
  members?: Member[]
  loading?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  members: () => [],
  loading: false,
  hasMore: true
})

// 事件定义
interface Emits {
  (e: 'member-click', member: Member): void
  (e: 'send-message', member: Member): void
  (e: 'add-friend', member: Member): void
  (e: 'load-more'): void
  (e: 'search', keyword: string): void
}

const emit = defineEmits<Emits>()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 默认头像
const defaultAvatar = 'https://picsum.photos/seed/default-avatar/200/200.jpg'

// 搜索关键词
const searchKeyword = ref('')
const activeRole = ref('all')

// 计算过滤后的成员列表
const filteredMembers = computed(() => {
  let result = [...(props.members || [])]
  
  // 按角色过滤
  if (activeRole.value === 'admin') {
    result = result.filter(member => member.role === 'admin' || member.role === 'owner')
  } else if (activeRole.value === 'active') {
    result = result.filter(member => member.isActive)
  } else if (activeRole.value === 'new') {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    result = result.filter(member => new Date(member.joinTime) > oneWeekAgo)
  }
  
  // 按搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(member => 
      member.name.toLowerCase().includes(keyword) || 
      (member.signature && member.signature.toLowerCase().includes(keyword))
    )
  }
  
  return result
})

// 处理搜索
const handleSearch = () => {
  emit('search', searchKeyword.value)
}

// 处理清除搜索
const handleClearSearch = () => {
  searchKeyword.value = ''
  emit('search', '')
}

// 处理角色切换
const handleRoleChange = (name: string) => {
  activeRole.value = name
}

// 处理成员点击
const handleMemberClick = (member: Member) => {
  emit('member-click', member)
}

// 处理发消息
const handleSendMessage = (member: Member) => {
  emit('send-message', member)
}

// 处理添加好友
const handleAddFriend = (member: Member) => {
  emit('add-friend', member)
}

// 处理加载更多
const handleLoadMore = () => {
  emit('load-more')
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 24 * 60 * 60 * 1000) {
    return '今天'
  } else if (diff < 2 * 24 * 60 * 60 * 1000) {
    return '昨天'
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else if (diff < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (7 * 24 * 60 * 60 * 1000))}周前`
  } else {
    return date.toLocaleDateString()
  }
}
</script>

<style scoped>
.group-members-list { 
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-container {
  margin-bottom: 16px;
}

.role-tabs {
  margin-bottom: 16px;
}

.members-container {
  flex: 1;
  overflow-y: auto;
}

.empty-members {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  background: var(--bg-card, #ffffff);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.member-item:active {
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 16px;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-basic {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.member-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary, #323233);
  margin-right: 8px;
}

.member-role {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.member-role.owner {
  background: #ff6b35;
  color: white;
}

.member-role.admin {
  background: #1989fa;
  color: white;
}

.member-role.active {
  background: #07c160;
  color: white;
}

.member-signature {
  font-size: 13px;
  color: var(--text-secondary, #969799);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-meta {
  font-size: 12px;
  color: var(--text-light, #999999);
}

.join-time {
  margin-right: 12px;
}

.member-actions {
  display: flex;
  align-items: center;
}

.action-button {
  min-width: 70px;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  margin-top: 16px;
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
</style>