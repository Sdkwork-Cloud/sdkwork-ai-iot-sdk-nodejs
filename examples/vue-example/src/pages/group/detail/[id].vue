<template>
  <div class="group-detail-page"> 
    <div class="content">
      <sdkwork-group-detail
        :group-id="groupId"
        :group="group"
        :loading="loading"
        :error="error"
        @join="handleJoinGroup"
        @enter="handleEnterGroup"
        @retry="loadGroupData"
      >
        <!-- 额外内容插槽 -->
        <template #extra="{ group }">
          <!-- 群组成员预览 -->
          <div v-if="members.length > 0" class="members-preview-section">
            <van-cell-group inset title="群组成员" :border="false">
              <div class="members-container">
                <div
                  v-for="(member, index) in members.slice(0, 8)"
                  :key="member.id"
                  class="member-avatar"
                >
                  <img
                    :src="member.avatar || defaultAvatar"
                    :alt="member.name"
                    @error="handleMemberImageError"
                  />
                  <span class="member-name">{{ member.name }}</span>
                </div>
                
                <div
                  v-if="group.memberCount > 8"
                  class="member-more"
                  @click="viewAllMembers"
                >
                  <van-icon name="ellipsis" />
                  <span>{{ group.memberCount - 8 }}+</span>
                </div>
              </div>
            </van-cell-group>
          </div>
          
          <!-- 群组公告 -->
          <div v-if="groupAnnouncement" class="announcement-section">
            <van-cell-group inset title="群组公告">
              <div class="announcement-content">
                <p>{{ groupAnnouncement }}</p>
              </div>
            </van-cell-group>
          </div>
          
          <!-- 相似群组推荐 -->
          <div v-if="recommendedGroups.length > 0" class="recommend-section">
            <van-cell-group inset title="推荐群组" :border="false">
              <div class="recommend-list">
                <div
                  v-for="recGroup in recommendedGroups"
                  :key="recGroup.id"
                  class="recommend-item"
                  @click="goToGroupDetail(recGroup.id)"
                >
                  <img
                    :src="recGroup.avatar || defaultAvatar"
                    :alt="recGroup.name"
                    class="recommend-avatar"
                    @error="handleRecommendImageError"
                  />
                  <div class="recommend-info">
                    <div class="recommend-name">{{ recGroup.name }}</div>
                    <div class="recommend-desc">{{ recGroup.description }}</div>
                    <div class="recommend-meta">
                      <span class="recommend-members">{{ recGroup.memberCount }}人</span>
                      <span v-if="recGroup.price > 0" class="recommend-price">¥{{ recGroup.price }}</span>
                      <span v-else class="recommend-free">免费</span>
                    </div>
                  </div>
                  <van-button
                    size="small"
                    type="primary"
                    :plain="!recGroup.isHot"
                    @click.stop="handleJoinRecommendedGroup(recGroup)"
                  >
                    {{ recGroup.isHot ? '热门' : '加入' }}
                  </van-button>
                </div>
              </div>
            </van-cell-group>
          </div>
        </template>
      </sdkwork-group-detail>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import SdkworkGroupDetail from '@/components/sdkwork-group-detail/sdkwork-group-detail.vue'
import type { Group } from '@/components/sdkwork-group-item/types'
definePage({
    meta: {
        title: '详情'
    }
})
// 路由
const route = useRoute()
const router = useRouter()

// 从路由参数获取群组ID
const routeParams = route.params as any
const groupId = Array.isArray(routeParams.id) ? routeParams.id[0] : (routeParams.id as string)

// 响应式数据
const group = ref<Group | undefined>(undefined)
const loading = ref(false)
const error = ref(false)
const members = ref<any[]>([])
const groupAnnouncement = ref('')
const recommendedGroups = ref<Group[]>([])
const defaultAvatar = 'https://picsum.photos/seed/user-default/100/100.jpg'

// 模拟加载群组数据
const loadGroupData = async () => {
  if (!groupId) return
  
  loading.value = true
  error.value = false
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟获取群组详情
    const mockGroupData: Group = {
      id: groupId,
      name: '前端技术交流群',
      description: '分享前端技术、讨论最新前端框架、解决技术难题、共同进步的技术交流群组。欢迎各位前端爱好者加入！在这里你可以学到最新的前端技术，解决工作中遇到的技术难题，结识志同道合的前端开发者。',
      avatar: 'https://picsum.photos/seed/frontend-group/200/200.jpg',
      tags: ['前端', '技术', '交流', 'React', 'Vue'],
      memberCount: 3586,
      maxMembers: 5000,
      messageCount: 128560,
      price: 0,
      isOfficial: true,
      isVerified: true,
      isHot: true,
      type: 'official',
      createdAt: '2022-01-15',
    }
    
    // 模拟群组公告
    groupAnnouncement.value = '本周六晚8点将举办Vue 3.4新特性分享会，欢迎大家参加！另外，群里正在征集优秀的开源项目，有兴趣的同学可以联系管理员。'
    
    // 模拟成员数据
    members.value = [
      { id: '1', name: '张三', avatar: 'https://picsum.photos/seed/user1/100/100.jpg' },
      { id: '2', name: '李四', avatar: 'https://picsum.photos/seed/user2/100/100.jpg' },
      { id: '3', name: '王五', avatar: 'https://picsum.photos/seed/user3/100/100.jpg' },
      { id: '4', name: '赵六', avatar: 'https://picsum.photos/seed/user4/100/100.jpg' },
      { id: '5', name: '前端小王', avatar: 'https://picsum.photos/seed/user5/100/100.jpg' },
      { id: '6', name: 'React专家', avatar: 'https://picsum.photos/seed/user6/100/100.jpg' },
      { id: '7', name: 'Vue开发者', avatar: 'https://picsum.photos/seed/user7/100/100.jpg' },
      { id: '8', name: 'JS大神', avatar: 'https://picsum.photos/seed/user8/100/100.jpg' },
    ]
    
    // 模拟推荐群组
    recommendedGroups.value = [
      {
        id: '2',
        name: '设计师创意工坊',
        description: 'UI/UX设计师聚集地，分享设计经验、展示作品、获取反馈。',
        avatar: 'https://picsum.photos/seed/design-group/200/200.jpg',
        tags: ['设计', 'UI/UX', '创意'],
        memberCount: 1923,
        messageCount: 64230,
        price: 19.9,
        originalPrice: 39.9,
        isVerified: true,
        isHot: true,
        type: 'public',
        createdAt: '2022-03-20',
      },
      {
        id: '3',
        name: '产品经理交流圈',
        description: '产品思维碰撞、需求分析、用户研究、产品规划讨论。',
        avatar: 'https://picsum.photos/seed/pm-group/200/200.jpg',
        tags: ['产品', '需求', '规划'],
        memberCount: 1245,
        messageCount: 38920,
        price: 0,
        isVerified: true,
        type: 'public',
        createdAt: '2022-05-10',
      },
      {
        id: '4',
        name: 'Java开发精英群',
        description: 'Java技术分享、架构设计、性能优化、面试经验交流。',
        avatar: 'https://picsum.photos/seed/java-group/200/200.jpg',
        tags: ['Java', '后端', '架构'],
        memberCount: 2890,
        maxMembers: 3000,
        messageCount: 98760,
        price: 29.9,
        isVerified: true,
        isHot: true,
        type: 'public',
        createdAt: '2022-02-28',
      },
    ]
    
    group.value = mockGroupData
  } catch (err) {
    console.error('加载群组数据失败:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// 处理返回按钮点击
const onClickLeft = () => {
  router.back()
}

// 处理加入群组
const handleJoinGroup = (groupData: Group) => {
  // 更新群组状态
  if (group.value) {
    group.value.isJoined = true
  }
  
  showSuccessToast('成功加入群组')
}

// 处理进入群组
const handleEnterGroup = (groupData: Group) => {
  showToast('进入群组聊天')
  // 这里可以跳转到群组聊天页面
  // router.push(`/group/chat/${groupData.id}`)
}

// 处理成员头像加载错误
const handleMemberImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar
}

// 处理推荐群组头像加载错误
const handleRecommendImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultAvatar
}

// 查看所有成员
const viewAllMembers = () => {
  showToast('查看所有成员')
  // 这里可以跳转到成员列表页面
  // router.push(`/group/${groupId}/members`)
}

// 跳转到推荐群组详情
const goToGroupDetail = (id: string | number) => {
  router.push(`/group/detail/${id}`)
}

// 处理加入推荐群组
const handleJoinRecommendedGroup = (groupData: Group) => {
  if (groupData.price > 0) {
    showToast(`加入"${groupData.name}"需要支付 ¥${groupData.price}`)
  } else {
    showToast(`已申请加入"${groupData.name}"`)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadGroupData()
})
</script>

<style scoped>
.group-detail-page {
  background: var(--bg-page, #f7f8fa);
  min-height: 100vh; 
}

.content {
  padding: 0;
}

/* 成员预览区域 */
.members-preview-section {
  margin-bottom: 8px;
}

.members-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
}

.member-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
}

.member-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 4px;
}

.member-name {
  font-size: 10px;
  color: var(--text-secondary, #969799);
  text-align: center;
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg-color, #f7f8fa);
  color: var(--text-secondary, #969799);
  cursor: pointer;
}

.member-more span {
  font-size: 10px;
  margin-top: 2px;
}

/* 公告区域 */
.announcement-section {
  margin-bottom: 8px;
}

.announcement-content {
  padding: 16px;
}

.announcement-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary, #969799);
}

/* 推荐群组区域 */
.recommend-section {
  margin-bottom: 8px;
}

.recommend-list {
  padding: 8px 0;
}

.recommend-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
}

.recommend-item:active {
  background-color: var(--active-color, #f2f3f5);
}

.recommend-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
}

.recommend-info {
  flex: 1;
  min-width: 0;
}

.recommend-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary, #323233);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-desc {
  font-size: 12px;
  color: var(--text-secondary, #969799);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary, #969799);
}

.recommend-members {
  margin-right: 8px;
}

.recommend-price {
  color: var(--color-danger, #ee0a24);
}

.recommend-free {
  color: var(--color-success, #07c160);
}
</style>