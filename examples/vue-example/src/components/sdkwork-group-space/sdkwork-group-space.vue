<template>
  <div class="sdkwork-group-space" :class="themeClass">
    <!-- 头部信息 -->
    <GroupHeader
      :group="group"
      @back="handleBack"
    />
    
    <!-- 主要内容区 -->
    <div class="content-container">
      <!-- 标签页 -->
      <van-tabs
        v-model:active="activeTab"
        @change="handleTabChange"
        sticky
        offset-top="0"
        animated
        swipeable
        background="var(--bg-card, #ffffff)"
        color="var(--color-primary, #1989fa)"
        line-height="3px"
      >
        <!-- 群动态 -->
        <van-tab name="feeds" title="群动态">
          <GroupFeedsList
            :feeds="feeds"
            :loading="feedsLoading"
            :has-more="feedsHasMore"
            @publish="handlePublishFeed"
            @like="handleLikeFeed"
            @comment="handleCommentFeed"
            @share="handleShareFeed"
            @load-more="handleLoadMoreFeeds"
          />
        </van-tab>
        
        <!-- 群资源 -->
        <van-tab name="resources" title="群资源">
          <GroupResourceList
            :resources="resources"
            :loading="resourcesLoading"
            :has-more="resourcesHasMore"
            :is-group-admin="isGroupAdmin"
            @upload="handleUploadResource"
            @download="handleDownloadResource"
            @view="handleViewResource"
            @edit="handleEditResource"
            @delete="handleDeleteResource"
            @load-more="handleLoadMoreResources"
            @filter-change="handleResourceFilterChange"
          />
        </van-tab>
        
        <!-- 群成员 -->
        <van-tab name="members" title="群成员">
          <GroupMembersList
            :members="members"
            :loading="membersLoading"
            :has-more="membersHasMore"
            @member-click="handleMemberClick"
            @send-message="handleSendMessage"
            @add-friend="handleAddFriend"
            @load-more="handleLoadMoreMembers"
            @search="handleSearchMembers"
          />
        </van-tab>
        
        <!-- 群设置 -->
        <van-tab v-if="showSettingsTab" name="settings" title="群设置">
          <div class="settings-container">
            <van-cell-group inset>
              <van-cell title="群通知" is-link @click="handleGroupNotification" />
              <van-cell title="免打扰" is-link @click="handleDoNotDisturb" />
              <van-cell title="置顶聊天" is-link @click="handleStickToTop" />
              <van-cell title="群二维码" is-link @click="handleShowQRCode" />
            </van-cell-group>
            
            <van-cell-group inset>
              <van-cell title="清空聊天记录" is-link @click="handleClearChatHistory" />
              <van-cell title="举报群组" is-link @click="handleReportGroup" />
            </van-cell-group>
            
            <div v-if="isGroupAdmin" class="admin-actions">
              <van-cell-group inset>
                <van-cell title="群管理" is-link @click="handleGroupManagement" />
                <van-cell title="成员管理" is-link @click="handleMemberManagement" />
              </van-cell-group>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    
    <!-- 底部操作区 -->
    <GroupBottom
      :group="group"
      :joining="joining"
      @back="handleBack"
      @join="handleJoinGroup"
      @enter="handleEnterGroup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'

// 导入子组件
import {
  GroupHeader,
  GroupBottom,
  GroupFeedsList,
  GroupResourceList,
  GroupMembersList
} from './components'

// 定义类型
interface Group {
  id: string
  name: string
  avatar?: string
  coverImage?: string
  description?: string
  tags?: string[]
  memberCount: number
  maxMembers?: number
  messageCount: number
  price: number
  isOfficial?: boolean
  isVerified?: boolean
  isHot?: boolean
  isJoined?: boolean
  type?: string
  createdAt?: string
}

interface Feed {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  images: string[]
  isPinned: boolean
  isLiked: boolean
  likeCount: number
  commentCount: number
  createdAt: string
}

interface Resource {
  id: string
  title: string
  description: string
  type: 'image' | 'video' | 'doc' | 'audio' | 'other'
  size: number
  url: string
  thumbnailUrl?: string
  authorId: string
  authorName: string
  tags: string[]
  isMine: boolean
  downloadCount: number
  createdAt: string
}

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
  groupId?: string | number
  group?: Group
}

const props = withDefaults(defineProps<Props>(), {
  groupId: undefined,
  group: undefined
})

// 事件定义
interface Emits {
  (e: 'back'): void
  (e: 'enter-group', group: Group): void
}

const emit = defineEmits<Emits>()

// 路由
const router = useRouter()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 当前标签页
const activeTab = ref('feeds')

// 群组数据
const group = ref<Group | undefined>(props.group)
const joining = ref(false)

// 动态数据
const feeds = ref<Feed[]>([])
const feedsLoading = ref(false)
const feedsHasMore = ref(true)

// 资源数据
const resources = ref<Resource[]>([])
const resourcesLoading = ref(false)
const resourcesHasMore = ref(true)

// 成员数据
const members = ref<Member[]>([])
const membersLoading = ref(false)
const membersHasMore = ref(true)

// 计算属性
const isGroupAdmin = computed(() => {
  // 实际项目中应根据当前用户角色判断
  return group.value?.isJoined || false
})

const showSettingsTab = computed(() => {
  return group.value?.isJoined || false
})

// 模拟加载群组数据
const loadGroupData = async () => {
  if (group.value) return
  
  if (props.groupId) {
    // 模拟API请求获取群组数据
    const mockGroup: Group = {
      id: String(props.groupId),
      name: '前端技术交流群',
      description: '分享前端技术、讨论最新前端框架、解决技术难题、共同进步的技术交流群组。',
      avatar: 'https://picsum.photos/seed/frontend/200/200.jpg',
      coverImage: 'https://picsum.photos/seed/frontend-cover/800/300.jpg',
      tags: ['前端', '技术', '交流'],
      memberCount: 3586,
      maxMembers: 5000,
      messageCount: 128560,
      price: 0,
      isOfficial: true,
      isVerified: true,
      isHot: true,
      isJoined: true,
      type: 'official',
      createdAt: '2022-01-15'
    }
    
    group.value = mockGroup
  }
}

// 模拟加载动态数据
const loadFeeds = async (refresh = false) => {
  if (feedsLoading.value) return
  
  feedsLoading.value = true
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟动态数据
    const mockFeeds: Feed[] = [
      {
        id: '1',
        userId: 'user1',
        userName: '张三',
        userAvatar: 'https://picsum.photos/seed/user1/200/200.jpg',
        content: '今天遇到了一个CSS布局问题，最后用Grid解决了，真的是太强大了！',
        images: ['https://picsum.photos/seed/css1/400/300.jpg'],
        isPinned: true,
        isLiked: false,
        likeCount: 23,
        commentCount: 5,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        userId: 'user2',
        userName: '李四',
        userAvatar: 'https://picsum.photos/seed/user2/200/200.jpg',
        content: 'Vue3和React18哪个更好？我最近在做一个新项目，有点纠结，大家有什么建议吗？',
        images: [],
        isPinned: false,
        isLiked: true,
        likeCount: 18,
        commentCount: 32,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    if (refresh) {
      feeds.value = mockFeeds
    } else {
      feeds.value = [...feeds.value, ...mockFeeds]
    }
    
    // 模拟分页，实际项目中应该根据API返回确定是否还有更多数据
    feedsHasMore.value = feeds.value.length < 20
  } finally {
    feedsLoading.value = false
  }
}

// 模拟加载资源数据
const loadResources = async (refresh = false) => {
  if (resourcesLoading.value) return
  
  resourcesLoading.value = true
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟资源数据
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Vue3实战教程',
        description: '从零开始学习Vue3，包含Composition API、响应式系统等核心概念',
        type: 'doc',
        size: 15728640, // 15MB
        url: 'https://example.com/vue3-tutorial.pdf',
        authorId: 'user1',
        authorName: '张三',
        tags: ['教程', 'Vue3'],
        isMine: false,
        downloadCount: 235,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'React Hooks详解',
        description: '深入解析React Hooks的实现原理和最佳实践',
        type: 'video',
        size: 52428800, // 50MB
        url: 'https://example.com/react-hooks.mp4',
        thumbnailUrl: 'https://picsum.photos/seed/react-hooks/320/180.jpg',
        authorId: 'user2',
        authorName: '李四',
        tags: ['视频', 'React'],
        isMine: true,
        downloadCount: 156,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    if (refresh) {
      resources.value = mockResources
    } else {
      resources.value = [...resources.value, ...mockResources]
    }
    
    // 模拟分页
    resourcesHasMore.value = resources.value.length < 20
  } finally {
    resourcesLoading.value = false
  }
}

// 模拟加载成员数据
const loadMembers = async (refresh = false) => {
  if (membersLoading.value) return
  
  membersLoading.value = true
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟成员数据
    const mockMembers: Member[] = [
      {
        id: 'user1',
        name: '张三',
        avatar: 'https://picsum.photos/seed/user1/200/200.jpg',
        signature: '热爱前端，专注于Vue和React技术栈',
        role: 'admin',
        isActive: true,
        isFriend: true,
        joinTime: '2022-02-15',
        messageCount: 542
      },
      {
        id: 'user2',
        name: '李四',
        avatar: 'https://picsum.photos/seed/user2/200/200.jpg',
        signature: '前端工程师，爱技术，爱生活',
        role: 'member',
        isActive: true,
        isFriend: false,
        joinTime: '2022-03-20',
        messageCount: 326
      },
      {
        id: 'user3',
        name: '王五',
        avatar: 'https://picsum.photos/seed/user3/200/200.jpg',
        signature: 'CSS高手，精通各种布局技巧',
        role: 'member',
        isActive: false,
        isFriend: false,
        joinTime: '2022-05-10',
        messageCount: 187
      }
    ]
    
    if (refresh) {
      members.value = mockMembers
    } else {
      members.value = [...members.value, ...mockMembers]
    }
    
    // 模拟分页
    membersHasMore.value = members.value.length < 100
  } finally {
    membersLoading.value = false
  }
}

// 标签页切换
const handleTabChange = (name: string) => {
  console.log('切换到标签:', name)
  
  // 根据标签加载相应数据
  if (name === 'feeds' && feeds.value.length === 0) {
    loadFeeds(true)
  } else if (name === 'resources' && resources.value.length === 0) {
    loadResources(true)
  } else if (name === 'members' && members.value.length === 0) {
    loadMembers(true)
  }
}

// 处理返回
const handleBack = () => {
  emit('back')
  router.back()
}

// 处理加入群组
const handleJoinGroup = (groupData: Group) => {
  if (groupData.isJoined) {
    showToast('您已加入该群组')
    return
  }

  if (groupData.price > 0) {
    showConfirmDialog({
      title: '付费入群',
      message: `加入"${groupData.name}"需要支付 ¥${groupData.price}，是否确认？`,
    })
      .then(() => {
        // 模拟支付
        showToast('支付成功，已加入群组')
        if (group.value) {
          group.value.isJoined = true
        }
      })
      .catch(() => {
        // 取消支付
      })
  } else {
    // 免费加入
    showToast('已加入群组')
    if (group.value) {
      group.value.isJoined = true
    }
  }
}

// 处理进入群组
const handleEnterGroup = (groupData: Group) => {
  emit('enter-group', groupData)
  showToast('进入群聊')
}

// 处理发布动态
const handlePublishFeed = () => {
  showToast('发布动态')
}

// 处理点赞动态
const handleLikeFeed = (feed: Feed) => {
  const index = feeds.value.findIndex(item => item.id === feed.id)
  if (index !== -1) {
    feeds.value[index].isLiked = !feeds.value[index].isLiked
    feeds.value[index].likeCount += feeds.value[index].isLiked ? 1 : -1
  }
}

// 处理评论动态
const handleCommentFeed = (feed: Feed) => {
  showToast(`评论动态: ${feed.content.substring(0, 20)}...`)
}

// 处理分享动态
const handleShareFeed = (feed: Feed) => {
  showToast(`分享动态: ${feed.content.substring(0, 20)}...`)
}

// 处理加载更多动态
const handleLoadMoreFeeds = () => {
  loadFeeds()
}

// 处理上传资源
const handleUploadResource = () => {
  showToast('上传资源')
}

// 处理下载资源
const handleDownloadResource = (resource: Resource) => {
  showToast(`下载资源: ${resource.title}`)
}

// 处理查看资源
const handleViewResource = (resource: Resource) => {
  showToast(`查看资源: ${resource.title}`)
}

// 处理编辑资源
const handleEditResource = (resource: Resource) => {
  showToast(`编辑资源: ${resource.title}`)
}

// 处理删除资源
const handleDeleteResource = (resource: Resource) => {
  showConfirmDialog({
    title: '删除资源',
    message: `确定要删除资源"${resource.title}"吗？`,
  })
    .then(() => {
      // 模拟删除
      const index = resources.value.findIndex(item => item.id === resource.id)
      if (index !== -1) {
        resources.value.splice(index, 1)
        showToast('删除成功')
      }
    })
    .catch(() => {
      // 取消删除
    })
}

// 处理资源筛选变化
const handleResourceFilterChange = (filters: { type: string, sort: string }) => {
  console.log('资源筛选:', filters)
  // 实际项目中应该根据筛选条件重新加载数据
}

// 处理加载更多资源
const handleLoadMoreResources = () => {
  loadResources()
}

// 处理成员点击
const handleMemberClick = (member: Member) => {
  showToast(`查看成员: ${member.name}`)
}

// 处理发消息
const handleSendMessage = (member: Member) => {
  showToast(`给 ${member.name} 发送消息`)
}

// 处理添加好友
const handleAddFriend = (member: Member) => {
  showToast(`添加 ${member.name} 为好友`)
}

// 处理加载更多成员
const handleLoadMoreMembers = () => {
  loadMembers()
}

// 处理搜索成员
const handleSearchMembers = (keyword: string) => {
  console.log('搜索成员:', keyword)
  // 实际项目中应该根据搜索条件重新加载数据
}

// 处理群通知
const handleGroupNotification = () => {
  showToast('群通知设置')
}

// 处理免打扰
const handleDoNotDisturb = () => {
  showToast('免打扰设置')
}

// 处理置顶聊天
const handleStickToTop = () => {
  showToast('置顶聊天设置')
}

// 处理显示二维码
const handleShowQRCode = () => {
  showToast('显示群二维码')
}

// 处理清空聊天记录
const handleClearChatHistory = () => {
  showConfirmDialog({
    title: '清空聊天记录',
    message: '确定要清空所有聊天记录吗？此操作不可恢复。',
  })
    .then(() => {
      showToast('聊天记录已清空')
    })
    .catch(() => {
      // 取消清空
    })
}

// 处理举报群组
const handleReportGroup = () => {
  showToast('举报群组')
}

// 处理群管理
const handleGroupManagement = () => {
  showToast('群管理')
}

// 处理成员管理
const handleMemberManagement = () => {
  showToast('成员管理')
}

// 组件挂载时加载数据
onMounted(() => {
  loadGroupData()
  loadFeeds(true)
})
</script>

<style scoped>
.sdkwork-group-space {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-page, #f7f8fa);
  position: relative;
  overflow: scroll;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-page, #f7f8fa);
}

.settings-container {
  padding: 16px;
  background: var(--bg-page, #f7f8fa);
}

.admin-actions {
  margin-top: 16px;
}

/* 群空间头部样式优化 */
.sdkwork-group-space :deep(.van-tabs) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sdkwork-group-space :deep(.van-tabs__content) {
  flex: 1;
  overflow: auto;
}

.sdkwork-group-space :deep(.van-tabs__nav) {
  background: var(--bg-card, #ffffff);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.sdkwork-group-space :deep(.van-tab__panel) {
  padding: 0;
  min-height: 300px;
}

/* 统一主题样式 */
.theme-light {
  --bg-page: #f7f8fa;
  --bg-card: #ffffff;
  --bg-gray: #f5f5f5;
  --bg-secondary: #fafafa;
  --text-primary: #323233;
  --text-secondary: #969799;
  --text-light: #999999;
  --color-primary: #1989fa;
  --color-primary-light: #ecf5ff;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #ebedf0;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

.theme-dark {
  --bg-page: #0a0a0a;
  --bg-card: #1a1a1a;
  --bg-gray: #2a2a2a;
  --bg-secondary: #222222;
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --text-light: #969799;
  --color-primary: #1989fa;
  --color-primary-light: #1a3c5c;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #3a3a3a;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}
</style>