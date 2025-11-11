<template>
  <div class="group-list-demo">
    <van-nav-bar title="群组列表" fixed />
    
    <div class="content">
      <sdkwork-group-list
        :groups="groups"
        :loading="loading"
        @group-click="handleGroupClick"
        @join="handleJoinGroup"
        @search="handleSearch"
        @refresh="handleRefresh"
        @load-more="handleLoadMore"
      />
    </div>

    <!-- 群组详情弹窗 -->
    <van-popup
      v-model:show="showGroupDetail"
      position="bottom"
      :style="{ height: '70%' }"
      round
    >
      <div v-if="selectedGroup" class="group-detail">
        <div class="detail-header">
          <img
            :src="selectedGroup.avatar || 'https://picsum.photos/seed/group1/200/200.jpg'"
            :alt="selectedGroup.name"
            class="detail-avatar"
          />
          <h3 class="detail-name">{{ selectedGroup.name }}</h3>
          <div class="detail-tags">
            <van-tag
              v-for="tag in selectedGroup.tags"
              :key="tag"
              type="primary"
              plain 
              class="detail-tag"
            >
              {{ tag }}
            </van-tag>
          </div>
        </div>
        
        <div class="detail-content">
          <van-cell-group>
            <van-cell title="群组描述">
              <template #default>
                <p class="detail-description">{{ selectedGroup.description }}</p>
              </template>
            </van-cell>
            
            <van-cell title="成员数量" :value="`${selectedGroup.memberCount}人`" />
            
            <van-cell title="群组类型" :value="getGroupTypeText(selectedGroup.type)" />
            
            <van-cell title="入群价格">
              <template #default>
                <span v-if="selectedGroup.price === 0" class="price-free">免费</span>
                <span v-else class="price-paid">¥{{ selectedGroup.price }}</span>
              </template>
            </van-cell>
          </van-cell-group>
          
          <div class="detail-actions">
            <van-button
              type="primary"
              size="large"
              round
              block
              :loading="joining"
              @click="handleJoinFromDetail"
            >
              {{ selectedGroup.isJoined ? '已加入' : (selectedGroup.price > 0 ? '付费加入' : '免费加入') }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import SdkworkGroupList from '@/components/sdkwork-group-list/sdkwork-group-list.vue'
import type { Group } from '@/components/sdkwork-group-list/types'

// 响应式数据
const groups = ref<Group[]>([])
const loading = ref(false)
const showGroupDetail = ref(false)
const selectedGroup = ref<Group | null>(null)
const joining = ref(false)

// 模拟群组数据
const mockGroups: Group[] = [
  {
    id: '1',
    name: '前端技术交流群',
    description: '分享前端技术、讨论最新前端框架、解决技术难题、共同进步的技术交流群组。欢迎各位前端爱好者加入！',
    avatar: 'https://picsum.photos/seed/frontend/200/200.jpg',
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
  },
  {
    id: '2',
    name: '设计师创意工坊',
    description: 'UI/UX设计师聚集地，分享设计经验、展示作品、获取反馈、寻找灵感。',
    avatar: 'https://picsum.photos/seed/design/200/200.jpg',
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
    description: '产品思维碰撞、需求分析、用户研究、产品规划讨论，助力产品能力提升。',
    avatar: 'https://picsum.photos/seed/pm/200/200.jpg',
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
    description: 'Java技术分享、架构设计、性能优化、面试经验交流，打造高质量Java开发者社区。',
    avatar: 'https://picsum.photos/seed/java/200/200.jpg',
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
  {
    id: '5',
    name: '投资理财交流群',
    description: '投资理念分享、市场分析、风险控制、财富管理，共同探索财富增长之路。',
    avatar: 'https://picsum.photos/seed/invest/200/200.jpg',
    tags: ['投资', '理财', '股票', '基金'],
    memberCount: 5678,
    messageCount: 185430,
    price: 0,
    isVerified: true,
    isHot: true,
    isJoined: true,
    type: 'public',
    createdAt: '2021-12-05',
  },
  {
    id: '6',
    name: '摄影爱好者社群',
    description: '摄影技巧分享、作品点评、器材讨论、后期处理交流，记录美好瞬间。',
    avatar: 'https://picsum.photos/seed/photo/200/200.jpg',
    tags: ['摄影', '后期', '器材'],
    memberCount: 876,
    messageCount: 21560,
    price: 9.9,
    type: 'public',
    createdAt: '2022-04-15',
  },
  {
    id: '7',
    name: 'AI人工智能探讨',
    description: '人工智能技术前沿、机器学习、深度学习、大模型应用讨论，探索AI未来。',
    avatar: 'https://picsum.photos/seed/ai/200/200.jpg',
    tags: ['AI', '机器学习', '深度学习'],
    memberCount: 2345,
    messageCount: 78920,
    price: 39.9,
    isOfficial: true,
    isVerified: true,
    isHot: true,
    type: 'official',
    createdAt: '2022-06-01',
  },
  {
    id: '8',
    name: '创业交流圈',
    description: '创业经验分享、资源对接、投资人交流、商业模式探讨，助力创业者成长。',
    avatar: 'https://picsum.photos/seed/startup/200/200.jpg',
    tags: ['创业', '资源', '投资'],
    memberCount: 1567,
    messageCount: 45320,
    price: 0,
    isVerified: true,
    type: 'public',
    createdAt: '2022-03-08',
  },
]

// 处理群组点击
const handleGroupClick = (group: Group) => {
  selectedGroup.value = group
  showGroupDetail.value = true
}

// 处理加入群组
const handleJoinGroup = (group: Group) => {
  if (group.isJoined) {
    showToast('您已加入该群组')
    return
  }

  if (group.price > 0) {
    showConfirmDialog({
      title: '付费入群',
      message: `加入"${group.name}"需要支付 ¥${group.price}，是否确认？`,
    })
      .then(() => {
        // 模拟支付
        group.joining = true
        
        setTimeout(() => {
          group.joining = false
          group.isJoined = true
          showToast('支付成功，已加入群组')
        }, 1500)
      })
      .catch(() => {
        // 取消支付
      })
  } else {
    // 免费加入
    showToast('已加入群组')
    group.isJoined = true
  }
}

// 处理搜索
const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  
  // 这里可以根据关键词调用API获取搜索结果
  loading.value = true
  
  setTimeout(() => {
    if (keyword) {
      // 模拟搜索结果
      const filteredGroups = mockGroups.filter(group =>
        group.name.includes(keyword) ||
        group.description.includes(keyword) ||
        (group.tags && group.tags.some(tag => tag.includes(keyword)))
      )
      groups.value = filteredGroups
    } else {
      groups.value = [...mockGroups]
    }
    loading.value = false
  }, 500)
}

// 处理刷新
const handleRefresh = () => {
  console.log('刷新列表')
  
  // 模拟刷新
  setTimeout(() => {
    groups.value = [...mockGroups]
    showToast('刷新成功')
  }, 1000)
}

// 处理加载更多
const handleLoadMore = () => {
  console.log('加载更多')
  
  // 模拟加载更多
  setTimeout(() => {
    // 这里可以追加新的群组数据
    showToast('没有更多群组了')
  }, 1000)
}

// 处理从详情页加入群组
const handleJoinFromDetail = () => {
  if (!selectedGroup.value) return
  
  joining.value = true
  
  setTimeout(() => {
    joining.value = false
    if (selectedGroup.value) {
      selectedGroup.value.isJoined = true
      
      // 更新列表中的群组状态
      const groupIndex = groups.value.findIndex(g => g.id === selectedGroup.value?.id)
      if (groupIndex !== -1) {
        groups.value[groupIndex].isJoined = true
      }
      
      showToast('成功加入群组')
      showGroupDetail.value = false
    }
  }, 1000)
}

// 获取群组类型文本
const getGroupTypeText = (type?: string) => {
  const typeMap: Record<string, string> = {
    public: '公开群',
    private: '私密群',
    official: '官方群',
  }
  return typeMap[type || 'public'] || '公开群'
}

// 初始化数据
onMounted(() => {
  loading.value = true
  
  setTimeout(() => {
    groups.value = [...mockGroups]
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.group-list-demo {
  background: var(--bg-page, #f7f8fa);
  min-height: 100vh;
  padding-top: 46px; /* 导航栏高度 */
}

.content {
  padding: 0;
}

/* 群组详情弹窗样式 */
.group-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--border-color, #ebedf0);
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 12px;
}

.detail-name {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #323233);
}

.detail-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-tag {
  margin: 0;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
}

.detail-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary, #969799);
}

.price-free {
  color: var(--color-success, #07c160);
  font-weight: 600;
}

.price-paid {
  color: var(--color-danger, #ee0a24);
  font-weight: 600;
}

.detail-actions {
  padding: 16px;
  margin-top: auto;
}
</style>